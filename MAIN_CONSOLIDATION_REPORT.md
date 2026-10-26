# ECONVERSE 2.0 — Main consolidation report

Prepared and verified **25 October 2026, Asia/Saigon**.

**Result: VERIFIED CONSOLIDATED MAIN SNAPSHOT — ready for one owner-controlled commit in the prepared standalone clone.** The original root main checkout remains untouched and is **not** consolidated. Direct transfer into that root is blocked by 20 overlapping uncommitted modifications.

Prepared main working copy:

```text
C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/frontend/.qa-review/main-consolidation-20261025/main
```

This directory is a **separate local Git repository already on `main`**, not an integration branch, detached preview or registered linked worktree. Its HEAD is the original baseline `19d3f0cc9fc89122ece5b4cd4b0cf0bcb2acd006`. All 304 unique reviewed pending paths were added to that clean baseline as working changes. Its origin is `https://github.com/SamKang5/ECONVERSE.git`. No new commit, push, history merge, branch switch in an existing checkout, reset, clean, deployment or production migration occurred.

The former separate frontend/backend commit workflow is cancelled. Existing reports and source worktrees were preserved; their historical two-branch commit instructions are superseded by this report.

## 1. Verified source locations and Git assignments

| Purpose | Absolute location | Branch / HEAD | Pending implementation state |
|---|---|---|---|
| Original parent checkout | `C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse` | `main` / `19d3f0c` | Old baseline; 62 raw tracked changes are line-ending equivalents; original work retained |
| Registered nested primary checkout | `C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/ECONVERSE` | `main` / same | Clean baseline, 79 tracked files; shares original repository metadata with parent |
| Frontend source | `C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/frontend` | `feat/econverse2-frontend` / same | 257 pending entries: 7 modifications, 250 new files |
| Backend source | `C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/backend` | `feat/econverse2-backend` / same | 48 pending entries: 15 modifications, 33 new files |
| Existing combined preview | `C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/integration` | detached / same | Existing combined application and local review state; preserved |
| Prepared consolidated checkout | full path above | `main` / same | **305 pending commit entries: 21 modifications + 284 new files**, including this new report |

Git worktree metadata and each path's actual branch, HEAD, index and files were checked. Source indexes were empty and remain empty. Latest source versions were selected using the reviewed inventories and SHA-256 values, not modification times. All 305 original frontend/backend file entries still match the earlier reviewed hashes; `.gitignore` is the only shared pending path and is byte-identical on both sides.

The independent clone has its own `.git`, index and copied object store. It was created locally with `--no-hardlinks --single-branch --branch main`; it has no objects alternates. Creating/populating it changed no original repository refs or working files. Its GitHub origin was configured locally without fetching or pushing. Live remote freshness is not asserted.

## 2. Review comparison and preview completeness

Read and compared:

- Frontend `FINAL_INTEGRATION_REVIEW.md` and the identical reviewed copy in the integration preview.
- Root `.qa-review/ANTIGRAVITY_INDEPENDENT_REVIEW.md`.
- Root `POST_REVIEW_MERGE_PLAN.md` and the earlier backend `docs/POST_REVIEW_MERGE_PLAN.md`.
- The earlier source inventories, final browser regressions and the main verification findings.

The integration preview matches **75 original owned implementation/test/configuration/report files**, including the motion and account-race fixes. It is missing three later reviewed documentation files:

```text
docs/POST_REVIEW_MERGE_PLAN.md
docs/verification/POST_REVIEW_SOURCE_INVENTORY.json
docs/verification/POST_REVIEW_VERIFICATION.json
```

Its generated browser evidence is not the authoritative complete frontend source inventory. Therefore the preview was **not assumed to be a complete latest snapshot** and was not copied wholesale. The consolidated checkout was assembled from the full committed baseline plus **every non-ignored pending source file** from both owning worktrees. Both shared edits and all later documentation are included.

Antigravity's useful findings remain documented, with the corrections already established in post-review verification: one-sided backend package changes need no duplicate frontend edit; `AuthModal` is active; the actual unreachable legacy component count is 16; the missing-video IDs in that review are partly incorrect; its example bootstrap SQL omits a required timestamp. No legacy components were removed and no unrelated polish/refactoring was introduced. Production state was not inspected.

## 3. Consolidated file and dependency completeness

There are **304 unique reviewed pending paths**, representing the 305 original source entries with identical `.gitignore` changes coalesced. These comprise **21 tracked modifications + 283 additions** over the baseline. This new report adds one more untracked document, producing the prepared checkout's **305 commit entries**.

Every reviewed pending file, including retained QA evidence, has the same SHA-256 as its owning source. Every unaffected baseline file remains present. All 78 owned source/test/configuration/documentation files are included, together with the recorded frontend evidence. No ownership filter dropped files.

Included application areas:

- Learner dashboard, library, lesson/quiz experience, profile, canonical API services and both WebP assets.
- Shared motion/dialog behavior, reduced-motion handling, keyboard focus, narrow confirmation, account-switch/stale-response guards and the regression journeys that verify them.
- Admin/Editor authorization, scoped private drafts, revision validation and optimistic concurrency, review/publication, user administration, audit and analytics.
- Server-authoritative grading, durable once-only XP claims, historical progress/reward compatibility and current-role/session handling.
- All five migrations: `0001_initial_schema.sql`, `0002_seed_data.sql`, `0003_user_roles.sql`, `0004_content_workflow.sql`, `0005_migrate_legacy_content.sql`.
- Package and lockfile, Vite proxy configuration, security headers, combined ignore rules, bootstrap/local-review/generation scripts, backend/CMS/security/HTTP/migration/learner/browser tests and existing reports.
- Unchanged baseline `wrangler.toml`, `tsconfig.json`, `.env.example`, historical lesson data and retained legacy source.

The authoritative package/lock are the reviewed **backend versions**. Frontend versions are baseline-equivalent; no manual manifest combination or lock regeneration was required. Root lock declarations match the package. Fresh `npm ci --ignore-scripts` succeeded without changing the lock hash. Installed Vite is 6.4.5, React/React DOM 19.2.7, axe 4.11.1. The fresh audit reports **zero known vulnerabilities**, unlike the old original-main lockfile.

Exact reviewed path/owner/size/hash inventory and preparation provenance are stored in the sibling QA directory:

```text
C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/frontend/.qa-review/main-consolidation-20261025/source-inventory.json
C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/frontend/.qa-review/main-consolidation-20261025/preparation.json
C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/frontend/.qa-review/main-consolidation-20261025/commit-inventory.json
```

The complete final path/status commit inventory is also appended to this report. No separate source-worktree commit is needed to use this consolidated copy.

## 4. Fresh verification on the consolidated version

All execution below used the prepared clone's source, dependencies, build and **fresh local D1**. The local Pages/Functions preview ran on **127.0.0.1:8800**. Staff fixtures were generated in this clone; runner path inspection confirmed that no sibling preview/database was selected.

| Check | Fresh result |
|---|---|
| Exact baseline/source inventory comparison | PASS; all 304 reviewed paths present and hash-identical |
| `npm ci --ignore-scripts` | PASS; no dependency scripts enabled; lock retained |
| `npm run typecheck` | PASS |
| `npm run build` and final rebuild | PASS; assets identical to the earlier verified assembly and temporary axe helper removed |
| `npm test` | PASS: **67 foundation + 72 CMS/security** assertions, historical migration rehearsal and sync ownership/path checks |
| `npm run test:learner` | PASS: **13 assertions** |
| `npm audit --json` | PASS: **zero known vulnerabilities** |
| Local migrations and disposable staff setup | PASS: migrations **0001–0005**, local storage only |
| `npm run test:http` | PASS: **52 real HTTP/D1 checks** |
| Reviewed core learner/editor/admin journey through Playwright CLI | PASS: **42 checks, 15 clean axe scans**, real publication, persistence and advancing video |
| `npm run test:motion` with Chrome | PASS: **53 checks, 12 clean axe scans** |
| Final UI regressions, `MOTION_BROWSER=chrome`, `firefox`, `webkit` sequentially | PASS in **each engine**: **41 checks, four clean scans**, actual engine identities retained |
| Missing-video/focus/narrow-layout supplemental journey | PASS: **28 checks**, all eight fallback lessons usable, no page errors |
| Source preservation and final diff/status inspection | PASS; original files/refs/indexes preserved, no unexpected commit candidates or unmerged files |

Total fresh axe scans: **39**, including repeated screens/engines. Real Chromium playback advanced **0.271889s → 0.438919s after session refresh → 1.540671s after quiz interactions**, unpaused with the original iframe. Other engines exercised iframe retention and the account, profile, Editor privacy, focus and reduced-motion regressions.

The core CLI wrapper executes the unchanged reviewed `tests/e2e/econverse2_journeys.js`; only its evidence destination and browser-session name were redirected so existing reviewed screenshots were not overwritten. There were no fabricated successful responses. The reviewed scenarios deliberately simulate failures/hold real responses for their failure and race assertions. Motion/final runners wrote only ignored `tests/results/consolidation/` output.

Final build: JS `index-QfrWgQg6.js` **280.99 kB / 84.91 kB gzip**; CSS `index-b95i1IQb.css` **95.35 kB / 19.40 kB gzip**; two WebP assets about 45 kB. Index and asset hashes match the previous reviewed assembly despite the new checkout location.

Migration rehearsal retains 13 lessons, 42 quiz keys, owner corrections, sessions, attempts, progress and XP. The eight real missing-video lessons are `lesson-1`, `lesson-2`, `lesson-2d`, `lesson-2e`, `lesson-5`, `lesson-6`, `lesson-7`, `lesson-8`; all show the safe message, retain teaching text, mount no invalid iframe and load quizzes. QA publications were hidden only in the new disposable database after testing, preserving all rows/history; its final public catalog again contained exactly the 13 historical IDs.

Fresh logs/results, browser identities, source preservation, asset hashes and machine-readable verification live directly under `main-consolidation-20261025/`, including `verification.json`, `backend-security.log`, `http.log`, `core.log`, `motion.log`, `final-ui-*.log`, `audit.json`, and `fallback-results.json`. The first sandboxed local clone attempt failed on Windows subprocess access; the approved retry succeeded. No application test failed or source correction was required.

No formal penetration test, physical battery-saver/mobile device certification, manual screen-reader speech assessment, production-data inspection or deployment approval is claimed. `test:prod` was not run.

## 5. Original-main preservation and transfer preflight

Original source worktrees and main were preserved byte for byte. Hash checks cover **922 captured file entries across the original locations**, including all original tracked/untracked work captured for this task; repeated physical paths are counted as entries, not distinct files. The prepared source's 304 paths were checked independently as well.

An additional byte-identical backup of the original main's **79 tracked files** was saved at:

```text
C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/frontend/.qa-review/main-consolidation-20261025/original-main-tracked
```

`original-main-backup.json` records its hashes. This backup is preservation evidence, **not permission to overwrite the original files**.

A read-only transfer preflight checks target root, branch `main`, baseline HEAD, empty staged/unmerged lists, source hashes, existing path collisions, modified destination paths and symlinks. It performs no copy, staging, deletion or overwrite. The prepared clone has **304 already-identical paths**. The original root has:

| Original-root transfer disposition | Paths |
|---|---:|
| **Blocked: preserve existing uncommitted modification** | **20** |
| Clean baseline file that could otherwise be replaced | 1 |
| Absent file that could otherwise be added | 282 |
| Already identical, left alone | 1 |

The 20 blockers are listed below. Their current differences normalize to the baseline, but the instruction to preserve existing main modifications still applies. **No exception was inferred for line endings. No partial application was performed.** The other raw main modifications and unrelated untracked material were also preserved.

To repeat the read-only check from any shell directory:

```powershell
node "C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/frontend/.qa-review/main-consolidation-20261025/check-transfer.mjs" "C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse"
```

Current output has `canTransfer: false`. There is no `--apply` mode to accidentally bypass the protection. The recorded plan is `root-transfer-check.json`. Do not use bulk folder copy, `/MIR`, reset, clean or Git merge to import these uncommitted files into the original root.

## 6. Safest one-commit owner procedure

### Recommended: commit the already-prepared independent main clone

This achieves one complete reviewed ECONVERSE 2.0 working copy on `main` while preserving all original work.

1. Keep the prepared directory and its parent intact. It is an independent repository nested inside the preserved QA workspace; deleting/moving that parent would affect this checkout.
2. In GitHub Desktop use **File → Add local repository**, choosing the exact prepared `.../main` path shown at the top. This follows [GitHub's local-repository workflow](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-a-repository-from-your-local-computer-to-github-desktop). Choose this independent repository, not the old parent/nested primary checkout or a frontend/backend worktree.
3. Confirm **Current Branch = main**, HEAD `19d3f0c`, origin `https://github.com/SamKang5/ECONVERSE.git`, and the exact path. There is no branch merge step.
4. Review the **305 selected candidates: 21 modified files + 284 additions** against the appended inventory. That is the reviewed 304-path source union plus this consolidation report. Recorded QA evidence is retained as reviewed; current generated artifacts and credentials are ignored. No staging or commit has been performed by the agent.
5. Make **one local owner-controlled commit** using the message below. Do not click Push, Publish or Deploy as part of this preparation. Any later remote/main freshness check and push is a separate owner action.

Recommended commit message:

```text
feat: consolidate ECONVERSE 2.0 learning and content management
```

Suggested description: Include the reviewed learner/staff UI and motion fixes, Admin/Editor RBAC, versioned CMS publication, additive historical-data migrations, durable quiz rewards, security/configuration changes and full regression coverage.

Committing this independent clone changes **its own main**. It does not silently update the original repository's main ref or root files. Both repositories share baseline history and the same GitHub remote, but have independent local metadata. Keep using the chosen checkout consistently. No separate frontend/backend commits or integration branch are needed.

### If the owner requires the original root path instead

Under the current restrictions there is **no safe automatic transfer into that dirty root**. The prepared snapshot is ready, but its 20 overlapping destination modifications must first be explicitly reconciled by the owner; unrelated work must remain intact. Backups alone do not satisfy the instruction not to overwrite uncommitted changes.

After that separate reconciliation, the exact transfer procedure is:

1. Recheck original main path/branch/HEAD and run the read-only preflight again. Stop if its `canTransfer` is false, source hashes changed, any staged/conflicted file exists, or the target baseline differs. Preserve both source worktrees.
2. Use only `source-inventory.json`'s **304 explicit paths** from the verified prepared clone. Skip already-identical files. Add absent paths and replace only target baseline files that the fresh preflight classifies as clean. Do not copy the clone's `.git`, dependencies, builds, database, generated runners or surrounding QA directory; do not perform deletions or overwrite a destination that changes during the transfer. Copy this new report separately as the 305th reviewed path.
3. Recompare every transferred path to its recorded SHA-256. Verify that all pre-existing unrelated files still match the preservation record. Review the exact resulting diff and local exclusions.
4. In that actual root, use a fresh install and its own isolated local D1/fixtures, then rerun typecheck, build, backend/CMS/security, learner, real HTTP, core/motion/final browser checks. The current dirty root's earlier legacy passes are not transferable to the new source tree.
5. Only after that root passes should the owner select its combined change in Desktop and make the **same single combined commit**. No branch-history merge is used to transfer uncommitted changes.

These original-root steps are a guarded future procedure, not a claim they were executed. The recommended prepared-clone path already avoids the overlapping-write problem.

## 7. Commit exclusions and remaining production gates

The prepared clone's reviewed ignore rules exclude `.local-review/`, `.motion-review/`, `.qa-review/`, `.playwright-cli/`, `.wrangler/`, `node_modules/`, `dist/`, `tests/results/`, environment secrets and `bootstrap.sql`. Generated staff credentials, cookie/profile material, SQL and local SQLite files were created only under excluded paths. Do not force-add them. Final build cleanup removed `dist/__review-axe.js`.

The original root's old ignore rules are less complete; do not select all its current changes or add its untracked duplicate `ECONVERSE/` tree. The prepared clone does not contain that duplicate directory or original-root QA databases. A final exact status comparison rejects any unexpected commit candidate. No new source dependency, credential, build output, database or merge conflict was introduced into the reviewed file inventory. Pattern/source checks remain bounded rather than a forensic history audit.

Production remains **NOT READY / UNVERIFIED**. Independently establish real environment/binding/migration/admin state, back up and rehearse actual data/restore, apply only pending migrations after separate authorization, review generated offline bootstrap SQL for an explicit active owner if needed, resolve or accept the eight missing videos, and verify production security/monitoring/capacity. No remote production state was read and no production operation was executed. Existing legacy components remain intact; their removal is not a consolidation prerequisite.

## 8. Final status

- **Prepared standalone main clone: complete, tested, and ready for one owner-controlled local commit.**
- **Original root main: unchanged; direct transfer remains blocked at 20 protected paths.**
- All source worktrees, their pending work, previous reports, original local state and history are preserved.
- No feature commits, integration branch, Git merge, agent commit, push, deployment or production migration occurred.

## Appendix A — original-root protected overlaps

```text
.gitignore
functions/api/auth/register.ts
functions/api/me.ts
functions/api/progress/[lessonId].ts
functions/api/progress/index.ts
functions/api/quizzes/[lessonId]/index.ts
functions/api/quizzes/[lessonId]/submit.ts
functions/lib/auth.ts
functions/lib/errors.ts
functions/lib/types.ts
package-lock.json
package.json
tests/backend_foundation.test.mjs
vite.config.ts
index.html
src/App.tsx
src/components/AuthModal.tsx
src/index.css
src/main.tsx
src/services/api.ts
```

## Appendix B — exact prepared main commit inventory

The following 305 entries are the reviewed 304-path source union plus this report. This list excludes generated credentials, runtime state, builds and fresh browser output.

```text
 M .gitignore
 M README.md
 M functions/api/auth/register.ts
 M functions/api/me.ts
 M functions/api/progress/[lessonId].ts
 M functions/api/progress/index.ts
 M functions/api/quizzes/[lessonId]/index.ts
 M functions/api/quizzes/[lessonId]/submit.ts
 M functions/lib/auth.ts
 M functions/lib/errors.ts
 M functions/lib/types.ts
 M index.html
 M package-lock.json
 M package.json
 M src/App.tsx
 M src/components/AuthModal.tsx
 M src/index.css
 M src/main.tsx
 M src/services/api.ts
 M tests/backend_foundation.test.mjs
 M vite.config.ts
?? FINAL_INTEGRATION_REVIEW.md
?? MOTION_POLISH_REPORT.md
?? design-qa.md
?? docs/ARCHITECTURE_AND_SECURITY.md
?? docs/CHANGED_FILES.md
?? docs/DESIGN_QA.md
?? docs/ECONVERSE2_API.md
?? docs/IMPLEMENTATION_REPORT.md
?? docs/LOCAL_REVIEW.md
?? docs/POST_REVIEW_MERGE_PLAN.md
?? docs/verification/POST_REVIEW_SOURCE_INVENTORY.json
?? docs/verification/POST_REVIEW_VERIFICATION.json
?? docs/verification/browser-review.json
?? docs/verification/local-http.json
?? functions/api/_middleware.ts
?? functions/api/admin/[[path]].ts
?? functions/api/courses.ts
?? functions/api/lessons/[lessonId].ts
?? functions/api/studio/[[path]].ts
?? functions/lib/content.ts
?? functions/lib/http.ts
?? migrations/0003_user_roles.sql
?? migrations/0004_content_workflow.sql
?? migrations/0005_migrate_legacy_content.sql
?? public/_headers
?? scripts/bootstrap-admin.mjs
?? scripts/generate-content-migration.mjs
?? scripts/local-wrangler.mjs
?? scripts/prepare-local-review.mjs
?? scripts/run-browser-review.mjs
?? scripts/sync-integration.mjs
?? scripts/tidy-local-review.mjs
?? src/assets/econverse-logo.webp
?? src/assets/tun-mascot.webp
?? src/components/CourseLibrary.tsx
?? src/components/LearnerDashboard.tsx
?? src/components/LearnerProfile.tsx
?? src/components/LessonExperience.tsx
?? src/components/ManagementPage.css
?? src/components/ManagementPage.tsx
?? src/components/Motion.tsx
?? src/learnerModel.ts
?? src/motion.css
?? src/services/content.ts
?? src/services/management.ts
?? tests/cms_security.test.mjs
?? tests/e2e/econverse2-evidence/01-dashboard-desktop.png
?? tests/e2e/econverse2-evidence/02-library-desktop.png
?? tests/e2e/econverse2-evidence/03-lesson-desktop.png
?? tests/e2e/econverse2-evidence/03b-video-playing.png
?? tests/e2e/econverse2-evidence/04-quiz-result.png
?? tests/e2e/econverse2-evidence/05-profile.png
?? tests/e2e/econverse2-evidence/06-dashboard-390.png
?? tests/e2e/econverse2-evidence/06-dashboard-768.png
?? tests/e2e/econverse2-evidence/07-library-mobile.png
?? tests/e2e/econverse2-evidence/08-editor-preview.png
?? tests/e2e/econverse2-evidence/09-editor-submitted.png
?? tests/e2e/econverse2-evidence/10-admin-published.png
?? tests/e2e/econverse2-evidence/11-admin-audit.png
?? tests/e2e/econverse2-evidence/12-admin-analytics.png
?? tests/e2e/econverse2-evidence/13-admin-390.png
?? tests/e2e/econverse2-evidence/13-admin-768.png
?? tests/e2e/econverse2-evidence/14-editor-mobile.png
?? tests/e2e/econverse2-evidence/comparison-desktop.png
?? tests/e2e/econverse2-evidence/comparison-mobile.png
?? tests/e2e/econverse2-evidence/comparison-navigation.png
?? tests/e2e/econverse2-evidence/comparison-tablet.png
?? tests/e2e/econverse2-evidence/dashboard-desktop.png
?? tests/e2e/econverse2-evidence/dashboard-desktop.yml
?? tests/e2e/econverse2-evidence/dashboard-mobile.png
?? tests/e2e/econverse2-evidence/dashboard-mobile.yml
?? tests/e2e/econverse2-evidence/dashboard-tablet.png
?? tests/e2e/econverse2-evidence/dashboard-tablet.yml
?? tests/e2e/econverse2-evidence/initial.yml
?? tests/e2e/econverse2-evidence/lesson-mobile.png
?? tests/e2e/econverse2-evidence/lesson-mobile.yml
?? tests/e2e/econverse2-evidence/library-mobile.png
?? tests/e2e/econverse2-evidence/library-mobile.yml
?? tests/e2e/econverse2-evidence/library-search.yml
?? tests/e2e/econverse2-evidence/mobile-menu.yml
?? tests/e2e/econverse2-evidence/owner-dashboard-desktop.png
?? tests/e2e/econverse2-evidence/owner-dashboard-desktop.yml
?? tests/e2e/econverse2-evidence/owner-dashboard-mobile.png
?? tests/e2e/econverse2-evidence/owner-dashboard-mobile.yml
?? tests/e2e/econverse2-evidence/owner-dashboard-tablet.png
?? tests/e2e/econverse2-evidence/quiz-mobile.png
?? tests/e2e/econverse2-evidence/quiz-mobile.yml
?? tests/e2e/econverse2-evidence/reference-desktop.png
?? tests/e2e/econverse2-evidence/reference-mobile.png
?? tests/e2e/econverse2-evidence/reference-tablet.png
?? tests/e2e/econverse2_journeys.js
?? tests/e2e/final-review-evidence/account-reproduction.json
?? tests/e2e/final-review-evidence/before-account-switch.png
?? tests/e2e/final-review-evidence/before-collapsed-validation.png
?? tests/e2e/final-review-evidence/before-confirmation-320.png
?? tests/e2e/final-review-evidence/before-confirmation-390.png
?? tests/e2e/final-review-evidence/build-equivalence.json
?? tests/e2e/final-review-evidence/build-final.txt
?? tests/e2e/final-review-evidence/chrome/after-admin.png
?? tests/e2e/final-review-evidence/chrome/after-confirmation.png
?? tests/e2e/final-review-evidence/chrome/after-dashboard-desktop.png
?? tests/e2e/final-review-evidence/chrome/after-dashboard-mobile.png
?? tests/e2e/final-review-evidence/chrome/after-editor.png
?? tests/e2e/final-review-evidence/chrome/after-lesson.png
?? tests/e2e/final-review-evidence/chrome/after-library-mobile.png
?? tests/e2e/final-review-evidence/chrome/after-quiz-result.png
?? tests/e2e/final-review-evidence/chrome/after-quiz-selected.png
?? tests/e2e/final-review-evidence/chrome/confirmation-mobile.png
?? tests/e2e/final-review-evidence/chrome/dashboard-desktop.png
?? tests/e2e/final-review-evidence/chrome/editor-mobile.png
?? tests/e2e/final-review-evidence/chrome/failure.png
?? tests/e2e/final-review-evidence/chrome/final-integration-results.json
?? tests/e2e/final-review-evidence/chrome/initial.yml
?? tests/e2e/final-review-evidence/chrome/motion-results.json
?? tests/e2e/final-review-evidence/chrome/quiz-result.png
?? tests/e2e/final-review-evidence/core-results.json
?? tests/e2e/final-review-evidence/core/01-dashboard-desktop.png
?? tests/e2e/final-review-evidence/core/02-library-desktop.png
?? tests/e2e/final-review-evidence/core/03-lesson-desktop.png
?? tests/e2e/final-review-evidence/core/03b-video-playing.png
?? tests/e2e/final-review-evidence/core/04-quiz-result.png
?? tests/e2e/final-review-evidence/core/05-profile.png
?? tests/e2e/final-review-evidence/core/06-dashboard-390.png
?? tests/e2e/final-review-evidence/core/06-dashboard-768.png
?? tests/e2e/final-review-evidence/core/07-library-mobile.png
?? tests/e2e/final-review-evidence/core/08-editor-preview.png
?? tests/e2e/final-review-evidence/core/09-editor-submitted.png
?? tests/e2e/final-review-evidence/core/10-admin-published.png
?? tests/e2e/final-review-evidence/core/11-admin-audit.png
?? tests/e2e/final-review-evidence/core/12-admin-analytics.png
?? tests/e2e/final-review-evidence/core/13-admin-390.png
?? tests/e2e/final-review-evidence/core/13-admin-768.png
?? tests/e2e/final-review-evidence/core/14-editor-mobile.png
?? tests/e2e/final-review-evidence/core/comparison-desktop.png
?? tests/e2e/final-review-evidence/core/comparison-mobile.png
?? tests/e2e/final-review-evidence/core/comparison-navigation.png
?? tests/e2e/final-review-evidence/core/comparison-tablet.png
?? tests/e2e/final-review-evidence/core/dashboard-desktop.png
?? tests/e2e/final-review-evidence/core/dashboard-mobile.png
?? tests/e2e/final-review-evidence/core/dashboard-tablet.png
?? tests/e2e/final-review-evidence/core/initial.yml
?? tests/e2e/final-review-evidence/core/lesson-mobile.png
?? tests/e2e/final-review-evidence/core/library-mobile.png
?? tests/e2e/final-review-evidence/core/owner-dashboard-desktop.png
?? tests/e2e/final-review-evidence/core/owner-dashboard-mobile.png
?? tests/e2e/final-review-evidence/core/owner-dashboard-tablet.png
?? tests/e2e/final-review-evidence/core/quiz-mobile.png
?? tests/e2e/final-review-evidence/core/reference-desktop.png
?? tests/e2e/final-review-evidence/core/reference-mobile.png
?? tests/e2e/final-review-evidence/core/reference-tablet.png
?? tests/e2e/final-review-evidence/evidence-manifest.json
?? tests/e2e/final-review-evidence/final-library.json
?? tests/e2e/final-review-evidence/firefox/after-admin.png
?? tests/e2e/final-review-evidence/firefox/after-confirmation.png
?? tests/e2e/final-review-evidence/firefox/after-dashboard-desktop.png
?? tests/e2e/final-review-evidence/firefox/after-dashboard-mobile.png
?? tests/e2e/final-review-evidence/firefox/after-editor.png
?? tests/e2e/final-review-evidence/firefox/after-lesson.png
?? tests/e2e/final-review-evidence/firefox/after-library-mobile.png
?? tests/e2e/final-review-evidence/firefox/after-quiz-result.png
?? tests/e2e/final-review-evidence/firefox/after-quiz-selected.png
?? tests/e2e/final-review-evidence/firefox/confirmation-mobile.png
?? tests/e2e/final-review-evidence/firefox/dashboard-desktop.png
?? tests/e2e/final-review-evidence/firefox/editor-mobile.png
?? tests/e2e/final-review-evidence/firefox/failure.png
?? tests/e2e/final-review-evidence/firefox/final-integration-results.json
?? tests/e2e/final-review-evidence/firefox/initial.yml
?? tests/e2e/final-review-evidence/firefox/motion-results.json
?? tests/e2e/final-review-evidence/firefox/quiz-result.png
?? tests/e2e/final-review-evidence/http-final.txt
?? tests/e2e/final-review-evidence/http-results.json
?? tests/e2e/final-review-evidence/identity-reproduction-notes.md
?? tests/e2e/final-review-evidence/independent-security-notes.md
?? tests/e2e/final-review-evidence/initial-defect-reproductions.json
?? tests/e2e/final-review-evidence/initial.yml
?? tests/e2e/final-review-evidence/integration-status.json
?? tests/e2e/final-review-evidence/lifecycle-final.json
?? tests/e2e/final-review-evidence/lifecycle.json
?? tests/e2e/final-review-evidence/lighthouse-desktop-summary.txt
?? tests/e2e/final-review-evidence/lighthouse-desktop/report.html
?? tests/e2e/final-review-evidence/lighthouse-desktop/report.json
?? tests/e2e/final-review-evidence/lighthouse-mobile-summary.txt
?? tests/e2e/final-review-evidence/lighthouse-mobile/report.html
?? tests/e2e/final-review-evidence/lighthouse-mobile/report.json
?? tests/e2e/final-review-evidence/local-fixture-cleanup.txt
?? tests/e2e/final-review-evidence/performance-final.json
?? tests/e2e/final-review-evidence/performance-trace-summary.txt
?? tests/e2e/final-review-evidence/performance-trace.json.gz
?? tests/e2e/final-review-evidence/performance.json
?? tests/e2e/final-review-evidence/playback-hidden-test-failure.json
?? tests/e2e/final-review-evidence/publish-after.png
?? tests/e2e/final-review-evidence/publish-before.png
?? tests/e2e/final-review-evidence/publish-diagnostic.json
?? tests/e2e/final-review-evidence/quiz-touch.png
?? tests/e2e/final-review-evidence/recording-0.3.png
?? tests/e2e/final-review-evidence/recording-1.4.png
?? tests/e2e/final-review-evidence/recording-3.4.png
?? tests/e2e/final-review-evidence/recording-5.4.png
?? tests/e2e/final-review-evidence/recording-6.9.png
?? tests/e2e/final-review-evidence/reflow-analysis.txt
?? tests/e2e/final-review-evidence/session-reproduction.json
?? tests/e2e/final-review-evidence/standalone-build-final.txt
?? tests/e2e/final-review-evidence/standalone-http-results.json
?? tests/e2e/final-review-evidence/standalone-http.txt
?? tests/e2e/final-review-evidence/standalone-install.txt
?? tests/e2e/final-review-evidence/standalone-migrations.txt
?? tests/e2e/final-review-evidence/standalone-typecheck.txt
?? tests/e2e/final-review-evidence/standalone-ui-results.json
?? tests/e2e/final-review-evidence/test-summary.json
?? tests/e2e/final-review-evidence/touch-initial.yml
?? tests/e2e/final-review-evidence/touch-results.json
?? tests/e2e/final-review-evidence/unit-final.txt
?? tests/e2e/final-review-evidence/video-diagnostic.json
?? tests/e2e/final-review-evidence/webkit/after-admin.png
?? tests/e2e/final-review-evidence/webkit/after-confirmation.png
?? tests/e2e/final-review-evidence/webkit/after-dashboard-desktop.png
?? tests/e2e/final-review-evidence/webkit/after-dashboard-mobile.png
?? tests/e2e/final-review-evidence/webkit/after-editor.png
?? tests/e2e/final-review-evidence/webkit/after-lesson.png
?? tests/e2e/final-review-evidence/webkit/after-library-mobile.png
?? tests/e2e/final-review-evidence/webkit/after-quiz-result.png
?? tests/e2e/final-review-evidence/webkit/after-quiz-selected.png
?? tests/e2e/final-review-evidence/webkit/confirmation-mobile.png
?? tests/e2e/final-review-evidence/webkit/dashboard-desktop.png
?? tests/e2e/final-review-evidence/webkit/editor-mobile.png
?? tests/e2e/final-review-evidence/webkit/failure.png
?? tests/e2e/final-review-evidence/webkit/final-integration-results.json
?? tests/e2e/final-review-evidence/webkit/first-motion-failure.json
?? tests/e2e/final-review-evidence/webkit/initial.yml
?? tests/e2e/final-review-evidence/webkit/motion-results.json
?? tests/e2e/final-review-evidence/webkit/quiz-result.png
?? tests/e2e/final_integration.js
?? tests/e2e/motion-evidence/after-admin.png
?? tests/e2e/motion-evidence/after-confirmation.png
?? tests/e2e/motion-evidence/after-dashboard-desktop.png
?? tests/e2e/motion-evidence/after-dashboard-guest-mobile.png
?? tests/e2e/motion-evidence/after-dashboard-mobile.png
?? tests/e2e/motion-evidence/after-dashboard.yml
?? tests/e2e/motion-evidence/after-editor.png
?? tests/e2e/motion-evidence/after-lesson.png
?? tests/e2e/motion-evidence/after-library-mobile.png
?? tests/e2e/motion-evidence/after-quiz-result.png
?? tests/e2e/motion-evidence/after-quiz-selected.png
?? tests/e2e/motion-evidence/after-quiz-touch.png
?? tests/e2e/motion-evidence/before-dashboard-desktop.png
?? tests/e2e/motion-evidence/before-dashboard-mobile.png
?? tests/e2e/motion-evidence/before-dashboard.yml
?? tests/e2e/motion-evidence/before-lesson.png
?? tests/e2e/motion-evidence/before-quiz.png
?? tests/e2e/motion-evidence/chrome-performance-initial.json.gz
?? tests/e2e/motion-evidence/chrome-performance.json.gz
?? tests/e2e/motion-evidence/devtools-reflow.txt
?? tests/e2e/motion-evidence/devtools-trace-summary.txt
?? tests/e2e/motion-evidence/editor-repro-results.json
?? tests/e2e/motion-evidence/evidence-manifest.json
?? tests/e2e/motion-evidence/existing-journeys-results.json
?? tests/e2e/motion-evidence/initial.yml
?? tests/e2e/motion-evidence/lifecycle-results.json
?? tests/e2e/motion-evidence/lighthouse-desktop-summary.txt
?? tests/e2e/motion-evidence/lighthouse-desktop/report.html
?? tests/e2e/motion-evidence/lighthouse-desktop/report.json
?? tests/e2e/motion-evidence/lighthouse-mobile-summary.txt
?? tests/e2e/motion-evidence/lighthouse-mobile/report.html
?? tests/e2e/motion-evidence/lighthouse-mobile/report.json
?? tests/e2e/motion-evidence/motion-interactions.webm
?? tests/e2e/motion-evidence/motion-results.json
?? tests/e2e/motion-evidence/performance-after-1.json
?? tests/e2e/motion-evidence/performance-after-2.json
?? tests/e2e/motion-evidence/performance-after-3.json
?? tests/e2e/motion-evidence/performance-before.json
?? tests/e2e/motion-evidence/performance-final-1.json
?? tests/e2e/motion-evidence/performance-final-2.json
?? tests/e2e/motion-evidence/performance-final-3.json
?? tests/e2e/motion-evidence/touch-results.json
?? tests/e2e/motion_lifecycle.js
?? tests/e2e/motion_performance.js
?? tests/e2e/motion_polish.js
?? tests/e2e/motion_touch.js
?? tests/e2e/run_motion_review.mjs
?? tests/integration_sync.test.mjs
?? tests/learner_model.test.mjs
?? tests/local_http.integration.test.mjs
?? tests/migration_rehearsal.test.mjs
?? MAIN_CONSOLIDATION_REPORT.md
```
