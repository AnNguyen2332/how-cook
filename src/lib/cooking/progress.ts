import { sortScheduledTasks } from "@/lib/format";
import type { ScheduledTask } from "@/types/domain";

export const isUnfinishedTask = (task: ScheduledTask) =>
  task.status !== "done" && task.status !== "skipped";

export const getNextPendingActiveTask = (tasks: ScheduledTask[]) =>
  sortScheduledTasks(tasks).find(
    (task) => task.type === "active" && task.status === "pending"
  );

export const getNextReadyActiveTask = (
  tasks: ScheduledTask[],
  elapsedSeconds: number
) =>
  sortScheduledTasks(tasks).find(
    (task) =>
      task.type === "active" &&
      task.status === "pending" &&
      task.startMinute * 60 <= elapsedSeconds
  );

export const hasUnfinishedTasks = (tasks: ScheduledTask[]) =>
  tasks.some(isUnfinishedTask);
