import { Check, Clock } from "lucide-react";
import { estimateDishMinutes } from "@/data/demoDishes";
import type { Dish } from "@/types/domain";

type DishCardProps = {
  dish: Dish;
  selected: boolean;
  onToggle: (dishId: string) => void;
};

export function DishCard({ dish, selected, onToggle }: DishCardProps) {
  const activeMinutes = dish.tasks
    .filter((task) => task.type === "active")
    .reduce((sum, task) => sum + task.durationMinutes, 0);
  const passiveMinutes = dish.tasks
    .filter((task) => task.type === "passive")
    .reduce((sum, task) => sum + task.durationMinutes, 0);

  return (
    <button
      aria-pressed={selected}
      className={`w-full rounded-lg border p-3 text-left transition ${
        selected
          ? "border-zinc-950 bg-zinc-950/5 opacity-100 shadow-sm ring-2 ring-zinc-950/10"
          : "border-zinc-200 bg-zinc-50 opacity-75 hover:border-zinc-300 hover:bg-white hover:opacity-100"
      }`}
      onClick={() => onToggle(dish.id)}
      type="button"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-zinc-950">{dish.name}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-zinc-500">
            {dish.description}
          </p>
        </div>
        <span
          className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
            selected
              ? "border-zinc-950 bg-zinc-950 text-white"
              : "border-zinc-300 bg-white text-transparent"
          }`}
        >
          <Check className="h-4 w-4" />
        </span>
      </div>
      <div className="mt-2 flex items-center gap-1 text-sm text-zinc-500">
        <Clock className="h-3.5 w-3.5" />
        ~{estimateDishMinutes(dish)} phút
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5 text-xs font-medium">
        <span className="rounded-full bg-white px-2 py-1 text-zinc-700 ring-1 ring-zinc-200">
          Chủ động {activeMinutes} phút
        </span>
        {passiveMinutes > 0 ? (
          <span className="rounded-full bg-white px-2 py-1 text-zinc-500 ring-1 ring-zinc-200">
            Chờ {passiveMinutes} phút
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {dish.tags.map((tag) => (
          <span
            className="rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
