# Tasks

Status: Implemented on 2026-05-31.

## HC-001 - Scaffold Webapp

Objective: Create the Next.js TypeScript/Tailwind app foundation for How Cook?.

Scope: Initialize app files, package metadata, Tailwind setup, base layout, and home page shell.

Affected files:

- `package.json`
- `next.config.*`
- `tsconfig.json`
- `tailwind.config.*`
- `postcss.config.*`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

Dependencies: None.

Acceptance criteria:

- App starts locally.
- Tailwind classes render.
- First screen shows the How Cook? app shell.

Verification:

- `npm run dev`
- `npm run lint`

Risk level: Medium, because dependencies may need network installation.

## HC-002 - Domain Types And Demo Dishes

Objective: Define strongly typed domain models and a demo Vietnamese-style dish library.

Scope: Add core TypeScript types and at least 8 demo dishes with stable IDs and task dependencies.

Affected files:

- `src/types/domain.ts`
- `src/data/demoDishes.ts`

Dependencies: HC-001.

Acceptance criteria:

- No `any` for core domain objects.
- Every dish has stable unique IDs.
- Every task has duration, type, resources, and dependencies.
- Demo labels use readable UTF-8 Vietnamese text.

Verification:

- TypeScript compile via `npm run lint` or scaffold equivalent.

Risk level: Low.

## HC-003 - Scheduler Library

Objective: Generate valid cooking timelines from selected dishes and kitchen resources.

Scope: Implement flattening, dependency ordering, priority sorting, resource availability checks, serve-immediately adjustment, and warnings.

Affected files:

- `src/lib/scheduler/generateSchedule.ts`
- `src/lib/scheduler/priority.ts`
- `src/lib/scheduler/resource.ts`
- `src/lib/scheduler/warnings.ts`

Dependencies: HC-002.

Acceptance criteria:

- Multiple dishes can be scheduled together.
- Dependencies are respected.
- Resource limits are respected.
- Output is sorted by start minute.
- Warnings are returned for notable constraints or impossible schedules.

Verification:

- Scheduler unit tests if a runner is available.
- Manual log or UI generation check if a runner is not yet available.

Risk level: Medium.

## HC-004 - Meal Planning UI

Objective: Let the user select dishes and configure kitchen resources.

Scope: Dish cards, category filters, selected count, continue/generate action, resource controls, and planner mode controls.

Affected files:

- `src/components/dishes/DishCard.tsx`
- `src/components/dishes/DishSelector.tsx`
- `src/components/kitchen/KitchenSetupForm.tsx`
- `src/components/kitchen/ResourceControl.tsx`
- `src/app/page.tsx`

Dependencies: HC-001, HC-002, HC-003.

Acceptance criteria:

- User can select/unselect dishes.
- Continue/generate is disabled when no dishes are selected.
- Default kitchen setup is prefilled.
- Resource changes affect generated output.

Verification:

- Manual browser check.
- `npm run lint`.

Risk level: Low.

## HC-005 - Timeline Review UI

Objective: Show the generated cooking plan before cooking starts.

Scope: Timeline list, active/passive badges, dish names, resources, durations, warnings, regenerate, and start cooking.

Affected files:

- `src/components/timeline/TimelineView.tsx`
- `src/components/timeline/TimelineItem.tsx`
- `src/components/timeline/TimelineWarningPanel.tsx`
- `src/app/page.tsx`

Dependencies: HC-003, HC-004.

Acceptance criteria:

- Timeline items appear in start order.
- Each item shows start minute, task, dish, duration, type, and resources.
- Warnings are visible.
- Start Cooking switches to guided mode.

Verification:

- Manual browser check.
- `npm run lint`.

Risk level: Low.

## HC-006 - Guided Cooking Mode

Objective: Guide the cook step by step with timers and controls.

Scope: Current step countdown, passive running timers, upcoming steps, Done, Skip, Pause, and Delay 5 minutes.

Affected files:

- `src/components/cooking/CookingMode.tsx`
- `src/components/cooking/CurrentStepCard.tsx`
- `src/components/cooking/RunningTimers.tsx`
- `src/components/cooking/NextSteps.tsx`
- `src/components/cooking/CookingControls.tsx`
- `src/app/page.tsx`

Dependencies: HC-005.

Acceptance criteria:

- Current task is prominent.
- Countdown displays remaining time.
- Passive running timers are shown.
- Next 2-3 pending tasks are shown.
- Done advances to the next task.
- Skip marks the task skipped and advances.
- Delay 5 minutes shifts pending tasks only.

Verification:

- Manual browser check.
- `npm run lint`.

Risk level: Medium.

## HC-007 - Local Persistence

Objective: Preserve current meal state across reloads.

Scope: Save selected dishes, kitchen setup, schedule, cooking status, and current mode to localStorage.

Affected files:

- `src/lib/storage/mealStorage.ts`
- `src/app/page.tsx`

Dependencies: HC-004, HC-005, HC-006.

Acceptance criteria:

- Reload restores the current meal.
- Reset clears local saved state.
- Bad or old storage data fails safely.

Verification:

- Manual reload check.
- `npm run lint`.

Risk level: Low.

## HC-008 - Responsive Polish And Verification

Objective: Make the MVP pleasant on desktop and mobile and document validation.

Scope: Layout refinement, accessible labels, empty states, error/warning states, and test report.

Affected files:

- `src/app/page.tsx`
- Component CSS/classes as needed
- `.codex-workspace/projects/how-cook/test-report.md`
- `.codex-workspace/projects/how-cook/handoff.md`

Dependencies: HC-001 through HC-007.

Acceptance criteria:

- Desktop uses a clear planning/sidebar + main content layout where appropriate.
- Mobile is single-column with tappable actions.
- No obvious overflow or clipped primary controls.
- Verification results are recorded.

Verification:

- `npm run lint`
- `npm test` if available
- Manual desktop and mobile-width browser checks

Risk level: Low.

## Completion Log

Completed on 2026-05-31:

- HC-001 scaffolded a Next.js, TypeScript, Tailwind app for How Cook?.
- HC-002 added strongly typed domain objects and 10 Vietnamese-style demo dishes.
- HC-003 implemented the heuristic scheduler, resource checks, warning generation, and unit tests.
- HC-004 built dish selection and kitchen setup controls.
- HC-005 built timeline review, warnings, regenerate, and start cooking.
- HC-006 built guided cooking mode with current step, countdown, passive timers, next steps, Done, Skip, Pause, and Delay 5 minutes.
- HC-007 added localStorage persistence and reset behavior.
- HC-008 added responsive layout, build/test verification, and handoff notes.

Verification summary:

- `npm run lint` passed.
- `npm test` passed with 5 scheduler tests.
- `npm run build` passed.
- `npm audit --audit-level=high` passed with no high/critical findings; npm still reports 2 moderate advisories in Next's transitive PostCSS dependency. The available forced fix would downgrade Next, so it was not applied.
- Dev server returned HTTP 200 at `http://127.0.0.1:3000`.

Design update on 2026-05-31:

- Reworked the UI/UX to match the provided preview more closely.
- Moved Timeline / Cooking Mode tabs into the header action area.
- Rebuilt sidebar cards for meal selection and kitchen setup with preview-style spacing, summary tiles, and aligned controls.
- Reworked timeline rows and cooking mode panels so buttons, badges, and tabs align consistently on desktop and mobile.
- Disabled Next dev indicators for cleaner visual QA.

Logo update on 2026-05-31:

- Processed `logo.png` into transparent, cropped project assets:
  - `public/how-cook-logo.png`
  - `public/how-cook-logo-mark.png`
- Replaced the text header logo with the transparent image logo.
- Updated metadata icons to use the logo mark.
- Replaced the old generated SVG icon with an optimized simplified `src/app/icon.svg` favicon.
- Cleaned stale `.next` output after icon route changes.
- Verified both generated PNG assets have transparent corners (`alpha=0`) and are served by the dev server.
- Reran `npm run lint`, `npm test`, `npm run build`, and `npm audit --audit-level=high` successfully after the logo update.
- Captured current Playwright screenshot at `output/playwright/how-cook-current-status-fixed.png`.

Vietnamese UI and tab icon update on 2026-05-31:

- Localized the main user-facing navigation, actions, empty states, warnings, timeline labels, and cooking controls to natural Vietnamese.
- Kept internal TypeScript identifiers in English where they are implementation details.
- Updated app metadata title and description to Vietnamese.
- Added `src/app/icon.svg` as a simplified high-contrast favicon with transparent background so it reads better in browser tabs than the full wordmark.
- Verified `http://127.0.0.1:3000/icon.svg` returns HTTP 200.
- Reran `npm run lint`, `npm test`, `npm run build`, and `npm audit --audit-level=high` successfully.
- Captured updated Playwright screenshot at `output/playwright/how-cook-vietnamese-ui-favicon.png`.

UI/UX interaction QA and fixes on 2026-05-31:

- Tested the current webapp with Playwright across sample meal loading, timeline start, pause/resume, done, delay, waiting state, reload persistence, and desktop/mobile visual QA.
- Fixed remaining mixed-language UI copy: `Đang pause`, `active task`, and `burner`.
- Fixed guided cooking behavior so completing a step early no longer promotes a future scheduled task as the active current step.
- Added a waiting state for cooking mode when the next active task has not reached its scheduled start time.
- Kept passive tasks in the running-timers panel instead of treating them as the main active step.
- Kept `Dời 5 phút` available during waiting while disabling `Bỏ qua` and `Hoàn tất` until an active step is ready.
- Wrapped dish category tabs so labels are not clipped in the sidebar.
- Added `src/lib/cooking/progress.ts` and `src/test/cookingProgress.test.ts`.
- Reran `npm run lint`, `npm test`, `npm run build`, and `npm audit --audit-level=high`.
- Captured Playwright screenshots:
  - `output/playwright/how-cook-ui-ux-desktop-after-fix.png`
  - `output/playwright/how-cook-ui-ux-mobile-after-fix.png`

Phase 0 improvement pass on 2026-05-31:

## HC-009 - Phase 0 Code Audit

Objective: Map `Phase0_Improvement.md` against the current implementation.

Scope: Inspect scheduler, timeline, cooking mode, persistence, tests, and UX states.

Affected files:

- `PHASE0_CODE_AUDIT.md`
- `.codex-workspace/projects/how-cook/tasks.md`

Dependencies: Completed Phase 0 implementation.

Acceptance criteria:

- Current implementation is mapped to the improvement plan.
- Remaining gaps are separated from already implemented items.

Verification:

- Manual code inspection.

Risk level: Low.

Status: Completed.

## HC-010 - Selection, Timeline Export, And Resource Feedback

Objective: Improve visible testability and sharing of the Phase 0 timeline.

Scope: Require 2+ dishes for schedule generation, add selected-dish summary, show active/passive duration on dish cards, add plain-text timeline export, and show 1-stove vs 2-stove duration comparison.

Affected files:

- `src/app/page.tsx`
- `src/components/dishes/DishCard.tsx`
- `src/components/dishes/DishSelector.tsx`
- `src/components/timeline/TimelineView.tsx`
- `src/lib/export/timelineText.ts`
- `src/lib/scheduler/warnings.ts`

Dependencies: HC-003 through HC-007.

Acceptance criteria:

- `Tạo lịch` is disabled until at least 2 dishes are selected.
- Selected dishes are summarized in the selector.
- Dish cards expose active and passive duration.
- Timeline can be copied as readable plain text.
- Timeline review shows visible duration impact for 1 vs 2 stove burners.
- Resource warnings use user-facing Vietnamese labels.

Verification:

- `npm run lint`
- `npm test`
- `npm run build`
- Browser smoke check.

Risk level: Low.

Status: Completed.

## HC-011 - Strengthen Phase 0 Tests And QA Checklist

Objective: Cover the remaining scheduler and cooking-delay acceptance criteria from the improvement plan.

Scope: Add tests for multi-dish scheduling, one-cook active-task conflicts, planner mode differences, delay behavior, and timeline text export. Add a manual QA checklist.

Affected files:

- `src/test/scheduler.test.ts`
- `src/test/cookingProgress.test.ts`
- `src/test/timelineText.test.ts`
- `src/lib/cooking/progress.ts`
- `QA_PHASE0.md`

Dependencies: HC-010.

Acceptance criteria:

- Scheduler tests include 8 cases.
- Cooking delay shifts pending tasks only.
- Timeline text export is deterministic and ordered.
- Manual QA checklist covers selection, generation, cooking, persistence, and responsive layout.

Verification:

- `npm test`

Risk level: Low.

Status: Completed.
