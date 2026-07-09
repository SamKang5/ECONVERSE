import * as Icons from "lucide-react";

import type { PetState } from "../types";

interface RecentLessonSummary {
  moduleTitle: string | null;
  lessonTitle: string | null;
  lessonId: string | null;
  isCompleted: boolean;
}

interface DashboardProps {
  petState: PetState;
  completedLessonCount: number;
  totalLessonCount: number;
  streakDays: number;
  nextLessonTitle: string;
  nextLessonCategoryLabel: string;
  recentLesson: RecentLessonSummary;
  onContinueLearning: () => void;
  onOpenRecentLesson: (() => void) | null;
  onOpenPet: () => void;
  onOpenShop: () => void;
}

export function Dashboard({
  petState,
  completedLessonCount,
  totalLessonCount,
  streakDays,
  nextLessonTitle,
  nextLessonCategoryLabel,
  recentLesson,
  onContinueLearning,
  onOpenRecentLesson,
  onOpenPet,
  onOpenShop,
}: DashboardProps) {
  const progressPercent =
    totalLessonCount === 0 ? 0 : (completedLessonCount / totalLessonCount) * 100;
  const primaryCtaLabel =
    completedLessonCount > 0 ? "Tiếp tục bài học" : "Bắt đầu học";
  const hasRecentLesson = Boolean(
    recentLesson.lessonId && recentLesson.lessonTitle && recentLesson.moduleTitle,
  );

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
                caption={`${petState.ownedAccessories.length} món đã mở`}
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
              <span className="section-label text-[#7E8692]">Bài học gần nhất</span>
              <h3 className="mt-2 font-display text-2xl font-bold text-[#17191D]">
                Quay lại đúng bài bạn vừa mở mà không cần tìm lại.
              </h3>
            </div>
            <span className="badge badge-dark">
              <Icons.History className="h-4 w-4" />
              {hasRecentLesson ? "Đã lưu gần đây" : "Chưa có"}
            </span>
          </div>

          {hasRecentLesson ? (
            <button
              onClick={onOpenRecentLesson ?? undefined}
              className="surface-card-muted mt-5 flex w-full flex-col gap-4 p-5 text-left transition-transform hover:-translate-y-[2px] hover:shadow-[0_18px_36px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-[rgba(157,132,246,0.16)]">
                  <Icons.BookMarked className="h-5 w-5 text-[#4C3C86]" />
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    recentLesson.isCompleted
                      ? "bg-[rgba(182,239,85,0.22)] text-[#365114]"
                      : "bg-[rgba(157,132,246,0.14)] text-[#4C3C86]"
                  }`}
                >
                  {recentLesson.isCompleted ? "Đã hoàn thành" : "Đang học"}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7E8692]">
                  {recentLesson.moduleTitle}
                </p>
                <h4 className="text-lg font-semibold text-[#17191D]">
                  {recentLesson.lessonTitle}
                </h4>
                <p className="text-sm leading-6 text-[#5E6571]">
                  {recentLesson.isCompleted
                    ? "Bài này đã xong. Bạn có thể mở lại để xem video hoặc làm quiz."
                    : "Tiếp tục đúng bài học bạn vừa mở trong luồng Learn hiện tại."}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7E8692]">
                  {recentLesson.isCompleted ? "Sẵn sàng xem lại" : "Sẵn sàng tiếp tục"}
                </span>
                <span className="accent-button px-5 py-3 text-sm">
                  <Icons.PlayCircle className="h-[18px] w-[18px]" />
                  Tiếp tục học
                </span>
              </div>
            </button>
          ) : (
            <div className="surface-card-muted mt-5 flex min-h-[220px] flex-col items-start justify-center gap-4 p-5 sm:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] bg-[rgba(23,25,29,0.08)]">
                <Icons.BookDashed className="h-5 w-5 text-[#7E8692]" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-[#17191D]">
                  Chưa có bài học gần nhất
                </p>
                <p className="max-w-2xl text-sm leading-7 text-[#5E6571]">
                  Khi bạn mở một bài trong Learn, ECONVERSE sẽ lưu lại ở đây để
                  bạn quay lại nhanh hơn.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="surface-card-strong p-5 sm:p-6">
          <div className="flex h-full min-h-[420px] flex-col justify-between">
            <div>
              <span className="section-label text-[#7E8692]">Nuôi pet học tập</span>
              <h3 className="mt-2 font-display text-2xl font-bold text-[#17191D]">
                Sắp ra mắt
              </h3>
            </div>

            <div className="surface-card-muted flex flex-1 flex-col items-start justify-center gap-4 p-5 sm:p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-[linear-gradient(135deg,rgba(182,239,85,0.22)_0%,rgba(157,132,246,0.16)_100%)]">
                <Icons.Clock3 className="h-7 w-7 text-[#4C3C86]" />
              </div>

              <div className="space-y-3">
                <p className="text-lg font-semibold text-[#17191D]">Sắp ra mắt</p>
                <p className="max-w-xl text-sm leading-7 text-[#5E6571] sm:text-[0.98rem]">
                  Tính năng nuôi pet học tập đang được phát triển và sẽ có trong
                  bản cập nhật sắp tới.
                </p>
              </div>
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
