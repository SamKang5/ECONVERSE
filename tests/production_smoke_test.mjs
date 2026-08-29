/**
 * ECONVERSE PRODUCTION LIVE SMOKE TEST SUITE
 * Tests the live deployment directly against https://econverse.pages.dev
 */

const BASE_URL = 'https://econverse.pages.dev';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

function extractCookie(response) {
  const cookieHeader = response.headers.get('set-cookie');
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/econverse_session=([^;]+)/);
  return match ? `econverse_session=${match[1]}` : null;
}

async function request(path, options = {}, cookie = null) {
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (cookie) {
    headers.set('Cookie', cookie);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return { res, data, cookie: extractCookie(res) };
}

async function runProductionSmokeTests() {
  console.log('\n======================================================');
  console.log('ECONVERSE PRODUCTION LIVE SMOKE TEST SUITE');
  console.log(`Target: ${BASE_URL}`);
  console.log('======================================================\n');

  // --------------------------------------------------------------------------
  console.log('[Test A] Guest Access & Public Content...');
  const home = await request('/');
  assert(home.res.status === 200, 'Homepage loaded (HTTP 200)');
  assert(typeof home.data === 'string' && home.data.includes('ECONVERSE'), 'Homepage HTML contains ECONVERSE brand');

  const guestSession = await request('/api/auth/session');
  assert(guestSession.res.status === 200, 'Guest session check returns HTTP 200');
  assert(guestSession.data.authenticated === false, 'Guest session authenticated: false');

  const publicPets = await request('/api/pets');
  assert(publicPets.res.status === 200, 'Public pets API returns HTTP 200');
  assert(publicPets.data.pets?.length === 3, 'Public pets API returns 3 companion pets');

  const publicQuiz = await request('/api/quizzes/lesson-2a');
  assert(publicQuiz.res.status === 200, 'Public quiz questions API returns HTTP 200');
  assert(publicQuiz.data.questions?.length === 4, 'Returns 4 questions for Lesson 2A');
  
  let answerKeyExposed = false;
  for (const q of publicQuiz.data.questions || []) {
    if ('correct_option' in q || 'correctAnswer' in q || 'explanation' in q) {
      answerKeyExposed = true;
    }
  }
  assert(!answerKeyExposed, 'CRITICAL SECURITY: correct_option & explanation are NOT leaked to guest');

  // --------------------------------------------------------------------------
  console.log('\n[Test B] User Registration on Production...');
  const timestamp = Date.now();
  const aliceEmail = `alice_prod_${timestamp}@econverse.vn`;
  const alicePassword = 'password123';
  const aliceName = `Alice Prod ${timestamp}`;

  const regRes = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: aliceEmail,
      password: alicePassword,
      displayName: aliceName,
    }),
  });

  assert(regRes.res.status === 201, 'Registration returns HTTP 201 Created');
  assert(regRes.data.user?.email === aliceEmail.toLowerCase(), 'User email normalized');
  assert(regRes.data.user?.displayName === aliceName, 'Display name matches');
  assert(regRes.data.user?.id?.startsWith('usr_'), 'User ID starts with usr_');
  assert(!('password_hash' in (regRes.data.user || {})), 'password_hash is NEVER returned');

  const rawSetCookie = regRes.res.headers.get('set-cookie') || '';
  assert(rawSetCookie.includes('HttpOnly'), 'Session cookie has HttpOnly flag');
  assert(rawSetCookie.includes('SameSite=Lax'), 'Session cookie has SameSite=Lax flag');
  assert(rawSetCookie.includes('Secure'), 'Session cookie has Secure flag on production HTTPS');

  const aliceCookie = regRes.cookie;
  assert(aliceCookie !== null, 'Session cookie captured');

  // --------------------------------------------------------------------------
  console.log('\n[Test C] Session Persistence (Refresh Simulation)...');
  const meRes = await request('/api/me', { method: 'GET' }, aliceCookie);
  assert(meRes.res.status === 200, 'GET /api/me returns HTTP 200 with session cookie');
  assert(meRes.data.user?.email === aliceEmail.toLowerCase(), 'Profile matches registered user');

  const sessionCheck = await request('/api/auth/session', { method: 'GET' }, aliceCookie);
  assert(sessionCheck.data.authenticated === true, 'Session check returns authenticated: true');

  // --------------------------------------------------------------------------
  console.log('\n[Test D] Progress Synchronization...');
  const updateProg = await request('/api/progress/lesson-1c', {
    method: 'PUT',
    body: JSON.stringify({ status: 'in_progress' }),
  }, aliceCookie);
  assert(updateProg.res.status === 200, 'PUT /api/progress/lesson-1c returns HTTP 200');

  const getProg = await request('/api/progress', { method: 'GET' }, aliceCookie);
  assert(getProg.res.status === 200, 'GET /api/progress returns HTTP 200');
  assert(getProg.data.lessons?.some(l => l.lessonId === 'lesson-1c' && l.status === 'in_progress'), 'Progress contains lesson-1c with status in_progress');

  // --------------------------------------------------------------------------
  console.log('\n[Test E] Live Quiz Submission & Server-Side XP Award...');
  const quizSubmit = await request('/api/quizzes/lesson-2a/submit', {
    method: 'POST',
    body: JSON.stringify({
      answers: {
        'lesson-2a-q1': 0,
        'lesson-2a-q2': 1,
        'lesson-2a-q3': 1,
        'lesson-2a-q4': 1,
      },
      idempotencyKey: `idemp_prod_alice_2a_${timestamp}`,
    }),
  }, aliceCookie);

  assert(quizSubmit.res.status === 200, 'Quiz submission returns HTTP 200');
  assert(quizSubmit.data.score === 100, 'Server evaluated 100% score');
  assert(quizSubmit.data.correctCount === 4, 'Server evaluated 4/4 correct');
  assert(quizSubmit.data.xpAwarded === 45, 'Server awarded 45 XP');
  assert(quizSubmit.data.lessonCompleted === true, 'Lesson marked completed');

  const gamif = await request('/api/gamification', { method: 'GET' }, aliceCookie);
  assert(gamif.data.totalXp === 45, 'Gamification totalXp is updated to 45 on production D1');

  const xpHdr = await request('/api/gamification/xp-history', { method: 'GET' }, aliceCookie);
  assert(xpHdr.data.transactions?.length === 1, 'XP ledger has 1 transaction');
  assert(xpHdr.data.transactions?.[0]?.amount === 45, 'XP transaction amount is 45');

  // --------------------------------------------------------------------------
  console.log('\n[Test F] XP & Progress Persistence...');
  const progAfter = await request('/api/progress', { method: 'GET' }, aliceCookie);
  assert(progAfter.data.lessons?.some(l => l.lessonId === 'lesson-2a' && l.status === 'completed'), 'Lesson 2A is persisted as completed');

  // --------------------------------------------------------------------------
  console.log('\n[Test G] Idempotency & Retry on Completed Lesson (Zero Double XP)...');
  const retrySubmit = await request('/api/quizzes/lesson-2a/submit', {
    method: 'POST',
    body: JSON.stringify({
      answers: {
        'lesson-2a-q1': 0,
        'lesson-2a-q2': 1,
        'lesson-2a-q3': 1,
        'lesson-2a-q4': 1,
      },
      idempotencyKey: `idemp_prod_alice_2a_retry_${timestamp}`,
    }),
  }, aliceCookie);

  assert(retrySubmit.res.status === 200, 'Retry returns HTTP 200');
  assert(retrySubmit.data.score === 100, 'Score is 100%');
  assert(retrySubmit.data.xpAwarded === 0, 'ZERO additional XP awarded on retake of completed lesson');

  const gamifAfterRetry = await request('/api/gamification', { method: 'GET' }, aliceCookie);
  assert(gamifAfterRetry.data.totalXp === 45, 'Total XP remains unchanged at 45');

  // --------------------------------------------------------------------------
  console.log('\n[Test H] User Logout & Session Revocation...');
  const logoutRes = await request('/api/auth/logout', { method: 'POST' }, aliceCookie);
  assert(logoutRes.res.status === 200, 'Logout returns HTTP 200');

  const meAfterLogout = await request('/api/me', { method: 'GET' }, aliceCookie);
  assert(meAfterLogout.res.status === 401, 'Revoked session receives HTTP 401 UNAUTHORIZED');

  // --------------------------------------------------------------------------
  console.log('\n[Test I] Login Again with Same Credentials...');
  const loginRes = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: aliceEmail,
      password: alicePassword,
    }),
  });

  assert(loginRes.res.status === 200, 'Login returns HTTP 200');
  const freshAliceCookie = loginRes.cookie;
  assert(freshAliceCookie !== null, 'New session cookie issued on login');

  const progReLogin = await request('/api/progress', { method: 'GET' }, freshAliceCookie);
  assert(progReLogin.data.lessons?.some(l => l.lessonId === 'lesson-2a' && l.status === 'completed'), 'Completed lessons restored upon re-login');
  assert(progReLogin.data.gamification?.totalXp === 45, '45 XP restored upon re-login');

  // --------------------------------------------------------------------------
  console.log('\n[Test J] User Isolation on Production (Alice vs Bob)...');
  const bobEmail = `bob_prod_${timestamp}@econverse.vn`;
  const bobPassword = 'password123';
  const bobName = `Bob Prod ${timestamp}`;

  const regBob = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email: bobEmail,
      password: bobPassword,
      displayName: bobName,
    }),
  });

  const bobCookie = regBob.cookie;
  assert(bobCookie !== null, 'User B (Bob) registered on production');

  const bobProg = await request('/api/progress', { method: 'GET' }, bobCookie);
  assert(bobProg.data.lessons?.length === 0, "USER ISOLATION: Bob has 0 completed lessons (Alice's progress is not shared)");
  assert(bobProg.data.gamification?.totalXp === 0, "USER ISOLATION: Bob has 0 XP (Alice's XP is not shared)");

  // Bob completes Unit 1D
  const bobSubmit = await request('/api/quizzes/lesson-1d/submit', {
    method: 'POST',
    body: JSON.stringify({
      answers: {
        'lesson-1d-q1': 2,
        'lesson-1d-q2': 1,
        'lesson-1d-q3': 1,
        'lesson-1d-q4': 2,
      },
      idempotencyKey: `idemp_prod_bob_1d_${timestamp}`,
    }),
  }, bobCookie);

  assert(bobSubmit.res.status === 200, 'Bob completed Lesson 1D');
  assert(bobSubmit.data.xpAwarded === 45, 'Bob earned 45 XP');

  // Verify Alice still only has 2A and 1C
  const aliceFinalProg = await request('/api/progress', { method: 'GET' }, freshAliceCookie);
  assert(!aliceFinalProg.data.lessons?.some(l => l.lessonId === 'lesson-1d'), "USER ISOLATION: Alice does NOT have Bob's 1D completion");
  assert(aliceFinalProg.data.gamification?.totalXp === 45, 'USER ISOLATION: Alice totalXp remains unchanged at 45');

  console.log('\n======================================================');
  console.log(`PRODUCTION SMOKE TEST RESULTS: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runProductionSmokeTests().catch(err => {
  console.error('Production smoke tests failed:', err);
  process.exit(1);
});
