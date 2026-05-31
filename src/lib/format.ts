import type {
  KitchenResourceRequirement,
  KitchenResourceType,
  PlannerMode,
  ScheduledTask
} from "@/types/domain";

const resourceLabels: Record<KitchenResourceType, string> = {
  human: "người nấu",
  stove: "bếp",
  pot: "nồi",
  pan: "chảo",
  rice_cooker: "nồi cơm",
  air_fryer: "nồi chiên",
  oven: "lò nướng",
  knife_board: "dao/thớt"
};

export const plannerModeLabels: Record<PlannerMode, string> = {
  finish_fast: "Nhanh nhất",
  finish_together: "Xong cùng lúc",
  low_stress: "Ít áp lực"
};

export const formatMinute = (minute: number) => {
  const hours = Math.floor(minute / 60);
  const minutes = minute % 60;
  if (hours === 0) {
    return `+${minutes} phút`;
  }
  return `+${hours}g ${minutes.toString().padStart(2, "0")}p`;
};

export const formatDuration = (minutes: number) => `${minutes} phút`;

export const formatSeconds = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const rest = safeSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${rest
    .toString()
    .padStart(2, "0")}`;
};

export const formatResources = (resources: KitchenResourceRequirement[]) => {
  if (resources.length === 0) {
    return "chờ tự nhiên";
  }

  return resources
    .map((resource) => {
      const label = resourceLabels[resource.type];
      return resource.amount > 1 ? `${resource.amount} ${label}` : label;
    })
    .join(" + ");
};

export const sortScheduledTasks = (tasks: ScheduledTask[]) =>
  [...tasks].sort((left, right) => {
    if (left.startMinute !== right.startMinute) {
      return left.startMinute - right.startMinute;
    }

    return left.endMinute - right.endMinute;
  });
