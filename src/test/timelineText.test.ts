import { describe, expect, it } from "vitest";
import { demoDishes } from "@/data/demoDishes";
import { createTimelineText } from "@/lib/export/timelineText";
import type { ScheduledTask } from "@/types/domain";

const scheduledTask = (overrides: Partial<ScheduledTask>): ScheduledTask => ({
  taskId: "task",
  dishId: "rice-white",
  name: "Task",
  startMinute: 0,
  endMinute: 5,
  durationMinutes: 5,
  type: "active",
  resources: [],
  status: "pending",
  ...overrides
});

describe("createTimelineText", () => {
  it("exports a readable plain-text timeline in start order", () => {
    const text = createTimelineText(
      [
        scheduledTask({
          taskId: "later",
          name: "Later",
          startMinute: 10,
          endMinute: 15
        }),
        scheduledTask({ taskId: "first", name: "First", startMinute: 0 })
      ],
      demoDishes
    );

    expect(text).toContain("How Cook? Timeline");
    expect(text.indexOf("First")).toBeLessThan(text.indexOf("Later"));
    expect(text).toContain("Cơm trắng");
  });
});
