# Product Spec

Status: Implemented for Phase 0 on 2026-05-31.

## Problem

Normal recipe apps describe dishes one at a time. They do not answer the cook's urgent question during a multi-dish meal: what should I do right now so the whole meal finishes correctly?

## Target Users

- Home cooks preparing 2-4 dishes for one meal.
- Beginners who need sequencing help.
- Busy cooks who want hot dishes and passive waiting time coordinated.
- Phase 0 scenario: a Vietnamese-style home dinner with rice, a main dish, soup, and vegetables.

## Goals

- Let a user select 2-4 predefined dishes.
- Let a user configure simple kitchen resources.
- Generate a readable cooking timeline from structured dish tasks.
- Provide guided cooking mode with a current step, running passive timers, next steps, and basic actions.
- Persist the current meal locally so reloads do not lose progress.

## Non-Goals

- Recipe storage platform.
- Account system or cloud sync.
- Recipe import, AI parsing, social sharing, nutrition, shopping lists, or payments.
- Mathematically optimal scheduling.

## Core User Flows

1. User opens How Cook? and starts a meal.
2. User selects dishes from a predefined library.
3. User adjusts kitchen resources and planner mode.
4. App generates a timeline and warnings.
5. User reviews the plan and starts cooking.
6. Guided cooking mode shows the current task, passive timers, next steps, and controls.
7. User marks steps done, skips steps, delays pending work by 5 minutes, or resets demo state.

## MVP Scope

- Predefined dish library with at least 8 Vietnamese-style dishes.
- Dish selection UI with category filtering and selected count.
- Kitchen setup UI for people, stove burners, pots, pans, rice cooker, air fryer, oven, and knife board.
- Scheduler that respects dependencies and configured resources.
- Timeline review with task timing, dish, duration, type, resources, and warnings.
- Guided cooking mode with countdown for the current task and passive timers.
- Done, Skip, Delay 5 minutes, Pause, Regenerate, Load sample dinner, and Reset demo state actions.
- Local persistence for selected dishes, kitchen setup, generated schedule, and cooking progress.
- Responsive layout for desktop and mobile.
- Vietnamese-first user-facing UI copy for the main planning and cooking flow.
- Optimized browser-tab icon that remains legible at favicon size.

## Out of Scope

- Backend API.
- Database.
- Authentication.
- Cloud deployment automation.
- Drag-and-drop timeline editing.
- Browser notifications as a required path.
- Target finish time as required behavior.

## Assumptions

- App name is `How Cook?`.
- Project id is `how-cook`.
- Phase 0 is implemented as a webapp under the current workspace.
- The UI can be a compact single-page flow with internal view state for MVP speed.
- Demo data should use proper UTF-8 Vietnamese labels in app code.
- The provided preview is visual guidance, not production code.
- The full provided logo is appropriate for the header; the browser tab needs a simplified high-contrast mark.

## Open Questions

- None blocking for Phase 0. Future polish can decide whether `How Cook?` keeps the question mark in every UI location.

## Acceptance Criteria

- The app runs locally with a documented dev command.
- A user can select and unselect dishes, then generate a plan.
- The scheduler output is sorted by start time and respects dependencies.
- Resource limits affect scheduling, especially stove, pot, pan, rice cooker, and human capacity.
- Timeline review clearly distinguishes active and passive tasks.
- Guided cooking mode shows a current step countdown, running passive timers, and upcoming steps.
- Done advances cooking progress.
- Skip marks the current task skipped and advances.
- Delay 5 minutes shifts pending tasks while preserving done and running task timing.
- Reloading the page restores the current meal state from localStorage.
- A reset action clears demo state.
- Manual checks cover dish selection, kitchen changes, timeline generation, cooking actions, delay, skip, and reload persistence.
- Primary user-facing controls and labels are natural Vietnamese, including planning, timeline review, guided cooking, timer controls, sample load, and reset actions.
- The tab icon uses a transparent/high-contrast simplified mark instead of the full wordmark so it reads clearly in browser tabs.
