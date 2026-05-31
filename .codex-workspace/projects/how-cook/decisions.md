# Decisions

## 2026-05-31

- Project state lives in `.codex-workspace/projects/how-cook/`.
- Phase 0 will focus on the meal timeline and guided cooking workflow.
- App name is `How Cook?`.
- The MVP will be local-first with no backend.
- The scheduler will be deterministic and heuristic-based.
- App strings and demo dish names should be written as valid UTF-8, not copied from the mojibake preview.
- Implementation uses local Tailwind-styled components instead of installing shadcn/ui to keep Phase 0 moving and avoid adding a component generator dependency.
- `npm run lint` is mapped to `tsc --noEmit` for strict type verification in this MVP scaffold.
- Vitest is used for scheduler unit tests.
