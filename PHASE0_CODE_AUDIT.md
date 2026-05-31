# Phase 0 Code Audit

Date: 2026-05-31
Source reviewed: `Phase0_Improvement.md`

## Summary

The current codebase already implements the core Phase 0 cooking loop:

- Structured Vietnamese dish library with dependencies, resources, and active/passive tasks.
- Resource-aware scheduler with deterministic output, warnings, and hot-dish adjustment.
- Timeline review cards with timing, dish, duration, type, status, resources, and warnings.
- Guided cooking mode with current step, passive timers, next steps, Done, Skip, Delay, and Pause.
- Local persistence through `localStorage`.
- Unit tests for scheduler and cooking-progress helpers.

The improvement plan is directionally correct, but several P0 items listed as "not verified" were already present in the code. The remaining high-value stabilization work is mostly UX clarity, visible testability, and documentation.

## Existing Implementation Map

| Improvement area | Current code | Status |
|---|---|---|
| Dish library | `src/data/demoDishes.ts` | Implemented |
| Kitchen setup | `src/components/kitchen/*` | Implemented |
| Scheduler | `src/lib/scheduler/*` | Implemented |
| Timeline review | `src/components/timeline/*` | Implemented |
| Guided cooking | `src/components/cooking/*`, `src/lib/cooking/progress.ts` | Implemented |
| Local persistence | `src/lib/storage/mealStorage.ts`, `src/app/page.tsx` | Implemented |
| Scheduler tests | `src/test/scheduler.test.ts` | Strengthened |
| Delay behavior tests | `src/test/cookingProgress.test.ts` | Added |
| Plain-text export | `src/lib/export/timelineText.ts` | Added |

## Changes Made From This Audit

- Require at least 2 selected dishes before generating a schedule.
- Add a selected-dish summary and clearer helper text in the dish selector.
- Add active/passive duration badges to dish cards.
- Add a plain-text timeline export button.
- Add a visible 1-stove vs 2-stove duration comparison.
- Fix resource warning copy so it says `bếp`, `nồi`, and `chảo` instead of internal resource keys.
- Extract delay behavior into a testable helper.
- Expand scheduler and cooking-progress test coverage.
- Add `QA_PHASE0.md` for repeatable manual validation.

## Remaining Risks

- Scheduler is valid and deterministic, but still heuristic rather than optimal.
- Clipboard export depends on browser clipboard permissions.
- Browser notifications and target finish time remain out of scope.
- Full browser automation tests are still manual/CLI-driven rather than committed as Playwright test specs.
