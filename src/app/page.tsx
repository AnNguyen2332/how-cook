"use client";

import { useEffect, useMemo, useState } from "react";
import { CookingMode } from "@/components/cooking/CookingMode";
import { DishSelector } from "@/components/dishes/DishSelector";
import { KitchenSetupForm } from "@/components/kitchen/KitchenSetupForm";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { TimelineView } from "@/components/timeline/TimelineView";
import { demoDishes } from "@/data/demoDishes";
import {
  delayPendingTasks,
  getNextReadyActiveTask
} from "@/lib/cooking/progress";
import { createTimelineText } from "@/lib/export/timelineText";
import { sortScheduledTasks } from "@/lib/format";
import { generateSchedule } from "@/lib/scheduler/generateSchedule";
import {
  clearMealPlan,
  loadMealPlan,
  saveMealPlan
} from "@/lib/storage/mealStorage";
import type {
  AppView,
  KitchenSetup,
  MealPlan,
  PlannerMode,
  ScheduledTask
} from "@/types/domain";
import { defaultKitchenSetup } from "@/types/domain";

const sampleDinnerIds = [
  "rice-white",
  "pork-braised-eggs",
  "sour-soup",
  "boiled-vegetables"
];

const createInitialPlan = (): MealPlan => {
  const now = new Date().toISOString();
  return {
    id: `meal-${Date.now()}`,
    name: "Bữa tối hôm nay",
    selectedDishIds: [],
    kitchenSetup: defaultKitchenSetup,
    plannerMode: "low_stress",
    scheduledTasks: [],
    currentView: "timeline",
    createdAt: now,
    updatedAt: now
  };
};

const getNowIso = () => new Date().toISOString();

const getElapsedSeconds = (
  plan: MealPlan,
  nowMs: number,
  field: "cookingStartedAt" | "currentStepStartedAt",
  pausedField: "pausedElapsedSeconds" | "pausedCurrentStepElapsedSeconds"
) => {
  if (plan.isPaused) {
    return plan[pausedField] ?? 0;
  }

  const startedAt = plan[field];
  if (!startedAt) {
    return 0;
  }

  return Math.max(0, Math.floor((nowMs - Date.parse(startedAt)) / 1000));
};

const markTaskStatus = (
  tasks: ScheduledTask[],
  taskId: string | undefined,
  status: ScheduledTask["status"]
) =>
  tasks.map((task) =>
    task.taskId === taskId
      ? {
          ...task,
          status
        }
      : task
  );

const scheduleFromPlan = (plan: MealPlan) => {
  const dishes = demoDishes.filter((dish) =>
    plan.selectedDishIds.includes(dish.id)
  );

  return generateSchedule({
    dishes,
    kitchenSetup: plan.kitchenSetup,
    mode: plan.plannerMode
  });
};

export default function Home() {
  const [mealPlan, setMealPlan] = useState<MealPlan>(() => createInitialPlan());
  const [hydrated, setHydrated] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">(
    "idle"
  );

  useEffect(() => {
    const savedPlan = loadMealPlan();
    if (savedPlan) {
      setMealPlan(savedPlan);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveMealPlan(mealPlan);
    }
  }, [hydrated, mealPlan]);

  useEffect(() => {
    if (mealPlan.currentView !== "cook" || mealPlan.isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [mealPlan.currentView, mealPlan.isPaused]);

  const selectedDishes = useMemo(
    () =>
      demoDishes.filter((dish) => mealPlan.selectedDishIds.includes(dish.id)),
    [mealPlan.selectedDishIds]
  );

  const schedulerOutput = useMemo(() => {
    if (selectedDishes.length < 2) {
      return null;
    }

    return generateSchedule({
      dishes: selectedDishes,
      kitchenSetup: mealPlan.kitchenSetup,
      mode: mealPlan.plannerMode
    });
  }, [mealPlan.kitchenSetup, mealPlan.plannerMode, selectedDishes]);

  const resourceImpact = useMemo(() => {
    if (selectedDishes.length < 2) {
      return [];
    }

    return [1, 2].map((stoveCount) => ({
      label: `${stoveCount} bếp`,
      durationMinutes: generateSchedule({
        dishes: selectedDishes,
        kitchenSetup: {
          ...mealPlan.kitchenSetup,
          stove: stoveCount
        },
        mode: mealPlan.plannerMode
      }).totalDurationMinutes,
      isCurrent: mealPlan.kitchenSetup.stove === stoveCount
    }));
  }, [mealPlan.kitchenSetup, mealPlan.plannerMode, selectedDishes]);

  const totalDurationMinutes = Math.max(
    0,
    ...mealPlan.scheduledTasks.map((task) => task.endMinute)
  );
  const elapsedSeconds = getElapsedSeconds(
    mealPlan,
    nowMs,
    "cookingStartedAt",
    "pausedElapsedSeconds"
  );
  const currentStepElapsedSeconds = getElapsedSeconds(
    mealPlan,
    nowMs,
    "currentStepStartedAt",
    "pausedCurrentStepElapsedSeconds"
  );
  const currentActiveTask = mealPlan.scheduledTasks.find(
    (task) =>
      task.taskId === mealPlan.currentTaskId &&
      task.type === "active" &&
      task.status === "running"
  );

  const updatePlan = (updater: (plan: MealPlan) => MealPlan) => {
    setMealPlan((currentPlan) => ({
      ...updater(currentPlan),
      updatedAt: getNowIso()
    }));
  };

  const invalidateSchedule = (plan: MealPlan): MealPlan => ({
    ...plan,
    scheduledTasks: [],
    currentTaskId: undefined,
    cookingStartedAt: undefined,
    currentStepStartedAt: undefined,
    pausedElapsedSeconds: undefined,
    pausedCurrentStepElapsedSeconds: undefined,
    isPaused: false,
    currentView: "timeline"
  });

  useEffect(() => {
    if (mealPlan.currentView !== "cook" || mealPlan.isPaused || currentActiveTask) {
      return;
    }

    const readyTask = getNextReadyActiveTask(
      mealPlan.scheduledTasks,
      elapsedSeconds
    );

    if (!readyTask) {
      return;
    }

    updatePlan((plan) => ({
      ...plan,
      scheduledTasks: markTaskStatus(
        plan.scheduledTasks,
        readyTask.taskId,
        "running"
      ),
      currentTaskId: readyTask.taskId,
      currentStepStartedAt: getNowIso(),
      pausedCurrentStepElapsedSeconds: undefined
    }));
  }, [
    currentActiveTask,
    elapsedSeconds,
    mealPlan.currentView,
    mealPlan.isPaused,
    mealPlan.scheduledTasks
  ]);

  const handleToggleDish = (dishId: string) => {
    updatePlan((plan) => {
      const selectedDishIds = plan.selectedDishIds.includes(dishId)
        ? plan.selectedDishIds.filter((selectedId) => selectedId !== dishId)
        : [...plan.selectedDishIds, dishId];

      return invalidateSchedule({
        ...plan,
        selectedDishIds
      });
    });
  };

  const handleKitchenSetupChange = (kitchenSetup: KitchenSetup) => {
    updatePlan((plan) => invalidateSchedule({ ...plan, kitchenSetup }));
  };

  const handlePlannerModeChange = (plannerMode: PlannerMode) => {
    updatePlan((plan) => invalidateSchedule({ ...plan, plannerMode }));
  };

  const handleGenerate = () => {
    updatePlan((plan) => {
      if (plan.selectedDishIds.length < 2) {
        return plan;
      }

      const output = scheduleFromPlan(plan);
      return {
        ...plan,
        scheduledTasks: output.scheduledTasks,
        currentTaskId: undefined,
        currentView: "timeline",
        cookingStartedAt: undefined,
        currentStepStartedAt: undefined,
        isPaused: false,
        pausedElapsedSeconds: undefined,
        pausedCurrentStepElapsedSeconds: undefined
      };
    });
  };

  const startCookingFromTasks = (
    plan: MealPlan,
    tasks: ScheduledTask[]
  ): MealPlan => {
    const sortedTasks = sortScheduledTasks(tasks).map((task) => ({
      ...task,
      status: "pending" as const
    }));
    const firstTask = getNextReadyActiveTask(sortedTasks, 0);
    const startedAt = getNowIso();

    return {
      ...plan,
      scheduledTasks: firstTask
        ? markTaskStatus(sortedTasks, firstTask.taskId, "running")
        : sortedTasks,
      currentTaskId: firstTask?.taskId,
      currentView: "cook",
      cookingStartedAt: startedAt,
      currentStepStartedAt: startedAt,
      isPaused: false,
      pausedElapsedSeconds: undefined,
      pausedCurrentStepElapsedSeconds: undefined
    };
  };

  const handleStartCooking = () => {
    updatePlan((plan) => {
      const tasks =
        plan.scheduledTasks.length > 0
          ? plan.scheduledTasks
          : scheduleFromPlan(plan).scheduledTasks;
      return startCookingFromTasks(plan, tasks);
    });
    setNowMs(Date.now());
  };

  const advanceCurrentTask = (status: "done" | "skipped") => {
    updatePlan((plan) => {
      const withFinishedCurrent = markTaskStatus(
        plan.scheduledTasks,
        plan.currentTaskId,
        status
      );
      const elapsedAtAdvance = getElapsedSeconds(
        plan,
        Date.now(),
        "cookingStartedAt",
        "pausedElapsedSeconds"
      );
      const nextTask = getNextReadyActiveTask(
        withFinishedCurrent,
        elapsedAtAdvance
      );
      const withNextRunning = nextTask
        ? markTaskStatus(withFinishedCurrent, nextTask.taskId, "running")
        : withFinishedCurrent;

      return {
        ...plan,
        scheduledTasks: withNextRunning,
        currentTaskId: nextTask?.taskId,
        currentStepStartedAt: nextTask ? getNowIso() : undefined,
        pausedCurrentStepElapsedSeconds: undefined
      };
    });
    setNowMs(Date.now());
  };

  const handleDelay = () => {
    updatePlan((plan) => {
      const currentElapsed = getElapsedSeconds(
        plan,
        Date.now(),
        "cookingStartedAt",
        "pausedElapsedSeconds"
      );

      return {
        ...plan,
        scheduledTasks: delayPendingTasks(plan.scheduledTasks, {
          currentTaskId: plan.currentTaskId,
          elapsedSeconds: currentElapsed
        })
      };
    });
  };

  const handleCopyTimeline = async () => {
    if (mealPlan.scheduledTasks.length === 0) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        createTimelineText(mealPlan.scheduledTasks, demoDishes)
      );
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }

    window.setTimeout(() => setCopyStatus("idle"), 2200);
  };

  const handleTogglePause = () => {
    updatePlan((plan) => {
      const now = Date.now();

      if (plan.isPaused) {
        const pausedElapsed = plan.pausedElapsedSeconds ?? 0;
        const pausedCurrent = plan.pausedCurrentStepElapsedSeconds ?? 0;
        return {
          ...plan,
          isPaused: false,
          cookingStartedAt: new Date(now - pausedElapsed * 1000).toISOString(),
          currentStepStartedAt: new Date(
            now - pausedCurrent * 1000
          ).toISOString(),
          pausedElapsedSeconds: undefined,
          pausedCurrentStepElapsedSeconds: undefined
        };
      }

      return {
        ...plan,
        isPaused: true,
        pausedElapsedSeconds: getElapsedSeconds(
          plan,
          now,
          "cookingStartedAt",
          "pausedElapsedSeconds"
        ),
        pausedCurrentStepElapsedSeconds: getElapsedSeconds(
          plan,
          now,
          "currentStepStartedAt",
          "pausedCurrentStepElapsedSeconds"
        )
      };
    });
    setNowMs(Date.now());
  };

  const handleLoadSample = () => {
    const now = getNowIso();
    const basePlan: MealPlan = {
      id: `meal-${Date.now()}`,
      name: "Bữa tối mẫu",
      selectedDishIds: sampleDinnerIds,
      kitchenSetup: defaultKitchenSetup,
      plannerMode: "low_stress",
      scheduledTasks: [],
      currentView: "timeline",
      createdAt: now,
      updatedAt: now
    };
    const output = scheduleFromPlan(basePlan);

    setMealPlan({
      ...basePlan,
      scheduledTasks: output.scheduledTasks
    });
  };

  const handleReset = () => {
    clearMealPlan();
    setMealPlan(createInitialPlan());
  };

  const setView = (currentView: AppView) => {
    updatePlan((plan) => ({
      ...plan,
      currentView
    }));
  };

  const sidebar = (
    <>
      <DishSelector
        dishes={demoDishes}
        onGenerate={handleGenerate}
        onToggleDish={handleToggleDish}
        selectedDishIds={mealPlan.selectedDishIds}
      />
      <KitchenSetupForm
        kitchenSetup={mealPlan.kitchenSetup}
        onKitchenSetupChange={handleKitchenSetupChange}
        onPlannerModeChange={handlePlannerModeChange}
        plannerMode={mealPlan.plannerMode}
      />
    </>
  );

  return (
    <AppShell
      header={
        <Header
          canOpenCooking={Boolean(mealPlan.cookingStartedAt)}
          currentView={mealPlan.currentView ?? "timeline"}
          onLoadSample={handleLoadSample}
          onReset={handleReset}
          onViewChange={setView}
        />
      }
      sidebar={sidebar}
    >
      {mealPlan.currentView === "cook" ? (
        <CookingMode
          currentStepElapsedSeconds={currentStepElapsedSeconds}
          currentTaskId={currentActiveTask?.taskId}
          dishes={demoDishes}
          elapsedSeconds={elapsedSeconds}
          onDelay={handleDelay}
          onDone={() => advanceCurrentTask("done")}
          onSkip={() => advanceCurrentTask("skipped")}
          onTogglePause={handleTogglePause}
          paused={mealPlan.isPaused ?? false}
          tasks={mealPlan.scheduledTasks}
        />
      ) : (
        <TimelineView
          copyStatus={copyStatus}
          dishes={demoDishes}
          onCopyTimeline={handleCopyTimeline}
          onRegenerate={handleGenerate}
          onStartCooking={handleStartCooking}
          resourceImpact={resourceImpact}
          scheduledTasks={mealPlan.scheduledTasks}
          selectedDishIds={mealPlan.selectedDishIds}
          totalDurationMinutes={
            totalDurationMinutes || schedulerOutput?.totalDurationMinutes || 0
          }
          warnings={schedulerOutput?.warnings ?? []}
        />
      )}
    </AppShell>
  );
}
