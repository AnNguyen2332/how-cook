"use client";

import { useEffect, useState } from "react";
import {
  getNextPendingActiveTask,
  hasUnfinishedTasks
} from "@/lib/cooking/progress";
import type { Dish, ScheduledTask } from "@/types/domain";
import { CookingControls } from "./CookingControls";
import { CurrentStepCard } from "./CurrentStepCard";
import { NextSteps } from "./NextSteps";
import { RunningTimers } from "./RunningTimers";

type CookingModeProps = {
  dishes: Dish[];
  tasks: ScheduledTask[];
  currentTaskId?: string;
  elapsedSeconds: number;
  currentStepElapsedSeconds: number;
  paused: boolean;
  onDone: () => void;
  onSkip: () => void;
  onDelay: () => void;
  onTogglePause: () => void;
};

export function CookingMode({
  dishes,
  tasks,
  currentTaskId,
  elapsedSeconds,
  currentStepElapsedSeconds,
  paused,
  onDone,
  onSkip,
  onDelay,
  onTogglePause
}: CookingModeProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (paused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTick((value) => value + 1);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [paused]);

  const dishById = new Map(dishes.map((dish) => [dish.id, dish]));
  const currentTask = tasks.find(
    (task) => task.taskId === currentTaskId && task.type === "active"
  );
  const nextActiveTask = getNextPendingActiveTask(tasks);
  const waitSeconds = nextActiveTask
    ? nextActiveTask.startMinute * 60 - elapsedSeconds
    : undefined;
  const remainingSeconds = currentTask
    ? currentTask.durationMinutes * 60 - currentStepElapsedSeconds
    : 0;

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <CurrentStepCard
          dish={currentTask ? dishById.get(currentTask.dishId) : undefined}
          hasRemainingTasks={hasUnfinishedTasks(tasks)}
          nextDish={
            nextActiveTask ? dishById.get(nextActiveTask.dishId) : undefined
          }
          nextTask={nextActiveTask}
          paused={paused}
          remainingSeconds={remainingSeconds}
          task={currentTask}
          waitSeconds={waitSeconds}
        />
        <CookingControls
          delayDisabled={!tasks.some((task) => task.status === "pending")}
          onDelay={onDelay}
          onDone={onDone}
          onSkip={onSkip}
          onTogglePause={onTogglePause}
          paused={paused}
          stepDisabled={!currentTask}
        />
      </div>
      <div className="space-y-5">
        <RunningTimers
          dishes={dishes}
          elapsedSeconds={elapsedSeconds}
          tasks={tasks}
        />
        <NextSteps
          currentTaskId={currentTaskId}
          dishes={dishes}
          tasks={tasks}
        />
      </div>
    </div>
  );
}
