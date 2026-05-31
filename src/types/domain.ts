export type DishCategory = "rice" | "main" | "soup" | "vegetable" | "side";

export type PreferredFinishWindow =
  | "early_ok"
  | "hot_at_end"
  | "serve_immediately";

export type TaskType = "active" | "passive";

export type KitchenResourceType =
  | "human"
  | "stove"
  | "pot"
  | "pan"
  | "rice_cooker"
  | "air_fryer"
  | "oven"
  | "knife_board";

export type KitchenResourceRequirement = {
  type: KitchenResourceType;
  amount: number;
};

export type HeatSensitivity = "none" | "best_hot" | "must_be_hot";

export type CookingTask = {
  id: string;
  dishId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  type: TaskType;
  resources: KitchenResourceRequirement[];
  dependsOn: string[];
  heatSensitivity?: HeatSensitivity;
  canStartEarly?: boolean;
};

export type Dish = {
  id: string;
  name: string;
  description?: string;
  category: DishCategory;
  tags: string[];
  preferredFinishWindow?: PreferredFinishWindow;
  tasks: CookingTask[];
};

export type KitchenSetup = Record<KitchenResourceType, number>;

export type ScheduledTaskStatus = "pending" | "running" | "done" | "skipped";

export type ScheduledTask = {
  taskId: string;
  dishId: string;
  name: string;
  description?: string;
  startMinute: number;
  endMinute: number;
  durationMinutes: number;
  type: TaskType;
  resources: KitchenResourceRequirement[];
  status: ScheduledTaskStatus;
};

export type PlannerMode = "finish_fast" | "finish_together" | "low_stress";

export type AppView = "plan" | "timeline" | "cook";

export type MealPlan = {
  id: string;
  name: string;
  selectedDishIds: string[];
  kitchenSetup: KitchenSetup;
  plannerMode: PlannerMode;
  targetFinishTime?: string;
  scheduledTasks: ScheduledTask[];
  currentTaskId?: string;
  currentView?: AppView;
  cookingStartedAt?: string;
  currentStepStartedAt?: string;
  isPaused?: boolean;
  pausedElapsedSeconds?: number;
  pausedCurrentStepElapsedSeconds?: number;
  createdAt: string;
  updatedAt: string;
};

export type SchedulerInput = {
  dishes: Dish[];
  kitchenSetup: KitchenSetup;
  mode: PlannerMode;
  targetFinishTime?: string;
};

export type SchedulerWarningType =
  | "resource_conflict"
  | "long_gap"
  | "late_hot_dish"
  | "impossible_schedule";

export type SchedulerWarning = {
  type: SchedulerWarningType;
  message: string;
};

export type SchedulerOutput = {
  scheduledTasks: ScheduledTask[];
  warnings: SchedulerWarning[];
  totalDurationMinutes: number;
};

export const defaultKitchenSetup: KitchenSetup = {
  human: 1,
  stove: 2,
  pot: 2,
  pan: 1,
  rice_cooker: 1,
  air_fryer: 0,
  oven: 0,
  knife_board: 1
};
