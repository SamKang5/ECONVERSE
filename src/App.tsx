import * as Icons from "lucide-react";
import { startTransition, useEffect, useState } from "react";

import { Dashboard } from "./components/Dashboard";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LearnPage } from "./components/LearnPage";
import { MediaPage } from "./components/MediaPage";
import { PetPage } from "./components/PetPage";
import { ShopPage } from "./components/ShopPage";
import { MOCK_SOCIAL_POSTS, SHOP_ITEMS } from "./data";
import { COURSE_MODULES } from "./learnData";
import type {
  AppTab,
  CourseCategory,
  LearnCategoryFilter,
  LearnView,
  LessonStage,
  PetAccessory,
  PetState,
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

const ALL_LESSON_ENTRIES = COURSE_MODULES.flatMap((module) =>
  module.lessons.map((lesson) => ({ module, lesson })),
);

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

function findLessonEntry(lessonId: string) {
  return ALL_LESSON_ENTRIES.find((entry) => entry.lesson.id === lessonId) ?? null;
}

function getFirstLessonByCategory(category: CourseCategory) {
  return (
    ALL_LESSON_ENTRIES.find((entry) => entry.module.category === category) ??
    ALL_LESSON_ENTRIES[0] ??
    null
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
  const nextEntry =
    ALL_LESSON_ENTRIES.find(
      (entry) => !completedLessons.includes(entry.lesson.id),
    ) ?? ALL_LESSON_ENTRIES[0];

  if (!nextEntry) {
    return null;
  }

  return {
    category: nextEntry.module.category,
    lessonId: nextEntry.lesson.id,
    lessonTitle: nextEntry.lesson.title,
    categoryLabel:
      nextEntry.module.category === "economics" ? "Kinh tế" : "Tài chính",
  };
}

export default function App() {
  const [activeTab, setActiveTabState] = useState<AppTab>("dashboard");
  const [selectedCategory, setSelectedCategory] =
    useState<LearnCategoryFilter>("all");
  const [learnView, setLearnView] = useState<LearnView>("catalog");
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [lessonStage, setLessonStage] = useState<LessonStage>("video");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
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
    resolveStreakMeta(
      readStoredValue<StreakMeta | null>(STORAGE_KEYS.streakMeta, null),
    ),
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

  const activeLessonEntry = activeLessonId ? findLessonEntry(activeLessonId) : null;
  const activeModule = activeLessonEntry?.module ?? null;
  const activeLesson = activeLessonEntry?.lesson ?? null;
  const totalLessonCount = ALL_LESSON_ENTRIES.length;
  const nextLessonInfo = findNextLesson(lessonsCompleted);
  const pageMeta = getPageMeta(activeTab, {
    activeLessonTitle: activeLesson?.title ?? null,
    selectedCategory,
    petName: petState.name,
    isInLessonFlow: learnView === "lesson" && Boolean(activeLesson),
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

  function setActiveTab(tab: AppTab) {
    startTransition(() => {
      setActiveTabState(tab);
    });
  }

  function resetLessonFlow() {
    setLessonStage("video");
    setQuizAnswers({});
    setIsQuizSubmitted(false);
    setFeedbackMsg("");
  }

  function openLearn() {
    startTransition(() => {
      setActiveTabState("learn");
      setLearnView("catalog");
    });
  }

  function openShop() {
    setActiveTab("shop");
  }

  function openLesson(lessonId: string, categoryOverride?: CourseCategory) {
    const nextEntry = findLessonEntry(lessonId);

    if (!nextEntry) {
      return;
    }

    startTransition(() => {
      setActiveTabState("learn");
      if (categoryOverride) {
        setSelectedCategory(categoryOverride);
      }
      setLearnView("lesson");
      setActiveLessonId(lessonId);
    });

    resetLessonFlow();
  }

  function openCourse(category: CourseCategory) {
    const nextEntry = getFirstLessonByCategory(category);

    if (!nextEntry) {
      openLearn();
      return;
    }

    openLesson(nextEntry.lesson.id, category);
  }

  function continueLearning() {
    if (!nextLessonInfo) {
      openLearn();
      return;
    }

    openLesson(nextLessonInfo.lessonId, nextLessonInfo.category);
  }

  function backToLessonCatalog() {
    startTransition(() => {
      setActiveTabState("learn");
      setLearnView("catalog");
    });

    resetLessonFlow();
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
    setQuizAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionId]: optionIndex,
    }));

    if (isQuizSubmitted) {
      setIsQuizSubmitted(false);
      setFeedbackMsg("");
    }
  }

  function handleSubmitQuiz() {
    if (!activeLesson) {
      return;
    }

    const unansweredQuestion = activeLesson.quiz.find(
      (question) => quizAnswers[question.id] === undefined,
    );

    if (unansweredQuestion) {
      setFeedbackMsg("Vui lòng chọn đáp án cho tất cả câu hỏi trước khi nộp bài.");
      return;
    }

    const correctCount = activeLesson.quiz.filter(
      (question) => quizAnswers[question.id] === question.correctAnswer,
    ).length;
    const isPerfectScore = correctCount === activeLesson.quiz.length;
    const alreadyCompleted = lessonsCompleted.includes(activeLesson.id);

    setIsQuizSubmitted(true);

    if (isPerfectScore && !alreadyCompleted) {
      setPetState((currentState) => {
        const nextPoints = currentState.points + activeLesson.pointsReward;

        return {
          ...currentState,
          points: nextPoints,
          level: Math.max(currentState.level, Math.floor(nextPoints / 300) + 1),
        };
      });
      setLessonsCompleted((currentLessons) => [...currentLessons, activeLesson.id]);
      setFeedbackMsg(
        `Bạn đã hoàn thành bài học và nhận +${activeLesson.pointsReward} XP. Có thể quay lại danh sách để mở bài tiếp theo.`,
      );
      return;
    }

    if (isPerfectScore) {
      setFeedbackMsg(
        "Bài này đã hoàn thành trước đó rồi. Bạn có thể chuyển sang bài khác bất cứ lúc nào.",
      );
      return;
    }

    setFeedbackMsg(
      `Bạn đúng ${correctCount}/${activeLesson.quiz.length} câu. Xem lại phần giải thích rồi thử nộp lại nhé.`,
    );
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

            {activeTab === "dashboard" && nextLessonInfo && (
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
                modules={COURSE_MODULES}
                selectedCategory={selectedCategory}
                activeModule={activeModule}
                activeLesson={learnView === "lesson" ? activeLesson : null}
                lessonStage={lessonStage}
                lessonsCompleted={lessonsCompleted}
                quizAnswers={quizAnswers}
                isQuizSubmitted={isQuizSubmitted}
                feedbackMsg={feedbackMsg}
                onSelectCategory={setSelectedCategory}
                onOpenLesson={openLesson}
                onBackToCatalog={backToLessonCatalog}
                onChangeLessonStage={setLessonStage}
                onSelectQuizAnswer={handleSelectQuizOption}
                onSubmitQuiz={handleSubmitQuiz}
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
    activeLessonTitle: string | null;
    selectedCategory: LearnCategoryFilter;
    petName: string;
    isInLessonFlow: boolean;
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
      return context.isInLessonFlow
        ? {
            eyebrow:
              context.selectedCategory === "finance"
                ? "Lộ trình tài chính"
                : "Lộ trình bài học",
            title: "Đi từng bài theo đúng flow video rồi đến quiz.",
            description: `Bạn đang mở "${context.activeLessonTitle}". Giao diện mới giữ nguyên branding cũ nhưng đổi Learn thành một lesson flow rõ ràng hơn trên cả desktop lẫn mobile.`,
          }
        : {
            eyebrow:
              context.selectedCategory === "finance"
                ? "Danh sách bài học tài chính"
                : context.selectedCategory === "economics"
                  ? "Danh sách bài học kinh tế"
                  : "Thư viện bài học",
            title: "Chọn một bài học từ danh sách module rồi bắt đầu ngay.",
            description:
              "Trang Learn giờ mở vào danh sách bài học có cấu trúc như một LMS mini, sau đó mới đi sâu vào màn hình video và quiz của từng bài.",
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
