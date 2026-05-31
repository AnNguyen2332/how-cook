import type { CookingTask, PlannerMode } from "@/types/domain";

const downstreamCount = (task: CookingTask, allTasks: CookingTask[]) => {
  const visited = new Set<string>();
  const visit = (taskId: string) => {
    allTasks
      .filter((candidate) => candidate.dependsOn.includes(taskId))
      .forEach((candidate) => {
        if (!visited.has(candidate.id)) {
          visited.add(candidate.id);
          visit(candidate.id);
        }
      });
  };

  visit(task.id);
  return visited.size;
};

const hotPenalty = (task: CookingTask, mode: PlannerMode) => {
  if (mode === "finish_fast") {
    return task.heatSensitivity === "must_be_hot" ? 20 : 0;
  }

  if (task.heatSensitivity === "must_be_hot") {
    return 90;
  }

  if (task.heatSensitivity === "best_hot") {
    return 35;
  }

  return 0;
};

export const taskPriorityScore = (
  task: CookingTask,
  allTasks: CookingTask[],
  mode: PlannerMode
) => {
  const unlockBonus = downstreamCount(task, allTasks) * -12;
  const passiveBonus =
    task.type === "passive" ? -18 - task.durationMinutes * 0.4 : 0;
  const activeStressPenalty =
    mode === "low_stress" && task.type === "active"
      ? task.durationMinutes * 0.35
      : 0;
  const shortGapBonus =
    task.type === "active" && task.durationMinutes <= 8 ? -4 : 0;

  return (
    unlockBonus +
    passiveBonus +
    activeStressPenalty +
    shortGapBonus +
    hotPenalty(task, mode)
  );
};

export const sortTasksByPriority = (
  tasks: CookingTask[],
  allTasks: CookingTask[],
  mode: PlannerMode
) =>
  [...tasks].sort((left, right) => {
    const scoreDiff =
      taskPriorityScore(left, allTasks, mode) -
      taskPriorityScore(right, allTasks, mode);

    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    return right.durationMinutes - left.durationMinutes;
  });
