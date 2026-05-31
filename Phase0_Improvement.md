# How Cook? — Phase 0 Improvement Plan

Checked release: https://how-cook.vercel.app/  
Review date: 2026-05-31  
Baseline: original Phase 0 plan for the webapp prototype

---

## 1. Executive Summary

The current Phase 0 release already covers the main product framing and a large part of the planned prototype UI:

- Product positioning is clear: multi-dish cooking assistant, not a generic recipe app.
- The app has a dish library with Vietnamese-style dishes.
- The app has kitchen resource setup.
- The app has scheduling modes.
- The app has a timeline area and a cooking-mode entry point.
- The app has a visual identity and a suitable product name: **How Cook?**

However, Phase 0 is not yet complete from a product-validation perspective. The most important missing or not-yet-verifiable parts are:

1. The generated schedule behavior needs stronger validation.
2. Guided Cooking Mode needs to fully support the real cooking loop: current step, running passive timers, next steps, done, skip, delay, pause.
3. Timer behavior needs to be reliable and explicit.
4. Local persistence needs to be verified or implemented.
5. The schedule output needs to better prove that it is resource-aware and dependency-aware.
6. The app needs clearer empty states, disabled states, and feedback states.
7. The app needs basic automated tests for the scheduler.

Phase 0 should be considered **functionally promising but not yet validated as a complete guided cooking prototype**.

---

## 2. What Is Already Implemented or Visibly Present

Based on the current public release, these items appear to be implemented or at least represented in the UI.

### 2.1 Product Identity

Visible:

- App name: **How Cook?**
- Tagline: **Tối ưu quy trình nấu nhiều món**
- Value proposition: choose multiple dishes, configure kitchen tools, generate a cooking schedule, and follow step-by-step cooking with countdown timers.

Status: **Implemented**

Notes:

- The positioning is aligned with the original Phase 0 concept.
- The name is more consumer-friendly than the working name `Meal Flow Planner`.
- The product now feels more like a cooking assistant than a planning tool.

---

### 2.2 Main Navigation / Modes

Visible:

- `Lịch nấu`
- `Đang nấu`

Status: **Partially implemented / visible**

Notes:

- The intended two-mode structure exists.
- Need to verify whether `Đang nấu` contains a complete guided cooking flow after a schedule is generated and started.

---

### 2.3 Dish Library

Visible dishes:

1. Cơm trắng
2. Thịt kho trứng
3. Canh chua
4. Rau luộc
5. Trứng chiên
6. Cá chiên
7. Đậu hũ sốt cà
8. Rau muống xào tỏi
9. Gà kho gừng
10. Canh bí đỏ

Status: **Implemented**

Matches original Phase 0 plan:

- The original plan requested 8–10 predefined Vietnamese-style dishes.
- The current release has 10 dishes, which is enough for Phase 0.

Improvement opportunities:

- Add category badges with stronger visual hierarchy.
- Add estimated active/passive split, not only total duration.
- Add small resource icons: stove, pan, pot, rice cooker, knife/board.

---

### 2.4 Dish Filtering

Visible filters:

- Tất cả
- Cơm
- Món chính
- Canh
- Rau
- Món phụ

Status: **Implemented**

Notes:

- This was not strictly required in Phase 0, but it improves usability.
- It should be retained.

---

### 2.5 Kitchen Setup

Visible resources:

- Người nấu
- Bếp
- Nồi
- Chảo
- Dao/thớt
- Nồi cơm
- Nồi chiên
- Lò nướng

Visible summary:

- Bếp: 2
- Nồi cơm: Có
- Người nấu: 1
- Chế độ: Ít áp lực

Status: **Implemented / strongly aligned**

Matches original Phase 0 plan:

- Number of people cooking
- Number of stove burners
- Pots
- Pans
- Rice cooker
- Air fryer
- Oven

Additional good point:

- `Dao/thớt` exists as a resource. This is useful because prep tasks can conflict if only one person and one cutting station are available.

---

### 2.6 Planner Mode

Visible modes:

- Nhanh nhất
- Xong cùng lúc
- Ít áp lực

Status: **Implemented in UI**

Need to verify:

- Whether changing the mode actually changes task priority and schedule output.
- Whether `Ít áp lực` reduces active-task density.
- Whether `Xong cùng lúc` moves hot/serve-immediately dishes closer to the end.

---

### 2.7 Timeline Area

Visible:

- `Lịch nấu được đề xuất`
- Empty state: `Chọn món để tạo lịch nấu.`
- Buttons: `Tạo lại`, `Bắt đầu nấu`
- Warning/feedback message: `Lịch nấu hiện không có cảnh báo lớn...`

Status: **Partially implemented / visible**

Notes:

- Timeline container exists.
- Empty state exists.
- Regenerate and start actions exist.
- Need to verify generated timeline quality after dish selection.

---

## 3. Gaps Compared With Original Phase 0 Plan

### 3.1 Must-have Feature Checklist

| Original Phase 0 Item | Current Status | Priority | Notes |
|---|---:|---:|---|
| Predefined dish library | Done | P0 | 10 dishes visible. |
| Dish selection screen | Visible / likely done | P0 | Need stronger selected state and selected count validation. |
| Kitchen resource setup | Done in UI | P0 | Need verify scheduler respects resources. |
| Cooking timeline generator | Partially verified | P0 | Timeline area visible, but generated behavior needs testing. |
| Timeline review screen | Partially done | P0 | Needs stronger task details, active/passive badges, resources, warnings. |
| Guided cooking mode | Not fully verified | P0 | Need validate current step, timers, running timers, next steps. |
| Step timer | Not fully verified | P0 | Need visible countdown behavior and zero-time handling. |
| Running passive timers | Not fully verified | P0 | Critical for product value. |
| Done / Skip / Delay 5 min | Not verified | P0 | Required for cooking reality. |
| Local persistence | Not verified | P1 for Phase 0 stabilization | Reload persistence should be checked or implemented. |

---

## 4. Highest Priority Improvements

## P0-1 — Make Schedule Generation Clearly Testable

### Problem

The UI has the right structure, but users and developers need to see that the generated timeline is actually based on:

- dependencies
- resources
- active/passive task types
- planner mode
- selected dishes

### Required behavior

When the user selects multiple dishes and clicks `Tạo lịch`, the app should show a concrete timeline like:

```text
00:00  Vo gạo — Cơm trắng — Active — 5 phút
00:05  Cắm cơm — Cơm trắng — Passive — 30 phút
00:05  Sơ chế thịt — Thịt kho trứng — Active — 10 phút
00:15  Ướp thịt — Thịt kho trứng — Passive — 20 phút
00:20  Sơ chế nguyên liệu canh — Canh chua — Active — 10 phút
...
```

Each timeline item should show:

- start time or relative minute
- task name
- dish name
- duration
- active/passive badge
- resource requirements
- status: pending/running/done/skipped, once cooking starts

### Acceptance criteria

- Selecting 2+ dishes produces a non-empty timeline.
- Timeline order respects `dependsOn`.
- The app does not schedule two active tasks at the same time when `Người nấu = 1`.
- The app does not schedule two stove tasks at the same time when `Bếp = 1`.
- A passive task can overlap an active task if resources allow.
- The same selected dishes generate different schedules when switching from `Nhanh nhất` to `Ít áp lực` or `Xong cùng lúc`.

---

## P0-2 — Improve Timeline Review UI

### Problem

The timeline area currently appears to be structurally present, but Phase 0 needs a review screen that proves the planner is useful before the user starts cooking.

### Required UI

For each scheduled task, display:

```text
[00:05] Sơ chế thịt
Thịt kho trứng · 10 phút · Active
Resources: người nấu, dao/thớt
```

Recommended badges:

- Active
- Passive
- Hot dish
- Can start early
- Uses stove
- Uses rice cooker

### Add warning panel

Example warnings:

```text
- Chỉ có 1 bếp, timeline đã dời món canh sau món kho.
- Rau luộc nên làm sát giờ ăn để tránh nguội.
- Có 3 active steps liên tiếp, có thể hơi áp lực.
```

### Acceptance criteria

- Timeline can be understood without opening recipe details.
- User can identify which tasks are active and passive.
- User can see why a resource-constrained schedule is longer.
- Empty state and generated state are visually distinct.

---

## P0-3 — Complete Guided Cooking Mode

### Problem

The original Phase 0 value is not just generating a schedule. The core experience is:

```text
What should I do right now?
What is already running?
What comes next?
```

### Required layout

Guided Cooking Mode should show:

```text
Current step
- Task name
- Dish name
- Duration countdown
- Short instruction

Running timers
- Passive tasks currently running
- Remaining time

Next steps
- Next 2–3 tasks

Controls
- Done
- Skip
- Delay 5 minutes
- Pause / Resume
```

### Acceptance criteria

- Clicking `Bắt đầu nấu` moves the app into `Đang nấu` mode.
- The current task is prominent.
- Countdown starts only after the user starts cooking.
- Passive running tasks are shown separately from the current active task.
- The app does not auto-advance without user confirmation.
- `Done` moves to the next task.
- `Skip` marks current task skipped.
- `Delay 5 phút` shifts pending tasks.
- `Pause` stops the current countdown.

---

## P0-4 — Add Reliable Timer State Management

### Problem

Cooking timers must be reliable. If the app loses timer state on tab switch or reload, users lose trust.

### Required behavior

Use timestamp-based timers instead of only decrementing state every second.

Recommended approach:

```ts
remainingSeconds = scheduledEndTimestamp - Date.now();
```

Store:

```ts
cookingSession: {
  startedAt: string;
  pausedAt?: string;
  totalPausedMs: number;
  currentTaskId: string;
  taskStatusMap: Record<string, "pending" | "running" | "done" | "skipped">;
}
```

### Acceptance criteria

- Timer remains correct after switching tabs.
- Timer remains correct after short reload if local persistence is enabled.
- Timer can be paused and resumed.
- Completed tasks remain completed.

---

## P0-5 — Implement or Verify Local Persistence

### Problem

The original plan required localStorage persistence. This is important even for Phase 0 because the user may reload during cooking.

### Required persisted data

```ts
selectedDishIds
kitchenSetup
plannerMode
scheduledTasks
cookingSession
```

### Acceptance criteria

- After reload, selected dishes remain selected.
- Kitchen setup is restored.
- Generated timeline is restored.
- If cooking has started, the app restores the current session safely.
- User can reset the local demo state.

---

## P0-6 — Add Basic Scheduler Tests

### Problem

The scheduler is the most important technical component. UI-only validation is not enough.

### Required tests

Create unit tests for:

1. Single dish scheduling
2. Multiple dishes with no conflicts
3. Dependency ordering
4. One-stove resource conflict
5. Passive task overlapping active task
6. Serve-immediately dish scheduled close to the end
7. Planner mode changes output
8. Delay behavior shifts pending tasks only

### Acceptance criteria

- Scheduler tests run with `npm test` or equivalent.
- Tests are deterministic.
- No test depends on current real time.

---

## 5. Secondary Improvements

## P1-1 — Improve Selected Dish UX

Current UI shows `0 món đã chọn` initially. Improve the selection experience:

- Make selected dish cards visually obvious.
- Add a sticky selected summary.
- Disable `Tạo lịch` until at least 2 dishes are selected.
- Add helper text:

```text
Chọn ít nhất 2 món để How Cook? có thể tối ưu lịch nấu.
```

---

## P1-2 — Improve Empty and Disabled States

Recommended states:

```text
No dish selected:
- Disable Tạo lịch
- Show short instruction

Dishes selected but no schedule:
- Enable Tạo lịch
- Show preview summary

Schedule generated:
- Enable Bắt đầu nấu

Cooking started:
- Disable editing selected dishes unless user stops session
```

---

## P1-3 — Add Plain-text Export

This is optional but useful for testing and sharing.

Example:

```text
How Cook? Timeline
00:00 Vo gạo — Cơm trắng
00:05 Cắm cơm — Cơm trắng
00:05 Sơ chế thịt — Thịt kho trứng
...
```

---

## P1-4 — Add More Explicit Resource Conflict Feedback

When users change resource counts, show visible schedule impact:

```text
Bếp: 2 → tổng thời gian 65 phút
Bếp: 1 → tổng thời gian 82 phút
```

This makes the optimizer feel real.

---

## 6. Suggested Codex Task Breakdown for Phase 0 Stabilization

### Task A — Audit Current State

Ask Codex to inspect the current codebase and map existing components to this plan:

```text
Find all existing components, scheduler functions, timer logic, and localStorage logic. Create a short report showing what already exists and what needs changes.
```

Output:

```text
PHASE0_CODE_AUDIT.md
```

---

### Task B — Strengthen Scheduler Output

Implementation focus:

- enforce dependencies
- enforce resource constraints
- support planner modes
- return warnings

Acceptance criteria:

```text
npm test passes
Selecting the same dishes with 1 stove vs 2 stoves produces different valid timelines
```

---

### Task C — Build Full Timeline Review Cards

Implementation focus:

- timeline item card
- active/passive badges
- resource badges
- warning panel
- total duration summary

---

### Task D — Complete Guided Cooking Mode

Implementation focus:

- current step
- countdown timer
- running passive timers
- next steps
- done / skip / delay / pause

---

### Task E — Add Local Persistence

Implementation focus:

- persist meal plan
- persist schedule
- persist cooking session
- reset state

---

### Task F — Add Manual QA Checklist

Create:

```text
QA_PHASE0.md
```

Include test cases for:

- selecting dishes
- generating schedule
- one-stove conflict
- cooking mode
- pause/delay/skip/done
- reload persistence
- mobile viewport

---

## 7. Recommended Definition of Done for Phase 0

Phase 0 can be considered complete only when:

```text
1. User can select 2–4 dishes.
2. User can configure kitchen resources.
3. User can generate a valid resource-aware timeline.
4. User can understand the timeline before starting.
5. User can start cooking mode.
6. User can see current step, running timers, and next steps.
7. User can use Done, Skip, Pause, and Delay.
8. App state survives reload via localStorage.
9. Scheduler has basic unit tests.
10. Mobile layout remains usable.
```

---

## 8. Recommended Immediate Next Step

Focus on this sequence:

```text
1. Scheduler correctness
2. Timeline review clarity
3. Guided cooking mode
4. Timer reliability
5. Persistence
6. Tests
```

Do not start Phase 1 features until Phase 0's cooking loop is reliable.
