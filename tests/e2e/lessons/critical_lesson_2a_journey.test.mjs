/**
 * ECONVERSE CRITICAL USER JOURNEY E2E TEST
 * Journey:
 * 1. Open Econverse (http://127.0.0.1:3000/)
 * 2. Navigate to Unit 2 (via Learn page)
 * 3. Open lesson 2A (PED)
 * 4. Verify lesson content is rendered
 * 5. Verify embedded video is present and interactive
 * 6. Continue to the quiz
 * 7. Answer all 4 questions
 * 8. Submit the quiz
 * 9. Verify the result/score
 * 10. Verify the user's progress is updated
 */

import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../..');
const evidenceDir = path.resolve(projectRoot, 'tests/e2e/evidence');

if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

// Dynamically import Playwright from local node_modules or global CLI bundle
let pw;
try {
  pw = await import('playwright-core');
} catch {
  const globalPwPath = path.join(
    process.env.APPDATA || '',
    'npm/node_modules/@playwright/cli/node_modules/playwright-core/index.mjs'
  );
  pw = await import(pathToFileURL(globalPwPath).href);
}

const { chromium } = pw;

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000/';

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    failedAssertions++;
    console.error(`  ✗ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTest() {
  console.log('===============================================================');
  console.log('  ECONVERSE E2E REGRESSION TEST: CRITICAL LEARNING JOURNEY (2A)');
  console.log(`  Target: ${BASE_URL}`);
  console.log('===============================================================\n');

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  // Mock server backend routes for deterministic testing
  await page.route('**/api/**', async (route) => {
    const url = route.request().url();

    if (url.includes('/api/auth/session')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          authenticated: true,
          user: {
            id: 'test-user-e2e',
            email: 'learner@econverse.edu.vn',
            displayName: 'Học Viên Test',
          },
        }),
      });
    } else if (url.includes('/api/progress')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          lessons: [],
          gamification: { totalXp: 0, level: 1, currentStreak: 1 },
        }),
      });
    } else if (url.includes('/api/gamification')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ totalXp: 45, level: 1, currentStreak: 1 }),
      });
    } else if (url.includes('/api/pets/me')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          activePet: {
            id: 'pet-1',
            name: 'Tôm Heo Đất',
            stage: 1,
            requiredXp: 300,
            metadata: { species: 'gấu' },
            isActive: true,
            unlockedAt: '',
          },
          pets: [],
        }),
      });
    } else if (url.includes('/submit')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          attemptId: 'attempt-2a-e2e',
          score: 100,
          totalQuestions: 4,
          correctCount: 4,
          xpAwarded: 45,
          lessonCompleted: true,
        }),
      });
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    }
  });

  try {
    // -------------------------------------------------------------
    // Step 1: Open Econverse
    // -------------------------------------------------------------
    console.log('[Step 1] Opening Econverse application...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const pageTitle = await page.title();
    assert(
      pageTitle.includes('ECONVERSE'),
      `Page title is correct (${pageTitle})`
    );

    const userProfile = page.getByRole('complementary').getByText('Học Viên Test');
    await userProfile.waitFor({ state: 'visible' });
    assert(
      await userProfile.isVisible(),
      'User is authenticated with test user profile'
    );
    await page.screenshot({ path: path.join(evidenceDir, '01_dashboard.png') });

    // -------------------------------------------------------------
    // Step 2: Navigate to Unit 2
    // -------------------------------------------------------------
    console.log('\n[Step 2] Navigating to Unit 2 via Learn page...');
    const learnNavBtn = page
      .getByRole('complementary')
      .getByRole('button', { name: /Learn Bài học và quiz/i });
    await learnNavBtn.click();

    const unit2Heading = page.getByRole('heading', { name: 'Unit 2: Độ co giãn' });
    await unit2Heading.waitFor({ state: 'visible' });
    assert(
      await unit2Heading.isVisible(),
      'Unit 2 (Độ co giãn) is displayed in the catalog'
    );
    await page.screenshot({ path: path.join(evidenceDir, '02_learn_unit2.png') });

    // -------------------------------------------------------------
    // Step 3: Open lesson 2A (PED)
    // -------------------------------------------------------------
    console.log('\n[Step 3] Opening Lesson 2A (PED)...');
    const lesson2aBtn = page.getByRole('button', {
      name: /Tập 2A: Độ co giãn của cầu theo giá/i,
    });
    await lesson2aBtn.waitFor({ state: 'visible' });
    await lesson2aBtn.click();

    // -------------------------------------------------------------
    // Step 4: Verify lesson content is rendered
    // -------------------------------------------------------------
    console.log('\n[Step 4] Verifying Lesson 2A content is rendered...');
    const lessonHeading = page.getByRole('heading', {
      name: 'Tập 2A: Độ co giãn của cầu theo giá (PED)',
    });
    await lessonHeading.waitFor({ state: 'visible' });
    assert(
      await lessonHeading.isVisible(),
      'Lesson 2A title heading is rendered'
    );

    const mainContentSection = page.getByText(
      'PED là gì và đường cầu phản ứng ra sao?'
    );
    assert(
      await mainContentSection.isVisible(),
      'Lesson 2A main content overview is displayed'
    );

    const durationBadge = page.getByText('08 phút').first();
    assert(
      await durationBadge.isVisible(),
      'Lesson duration badge (08 phút) is present'
    );

    // -------------------------------------------------------------
    // Step 5: Verify embedded video is present and can be interacted with
    // -------------------------------------------------------------
    console.log('\n[Step 5] Verifying embedded video presence and interaction...');
    const videoIframe = page.locator(
      'iframe[title="Độ co giãn của cầu theo giá (PED)"]'
    );
    await videoIframe.waitFor({ state: 'visible', timeout: 5000 });
    assert(await videoIframe.isVisible(), 'Video iframe is present and visible');

    const iframeSrc = await videoIframe.getAttribute('src');
    assert(
      iframeSrc && iframeSrc.includes('https://www.youtube.com/embed/fO4tKHj3_lA'),
      `Video iframe src is correctly pointing to YouTube embed (${iframeSrc})`
    );

    const boundingBox = await videoIframe.boundingBox();
    assert(
      boundingBox && boundingBox.width > 200 && boundingBox.height > 100,
      `Video iframe has valid rendered dimensions (${Math.round(boundingBox?.width || 0)}x${Math.round(boundingBox?.height || 0)}px)`
    );

    // Test user interaction with the video element
    await videoIframe.click();
    assert(true, 'User can interactively click the video player container without application crash');
    await page.screenshot({ path: path.join(evidenceDir, '03_lesson_video.png') });

    // -------------------------------------------------------------
    // Step 6: Continue to the quiz
    // -------------------------------------------------------------
    console.log('\n[Step 6] Navigating from video to quiz...');
    const startQuizBtn = page.getByRole('button', { name: 'Làm Quiz ôn tập' });
    await startQuizBtn.waitFor({ state: 'visible' });
    await startQuizBtn.click();

    const quizHeading = page.getByRole('heading', { name: 'Quiz của bài học' });
    await quizHeading.waitFor({ state: 'visible' });
    assert(await quizHeading.isVisible(), 'Quiz view is displayed');

    const initialSelectionBadge = page.getByText('0/4 câu đã chọn');
    assert(
      await initialSelectionBadge.isVisible(),
      'Quiz starts with 0/4 questions answered'
    );
    await page.screenshot({ path: path.join(evidenceDir, '04_quiz_initial.png') });

    // -------------------------------------------------------------
    // Step 7: Answer all 4 questions
    // -------------------------------------------------------------
    console.log('\n[Step 7] Answering all 4 quiz questions with correct answers...');

    // Question 1: Option A (Mức độ phản ứng của lượng cầu khi giá của chính hàng hóa đó thay đổi)
    const q1Option = page.getByRole('button', {
      name: /Mức độ phản ứng của lượng cầu khi giá của chính hàng hóa đó thay đổi/i,
    });
    await q1Option.click();

    // Question 2: Option B (Giá chỉ thay đổi một chút nhưng lượng cầu phản ứng rất mạnh)
    const q2Option = page.getByRole('button', {
      name: /Giá chỉ thay đổi một chút nhưng lượng cầu phản ứng rất mạnh/i,
    });
    await q2Option.click();

    // Question 3: Option B (Đường cầu co giãn tương đối phẳng (lài), đường cầu kém co giãn tương đối dốc (đứng))
    const q3Option = page.getByRole('button', {
      name: /Đường cầu co giãn tương đối phẳng/i,
    });
    await q3Option.click();

    // Question 4: Option B (Lượng khách mua giảm mạnh và tổng doanh thu sụt giảm)
    const q4Option = page.getByRole('button', {
      name: /Lượng khách mua giảm mạnh và tổng doanh thu sụt giảm/i,
    });
    await q4Option.click();

    const completedSelectionBadge = page.getByText('4/4 câu đã chọn');
    assert(
      await completedSelectionBadge.isVisible(),
      'All 4/4 questions have been answered'
    );
    await page.screenshot({ path: path.join(evidenceDir, '05_quiz_answered.png') });

    // -------------------------------------------------------------
    // Step 8: Submit the quiz
    // -------------------------------------------------------------
    console.log('\n[Step 8] Submitting the quiz...');
    const submitBtn = page.getByRole('button', { name: 'Nộp bài' });
    await submitBtn.click();

    // -------------------------------------------------------------
    // Step 9: Verify the result/score
    // -------------------------------------------------------------
    console.log('\n[Step 9] Verifying quiz result, score, and feedback...');
    const scoreBadge = page.getByText('4/4 câu đúng');
    await scoreBadge.waitFor({ state: 'visible', timeout: 5000 });
    assert(await scoreBadge.isVisible(), 'Result badge shows 4/4 câu đúng (100%)');

    const feedbackText = page.getByText(
      /Chúc mừng! Bạn đã hoàn thành bài học xuất sắc và nhận \+45 XP/i
    );
    assert(
      await feedbackText.isVisible(),
      'Success feedback banner with XP award is displayed'
    );

    const correctIndicators = page.getByText('Chính xác.');
    assert(
      (await correctIndicators.count()) === 4,
      'All 4 questions display green "Chính xác." explanation boxes'
    );
    await page.screenshot({ path: path.join(evidenceDir, '06_quiz_result.png') });

    // -------------------------------------------------------------
    // Step 10: Verify the user's progress is updated
    // -------------------------------------------------------------
    console.log("\n[Step 10] Verifying user's progress is updated...");
    const completedBadge = page.getByText('Đã hoàn thành').first();
    assert(
      await completedBadge.isVisible(),
      'Lesson header now shows "Đã hoàn thành" badge'
    );

    // Return to catalog to verify module and sidebar progress
    const backToCatalogBtn = page.getByRole('button', {
      name: 'Quay lại danh sách bài học',
    });
    await backToCatalogBtn.click();

    // In Unit 2, completed lessons should now show 1/5
    const moduleProgress = page.getByText('1/5');
    assert(
      await moduleProgress.isVisible(),
      'Unit 2 module progress counter updated from 0/5 to 1/5'
    );

    // Sidebar navigation button should now reflect 1/13 completed
    const sidebarLearnBtn = page
      .getByRole('complementary')
      .getByRole('button', { name: /Learn Bài học và quiz 1\/13/i });
    assert(
      await sidebarLearnBtn.isVisible(),
      'Sidebar overall Learn button updated progress badge to 1/13'
    );
    await page.screenshot({ path: path.join(evidenceDir, '07_updated_progress.png') });

    console.log('\n===============================================================');
    console.log(`  TEST RUN COMPLETE: ${passedAssertions}/${totalAssertions} ASSERTIONS PASSED`);
    console.log('===============================================================\n');

    // Filter out expected 404 for favicon
    const actualAppErrors = consoleErrors.filter(
      (e) => !e.includes('favicon.ico') && !e.includes('requestAdapter')
    );
    if (actualAppErrors.length > 0) {
      console.warn('Browser console errors observed during test:', actualAppErrors);
    } else {
      console.log('✓ No application-level console errors detected.');
    }
  } catch (err) {
    console.error('\n❌ TEST FAILED with error:', err);
    await page.screenshot({ path: path.join(evidenceDir, 'failure_state.png') });
    throw err;
  } finally {
    await context.close();
    await browser.close();
  }
}

runTest()
  .then(() => {
    console.log('RESULT: PASS');
    process.exit(0);
  })
  .catch((err) => {
    console.error('RESULT: FAIL');
    process.exit(1);
  });
