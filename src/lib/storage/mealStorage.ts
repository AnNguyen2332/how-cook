import type { MealPlan } from "@/types/domain";

const STORAGE_KEY = "how-cook:meal-plan:v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isMealPlan = (value: unknown): value is MealPlan => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    isStringArray(value.selectedDishIds) &&
    isRecord(value.kitchenSetup) &&
    typeof value.plannerMode === "string" &&
    Array.isArray(value.scheduledTasks) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
};

export const loadMealPlan = (): MealPlan | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);
    return isMealPlan(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const saveMealPlan = (plan: MealPlan) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
};

export const clearMealPlan = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};
