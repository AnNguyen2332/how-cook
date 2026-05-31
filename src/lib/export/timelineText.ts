import { formatDuration, formatMinute, formatResources, sortScheduledTasks } from "@/lib/format";
import type { Dish, ScheduledTask } from "@/types/domain";

export const createTimelineText = (
  tasks: ScheduledTask[],
  dishes: Dish[]
) => {
  const dishById = new Map(dishes.map((dish) => [dish.id, dish]));
  const lines = sortScheduledTasks(tasks).map((task) => {
    const dishName = dishById.get(task.dishId)?.name ?? "Món ăn";
    const taskType = task.type === "active" ? "Chủ động" : "Tự chạy";

    return [
      formatMinute(task.startMinute),
      task.name,
      dishName,
      formatDuration(task.durationMinutes),
      taskType,
      formatResources(task.resources)
    ].join(" - ");
  });

  return ["How Cook? Timeline", ...lines].join("\n");
};
