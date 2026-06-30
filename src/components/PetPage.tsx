import * as Icons from "lucide-react";

import type { PetState } from "../types";
import { PetDisplay } from "./PetDisplay";

interface PetPageProps {
  petState: PetState;
  completedLessonCount: number;
  totalLessonCount: number;
  onSpeciesChange: (species: PetState["species"]) => void;
  onRename: (name: string) => void;
  onOpenLearn: () => void;
  onOpenShop: () => void;
}

export function PetPage({
  petState,
  completedLessonCount,
  totalLessonCount,
  onSpeciesChange,
  onRename,
  onOpenLearn,
  onOpenShop,
}: PetPageProps) {
  const ownedCount = petState.ownedAccessories.length;
  const equippedCount = Object.values(petState.equipped).filter(Boolean).length;
  const xpToNextLevel = Math.max(petState.level * 300 - petState.points, 0);

  const equippedLabels = [
    petState.equipped.glasses ? "Kính" : null,
    petState.equipped.hat ? "Mũ" : null,
    petState.equipped.clothing ? "Trang phục" : null,
    petState.equipped.background ? "Background" : null,
  ].filter(Boolean);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
      <div className="space-y-6">
        <section className="surface-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-[rgba(23,25,29,0.08)] pb-4">
            <div>
              <span className="section-label text-[#7E8692]">Pet học tập</span>
              <h3 className="mt-2 font-display text-2xl font-bold text-[#17191D]">
                Người bạn đồng hành của bạn nay có một góc riêng sáng sủa hơn.
              </h3>
            </div>
            <span className="badge badge-purple">
              <Icons.Star className="h-4 w-4" />
              Level {petState.level}
            </span>
          </div>

          <div className="mt-5">
            <PetDisplay petState={petState} showStats />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <PetStat
              label="XP hiện có"
              value={`${petState.points}`}
              caption="Từ quiz và tiến độ"
              accentClassName="text-[#365114]"
            />
            <PetStat
              label="Đồ đã sở hữu"
              value={`${ownedCount}`}
              caption="Món trong tủ đồ"
              accentClassName="text-[#4C3C86]"
            />
            <PetStat
              label="Đang trang bị"
              value={`${equippedCount}`}
              caption="Món đang dùng"
              accentClassName="text-[#0F766E]"
            />
          </div>
        </section>

        <section className="surface-card-strong p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[rgba(182,239,85,0.18)] text-[#365114]">
              <Icons.Target className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-[#17191D]">
                Pet gắn chặt với tiến độ học
              </h4>
              <p className="mt-1 text-sm leading-6 text-[#5E6571]">
                Bạn đã hoàn thành {completedLessonCount}/{totalLessonCount} bài.
                Học thêm để nhận XP, lên level và mở thêm đồ mới.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3 surface-card-muted p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#5E6571]">Còn lại tới level tiếp theo</span>
              <span className="font-semibold text-[#8A5600]">{xpToNextLevel} XP</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    100,
                    (petState.points / Math.max(petState.level * 300, 1)) * 100,
                  )}%`,
                }}
              />
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {(equippedLabels.length > 0 ? equippedLabels : ["Chưa gắn đồ nào"]).map(
                (label) => (
                  <span
                    key={label}
                    className="rounded-full border border-[rgba(23,25,29,0.08)] bg-white px-3 py-1 text-[#5E6571]"
                  >
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button onClick={onOpenLearn} className="accent-button">
              <Icons.BookOpen className="h-[18px] w-[18px]" />
              Học để kiếm thêm XP
            </button>
            <button onClick={onOpenShop} className="secondary-button">
              <Icons.ShoppingBag className="h-[18px] w-[18px]" />
              Qua shop xem đồ
            </button>
          </div>
        </section>
      </div>

      <div className="space-y-6">
        <section className="surface-card p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3 border-b border-[rgba(23,25,29,0.08)] pb-4">
            <div>
              <span className="section-label text-[#7E8692]">Cá nhân hóa pet</span>
              <h3 className="mt-2 font-display text-2xl font-bold text-[#17191D]">
                Đổi tên và chọn phong cách mà không làm rối luồng hiện có.
              </h3>
            </div>
            <button onClick={onOpenShop} className="secondary-button px-4 py-2.5 text-sm">
              <Icons.ShoppingBag className="h-4 w-4" />
              Mở shop
            </button>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)]">
            <div className="surface-card-muted p-4">
              <div>
                <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7E8692]">
                  Chọn loài pet
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["gấu", "mèo", "khủng long"] as const).map((species) => (
                    <button
                      key={species}
                      onClick={() => onSpeciesChange(species)}
                      className={`rounded-[18px] px-3 py-3 text-sm font-semibold transition-all ${
                        petState.species === species
                          ? "bg-[linear-gradient(135deg,#B6EF55_0%,#9D84F6_100%)] text-[#17191D] shadow-[0_14px_26px_rgba(157,132,246,0.16)]"
                          : "border border-[rgba(23,25,29,0.08)] bg-white text-[#5E6571]"
                      }`}
                    >
                      {species}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7E8692]">
                  Đổi tên pet
                </label>
                <input
                  type="text"
                  defaultValue={petState.name}
                  onBlur={(event) => onRename(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      onRename((event.target as HTMLInputElement).value);
                    }
                  }}
                  placeholder="Nhập tên mới..."
                  className="field-input"
                />
                <p className="mt-2 text-xs text-[#7E8692]">
                  Gõ tên mới rồi nhấn Enter hoặc bấm ra ngoài để lưu.
                </p>
              </div>
            </div>

            <div className="space-y-4 surface-card-muted p-4">
              <div>
                <p className="text-sm font-semibold text-[#17191D]">Nhắc nhẹ hôm nay</p>
                <p className="mt-2 text-sm leading-6 text-[#5E6571]">
                  Hôm nay học nhẹ một bài về tiền tiêu vặt nhé. Chỉ cần làm xong
                  quiz là pet lại có thêm cơ hội lên đồ mới.
                </p>
              </div>

              <div className="surface-card p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#7E8692]">
                  Trạng thái hiện tại
                </p>
                <div className="mt-3 space-y-2 text-sm text-[#5E6571]">
                  <p>
                    Pet đang mang tên <b className="text-[#17191D]">{petState.name}</b>
                  </p>
                  <p>
                    Loài hiện tại:{" "}
                    <b className="capitalize text-[#17191D]">{petState.species}</b>
                  </p>
                  <p>
                    Ví đang có <b className="text-[#8A5600]">{petState.points} XP</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function PetStat({
  label,
  value,
  caption,
  accentClassName,
}: {
  label: string;
  value: string;
  caption: string;
  accentClassName: string;
}) {
  return (
    <div className="metric-card">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7E8692]">
        {label}
      </p>
      <p className={`mt-2 text-[1.65rem] font-black ${accentClassName}`}>{value}</p>
      <p className="mt-1 text-xs text-[#5E6571]">{caption}</p>
    </div>
  );
}
