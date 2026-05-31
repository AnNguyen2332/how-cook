import type {
  CookingTask,
  Dish,
  SchedulerInput,
  SchedulerOutput,
  ScheduledTask
} from "@/types/domain";
import { sortTasksByPriority } from "./priority";
import {
  findFirstResourceAvailableSlot,
  findLatestResourceAvailableSlot,
  resourcesFitKitchen
} from "./resource";
import { detectWarnings } from "./warnings";

const flattenTasks = (dishes: Dish[]) =>
  dishes.flatMap((dish) => dish.tasks.map((task) => ({ ...task })));

const getDependencyEndMinute = (
  task: CookingTask,
  scheduledTasks: ScheduledTask[]
) =>
  task.dependsOn.reduce((latestEnd, dependencyId) => {
    const dependency = scheduledTasks.find(
      (scheduledTask) => scheduledTask.taskId === dependencyId
    );
    return Math.max(latestEnd, dependency?.endMinute ?? 0);
  }, 0);

const toScheduledTask = (
  task: CookingTask,
  startMinute: number
): ScheduledTask => ({
  taskId: task.id,
  dishId: task.dishId,
  name: task.name,
  description: task.description,
  startMinute,
  endMinute: startMinute + task.durationMinutes,
  durationMinutes: task.durationMinutes,
  type: task.type,
  resources: task.resources,
  status: "pending"
});

const getDependentStartBoundary = (
  taskId: string,
  scheduledTasks: ScheduledTask[],
  allTasks: CookingTask[]
) => {
  const dependentTaskIds = allTasks
    .filter((task) => task.dependsOn.includes(taskId))
    .map((task) => task.id);

  const dependentStarts = scheduledTasks
    .filter((scheduledTask) => dependentTaskIds.includes(scheduledTask.taskId))
    .map((scheduledTask) => scheduledTask.startMinute);

  if (dependentStarts.length === 0) {
    return null;
  }

  return Math.min(...dependentStarts);
};

const moveServeImmediatelyTasksLater = (
  scheduledTasks: ScheduledTask[],
  allTasks: CookingTask[],
  dishes: Dish[],
  input: SchedulerInput
) => {
  const adjusted = [...scheduledTasks];
  const taskById = new Map(allTasks.map((task) => [task.id, task]));
  const dishById = new Map(dishes.map((dish) => [dish.id, dish]));
  const totalDuration = Math.max(0, ...adjusted.map((task) => task.endMinute));

  const hotTasks = [...adjusted]
    .filter((scheduledTask) => {
      const sourceTask = taskById.get(scheduledTask.taskId);
      const dish = dishById.get(scheduledTask.dishId);
      return (
        sourceTask?.heatSensitivity === "must_be_hot" ||
        dish?.preferredFinishWindow === "serve_immediately"
      );
    })
    .sort((left, right) => right.startMinute - left.startMinute);

  hotTasks.forEach((scheduledTask) => {
    const sourceTask = taskById.get(scheduledTask.taskId);
    if (!sourceTask) {
      return;
    }

    const dependentBoundary = getDependentStartBoundary(
      sourceTask.id,
      adjusted,
      allTasks
    );
    const latestEndMinute = dependentBoundary ?? totalDuration;
    const latestStartMinute = Math.max(
      0,
      latestEndMinute - sourceTask.durationMinutes
    );
    const earliestStartMinute = getDependencyEndMinute(sourceTask, adjusted);

    if (latestStartMinute <= scheduledTask.startMinute) {
      return;
    }

    const laterStart = findLatestResourceAvailableSlot(
      sourceTask,
      earliestStartMinute,
      latestStartMinute,
      adjusted,
      input.kitchenSetup,
      scheduledTask.taskId
    );

    if (laterStart !== null && laterStart > scheduledTask.startMinute) {
      const index = adjusted.findIndex(
        (task) => task.taskId === scheduledTask.taskId
      );
      adjusted[index] = {
        ...adjusted[index],
        startMinute: laterStart,
        endMinute: laterStart + sourceTask.durationMinutes
      };
    }
  });

  return adjusted.sort((left, right) => left.startMinute - right.startMinute);
};

export const generateSchedule = (input: SchedulerInput): SchedulerOutput => {
  const allTasks = flattenTasks(input.dishes);
  const scheduledTasks: ScheduledTask[] = [];
  const scheduledTaskIds = new Set<string>();
  const impossibleTasks: CookingTask[] = [];
  const maxIterations = allTasks.length * 2;
  let iterations = 0;

  while (
    scheduledTasks.length < allTasks.length &&
    iterations < maxIterations
  ) {
    iterations += 1;

    const availableTasks = allTasks.filter(
      (task) =>
        !scheduledTaskIds.has(task.id) &&
        task.dependsOn.every((dependencyId) => scheduledTaskIds.has(dependencyId))
    );

    if (availableTasks.length === 0) {
      break;
    }

    const [selectedTask] = sortTasksByPriority(
      availableTasks,
      allTasks,
      input.mode
    );
    const earliestStartMinute = getDependencyEndMinute(
      selectedTask,
      scheduledTasks
    );
    const availableSlot = findFirstResourceAvailableSlot(
      selectedTask,
      earliestStartMinute,
      scheduledTasks,
      input.kitchenSetup
    );
    const startMinute = availableSlot ?? earliestStartMinute;

    if (
      availableSlot === null &&
      !resourcesFitKitchen(selectedTask.resources, input.kitchenSetup)
    ) {
      impossibleTasks.push(selectedTask);
    }

    scheduledTasks.push(toScheduledTask(selectedTask, startMinute));
    scheduledTaskIds.add(selectedTask.id);
  }

  const adjustedTasks = moveServeImmediatelyTasksLater(
    scheduledTasks,
    allTasks,
    input.dishes,
    input
  );
  const totalDurationMinutes = Math.max(
    0,
    ...adjustedTasks.map((task) => task.endMinute)
  );

  return {
    scheduledTasks: adjustedTasks,
    warnings: detectWarnings(adjustedTasks, input, allTasks, impossibleTasks),
    totalDurationMinutes
  };
};
