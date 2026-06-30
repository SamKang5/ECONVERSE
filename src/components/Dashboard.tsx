import * as Icons from "lucide-react";

import { INITIAL_COURSES } from "../data";
import type { CourseCategory, PetState } from "../types";
import { PetDisplay } from "./PetDisplay";

interface DashboardProps {
  petState: PetState;
  completedLessonCount: number;
  totalLessonCount: number;
  streakDays: number;
  nextLessonTitle: string;
  nextLessonCategoryLabel: string;
  onContinueLearning: () => void;
  onOpenCourse: (category: CourseCategory) => void;
  onOpenPet: () => void;
  onOpenShop: () => void;
}

const courseMeta: Record<
  CourseCategory,
  { accent: string; chip: string; icon: typeof Icons.TrendingUp; label: string }
> = {
  economics: {
    accent: "text-[#365114]",
    chip: "bg-[rgba(182,239,85,0.22)]",
    icon: Icons.TrendingUp,
    label: "Kinh tế",
  },
  finance: {
    accent: "text-[#4C3C86]",
    chip: "bg-[rgba(157,132,246,0.16)]",
    icon: Icons.PiggyBank,
    label: "Tài chính",
  },
};

export function Dashboard({
  petState,
  completedLessonCount,
  totalLessonCount,
  streakDays,
  nextLessonTitle,
  nextLessonCategoryLabel,
  onContinueLearning,
  onOpenCourse,
  onOpenPet,
  onOpenShop,
}: DashboardProps) {
  const progressPercent =
    totalLessonCount === 0 ? 0 : (completedLessonCount / totalLessonCount) * 100;
  const ownedCount = petState.ownedAccessories.length;
  const xpToNextLevel = Math.max(petState.level * 300 - petState.points, 0);
  const primaryCtaLabel =
    completedLessonCount > 0 ? "Tiếp tục bài học" : "Bắt đầu học";

  return (
    <div className="space-y-6">
      <section className="surface-card overflow-hidden p-5 sm:p-6 xl:p-7">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.42fr)_360px]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge badge-lime">
                <Icons.Sparkles className="h-4 w-4" />
                Lộ trình học được làm gọn hơn
              </span>
              <span className="badge badge-purple">
                <Icons.Clock3 className="h-4 w-4" />
                Mỗi ngày một bước nhỏ
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-3xl font-bold tracking-tight text-[#17191D] md:text-4xl">
                Mọi thứ bạn cần cho nhịp học hôm nay nằm gọn trong một dashboard.
              </h3>
              <p className="max-w-3xl text-sm leading-7 text-[#5E6571] sm:text-[0.98rem]">
                Theo dõi số bài đã xong, XP đang có và hành trình của pet trong một
                bố cục sáng hơn, thoáng hơn và dễ quay lại mỗi ngày.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <DashboardStat
                label="Tiến độ"
                value={`${completedLessonCount}/${totalLessonCount}`}
                caption="Bài đã hoàn thành"
                accentClassName="text-[#4C3C86]"
              />
              <DashboardStat
                label="Ví XP"
                value={`${petState.points}`}
                caption="Dùng để mở vật phẩm"
                accentClassName="text-[#365114]"
              />
              <DashboardStat
                label="Chuỗi học"
                value={`${streakDays} ngày`}
                caption="Nhịp quay lại đều"
                accentClassName="text-[#9B365E]"
              />
              <DashboardStat
                label="Pet"
                value={`Level ${petState.level}`}
                caption={`${ownedCount} món đã mở`}
                accentClassName="text-[#0F766E]"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={onContinueLearning} className="accent-button">
                <Icons.PlayCircle className="h-[18px] w-[18px]" />
                {primaryCtaLabel}
              </button>
              <button onClick={onOpenShop} className="secondary-button">
                <Icons.ShoppingBag className="h-[18px] w-[18px]" />
                Mở shop
              </button>
            </div>
          </div>

          <div className="surface-card-dark p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="section-label text-[rgba(248,250,252,0.55)]">
                  Tiến độ hiện tại
                </p>
                <h4 className="mt-2 text-xl font-semibold text-white">
                  Hôm nay học nhẹ một bài thôi cũng đã đủ tốt.
                </h4>
              </div>
              <span className="sidebar-chip">
                <Icons.Target className="h-3.5 w-3.5 text-[#B6EF55]" />
                {nextLessonCategoryLabel}
              </span>
            </div>

            <div className="mt-5 space-y-4 rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4">
              <div>
                <p className="text-sm font-semibold text-white">{nextLessonTitle}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Quay lại đúng bài đang cần, hoặc đi vào trang pet và shop nếu bạn
                  muốn tự thưởng một chặng nghỉ ngắn.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Tiến độ toàn app</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="progress-track bg-[rgba(255,255,255,0.08)]">
                  <div
                    className="progress-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  onClick={onContinueLearning}
                  className="rounded-[18px] bg-white px-4 py-4 text-left text-[#17191D] transition-transform hover:-translate-y-[1px]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7E8692]">
                    Tiếp tục ngay
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    Quay lại đúng chỗ bạn đang học.
                  </p>
                </button>
                <button
                  onClick={onOpenPet}
                  className="rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] px-4 py-4 text-left text-white transition-transform hover:-translate-y-[1px]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B6EF55]">
                    Góc pet
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    Xem level và các món đang dùng.
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)]">
        <div className="surface-card p-5 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-[rgba(23,25,29,0.08)] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-label text-[#7E8692]">Chọn tuyến học</span>
              <h3 className="mt-2 font-display text-2xl font-bold text-[#17191D]">
                Hai hướng học rõ ràng, mở nhanh và dễ quay lại.
              </h3>
            </div>
            <span className="badge badge-dark">
              <Icons.BookOpenCheck className="h-4 w-4" />
              4 bài học ngắn
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {INITIAL_COURSES.map((course) => {
              const meta = courseMeta[course.category];
              const Icon = meta.icon;

              return (
                <button
                  key={course.id}
                  onClick={() => onOpenCourse(course.category)}
                  className="surface-card-muted group p-5 text-left transition-transform hover:-translate-y-[2px] hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-[1.1rem] ${meta.chip}`}
                    >
                      <Icon className={`h-5 w-5 ${meta.accent}`} />
                    </div>
                    <span className={`text-xs font-semibold ${meta.accent}`}>
                      {meta.label}
                    </span>
                  </div>
                  <h4 className="mt-4 text-lg font-semibold text-[#17191D]">
                    {course.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-[#5E6571]">
                    {course.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-[#7E8692]">
                    <span>{course.lessons.length} bài học</span>
                    <span className="font-semibold text-[#4C3C86]">
                      +
                      {course.lessons.reduce(
                        (sum, lesson) => sum + lesson.pointsReward,
                        0,
                      )}{" "}
                      XP
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="surface-card-strong p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <span className="section-label text-[#7E8692]">Nuôi pet học tập</span>
              <h3 className="mt-2 font-display text-2xl font-bold text-[#17191D]">
                Mỗi bài xong là pet lại có thêm lý do để vui hơn.
              </h3>
            </div>
            <button onClick={onOpenShop} className="secondary-button px-4 py-2.5 text-sm">
              <Icons.ShoppingBag className="h-4 w-4" />
              Xem shop
            </button>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] xl:items-start">
            <PetDisplay petState={petState} showStats={false} />

            <div className="space-y-4">
              <div className="surface-card-muted p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#17191D]">
                      {petState.name}
                    </p>
                    <p className="mt-1 text-sm text-[#5E6571]">
                      Còn {xpToNextLevel} XP nữa là lên level tiếp theo.
                    </p>
                  </div>
                  <span className="badge badge-purple">
                    <Icons.Star className="h-4 w-4" />
                    Level {petState.level}
                  </span>
                </div>
              </div>

              <div className="surface-card-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7E8692]">
                  Vòng lặp học tập
                </p>
                <div className="mt-3 space-y-2 text-sm text-[#5E6571]">
                  <p>1. Đọc bài ngắn và nắm ý chính.</p>
                  <p>2. Trả lời quiz để nhận XP ngay.</p>
                  <p>3. Dùng XP để mở thêm đồ cho pet.</p>
                </div>
              </div>

              <button onClick={onOpenPet} className="accent-button w-full">
                <Icons.PawPrint className="h-[18px] w-[18px]" />
                Mở trang pet học tập
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardStat({
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
      <p className={`mt-2 text-[1.65rem] font-black ${accentClassName}`}>{value}</p>
      <p className="mt-1 text-xs text-[#5E6571]">{caption}</p>
    </div>
  );
}
