export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-2 sm:px-6 xl:px-8">
      <div className="surface-card-muted px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="font-display text-lg font-bold text-[#17191D]">
              ECONVERSE
            </p>
            <p className="max-w-2xl text-sm leading-6 text-[#5E6571]">
              Không gian học kinh tế và tài chính cá nhân cho học sinh Việt Nam,
              giữ nguyên tiến độ local và tập trung vào trải nghiệm để quay lại mỗi
              ngày.
            </p>
          </div>

          <div className="rounded-full border border-[rgba(23,25,29,0.08)] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7E8692]">
            2026 • Lưu tiến độ cục bộ
          </div>
        </div>
      </div>
    </footer>
  );
}
