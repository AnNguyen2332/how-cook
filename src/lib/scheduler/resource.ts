import type {
  CookingTask,
  KitchenResourceRequirement,
  KitchenSetup,
  ScheduledTask
} from "@/types/domain";

export const intervalsOverlap = (
  firstStart: number,
  firstEnd: number,
  secondStart: number,
  secondEnd: number
) => firstStart < secondEnd && secondStart < firstEnd;

export const resourcesFitKitchen = (
  resources: KitchenResourceRequirement[],
  kitchenSetup: KitchenSetup
) =>
  resources.every(
    (resource) => resource.amount <= (kitchenSetup[resource.type] ?? 0)
  );

export const isSlotAvailable = (
  task: Pick<CookingTask, "durationMinutes" | "resources">,
  startMinute: number,
  scheduledTasks: ScheduledTask[],
  kitchenSetup: KitchenSetup,
  excludeTaskId?: string
) => {
  if (!resourcesFitKitchen(task.resources, kitchenSetup)) {
    return false;
  }

  const endMinute = startMinute + task.durationMinutes;

  return task.resources.every((required) => {
    const usedAmount = scheduledTasks.reduce((sum, scheduledTask) => {
      if (scheduledTask.taskId === excludeTaskId) {
        return sum;
      }

      const overlaps = intervalsOverlap(
        startMinute,
        endMinute,
        scheduledTask.startMinute,
        scheduledTask.endMinute
      );

      if (!overlaps) {
        return sum;
      }

      const used = scheduledTask.resources.find(
        (resource) => resource.type === required.type
      );

      return sum + (used?.amount ?? 0);
    }, 0);

    return usedAmount + required.amount <= kitchenSetup[required.type];
  });
};

export const findFirstResourceAvailableSlot = (
  task: CookingTask,
  earliestStartMinute: number,
  scheduledTasks: ScheduledTask[],
  kitchenSetup: KitchenSetup,
  maxSearchMinutes = 720
) => {
  for (
    let startMinute = earliestStartMinute;
    startMinute <= maxSearchMinutes;
    startMinute += 1
  ) {
    if (isSlotAvailable(task, startMinute, scheduledTasks, kitchenSetup)) {
      return startMinute;
    }
  }

  return null;
};

export const findLatestResourceAvailableSlot = (
  task: CookingTask,
  earliestStartMinute: number,
  latestStartMinute: number,
  scheduledTasks: ScheduledTask[],
  kitchenSetup: KitchenSetup,
  excludeTaskId: string
) => {
  for (
    let startMinute = latestStartMinute;
    startMinute >= earliestStartMinute;
    startMinute -= 1
  ) {
    if (
      isSlotAvailable(
        task,
        startMinute,
        scheduledTasks,
        kitchenSetup,
        excludeTaskId
      )
    ) {
      return startMinute;
    }
  }

  return null;
};
