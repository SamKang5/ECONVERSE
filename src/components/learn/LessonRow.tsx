import * as Icons from "lucide-react";

import type { Lesson } from "../../types";

interface LessonRowProps {
  lesson: Lesson;
  isCompleted: boolean;
  onClick: () => void;
}

export function LessonRow({ lesson, isCompleted, onClick }: LessonRowProps) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-[22px] border border-[rgba(23,25,29,0.08)] bg-white px-4 py-4 text-left transition-all hover:-translate-y-[1px] hover:shadow-[0_16px_30px_rgba(15,23,42,0.08)]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[rgba(157,132,246,0.12)] text-[#4C3C86]">
        {isCompleted ? (
          <Icons.BadgeCheck className="h-5 w-5" />
        ) : (
          <Icons.PlayCircle className="h-5 w-5" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[#17191D]">
          {`Bài ${lesson.order ?? "?"} - "${lesson.title}"`}
        </p>
        <p className="mt-1 text-sm leading-6 text-[#5E6571]">
          {lesson.shortDescription}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7E8692]">
          {lesson.duration}
        </p>
        <span
          className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            isCompleted
              ? "bg-[rgba(182,239,85,0.22)] text-[#365114]"
              : "bg-[rgba(157,132,246,0.12)] text-[#4C3C86]"
          }`}
        >
          {isCompleted ? "Đã hoàn thành" : `+${lesson.pointsReward} XP`}
        </span>
      </div>
    </button>
  );
}
