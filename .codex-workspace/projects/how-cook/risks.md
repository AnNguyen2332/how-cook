# Risks

## Product Risks

- The generated schedule may be valid but still feel unintuitive to a real cook.
- Guided cooking can become noisy if too many future tasks are shown.
- A prototype dish library may not cover enough real dinner patterns to validate usefulness.

## Technical Risks

- Dependency installation may require network access.
- Timer precision can drift when the browser tab is inactive.
- localStorage can contain stale or malformed data.
- The preview file contains mojibake text, so copying strings directly would degrade the UI.
- `npm audit --audit-level=high` reports no high/critical issues, but npm reports 2 moderate advisories from Next's transitive PostCSS dependency with no fix currently available.

## Mitigations

- Keep timeline review transparent and editable through regenerate/reset in Phase 0.
- Show only Now, Running timers, and Next in cooking mode.
- Add defensive storage parsing.
- Type all scheduler inputs and outputs.
- Keep dependency updates under review when Next releases a PostCSS advisory fix.
