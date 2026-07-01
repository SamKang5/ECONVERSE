import * as Icons from "lucide-react";

interface LessonNavigationProps {
  backLabel?: string;
  nextLabel?: string;
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
}

export function LessonNavigation({
  backLabel,
  nextLabel,
  onBack,
  onNext,
  nextDisabled = false,
}: LessonNavigationProps) {
  return (
    <div className="surface-card-muted flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        {backLabel && onBack ? (
          <button onClick={onBack} className="secondary-button px-4 py-2.5 text-sm">
            <Icons.ArrowLeft className="h-4 w-4" />
            {backLabel}
          </button>
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>

      <div className="sm:ml-auto">
        {nextLabel && onNext ? (
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
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>
    </div>
  );
}
