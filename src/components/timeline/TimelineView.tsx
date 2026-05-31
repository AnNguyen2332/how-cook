import { Play, RefreshCcw } from "lucide-react";
import { formatDuration, sortScheduledTasks } from "@/lib/format";
import type { Dish, SchedulerWarning, ScheduledTask } from "@/types/domain";
import { TimelineItem } from "./TimelineItem";
import { TimelineWarningPanel } from "./TimelineWarningPanel";

type TimelineViewProps = {
  dishes: Dish[];
  selectedDishIds: string[];
  scheduledTasks: ScheduledTask[];
  warnings: SchedulerWarning[];
  totalDurationMinutes: number;
  onRegenerate: () => void;
  onStartCooking: () => void;
};

export function TimelineView({
  dishes,
  selectedDishIds,
  scheduledTasks,
  warnings,
  totalDurationMinutes,
  onRegenerate,
  onStartCooking
}: TimelineViewProps) {
  const dishById = new Map(dishes.map((dish) => [dish.id, dish]));
  const selectedDishes = dishes.filter((dish) =>
    selectedDishIds.includes(dish.id)
  );
  const hasTimeline = scheduledTasks.length > 0;

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-zinc-950">
            Lịch nấu được đề xuất
          </h2>
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            {selectedDishes.length > 0
              ? `${selectedDishes.length} món được sắp xếp trong khoảng ${formatDuration(totalDurationMinutes)}.`
              : "Chọn món để tạo lịch nấu."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950 disabled:opacity-50"
            disabled={selectedDishIds.length === 0}
            onClick={onRegenerate}
            type="button"
          >
            <RefreshCcw className="h-4 w-4" />
            Tạo lại
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50"
            disabled={!hasTimeline}
            onClick={onStartCooking}
            type="button"
          >
            <Play className="h-4 w-4" />
            Bắt đầu nấu
          </button>
        </div>
      </div>

      <div>
        <TimelineWarningPanel warnings={warnings} />
      </div>

      {hasTimeline ? (
        <div className="mt-5 space-y-3">
          {sortScheduledTasks(scheduledTasks).map((task) => (
            <TimelineItem
              dish={dishById.get(task.dishId)}
              key={task.taskId}
              task={task}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center text-zinc-500">
          Lịch nấu sẽ xuất hiện ở đây sau khi bạn chọn món và bấm tạo lịch.
        </div>
      )}
    </section>
  );
}
