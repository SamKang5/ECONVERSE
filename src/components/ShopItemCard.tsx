import type { PetAccessory, PetState } from "../types";

interface ShopItemCardProps {
  item: PetAccessory;
  petState: PetState;
  onAction: (item: PetAccessory) => void;
}

export function ShopItemCard({
  item,
  petState,
  onAction,
}: ShopItemCardProps) {
  const isOwned = petState.ownedAccessories.includes(item.id);
  const isEquipped = petState.equipped[item.category] === item.id;
  const canAfford = petState.points >= item.price;
  const missingXp = Math.max(item.price - petState.points, 0);

  const categoryLabel =
    item.category === "glasses"
      ? "Mắt kính"
      : item.category === "hat"
        ? "Mũ"
        : item.category === "clothing"
          ? "Trang phục"
          : "Background";

  const status = isEquipped
    ? {
        label: "Đang trang bị",
        className:
          "bg-[rgba(105,215,221,0.14)] text-[#0F766E] border-[rgba(105,215,221,0.28)]",
      }
    : isOwned
      ? {
          label: "Đã sở hữu",
          className:
            "bg-[rgba(182,239,85,0.18)] text-[#365114] border-[rgba(182,239,85,0.32)]",
        }
      : canAfford
        ? {
            label: "Mua được ngay",
            className:
              "bg-[rgba(246,197,90,0.16)] text-[#8A5600] border-[rgba(246,197,90,0.28)]",
          }
        : {
            label: `Thiếu ${missingXp} XP`,
            className:
              "bg-[rgba(23,25,29,0.06)] text-[#5E6571] border-[rgba(23,25,29,0.08)]",
          };

  const actionLabel = isEquipped
    ? "Tháo"
    : isOwned
      ? "Trang bị"
      : "Mua ngay";

  return (
    <div
      className={`surface-card-muted flex flex-col gap-4 p-4 transition-transform ${
        isEquipped ? "shadow-[0_18px_36px_rgba(15,23,42,0.1)]" : ""
      } hover:-translate-y-[2px]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#17191D]">{item.name}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[#7E8692]">
            {categoryLabel}
          </p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <p className="text-sm leading-6 text-[#5E6571]">{item.description}</p>

      <div className="surface-card p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#7E8692]">Giá món đồ</span>
          <span className="font-semibold text-[#8A5600]">{item.price} XP</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-[#7E8692]">Ví hiện tại</span>
          <span className="font-semibold text-[#17191D]">{petState.points} XP</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[rgba(23,25,29,0.08)] pt-1">
        <p className="text-xs leading-6 text-[#5E6571]">
          {isEquipped
            ? "Pet đang dùng món này."
            : isOwned
              ? "Món này đã nằm sẵn trong tủ đồ."
              : canAfford
                ? "Đủ XP rồi, mua là lên đồ được ngay."
                : `Làm thêm quiz để kiếm ${missingXp} XP nữa.`}
        </p>

        <button
          onClick={() => onAction(item)}
          disabled={!isOwned && !canAfford}
          className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
            isEquipped
              ? "border border-[rgba(242,138,167,0.28)] bg-[rgba(242,138,167,0.14)] text-[#9B365E]"
              : isOwned
                ? "border border-[rgba(105,215,221,0.18)] bg-white text-[#17191D] shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                : canAfford
                  ? "accent-button px-4 py-2 text-xs"
                  : "cursor-not-allowed border border-[rgba(23,25,29,0.08)] bg-[rgba(23,25,29,0.04)] text-[#9CA3AF]"
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
