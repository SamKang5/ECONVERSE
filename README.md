# ECONVERSE 2.0

React 19 / TypeScript / Vite educational platform with Cloudflare Pages Functions and D1. The 2.0 implementation provides a redesigned learner dashboard/library/player/quiz/profile, server-enforced Learner/Editor/Admin roles, versioned content drafts and review/publication, and functional staff management interfaces.

The frontend and backend changes are intentionally uncommitted on separate worktrees. Run and review the combined application from `.worktrees/integration`.

- [Local setup, worktree paths, review accounts, and owner handoff](docs/LOCAL_REVIEW.md)
- [API contract](docs/ECONVERSE2_API.md)
- [Architecture, migrations and security review](docs/ARCHITECTURE_AND_SECURITY.md)
- [Learner design QA](docs/DESIGN_QA.md)
- [Acceptance report](docs/IMPLEMENTATION_REPORT.md)
- [Final independent integration review](FINAL_INTEGRATION_REVIEW.md)
- [Exact changed-file lists](docs/CHANGED_FILES.md)

From the integrated checkout, use Node.js 24, then `npm ci`, `npm run db:local`, `npm run build`, and `npm run preview:full`. Open http://127.0.0.1:8788. `npm run dev` is a Vite UI server with `/api` proxied to Pages on port 8788.

Verification: `npm run typecheck`, `npm run build`, `npm test`, `npm run test:learner`, `npm run test:http`, `npm run test:e2e`, `npm run test:motion`, `npm run test:final-ui`, and `npm audit`. HTTP/browser acceptance requires the local Pages server and disposable staff fixtures; see the local review guide. Run browser suites sequentially against isolated local data.

All 13 historical lesson IDs and 42 quiz IDs are retained. D1 is canonical for published learner content; frontend lesson source files remain migration input only. Quiz scoring and XP are authoritative on the server. Five historical lessons have genuine video sources; missing historical sources are explicit.

No production migration, credentials/configuration change, deployment, commit, push, or merge was performed. Owner review and GitHub Desktop commit workflow are preserved.
