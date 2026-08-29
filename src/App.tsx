import * as Icons from "lucide-react";
import { startTransition, useEffect, useState, useRef } from "react";

import { Dashboard } from "./components/Dashboard";
import { ComingSoonModal } from "./components/ComingSoonModal";
import { AuthModal } from "./components/AuthModal";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LearnPage } from "./components/LearnPage";
import { MediaPage } from "./components/MediaPage";
import { PetPage } from "./components/PetPage";
import { ShopPage } from "./components/ShopPage";
import { MOCK_SOCIAL_POSTS, SHOP_ITEMS } from "./data";
import { COURSE_MODULES } from "./learnData";
import { apiClient, type PublicUser } from "./services/api";
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
  socialPosts: "econedu_social_posts",
} as const;

const DISABLED_TABS: AppTab[] = ["pet", "shop", "media"];

type StreakMeta = {
  lastVisit: string;
  streak: number;
};

const DEFAULT_GUEST_PET_STATE: PetState = {
  name: "Tôm Heo Đất",
  points: 0,
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
  
  // Auth state
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [authModalMessage, setAuthModalMessage] = useState("");
  const activeSubmissionKeyRef = useRef<string | null>(null);

  // Gamification & Progress state (Server Authoritative)
  const [petState, setPetState] = useState<PetState>(() =>
    readStoredValue(STORAGE_KEYS.pet, DEFAULT_GUEST_PET_STATE),
  );
  const [shopItems, setShopItems] = useState<PetAccessory[]>(() =>
    mergeShopItems(readStoredValue(STORAGE_KEYS.shop, SHOP_ITEMS)),
  );
  const [lessonsCompleted, setLessonsCompleted] = useState<string[]>([]);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() =>
    readStoredValue(STORAGE_KEYS.socialPosts, MOCK_SOCIAL_POSTS),
  );
  const [streakMeta, setStreakMeta] = useState<StreakMeta>({
    lastVisit: "",
    streak: 0,
  });

  const [memeScenario, setMemeScenario] = useState(
    "Hết tiền tiêu vặt ngày 10 của tháng",
  );
  const [memeSolution, setMemeSolution] = useState(
    "Quy tắc chia ví 50% thiết yếu, 30% sở thích, 20% tiết kiệm",
  );
  const [isMemeGenerated, setIsMemeGenerated] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
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

  // Load server state on auth
  async function loadUserData() {
    try {
      const [progressRes, gamificationRes, petsRes] = await Promise.all([
        apiClient.progress.get().catch(() => null),
        apiClient.gamification.get().catch(() => null),
        apiClient.pets.getMe().catch(() => null),
      ]);

      if (progressRes) {
        const completedIds = progressRes.lessons
          .filter((l) => l.status === "completed")
          .map((l) => l.lessonId);
        setLessonsCompleted(completedIds);
      }

      if (gamificationRes) {
        setPetState((prev) => ({
          ...prev,
          points: gamificationRes.totalXp,
          level: gamificationRes.level,
        }));
        setStreakMeta({
          lastVisit: gamificationRes.updatedAt || "",
          streak: gamificationRes.currentStreak,
        });
      }

      if (petsRes?.activePet) {
        const species = (petsRes.activePet.metadata?.species as PetState["species"]) || "gấu";
        setPetState((prev) => ({
          ...prev,
          name: petsRes.activePet?.name || prev.name,
          species,
        }));
      }
    } catch {
      // Ignore background sync errors
    }
  }

  // Check session on mount
  useEffect(() => {
    apiClient.auth
      .getSession()
      .then((session) => {
        if (session.authenticated && session.user) {
          setUser(session.user);
          loadUserData();
        }
      })
      .catch(() => {
        // Guest mode
      });
  }, []);

  function handleAuthSuccess(authenticatedUser: PublicUser) {
    setUser(authenticatedUser);
    loadUserData();
  }

  async function handleLogout() {
    try {
      await apiClient.auth.logout();
    } catch {
      // Ignore
    }
    setUser(null);
    setLessonsCompleted([]);
    setPetState(DEFAULT_GUEST_PET_STATE);
    setStreakMeta({ lastVisit: "", streak: 0 });
  }

  function openAuthModal(mode: "login" | "register" = "login", customMsg = "") {
    setAuthModalMode(mode);
    setAuthModalMessage(customMsg);
    setIsAuthModalOpen(true);
  }

  function setActiveTab(tab: AppTab) {
    if (DISABLED_TABS.includes(tab)) {
      setIsComingSoonOpen(true);
      return;
    }

    startTransition(() => {
      setActiveTabState(tab);
    });
  }

  function resetLessonFlow() {
    setLessonStage("video");
    setQuizAnswers({});
    setIsQuizSubmitted(false);
    setFeedbackMsg("");
    activeSubmissionKeyRef.current = null;
  }

  function openLearn() {
    startTransition(() => {
      setActiveTabState("learn");
      setLearnView("catalog");
    });
  }

  function openShop() {
    setIsComingSoonOpen(true);
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

    // If authenticated, sync in_progress status
    if (user) {
      apiClient.progress.update(lessonId, "in_progress").catch(() => {});
    }
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

  async function handleSubmitQuiz() {
    if (!activeLesson) {
      return;
    }

    // Require authentication to submit quizzes and earn XP
    if (!user) {
      openAuthModal(
        "login",
        "Vui lòng đăng nhập hoặc tạo tài khoản để nộp bài và tích lũy XP!",
      );
      return;
    }

    const unansweredQuestion = activeLesson.quiz.find(
      (question) => quizAnswers[question.id] === undefined,
    );

    if (unansweredQuestion) {
      setFeedbackMsg("Vui lòng chọn đáp án cho tất cả câu hỏi trước khi nộp bài.");
      return;
    }

    // Generate or reuse idempotency key for this attempt
    if (!activeSubmissionKeyRef.current) {
      activeSubmissionKeyRef.current = "idemp_" + crypto.randomUUID().replace(/-/g, "");
    }

    try {
      const res = await apiClient.quizzes.submit(activeLesson.id, {
        answers: quizAnswers,
        idempotencyKey: activeSubmissionKeyRef.current,
      });

      setIsQuizSubmitted(true);

      if (res.lessonCompleted && res.xpAwarded > 0) {
        setLessonsCompleted((prev) =>
          prev.includes(activeLesson.id) ? prev : [...prev, activeLesson.id],
        );
        setFeedbackMsg(
          `Chúc mừng! Bạn đã hoàn thành bài học xuất sắc và nhận +${res.xpAwarded} XP. Có thể quay lại danh sách để mở bài tiếp theo.`,
        );
        // Refresh server gamification
        const gamif = await apiClient.gamification.get().catch(() => null);
        if (gamif) {
          setPetState((prev) => ({
            ...prev,
            points: gamif.totalXp,
            level: gamif.level,
          }));
          setStreakMeta({
            lastVisit: gamif.updatedAt || "",
            streak: gamif.currentStreak,
          });
        }
        return;
      }

      if (res.lessonCompleted && res.xpAwarded === 0) {
        setFeedbackMsg(
          "Bài học này bạn đã hoàn thành trước đó rồi. Đạt điểm tối đa nhưng không nhận thêm XP.",
        );
        return;
      }

      setFeedbackMsg(
        `Bạn đúng ${res.correctCount}/${res.totalQuestions} câu (Điểm: ${res.score}%). Hãy xem lại nội dung và thử nộp lại nhé.`,
      );
    } catch (err: any) {
      setFeedbackMsg(
        err?.message || "Đã xảy ra lỗi khi nộp bài. Vui lòng thử lại sau.",
      );
    }
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
          user={user}
          onChangeTab={setActiveTab}
          onOpenLearn={openLearn}
          onOpenAuth={() => openAuthModal("login")}
          onLogout={handleLogout}
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

        <ComingSoonModal
          isOpen={isComingSoonOpen}
          onClose={() => setIsComingSoonOpen(false)}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          message={authModalMessage}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
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
  if (activeTab === "dashboard") {
    return {
      eyebrow: "Học theo nhịp riêng",
      title: "Chào mừng trở lại với ECONVERSE.",
      description:
        "Bắt đầu bài học hôm nay, làm quiz nhận XP và chăm sóc người bạn đồng hành theo cách trực quan nhất.",
    };
  }

  if (activeTab === "learn") {
    if (context.isInLessonFlow && context.activeLessonTitle) {
      return {
        eyebrow: "Chi tiết bài học",
        title: context.activeLessonTitle,
        description:
          "Xem nội dung bài học, theo dõi video và hoàn thành quiz để nhận XP.",
      };
    }

    const categoryText =
      context.selectedCategory === "economics"
        ? "Kinh tế cơ bản"
        : context.selectedCategory === "finance"
          ? "Tài chính cá nhân"
          : "Toàn bộ bài học";

    return {
      eyebrow: "Chương trình học",
      title: `Danh mục bài học: ${categoryText}`,
      description:
        "Chọn bài học bạn muốn khám phá và bắt đầu học ngay bây giờ.",
    };
  }

  if (activeTab === "pet") {
    return {
      eyebrow: "Bạn đồng hành",
      title: `Hồ sơ pet: ${context.petName}`,
      description:
        "Tùy biến loài pet, đổi tên và theo dõi cấp bậc tăng trưởng theo XP tích lũy.",
    };
  }

  if (activeTab === "shop") {
    return {
      eyebrow: "Cửa hàng phụ kiện",
      title: "Đổi XP lấy đồ cho pet",
      description:
        "Mở khóa các phụ kiện thời trang và hình nền độc đáo để trang bị cho pet.",
    };
  }

  return {
    eyebrow: "Góc thư giãn",
    title: "Mẹo tài chính & Media",
    description:
      "Khám phá các mẹo quản lý chi tiêu và tạo meme thú vị về kinh tế đời sống.",
  };
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
    <div className="surface-card-muted flex flex-col justify-between p-4 rounded-2xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7E8692]">
        {label}
      </p>
      <div className="mt-2">
        <p className={`text-2xl font-black tracking-tight ${accentClassName}`}>
          {value}
        </p>
        <p className="mt-0.5 text-xs text-[#5E6571]">{caption}</p>
      </div>
    </div>
  );
}
