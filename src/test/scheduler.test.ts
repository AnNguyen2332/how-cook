import { describe, expect, it } from "vitest";
import { demoDishes } from "@/data/demoDishes";
import { generateSchedule } from "@/lib/scheduler/generateSchedule";
import { defaultKitchenSetup } from "@/types/domain";

const byId = (dishId: string) => {
  const dish = demoDishes.find((candidate) => candidate.id === dishId);
  if (!dish) {
    throw new Error(`Missing test dish ${dishId}`);
  }
  return dish;
};

const task = (tasks: ReturnType<typeof generateSchedule>["scheduledTasks"], id: string) => {
  const scheduledTask = tasks.find((candidate) => candidate.taskId === id);
  if (!scheduledTask) {
    throw new Error(`Missing scheduled task ${id}`);
  }
  return scheduledTask;
};

const overlaps = (
  left: ReturnType<typeof generateSchedule>["scheduledTasks"][number],
  right: ReturnType<typeof generateSchedule>["scheduledTasks"][number]
) => left.startMinute < right.endMinute && right.startMinute < left.endMinute;

describe("generateSchedule", () => {
  it("schedules a single dish in dependency order", () => {
    const output = generateSchedule({
      dishes: [byId("rice-white")],
      kitchenSetup: defaultKitchenSetup,
      mode: "finish_fast"
    });

    expect(task(output.scheduledTasks, "rice-wash").startMinute).toBe(0);
    expect(task(output.scheduledTasks, "rice-cook").startMinute).toBeGreaterThanOrEqual(
      task(output.scheduledTasks, "rice-wash").endMinute
    );
  });

  it("schedules multiple dishes into a non-empty timeline", () => {
    const dishes = [byId("rice-white"), byId("sour-soup"), byId("fried-eggs")];
    const output = generateSchedule({
      dishes,
      kitchenSetup: defaultKitchenSetup,
      mode: "finish_fast"
    });

    const expectedTaskCount = dishes.reduce(
      (sum, dish) => sum + dish.tasks.length,
      0
    );

    expect(output.scheduledTasks).toHaveLength(expectedTaskCount);
    expect(output.totalDurationMinutes).toBeGreaterThan(0);
  });

  it("lets passive waiting overlap with active prep", () => {
    const output = generateSchedule({
      dishes: [byId("rice-white"), byId("pork-braised-eggs")],
      kitchenSetup: defaultKitchenSetup,
      mode: "finish_together"
    });

    const riceCook = task(output.scheduledTasks, "rice-cook");
    const porkPrep = task(output.scheduledTasks, "pork-prep");

    expect(porkPrep.startMinute).toBeLessThan(riceCook.endMinute);
  });

  it("respects a single stove burner", () => {
    const output = generateSchedule({
      dishes: [byId("sour-soup"), byId("boiled-vegetables")],
      kitchenSetup: { ...defaultKitchenSetup, stove: 1, pot: 1 },
      mode: "finish_together"
    });

    const soupCook = task(output.scheduledTasks, "soup-cook");
    const vegBoil = task(output.scheduledTasks, "veg-boil");
    const overlap =
      soupCook.startMinute < vegBoil.endMinute &&
      vegBoil.startMinute < soupCook.endMinute;

    expect(overlap).toBe(false);
  });

  it("does not overlap active tasks when there is one cook", () => {
    const output = generateSchedule({
      dishes: [byId("sour-soup"), byId("boiled-vegetables"), byId("fried-eggs")],
      kitchenSetup: { ...defaultKitchenSetup, human: 1, stove: 2, pot: 2 },
      mode: "finish_fast"
    });
    const activeTasks = output.scheduledTasks.filter(
      (scheduledTask) => scheduledTask.type === "active"
    );

    for (let leftIndex = 0; leftIndex < activeTasks.length; leftIndex += 1) {
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < activeTasks.length;
        rightIndex += 1
      ) {
        expect(overlaps(activeTasks[leftIndex], activeTasks[rightIndex])).toBe(
          false
        );
      }
    }
  });

  it("keeps serve-immediately tasks near the end", () => {
    const output = generateSchedule({
      dishes: [byId("rice-white"), byId("boiled-vegetables")],
      kitchenSetup: defaultKitchenSetup,
      mode: "finish_together"
    });

    const vegBoil = task(output.scheduledTasks, "veg-boil");
    expect(output.totalDurationMinutes - vegBoil.endMinute).toBeLessThanOrEqual(10);
  });

  it("warns when a selected dish needs an unavailable resource", () => {
    const output = generateSchedule({
      dishes: [byId("rice-white")],
      kitchenSetup: { ...defaultKitchenSetup, rice_cooker: 0 },
      mode: "finish_fast"
    });

    expect(output.warnings.some((warning) => warning.type === "impossible_schedule")).toBe(
      true
    );
  });

  it("allows planner mode to change the schedule output", () => {
    const dishes = [byId("rice-white"), byId("fried-eggs")];
    const fast = generateSchedule({
      dishes,
      kitchenSetup: defaultKitchenSetup,
      mode: "finish_fast"
    });
    const lowStress = generateSchedule({
      dishes,
      kitchenSetup: defaultKitchenSetup,
      mode: "low_stress"
    });

    expect(task(fast.scheduledTasks, "rice-wash").startMinute).not.toBe(
      task(lowStress.scheduledTasks, "rice-wash").startMinute
    );
  });
});
