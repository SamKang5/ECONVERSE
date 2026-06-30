import type { ReactNode } from "react";

import * as Icons from "lucide-react";

import type { SocialPost } from "../types";

interface MediaPageProps {
  socialPosts: SocialPost[];
  memeScenario: string;
  memeSolution: string;
  customMemeText: string;
  isMemeGenerated: boolean;
  onScenarioChange: (value: string) => void;
  onSolutionChange: (value: string) => void;
  onCustomTextChange: (value: string) => void;
  onGenerateMeme: () => void;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string) => void;
}

const learningTips = [
  {
    title: "Mẹo nhớ 50/30/20",
    description:
      "50 là cần thiết, 30 là thích, 20 là để dành. Nhớ đủ 3 ô là đỡ vung tay quá trán.",
  },
  {
    title: "Nhìn cung cầu bằng đời sống",
    description:
      "Thứ gì nhiều người muốn mua mà ít nơi bán thì giá thường tăng nhanh.",
  },
  {
    title: "Lãi kép cần thời gian",
    description:
      "Tiền nhỏ nhưng đều đặn vẫn có giá trị hơn là đợi có khoản lớn mới bắt đầu.",
  },
];

const memeScenarioOptions = [
  {
    value: "Hết tiền tiêu vặt ngày 10 của tháng",
    label: "Hết tiền tiêu vặt ngày 10 hằng tháng",
  },
  {
    value: "Đu đỉnh đồ chơi Labubu siêu khủng",
    label: "Đu đỉnh mua mô hình Labubu giá chợ đen",
  },
  {
    value: "Nạp card game tẹt ga, cuối tháng ăn mì tôm",
    label: "Nạp card game tẹt ga, cuối tuần húp nước súp mì",
  },
  {
    value: "Thấy trà sữa giảm giá 50%, mua luôn 5 ly",
    label: "Lỡ tay săn sale rồi cuối tháng thở dài",
  },
];

const memeSolutionOptions = [
  {
    value: "Quy tắc chia ví 50% thiết yếu, 30% sở thích, 20% tiết kiệm",
    label: "Áp dụng 50/30/20 để chia ví",
  },
  {
    value: "Đút túi 10% tiền tiêu vặt mỗi tuần để kích hoạt lãi kép",
    label: "Cất trước 10% để tạo thói quen",
  },
  {
    value: "Kìm nén lòng ham muốn, cân đối Cung và Cầu của túi tiền",
    label: "Dừng một nhịp trước khi mua",
  },
];

export function MediaPage({
  socialPosts,
  memeScenario,
  memeSolution,
  customMemeText,
  isMemeGenerated,
  onScenarioChange,
  onSolutionChange,
  onCustomTextChange,
  onGenerateMeme,
  onLikePost,
  onAddComment,
}: MediaPageProps) {
  const instagramPosts = socialPosts.filter((post) => post.platform === "instagram");
  const facebookPosts = socialPosts.filter((post) => post.platform === "facebook");

  return (
    <div className="space-y-6">
      <section className="surface-card p-5 sm:p-6 xl:p-7">
        <div className="max-w-4xl space-y-4">
          <span className="badge badge-purple">
            <Icons.Lightbulb className="h-4 w-4" />
            Mẹo và góc vui
          </span>
          <div className="space-y-3">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#17191D] md:text-4xl">
              Vừa học vừa thư giãn một chút cũng là cách giữ nhịp lâu hơn.
            </h2>
            <p className="text-sm leading-7 text-[#5E6571] md:text-base">
              Khu nội dung phụ giờ được đưa về cùng một ngôn ngữ thị giác với phần
              học chính, nên bạn có thể lướt mẹo, ráp meme và xem mockup social mà
              không bị lệch nhịp trải nghiệm.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {learningTips.map((tip) => (
          <article key={tip.title} className="surface-card-muted p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[rgba(182,239,85,0.18)] text-[#365114]">
              <Icons.Sparkles className="h-5 w-5" />
            </div>
            <p className="mt-4 text-base font-semibold text-[#17191D]">{tip.title}</p>
            <p className="mt-2 text-sm leading-6 text-[#5E6571]">{tip.description}</p>
          </article>
        ))}
      </section>

      <section className="surface-card overflow-hidden p-5 sm:p-6">
        <div className="border-b border-[rgba(23,25,29,0.08)] pb-4">
          <span className="section-label text-[#7E8692]">Góc tạo meme vui</span>
          <h3 className="mt-2 font-display text-2xl font-bold text-[#17191D]">
            Ráp nhanh một chiếc meme tài chính mà vẫn giữ cùng design system.
          </h3>
          <p className="mt-1 text-sm text-[#5E6571]">
            Chọn tình huống, chọn cách gỡ và thêm câu chốt của riêng bạn.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="space-y-4">
            <FieldBlock label="1. Chọn tình huống">
              <select
                value={memeScenario}
                onChange={(event) => onScenarioChange(event.target.value)}
                className="field-input"
              >
                {memeScenarioOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FieldBlock>

            <FieldBlock label="2. Chọn cách gỡ">
              <select
                value={memeSolution}
                onChange={(event) => onSolutionChange(event.target.value)}
                className="field-input"
              >
                {memeSolutionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </FieldBlock>

            <FieldBlock label="3. Thêm câu chốt">
              <input
                type="text"
                value={customMemeText}
                onChange={(event) => onCustomTextChange(event.target.value)}
                placeholder="Ví dụ: hôm nay thôi, mai mình tiết kiệm thật..."
                className="field-input"
              />
            </FieldBlock>

            <button onClick={onGenerateMeme} className="accent-button w-full">
              <Icons.WandSparkles className="h-[18px] w-[18px]" />
              Tạo meme
            </button>
          </div>

          <div className="surface-card-dark p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#B6EF55_0%,#9D84F6_100%)] text-[#17191D]">
                <Icons.Camera className="h-[18px] w-[18px]" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">econverse.vietnam</div>
                <div className="text-xs text-slate-400">Góc học nhẹ và dễ nhớ bài</div>
              </div>
            </div>

            <div className="rounded-[26px] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,#1B1D22_0%,#121317_100%)] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="badge badge-purple px-3 py-1 text-[11px]">
                  Meme card
                </span>
                <span className="text-xs text-slate-400">Draft</span>
              </div>

              <div className="space-y-4 rounded-[22px] bg-[rgba(255,255,255,0.04)] p-4 text-center">
                <div className="rounded-[20px] border border-[rgba(242,138,167,0.18)] bg-[rgba(242,138,167,0.12)] p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#F4B3C5]">
                    Tình huống
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    "{memeScenario}"
                  </p>
                </div>

                <div className="rounded-[20px] border border-[rgba(182,239,85,0.18)] bg-[rgba(182,239,85,0.12)] p-3">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#D4F48F]">
                    Cách xử lý
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    "{memeSolution}"
                  </p>
                </div>

                <p className="rounded-[18px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.06)] p-3 text-sm text-slate-200">
                  "{customMemeText}"
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-[22px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-4 text-sm text-slate-300">
              <p>
                <b className="text-white">econverse.vietnam</b>{" "}
                {isMemeGenerated
                  ? "Vừa ráp xong một chiếc meme vui để nhớ bài lâu hơn."
                  : "Một chút hài hước cũng giúp việc học tài chính đỡ căng hơn."}
              </p>
              <p className="mt-2 text-xs text-[#C2B2FF]">
                #ECONVERSE #HocTaiChinh #HocNheMoiNgay
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <span className="section-label text-[#7E8692]">Góc media mockup</span>
            <h3 className="mt-2 font-display text-2xl font-bold text-[#17191D]">
              Instagram và Facebook được gom vào hai cột dễ so sánh hơn.
            </h3>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <FeedColumn
            title="Instagram"
            accent="pink"
            posts={instagramPosts}
            onLikePost={onLikePost}
            onAddComment={onAddComment}
          />
          <FeedColumn
            title="Facebook"
            accent="blue"
            posts={facebookPosts}
            onLikePost={onLikePost}
            onAddComment={onAddComment}
          />
        </div>
      </section>
    </div>
  );
}

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7E8692]">
        {label}
      </label>
      {children}
    </div>
  );
}

function FeedColumn({
  title,
  accent,
  posts,
  onLikePost,
  onAddComment,
}: {
  title: string;
  accent: "pink" | "blue";
  posts: SocialPost[];
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string) => void;
}) {
  const isInstagram = accent === "pink";
  const AccentIcon = isInstagram ? Icons.Instagram : Icons.Facebook;
  const accentText = isInstagram ? "text-[#9B365E]" : "text-[#2563EB]";
  const accentBg = isInstagram
    ? "bg-[rgba(242,138,167,0.12)]"
    : "bg-[rgba(37,99,235,0.12)]";

  return (
    <div className="surface-card p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-[1rem] ${accentBg}`}>
          <AccentIcon className={`h-5 w-5 ${accentText}`} />
        </div>
        <div>
          <p className="font-display text-lg font-bold text-[#17191D]">{title}</p>
          <p className="text-sm text-[#5E6571]">Các post mockup giữ cùng một nhịp nhìn.</p>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <article key={post.id} className="surface-card-muted p-4">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-mono font-bold uppercase ${accentText}`}>
                {post.type} post
              </span>
              <span className="text-[#7E8692]">{post.date}</span>
            </div>
            <h4 className="mt-3 text-base font-semibold text-[#17191D]">
              {post.title}
            </h4>
            <p className="mt-3 whitespace-pre-line rounded-[18px] bg-white p-4 text-sm leading-6 text-[#5E6571] shadow-[inset_0_0_0_1px_rgba(23,25,29,0.06)]">
              {post.content}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-mono text-[#4C3C86]">
                  #{tag}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[rgba(23,25,29,0.08)] pt-3 text-xs text-[#5E6571]">
              <div className="flex gap-4">
                <button
                  onClick={() => onLikePost(post.id)}
                  className="flex items-center gap-1 transition-all hover:text-[#17191D]"
                >
                  <Icons.Heart className="h-4 w-4" /> <b>{post.likes}</b>
                </button>
                <button
                  onClick={() => onAddComment(post.id)}
                  className="flex items-center gap-1 transition-all hover:text-[#17191D]"
                >
                  <Icons.MessageCircle className="h-4 w-4" /> <b>{post.comments}</b>
                </button>
              </div>
              <span className="text-[10px] text-[#7E8692]">
                {post.shares !== undefined ? `Shares: ${post.shares}` : "Lưu để xem lại"}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
