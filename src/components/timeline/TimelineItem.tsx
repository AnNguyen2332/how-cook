import { CheckCircle2, Clock, TimerReset } from "lucide-react";
import { formatDuration, formatMinute, formatResources } from "@/lib/format";
import type { Dish, ScheduledTask } from "@/types/domain";

type TimelineItemProps = {
  task: ScheduledTask;
  dish?: Dish;
};

const statusLabels: Record<ScheduledTask["status"], string> = {
  pending: "Chờ",
  running: "Đang chạy",
  done: "Hoàn tất",
  skipped: "Bỏ qua"
};

export function TimelineItem({ task, dish }: TimelineItemProps) {
  const isPassive = task.type === "passive";
  const isFinished = task.status === "done" || task.status === "skipped";

  return (
    <article
      className={`grid gap-3 rounded-lg border p-4 transition md:grid-cols-[80px_minmax(0,1fr)_130px] md:items-center ${
        task.status === "running"
          ? "border-zinc-950 bg-white shadow-sm"
          : "border-zinc-200 bg-white"
      } ${isFinished ? "opacity-60" : ""}`}
    >
      <div>
        <div className="text-lg font-semibold tabular text-zinc-950">
          {formatMinute(task.startMinute)}
        </div>
        <div className="mt-1 text-xs text-zinc-500">
          đến {formatMinute(task.endMinute)}
        </div>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium text-zinc-950">{task.name}</h3>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              task.status === "running"
                ? "bg-zinc-950 text-white"
                : isPassive
                  ? "bg-zinc-100 text-zinc-700"
                  : "bg-zinc-950 text-white"
            }`}
          >
            {isPassive ? "Tự chạy" : "Chủ động"}
          </span>
          <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-500">
            {statusLabels[task.status]}
          </span>
        </div>
        <p className="mt-1 text-sm leading-6 text-zinc-500">
          {dish?.name ?? "Món ăn"} · {formatDuration(task.durationMinutes)} ·{" "}
          {formatResources(task.resources)}
        </p>
        {task.description ? (
          <p className="mt-1 text-sm leading-6 text-zinc-500">
            {task.description}
          </p>
        ) : null}
      </div>
      <div className="flex justify-start md:justify-end">
        <span
          className={`inline-flex h-9 min-w-24 items-center justify-center gap-1 rounded-lg px-3 text-sm font-semibold ${
            isPassive
              ? "bg-zinc-100 text-zinc-700"
              : "bg-zinc-950 text-white"
          }`}
        >
          {task.status === "done" ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : isPassive ? (
            <TimerReset className="h-4 w-4" />
          ) : (
            <Clock className="h-4 w-4" />
          )}
          {formatDuration(task.durationMinutes)}
        </span>
      </div>
    </article>
  );
}
