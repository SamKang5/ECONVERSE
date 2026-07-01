import * as Icons from "lucide-react";

import type { Lesson } from "../../types";

interface LessonQuizProps {
  lesson: Lesson;
  quizAnswers: Record<string, number>;
  isSubmitted: boolean;
  feedbackMsg: string;
  onSelectAnswer: (questionId: string, optionIndex: number) => void;
}

export function LessonQuiz({
  lesson,
  quizAnswers,
  isSubmitted,
  feedbackMsg,
  onSelectAnswer,
}: LessonQuizProps) {
  const selectedCount = lesson.quiz.filter(
    (question) => quizAnswers[question.id] !== undefined,
  ).length;
  const correctCount = lesson.quiz.filter(
    (question) => quizAnswers[question.id] === question.correctAnswer,
  ).length;

  return (
    <div className="space-y-6">
      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 border-b border-[rgba(23,25,29,0.08)] pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-label text-[#7E8692]">Câu hỏi</p>
            <h3 className="mt-2 text-xl font-semibold text-[#17191D]">
              Quiz của bài học
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#5E6571]">
              Chọn đáp án cho từng câu rồi bấm <b>Nộp bài</b> ở góc dưới bên phải.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="badge badge-dark">
              {selectedCount}/{lesson.quiz.length} câu đã chọn
            </span>
            {isSubmitted && (
              <span className="badge badge-lime">
                {correctCount}/{lesson.quiz.length} câu đúng
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {lesson.quiz.map((question, questionIndex) => {
            const selectedAnswer = quizAnswers[question.id];

            return (
              <div key={question.id} className="surface-card-muted p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(157,132,246,0.16)] font-mono text-xs font-bold text-[#4C3C86]">
                    {questionIndex + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7E8692]">
                      Câu hỏi {questionIndex + 1}
                    </p>
                    <h4 className="mt-1 text-base font-semibold leading-7 text-[#17191D]">
                      {question.question}
                    </h4>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = selectedAnswer === optionIndex;
                    const isCorrectOption = question.correctAnswer === optionIndex;
                    const isIncorrectSelected =
                      isSubmitted && isSelected && !isCorrectOption;

                    let optionClass =
                      "border-[rgba(23,25,29,0.08)] bg-white text-[#5E6571]";

                    if (isSubmitted && isCorrectOption) {
                      optionClass =
                        "border-[rgba(182,239,85,0.4)] bg-[rgba(182,239,85,0.18)] text-[#365114]";
                    } else if (isIncorrectSelected) {
                      optionClass =
                        "border-[rgba(242,138,167,0.36)] bg-[rgba(242,138,167,0.14)] text-[#9B365E]";
                    } else if (isSelected) {
                      optionClass =
                        "border-[rgba(157,132,246,0.34)] bg-[rgba(157,132,246,0.12)] text-[#4C3C86]";
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => onSelectAnswer(question.id, optionIndex)}
                        className={`flex min-h-[92px] items-start gap-3 rounded-[20px] border p-4 text-left text-sm transition-all hover:-translate-y-[1px] ${optionClass}`}
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-mono text-[11px] uppercase text-[#7E8692] shadow-[inset_0_0_0_1px_rgba(23,25,29,0.08)]">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <div className="space-y-2">
                          <p>{option}</p>
                          {isSelected && !isSubmitted && (
                            <span className="badge badge-purple px-2.5 py-1 text-[10px]">
                              Đã chọn
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {isSubmitted && (
                  <div className="mt-4 rounded-[18px] bg-white p-4 text-sm leading-6 text-[#5E6571] shadow-[inset_0_0_0_1px_rgba(23,25,29,0.08)]">
                    <p
                      className={`font-semibold ${
                        selectedAnswer === question.correctAnswer
                          ? "text-[#365114]"
                          : "text-[#9B365E]"
                      }`}
                    >
                      {selectedAnswer === question.correctAnswer
                        ? "Chính xác."
                        : "Chưa đúng."}
                    </p>
                    <p className="mt-1">
                      <b className="text-[#17191D]">Giải thích:</b>{" "}
                      {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {feedbackMsg && (
        <section className="surface-card-strong p-5 text-sm leading-7 text-[#5E6571]">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(182,239,85,0.18)] text-[#365114]">
              <Icons.BadgeHelp className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-[#17191D]">Phản hồi bài làm</p>
              <p className="mt-1">{feedbackMsg}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
