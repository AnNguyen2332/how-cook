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
});
