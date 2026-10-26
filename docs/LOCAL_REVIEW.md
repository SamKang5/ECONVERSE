# Local review and owner handoff

All paths below are under `C:/Users/hkhan/OneDrive/Documents/LazyNotes/Econverse`.

| Purpose | Path | Git state |
|---|---|---|
| Original checkout (preserved) | repository root | `codex/feat/econverse2-backend` at `19d3f0c` |
| Backend and shared configuration | `.worktrees/backend` | `feat/econverse2-backend`, uncommitted |
| Learner UI and management UI | `.worktrees/frontend` | `feat/econverse2-frontend`, uncommitted |
| Combined runnable application | `.worktrees/integration` | detached `19d3f0c`, uncommitted integration copy |

The nested `ECONVERSE/.git` directory is existing Git metadata, not the application source directory. The root `.git` file points to it. Do not reset or restore the nested empty checkout: that would confuse the preserved parent workspace.

## Run the complete application

Use Node.js 24 (the local integration tests use `node:sqlite`) and npm. From `.worktrees/backend`:

```powershell
node scripts/sync-integration.mjs
```

The sync tool copies only owned changed files into the existing detached integration worktree. It checks branch names and common baseline and refuses to overwrite integration files that have been independently edited since the previous sync. It never commits or changes either source worktree. Frontend ownership includes the motion runner and five browser flows, plus the motion/final review reports. Generated screenshot/trace/video evidence stays in the frontend source folder; the runner generates fresh evidence in the checkout from which it runs. Backend owns shared configuration, including the combined private-output ignore rules.

This command is for the current **uncommitted, common-HEAD worktrees only**. Run the final sync before committing either source branch. After a source commit, its HEAD differs from the detached preview, so the guard intentionally refuses to continue. It also copies differences against HEAD, not committed branch history. Use the clean combined-branch workflow below to validate committed changes; do not reset a source branch to make the sync pass.

Then from `.worktrees/integration`:

```powershell
npm ci
npm run db:local
npm run build
npm run preview:full
```

Open [the integrated application](http://127.0.0.1:8788). The local wrapper runs pinned Wrangler `4.127.1` via npx; it can alternatively use an installed Wrangler via the `WRANGLER_BIN` environment variable. Both database and preview scripts use isolated `.local-review/d1` storage. The database command always includes `--local`. Neither command deploys or accesses a remote database.

For this session, cached Wrangler was used at `C:/Users/hkhan/AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/bin/wrangler.js`. That machine-specific path is optional and is not hardcoded in application code. The local server may already be running on port 8788; inspect it before starting a duplicate.

For UI iteration, keep the local Pages server running and use `npm run dev` in a second terminal. Vite serves on port 3000 and proxies `/api` to the local Pages server on 8788. `npm run preview` alone serves static frontend assets and does not run APIs; use `preview:full` for the actual application.

## Review each role

Register a learner through the interface. To create disposable local staff accounts, in another integration terminal run:

```powershell
npm run review:accounts
```

Admin and Editor logins are saved in ignored `.local-review/accounts.json`. Passwords are generated randomly. The setup refuses non-loopback HTTP and explicitly provisions roles using local D1 only. Repeated runs reuse the existing account file. This is a testing utility, not the production bootstrap process. The current local database also contains clearly identified test lessons/accounts from automated acceptance journeys.

After running acceptance, `npm run review:tidy` unpublishes only the generated QA lesson ID/title patterns so the learner preview shows the 13 genuine historical lessons. It refuses remote URLs and preserves every lesson, revision, attempt, progress record, XP transaction and audit entry. Revisions remain visible to staff as archived review history.

## Verification commands

```powershell
npm run typecheck
npm run build
npm test
npm run test:learner
npm run test:http
npm run test:e2e
npm run test:motion
npm run test:final-ui
npm audit
```

`npm test` runs existing backend checks, CMS/security checks, a historical-data migration rehearsal, and read-only integration ownership/path checks. `test:http` requires the local Pages server and staff fixtures. It uses real HTTP and local D1, including concurrent edit/reward tests. Its last-admin checks assume the disposable database has only the review Admin. Do not grant extra local Admins before that test.

`test:e2e` initiates Chrome with Playwright CLI, captures a structured snapshot, and executes learner/editor/admin journeys. Install `@playwright/cli` globally, or set `PLAYWRIGHT_CLI` to its `playwright-cli.js`. Tests save screenshots under `tests/e2e/econverse2-evidence` and results under ignored `tests/results`. Axe is a development dependency; its script is copied into ignored local `dist` for browser scans, not shipped in source public assets. Production builds remove that temporary test file.

`test:motion` runs the focused motion, keyboard, reduced-motion, error/retry and persistence journeys against the same local preview and staff fixtures. It runs from the combined checkout; the standalone frontend worktree can use the existing sibling preview, or set `INTEGRATION_ROOT` explicitly. Both browser suites create disposable accounts/content and modify the isolated local database; run them sequentially. Motion recordings and reports are generated under `tests/e2e/motion-evidence`, while the credential-bearing generated runner stays in ignored `.motion-review`. Use `MOTION_RECORD_VIDEO=0` when a new recording is unnecessary. `npm run test:final-ui` adds mobile confirmation, hidden required-field validation, keyboard stage focus, runtime reduced motion, account-switch and stale-response regressions. Set `MOTION_BROWSER=chrome`, `firefox`, or `webkit` and `MOTION_EVIDENCE_DIR` to keep each engine’s evidence separate. These exhaustive batches can reach the real 30-authentication-attempts/15-minute quota: use independent disposable local fixtures or wait for a new window; do not weaken production throttling. Rebuild after review if producing a distributable so the temporary axe script is removed.

Chrome and local network calls required execution outside the Codex Windows sandbox on this machine because sandbox named-pipe/socket restrictions prevented Chrome/server connectivity. Normal local terminals do not need Codex-specific changes.

## Initial production administrator (owner action only)

1. Back up and rehearse production data before approving migrations. No production migrations were applied during implementation.
2. Identify an explicit existing active owner account ID. Public registration always creates a learner.
3. Generate reviewable SQL using `node scripts/bootstrap-admin.mjs EXISTING_ACTIVE_USER_ID` and review the output. There are no hardcoded credentials and no public bootstrap endpoint.
4. An authorized database owner may execute the reviewed SQL after separately approving the target environment. The database permits a single bootstrap, requires the account to be active, rejects bootstrap when an active Admin already exists, and writes the grant and audit record atomically.

No shared-environment write, commit, push, main merge or deployment has been performed. Use GitHub Desktop to review and commit each source worktree when ready. The integration checkout is a verification copy; commit the owned source changes in their named branches.

## Safe owner commit and combined-branch review

1. Finish source review and the final guarded sync while backend, frontend and detached integration still have the same HEAD. Validate the complete preview. Review the actual current `git status --short` and `git diff` in both source worktrees; the dated acceptance reports are historical evidence, not a replacement for the current inventory.
2. In GitHub Desktop, add/open `.worktrees/backend` and `.worktrees/frontend` as separate existing repositories. Verify their current branches are exactly `feat/econverse2-backend` and `feat/econverse2-frontend`. Do not use the similarly named `codex/feat/...` branches in the preserved original checkout, and do not commit the detached integration copy.
3. Inspect the selected changes in each source checkout before committing. Keep source, migrations, manifest/lockfile, tests and reviewed documentation. Review evidence separately for size and private information. Exclude all local credentials, generated runner files, D1 state, browser profiles, builds and dependencies (`.local-review`, `.motion-review`, `.qa-review`, `.playwright-cli`, `.wrangler`, `dist`, `node_modules`, `tests/results`, and `bootstrap.sql`). Commit only each worktree's reviewed implementation. A frontend-only or backend-only commit is not the completed application.
4. In a **new clean checkout/worktree**, create an owner review branch (for example `codex/econverse2-combined-review`) from the verified common baseline `19d3f0cc9fc89122ece5b4cd4b0cf0bcb2acd006`, then merge the two committed feature branches there. Keep the existing detached preview and its local data intact. The two worktrees now contain identical combined `.gitignore` rules. If later changes produce a conflict, retain the original rules and the union of `.worktrees/`, `.local-review/`, `.wrangler/`, `tests/results/`, `bootstrap.sql`, `.motion-review/`, and `.qa-review/`. Resolve any other conflict by reviewing both versions. Do not choose one whole side for `.gitignore`.
5. Review the combined diff and verify the merge checkout has a clean status. Install with `npm ci`, migrate its own local storage, build, start its own preview, provision disposable local staff, and run the verification commands above. Stop the old preview first or use a separately configured local port; the default server and fixtures both use 8788. Do not copy credential files or local D1 state into Git. The motion runner must now run from this ordinary combined checkout without depending on the sibling worktree layout.
6. Only after the clean merged checkout passes should the owner review/push the combined branch or open a PR, according to the repository's workflow. Recheck the current target branch if it has advanced since this baseline. Merging into `main`, production backup/bootstrap/migrations and deployment remain separate owner actions.

## Content and migration limits

All 13 historical lesson IDs and 42 original quiz IDs are retained. Five historical lessons have real YouTube URLs; eight did not have a video source. Missing sources are shown explicitly. Editors must supply a valid YouTube URL before submitting or republishing those lessons. Existing source files remain preserved as migration input and are absent from the production module graph.

Migrations are additive and preserve sessions, progress, attempts and XP. Existing database quiz corrections are read into the migrated revision. The historical completion/reward ledger prevents repeated XP after migration. Re-running the content seed does not create duplicate revisions. Do not execute a destructive down-migration on a live platform; freeze writes and restore a verified pre-migration backup if rollback is required, or make an additive corrective migration. An old application build must not be pointed at an upgraded production database without review.
