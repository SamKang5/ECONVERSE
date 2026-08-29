import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { DatabaseSync } from 'node:sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Import all endpoint handlers
import { onRequestPost as registerHandler } from '../functions/api/auth/register.ts';
import { onRequestPost as loginHandler } from '../functions/api/auth/login.ts';
import { onRequestPost as logoutHandler } from '../functions/api/auth/logout.ts';
import { onRequestGet as sessionHandler } from '../functions/api/auth/session.ts';
import { onRequestGet as meHandler } from '../functions/api/me.ts';
import { onRequestGet as getProgressHandler } from '../functions/api/progress/index.ts';
import { onRequestPut as putProgressHandler } from '../functions/api/progress/[lessonId].ts';
import { onRequestGet as getQuizHandler } from '../functions/api/quizzes/[lessonId]/index.ts';
import { onRequestPost as submitQuizHandler } from '../functions/api/quizzes/[lessonId]/submit.ts';
import { onRequestGet as getQuizHistoryHandler } from '../functions/api/quizzes/[lessonId]/history.ts';
import { onRequestGet as getGamificationHandler } from '../functions/api/gamification/index.ts';
import { onRequestGet as getXpHistoryHandler } from '../functions/api/gamification/xp-history.ts';
import { onRequestGet as getPetsHandler } from '../functions/api/pets/index.ts';
import { onRequestGet as getPetsMeHandler } from '../functions/api/pets/me.ts';
import { onRequestGet as getInventoryHandler } from '../functions/api/inventory/index.ts';

/**
 * Cloudflare D1 Database Adapter for node:sqlite DatabaseSync
 */
class D1MockDatabase {
  constructor() {
    this.sqlite = new DatabaseSync(':memory:');
  }

  exec(sql) {
    this.sqlite.exec(sql);
    return Promise.resolve({ count: 0, duration: 0 });
  }

  prepare(query) {
    return new D1MockPreparedStatement(this.sqlite, query);
  }

  async batch(statements) {
    this.sqlite.exec('BEGIN TRANSACTION;');
    try {
      const results = [];
      for (const stmt of statements) {
        const res = await stmt.run();
        results.push(res);
      }
      this.sqlite.exec('COMMIT;');
      return results;
    } catch (err) {
      this.sqlite.exec('ROLLBACK;');
      throw err;
    }
  }
}

class D1MockPreparedStatement {
  constructor(sqlite, query, boundValues = []) {
    this.sqlite = sqlite;
    this.query = query;
    this.boundValues = boundValues;
  }

  bind(...values) {
    return new D1MockPreparedStatement(this.sqlite, this.query, values);
  }

  async first(colName) {
    try {
      const stmt = this.sqlite.prepare(this.query);
      const row = stmt.get(...this.boundValues);
      if (!row) return null;
      if (colName) return row[colName] ?? null;
      return row;
    } catch (err) {
      throw err;
    }
  }

  async all() {
    try {
      const stmt = this.sqlite.prepare(this.query);
      const rows = stmt.all(...this.boundValues);
      return {
        results: rows || [],
        success: true,
      };
    } catch (err) {
      throw err;
    }
  }

  async run() {
    try {
      const stmt = this.sqlite.prepare(this.query);
      const info = stmt.run(...this.boundValues);
      return {
        success: true,
        meta: { changes: info.changes, last_row_id: Number(info.lastInsertRowid) },
      };
    } catch (err) {
      throw err;
    }
  }
}

// Helpers for creating simulated Request contexts
function createEventContext(env, request, params = {}) {
  return {
    request,
    env,
    params,
    functionPath: new URL(request.url).pathname,
    waitUntil: () => {},
    next: async () => new Response(),
    data: {},
  };
}

function createRequest(url, method = 'GET', body = null, cookie = null) {
  const headers = new Headers();
  if (body) {
    headers.set('Content-Type', 'application/json');
  }
  if (cookie) {
    headers.set('Cookie', cookie);
  }
  const init = {
    method,
    headers,
  };
  if (body) {
    init.body = JSON.stringify(body);
  }
  return new Request(url, init);
}

function extractCookie(response) {
  const cookieHeader = response.headers.get('Set-Cookie');
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/econverse_session=([^;]+)/);
  return match ? `econverse_session=${match[1]}` : null;
}

// ============================================================================
// TEST RUNNER
// ============================================================================

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

async function runTests() {
  console.log('\n==================================================');
  console.log('ECONVERSE BACKEND FOUNDATION AUTOMATED TEST SUITE');
  console.log('==================================================\n');

  // Initialize DB & Run Migrations
  const db = new D1MockDatabase();
  const env = { DB: db, ENVIRONMENT: 'test' };

  console.log('[1/12] Initializing D1 Database & Migrations...');
  const schemaSql = fs.readFileSync(path.join(projectRoot, 'migrations', '0001_initial_schema.sql'), 'utf8');
  const seedSql = fs.readFileSync(path.join(projectRoot, 'migrations', '0002_seed_data.sql'), 'utf8');

  await db.exec(schemaSql);
  await db.exec(seedSql);

  // Check tables
  const lessons = await db.prepare('SELECT count(*) as count FROM lessons').first('count');
  const questions = await db.prepare('SELECT count(*) as count FROM quiz_questions').first('count');
  const pets = await db.prepare('SELECT count(*) as count FROM pets').first('count');
  const items = await db.prepare('SELECT count(*) as count FROM inventory_items').first('count');

  assert(lessons === 13, `Seeded 13 lessons into D1 (actual: ${lessons})`);
  assert(questions === 42, `Seeded 42 quiz questions with backend answer keys (actual: ${questions})`);
  assert(pets === 3, `Seeded 3 companion pets (actual: ${pets})`);
  assert(items === 10, `Seeded 10 shop accessories (actual: ${items})`);

  // --------------------------------------------------------------------------
  console.log('\n[2/12] Testing User Registration (POST /api/auth/register)...');
  const regReq = createRequest('https://econverse.vn/api/auth/register', 'POST', {
    email: 'ALICE@ECONVERSE.VN',
    password: 'password123',
    displayName: 'Alice Econ',
  });
  const regRes = await registerHandler(createEventContext(env, regReq));
  assert(regRes.status === 201, 'Registration returns HTTP 201 Created');

  const regData = await regRes.json();
  assert(regData.user.email === 'alice@econverse.vn', 'Email normalized to lowercase');
  assert(regData.user.displayName === 'Alice Econ', 'Display name correctly saved');
  assert(regData.user.id.startsWith('usr_'), 'Secure random user ID generated');
  assert(!('password_hash' in regData.user), 'password_hash is NEVER returned in response');

  const aliceCookie = extractCookie(regRes);
  assert(aliceCookie !== null, 'HttpOnly session cookie generated upon registration');

  // Test duplicate registration
  const dupRegReq = createRequest('https://econverse.vn/api/auth/register', 'POST', {
    email: 'alice@econverse.vn',
    password: 'password123',
    displayName: 'Alice Clone',
  });
  const dupRegRes = await registerHandler(createEventContext(env, dupRegReq));
  assert(dupRegRes.status === 409, 'Duplicate registration returns HTTP 409 Conflict');
  const dupData = await dupRegRes.json();
  assert(dupData.error?.code === 'EMAIL_ALREADY_EXISTS', 'Returns EMAIL_ALREADY_EXISTS error code');

  // Register User B for isolation testing later
  const regBobReq = createRequest('https://econverse.vn/api/auth/register', 'POST', {
    email: 'bob@econverse.vn',
    password: 'password123',
    displayName: 'Bob Finance',
  });
  const regBobRes = await registerHandler(createEventContext(env, regBobReq));
  const bobCookie = extractCookie(regBobRes);
  assert(bobCookie !== null, 'User B (Bob) registered successfully with own session');

  // --------------------------------------------------------------------------
  console.log('\n[3/12] Testing User Login (POST /api/auth/login)...');
  // Wrong password
  const wrongLoginReq = createRequest('https://econverse.vn/api/auth/login', 'POST', {
    email: 'alice@econverse.vn',
    password: 'wrongpassword',
  });
  const wrongLoginRes = await loginHandler(createEventContext(env, wrongLoginReq));
  assert(wrongLoginRes.status === 401, 'Wrong password rejected with HTTP 401');
  const wrongLoginData = await wrongLoginRes.json();
  assert(wrongLoginData.error?.code === 'INVALID_CREDENTIALS', 'Returns INVALID_CREDENTIALS error code');

  // Valid password
  const validLoginReq = createRequest('https://econverse.vn/api/auth/login', 'POST', {
    email: 'alice@econverse.vn',
    password: 'password123',
  });
  const validLoginRes = await loginHandler(createEventContext(env, validLoginReq));
  assert(validLoginRes.status === 200, 'Valid login returns HTTP 200 OK');
  const validLoginData = await validLoginRes.json();
  assert(validLoginData.user.id === regData.user.id, 'Returns authenticated user object');
  const freshAliceCookie = extractCookie(validLoginRes);
  assert(freshAliceCookie !== null, 'New session cookie issued on login');

  // --------------------------------------------------------------------------
  console.log('\n[4/12] Testing Session Verification (GET /api/auth/session & GET /api/me)...');
  // Authenticated session check
  const sessionReq = createRequest('https://econverse.vn/api/auth/session', 'GET', null, freshAliceCookie);
  const sessionRes = await sessionHandler(createEventContext(env, sessionReq));
  const sessionData = await sessionRes.json();
  assert(sessionData.authenticated === true, 'GET /api/auth/session returns authenticated: true');
  assert(sessionData.user.email === 'alice@econverse.vn', 'Returns matching authenticated user profile');

  // Unauthenticated session check
  const anonSessionReq = createRequest('https://econverse.vn/api/auth/session', 'GET', null, null);
  const anonSessionRes = await sessionHandler(createEventContext(env, anonSessionReq));
  const anonSessionData = await anonSessionRes.json();
  assert(anonSessionData.authenticated === false, 'Unauthenticated session returns authenticated: false');

  // Profile GET /api/me
  const meReq = createRequest('https://econverse.vn/api/me', 'GET', null, freshAliceCookie);
  const meRes = await meHandler(createEventContext(env, meReq));
  assert(meRes.status === 200, 'GET /api/me returns HTTP 200');
  const meData = await meRes.json();
  assert(meData.user.displayName === 'Alice Econ', 'GET /api/me returns user display name');

  // --------------------------------------------------------------------------
  console.log('\n[5/12] Testing User Logout & Session Revocation (POST /api/auth/logout)...');
  const logoutReq = createRequest('https://econverse.vn/api/auth/logout', 'POST', null, freshAliceCookie);
  const logoutRes = await logoutHandler(createEventContext(env, logoutReq));
  assert(logoutRes.status === 200, 'Logout returns HTTP 200 OK');
  const logoutData = await logoutRes.json();
  assert(logoutData.success === true, 'Returns { success: true }');
  const logoutCookie = logoutRes.headers.get('Set-Cookie');
  assert(logoutCookie && logoutCookie.includes('Max-Age=0'), 'Set-Cookie clears session on logout');

  // Try accessing /api/me with revoked cookie
  const revokedMeReq = createRequest('https://econverse.vn/api/me', 'GET', null, freshAliceCookie);
  const revokedMeRes = await meHandler(createEventContext(env, revokedMeReq));
  assert(revokedMeRes.status === 401, 'Revoked session is rejected on protected routes (HTTP 401)');

  // Log Alice back in for subsequent tests
  const freshLoginReq = createRequest('https://econverse.vn/api/auth/login', 'POST', {
    email: 'alice@econverse.vn',
    password: 'password123',
  });
  const reLoginRes = await loginHandler(createEventContext(env, freshLoginReq));
  const activeAliceCookie = extractCookie(reLoginRes);
  assert(activeAliceCookie !== null, 'Re-login active session cookie acquired');

  // --------------------------------------------------------------------------
  console.log('\n[6/12] Testing Quiz Questions API & Security (GET /api/quizzes/:lessonId)...');
  const quizGetReq = createRequest('https://econverse.vn/api/quizzes/lesson-2a', 'GET');
  const quizGetRes = await getQuizHandler(createEventContext(env, quizGetReq, { lessonId: 'lesson-2a' }));
  assert(quizGetRes.status === 200, 'GET /api/quizzes/lesson-2a returns HTTP 200');
  const quizGetData = await quizGetRes.json();
  assert(quizGetData.questions.length === 4, 'Returns 4 questions for Lesson 2A');
  assert(Array.isArray(quizGetData.questions[0].options), 'Options formatted as array');

  // CRITICAL SECURITY ASSERTION: correct_option MUST NEVER BE EXPOSED
  let answerKeyExposed = false;
  for (const q of quizGetData.questions) {
    if ('correct_option' in q || 'correctAnswer' in q || 'explanation' in q) {
      answerKeyExposed = true;
    }
  }
  assert(!answerKeyExposed, 'CRITICAL SECURITY: correct_option and explanation are NOT leaked to client');

  // Non-existent quiz
  const notFoundQuizReq = createRequest('https://econverse.vn/api/quizzes/lesson-fake-99', 'GET');
  const notFoundQuizRes = await getQuizHandler(createEventContext(env, notFoundQuizReq, { lessonId: 'lesson-fake-99' }));
  assert(notFoundQuizRes.status === 404, 'Non-existent lesson quiz returns HTTP 404');

  // --------------------------------------------------------------------------
  console.log('\n[7/12] Testing Server-Side Quiz Evaluation & XP Award (POST /api/quizzes/:lessonId/submit)...');
  // Lesson 2A correct answers:
  // q1: 0 (A), q2: 1 (B), q3: 1 (B), q4: 1 (B)
  const submitReq = createRequest('https://econverse.vn/api/quizzes/lesson-2a/submit', 'POST', {
    answers: {
      'lesson-2a-q1': 0,
      'lesson-2a-q2': 'B', // Test both integer and letter option format
      'lesson-2a-q3': 1,
      'lesson-2a-q4': 1,
    },
    idempotencyKey: 'idemp_alice_2a_submit_001',
  }, activeAliceCookie);

  const submitRes = await submitQuizHandler(createEventContext(env, submitReq, { lessonId: 'lesson-2a' }));
  assert(submitRes.status === 200, 'Quiz submission returns HTTP 200');
  const submitData = await submitRes.json();
  assert(submitData.correctCount === 4, 'Server correctly evaluated 4/4 correct answers');
  assert(submitData.score === 100, 'Calculated score is 100');
  assert(submitData.xpAwarded === 45, 'Awarded 45 XP for Lesson 2A');
  assert(submitData.lessonCompleted === true, 'Lesson marked completed');
  assert(typeof submitData.attemptId === 'string' && submitData.attemptId.startsWith('att_'), 'Quiz attempt ID created');

  // Verify XP ledger
  const xpHdrReq = createRequest('https://econverse.vn/api/gamification/xp-history', 'GET', null, activeAliceCookie);
  const xpHdrRes = await getXpHistoryHandler(createEventContext(env, xpHdrReq));
  const xpHdrData = await xpHdrRes.json();
  assert(xpHdrData.transactions.length === 1, 'XP ledger has 1 transaction recorded');
  assert(xpHdrData.transactions[0].amount === 45, 'XP transaction amount is +45');
  assert(xpHdrData.transactions[0].referenceType === 'quiz_completion', 'Transaction reference type is quiz_completion');

  // Verify Gamification state
  const gamifReq = createRequest('https://econverse.vn/api/gamification', 'GET', null, activeAliceCookie);
  const gamifRes = await getGamificationHandler(createEventContext(env, gamifReq));
  const gamifData = await gamifRes.json();
  assert(gamifData.totalXp === 45, 'Server-side totalXp is updated to 45');
  assert(gamifData.level === 1, 'Current level is 1');

  // --------------------------------------------------------------------------
  console.log('\n[8/12] Testing Idempotency & Duplicate Prevention...');
  // Resubmit with SAME idempotency key
  const dupSubmitReq = createRequest('https://econverse.vn/api/quizzes/lesson-2a/submit', 'POST', {
    answers: {
      'lesson-2a-q1': 0,
      'lesson-2a-q2': 'B',
      'lesson-2a-q3': 1,
      'lesson-2a-q4': 1,
    },
    idempotencyKey: 'idemp_alice_2a_submit_001',
  }, activeAliceCookie);

  const dupSubmitRes = await submitQuizHandler(createEventContext(env, dupSubmitReq, { lessonId: 'lesson-2a' }));
  assert(dupSubmitRes.status === 200, 'Duplicate request returns HTTP 200');
  const dupSubmitData = await dupSubmitRes.json();
  assert(dupSubmitData.attemptId === submitData.attemptId, 'Returns existing attemptId for idempotency key');
  assert(dupSubmitData.xpAwarded === 45, 'Returns original attempt xpAwarded');

  // Verify XP was NOT doubled
  const gamifRes2 = await getGamificationHandler(createEventContext(env, createRequest('https://econverse.vn/api/gamification', 'GET', null, activeAliceCookie)));
  const gamifData2 = await gamifRes2.json();
  assert(gamifData2.totalXp === 45, 'IDEMPOTENCY VERIFIED: totalXp is still 45 (not double awarded)');

  const xpHdrRes2 = await getXpHistoryHandler(createEventContext(env, createRequest('https://econverse.vn/api/gamification/xp-history', 'GET', null, activeAliceCookie)));
  const xpHdrData2 = await xpHdrRes2.json();
  assert(xpHdrData2.transactions.length === 1, 'Ledger transactions count is still 1');

  // --------------------------------------------------------------------------
  console.log('\n[9/12] Testing Quiz Retry Behavior (No Double XP on Re-Take)...');
  const retryReq = createRequest('https://econverse.vn/api/quizzes/lesson-2a/submit', 'POST', {
    answers: {
      'lesson-2a-q1': 0,
      'lesson-2a-q2': 1,
      'lesson-2a-q3': 1,
      'lesson-2a-q4': 1,
    },
    idempotencyKey: 'idemp_alice_2a_retry_002',
  }, activeAliceCookie);

  const retryRes = await submitQuizHandler(createEventContext(env, retryReq, { lessonId: 'lesson-2a' }));
  const retryData = await retryRes.json();
  assert(retryData.correctCount === 4, 'Retry scored 4/4');
  assert(retryData.xpAwarded === 0, 'ZERO additional XP awarded because lesson was already completed');

  // Verify quiz history contains both attempts
  const historyReq = createRequest('https://econverse.vn/api/quizzes/lesson-2a/history', 'GET', null, activeAliceCookie);
  const historyRes = await getQuizHistoryHandler(createEventContext(env, historyReq, { lessonId: 'lesson-2a' }));
  const historyData = await historyRes.json();
  assert(historyData.attempts.length === 2, 'Quiz history contains both attempts');
  assert(historyData.attempts[0].xpAwarded === 0 && historyData.attempts[1].xpAwarded === 45, 'History accurately reflects XP awards per attempt');

  // --------------------------------------------------------------------------
  console.log('\n[10/12] Testing Progress API (GET /api/progress & PUT /api/progress/:lessonId)...');
  const progReq = createRequest('https://econverse.vn/api/progress', 'GET', null, activeAliceCookie);
  const progRes = await getProgressHandler(createEventContext(env, progReq));
  const progData = await progRes.json();
  assert(progData.lessons.some((l) => l.lessonId === 'lesson-2a' && l.status === 'completed'), 'Progress lists lesson-2a as completed');

  // Manual update of lesson-1c
  const putProgReq = createRequest('https://econverse.vn/api/progress/lesson-1c', 'PUT', {
    status: 'in_progress',
  }, activeAliceCookie);
  const putProgRes = await putProgressHandler(createEventContext(env, putProgReq, { lessonId: 'lesson-1c' }));
  assert(putProgRes.status === 200, 'PUT /api/progress/lesson-1c returns HTTP 200');

  const progResAfter = await getProgressHandler(createEventContext(env, createRequest('https://econverse.vn/api/progress', 'GET', null, activeAliceCookie)));
  const progDataAfter = await progResAfter.json();
  assert(progDataAfter.lessons.some((l) => l.lessonId === 'lesson-1c' && l.status === 'in_progress'), 'Progress shows lesson-1c in_progress');

  // --------------------------------------------------------------------------
  console.log('\n[11/12] Testing Pets & Inventory Endpoints...');
  const petsReq = createRequest('https://econverse.vn/api/pets', 'GET');
  const petsRes = await getPetsHandler(createEventContext(env, petsReq));
  const petsData = await petsRes.json();
  assert(petsData.pets.length === 3, 'GET /api/pets returns 3 companion pets');

  const petsMeReq = createRequest('https://econverse.vn/api/pets/me', 'GET', null, activeAliceCookie);
  const petsMeRes = await getPetsMeHandler(createEventContext(env, petsMeReq));
  const petsMeData = await petsMeRes.json();
  assert(petsMeData.activePet !== null, 'GET /api/pets/me returns active companion pet');
  assert(petsMeData.activePet.id === 'pet-bear', 'Default active pet is pet-bear (Gấu)');

  const invReq = createRequest('https://econverse.vn/api/inventory', 'GET', null, activeAliceCookie);
  const invRes = await getInventoryHandler(createEventContext(env, invReq));
  const invData = await invRes.json();
  assert(invData.inventory.length === 10, 'GET /api/inventory returns 10 catalog items');

  // --------------------------------------------------------------------------
  console.log('\n[12/12] MANDATORY USER ISOLATION TEST (Alice vs Bob)...');
  // Query Bob's profile & state
  const bobMeReq = createRequest('https://econverse.vn/api/me', 'GET', null, bobCookie);
  const bobMeRes = await meHandler(createEventContext(env, bobMeReq));
  const bobMeData = await bobMeRes.json();
  assert(bobMeData.user.email === 'bob@econverse.vn', 'Bob profile isolated from Alice');

  // Bob's progress must be empty
  const bobProgReq = createRequest('https://econverse.vn/api/progress', 'GET', null, bobCookie);
  const bobProgRes = await getProgressHandler(createEventContext(env, bobProgReq));
  const bobProgData = await bobProgRes.json();
  assert(bobProgData.lessons.length === 0, "USER ISOLATION: Bob has 0 completed lessons (Alice's progress is not shared)");
  assert(bobProgData.gamification.totalXp === 0, "USER ISOLATION: Bob has 0 XP (Alice's XP is not shared)");

  // Bob's quiz history must be empty
  const bobHistoryReq = createRequest('https://econverse.vn/api/quizzes/lesson-2a/history', 'GET', null, bobCookie);
  const bobHistoryRes = await getQuizHistoryHandler(createEventContext(env, bobHistoryReq, { lessonId: 'lesson-2a' }));
  const bobHistoryData = await bobHistoryRes.json();
  assert(bobHistoryData.attempts.length === 0, "USER ISOLATION: Bob has 0 quiz attempts for Lesson 2A");

  // Bob completes Unit 1D
  const bobSubmitReq = createRequest('https://econverse.vn/api/quizzes/lesson-1d/submit', 'POST', {
    answers: {
      'lesson-1d-q1': 2,
      'lesson-1d-q2': 1,
      'lesson-1d-q3': 1,
      'lesson-1d-q4': 2,
    },
    idempotencyKey: 'idemp_bob_1d_submit_001',
  }, bobCookie);
  const bobSubmitRes = await submitQuizHandler(createEventContext(env, bobSubmitReq, { lessonId: 'lesson-1d' }));
  const bobSubmitData = await bobSubmitRes.json();
  assert(bobSubmitData.correctCount === 4 && bobSubmitData.xpAwarded === 45, 'Bob completed Lesson 1D and earned 45 XP');

  // Verify Alice still only has Lesson 2A and Lesson 1C
  const aliceProgReqFinal = createRequest('https://econverse.vn/api/progress', 'GET', null, activeAliceCookie);
  const aliceProgRes = await getProgressHandler(createEventContext(env, aliceProgReqFinal));
  const aliceProgData = await aliceProgRes.json();
  assert(!aliceProgData.lessons.some((l) => l.lessonId === 'lesson-1d'), "USER ISOLATION: Alice does NOT have Bob's Lesson 1D completion");
  assert(aliceProgData.gamification.totalXp === 45, 'USER ISOLATION: Alice totalXp remains unchanged at 45');

  console.log('\n==================================================');
  console.log(`TEST RESULTS: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
  console.log('==================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test suite failed with unexpected error:', err);
  process.exit(1);
});
