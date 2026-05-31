import { TimerReset } from "lucide-react";
import { formatSeconds } from "@/lib/format";
import type { Dish, ScheduledTask } from "@/types/domain";

type RunningTimersProps = {
  tasks: ScheduledTask[];
  dishes: Dish[];
  elapsedSeconds: number;
};

export function RunningTimers({
  tasks,
  dishes,
  elapsedSeconds
}: RunningTimersProps) {
  const dishById = new Map(dishes.map((dish) => [dish.id, dish]));
  const runningTasks = tasks.filter((task) => {
    const startSeconds = task.startMinute * 60;
    const endSeconds = task.endMinute * 60;
    return (
      task.type === "passive" &&
      task.status !== "done" &&
      task.status !== "skipped" &&
      elapsedSeconds >= startSeconds &&
      elapsedSeconds < endSeconds
    );
  });

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <TimerReset className="h-4 w-4 text-zinc-500" />
        <h3 className="font-semibold text-zinc-950">Đồng hồ đang chạy</h3>
      </div>
      {runningTasks.length > 0 ? (
        <div className="space-y-2">
          {runningTasks.map((task) => {
            const remaining = task.endMinute * 60 - elapsedSeconds;
            return (
              <div
                className="rounded-lg bg-zinc-100 p-3 text-sm"
                key={task.taskId}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-zinc-950">
                      {task.name}
                    </div>
                    <div className="text-zinc-500">
                      {dishById.get(task.dishId)?.name ?? "Món ăn"}
                    </div>
                  </div>
                  <div className="font-bold tabular text-zinc-950">
                    {formatSeconds(remaining)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm leading-6 text-zinc-500">
          Không có bước chờ nào đang chạy theo lịch nấu.
        </p>
      )}
    </section>
  );
}
