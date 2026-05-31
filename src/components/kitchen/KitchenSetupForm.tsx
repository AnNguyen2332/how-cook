import {
  CalendarClock,
  Flame,
  SlidersHorizontal,
  Utensils,
  Users,
  type LucideIcon
} from "lucide-react";
import { plannerModeLabels } from "@/lib/format";
import type {
  KitchenResourceType,
  KitchenSetup,
  PlannerMode
} from "@/types/domain";
import { ResourceControl } from "./ResourceControl";

type KitchenSetupFormProps = {
  kitchenSetup: KitchenSetup;
  plannerMode: PlannerMode;
  onKitchenSetupChange: (setup: KitchenSetup) => void;
  onPlannerModeChange: (mode: PlannerMode) => void;
};

const plannerModes: PlannerMode[] = [
  "finish_fast",
  "finish_together",
  "low_stress"
];

const deviceToggles: Array<{
  resource: KitchenResourceType;
  label: string;
  Icon: LucideIcon;
}> = [
  { resource: "rice_cooker", label: "Nồi cơm", Icon: Utensils },
  { resource: "air_fryer", label: "Nồi chiên", Icon: Flame },
  { resource: "oven", label: "Lò nướng", Icon: CalendarClock }
];

export function KitchenSetupForm({
  kitchenSetup,
  plannerMode,
  onKitchenSetupChange,
  onPlannerModeChange
}: KitchenSetupFormProps) {
  const updateResource = (resource: KitchenResourceType, value: number) => {
    onKitchenSetupChange({ ...kitchenSetup, [resource]: value });
  };
  const summaryItems: Array<{
    label: string;
    value: string;
    Icon: LucideIcon;
  }> = [
    { label: "Bếp", value: String(kitchenSetup.stove), Icon: Flame },
    {
      label: "Nồi cơm",
      value: kitchenSetup.rice_cooker > 0 ? "Có" : "Không",
      Icon: Utensils
    },
    {
      label: "Người nấu",
      value: String(kitchenSetup.human),
      Icon: Users
    },
    {
      label: "Chế độ",
      value: plannerModeLabels[plannerMode],
      Icon: SlidersHorizontal
    }
  ];

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-950">
            Thiết lập bếp
          </h2>
          <p className="mt-1 text-sm text-zinc-500">Tài nguyên bếp hiện có</p>
        </div>
        <SlidersHorizontal className="h-5 w-5 text-zinc-500" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {summaryItems.map(({ label, value, Icon }) => (
          <div
            className="rounded-lg bg-zinc-50 p-3 ring-1 ring-zinc-200"
            key={label}
          >
            <Icon className="mb-2 h-4 w-4 text-zinc-500" />
            <div className="text-xs text-zinc-500">{label}</div>
            <div className="truncate font-semibold text-zinc-950">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        <ResourceControl
          description="Số người có thể thao tác trực tiếp cùng lúc."
          label="Người nấu"
          min={1}
          onChange={(value) => updateResource("human", value)}
          value={kitchenSetup.human}
        />
        <ResourceControl
          description="Số bếp có thể dùng cùng lúc."
          label="Bếp"
          min={0}
          onChange={(value) => updateResource("stove", value)}
          value={kitchenSetup.stove}
        />
        <ResourceControl
          label="Nồi"
          min={0}
          onChange={(value) => updateResource("pot", value)}
          value={kitchenSetup.pot}
        />
        <ResourceControl
          label="Chảo"
          min={0}
          onChange={(value) => updateResource("pan", value)}
          value={kitchenSetup.pan}
        />
        <ResourceControl
          label="Dao/thớt"
          min={0}
          onChange={(value) => updateResource("knife_board", value)}
          value={kitchenSetup.knife_board}
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {deviceToggles.map(({ resource, label, Icon }) => {
          const enabled = kitchenSetup[resource] > 0;
          return (
            <button
              className={`rounded-lg border p-3 text-left transition ${
                enabled
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950"
              }`}
              key={resource}
              onClick={() => updateResource(resource, enabled ? 0 : 1)}
              type="button"
            >
              <Icon className="mb-2 h-4 w-4" />
              <span className="text-xs font-semibold">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <h3 className="mb-2 text-sm font-semibold text-zinc-950">
          Cách sắp xếp
        </h3>
        <div className="grid gap-2">
          {plannerModes.map((mode) => (
            <button
              className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition ${
                plannerMode === mode
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950"
              }`}
              key={mode}
              onClick={() => onPlannerModeChange(mode)}
              type="button"
            >
              {plannerModeLabels[mode]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
