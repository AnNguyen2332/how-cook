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

type DelayPendingTasksInput = {
  currentTaskId?: string;
  elapsedSeconds: number;
  delayMinutes?: number;
};

export const delayPendingTasks = (
  tasks: ScheduledTask[],
  {
    currentTaskId,
    elapsedSeconds,
    delayMinutes = 5
  }: DelayPendingTasksInput
) =>
  sortScheduledTasks(
    tasks.map((task) => {
      const isCurrentTask = task.taskId === currentTaskId;
      const isPassiveRunning =
        task.type === "passive" &&
        elapsedSeconds >= task.startMinute * 60 &&
        elapsedSeconds < task.endMinute * 60;

      if (task.status !== "pending" || isCurrentTask || isPassiveRunning) {
        return task;
      }

      return {
        ...task,
        startMinute: task.startMinute + delayMinutes,
        endMinute: task.endMinute + delayMinutes
      };
    })
  );
