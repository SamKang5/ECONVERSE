# ECONVERSE 2.0 — Post-review merge preparation

Review date: 24 October 2026, Asia/Saigon. Common baseline: `19d3f0cc9fc89122ece5b4cd4b0cf0bcb2acd006`.

**Final verdict: READY TO COMMIT.** Both source worktrees can be committed through the owner's GitHub Desktop workflow. **Merge readiness remains conditional on committing both branches and testing their actual combined history. Production readiness remains NOT READY.**

No commit, staging, push, history merge, reset, clean, production access or production migration was performed. No application, dependency, migration or test source required correction. This task adds only this plan and its two verification/inventory JSON files in the backend worktree. The original 302 pending file entries across the feature worktrees and all 79 tracked parent files were preserved byte for byte.

## 1. Scope, evidence and review corrections

Read the owner's `.qa-review/ANTIGRAVITY_INDEPENDENT_REVIEW.md` and compared it with frontend `FINAL_INTEGRATION_REVIEW.md`, current Git/source/configuration/migrations, the earlier evidence manifests, and new isolated execution. The 75 previously reviewed owned source hashes and all 139 earlier evidence hashes still matched. Earlier results are identified as historical evidence; they were not substituted for the fresh checks below.

Applied Git workflow, multi-axis code review, security/hardening and installed Playwright CLI skills. Browser checks used CLI `open`, snapshots, semantic interactions and real local Pages/D1. Security boundaries checked include session/current-role resolution, same-origin writes, private drafts, public serializers, revision concurrency, once-only XP and offline bootstrap. No formal penetration-test or manual screen-reader certification is claimed.

### Disposition of every severity-ranked finding

| Antigravity finding | Verified disposition | Action / gate |
|---|---|---|
| P0 / P1: none reported | No new blocking application defect found in source review and fresh tests. This is a bounded finding, not a claim that vulnerabilities cannot exist. | No application correction. |
| **P2-01 — mobile targets below 44px** | Confirmed at 390px: menu opener **38×38**, close **32×32**, login **79.41×40**. These meet the 24px minimum cited by the review but fall below its 44px ergonomic recommendation. | Optional touch-target improvement, outside integration preparation; no new accessibility failure or merge conflict demonstrated. No CSS redesign. |
| **P2-02 — hidden iframe may suspend on mobile battery-saving engines** | Speculative platform limitation, not a reproduced application defect. Fresh three-engine tests retain the iframe; Chromium actual media time advances during session refresh and quiz interactions. Physical battery-saving behavior was not tested. | Retain `hidden` semantics and current implementation. Off-screen clipping does not guarantee OS media execution and, without additional semantics, can expose inactive content to assistive technology. Background-audio policy/device certification is a separate acceptance decision. |
| **P2-03 — asymmetric manifest** | Real asymmetry, **not an integration defect**. Frontend package/lock are baseline-equivalent; only backend changes them. Native per-file Git three-way rehearsal retained backend versions without conflicts. | No duplicate frontend manifest edit. Commit backend package and lock together, then merge both branches. |
| **P3-01 — 13 dead components / prune before merge** | Inventory is inaccurate. There are **16** unreachable legacy components, about **118,660 bytes**, plus two legacy data files. Five named files do not exist; `AuthModal.tsx` is active. Actual build-module evidence excludes the 16 legacy components from runtime JS. | Retain every legacy file. Cleanup is optional future work, **not a merge prerequisite**. Removing `AuthModal` would break the active application. Details below. |
| **P3-02 — no input `autoFocus`** | Confirmed: native auth dialog initially focuses its close button. Focus remains inside the dialog, Escape works and focus returns to the opener. | Valid accessible initial-focus choice. Input-first focus can be considered separately; no integration fix required. |
| **P3-03 — missing discovery files** | Confirmed `robots.txt`/`llms.txt` are absent from `public/`; earlier audits show SPA fallback. The older audit also flags `ai-catalog.json`. `llms.txt` belongs to that audit's Agentic Browsing category, not the stated SEO deduction. | Defer indexing/agent-discovery policy to launch preparation. Adding files does not by itself guarantee SEO 100. Not a commit or application-merge blocker. |
| **P3-04 — cropped mascot** | Confirmed intentional narrow-layout crop; fresh 320px check has no page overflow. Earlier design review explicitly accepted this composition. | Preserve established design. No integration change. |

### Other material review claims corrected

| Review area | Actual source/evidence |
|---|---|
| Parent checkout | It is now on **`main`**, not the earlier report's preserved `codex/...` branch. Raw status lists many changes, but the semantic diff ignoring line-endings is empty. All 79 tracked byte hashes were preserved. Do not commit, switch, reset or clean this parent checkout for integration. |
| Backend counts / package version | Before this task: **15 modified + 30 untracked**, not 14+31. `axe-core` is **`^4.11.1`**, locked to **4.11.1**, not `^4.10.2`. There are **17** package scripts. Playwright CLI is an external test-tool prerequisite, not a missing app dependency. |
| Claimed test aliases | `test:foundation`, `test:cms`, `test:rehearse` and `test:sync-check` do not exist. `npm test` runs foundation, CMS/security, migration rehearsal and sync-helper checks; focused aliases are `test:security` and `test:migrations`. |
| Browser command | The runner reads **`MOTION_BROWSER`**. The report's `--browser=firefox`/`--browser=webkit` arguments are not parsed and therefore do not prove those engines ran. This review used the supported variable and retained genuinely different browser user agents. |
| Test provenance | The earlier 67 scans and exact 0.270→0.552→1.787-second video values are present in the previous review artifacts. They corroborate that earlier run; the independent report alone does not establish a new execution of nonexistent aliases. New tests are listed separately below. |
| Lighthouse / performance | Existing report JSON contains Accessibility, Best Practices, SEO and Agentic Browsing, **no Performance category**. The claimed Lighthouse Performance 99/96/98 is unsupported by those artifacts. Historical LCP 974ms, CLS 0/0.01/0.046 and bounded lifecycle counters remain recorded; one earlier 73ms long task is also retained. Ten stable cycles do not prove all possible memory leaks absent. No new Lighthouse run is claimed here. |
| Contrast numbers | Calculating the named solid color pairs gives ink/paper **14.64:1**, muted/surface **6.24:1**, forest/tint **6.37:1**, focus/surface **3.84:1**. The review's first three exact numbers differ, although its passing direction is consistent. Settled-state browser scans remain the practical evidence. |
| API names | Actual management paths are `/api/studio/lessons`, `/api/studio/revisions/:id`, `.../submit-review`, `/api/admin/revisions/:id/{publish,reject,unpublish}`, `PATCH /api/admin/users/:id`, and `/api/admin/audit`. The report's drafts/reviews/publications/role/status/audit-logs routes are not the implemented contract. `GET /api/me` requires authentication and returns the user; XP history has its separate endpoint. See `ECONVERSE2_API.md`. |
| CSRF / throttling | Middleware requires matching `Origin`, or same-origin `Sec-Fetch-Site` when Origin is absent, plus JSON for mutations. It does not implement the described Referer fallback. Auth throttling uses fixed 900-second windows, not a rolling window. D1 multi-region behavior/load capacity was not assessed by this local review. |
| Schema details | Actual migrations are listed below. Quizzes are in revision JSON; there is no separate `quiz_revisions` table. Published/archived **content** is immutable; controlled status/metadata changes remain possible. Duplicate rewards use a unique claim with `INSERT OR IGNORE`, not an expected exception from every second insert. The security outcomes were tested. |
| Production state | “No production admin” and “no production migrations applied” are **unverified remote-state claims**. No production resource was read. The owner must establish actual state before executing any plan. |
| Bootstrap example | The supplied `INSERT INTO admin_bootstrap(user_id) SELECT ...` omits required `created_at`. The same statement shape fails against the actual schema in memory. The repository generator supplies ID, explicit user ID and timestamp; its valid application/audit and rejection of a second bootstrap were tested locally. Do not copy the review's SQL example into production. |

## 2. Exact pending branch changes and preservation

| Source worktree | Current branch / HEAD | Pending files after this task |
|---|---|---|
| `C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/frontend` | `feat/econverse2-frontend` / common baseline | **257**: 7 modified, 250 new; unchanged by this task |
| `C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/backend` | `feat/econverse2-backend` / common baseline | **48**: 15 modified, 33 new; only three new review documents added by this task |

The exact path/status/size/SHA-256 inventory, including every screenshot, JSON, recording and trace, is [POST_REVIEW_SOURCE_INVENTORY.json](verification/POST_REVIEW_SOURCE_INVENTORY.json). It lists **305 branch file entries / 304 unique combined paths**, since `.gitignore` is identical on both sides. Earlier `CHANGED_FILES.md` remains a historical snapshot and was not overwritten.

Frontend implementation comprises `index.html`; `src/App.tsx`, `main.tsx`, `index.css`, `motion.css`, `learnerModel.ts`; both WebP assets; `AuthModal`, `CourseLibrary`, `LearnerDashboard`, `LearnerProfile`, `LessonExperience`, `ManagementPage`/CSS and `Motion`; API/content/management services; learner tests; the core/final/motion/performance/lifecycle/touch journeys and runner; the three existing review reports; and reviewed visual evidence. Pending frontend files total about **25.4 MB**, mostly evidence; the largest is approximately **1.01 MB**. Review evidence deliberately rather than blindly selecting the entire folder.

Backend comprises role/session/content/progress/quiz/admin/Studio routes and libraries; migrations **0003–0005**; `public/_headers`; package/lock/Vite configuration; bootstrap/content-generation/local-preview/account/sync/browser/tidy scripts; foundation/CMS/security/migration/HTTP/sync tests; existing architecture/API/design/acceptance/local-review docs; and these three additions:

```text
docs/POST_REVIEW_MERGE_PLAN.md
docs/verification/POST_REVIEW_SOURCE_INVENTORY.json
docs/verification/POST_REVIEW_VERIFICATION.json
```

Migrations 0001/0002, `wrangler.toml`, `tsconfig.json` and all retained legacy source remain in the common baseline and are included in the assembly. They need no duplicate pending edit. No required file was omitted by applying an ownership filter: this rehearsal exported the entire Git baseline and combined **every non-ignored pending file** from both feature worktrees. It left the existing detached preview and parent work intact.

## 3. Dependency and manifest reconciliation

The frontend's `package.json` and `package-lock.json` are baseline-equivalent. Backend changes are the sole updates to both paths. Actual `git merge-file -p` rehearsals on LF-normalized frontend/base/backend versions returned **exit 0** and exactly the backend result for both package files and `.gitignore`. There are no other overlapping changed paths.

The combined manifest matches the lockfile's root dependency declarations; a fresh **`npm ci --ignore-scripts`** succeeded without modifying the lockfile. No dependency installation scripts were enabled. Locked runtime/build versions include React **19.2.7**, Vite **6.4.5**, and axe **4.11.1**. The native dependency audit reports zero known vulnerabilities. Browser tooling remains the installed external Playwright CLI; no `@playwright/mcp` or animation library was added.

The final package scripts are `dev`, `build`, `preview`, `typecheck`, `test`, `test:security`, `test:migrations`, `test:http`, `test:learner`, `db:local`, `preview:full`, `review:accounts`, `review:tidy`, `test:prod`, `test:e2e`, `test:motion`, and `test:final-ui`. `test:e2e` deliberately invokes the new complete browser runner. **Do not run `test:prod` during this local handoff**; production access is outside authorization.

**No frontend package edit is needed.** Git naturally carries the backend-only changes when the reviewed changes are actually committed. Today both branch tips still equal the baseline: merging those tips now would not include the uncommitted implementation.

## 4. Clean integration verification

A new baseline-plus-working-changes assembly was created at frontend `.qa-review/post-review-20261024/combined`, separate from all existing source worktrees and previews. It has fresh dependencies, a fresh local D1, its own staff fixtures and a dedicated loopback preview on **8797**. It is a **working-tree integration rehearsal**, not a committed-history merge. No temporary commit, branch ref or source index was created or changed.

| Fresh execution in the isolated assembly | Result |
|---|---|
| `npm ci --ignore-scripts` | PASS; authoritative backend lockfile retained |
| `npm run typecheck` | PASS |
| `npm run build`, plus an observer-only build | PASS; the standard final build and the existing config with a read-only module observer produce the same production assets |
| `npm test` | PASS: **67** foundation + **72** CMS/security assertions, historical-data migration rehearsal and sync ownership/path checks |
| `npm run test:learner` | PASS: **13** assertions |
| `npm audit --json` | PASS: **0** known vulnerabilities |
| Local migrations 0001–0005, local staff setup | PASS against fresh isolated storage; no remote commands |
| `npm run test:http` | PASS: **52** real HTTP/D1 checks |
| `npm run test:e2e` | PASS: **42** core checks, **15** zero-violation axe scans, real advancing YouTube media, learner persistence, Editor/Admin workflow |
| `MOTION_BROWSER=chrome`, `npm run test:motion` | PASS: **53** checks, **12** zero-violation scans, empty page-error/API-failure arrays |
| `MOTION_BROWSER=chrome/firefox/webkit`, `npm run test:final-ui` sequentially | PASS in **each engine**: **41** checks and **4** clean scans; actual user agents recorded |
| Eight fallback lessons and reported UI behaviors | PASS: **28** supplementary checks; all eight have no iframe, retained written content and usable quizzes; native focus/return and 320px overflow checked |
| Historical preservation / offline bootstrap | PASS in memory: 13 lessons, 42 question rows and original answer keys retained; genuine videos preserved; eight placeholders normalized; foreign keys valid; valid generator/bootstrap audit; invalid example and second bootstrap rejected |
| Migration authoring reproducibility | PASS: the existing generator recreated 0005 from all 13 legacy lessons / four modules, exactly matching the migration after LF normalization; only the disposable assembly was written |
| Diff / preservation / secret-pattern checks | Original 302 pending entries and 79 parent tracked files preserved; empty staging; tracked `git diff --check` clean; no conflict markers, accidental private files or high-confidence credential patterns found |

This task executed **39 clean axe scans** (15 core + 12 motion + 12 across three final UI runs), not a new set of 67 distinct screens. All requested browser engines were available. Manual screen-reader speech, physical mobile/battery-saving modes, distributed load and production configuration were not tested. No new Lighthouse Performance score is claimed.

The final builds contain the same `index-QfrWgQg6.js` and `index-b95i1IQb.css`: JS **280.99 kB / 84.91 kB gzip**, CSS **95.35 kB / 19.40 kB gzip**. Module evidence confirms none of the 16 legacy components or two legacy data modules contributes runtime JS. They remain in the TypeScript compilation set, and Tailwind's `@source "./"` also scans retained source; “zero runtime bundle impact” should not be generalized to zero possible CSS or maintenance impact.

Safe machine-readable results, browser identities, module lists, checksums and inspection details are in [POST_REVIEW_VERIFICATION.json](verification/POST_REVIEW_VERIFICATION.json). Full local logs and newly generated screenshots remain in the ignored post-review QA directory. Old evidence files were hash-verified rather than overwritten. Auth windows were reset **only for hashed loopback buckets in this fresh local fixture** between engine batches; production throttling code was unchanged. The credential scan is bounded pattern/source review, not a forensic audit of all Git history.

After testing, the two tagged QA publications were hidden in this isolated database; the public API again returned exactly the 13 historical lesson IDs. Every lesson row, revision, account, attempt, progress entry, XP transaction and audit record was preserved. The final standard build removed the temporary axe helper from `dist`.

## 5. Legacy files and historical curriculum

The actual 16 unreachable components are:

```text
src/components/ComingSoonModal.tsx
src/components/Dashboard.tsx
src/components/Footer.tsx
src/components/Header.tsx
src/components/LearnPage.tsx
src/components/MediaPage.tsx
src/components/PetDisplay.tsx
src/components/PetPage.tsx
src/components/QuizCard.tsx
src/components/ShopItemCard.tsx
src/components/ShopPage.tsx
src/components/learn/LessonNavigation.tsx
src/components/learn/LessonPlayer.tsx
src/components/learn/LessonQuiz.tsx
src/components/learn/LessonRow.tsx
src/components/learn/ModuleSection.tsx
```

The retained data files are `src/data.ts` (25,951 bytes) and `src/learnData.ts` (63,557 bytes); they remain useful migration/reference input. The review's `FlashCard`, `DictionaryPage`, `CommunityPage`, `DailyQuests`, and `StreakModal` files do not exist. The current `AuthModal` is actively imported. No legacy file was deleted, moved or rewritten.

Actual genuine-video lessons: **`lesson-1c`, `lesson-1d`, `lesson-2a`, `lesson-2b`, `lesson-2c`**. Actual missing-video lessons: **`lesson-1`, `lesson-2`, `lesson-2d`, `lesson-2e`, `lesson-5`, `lesson-6`, `lesson-7`, `lesson-8`**. The review incorrectly swaps the first two and 2B/2C. Legacy literal `placeholder` URLs become empty revision URLs; no unrelated video was invented. All eight render “Video đang được cập nhật”, retain written teaching material and load quizzes. Editors must supply valid content before submitting/republishing; historical public fallback remains deliberate.

Actual migrations, in order:

```text
0001_initial_schema.sql
0002_seed_data.sql
0003_user_roles.sql
0004_content_workflow.sql
0005_migrate_legacy_content.sql
```

0003 adds roles, audit, last-admin/bootstrap guards and auth-rate storage. 0004 adds revisions, content immutability, attempt snapshots and historical reward claims. 0005 imports retained curriculum and existing database answer keys. The review's alternative migration names/descriptions are not runnable instructions.

## 6. Safe GitHub Desktop commits and recommended messages

These steps are for the owner; none was executed. GitHub documents [adding an existing local repository](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-a-repository-from-your-local-computer-to-github-desktop) and [selecting reviewed changes for a commit](https://docs.github.com/en/desktop/making-changes-in-a-branch/committing-and-reviewing-changes-to-your-project-in-github-desktop).

1. Open/add the **backend worktree path**, not the parent folder. Confirm **Current Branch = `feat/econverse2-backend`** and the repository location ends in `.worktrees/backend`. Inspect changes against the inventory, including package/lock as a pair, new migrations, APIs, tests, scripts, headers and documentation. Do not regenerate or reformat the lockfile.
2. Open/add the **frontend worktree path** separately. Confirm **Current Branch = `feat/econverse2-frontend`** and location ends in `.worktrees/frontend`. Do not switch the dirty parent `main` checkout or bring its changes into another branch. Review actual source/assets/browser tests and evidence. Include both identical `.gitignore` edits in their owning commits.
3. Do not select `.local-review`, `.motion-review`, `.qa-review`, `.playwright-cli`, `.wrangler`, `node_modules`, `dist`, environment secrets, `tests/results` or `bootstrap.sql`. Both feature worktrees' ignore rules cover these. The owner-supplied Antigravity report remains preserved at the parent `.qa-review` location; this plan records its hash and findings without staging that private folder.
4. Commit backend first, then frontend. If keeping evidence in a separate reviewed commit, finish that commit on its owning branch before integration. Do not treat either branch alone as the complete 2.0 application. Leave Publish/Push controls untouched until a separate owner decision.

Recommended messages:

| Branch / optional separation | Message |
|---|---|
| Backend implementation | `feat: add role-protected publishing and idempotent learner progress` |
| Frontend implementation | `feat: add ECONVERSE 2 learner and staff UI with accessible motion` |
| Optional separate backend review-doc commit | `docs: reconcile independent review and prepare ECONVERSE 2 integration` |
| Optional separate frontend evidence commit | `test: record ECONVERSE 2 integration and motion verification` |

Before committing either branch, a final guarded `scripts/sync-integration.mjs` run is still possible while all HEADs equal the baseline, if desired. Once source commits exist, that helper intentionally refuses differing HEADs; do not reset branches to bypass it.

## 7. Exact owner integration sequence

**Do this only after the owner has committed both source branches.** This is the remaining Git-history gate.

1. Record both feature commit SHAs and confirm the intended target branch has not advanced unexpectedly. Today's local `main` ref is at the baseline; no remote fetch or remote-state claim was made.
2. Create a **new clean** local integration worktree from the recorded common baseline. Do not reuse or overwrite the dirty parent, detached preview, or any QA directory. One-time local setup from an existing source checkout may use:

   ```powershell
   git -C "C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/backend" worktree add -b codex/econverse2-owner-integration "C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse/.worktrees/combined-owner-review" 19d3f0cc9fc89122ece5b4cd4b0cf0bcb2acd006
   ```

   Verify that branch name and destination do not already contain owner work. If they exist, preserve them and choose a new clean name/path. This setup creates no implementation commit; implementation commits remain the owner's Desktop actions.
3. Add the new path to GitHub Desktop and verify **Current Branch = `codex/econverse2-owner-integration`**, never `main`. Merge **`feat/econverse2-backend` first**, then **`feat/econverse2-frontend`** into this review branch. Use Current Branch → Choose a branch to merge into the current branch, as described in [GitHub's merge workflow](https://docs.github.com/en/desktop/working-with-your-remote-repository-on-github-or-github-enterprise/syncing-your-branch-in-github-desktop). No squash/rebase is required for this rehearsal.
4. Expected result: backend package/lock retained, both identical ignore changes coalesced, frontend UI/tests plus backend runtime/migrations/config present. If an unexpected conflict appears, stop and compare all versions; do not accept an entire side blindly. A new conflict or source change invalidates the corresponding rehearsal assumption.
5. In that actual merged checkout, run `npm ci --ignore-scripts`, typecheck, build, `npm test`, `test:learner`, and `npm audit`. Create its **own** local D1, provision disposable staff, and run `test:http`, `test:e2e`, `test:motion`, and all three `test:final-ui` engines sequentially. Choose a free loopback port consistently for Wrangler and `BASE_URL`; default wrapper port 8788 may already be occupied. For a separate port, the tested direct Wrangler invocation is `pages dev dist --port PORT --ip 127.0.0.1 --persist-to .local-review/d1`.
6. Use `MOTION_BROWSER=chrome`, `firefox`, `webkit` and `MOTION_RECORD_VIDEO=0`; `--browser=...` is not the runner switch. Set `MOTION_EVIDENCE_DIR` under ignored `tests/results/owner-merge/ENGINE` to avoid overwriting recorded motion evidence. The core runner writes to its existing evidence folder; review those generated screenshot changes separately rather than mistaking them for new application changes. Preserve source worktrees throughout; no reset/clean is required.
7. Rebuild to remove the temporary `dist/__review-axe.js`. Inspect final combined source diff, package/lock, protected files and generated evidence. Record the actual merged SHA and new results. Only then request the owner's separate PR/main-integration decision. Do not merge into `main` or push as part of this preparation task.

## 8. Remaining production gates

Production remains **NOT READY / UNVERIFIED**, independently of commit readiness:

1. The owner must identify the real Cloudflare account, Pages environment, D1 binding/database and current migration ledger. No production inventory or configuration was inspected here. Apply **only genuinely pending** migrations after backup and target-specific rehearsal; do not blindly replay the report's invented migration names or assume an empty remote database.
2. Rehearse against a protected copy of actual historical data with writes controlled, preserving IDs, owner quiz corrections, sessions, attempts, progress, XP and audit records. Verify restore/rollback before rollout. These local fresh/historical tests do not replace that production-data rehearsal.
3. Establish the real active administrator state. If no active Admin and bootstrap has never occurred, select an explicit existing active owner **ID** and generate SQL with `node scripts/bootstrap-admin.mjs EXISTING_ACTIVE_USER_ID`. Review the generated one-time statement, target and audit effects before separately authorized execution. It includes `id`, `user_id`, and `created_at`; no assumed email or default credential. If an Admin already exists, do not bootstrap again. Never delete bootstrap/audit history to retry.
4. Supply the eight genuine missing videos or obtain explicit curriculum approval to launch with the tested written-content/quiz fallback. Revisit device-specific background-media expectations if those are a product requirement.
5. Verify production TLS/cookies/security headers, routing, operational monitoring, backups, auth abuse protection and capacity. No distributed-load or production security certification is implied by local passing tests. Old application builds must not be pointed at the upgraded schema without compatibility review; rollback requires a verified restoration/forward-fix plan.
6. Decide crawler/agent-discovery policy and provide appropriate static metadata where wanted. This is an optional launch-quality decision, not a substitute for the database/security gates and not a prerequisite to preserving the legacy code.

## 9. Final verdict

**READY TO COMMIT** both reviewed feature branches through GitHub Desktop. The manifest asymmetry needs no duplicate source edit, and no confirmed application integration defect remains in this task's executed scope. The eventual committed-history merge is **not yet verified** and must pass the owner sequence above. Production remains **NOT READY / NOT ATTESTED**.
