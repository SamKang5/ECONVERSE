import * as Icons from "lucide-react";

import type { Lesson } from "../../types";

interface LessonPlayerProps {
  lesson: Lesson;
}

export function extractYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (!trimmed || trimmed.toLowerCase() === "placeholder") return null;

  // Direct 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // URL parsing
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const host = url.hostname.toLowerCase();

    if (host.includes("youtube.com") || host.includes("youtube-nocookie.com")) {
      const v = url.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        return v;
      }
      const match = url.pathname.match(/\/(embed|v|shorts)\/([a-zA-Z0-9_-]{11})/);
      if (match && match[2]) {
        return match[2];
      }
    } else if (host === "youtu.be" || host.endsWith(".youtu.be")) {
      const match = url.pathname.match(/^\/([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch {
    // URL parsing failed, fallback to regex
  }

  const regexMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  if (regexMatch && regexMatch[1]) {
    return regexMatch[1];
  }

  return null;
}

export function getYouTubeEmbedUrl(lesson: Lesson): string | null {
  // Check youtubeId first
  if (lesson.youtubeId) {
    const id = extractYouTubeId(lesson.youtubeId);
    if (id) {
      return `https://www.youtube.com/embed/${id}`;
    }
  }

  // Check videoUrl
  if (lesson.videoUrl) {
    const id = extractYouTubeId(lesson.videoUrl);
    if (id) {
      return `https://www.youtube.com/embed/${id}`;
    }
    if (
      lesson.videoUrl !== "placeholder" &&
      (lesson.videoUrl.startsWith("http://") || lesson.videoUrl.startsWith("https://"))
    ) {
      return lesson.videoUrl;
    }
  }

  return null;
}

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const embedUrl = getYouTubeEmbedUrl(lesson);
  const mainContent = lesson.mainContent ?? [];
  const contentTitle = lesson.mainContentTitle ?? lesson.title;
  const objectives = lesson.objectives ?? [];

  return (
    <div className="space-y-6">
      <section className="surface-card-strong overflow-hidden p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="badge badge-purple">
            <Icons.PlayCircle className="h-4 w-4" />
            Video bài học
          </span>
          <span className="badge badge-dark">{lesson.duration}</span>
          <span className="badge badge-amber">+{lesson.pointsReward} XP</span>
        </div>

        {embedUrl ? (
          <div className="overflow-hidden rounded-[24px] border border-[rgba(23,25,29,0.08)] bg-black shadow-[0_16px_36px_rgba(15,23,42,0.12)]">
            <iframe
              src={embedUrl}
              title={lesson.title}
              className="aspect-video w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-[28px] border border-[rgba(23,25,29,0.08)] bg-[linear-gradient(180deg,#1F2329_0%,#121418_100%)] p-6 text-white shadow-[0_26px_48px_rgba(15,23,42,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(182,239,85,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(157,132,246,0.22),transparent_34%)]" />
            <div className="relative z-10 flex aspect-video flex-col justify-between gap-6">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] px-3 py-1 text-xs font-semibold text-slate-200">
                  Placeholder video
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  ECONVERSE Learn
                </span>
              </div>

              <div className="my-auto text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(255,255,255,0.08)]">
                  <Icons.Clapperboard className="h-8 w-8 text-[#B6EF55]" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold text-white sm:text-3xl">
                  {lesson.title}
                </h3>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  {lesson.overview}
                </p>
              </div>

              <div className="rounded-[20px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] p-4">
                <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
                  <span>Khung xem video đang dùng card mô phỏng</span>
                  <span>{lesson.duration}</span>
                </div>
                <div className="mt-3 progress-track bg-[rgba(255,255,255,0.08)]">
                  <div className="progress-fill" style={{ width: "100%" }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="border-b border-[rgba(23,25,29,0.08)] pb-4">
          <p className="section-label text-[#7E8692]">NỘI DUNG CHÍNH</p>
          <h3 className="mt-2 text-lg font-semibold text-[#17191D]">
            {contentTitle}
          </h3>
        </div>

        <div className="mt-5 space-y-5">
          {mainContent.map((paragraph) => (
            <p key={paragraph} className="text-base leading-[1.75] text-[#5E6571]">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {objectives.length > 0 && (
        <section className="surface-card p-5 sm:p-6">
          <div className="border-b border-[rgba(23,25,29,0.08)] pb-4">
            <p className="section-label text-[#7E8692]">Mục tiêu bài học</p>
            <h3 className="mt-2 text-lg font-semibold text-[#17191D]">
              Những ý nên nắm trước khi qua quiz
            </h3>
          </div>

          <div className="mt-5 space-y-3">
            {objectives.map((objective) => (
              <div
                key={objective}
                className="surface-card-muted flex items-start gap-3 p-4"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[#365114] shadow-[inset_0_0_0_1px_rgba(23,25,29,0.08)]">
                  <Icons.Check className="h-4 w-4" />
                </span>
                <p className="text-sm leading-6 text-[#5E6571]">{objective}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
