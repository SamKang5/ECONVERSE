import type { Question, QuizStatus } from "../types";

interface QuizCardProps {
  question: Question;
  questionNumber: number;
  selectedAnswer?: number;
  result?: QuizStatus;
  onSelectOption: (optionIndex: number) => void;
  onSubmit: () => void;
}

export function QuizCard({
  question,
  questionNumber,
  selectedAnswer,
  result,
  onSelectOption,
  onSubmit,
}: QuizCardProps) {
  const isCorrect = result === "correct";
  const isIncorrect = result === "incorrect";

  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(157,132,246,0.16)] font-mono text-xs font-bold text-[#4C3C86]">
          Q{questionNumber}
        </span>
        <div>
          <h4 className="text-base font-semibold leading-7 text-[#17191D]">
            {question.question}
          </h4>
          <p className="mt-1 text-sm text-[#5E6571]">
            Chọn đáp án bạn thấy hợp lý nhất rồi kiểm tra ngay.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedAnswer === optionIndex;
          let buttonClass =
            "border-[rgba(23,25,29,0.08)] bg-[rgba(248,249,244,0.9)] text-[#5E6571] hover:border-[rgba(23,25,29,0.14)] hover:bg-white";

          if (isCorrect) {
            if (optionIndex === question.correctAnswer) {
              buttonClass =
                "border-[rgba(182,239,85,0.4)] bg-[rgba(182,239,85,0.18)] text-[#365114]";
            } else {
              buttonClass =
                "border-[rgba(23,25,29,0.06)] bg-[rgba(244,246,240,0.7)] text-[#9CA3AF]";
            }
          } else if (isIncorrect) {
            if (optionIndex === question.correctAnswer) {
              buttonClass =
                "border-[rgba(105,215,221,0.35)] bg-[rgba(105,215,221,0.12)] text-[#0F766E]";
            } else if (isSelected) {
              buttonClass =
                "border-[rgba(242,138,167,0.36)] bg-[rgba(242,138,167,0.14)] text-[#9B365E]";
            }
          } else if (isSelected) {
            buttonClass =
              "border-[rgba(157,132,246,0.34)] bg-[rgba(157,132,246,0.12)] text-[#4C3C86]";
          }

          return (
            <button
              key={option}
              disabled={isCorrect}
              onClick={() => onSelectOption(optionIndex)}
              className={`flex min-h-[92px] items-start gap-3 rounded-[22px] border p-4 text-left text-sm transition-all ${
                isCorrect ? "cursor-default" : "cursor-pointer"
              } ${buttonClass}`}
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-mono text-[11px] uppercase text-[#7E8692] shadow-[inset_0_0_0_1px_rgba(23,25,29,0.08)]">
                {String.fromCharCode(65 + optionIndex)}
              </span>
              <div className="space-y-2">
                <p>{option}</p>
                {isSelected && !isCorrect && (
                  <span className="badge badge-purple px-2.5 py-1 text-[10px]">
                    Đã chọn
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-5 space-y-3">
        <button
          onClick={onSubmit}
          disabled={isCorrect}
          className={
            isCorrect
              ? "rounded-full border border-[rgba(182,239,85,0.35)] bg-[rgba(182,239,85,0.18)] px-5 py-3 text-xs font-bold text-[#365114]"
              : "accent-button px-5 py-3 text-xs"
          }
        >
          {isCorrect
            ? "XP đã cộng cho câu này"
            : isIncorrect
              ? "Thử lại câu này"
              : "Kiểm tra đáp án"}
        </button>

        {result && (
          <div className="surface-card-muted p-4 text-sm leading-7 text-[#5E6571]">
            <p
              className={`mb-2 font-semibold ${
                isCorrect ? "text-[#365114]" : "text-[#9B365E]"
              }`}
            >
              {isCorrect
                ? "Chuẩn rồi. XP của câu này chỉ cộng một lần."
                : "Chưa đúng đâu. Đổi sang đáp án khác rồi thử lại nhé."}
            </p>
            <p>
              <b className="text-[#17191D]">Giải thích:</b> {question.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
