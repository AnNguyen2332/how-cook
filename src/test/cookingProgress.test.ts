import { describe, expect, it } from "vitest";
import {
  delayPendingTasks,
  getNextPendingActiveTask,
  getNextReadyActiveTask,
  hasUnfinishedTasks
} from "@/lib/cooking/progress";
import type { ScheduledTask } from "@/types/domain";

const task = (overrides: Partial<ScheduledTask>): ScheduledTask => ({
  taskId: "task",
  dishId: "dish",
  name: "Task",
  startMinute: 0,
  endMinute: 5,
  durationMinutes: 5,
  type: "active",
  resources: [],
  status: "pending",
  ...overrides
});

describe("cooking progress helpers", () => {
  it("does not promote future or passive tasks as the active current step", () => {
    const tasks = [
      task({
        taskId: "passive-now",
        type: "passive",
        startMinute: 0,
        endMinute: 20
      }),
      task({ taskId: "active-later", startMinute: 10, endMinute: 15 })
    ];

    expect(getNextReadyActiveTask(tasks, 0)).toBeUndefined();
  });

  it("returns the next active task only after its scheduled start", () => {
    const tasks = [
      task({ taskId: "later", startMinute: 10, endMinute: 15 }),
      task({ taskId: "ready", startMinute: 3, endMinute: 8 })
    ];

    expect(getNextReadyActiveTask(tasks, 2 * 60)).toBeUndefined();
    expect(getNextReadyActiveTask(tasks, 3 * 60)?.taskId).toBe("ready");
  });

  it("keeps future active tasks visible as upcoming work", () => {
    const tasks = [
      task({ taskId: "done", status: "done" }),
      task({ taskId: "future", startMinute: 20, endMinute: 25 })
    ];

    expect(getNextPendingActiveTask(tasks)?.taskId).toBe("future");
    expect(hasUnfinishedTasks(tasks)).toBe(true);
  });

  it("delays pending tasks without moving current, done, or running passive tasks", () => {
    const delayed = delayPendingTasks(
      [
        task({ taskId: "current", status: "running", startMinute: 0, endMinute: 5 }),
        task({
          taskId: "passive-running",
          type: "passive",
          startMinute: 0,
          endMinute: 20
        }),
        task({ taskId: "done", status: "done", startMinute: 5, endMinute: 10 }),
        task({ taskId: "pending", startMinute: 15, endMinute: 20 })
      ],
      {
        currentTaskId: "current",
        elapsedSeconds: 10 * 60
      }
    );

    expect(delayed.find((item) => item.taskId === "current")?.startMinute).toBe(0);
    expect(
      delayed.find((item) => item.taskId === "passive-running")?.startMinute
    ).toBe(0);
    expect(delayed.find((item) => item.taskId === "done")?.startMinute).toBe(5);
    expect(delayed.find((item) => item.taskId === "pending")?.startMinute).toBe(
      20
    );
  });
});
