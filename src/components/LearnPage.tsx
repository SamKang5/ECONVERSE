import * as Icons from "lucide-react";

import type {
  CourseModule,
  LearnCategoryFilter,
  Lesson,
  LessonStage,
} from "../types";
import { LessonNavigation } from "./learn/LessonNavigation";
import { LessonPlayer } from "./learn/LessonPlayer";
import { LessonQuiz } from "./learn/LessonQuiz";
import { ModuleSection } from "./learn/ModuleSection";

interface LearnPageProps {
  modules: CourseModule[];
  selectedCategory: LearnCategoryFilter;
  activeModule: CourseModule | null;
  activeLesson: Lesson | null;
  lessonStage: LessonStage;
  lessonsCompleted: string[];
  quizAnswers: Record<string, number>;
  isQuizSubmitted: boolean;
  feedbackMsg: string;
  onSelectCategory: (category: LearnCategoryFilter) => void;
  onOpenLesson: (lessonId: string) => void;
  onBackToCatalog: () => void;
  onChangeLessonStage: (stage: LessonStage) => void;
  onSelectQuizAnswer: (questionId: string, optionIndex: number) => void;
  onSubmitQuiz: () => void;
}

const categoryOptions: Array<{
  value: LearnCategoryFilter;
  label: string;
  icon: typeof Icons.LayoutList;
}> = [
  { value: "all", label: "Tất cả", icon: Icons.LayoutList },
  { value: "economics", label: "Kinh tế", icon: Icons.TrendingUp },
  { value: "finance", label: "Tài chính", icon: Icons.PiggyBank },
];

export function LearnPage({
  modules,
  selectedCategory,
  activeModule,
  activeLesson,
  lessonStage,
  lessonsCompleted,
  quizAnswers,
  isQuizSubmitted,
  feedbackMsg,
  onSelectCategory,
  onOpenLesson,
  onBackToCatalog,
  onChangeLessonStage,
  onSelectQuizAnswer,
  onSubmitQuiz,
}: LearnPageProps) {
  const filteredModules =
    selectedCategory === "all"
      ? modules
      : modules.filter((module) => module.category === selectedCategory);
  const filteredLessons = filteredModules.flatMap((module) => module.lessons);
  const completedFilteredCount = filteredLessons.filter((lesson) =>
    lessonsCompleted.includes(lesson.id),
  ).length;
  const filteredProgress =
    filteredLessons.length === 0
      ? 0
      : (completedFilteredCount / filteredLessons.length) * 100;

  if (activeLesson && activeModule) {
    const moduleCompletedCount = activeModule.lessons.filter((lesson) =>
      lessonsCompleted.includes(lesson.id),
    ).length;
    const moduleProgress =
      activeModule.lessons.length === 0
        ? 0
        : (moduleCompletedCount / activeModule.lessons.length) * 100;

    return (
      <div className="grid gap-6 xl:grid-cols-12">
        <section className="space-y-6 xl:col-span-8">
          <button onClick={onBackToCatalog} className="secondary-button px-4 py-2.5 text-sm">
            <Icons.ArrowLeft className="h-4 w-4" />
            Quay lại danh sách bài học
          </button>

          <section className="surface-card p-5 sm:p-6">
            <div className="flex flex-col gap-4 border-b border-[rgba(23,25,29,0.08)] pb-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className="section-label text-[#7E8692]">
                  {activeModule.title}
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold text-[#17191D] sm:text-3xl">
                  {`Bài ${activeLesson.order ?? "?"} - "${activeLesson.title}"`}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5E6571]">
                  {activeLesson.shortDescription}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="badge badge-dark">{activeLesson.duration}</span>
                <span className="badge badge-purple">
                  {lessonStage === "video" ? "Màn hình video" : "Màn hình quiz"}
                </span>
                {lessonsCompleted.includes(activeLesson.id) && (
                  <span className="badge badge-lime">
                    <Icons.BadgeCheck className="h-4 w-4" />
                    Đã hoàn thành
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5">
              {lessonStage === "video" ? (
                <LessonPlayer lesson={activeLesson} />
              ) : (
                <LessonQuiz
                  lesson={activeLesson}
                  quizAnswers={quizAnswers}
                  isSubmitted={isQuizSubmitted}
                  feedbackMsg={feedbackMsg}
                  onSelectAnswer={onSelectQuizAnswer}
                />
              )}
            </div>
          </section>

          <LessonNavigation
            backLabel={lessonStage === "video" ? "Danh sách bài học" : "Quay lại"}
            nextLabel={lessonStage === "video" ? "Tiếp theo" : "Nộp bài"}
            onBack={
              lessonStage === "video"
                ? onBackToCatalog
                : () => onChangeLessonStage("video")
            }
            onNext={
              lessonStage === "video"
                ? () => onChangeLessonStage("quiz")
                : onSubmitQuiz
            }
          />
        </section>

        <aside className="space-y-6 xl:col-span-4">
          <section className="surface-card-dark p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-label text-[rgba(248,250,252,0.55)]">
                  Tiến độ module
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">
                  Học theo luồng video rồi sang quiz.
                </h3>
              </div>
              <Icons.Route className="h-5 w-5 text-[#B6EF55]" />
            </div>

            <div className="mt-5 space-y-4 rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Đã hoàn thành</span>
                <span>
                  {moduleCompletedCount}/{activeModule.lessons.length}
                </span>
              </div>
              <div className="progress-track bg-[rgba(255,255,255,0.08)]">
                <div className="progress-fill" style={{ width: `${moduleProgress}%` }} />
              </div>
              <div className="space-y-2 text-sm text-slate-300">
                <p>1. Xem phần video hoặc đọc nội dung bài học.</p>
                <p>2. Bấm Tiếp theo để chuyển sang phần quiz.</p>
                <p>3. Dùng Quay lại để trở về màn hình video khi cần.</p>
              </div>
            </div>
          </section>

          <section className="surface-card p-5">
            <div className="border-b border-[rgba(23,25,29,0.08)] pb-4">
              <p className="section-label text-[#7E8692]">Trong module này</p>
              <h3 className="mt-2 text-lg font-semibold text-[#17191D]">
                Danh sách bài học
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              {activeModule.lessons.map((lesson) => {
                const isActive = lesson.id === activeLesson.id;
                const isCompleted = lessonsCompleted.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onOpenLesson(lesson.id)}
                    className={`block w-full rounded-[18px] border p-4 text-left transition-all ${
                      isActive
                        ? "border-[rgba(157,132,246,0.26)] bg-[rgba(157,132,246,0.08)]"
                        : "border-[rgba(23,25,29,0.08)] bg-[rgba(248,249,244,0.9)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#17191D]">
                        {`Bài ${lesson.order ?? "?"} - "${lesson.title}"`}
                      </p>
                      {isCompleted && (
                        <Icons.BadgeCheck className="h-4 w-4 text-[#365114]" />
                      )}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-[#5E6571]">
                      {lesson.duration}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <section className="space-y-6 xl:col-span-8">
        <section className="surface-card overflow-hidden p-5 sm:p-6 xl:p-7">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge badge-lime">
                <Icons.BookOpenCheck className="h-4 w-4" />
                Danh sách bài học
              </span>
              <span className="badge badge-purple">
                <Icons.Route className="h-4 w-4" />
                Video rồi đến quiz
              </span>
            </div>

            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#17191D] sm:text-4xl">
                Học theo module, mở từng bài và đi hết một luồng rõ ràng.
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5E6571] sm:text-[0.98rem]">
                Chọn module, bấm vào một bài học, xem phần video trước rồi chuyển sang
                quiz bằng nút <b>Tiếp theo</b>. Tất cả vẫn giữ cùng theme và branding
                hiện tại của ECONVERSE.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((option) => {
                const Icon = option.icon;
                const isActive = selectedCategory === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => onSelectCategory(option.value)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[rgba(157,132,246,0.14)] text-[#4C3C86] shadow-[inset_0_0_0_1px_rgba(157,132,246,0.16)]"
                        : "border border-[rgba(23,25,29,0.08)] bg-white text-[#5E6571]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <div className="space-y-6">
          {filteredModules.map((module) => (
            <ModuleSection
              key={module.id}
              module={module}
              lessonsCompleted={lessonsCompleted}
              onOpenLesson={onOpenLesson}
            />
          ))}
        </div>
      </section>

      <aside className="space-y-6 xl:col-span-4">
        <section className="surface-card-dark p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-label text-[rgba(248,250,252,0.55)]">
                Cách học mới
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                Một bài học, hai bước rất rõ.
              </h3>
            </div>
            <Icons.Workflow className="h-5 w-5 text-[#B6EF55]" />
          </div>

          <div className="mt-5 space-y-3 rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 text-sm text-slate-300">
            <p>1. Chọn một bài trong danh sách module.</p>
            <p>2. Xem màn hình video hoặc đọc phần nội dung mô phỏng.</p>
            <p>3. Bấm Tiếp theo để sang quiz và nộp bài.</p>
          </div>
        </section>

        <section className="surface-card p-5">
          <div className="flex items-center justify-between gap-3 border-b border-[rgba(23,25,29,0.08)] pb-4">
            <div>
              <p className="section-label text-[#7E8692]">Tiến độ</p>
              <h3 className="mt-2 text-lg font-semibold text-[#17191D]">
                Theo dõi phần đã học
              </h3>
            </div>
            <span className="badge badge-dark">
              {completedFilteredCount}/{filteredLessons.length}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${filteredProgress}%` }} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="surface-card-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7E8692]">
                  Module đang hiển thị
                </p>
                <p className="mt-2 text-lg font-bold text-[#17191D]">
                  {filteredModules.length}
                </p>
              </div>
              <div className="surface-card-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7E8692]">
                  Bài học
                </p>
                <p className="mt-2 text-lg font-bold text-[#17191D]">
                  {filteredLessons.length}
                </p>
              </div>
            </div>
          </div>
        </section>
      </aside>
    </div>
  );
}
