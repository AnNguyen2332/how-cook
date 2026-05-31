import type {
  CookingTask,
  Dish,
  SchedulerInput,
  SchedulerWarning,
  ScheduledTask
} from "@/types/domain";
import { resourcesFitKitchen } from "./resource";

const resourceWarningLabels = {
  stove: "bếp",
  pot: "nồi",
  pan: "chảo"
} as const;

const uniqueWarnings = (warnings: SchedulerWarning[]) => {
  const seen = new Set<string>();
  return warnings.filter((warning) => {
    const key = `${warning.type}:${warning.message}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const detectWarnings = (
  scheduledTasks: ScheduledTask[],
  input: SchedulerInput,
  allTasks: CookingTask[],
  impossibleTasks: CookingTask[] = []
): SchedulerWarning[] => {
  const warnings: SchedulerWarning[] = [];
  const taskById = new Map(allTasks.map((task) => [task.id, task]));
  const dishById = new Map(input.dishes.map((dish) => [dish.id, dish]));
  const totalDuration = Math.max(
    0,
    ...scheduledTasks.map((task) => task.endMinute)
  );

  impossibleTasks.forEach((task) => {
    warnings.push({
      type: "impossible_schedule",
      message: `Không đủ tài nguyên để chạy "${task.name}". Hãy tăng số lượng bếp, nồi, chảo hoặc thiết bị liên quan.`
    });
  });

  allTasks
    .filter((task) => !resourcesFitKitchen(task.resources, input.kitchenSetup))
    .forEach((task) => {
      warnings.push({
        type: "impossible_schedule",
        message: `"${task.name}" cần tài nguyên đang đặt là 0 hoặc không đủ.`
      });
    });

  const resourcePressure = ["stove", "pot", "pan"] as const;
  resourcePressure.forEach((resourceType) => {
    const tasksNeedingResource = allTasks.filter((task) =>
      task.resources.some((resource) => resource.type === resourceType)
    );

    if (
      input.kitchenSetup[resourceType] === 1 &&
      tasksNeedingResource.length >= 3
    ) {
      warnings.push({
        type: "resource_conflict",
        message: `Chỉ có 1 ${resourceWarningLabels[resourceType]} nên một số bước sẽ phải chờ nhau.`
      });
    }
  });

  input.dishes.forEach((dish: Dish) => {
    const dishTasks = scheduledTasks
      .filter((task) => task.dishId === dish.id)
      .sort((left, right) => left.startMinute - right.startMinute);

    for (let index = 1; index < dishTasks.length; index += 1) {
      const gap = dishTasks[index].startMinute - dishTasks[index - 1].endMinute;
      if (gap >= 25) {
        warnings.push({
          type: "long_gap",
          message: `"${dish.name}" có khoảng chờ ${gap} phút giữa hai bước.`
        });
      }
    }
  });

  scheduledTasks.forEach((scheduledTask) => {
    const sourceTask = taskById.get(scheduledTask.taskId);
    const dish = dishById.get(scheduledTask.dishId);
    const mustBeFresh =
      sourceTask?.heatSensitivity === "must_be_hot" ||
      dish?.preferredFinishWindow === "serve_immediately";

    if (mustBeFresh && totalDuration - scheduledTask.endMinute > 10) {
      warnings.push({
        type: "late_hot_dish",
        message: `"${scheduledTask.name}" nên làm sát giờ ăn hơn để giữ nóng.`
      });
    }
  });

  return uniqueWarnings(warnings);
};
