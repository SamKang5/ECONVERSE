import * as Icons from "lucide-react";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComingSoonModal({
  isOpen,
  onClose,
}: ComingSoonModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(23,25,29,0.48)] px-4 py-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
    >
      <div className="surface-card-strong w-full max-w-xl p-5 sm:p-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge badge-purple">
              <Icons.Clock3 className="h-4 w-4" />
              ECONVERSE
            </span>
            <span className="section-label text-[#7E8692]">
              Tính năng đang hoàn thiện
            </span>
          </div>

          <div className="space-y-3">
            <h2
              id="coming-soon-title"
              className="font-display text-3xl font-bold tracking-tight text-[#17191D] sm:text-4xl"
            >
              Sắp ra mắt
            </h2>
            <p className="text-sm leading-7 text-[#5E6571] sm:text-[0.98rem]">
              Tính năng này đang được phát triển và sẽ có trong bản cập nhật
              sắp tới.
            </p>
          </div>

          <div>
            <button onClick={onClose} className="secondary-button">
              <Icons.ArrowLeft className="h-[18px] w-[18px]" />
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
