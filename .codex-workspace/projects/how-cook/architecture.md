# Architecture

Status: Draft ready for approval.

## System Overview

How Cook? is a local-first browser webapp. The MVP keeps all product logic in the frontend: structured dish data, heuristic schedule generation, view state, timers, and localStorage persistence.

No backend, database, auth, server actions, or external scheduling service are required for Phase 0.

## Main Modules

- App shell: global layout, header, responsive page structure.
- Meal planner page: orchestrates selected dishes, kitchen setup, scheduler output, timeline review, and cooking mode.
- Dish components: dish cards, filters, selected state.
- Kitchen components: resource controls and planner mode controls.
- Timeline components: review list, item details, warning panel.
- Cooking components: current step, countdown, running passive timers, next steps, and action controls.
- Scheduler library: dependency flattening, priority sorting, resource slot search, warning generation.
- Storage library: localStorage read/write/reset helpers with versioned payload shape.
- Domain types: shared TypeScript definitions for dishes, tasks, resources, schedule output, warnings, and meal plan.

## Data Model

Core domain objects:

- `Dish`
- `CookingTask`
- `KitchenResourceType`
- `KitchenResourceRequirement`
- `KitchenSetup`
- `ScheduledTask`
- `MealPlan`
- `SchedulerInput`
- `SchedulerOutput`
- `SchedulerWarning`

Scheduled task status values:

- `pending`
- `running`
- `done`
- `skipped`

Planner modes:

- `finish_fast`
- `finish_together`
- `low_stress`

## Interfaces

Scheduler interface:

```ts
generateSchedule(input: SchedulerInput): SchedulerOutput
```

Storage interface:

```ts
loadMealPlan(): MealPlan | null
saveMealPlan(plan: MealPlan): void
clearMealPlan(): void
```

## Dependencies

Planned runtime dependencies:

- Next.js
- React
- TypeScript
- Tailwind CSS
- lucide-react

UI component approach:

- Prefer simple local components styled with Tailwind for the MVP.
- Use shadcn/ui-compatible patterns if the scaffold supports it, but do not let shadcn setup block the prototype.

Testing dependencies:

- Use the test runner available in the chosen scaffold.
- If no runner is present after scaffold, add a minimal unit test setup for scheduler tests only after approval.

## Build And Test Commands

Expected after scaffold:

```text
npm run dev
npm run lint
npm test
```

If the scaffold exposes different commands, update this file and `test-report.md` with the actual commands.

## Key Decisions

- Implement Phase 0 local-first to reduce moving parts.
- Keep scheduler deterministic and heuristic-based.
- Store demo dish data in code.
- Keep cooking progression user-confirmed; timers do not auto-advance tasks.
- Use localStorage for current meal persistence only.

## Risks

- Timer behavior can become confusing if wall-clock time and scheduled offsets diverge.
- A simple scheduler may produce non-ideal but valid timelines.
- Browser tab throttling can affect countdown precision.
- Mojibake in the preview file could leak into UI if strings are copied directly.

## Alternatives Rejected

- Backend scheduler: unnecessary for Phase 0.
- Database-backed recipes: out of scope.
- AI recipe parsing: explicitly out of scope.
- Drag-and-drop timeline editing: useful later, too much scope now.
- Full Gantt chart: conflicts with guided cooking simplicity.
