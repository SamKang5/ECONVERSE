# Independent identity lifecycle reproduction

Local integrated preview: http://127.0.0.1:8788. Chrome, isolated Playwright CLI session econverse-identity-review. Old integrated build before parent lifecycle fixes. No source, sync, build, production, or extra Admin grants. Session closed after reproduction.

## Confirmed: same-role editor account switch

Opened a clearly tagged unpublished private QA draft as Editor A. Swapped to an existing live session for disposable Editor B and dispatched the same window focus event used by the application session refresh. Waited until account header identified B.

Observed: A's private title remained visible in an enabled draft editor. Direct GET for that revision using B's session returned HTTP 404. Backend authorization was correct; frontend retained author-scoped state across equal-role account changes.

Expected: private management state is discarded/reloaded for B.

## Confirmed: delayed old-account profile-save callback

Issued a real profile PATCH as A using A's existing unchanged display name, fetched its successful server response, then held delivery. Switched active browser cookies to B and waited until the header identified B. Released A's held PATCH while holding the fresh session refresh that its callback triggered.

Observed: callback restored A's account identity and displayed the saved-profile success notice. No identity API payload was fabricated; only real response delivery was delayed. Released the final session refresh afterwards and observed B restored.

Expected: the old component/request cannot call the account update callback after the account changed.

## Confirmed: empty default revision filter

Same Editor A session: All statuses showed No revisions here yet; GET studio/lessons?status= returned total 0. GET with status=draft returned total 10, including tagged private QA drafts.

Expected: All statuses includes those drafts. Server receives empty status as empty string rather than null.

## Sanitized results

- Authentication requests across all setup/reproduction attempts: 6; no 429.
- sameRoleSwitch.currentAccountIsB: true
- sameRoleSwitch.previousPrivateTitleStillVisible: true
- sameRoleSwitch.serverAccessStatus: 404
- sameRoleSwitch.editorRemainsMounted: true
- lateProfileSave.currentAccountWasB: true
- lateProfileSave.oldSaveResponseRestoredAIdentity: true
- lateProfileSave.oldSaveSuccessVisible: true
- allStatuses.uiEmpty: true
- allStatuses.apiTotal: 0
- draftApiTotal: 10

Two disposable local QA Editor accounts and two unpublished tagged QA drafts were created during setup. Existing Editor profile name was sent unchanged. Credential-bearing reproduction scripts are private ignored QA files, not evidence for publication.
