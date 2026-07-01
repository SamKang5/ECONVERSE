import * as Icons from "lucide-react";

import type {
  Course,
  CourseCategory,
  LearnSubTab,
  Lesson,
  PetState,
  QuizStatus,
  VideoScriptLine,
} from "../types";
import { PetDisplay } from "./PetDisplay";
import { QuizCard } from "./QuizCard";

interface LearnPageProps {
  selectedCategory: CourseCategory;
  activeCourse: Course;
  activeLesson: Lesson;
  petState: PetState;
  lessonsCompleted: string[];
  learnSubTab: LearnSubTab;
  isPlaying: boolean;
  activeScriptIndex: number;
  videoProgress: number;
  quizAnswers: Record<string, number>;
  quizResults: Record<string, QuizStatus>;
  feedbackMsg: string;
  onSelectCourseCategory: (category: CourseCategory) => void;
  onSelectLesson: (lessonId: string) => void;
  onChangeLearnSubTab: (tab: LearnSubTab) => void;
  onToggleVideoPlayback: () => void;
  onAdvanceScript: () => void;
  onSelectScriptIndex: (index: number) => void;
  onSelectQuizOption: (questionId: string, optionIndex: number) => void;
  onSubmitQuiz: (questionId: string) => void;
  onOpenPet: () => void;
  onOpenShop: () => void;
}

export function LearnPage({
  selectedCategory,
  activeCourse,
  activeLesson,
  petState,
  lessonsCompleted,
  learnSubTab,
  isPlaying,
  activeScriptIndex,
  videoProgress,
  quizAnswers,
  quizResults,
  feedbackMsg,
  onSelectCourseCategory,
  onSelectLesson,
  onChangeLearnSubTab,
  onToggleVideoPlayback,
  onAdvanceScript,
  onSelectScriptIndex,
  onSelectQuizOption,
  onSubmitQuiz,
  onOpenPet,
  onOpenShop,
}: LearnPageProps) {
  const isLessonCompleted = lessonsCompleted.includes(activeLesson.id);
  const courseCompletedCount = activeCourse.lessons.filter((lesson) =>
    lessonsCompleted.includes(lesson.id),
  ).length;
  const completedQuizCount = activeLesson.quiz.filter(
    (question) => quizResults[question.id] === "correct",
  ).length;
  const totalQuizCount = activeLesson.quiz.length;
  const hasSeenLesson = activeScriptIndex > 0 || isPlaying || learnSubTab !== "video";
  const hasQuizAttempt = activeLesson.quiz.some((question) => quizResults[question.id]);
  const hasEarnedXp = activeLesson.quiz.some(
    (question) => quizResults[question.id] === "correct",
  );

  const lessonProgressSteps = [
    {
      title: "1. Chọn chủ đề",
      caption: "Chọn đúng tuyến bạn muốn học",
      done: true,
      active: false,
    },
    {
      title: "2. Bài học ngắn",
      caption: "Đọc hoặc nghe từng phân cảnh",
      done: hasSeenLesson,
      active: !hasSeenLesson,
    },
    {
      title: "3. Quiz thử thách",
      caption: "Làm xong từng câu để kiểm tra hiểu bài",
      done: hasQuizAttempt,
      active: hasSeenLesson && !hasQuizAttempt,
    },
    {
      title: "4. Nhận XP",
      caption: "Đáp án đúng chỉ cộng XP một lần",
      done: hasEarnedXp,
      active: hasQuizAttempt && !hasEarnedXp,
    },
    {
      title: "5. Qua shop",
      caption: "Dùng XP để mua đồ cho pet",
      done: isLessonCompleted,
      active: hasEarnedXp && !isLessonCompleted,
    },
  ];

  const stepProgress =
    (lessonProgressSteps.filter((step) => step.done).length / lessonProgressSteps.length) *
    100;

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <aside className="space-y-6 xl:col-span-3">
        <section className="surface-card p-5">
          <div>
            <span className="section-label text-[#7E8692]">Bước 1</span>
            <h3 className="mt-2 text-lg font-semibold text-[#17191D]">Chọn chủ đề</h3>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <TopicButton
              active={selectedCategory === "economics"}
              label="Economics"
              icon={Icons.TrendingUp}
              accent="lime"
              onClick={() => onSelectCourseCategory("economics")}
            />
            <TopicButton
              active={selectedCategory === "finance"}
              label="Finance"
              icon={Icons.PiggyBank}
              accent="purple"
              onClick={() => onSelectCourseCategory("finance")}
            />
          </div>
        </section>

        <section className="surface-card p-5">
          <div className="space-y-3 border-b border-[rgba(23,25,29,0.08)] pb-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="section-label text-[#7E8692]">Danh sách bài</span>
                <h3 className="mt-2 text-lg font-semibold text-[#17191D]">
                  {activeCourse.title}
                </h3>
              </div>
              <span className="badge badge-dark">
                {courseCompletedCount}/{activeCourse.lessons.length} xong
              </span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    activeCourse.lessons.length === 0
                      ? 0
                      : (courseCompletedCount / activeCourse.lessons.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {activeCourse.lessons.map((lesson, index) => {
              const isSelected = activeLesson.id === lesson.id;
              const lessonCompleted = lessonsCompleted.includes(lesson.id);
              const barWidth = lessonCompleted ? "100%" : isSelected ? "54%" : "0%";

              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
                  className={`block w-full rounded-[22px] border p-4 text-left transition-all ${
                    isSelected
                      ? "border-[rgba(157,132,246,0.26)] bg-white shadow-[0_16px_30px_rgba(15,23,42,0.08)]"
                      : "border-[rgba(23,25,29,0.08)] bg-[rgba(248,249,244,0.9)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#7E8692]">
                        Bài {index + 1} • {lesson.duration}
                      </p>
                      <h4 className="mt-1 text-sm font-semibold text-[#17191D]">
                        {lesson.title}
                      </h4>
                    </div>

                    {lessonCompleted ? (
                      <span className="badge badge-lime px-2.5 py-1 text-[10px]">
                        Xong
                      </span>
                    ) : (
                      <span className="badge badge-amber px-2.5 py-1 text-[10px]">
                        +{lesson.pointsReward} XP
                      </span>
                    )}
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#5E6571]">
                    {lesson.shortDescription}
                  </p>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[rgba(23,25,29,0.08)]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#B6EF55_0%,#9D84F6_100%)]"
                      style={{ width: barWidth }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </aside>

      <section className="space-y-6 xl:col-span-6">
        <section className="surface-card-strong p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="section-label text-[#7E8692]">Cách học bài này</span>
              <h3 className="mt-2 text-lg font-semibold text-[#17191D]">
                Đi theo từng bước là ổn
              </h3>
            </div>
            <span className="badge badge-purple">{Math.round(stepProgress)}%</span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-5">
            {lessonProgressSteps.map((step) => (
              <LearningStepCard
                key={step.title}
                title={step.title}
                caption={step.caption}
                done={step.done}
                active={step.active}
              />
            ))}
          </div>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-[rgba(23,25,29,0.08)] pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="section-label text-[#7E8692]">Bước 2 đến bước 4</span>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#17191D]">
                {activeLesson.title}
              </h2>
              <p className="mt-1 text-sm text-[#5E6571]">
                Bài học ngắn • {activeLesson.duration} •{" "}
                {selectedCategory === "economics"
                  ? "Kinh tế"
                  : "Tài chính cá nhân"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="badge badge-dark">
                {completedQuizCount}/{totalQuizCount} câu đúng
              </span>
              <span className="badge badge-amber">+{activeLesson.pointsReward} XP</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <SubTabButton
              active={learnSubTab === "video"}
              icon={Icons.PlayCircle}
              label="Bài học ngắn"
              onClick={() => onChangeLearnSubTab("video")}
            />
            <SubTabButton
              active={learnSubTab === "summary"}
              icon={Icons.NotebookTabs}
              label="Tóm tắt nhanh"
              onClick={() => onChangeLearnSubTab("summary")}
            />
            <SubTabButton
              active={learnSubTab === "quiz"}
              icon={Icons.BadgeHelp}
              label="Quiz thử thách"
              onClick={() => onChangeLearnSubTab("quiz")}
            />
          </div>

          <div className="mt-5">
            {learnSubTab === "video" && (
              <VideoPanel
                activeLesson={activeLesson}
                activeScriptIndex={activeScriptIndex}
                isPlaying={isPlaying}
                videoProgress={videoProgress}
                onToggleVideoPlayback={onToggleVideoPlayback}
                onAdvanceScript={onAdvanceScript}
                onSelectScriptIndex={onSelectScriptIndex}
                onGoToSummary={() => onChangeLearnSubTab("summary")}
              />
            )}

            {learnSubTab === "summary" && (
              <SummaryPanel
                activeLesson={activeLesson}
                onGoToQuiz={() => onChangeLearnSubTab("quiz")}
              />
            )}

            {learnSubTab === "quiz" && (
              <div className="space-y-6">
                <div className="surface-card-muted p-5">
                  <p className="text-sm font-semibold text-[#17191D]">Quiz thử thách</p>
                  <p className="mt-2 text-sm leading-6 text-[#5E6571]">
                    Câu sai có thể làm lại. Câu đúng sẽ khóa và chỉ cộng XP một lần.
                    Làm xong bài là bạn có thể qua shop để sắm đồ cho pet.
                  </p>
                </div>

                {activeLesson.quiz.map((question, index) => (
                  <QuizCard
                    key={question.id}
                    question={question}
                    questionNumber={index + 1}
                    selectedAnswer={quizAnswers[question.id]}
                    result={quizResults[question.id]}
                    onSelectOption={(optionIndex) =>
                      onSelectQuizOption(question.id, optionIndex)
                    }
                    onSubmit={() => onSubmitQuiz(question.id)}
                  />
                ))}

                {feedbackMsg && (
                  <div className="surface-card-muted p-4 text-center text-sm text-[#4C3C86]">
                    {feedbackMsg}
                  </div>
                )}

                {isLessonCompleted && (
                  <div className="surface-card-strong space-y-3 p-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(182,239,85,0.18)] text-[#365114]">
                      <Icons.PartyPopper className="h-6 w-6" />
                    </div>
                    <h4 className="font-display text-xl font-bold text-[#17191D]">
                      Bạn đã hiểu phần này rồi, chuyển sang bài tiếp theo thôi.
                    </h4>
                    <p className="mx-auto max-w-md text-sm leading-6 text-[#5E6571]">
                      XP của bài này đã cộng xong. Giờ bạn có thể học tiếp hoặc ghé
                      shop để xem có món nào vừa túi không.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <button onClick={onOpenShop} className="accent-button">
                        <Icons.ShoppingBag className="h-[18px] w-[18px]" />
                        Qua shop xem đồ
                      </button>
                      <button onClick={onOpenPet} className="secondary-button">
                        <Icons.PawPrint className="h-[18px] w-[18px]" />
                        Xem pet của bạn
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </section>

      <aside className="space-y-6 xl:col-span-3">
        <section className="surface-card-dark p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="section-label text-[rgba(248,250,252,0.5)]">
                Theo dõi bài này
              </span>
              <h3 className="mt-2 text-lg font-semibold text-white">
                Tiến độ hiện tại
              </h3>
            </div>
            <Icons.Gauge className="h-5 w-5 text-[#B6EF55]" />
          </div>

          <div className="mt-4 space-y-3 rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Tiến độ bài</span>
              <span>{Math.round(stepProgress)}%</span>
            </div>
            <div className="progress-track bg-[rgba(255,255,255,0.08)]">
              <div className="progress-fill" style={{ width: `${stepProgress}%` }} />
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <p>Đã xem bài: {hasSeenLesson ? "Rồi" : "Chưa"}</p>
              <p>Đã làm quiz: {hasQuizAttempt ? "Rồi" : "Chưa"}</p>
              <p>Đã nhận XP: {hasEarnedXp ? "Rồi" : "Chưa"}</p>
            </div>
          </div>
        </section>

        <section className="surface-card p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="section-label text-[#7E8692]">Pet và phần thưởng</span>
              <h3 className="mt-2 text-lg font-semibold text-[#17191D]">
                Làm quiz để pet lớn dần
              </h3>
            </div>
            <button onClick={onOpenShop} className="secondary-button px-4 py-2.5 text-sm">
              <Icons.ShoppingBag className="h-4 w-4" />
              Shop
            </button>
          </div>

          <div className="mt-4 rounded-[24px] border border-[rgba(23,25,29,0.08)] bg-[linear-gradient(180deg,#FFFFFF_0%,#F6F7F2_100%)] p-4">
            <div className="mx-auto mb-3 max-w-[220px]">
              <PetDisplay petState={petState} showStats={false} />
            </div>

            <div className="space-y-2 text-center">
              <p className="text-sm font-semibold text-[#17191D]">{petState.name}</p>
              <p className="text-sm text-[#5E6571]">
                Ví hiện có <b className="text-[#8A5600]">{petState.points} XP</b>
              </p>
              <p className="text-xs text-[#7E8692]">
                Cứ học tiếp một chút, đồ mới cho pet sẽ gần hơn.
              </p>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}

function TopicButton({
  active,
  label,
  icon: Icon,
  accent,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: typeof Icons.TrendingUp;
  accent: "lime" | "purple";
  onClick: () => void;
}) {
  const activeClass =
    accent === "lime"
      ? "bg-[linear-gradient(135deg,#B6EF55_0%,#D4F48F_100%)] text-[#17191D]"
      : "bg-[linear-gradient(135deg,#C2B2FF_0%,#E2DAFF_100%)] text-[#17191D]";

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-[18px] px-3 py-3 text-sm font-semibold transition-all ${
        active
          ? `${activeClass} shadow-[0_14px_28px_rgba(15,23,42,0.08)]`
          : "border border-[rgba(23,25,29,0.08)] bg-[rgba(248,249,244,0.9)] text-[#5E6571]"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function LearningStepCard({
  title,
  caption,
  done,
  active,
}: {
  title: string;
  caption: string;
  done: boolean;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-[20px] border p-3 ${
        done
          ? "border-[rgba(182,239,85,0.32)] bg-[rgba(182,239,85,0.16)]"
          : active
            ? "border-[rgba(157,132,246,0.28)] bg-[rgba(157,132,246,0.12)]"
            : "border-[rgba(23,25,29,0.08)] bg-white"
      }`}
    >
      <p className="text-xs font-semibold text-[#17191D]">{title}</p>
      <p className="mt-1 text-xs leading-5 text-[#5E6571]">{caption}</p>
    </div>
  );
}

function SubTabButton({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: typeof Icons.PlayCircle;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "bg-[rgba(157,132,246,0.14)] text-[#4C3C86] shadow-[inset_0_0_0_1px_rgba(157,132,246,0.16)]"
          : "border border-[rgba(23,25,29,0.08)] bg-white text-[#5E6571]"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function VideoPanel({
  activeLesson,
  activeScriptIndex,
  isPlaying,
  videoProgress,
  onToggleVideoPlayback,
  onAdvanceScript,
  onSelectScriptIndex,
  onGoToSummary,
}: {
  activeLesson: Lesson;
  activeScriptIndex: number;
  isPlaying: boolean;
  videoProgress: number;
  onToggleVideoPlayback: () => void;
  onAdvanceScript: () => void;
  onSelectScriptIndex: (index: number) => void;
  onGoToSummary: () => void;
}) {
  const activeScript = activeLesson.videoScript[activeScriptIndex];

  return (
    <div className="space-y-4">
      <p className="text-sm leading-6 text-[#5E6571]">
        Học theo từng phân cảnh ngắn. Bạn có thể bấm từng đoạn để đọc lại hoặc
        chuyển nhanh sang phần tóm tắt nếu đã hiểu ý chính.
      </p>

      <div className="relative flex aspect-video flex-col justify-between overflow-hidden rounded-[26px] border border-[rgba(23,25,29,0.08)] bg-[linear-gradient(180deg,#1E2127_0%,#121418_100%)] p-6 text-white shadow-[0_26px_48px_rgba(15,23,42,0.18)]">
        <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between text-xs">
          <span className="badge badge-purple px-3 py-1 text-[11px]">
            Bài học ngắn
          </span>
          <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-3 py-1 text-slate-300">
            ECONVERSE Lesson
          </span>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(157,132,246,0.18),transparent_28%),radial-gradient(circle_at_bottom,rgba(182,239,85,0.18),transparent_32%)]" />

        <div className="relative z-10 my-auto space-y-4 p-6 text-center">
          {!isPlaying ? (
            <button
              onClick={onToggleVideoPlayback}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#B6EF55_0%,#9D84F6_100%)] text-[#17191D] transition-transform hover:scale-[1.03]"
            >
              <Icons.Play className="ml-1 h-6 w-6" />
            </button>
          ) : (
            <div className="space-y-3">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)]">
                <Icons.Clapperboard className="h-7 w-7 text-[#B6EF55]" />
              </span>
              <div className="mx-auto max-w-xl text-base font-medium leading-7 text-slate-100">
                “{activeScript?.text ?? "Đang tải lời thoại..."}”
              </div>
            </div>
          )}

          {!isPlaying && (
            <div>
              <h4 className="text-lg font-semibold text-white">
                Nhấn để xem bài học theo từng phân cảnh
              </h4>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-300">
                Bài học này được chia thành nhiều đoạn ngắn để bạn đọc nhanh và dễ
                nắm ý hơn.
              </p>
            </div>
          )}
        </div>

        <div className="relative z-10 mt-auto space-y-3 rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] p-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-400">
              00:{String(activeScriptIndex * 3).padStart(2, "0")}
            </span>
            <div className="relative h-1.5 flex-1 rounded-full bg-[rgba(255,255,255,0.1)]">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-[linear-gradient(90deg,#B6EF55_0%,#9D84F6_100%)]"
                style={{ width: `${videoProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              00:{String(activeLesson.videoScript.length * 3).padStart(2, "0")}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleVideoPlayback}
                className="font-semibold text-[#D4F48F] hover:text-white"
              >
                {isPlaying ? "Tạm dừng" : "Phát tiếp"}
              </button>
              <button
                onClick={onAdvanceScript}
                className="text-slate-300 hover:text-white"
              >
                Chuyển phân cảnh
              </button>
            </div>

            <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-2.5 py-1 text-[11px] text-slate-300">
              Phân cảnh {activeScriptIndex + 1}/{activeLesson.videoScript.length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
        <div className="surface-card-muted p-5">
          <div className="border-b border-[rgba(23,25,29,0.08)] pb-3">
            <span className="section-label text-[#7E8692]">Nội dung chính</span>
            <h4 className="mt-2 font-display text-lg font-semibold text-[#17191D]">
              {activeLesson.mainContentTitle}
            </h4>
          </div>

          <div className="mt-4 space-y-4">
            {activeLesson.mainContent.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-7 text-[#5E6571]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className="surface-card-muted p-5">
          <div className="border-b border-[rgba(23,25,29,0.08)] pb-3">
            <span className="section-label text-[#7E8692]">Mục tiêu bài học</span>
            <h4 className="mt-2 font-display text-lg font-semibold text-[#17191D]">
              Nắm được ý chính trước khi qua quiz
            </h4>
          </div>

          <div className="mt-4 space-y-3">
            {activeLesson.summary.points.map((point) => (
              <div key={point} className="flex items-start gap-3">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[#4C3C86] shadow-[inset_0_0_0_1px_rgba(23,25,29,0.08)]">
                  <Icons.Check className="h-3.5 w-3.5" />
                </span>
                <p className="text-sm leading-6 text-[#5E6571]">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="surface-card-muted p-4">
        <div className="mb-3 flex items-center justify-between border-b border-[rgba(23,25,29,0.08)] pb-2">
          <span className="text-sm font-semibold text-[#17191D]">
            Lời thoại từng đoạn
          </span>
          <span className="text-xs text-[#7E8692]">
            Bấm để mở lại đoạn cần xem
          </span>
        </div>

        <div className="max-h-56 space-y-3 overflow-y-auto pr-1">
          {activeLesson.videoScript.map((script, index) => (
            <ScriptButton
              key={`${script.role}-${index}`}
              script={script}
              isActive={activeScriptIndex === index}
              onClick={() => onSelectScriptIndex(index)}
            />
          ))}
        </div>
      </div>

      <div className="surface-card-muted flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="text-sm leading-6 text-[#5E6571]">
          Nếu đã ổn rồi thì chuyển sang phần tóm tắt nhanh để khóa lại ý chính.
        </p>
        <button onClick={onGoToSummary} className="secondary-button px-4 py-2.5 text-sm">
          <Icons.NotebookTabs className="h-4 w-4" />
          Sang phần tóm tắt
        </button>
      </div>
    </div>
  );
}

function SummaryPanel({
  activeLesson,
  onGoToQuiz,
}: {
  activeLesson: Lesson;
  onGoToQuiz: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="surface-card-muted p-5">
        <div className="flex items-center gap-2 border-b border-[rgba(23,25,29,0.08)] pb-3">
          <Icons.NotebookTabs className="h-5 w-5 text-[#4C3C86]" />
          <span className="font-display text-lg font-semibold text-[#17191D]">
            {activeLesson.summary.title}
          </span>
        </div>

        <div className="mt-5 grid items-center gap-6 md:grid-cols-12">
          <div className="space-y-3 md:col-span-8">
            {activeLesson.summary.points.map((point, index) => (
              <div key={point} className="flex items-start gap-3 text-sm text-[#5E6571]">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-mono text-xs font-bold text-[#4C3C86] shadow-[inset_0_0_0_1px_rgba(23,25,29,0.08)]">
                  {index + 1}
                </span>
                <p className="leading-6">{point}</p>
              </div>
            ))}
          </div>

          <div className="surface-card md:col-span-4">
            <div className="rounded-[24px] p-4 text-center">
              <span className="block text-[10px] uppercase tracking-[0.16em] text-[#7E8692]">
                Nhìn nhanh một phát
              </span>
              <MiniLessonVisual lessonId={activeLesson.id} />
              <span className="block text-xs text-[#5E6571]">
                Xem xong phần này là đủ tự tin qua quiz.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-card-muted flex flex-wrap items-center justify-between gap-3 p-4">
        <p className="text-sm leading-6 text-[#5E6571]">
          Nếu đã hiểu phần này rồi thì sang quiz luôn. Câu đúng sẽ cộng XP ngay.
        </p>
        <button onClick={onGoToQuiz} className="accent-button">
          <Icons.BadgeHelp className="h-[18px] w-[18px]" />
          Sang quiz thử thách
        </button>
      </div>
    </div>
  );
}

function ScriptButton({
  script,
  isActive,
  onClick,
}: {
  script: VideoScriptLine;
  isActive: boolean;
  onClick: () => void;
}) {
  const roleColor =
    script.role === "Youtuber"
      ? "text-[#0F766E]"
      : script.role === "Meme"
        ? "text-[#9B365E]"
        : script.role === "Học sinh"
          ? "text-[#8A5600]"
          : "text-[#4C3C86]";

  return (
    <button
      onClick={onClick}
      className={`block w-full rounded-[18px] border p-3 text-left text-sm transition-all ${
        isActive
          ? "border-[rgba(157,132,246,0.28)] bg-white text-[#17191D] shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
          : "border-[rgba(23,25,29,0.08)] bg-[rgba(248,249,244,0.7)] text-[#5E6571]"
      }`}
    >
      <div className="mb-2 flex justify-between gap-3">
        <span className={`text-xs font-semibold uppercase tracking-wide ${roleColor}`}>
          {script.role}
        </span>
        {script.action && (
          <span className="text-[11px] italic text-[#7E8692]">{script.action}</span>
        )}
      </div>
      <p>{script.text}</p>
    </button>
  );
}

function MiniLessonVisual({ lessonId }: { lessonId: string }) {
  if (lessonId === "econ-l1") {
    return (
      <div className="space-y-2 py-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#9B365E]">Cầu tăng</span>
          <span className="font-bold text-[#365114]">Giá có thể tăng</span>
        </div>
        <div className="h-px bg-[rgba(23,25,29,0.08)]" />
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#0F766E]">Cung tăng</span>
          <span className="font-bold text-[#D97706]">Giá có thể giảm</span>
        </div>
      </div>
    );
  }

  if (lessonId === "econ-l2") {
    return (
      <div className="space-y-2 py-4">
        <div className="text-xs font-bold text-[#9B365E]">Lạm phát</div>
        <div className="text-2xl">💸 → 🧺</div>
        <div className="text-[11px] text-[#7E8692]">
          Tiền mua được ít đồ hơn trước
        </div>
      </div>
    );
  }

  if (lessonId === "fin-l1") {
    return (
      <div className="space-y-2 py-4">
        <div className="text-xs font-bold text-[#17191D]">Quy tắc 50/30/20</div>
        <div className="mt-2 grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
          <div className="rounded-sm bg-[rgba(182,239,85,0.18)] p-1 text-[#365114]">
            50% Cần
          </div>
          <div className="rounded-sm bg-[rgba(242,138,167,0.15)] p-1 text-[#9B365E]">
            30% Muốn
          </div>
          <div className="rounded-sm bg-[rgba(157,132,246,0.16)] p-1 text-[#4C3C86]">
            20% Tiết kiệm
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 py-4">
      <div className="text-xs font-bold text-[#8A5600]">Lãi kép</div>
      <div className="flex h-10 w-full items-end justify-center gap-1.5 px-3">
        <div className="h-2 w-4 bg-[#D8DDD1]" />
        <div className="h-3 w-4 bg-[#C9D0C1]" />
        <div className="h-5 w-4 bg-[#BBC4B2]" />
        <div className="h-8 w-4 bg-[#9D84F6]" />
        <div className="h-11 w-4 bg-[linear-gradient(180deg,#B6EF55_0%,#9D84F6_100%)]" />
      </div>
    </div>
  );
}
