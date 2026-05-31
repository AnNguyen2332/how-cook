# Test Report

Status: Completed on 2026-05-31.

## Commands Run

```text
npm install
```

Result: Passed after sandbox escalation, installed 189 packages. Npm reported 2 moderate advisories.

```text
npm run lint
```

Result: Passed. This runs `tsc --noEmit`.

```text
npm test
```

Result: Passed after sandbox escalation for Vitest/esbuild worker spawn. 1 test file, 5 tests passed.

```text
npm run build
```

Result: Passed after sandbox escalation for Next.js worker spawn. Route `/` built successfully.

```text
npx --yes --package @playwright/cli playwright-cli screenshot --filename output/playwright/how-cook-timeline-redesign-final.png --full-page
```

Result: Passed. Captured desktop timeline screenshot after UI redesign.

```text
npx --yes --package @playwright/cli playwright-cli screenshot --filename output/playwright/how-cook-mobile-redesign-final.png --full-page
```

Result: Passed. Captured mobile screenshot after UI redesign.

```text
npx --yes --package @playwright/cli playwright-cli screenshot --filename output/playwright/how-cook-cooking-redesign-final.png --full-page
```

Result: Passed. Captured desktop cooking mode screenshot after UI redesign.

```text
npm audit --audit-level=high
```

Result: Passed with no high/critical advisories. Npm still reports 2 moderate PostCSS advisories through Next. The available forced fix would downgrade Next, so it was not applied.

```text
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000
```

Result: HTTP 200 from the running dev server.

## Acceptance Criteria Check

- App runs locally: passed at `http://127.0.0.1:3000`.
- Tailwind renders: build compiled Tailwind classes successfully.
- Strong domain typing: passed TypeScript check.
- Demo data: 10 dishes with stable IDs and structured tasks.
- Scheduler respects dependencies/resources: covered by unit tests.
- Timeline review: implemented and build-verified.
- Guided cooking actions: implemented and build-verified.
- Persistence: implemented with localStorage and reset behavior.
- Responsive layout: implemented with mobile-first Tailwind grids; manual visual testing is still recommended.
- Preview-style alignment: Playwright screenshots captured for timeline desktop, timeline mobile, and cooking desktop.

## Logo Update Verification

```text
npm run lint
```

Result: Passed after replacing the header text logo with the transparent image logo.

```text
Alpha validation for public/how-cook-logo.png and public/how-cook-logo-mark.png
```

Result: Passed. Both assets reported transparent corner alpha values of `0,0,0,0`.

```text
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/how-cook-logo.png
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/how-cook-logo-mark.png
```

Result: Both returned HTTP 200.

## Current Status Verification

Run after icon route changes and logo update.

```text
npm run lint
```

Result: Passed.

```text
npm test
```

Result: Passed. 1 test file, 5 scheduler tests.

```text
npm run build
```

Result: Passed. Production build completed after the logo update.

```text
npm audit --audit-level=high
```

Result: Passed with no high/critical advisories. Npm still reports 2 moderate PostCSS advisories through Next; the suggested `npm audit fix --force` would downgrade Next to `9.3.3`, so it was not applied.

```text
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/how-cook-logo.png
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/how-cook-logo-mark.png
```

Result: All returned HTTP 200.

```text
npx --yes --package @playwright/cli playwright-cli screenshot --filename output/playwright/how-cook-current-status-fixed.png --full-page
```

Result: Passed. Header logo is transparent, and header tabs/buttons no longer wrap on desktop.

## Vietnamese UI And Favicon Verification

```text
npm run lint
```

Result: Passed.

```text
npm test
```

Result: Passed. 1 test file, 5 scheduler tests.

```text
npm run build
```

Result: Passed. Production build includes `/icon.svg`.

```text
npm audit --audit-level=high
```

Result: Passed with no high/critical advisories. Npm still reports 2 moderate PostCSS advisories through Next; the suggested `npm audit fix --force` would downgrade Next to `9.3.3`, so it was not applied.

```text
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/icon.svg
```

Result: Both returned HTTP 200.

```text
npx --yes --package @playwright/cli playwright-cli screenshot --filename output/playwright/how-cook-vietnamese-ui-favicon.png --full-page
```

Result: Passed. Main UI copy is Vietnamese and the app exposes a simplified transparent favicon for the browser tab.

## Dev Server Restart After Production Build

```text
Stop-Process -Id 20192 -Force
Start-Process -FilePath "cmd.exe" -ArgumentList "/c","npm run dev -- --hostname 127.0.0.1" -WorkingDirectory "c:\Users\NguyenAn\Desktop\Coding\HowCook" -WindowStyle Hidden
```

Result: Passed. Dev server restarted on port 3000 with PID `20784`.

```text
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/icon.svg
```

Result: Both returned HTTP 200 after restart.

## UI/UX Interaction QA After Fixes

```text
npm run lint
```

Result: Passed.

```text
npm test
```

Result: Passed. 2 test files, 8 tests.

```text
npm run build
```

Result: Passed. Production build completed and includes `/icon.svg`.

```text
npm audit --audit-level=high
```

Result: Passed with no high/critical advisories. Npm still reports 2 moderate PostCSS advisories through Next; the suggested `npm audit fix --force` would downgrade Next to `9.3.3`, so it was not applied.

```text
npx --yes --package @playwright/cli playwright-cli -s=howcook open http://127.0.0.1:3000
npx --yes --package @playwright/cli playwright-cli -s=howcook snapshot
npx --yes --package @playwright/cli playwright-cli -s=howcook click <Bữa mẫu ref>
npx --yes --package @playwright/cli playwright-cli -s=howcook click <Bắt đầu nấu ref>
npx --yes --package @playwright/cli playwright-cli -s=howcook click <Tạm dừng ref>
npx --yes --package @playwright/cli playwright-cli -s=howcook click <Tiếp tục ref>
npx --yes --package @playwright/cli playwright-cli -s=howcook click <Hoàn tất ref>
npx --yes --package @playwright/cli playwright-cli -s=howcook click <Dời 5 phút ref>
npx --yes --package @playwright/cli playwright-cli -s=howcook reload
```

Result: Passed. Sample meal loads, cooking starts, pause/resume works, completing a step now enters a waiting state instead of promoting future work, delay shifts pending tasks while waiting, and reload restores the meal state.

```text
npx --yes --package @playwright/cli playwright-cli -s=howcook resize 390 844
npx --yes --package @playwright/cli playwright-cli -s=howcook screenshot --filename output/playwright/how-cook-ui-ux-mobile-after-fix.png --full-page
npx --yes --package @playwright/cli playwright-cli -s=howcook resize 1440 1000
npx --yes --package @playwright/cli playwright-cli -s=howcook screenshot --filename output/playwright/how-cook-ui-ux-desktop-after-fix.png --full-page
npx --yes --package @playwright/cli playwright-cli -s=howcook console error
```

Result: Passed. Mobile and desktop screenshots captured. Browser console check returned 0 error messages.

```text
Stop-Process -Id 20784 -Force
Start-Process -FilePath "cmd.exe" -ArgumentList "/c","npm run dev -- --hostname 127.0.0.1" -WorkingDirectory "c:\Users\NguyenAn\Desktop\Coding\HowCook" -WindowStyle Hidden
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:3000/icon.svg
```

Result: Passed. Dev server restarted on port 3000 with PID `20360`; `/` and `/icon.svg` both returned HTTP 200.

## Manual Validation Plan

1. Open `http://127.0.0.1:3000`.
2. Click `Bữa mẫu`.
3. Confirm the timeline shows `Cơm trắng`, `Thịt kho trứng`, `Canh chua`, and `Rau luộc`.
4. Change stove count from 2 to 1, click `Tạo lại`, and confirm warnings/resource spacing update.
5. Click `Bắt đầu nấu`.
6. Confirm the current timer counts down and passive timers appear when scheduled time is active.
7. Click `Hoàn tất`, `Bỏ qua`, `Dời 5 phút`, and `Tạm dừng` / `Tiếp tục`.
8. Reload the page and confirm the meal plan is restored.
9. Click `Làm mới` and confirm local state clears.

## Phase 0 Improvement Verification

Run after implementing `Phase0_Improvement.md` stabilization items.

```text
npm run lint
```

Result: Passed. TypeScript completed with no errors.

```text
npm test
```

Result: Passed. 3 test files, 13 tests.

Coverage added:

- Scheduler multi-dish output.
- One-cook active task conflict prevention.
- Planner mode output differences.
- Delay pending tasks only.
- Plain-text timeline export ordering.

```text
npm run build
```

Result: Passed. Production build completed. Route `/` built successfully.

```text
npx --yes --package @playwright/cli playwright-cli -s=phase0 open http://127.0.0.1:3000
npx --yes --package @playwright/cli playwright-cli -s=phase0 snapshot
npx --yes --package @playwright/cli playwright-cli -s=phase0 click <Bữa mẫu ref>
npx --yes --package @playwright/cli playwright-cli -s=phase0 click <Sao chép lịch ref>
npx --yes --package @playwright/cli playwright-cli -s=phase0 click "text=Bắt đầu nấu"
npx --yes --package @playwright/cli playwright-cli -s=phase0 console error
```

Result: Passed. Browser smoke check confirmed the 2-dish disabled state, selected summary, active/passive dish badges, resource-duration comparison, timeline export button, cooking mode entry, and 0 browser console errors.

```text
npx --yes --package @playwright/cli playwright-cli -s=phase0 screenshot --filename output/playwright/how-cook-phase0-improvements-desktop.png --full-page
npx --yes --package @playwright/cli playwright-cli -s=phase0 screenshot --filename output/playwright/how-cook-phase0-improvements-mobile.png --full-page
```

Result: Passed. Desktop and mobile screenshots captured for the Phase 0 improvement pass.
