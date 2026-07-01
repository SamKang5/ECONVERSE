import * as Icons from "lucide-react";

import type { CourseModule } from "../../types";
import { LessonRow } from "./LessonRow";

interface ModuleSectionProps {
  module: CourseModule;
  lessonsCompleted: string[];
  onOpenLesson: (lessonId: string) => void;
}

const moduleIcons = {
  LineChart: Icons.LineChart,
  PiggyBank: Icons.PiggyBank,
  TrendingUp: Icons.TrendingUp,
  Users: Icons.Users,
  Wallet: Icons.Wallet,
} as const;

export function ModuleSection({
  module,
  lessonsCompleted,
  onOpenLesson,
}: ModuleSectionProps) {
  const Icon = moduleIcons[module.icon as keyof typeof moduleIcons] ?? Icons.BookOpen;
  const completedCount = module.lessons.filter((lesson) =>
    lessonsCompleted.includes(lesson.id),
  ).length;
  const progress =
    module.lessons.length === 0
      ? 0
      : (completedCount / module.lessons.length) * 100;

  return (
    <section className="surface-card p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-[rgba(23,25,29,0.08)] pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[rgba(182,239,85,0.18)] text-[#365114]">
            <Icon className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7E8692]">
              Module học
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-[#17191D]">
              {module.title}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[#5E6571]">
              {module.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 rounded-[18px] bg-[rgba(23,25,29,0.04)] px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7E8692]">
            Tiến độ
          </p>
          <p className="mt-1 text-lg font-bold text-[#17191D]">
            {completedCount}/{module.lessons.length}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {module.lessons.map((lesson) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            isCompleted={lessonsCompleted.includes(lesson.id)}
            onClick={() => onOpenLesson(lesson.id)}
          />
        ))}
      </div>
    </section>
  );
}
