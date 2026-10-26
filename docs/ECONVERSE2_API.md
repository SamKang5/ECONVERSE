# ECONVERSE 2.0 local implementation contract

Baseline: `19d3f0cc9fc89122ece5b4cd4b0cf0bcb2acd006`. Existing auth, progress, quiz, gamification, inventory and pet routes remain available. JSON errors use `{error:{code,message}}`; statuses are 400 validation, 401 unauthenticated, 403 forbidden/CSRF, 404 absent, 409 stale revision/invalid transition. All mutations require same-origin `Origin` (or `Sec-Fetch-Site: same-origin`), JSON, and session authentication except public registration/login. Responses containing personal or draft content use `Cache-Control: no-store`.

`PublicUser` adds `role: 'learner'|'editor'|'admin'`. Server resolves current role and activation from D1 for every request. Registration ignores browser roles. No HTTP admin bootstrap endpoint.

## Published content

- `GET /api/courses` → `{courses: CourseModule[]}`. CourseModule retains existing `id,title,description,category,icon,lessons`. Lesson retains existing fields (`id,order,title,shortDescription,duration,videoUrl,youtubeId,overview,mainContentTitle,mainContent,objectives,summary,pointsReward`) plus `revisionId`; no `quiz`, answer keys or explanations.
- `GET /api/lessons/:lessonId` → `{lesson: PublishedLesson}`.
- Existing `GET /api/quizzes/:lessonId` → `{lessonId,revisionId,questions:[{id,questionOrder,questionText,options}]}`. Submission accepts optional `revisionId` and returns 409 if supplied revision is stale.
- Existing `POST /api/quizzes/:lessonId/submit` retains `{answers,idempotencyKey}` and result fields; adds `feedback:[{id,correctAnswer,explanation}]` after submission. Rewards remain server authoritative, once per learner/lesson, with durable uniqueness.
- `PATCH /api/me` accepts `{displayName}` and returns `{user}`.

## Studio (editor/admin)

Revision content is `{moduleId,moduleTitle,moduleDescription,category,unitCode,episodeCode,title,shortDescription,duration,videoUrl,overview,mainContentTitle,mainContent:string[],objectives:string[],summary:{title,points:string[]},pointsReward,quiz:[{id,question,options:string[],correctAnswer:number,explanation}]}`. Plain text rendering only. Fields other than summary are required on publishing; optional legacy fields are retained in migrated content. Videos may be empty for historical lessons awaiting a source; publishing new content requires an allowed YouTube URL. `pointsReward` is 0–1000. `category` is economics/finance.

Revision DTO: `{id,lessonId,version,lockVersion,status,content,createdBy,updatedAt,feedback}`. Status: draft/in_review/published/archived. `lockVersion` is required for every revision mutation, including submit/publish/reject/unpublish; successful updates increment it. Published content is immutable; editing creates a separate draft.

Incomplete draft content can be saved; review submission and publication require complete validated content. Another editor's private draft returns 404 to avoid disclosing its existence. Learners receive 403 at the Studio role gate. `PUT /api/progress/:lessonId` accepts only `not_started`/`in_progress`; only server-side quiz grading can mark completion, and completed progress cannot regress.

`GET /api/progress` adds `updatedAt` to each lesson and orders lessons by most recently viewed/updated first. Opening a completed lesson records its view without changing completion or XP. Continue Learning selects the most recently active unfinished lesson.

- `GET /api/studio/lessons?status=&page=1&pageSize=25` → `{revisions: Revision[],total,page,pageSize}`. Editors see their own drafts plus published content; admins see all.
- `POST /api/studio/lessons` body `{lessonId,content}` → `{revision}` (201).
- `POST /api/studio/lessons/:lessonId/revisions` → `{revision}` (201), clones published/latest authorized content into an owned draft.
- `GET /api/studio/revisions/:id` → `{revision}` (privileged preview).
- `PATCH /api/studio/revisions/:id` body `{lockVersion,content}` → `{revision}`.
- `POST /api/studio/revisions/:id/submit-review` body `{lockVersion}` → `{revision}`.

## Admin

- `POST /api/admin/revisions/:id/publish` body `{lockVersion}` → `{revision}`; only in_review revisions. Atomic content pointer + quiz publication + audit.
- `POST /api/admin/revisions/:id/reject` body `{lockVersion,feedback}` → `{revision}`; in_review → draft.
- `POST /api/admin/revisions/:id/unpublish` body `{lockVersion}` → `{revision}`; clears live pointer and archives revision.
- `GET /api/admin/users?search=&page=1&pageSize=25` → `{users:[{...PublicUser,isActive:boolean}],total,page,pageSize}`.
- `PATCH /api/admin/users/:id` body `{role?,isActive?}` → `{user}`. Last active admin protected at database level.
- `GET /api/admin/analytics` → `{users,activeUsers,publishedLessons,completedLessons,quizAttempts,totalXp,roles:{learner,editor,admin}}`.
- `GET /api/admin/audit?page=1&pageSize=25` → `{entries:[{id,actorId,action,targetId,metadata,createdAt}],total,page,pageSize}`.

## Migration and review

Additive migrations preserve users, sessions, historical lesson/question IDs, attempts, progress and XP. Existing hardcoded course sources are migration input only and must not be imported by production learner components. Local rehearsals use isolated SQLite/D1 storage. Existing shared/production databases are untouched. No commits, pushes, main merges or deployments are authorized.
