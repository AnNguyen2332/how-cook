import { Check, Clipboard, Play, RefreshCcw } from "lucide-react";
import { formatDuration, sortScheduledTasks } from "@/lib/format";
import type { Dish, SchedulerWarning, ScheduledTask } from "@/types/domain";
import { TimelineItem } from "./TimelineItem";
import { TimelineWarningPanel } from "./TimelineWarningPanel";

type ResourceImpactItem = {
  label: string;
  durationMinutes: number;
  isCurrent: boolean;
};

type TimelineViewProps = {
  dishes: Dish[];
  selectedDishIds: string[];
  scheduledTasks: ScheduledTask[];
  warnings: SchedulerWarning[];
  totalDurationMinutes: number;
  resourceImpact?: ResourceImpactItem[];
  copyStatus?: "idle" | "copied" | "failed";
  onCopyTimeline?: () => void;
  onRegenerate: () => void;
  onStartCooking: () => void;
};

export function TimelineView({
  dishes,
  selectedDishIds,
  scheduledTasks,
  warnings,
  totalDurationMinutes,
  resourceImpact = [],
  copyStatus = "idle",
  onCopyTimeline,
  onRegenerate,
  onStartCooking
}: TimelineViewProps) {
  const dishById = new Map(dishes.map((dish) => [dish.id, dish]));
  const selectedDishes = dishes.filter((dish) =>
    selectedDishIds.includes(dish.id)
  );
  const hasTimeline = scheduledTasks.length > 0;
  const canGenerate = selectedDishIds.length >= 2;
  const emptyStateText =
    selectedDishIds.length === 0
      ? "Chọn ít nhất 2 món để bắt đầu tạo lịch nấu."
      : selectedDishIds.length === 1
        ? "Bạn đã chọn 1 món. Chọn thêm 1 món nữa để How Cook? tối ưu được thứ tự nấu."
        : "Các món đã sẵn sàng. Bấm Tạo lịch để xem timeline đề xuất.";
  const copyLabel =
    copyStatus === "copied"
      ? "Đã sao chép"
      : copyStatus === "failed"
        ? "Không sao chép được"
        : "Sao chép lịch";

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
            disabled={!canGenerate}
            onClick={onRegenerate}
            type="button"
          >
            <RefreshCcw className="h-4 w-4" />
            Tạo lại
          </button>
          <button
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950 disabled:opacity-50"
            disabled={!hasTimeline || !onCopyTimeline}
            onClick={onCopyTimeline}
            type="button"
          >
            {copyStatus === "copied" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Clipboard className="h-4 w-4" />
            )}
            {copyLabel}
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

      {resourceImpact.length > 0 ? (
        <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
          <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-semibold text-zinc-950">
                Ảnh hưởng của số bếp
              </h3>
              <p className="text-sm leading-6 text-zinc-500">
                So sánh nhanh để thấy lịch thay đổi khi bếp bị giới hạn.
              </p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {resourceImpact.map((item) => (
              <div
                className={`rounded-lg px-3 py-2 ring-1 ${
                  item.isCurrent
                    ? "bg-zinc-950 text-white ring-zinc-950"
                    : "bg-white text-zinc-700 ring-zinc-200"
                }`}
                key={item.label}
              >
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="mt-1 text-lg font-bold">
                  {formatDuration(item.durationMinutes)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

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
          {emptyStateText}
        </div>
      )}
    </section>
  );
}
