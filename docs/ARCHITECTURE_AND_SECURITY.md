# Architecture and security review

Baseline: `19d3f0cc9fc89122ece5b4cd4b0cf0bcb2acd006`, origin `https://github.com/SamKang5/ECONVERSE.git`. Source checkout was clean. Existing frontend/backend branch names had a `codex/` prefix; the requested exact `feat/econverse2-*` branches were created from local `main` in separate worktrees. No existing branches or working files were reset.

## Milestones

- M0: inspected repository, Git metadata, React/Vite frontend, Pages/D1 backend, all migrations, session authentication, lesson sources, tests, mascot assets and supplied design preview/brief. Established baseline typecheck, build and 67 backend assertions. Defined the [API contract](ECONVERSE2_API.md) before integration.
- M1: additive roles, current-session authorization, activation enforcement, last-active-admin database guards and offline explicit-owner bootstrap.
- M2: D1 content revisions, private owned drafts, optimistic edit locks, review rejection/feedback, atomic publish/unpublish, historical migration, public allowlists and server-authoritative quizzes/rewards.
- M3: real-data learner dashboard, library/filtering, player/outline/written content, quiz feedback, profile/history, responsive navigation and supplied genuine branding.
- M4: functional Studio, quiz editor, draft preview/review, Admin publication/users/activation/analytics/audit interfaces.
- M5: isolated migration rehearsal, actual local D1/Pages HTTP races, browser journeys, WCAG scans, responsive screenshots and independent code review with fixes and retests.

## Boundaries and controls

| Boundary / asset | Abuse case | Implemented control |
|---|---|---|
| Browser → authentication | Register as Admin; forge identity | Public roles ignored, server default learner, salted PBKDF2 passwords, random HttpOnly/SameSite session cookie, hash stored in D1 |
| Cookie session → privileged handler | Keep stale role or disabled account access | Current user role and activation resolved from D1 on each request; 401/403; staff navigation is only a UX aid |
| Cross-site request → mutation | Cookie-authenticated CSRF | Same Origin / same-origin fetch metadata, JSON content type, actual 256KiB body limit, standardized errors |
| Editor → draft / publication | Read another editor's draft; publish directly | Editor ownership for private drafts and previews, Admin-only publication/review/users/analytics/audit, private existence hidden with 404 |
| Concurrent writers → revision | Overwrite another edit or partially publish | Required `lockVersion`, conditional SQL update, per-mutation token guarding pointer/archive/audit side effects in the same batch |
| Learner → lesson/quiz | Read draft content or correct answers | Explicit learner field allowlists, published pointer + active state, answer keys held in revision JSON and historical DB rows only |
| Quiz submission → XP | Forge score, replay or race rewards | Server grading; request fingerprint for idempotency; unique learner/lesson reward claim; transactional attempt, XP ledger, totals and progress |
| Admin → account control | Remove the last active administrator | SQLite BEFORE UPDATE/DELETE guards, preserved through D1 rehearsal; authoritative 409 response |
| Staff changes → audit | Modify history or silently escalate | Append-only database audit triggers; role, content and bootstrap actions recorded atomically |
| Content → browser | Script injection / unsafe video hosts | React plain-text escaping; no injected rich HTML; bounded input validation; exact HTTPS YouTube host/ID allowlists; static CSP/security headers |
| Dependencies → build | Known vulnerable tooling | Compatible lockfile updates; patched Vite 6.4.5 and transitive dependencies; npm audit rerun |

Published revisions are immutable. Editors branch a new draft without changing the live pointer. Approval/publication changes the pointer and archives the previous live revision atomically. Old quiz attempts keep their revision and result snapshot; original quiz IDs and old progress remain intact. Historical incomplete video sources remain explicit rather than being replaced with unrelated videos.

The local D1 test environment contains only disposable review records. No production credentials, environment variables or external messaging services were used. No auth tokens are stored in localStorage. Private API responses use no-store caching. Production bootstrap SQL is generated but never automatically executed remotely.

## Review repairs

- Independent review reproduced an oversized-request hang caused by awaiting cancellation of one side of a cloned request stream. Cancellation is now non-blocking and a regression verifies prompt 413.
- Encoded historical revision IDs initially failed catchall handlers. Explicit path-segment decoding and a regression now permit privileged historical preview.
- Axe measured low contrast in secondary learner text. Colors were darkened within the supplied palette and scanned again.
- A management-tab background transition briefly paired white text with a pale background. Navigation now changes text/background together without that transition.
- On 401/403, management screens clear cached privileged state and refresh the current session.
- Final browser review reproduced resume/recent lessons using catalog order. Progress now includes persisted view timestamps, is ordered by recency, and the learner model chooses the latest unfinished lesson. Reopening completed content records the view while preserving completion and XP; API/model/browser regressions cover it.
- A deterministic SQL concurrency test exposed account PATCH replacing fields omitted by the caller, allowing one administrator's role or activation change to overwrite another's. Partial writes now preserve the database's current omitted values. Audit history reads prior state inside the transaction, failed last-admin changes roll audit back, and the DTO is read from persisted state. Both update orders are covered.

## Platform references

Atomic database operations use Cloudflare's documented [D1 transactional batch API](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch). Routing and global API request controls follow [Pages file routing](https://developers.cloudflare.com/pages/functions/routing/) and [Pages middleware](https://developers.cloudflare.com/pages/functions/middleware/). These were checked against official documentation during implementation.

## Owner-operated production work

Production backup/rehearsal, target-environment configuration, initial owner bootstrap, production migrations and deployment require separate owner action. This review establishes local correctness; it does not attest to an unmodified production environment, production traffic capacity, external-video availability on every network, or a penetration test. Authentication throttling is a persistent 30 attempts per 15 minutes per Cloudflare client IP. Edge-level abuse protection and operational monitoring should be configured by the owner for production traffic.
