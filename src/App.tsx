import * as Icons from "lucide-react";
import { startTransition, useEffect, useState } from "react";

import { Dashboard } from "./components/Dashboard";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LearnPage } from "./components/LearnPage";
import { MediaPage } from "./components/MediaPage";
import { PetPage } from "./components/PetPage";
import { ShopPage } from "./components/ShopPage";
import { INITIAL_COURSES, MOCK_SOCIAL_POSTS, SHOP_ITEMS } from "./data";
import type {
  AppTab,
  Course,
  CourseCategory,
  LearnSubTab,
  PetAccessory,
  PetState,
  QuizStatus,
  SocialPost,
} from "./types";

const STORAGE_KEYS = {
  pet: "econedu_pet",
  shop: "econedu_shop",
  completedLessons: "econedu_completed_lessons",
  socialPosts: "econedu_social_posts",
  streakMeta: "econedu_streak_meta",
} as const;

type StreakMeta = {
  lastVisit: string;
  streak: number;
};

const DEFAULT_PET_STATE: PetState = {
  name: "Tôm Heo Đất",
  points: 150,
  level: 1,
  species: "gấu",
  equipped: {
    glasses: null,
    hat: null,
    clothing: null,
    background: null,
  },
  ownedAccessories: [],
};

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const savedValue = window.localStorage.getItem(key);
    return savedValue ? (JSON.parse(savedValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getCourseByCategory(category: CourseCategory): Course {
  return (
    INITIAL_COURSES.find((course) => course.category === category) ??
    INITIAL_COURSES[0]
  );
}

function mergeShopItems(savedItems: PetAccessory[]) {
  const savedById = new Map(savedItems.map((item) => [item.id, item]));

  return SHOP_ITEMS.map((item) => ({
    ...item,
    ...savedById.get(item.id),
  }));
}

function getTodayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date());
}

function getDayDifference(previousDay: string, currentDay: string) {
  const previousDate = new Date(`${previousDay}T00:00:00`);
  const currentDate = new Date(`${currentDay}T00:00:00`);
  return Math.round(
    (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function resolveStreakMeta(savedMeta: StreakMeta | null): StreakMeta {
  const today = getTodayKey();

  if (!savedMeta) {
    return { lastVisit: today, streak: 1 };
  }

  const dayDiff = getDayDifference(savedMeta.lastVisit, today);

  if (dayDiff <= 0) {
    return savedMeta;
  }

  if (dayDiff === 1) {
    return {
      lastVisit: today,
      streak: savedMeta.streak + 1,
    };
  }

  return {
    lastVisit: today,
    streak: 1,
  };
}

function findNextLesson(completedLessons: string[]) {
  for (const course of INITIAL_COURSES) {
    for (const lesson of course.lessons) {
      if (!completedLessons.includes(lesson.id)) {
        return {
          category: course.category,
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          categoryLabel:
            course.category === "economics" ? "Kinh tế" : "Tài chính",
        };
      }
    }
  }

  const fallbackCourse = INITIAL_COURSES[0];
  const fallbackLesson = fallbackCourse.lessons[0];

  return {
    category: fallbackCourse.category,
    lessonId: fallbackLesson.id,
    lessonTitle: fallbackLesson.title,
    categoryLabel:
      fallbackCourse.category === "economics" ? "Kinh tế" : "Tài chính",
  };
}

export default function App() {
  const defaultCourse = getCourseByCategory("economics");

  const [activeTab, setActiveTabState] = useState<AppTab>("dashboard");
  const [selectedCategory, setSelectedCategory] =
    useState<CourseCategory>("economics");
  const [activeLessonId, setActiveLessonId] = useState<string>(
    defaultCourse.lessons[0].id,
  );
  const [learnSubTab, setLearnSubTab] = useState<LearnSubTab>("video");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeScriptIndex, setActiveScriptIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResults, setQuizResults] = useState<Record<string, QuizStatus>>({});
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [petState, setPetState] = useState<PetState>(() =>
    readStoredValue(STORAGE_KEYS.pet, DEFAULT_PET_STATE),
  );
  const [shopItems, setShopItems] = useState<PetAccessory[]>(() =>
    mergeShopItems(readStoredValue(STORAGE_KEYS.shop, SHOP_ITEMS)),
  );
  const [lessonsCompleted, setLessonsCompleted] = useState<string[]>(() =>
    readStoredValue(STORAGE_KEYS.completedLessons, [] as string[]),
  );
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() =>
    readStoredValue(STORAGE_KEYS.socialPosts, MOCK_SOCIAL_POSTS),
  );
  const [streakMeta] = useState<StreakMeta>(() =>
    resolveStreakMeta(readStoredValue<StreakMeta | null>(STORAGE_KEYS.streakMeta, null)),
  );
  const [memeScenario, setMemeScenario] = useState(
    "Hết tiền tiêu vặt ngày 10 của tháng",
  );
  const [memeSolution, setMemeSolution] = useState(
    "Quy tắc chia ví 50% thiết yếu, 30% sở thích, 20% tiết kiệm",
  );
  const [isMemeGenerated, setIsMemeGenerated] = useState(false);
  const [customMemeText, setCustomMemeText] = useState(
    "Nhìn bạn bè đi ăn lẩu, mình hút nước trà đá cầm cự!",
  );

  const activeCourse = getCourseByCategory(selectedCategory);
  const activeLesson =
    activeCourse.lessons.find((lesson) => lesson.id === activeLessonId) ??
    activeCourse.lessons[0];
  const totalLessonCount = INITIAL_COURSES.reduce(
    (sum, course) => sum + course.lessons.length,
    0,
  );
  const videoProgress = activeLesson.videoScript.length
    ? ((activeScriptIndex + 1) / activeLesson.videoScript.length) * 100
    : 0;
  const nextLessonInfo = findNextLesson(lessonsCompleted);
  const pageMeta = getPageMeta(activeTab, {
    activeLessonTitle: activeLesson.title,
    selectedCategory,
    petName: petState.name,
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.pet, JSON.stringify(petState));
  }, [petState]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.shop, JSON.stringify(shopItems));
  }, [shopItems]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.completedLessons,
      JSON.stringify(lessonsCompleted),
    );
  }, [lessonsCompleted]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.socialPosts,
      JSON.stringify(socialPosts),
    );
  }, [socialPosts]);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEYS.streakMeta,
      JSON.stringify(streakMeta),
    );
  }, [streakMeta]);

  useEffect(() => {
    if (!isPlaying || learnSubTab !== "video") {
      return;
    }

    if (activeScriptIndex >= activeLesson.videoScript.length - 1) {
      const stopTimer = window.setTimeout(() => setIsPlaying(false), 1400);
      return () => window.clearTimeout(stopTimer);
    }

    const playbackTimer = window.setTimeout(() => {
      setActiveScriptIndex((currentIndex) =>
        Math.min(currentIndex + 1, activeLesson.videoScript.length - 1),
      );
    }, 2400);

    return () => window.clearTimeout(playbackTimer);
  }, [
    activeLesson.videoScript.length,
    activeScriptIndex,
    isPlaying,
    learnSubTab,
  ]);

  function setActiveTab(tab: AppTab) {
    startTransition(() => {
      setActiveTabState(tab);
    });
  }

  function openLearn() {
    setActiveTab("learn");
  }

  function openShop() {
    setActiveTab("shop");
  }

  function resetLessonExperience(nextSubTab: LearnSubTab = "video") {
    setIsPlaying(false);
    setActiveScriptIndex(0);
    setLearnSubTab(nextSubTab);
    setQuizAnswers({});
    setQuizResults({});
    setFeedbackMsg("");
  }

  function openLesson(category: CourseCategory, lessonId: string) {
    startTransition(() => {
      setActiveTabState("learn");
      setSelectedCategory(category);
      setActiveLessonId(lessonId);
    });

    resetLessonExperience();
  }

  function openCourse(category: CourseCategory) {
    const nextCourse = getCourseByCategory(category);
    openLesson(category, nextCourse.lessons[0].id);
  }

  function continueLearning() {
    openLesson(nextLessonInfo.category, nextLessonInfo.lessonId);
  }

  function selectLesson(lessonId: string) {
    setActiveLessonId(lessonId);
    resetLessonExperience();
  }

  function handleSpeciesChange(species: PetState["species"]) {
    setPetState((currentState) => ({
      ...currentState,
      species,
    }));
  }

  function handleRename(name: string) {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    setPetState((currentState) => ({
      ...currentState,
      name: trimmedName,
    }));
  }

  function handleShopAction(item: PetAccessory) {
    const isOwned = petState.ownedAccessories.includes(item.id);

    if (isOwned) {
      setPetState((currentState) => {
        const isEquipped = currentState.equipped[item.category] === item.id;

        return {
          ...currentState,
          equipped: {
            ...currentState.equipped,
            [item.category]: isEquipped ? null : item.id,
          },
        };
      });
      return;
    }

    if (petState.points < item.price) {
      window.alert(
        "Bạn chưa đủ XP cho món này. Học thêm một bài rồi quay lại mua nhé!",
      );
      return;
    }

    setPetState((currentState) => ({
      ...currentState,
      points: currentState.points - item.price,
      ownedAccessories: [...currentState.ownedAccessories, item.id],
    }));

    setShopItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.id === item.id
          ? { ...currentItem, unlocked: true }
          : currentItem,
      ),
    );
  }

  function handleSelectQuizOption(questionId: string, optionIndex: number) {
    if (quizResults[questionId] === "correct") {
      return;
    }

    setQuizAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: optionIndex,
    }));
  }

  function handleSubmitQuiz(questionId: string) {
    const selectedAnswer = quizAnswers[questionId];
    const question = activeLesson.quiz.find((item) => item.id === questionId);

    if (!question) {
      return;
    }

    if (selectedAnswer === undefined) {
      setFeedbackMsg("Chọn một đáp án rồi kiểm tra nhé.");
      return;
    }

    if (quizResults[questionId] === "correct") {
      return;
    }

    if (selectedAnswer === question.correctAnswer) {
      const nextResults = {
        ...quizResults,
        [questionId]: "correct" as const,
      };
      const gainedPoints = Math.round(
        activeLesson.pointsReward / activeLesson.quiz.length,
      );
      const allCorrect = activeLesson.quiz.every(
        (quizQuestion) => nextResults[quizQuestion.id] === "correct",
      );

      setQuizResults(nextResults);
      setPetState((currentState) => {
        const nextPoints = currentState.points + gainedPoints;
        return {
          ...currentState,
          points: nextPoints,
          level: Math.max(currentState.level, Math.floor(nextPoints / 300) + 1),
        };
      });

      if (allCorrect && !lessonsCompleted.includes(activeLesson.id)) {
        setLessonsCompleted((currentLessons) => [...currentLessons, activeLesson.id]);
      }

      setFeedbackMsg(
        allCorrect
          ? "Bạn đã hiểu phần này rồi, có thể qua bài tiếp theo hoặc ghé shop."
          : `Chuẩn rồi! +${gainedPoints} XP đã cộng cho câu này.`,
      );
      return;
    }

    setQuizResults((currentResults) => ({
      ...currentResults,
      [questionId]: "incorrect",
    }));
    setFeedbackMsg("Chưa đúng đâu, đổi đáp án khác rồi thử lại nhé.");
  }

  function handleToggleVideoPlayback() {
    if (!isPlaying && activeScriptIndex >= activeLesson.videoScript.length - 1) {
      setActiveScriptIndex(0);
    }

    setIsPlaying((currentState) => !currentState);
  }

  function handleAdvanceScript() {
    setActiveScriptIndex((currentIndex) => {
      if (currentIndex >= activeLesson.videoScript.length - 1) {
        return 0;
      }

      return currentIndex + 1;
    });
    setIsPlaying(false);
  }

  function handleSelectScriptIndex(index: number) {
    setActiveScriptIndex(index);
    setIsPlaying(true);
  }

  function handleLikePost(postId: string) {
    setSocialPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    );
  }

  function handleAddComment(postId: string) {
    setSocialPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId ? { ...post, comments: post.comments + 1 } : post,
      ),
    );
  }

  function updateMemeScenario(value: string) {
    setMemeScenario(value);
    setIsMemeGenerated(false);
  }

  function updateMemeSolution(value: string) {
    setMemeSolution(value);
    setIsMemeGenerated(false);
  }

  function updateCustomMemeText(value: string) {
    setCustomMemeText(value);
    setIsMemeGenerated(false);
  }

  return (
    <div className="app-frame">
      <div className="app-shell">
        <Header
          activeTab={activeTab}
          petState={petState}
          streakDays={streakMeta.streak}
          completedLessonCount={lessonsCompleted.length}
          totalLessonCount={totalLessonCount}
          onChangeTab={setActiveTab}
          onOpenLearn={openLearn}
        />

        <div className="app-canvas">
          <main className="space-y-6 px-4 py-4 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
            <section className="surface-card overflow-hidden p-5 sm:p-6 xl:p-7">
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.95fr)] xl:items-end">
                <div className="space-y-4">
                  <span className="badge badge-lime">
                    <Icons.Sparkles className="h-4 w-4" />
                    {pageMeta.eyebrow}
                  </span>
                  <div className="space-y-3">
                    <h2 className="font-display text-3xl font-bold tracking-tight text-[#17191D] sm:text-4xl xl:text-[2.95rem]">
                      {pageMeta.title}
                    </h2>
                    <p className="max-w-3xl text-sm leading-7 text-[#5E6571] sm:text-[0.98rem]">
                      {pageMeta.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <QuickMetricCard
                    label="Tiến độ"
                    value={`${lessonsCompleted.length}/${totalLessonCount}`}
                    caption="Bài đã hoàn thành"
                    accentClassName="text-[#4C3C86]"
                  />
                  <QuickMetricCard
                    label="Ví XP"
                    value={`${petState.points}`}
                    caption={`Level ${petState.level} hiện tại`}
                    accentClassName="text-[#365114]"
                  />
                  <QuickMetricCard
                    label="Chuỗi học"
                    value={`${streakMeta.streak} ngày`}
                    caption="Giữ nhịp đều mỗi hôm"
                    accentClassName="text-[#9B365E]"
                  />
                </div>
              </div>
            </section>

            {activeTab === "dashboard" && (
              <Dashboard
                petState={petState}
                completedLessonCount={lessonsCompleted.length}
                totalLessonCount={totalLessonCount}
                streakDays={streakMeta.streak}
                nextLessonTitle={nextLessonInfo.lessonTitle}
                nextLessonCategoryLabel={nextLessonInfo.categoryLabel}
                onContinueLearning={continueLearning}
                onOpenCourse={openCourse}
                onOpenPet={() => setActiveTab("pet")}
                onOpenShop={openShop}
              />
            )}

            {activeTab === "learn" && (
              <LearnPage
                selectedCategory={selectedCategory}
                activeCourse={activeCourse}
                activeLesson={activeLesson}
                petState={petState}
                lessonsCompleted={lessonsCompleted}
                learnSubTab={learnSubTab}
                isPlaying={isPlaying}
                activeScriptIndex={activeScriptIndex}
                videoProgress={videoProgress}
                quizAnswers={quizAnswers}
                quizResults={quizResults}
                feedbackMsg={feedbackMsg}
                onSelectCourseCategory={openCourse}
                onSelectLesson={selectLesson}
                onChangeLearnSubTab={setLearnSubTab}
                onToggleVideoPlayback={handleToggleVideoPlayback}
                onAdvanceScript={handleAdvanceScript}
                onSelectScriptIndex={handleSelectScriptIndex}
                onSelectQuizOption={handleSelectQuizOption}
                onSubmitQuiz={handleSubmitQuiz}
                onOpenPet={() => setActiveTab("pet")}
                onOpenShop={openShop}
              />
            )}

            {activeTab === "pet" && (
              <PetPage
                petState={petState}
                completedLessonCount={lessonsCompleted.length}
                totalLessonCount={totalLessonCount}
                onSpeciesChange={handleSpeciesChange}
                onRename={handleRename}
                onOpenLearn={continueLearning}
                onOpenShop={openShop}
              />
            )}

            {activeTab === "shop" && (
              <ShopPage
                petState={petState}
                shopItems={shopItems}
                onShopAction={handleShopAction}
                onOpenLearn={continueLearning}
              />
            )}

            {activeTab === "media" && (
              <MediaPage
                socialPosts={socialPosts}
                memeScenario={memeScenario}
                memeSolution={memeSolution}
                customMemeText={customMemeText}
                isMemeGenerated={isMemeGenerated}
                onScenarioChange={updateMemeScenario}
                onSolutionChange={updateMemeSolution}
                onCustomTextChange={updateCustomMemeText}
                onGenerateMeme={() => setIsMemeGenerated(true)}
                onLikePost={handleLikePost}
                onAddComment={handleAddComment}
              />
            )}
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

function getPageMeta(
  activeTab: AppTab,
  context: {
    activeLessonTitle: string;
    selectedCategory: CourseCategory;
    petName: string;
  },
) {
  switch (activeTab) {
    case "dashboard":
      return {
        eyebrow: "Không gian học tập",
        title: "Bảng điều khiển học tập rõ ràng và dễ quay lại mỗi ngày.",
        description:
          "Theo dõi tiến độ, XP và pet trong cùng một không gian sáng sủa hơn, với các khu vực lớn và dễ quét nhanh như một dashboard SaaS hiện đại.",
      };
    case "learn":
      return {
        eyebrow:
          context.selectedCategory === "economics"
            ? "Lộ trình kinh tế"
            : "Lộ trình tài chính",
        title: "Học theo từng chặng ngắn, chốt ý rồi nhận XP ngay.",
        description: `Bạn đang mở "${context.activeLessonTitle}". Luồng học vẫn giữ nguyên, chỉ được sắp xếp lại để tập trung hơn trên cả desktop lẫn mobile.`,
      };
    case "pet":
      return {
        eyebrow: "Hồ sơ pet",
        title: `${context.petName} có một góc riêng để bạn theo dõi và tùy chỉnh.`,
        description:
          "Tiến độ thăng hạng, vật phẩm đang dùng và các thao tác cá nhân hóa được gom lại thành một bảng điều khiển nhẹ nhàng hơn.",
      };
    case "shop":
      return {
        eyebrow: "Phần thưởng XP",
        title: "Shop được làm gọn để bạn so đồ, xem giá và ra quyết định nhanh.",
        description:
          "Giữ nguyên cơ chế mua và trang bị, nhưng chuyển sang ngôn ngữ thẻ sáng, nhấn mạnh vật phẩm có thể mở và khoảng cách XP còn thiếu.",
      };
    case "media":
      return {
        eyebrow: "Mẹo và media",
        title: "Mẹo nhớ bài, meme vui và social mockup nay nằm trong cùng một studio.",
        description:
          "Khu nội dung phụ được làm đồng bộ với phần còn lại của ứng dụng để vẫn vui mắt mà không bị rối khi dùng lâu.",
      };
  }
}

function QuickMetricCard({
  label,
  value,
  caption,
  accentClassName,
}: {
  label: string;
  value: string;
  caption: string;
  accentClassName: string;
}) {
  return (
    <div className="metric-card">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7E8692]">
        {label}
      </p>
      <strong className={accentClassName}>{value}</strong>
      <p className="mt-1 text-xs text-[#5E6571]">{caption}</p>
    </div>
  );
}
