import * as Icons from "lucide-react";

import econverseLogo from "../assets/econverse-avatar.jpg";
import type { AppTab, PetState } from "../types";

interface HeaderProps {
  activeTab: AppTab;
  petState: PetState;
  streakDays: number;
  completedLessonCount: number;
  totalLessonCount: number;
  onChangeTab: (tab: AppTab) => void;
  onOpenLearn: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    description: "Tổng quan hôm nay",
    tab: "dashboard" as const,
    icon: Icons.LayoutDashboard,
  },
  {
    label: "Learn",
    description: "Bài học và quiz",
    tab: "learn" as const,
    icon: Icons.BookOpen,
  },
  {
    label: "Pet",
    description: "Bạn đồng hành",
    tab: "pet" as const,
    icon: Icons.PawPrint,
  },
  {
    label: "Shop",
    description: "Đổi XP lấy đồ",
    tab: "shop" as const,
    icon: Icons.ShoppingBag,
  },
  {
    label: "Tips",
    description: "Mẹo và media",
    tab: "media" as const,
    icon: Icons.Lightbulb,
  },
];

export function Header({
  activeTab,
  petState,
  streakDays,
  completedLessonCount,
  totalLessonCount,
  onChangeTab,
  onOpenLearn,
}: HeaderProps) {
  const completedPercent =
    totalLessonCount === 0 ? 0 : (completedLessonCount / totalLessonCount) * 100;

  function handleTabClick(tab: AppTab) {
    if (tab === "learn") {
      onOpenLearn();
      return;
    }

    onChangeTab(tab);
  }

  return (
    <>
      <aside className="app-sidebar hidden px-5 py-6 lg:flex xl:px-6 xl:py-7">
        <button
          onClick={() => onChangeTab("dashboard")}
          className="brand-link brand-link-sidebar flex items-center gap-3 text-left"
          aria-label="Open ECONVERSE dashboard"
        >
          <div className="brand-logo-shell">
            <img
              src={econverseLogo}
              alt="ECONVERSE logo"
              className="brand-logo-image"
            />
          </div>
          <div className="brand-copy min-w-0">
            <div className="brand-title font-display">ECONVERSE</div>
            <p className="brand-subtitle mt-0.5 text-sm text-slate-400">
              Học kinh tế và tài chính theo nhịp riêng.
            </p>
          </div>
        </button>

        <section className="surface-card-dark p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="section-label text-[rgba(248,250,252,0.52)]">
                Hôm nay
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold">
                Học đều để pet lên level đẹp hơn.
              </h2>
            </div>
            <span className="sidebar-chip">
              <Icons.Sparkles className="h-3.5 w-3.5 text-[#B6EF55]" />
              Premium
            </span>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="mini-stat-card">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
                Chuỗi học
              </p>
              <p className="mt-2 text-xl font-bold text-white">{streakDays} ngày</p>
            </div>
            <div className="mini-stat-card">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
                Ví XP
              </p>
              <p className="mt-2 text-xl font-bold text-[#B6EF55]">
                {petState.points} XP
              </p>
            </div>
          </div>
        </section>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;

            return (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                className="sidebar-nav-button"
                data-active={isActive}
              >
                <span className="sidebar-nav-icon">
                  <Icon
                    className={`h-[18px] w-[18px] ${
                      isActive ? "text-[#17191D]" : "text-slate-300"
                    }`}
                  />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span
                    className={`block truncate text-xs ${
                      isActive ? "text-[#5E6571]" : "text-slate-400"
                    }`}
                  >
                    {item.description}
                  </span>
                </span>
                {item.tab === "learn" && (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${
                      isActive
                        ? "bg-[#EEF4C9] text-[#365114]"
                        : "bg-[rgba(182,239,85,0.12)] text-[#B6EF55]"
                    }`}
                  >
                    {completedLessonCount}/{totalLessonCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <section className="surface-card-dark mt-auto p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChangeTab("pet")}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] bg-[rgba(255,255,255,0.08)] text-white transition-transform hover:-translate-y-[1px]"
              title="Mở trang pet"
            >
              <Icons.PawPrint className="h-6 w-6 text-[#B6EF55]" />
            </button>
            <div className="min-w-0">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
                Hồ sơ pet
              </p>
              <p className="truncate text-base font-semibold text-white">
                {petState.name}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Level {petState.level} • {petState.ownedAccessories.length} món đã mở
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Tiến độ toàn app</span>
              <span>{Math.round(completedPercent)}%</span>
            </div>
            <div className="progress-track bg-[rgba(255,255,255,0.08)]">
              <div className="progress-fill" style={{ width: `${completedPercent}%` }} />
            </div>
          </div>
        </section>
      </aside>

      <header className="border-b border-[rgba(23,25,29,0.08)] bg-[rgba(255,255,255,0.55)] px-4 py-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => onChangeTab("dashboard")}
            className="brand-link brand-link-mobile group flex cursor-pointer items-center gap-3 rounded-[1.5rem] bg-[#17191D] px-2.5 py-2 pr-4 text-left shadow-[0_16px_28px_rgba(15,23,42,0.12)] sm:pr-5"
            aria-label="Open ECONVERSE dashboard"
          >
            <div className="brand-logo-shell">
              <img
                src={econverseLogo}
                alt="ECONVERSE logo"
                className="brand-logo-image"
              />
            </div>
            <div className="brand-copy min-w-0">
              <h1 className="brand-title font-display text-white">ECONVERSE</h1>
              <p className="brand-subtitle mt-0.5 text-[11px] text-slate-400 sm:block">
                Học kinh tế và tài chính theo nhịp riêng.
              </p>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:flex">
              <div className="rounded-full bg-[rgba(182,239,85,0.18)] px-2.5 py-1 text-xs font-bold text-[#365114]">
                {petState.points} XP
              </div>
              <div className="rounded-full bg-[rgba(105,215,221,0.14)] px-2.5 py-1 text-xs font-semibold text-[#0F766E]">
                Lv {petState.level}
              </div>
              <div className="rounded-full bg-[rgba(242,138,167,0.15)] px-2.5 py-1 text-xs font-semibold text-[#9B365E]">
                {streakDays} ngày
              </div>
            </div>

            <button
              onClick={() => onChangeTab("pet")}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-[rgba(23,25,29,0.08)] bg-white/90 p-1 pr-3 text-xs text-[#17191D] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-[1px]"
              title="Mở trang pet"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#EEF4C9_0%,#F1EEFF_100%)]">
                <Icons.PawPrint className="h-[18px] w-[18px] text-[#4C3C86]" />
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-[10px] uppercase tracking-wide text-[#7E8692]">
                  Pet học tập
                </div>
                <div className="max-w-[90px] truncate font-semibold text-[#17191D]">
                  {petState.name}
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      <div className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 px-2 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 lg:hidden">
        <nav className="mx-auto grid max-w-3xl grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;

            return (
              <button
                key={item.tab}
                onClick={() => handleTabClick(item.tab)}
                className="mobile-nav-button px-1 py-2 text-[11px] font-medium"
                data-active={isActive}
              >
                <Icon
                  className={`h-5 w-5 ${
                    isActive ? "text-[#4C3C86]" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
