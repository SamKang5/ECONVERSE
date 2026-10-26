# Independent security and regression review

Reviewed 24 October 2026 against the current combined integration working tree, independently of earlier readiness statements. Read-only source review; tests used in-memory SQLite. No persisted local/remote D1 changes, commits, pushes, merges or deployments.

## Findings

No validated P0/P1/P2 security finding identified in the reviewed changes. This is a scoped assessment of current code and executed checks, not proof that every vulnerability is absent.

## Reviewed surfaces

- `functions/lib/auth.ts`, `functions/lib/http.ts`, `functions/api/_middleware.ts`: current database role and activation checks, session expiry/revocation, cookie construction, same-origin mutations, actual request body limits, JSON validation and authentication throttling.
- `functions/api/admin/[[path]].ts`: administrative role gate, role/activation input handling, atomic prior-value audit records, last-admin protections, publication/rejection/unpublication CAS conditions and publish-pointer update guards.
- `functions/api/studio/[[path]].ts`, `functions/lib/content.ts`: private draft ownership and listing filters, public-only cloning for other editors, immutable live revisions, optimistic edits, submission validation and output allowlists.
- Quiz GET/submit, progress routes, courses and lesson detail: sanitized public questions/content, authoritative scoring, revision races, changed-payload replay conflicts, durable once-per-lesson rewards, atomic XP/progress updates and account isolation.
- Migrations 0003/0004/0005, bootstrap utility, migration authoring utility, local Wrangler wrapper and public headers: additive data preservation, legacy reward guards, trigger protections, one-time audited explicit-owner bootstrap, local-only migration wrapper, embed URL restrictions and static asset security policy.
- Client API/management services and lesson renderer: cookies remain HttpOnly; lesson/quiz text uses React escaping; embed origins derive from YouTube validation; old hardcoded answers are absent from the active App module path.
- Dependency manifest/lockfile and native package-manager audit.

## Executed verification

- `npm test`: PASS, 67 foundation assertions + 70 CMS/security assertions + migration rehearsal.
- Independent isolated edge harness: 15 assertions PASS. Covered extra answer keys, incomplete score/no reward, null/foreign origins, simultaneous duplicate-key replay with exactly one XP ledger entry, changed-answer key conflicts, publication disappearing immediately before grading transaction, no orphan attempt on stale revision, and existing result replay after unpublication.
- `npm audit --json`: PASS, zero vulnerabilities; metadata reported 162 total dependencies. First sandbox attempt could not resolve the registry; the approved read-only network retry completed successfully.

## Remaining verification suggestions

The parent browser review should continue exercising actual HTTP/D1 authorization transitions on an existing session, hostile-origin write rejection, editor-to-admin publication, and one completed learner quiz with reload/persisted XP. These tests complement the isolated/static assessment. Production configuration, remote data, distributed load, alternate browsers and an active penetration test were not examined by this reviewer.
