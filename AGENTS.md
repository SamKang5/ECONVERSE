# Agent & Developer Instructions: Browser Testing & Debugging

This project uses an agent-friendly browser testing and deep debugging workflow designed for reliability, token efficiency, and actionable diagnosis.

## Testing Architecture

1. **Primary Automation Layer**: **Playwright CLI (`playwright-cli`) + Agent Skills**
   - Use for running browser automation, verifying user journeys, capturing DOM accessibility snapshots, executing interactions, and taking screenshots.
   - Skill configuration is stored in `.agents/skills/playwright-cli/`.
2. **Secondary Diagnostic Layer**: **Chrome DevTools MCP / Skills**
   - Use for deep debugging when Playwright test failures or runtime anomalies require inspection of console logs, network payloads, DOM rendering/CSS layout, or performance traces.
   - Skill configuration is stored in `.agents/skills/chrome-devtools/`.
3. **No Playwright MCP**:
   - Do **NOT** install or use `@playwright/mcp` unless persistent, long-running agent browser sessions are explicitly required and justified. Playwright CLI provides lightweight, discrete session control without unnecessary agent loop overhead.

---

## Testing Workflows

### 1. Normal Development Task

```text
Inspect code
→ Implement feature
→ Start application (`npm run dev`)
→ Run Playwright CLI (`playwright-cli open <url>`)
→ Execute relevant user flow (`click`, `fill`, `snapshot`, etc.)
→ Verify result against structured DOM / snapshots
→ Fix any failures
→ Retest and close browser (`playwright-cli close`)
```

### 2. Debugging Task

```text
Reproduce issue with Playwright CLI
→ Capture snapshot and screenshot
→ If root cause is unclear:
   Use Chrome DevTools MCP / Skills
   → Inspect console logs & uncaught exceptions
   → Inspect network calls (status codes, payloads, auth cookies)
   → Inspect DOM computed layout and visibility
   → Trace performance / re-render loops
→ Identify exact root cause
→ Implement code fix
→ Rerun the reproduction flow with Playwright CLI
→ Verify fix
```

### 3. Cross-Browser Task

Use Playwright CLI across target browsers:
- Chromium / Google Chrome (default)
- Mozilla Firefox (`playwright-cli open --browser=firefox`)
- WebKit / Safari engine (`playwright-cli open --browser=webkit`)
- Microsoft Edge where installed/supported

---

## Project Testing Conventions

Browser and E2E tests are organized in `tests/e2e/`:
```text
tests/
  e2e/
    auth/           # Login, logout, signup, session persistence
    lessons/        # Course catalog, lesson player, video playback
    quiz/           # Quiz flow, multiple-choice selection, submissions
    progress/       # XP tracking, completion badges, course milestones
    gamification/   # Leaderboards, streaks, achievements
```

### User Journey Prioritization
Prioritize real end-to-end user journeys over isolated implementation details.
*Example Core User Flow:*
```text
Open application
→ Login with test user
→ Navigate to lesson catalog
→ Open target lesson
→ Interact with lesson materials
→ Complete quiz questions
→ Submit quiz
→ Verify score calculation
→ Verify updated learner progress and XP
```

---

## Browser Testing Rules

1. **Use Playwright CLI + Skills by default**:
   - Always initiate tests via `playwright-cli open`, `snapshot`, `click`, `fill`, etc.
2. **Use Chrome DevTools for deep browser debugging**:
   - When test failures lack obvious causes, inspect network payloads, console errors, or performance profiles with Chrome DevTools.
3. **Structured DOM over screenshots**:
   - Do **NOT** use browser screenshots as the primary source of truth when structured DOM/accessibility information is available in snapshots (`playwright-cli snapshot`, `find`). Use screenshots only for visual regression or final artifact evidence.
4. **Prefer deterministic selectors**:
   - Target semantic accessibility elements (`role`, `accessible name`), text content, or explicit `data-testid` attributes. Avoid brittle CSS hierarchies (`div > div:nth-child(3)`).
5. **Avoid arbitrary fixed sleeps**:
   - Do not use arbitrary timeouts (e.g. `sleep 5000`). Rely on state verification, element presence in snapshots, or network route responses.
6. **Reproduce bugs before changing code**:
   - Always run the reproduction flow with Playwright CLI first to observe and confirm the failure before modifying application logic.
7. **Rerun reproduction after fixing**:
   - Once fixed, execute the exact same flow that previously failed to ensure complete resolution.
8. **Test complete user journeys**:
   - For user-facing features, validate the whole path from navigation to persistent state rather than testing components in isolation.
9. **Report exact failing step and likely root cause**:
   - In all bug and test reports, detail the exact step that failed, the expected vs. actual outcome, and the diagnostic findings.
