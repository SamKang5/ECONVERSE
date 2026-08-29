import * as Icons from "lucide-react";

interface LessonNavigationProps {
  backLabel?: string;
  nextLabel?: string;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  prevLessonLabel?: string;
  onPrevLesson?: () => void;
  nextLessonLabel?: string;
  onNextLesson?: () => void;
}

export function LessonNavigation({
  backLabel,
  nextLabel,
  onBack,
  onNext,
  nextDisabled = false,
  prevLessonLabel,
  onPrevLesson,
  nextLessonLabel,
  onNextLesson,
}: LessonNavigationProps) {
  return (
    <div className="surface-card-muted flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        {backLabel && onBack && (
          <button onClick={onBack} className="secondary-button px-4 py-2.5 text-sm">
            <Icons.ArrowLeft className="h-4 w-4" />
            {backLabel}
          </button>
        )}
        {prevLessonLabel && onPrevLesson && (
          <button
            onClick={onPrevLesson}
            className="secondary-button px-3.5 py-2.5 text-xs text-[#5E6571]"
          >
            <Icons.ChevronLeft className="h-4 w-4" />
            {prevLessonLabel}
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
        {nextLessonLabel && onNextLesson && (
          <button
            onClick={onNextLesson}
            className="secondary-button px-3.5 py-2.5 text-xs text-[#5E6571]"
          >
            {nextLessonLabel}
            <Icons.ChevronRight className="h-4 w-4" />
          </button>
        )}
        {nextLabel && onNext && (
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className={`accent-button px-4 py-2.5 text-sm ${
              nextDisabled ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {nextLabel}
            <Icons.ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
