# Phase 0 QA Checklist

Use this checklist before sharing a new Phase 0 build.

## Setup

- Run `npm run lint`.
- Run `npm test`.
- Run `npm run build`.
- Start the app with `npm run dev`.
- Open `http://127.0.0.1:3000`.

## Dish Selection

- Confirm `Tạo lịch` is disabled with 0 selected dishes.
- Select 1 dish and confirm `Tạo lịch` is still disabled.
- Select 2 dishes and confirm `Tạo lịch` is enabled.
- Confirm selected cards are visually obvious.
- Confirm the selected-dish summary shows the chosen dishes.
- Change category filters and confirm selected dishes stay selected.

## Timeline Generation

- Select 2-4 dishes and click `Tạo lịch`.
- Confirm the timeline is non-empty.
- Confirm every item shows start time, task name, dish, duration, active/passive type, and resources.
- Confirm warning copy is understandable.
- Compare `1 bếp` and `2 bếp` duration feedback.
- Change stove count from 2 to 1, regenerate, and confirm schedule duration or warnings update.
- Click `Sao chép lịch` and paste the text elsewhere to confirm export readability.

## Cooking Mode

- Click `Bắt đầu nấu`.
- Confirm the app switches to `Đang nấu`.
- Confirm the current active step is prominent.
- Confirm the current countdown decreases.
- Confirm passive tasks appear under running timers when their scheduled time is active.
- Confirm next steps show upcoming active work.
- Click `Tạm dừng` and confirm the countdown stops.
- Click `Tiếp tục` and confirm the countdown resumes.
- Click `Hoàn tất` and confirm the current step is marked done.
- Click `Bỏ qua` and confirm the current step is skipped.
- Click `Dời 5 phút` while waiting and confirm pending tasks shift without moving completed/running tasks.

## Persistence

- Generate a schedule, reload, and confirm selected dishes and timeline are restored.
- Start cooking, reload, and confirm cooking state is restored safely.
- Pause cooking, reload, and confirm paused state is preserved.
- Click reset/refresh and confirm local demo state clears.

## Responsive

- Check desktop width around 1440px.
- Check mobile width around 390px.
- Confirm buttons do not overlap or clip.
- Confirm timeline cards and cooking controls remain readable.
