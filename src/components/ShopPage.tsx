import * as Icons from "lucide-react";

import type { PetAccessory, PetState } from "../types";
import { ShopItemCard } from "./ShopItemCard";

interface ShopPageProps {
  petState: PetState;
  shopItems: PetAccessory[];
  onShopAction: (item: PetAccessory) => void;
  onOpenLearn: () => void;
}

const categoryMeta: Array<{
  key: PetAccessory["category"];
  label: string;
  description: string;
}> = [
  {
    key: "glasses",
    label: "Kính và visor",
    description: "Những món giúp pet trông tinh anh hơn hẳn.",
  },
  {
    key: "hat",
    label: "Mũ và phụ kiện đầu",
    description: "Một chiếc mũ xịn là lên mood học bài ngay.",
  },
  {
    key: "clothing",
    label: "Trang phục",
    description: "Đồ mặc cho những ngày pet muốn nổi bật.",
  },
  {
    key: "background",
    label: "Background",
    description: "Đổi luôn không khí quanh pet cho đỡ chán.",
  },
];

export function ShopPage({
  petState,
  shopItems,
  onShopAction,
  onOpenLearn,
}: ShopPageProps) {
  const ownedCount = petState.ownedAccessories.length;
  const equippedCount = Object.values(petState.equipped).filter(Boolean).length;
  const affordableCount = shopItems.filter(
    (item) =>
      !petState.ownedAccessories.includes(item.id) && petState.points >= item.price,
  ).length;
  const lockedCount = shopItems.length - ownedCount;
  const cheapestLockedItem = shopItems
    .filter((item) => !petState.ownedAccessories.includes(item.id))
    .sort((firstItem, secondItem) => firstItem.price - secondItem.price)[0];

  return (
    <div className="space-y-6">
      <section className="surface-card overflow-hidden p-5 sm:p-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.16fr)_360px] xl:items-start">
          <div className="space-y-4">
            <span className="badge badge-amber">
              <Icons.ShoppingBag className="h-4 w-4" />
              Shop đổi XP
            </span>
            <div className="space-y-3">
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#17191D]">
                Kiếm XP từ bài học rồi quay lại chọn món đáng mua nhất cho pet.
              </h2>
              <p className="max-w-3xl text-sm leading-7 text-[#5E6571]">
                Khu shop giờ được chia lại thành các nhóm rõ ràng hơn để bạn nhìn
                ngay món nào đã mở, món nào đủ tiền và món nào cần thêm vài câu quiz.
              </p>
            </div>
            <button onClick={onOpenLearn} className="accent-button">
              <Icons.BookOpen className="h-[18px] w-[18px]" />
              Qua Learn để kiếm XP
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ShopStat label="Ví hiện tại" value={`${petState.points} XP`} accentClassName="text-[#8A5600]" />
            <ShopStat label="Có thể mua ngay" value={`${affordableCount} món`} accentClassName="text-[#365114]" />
            <ShopStat label="Đang trang bị" value={`${equippedCount} món`} accentClassName="text-[#0F766E]" />
            <ShopStat label="Đang khóa" value={`${lockedCount} món`} accentClassName="text-[#4C3C86]" />
          </div>
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#17191D]">
              So sánh nhanh trước khi mua
            </h3>
            <p className="mt-1 text-sm text-[#5E6571]">
              Hiện tại pet đang mang {equippedCount} món.{" "}
              {cheapestLockedItem
                ? `Món rẻ nhất còn khóa là ${cheapestLockedItem.price} XP.`
                : "Bạn đã mở hết toàn bộ shop rồi."}
            </p>
          </div>

          <span className="badge badge-purple">
            <Icons.Sparkles className="h-4 w-4" />
            {ownedCount} món đã sở hữu
          </span>
        </div>

        {ownedCount === 0 && (
          <div className="mt-4 surface-card-muted p-4 text-sm leading-6 text-[#5E6571]">
            Bạn chưa có món nào trong tủ đồ. Làm quiz trước rồi quay lại đây để sắm
            món đầu tiên cho pet nhé.
          </div>
        )}
      </section>

      <div className="space-y-6">
        {categoryMeta.map((category) => {
          const items = shopItems.filter((item) => item.category === category.key);

          return (
            <section key={category.key} className="surface-card p-5 sm:p-6">
              <div className="mb-5 flex flex-col gap-1">
                <h3 className="font-display text-2xl font-bold text-[#17191D]">
                  {category.label}
                </h3>
                <p className="text-sm text-[#5E6571]">{category.description}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                {items.map((item) => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    petState={petState}
                    onAction={onShopAction}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function ShopStat({
  label,
  value,
  accentClassName,
}: {
  label: string;
  value: string;
  accentClassName: string;
}) {
  return (
    <div className="metric-card">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#7E8692]">
        {label}
      </p>
      <p className={`mt-2 text-[1.55rem] font-black ${accentClassName}`}>{value}</p>
    </div>
  );
}
