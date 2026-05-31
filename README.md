# How Cook?

How Cook? is a local-first web prototype for planning and guiding a multi-dish home meal. It helps a cook select several dishes, configure kitchen resources, generate a resource-aware timeline, and follow the plan in guided cooking mode.

Current public build: https://how-cook.vercel.app

## Phase 0 Scope

- Vietnamese-style demo dish library.
- Dish selection with category filters and selected-dish summary.
- Kitchen resource setup for cooks, stove burners, pots, pans, rice cooker, air fryer, oven, and knife board.
- Heuristic scheduler that respects dependencies and resource constraints.
- Timeline review with active/passive badges, resources, warnings, and duration comparison for 1 vs 2 stove burners.
- Plain-text timeline export through clipboard.
- Guided cooking mode with current step, passive running timers, next steps, Done, Skip, Delay 5 minutes, and Pause/Resume.
- Local persistence through browser localStorage.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vitest

## Development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Verification

```bash
npm run lint
npm test
npm run build
```

Current Phase 0 improvement verification:

- `npm run lint`: passed.
- `npm test`: passed, 3 test files and 13 tests.
- `npm run build`: passed.
- Playwright CLI smoke check: passed with 0 browser console errors.

## Project Docs

- `Phase0_Improvement.md`: public-release improvement review.
- `PHASE0_CODE_AUDIT.md`: code audit against the improvement review.
- `QA_PHASE0.md`: manual QA checklist.
- `.codex-workspace/projects/how-cook/`: product workflow state, spec, tasks, review, test report, and handoff notes.

## Known Limits

- Scheduler is deterministic and resource-aware, but heuristic rather than optimal.
- Clipboard export depends on browser clipboard permission.
- There is no backend, account system, recipe import, cloud sync, or database in Phase 0.
