import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import type { Dish, DishCategory } from "@/types/domain";
import { DishCard } from "./DishCard";

type DishSelectorProps = {
  dishes: Dish[];
  selectedDishIds: string[];
  onToggleDish: (dishId: string) => void;
  onGenerate: () => void;
};

const categoryLabels: Record<DishCategory | "all", string> = {
  all: "Tất cả",
  rice: "Cơm",
  main: "Món chính",
  soup: "Canh",
  vegetable: "Rau",
  side: "Món phụ"
};

const categories: Array<DishCategory | "all"> = [
  "all",
  "rice",
  "main",
  "soup",
  "vegetable",
  "side"
];

export function DishSelector({
  dishes,
  selectedDishIds,
  onToggleDish,
  onGenerate
}: DishSelectorProps) {
  const [activeCategory, setActiveCategory] =
    useState<DishCategory | "all">("all");
  const filteredDishes = useMemo(
    () =>
      activeCategory === "all"
        ? dishes
        : dishes.filter((dish) => dish.category === activeCategory),
    [activeCategory, dishes]
  );
  const selectedDishes = useMemo(
    () => dishes.filter((dish) => selectedDishIds.includes(dish.id)),
    [dishes, selectedDishIds]
  );
  const canGenerate = selectedDishIds.length >= 2;
  const helperText =
    selectedDishIds.length === 0
      ? "Chọn ít nhất 2 món để How Cook? có thể tối ưu lịch nấu."
      : selectedDishIds.length === 1
        ? "Chọn thêm 1 món nữa để tạo lịch nấu nhiều món."
        : "Sẵn sàng tạo lịch nấu cho bữa này.";

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Bữa tối hôm nay
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            {selectedDishIds.length} món đã chọn
          </p>
        </div>
        <button
          className="inline-flex h-9 items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canGenerate}
          onClick={onGenerate}
          type="button"
        >
          <Plus className="h-4 w-4" />
          Tạo lịch
        </button>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-zinc-950">
            {selectedDishIds.length} món đã chọn
          </p>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              canGenerate
                ? "bg-zinc-950 text-white"
                : "bg-white text-zinc-500 ring-1 ring-zinc-200"
            }`}
          >
            Tối thiểu 2 món
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-500">{helperText}</p>
        {selectedDishes.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {selectedDishes.map((dish) => (
              <span
                className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200"
                key={dish.id}
              >
                {dish.name}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            className={`h-8 shrink-0 rounded-full px-3 text-sm font-semibold transition ${
              activeCategory === category
                ? "bg-zinc-950 text-white"
                : "bg-zinc-100 text-zinc-600 hover:text-zinc-950"
            }`}
            key={category}
            onClick={() => setActiveCategory(category)}
            type="button"
          >
            {categoryLabels[category]}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3">
        {filteredDishes.map((dish) => (
          <DishCard
            dish={dish}
            key={dish.id}
            onToggle={onToggleDish}
            selected={selectedDishIds.includes(dish.id)}
          />
        ))}
      </div>
      <button
        className="mt-4 h-11 w-full rounded-lg bg-zinc-950 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
        disabled={!canGenerate}
        onClick={onGenerate}
        type="button"
      >
        Tạo lịch nấu
      </button>
    </section>
  );
}
