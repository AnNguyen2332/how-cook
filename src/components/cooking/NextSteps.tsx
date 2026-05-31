import { formatMinute, formatResources } from "@/lib/format";
import type { Dish, ScheduledTask } from "@/types/domain";

type NextStepsProps = {
  tasks: ScheduledTask[];
  dishes: Dish[];
  currentTaskId?: string;
};

export function NextSteps({ tasks, dishes, currentTaskId }: NextStepsProps) {
  const dishById = new Map(dishes.map((dish) => [dish.id, dish]));
  const upcomingTasks = tasks
    .filter(
      (task) =>
        task.taskId !== currentTaskId &&
        task.status !== "done" &&
        task.status !== "skipped"
    )
    .sort((left, right) => left.startMinute - right.startMinute)
    .slice(0, 3);

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="mb-3 font-semibold text-zinc-950">Bước tiếp theo</h3>
      {upcomingTasks.length > 0 ? (
        <div className="space-y-2">
          {upcomingTasks.map((task) => (
            <div
              className="rounded-lg border border-zinc-200 p-3"
              key={task.taskId}
            >
              <div className="font-medium text-zinc-950">
                {formatMinute(task.startMinute)} · {task.name}
              </div>
              <div className="mt-1 text-sm leading-6 text-zinc-500">
                {dishById.get(task.dishId)?.name ?? "Món ăn"} ·{" "}
                {formatResources(task.resources)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm leading-6 text-zinc-500">
          Không còn bước tiếp theo.
        </p>
      )}
    </section>
  );
}
