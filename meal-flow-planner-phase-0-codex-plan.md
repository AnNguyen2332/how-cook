# Meal Flow Planner — Phase 0 Webapp Implementation Plan for Codex

## 1. Product Direction

Build a webapp that helps users cook multiple dishes at the same time.

The app should not be positioned as a normal recipe storage app. The core value is:

> Select multiple dishes → generate an optimized cooking timeline → guide the user step by step with timers.

Working product name:

```text
Meal Flow Planner
```

Alternative names:

```text
Cooking Flow
Meal Timeline
CookSync
Kitchen Flow
```

## 2. Phase 0 Goal

Phase 0 is a prototype, not a full recipe platform.

The goal is to validate this core workflow:

```text
User selects 2–4 predefined dishes
→ user configures simple kitchen resources
→ app generates a cooking timeline
→ user starts guided cooking mode
→ app shows current step, running timers, next steps
```

Do not implement account system, cloud sync, recipe import, AI parsing, social sharing, or nutrition tracking in Phase 0.

## 3. Target Users for Phase 0

Primary users:

```text
- People who cook at home and often prepare 2–4 dishes per meal.
- Beginners who do not know which cooking step should be done first.
- Busy users who want all dishes to finish around the same time.
```

Early target scenario:

```text
Vietnamese home dinner with rice, one main dish, one soup, and one quick vegetable dish.
```

## 4. Core User Story

```text
As a home cook,
I want to choose several dishes for a meal,
so that the app can tell me what to do now, what is running in the background, and what to do next.
```

Example:

```text
Selected dishes:
- Cơm trắng
- Thịt kho trứng
- Canh chua
- Rau luộc

Generated timeline:
18:00 Vo gạo, cắm cơm
18:05 Sơ chế thịt
18:15 Ướp thịt
18:20 Sơ chế rau và nguyên liệu canh
18:35 Bắt đầu kho thịt
18:45 Nấu canh
19:05 Luộc rau
19:15 Dọn món
```

## 5. Recommended Tech Stack

Use a webapp first.

```text
Framework: Next.js with React and TypeScript
Styling: Tailwind CSS
UI components: shadcn/ui
Icons: lucide-react
State management: React state first, Zustand optional
Data persistence: localStorage for Phase 0
Drag and drop: do not implement yet
Backend: none for Phase 0
Database: none for Phase 0
Deployment: Vercel
```

Reason:

```text
- Fast to prototype
- Easy to iterate UI/UX
- Works on PC and mobile browser
- Can later become a PWA
```

## 6. Phase 0 Feature Scope

### 6.1 Must-have Features

Implement these:

```text
1. Predefined dish library
2. Dish selection screen
3. Kitchen resource setup
4. Cooking timeline generator
5. Timeline review screen
6. Guided cooking mode
7. Step timer
8. Running passive timers
9. Done / Skip / Delay 5 minutes actions
10. Local persistence for selected meal
```

### 6.2 Nice-to-have Features

Only implement if the core flow is already stable:

```text
1. Target finish time
2. Basic responsive mobile layout
3. Simple conflict warning
4. Demo data reset button
5. Export timeline as plain text
```

### 6.3 Explicitly Out of Scope

Do not implement these in Phase 0:

```text
- User login
- Recipe sharing
- Recipe import from websites
- AI recipe parser
- Nutrition calculation
- Weekly meal planning
- Shopping list
- Cloud sync
- Payment
- Community recipe database
```

## 7. Key Product Concepts

### 7.1 Dish

A dish is a recipe-like object.

Example:

```ts
type Dish = {
  id: string;
  name: string;
  description?: string;
  category: "rice" | "main" | "soup" | "vegetable" | "side";
  tags: string[];
  preferredFinishWindow?: "early_ok" | "hot_at_end" | "serve_immediately";
  tasks: CookingTask[];
};
```

### 7.2 Cooking Task

A dish consists of multiple structured tasks.

```ts
type CookingTask = {
  id: string;
  dishId: string;
  name: string;
  description?: string;
  durationMinutes: number;
  type: "active" | "passive";
  resources: KitchenResourceRequirement[];
  dependsOn: string[];
  heatSensitivity?: "none" | "best_hot" | "must_be_hot";
  canStartEarly?: boolean;
};
```

### 7.3 Kitchen Resource

```ts
type KitchenResourceType =
  | "human"
  | "stove"
  | "pot"
  | "pan"
  | "rice_cooker"
  | "air_fryer"
  | "oven"
  | "knife_board";

type KitchenResourceRequirement = {
  type: KitchenResourceType;
  amount: number;
};
```

### 7.4 Kitchen Setup

```ts
type KitchenSetup = {
  human: number;
  stove: number;
  pot: number;
  pan: number;
  rice_cooker: number;
  air_fryer: number;
  oven: number;
  knife_board: number;
};
```

Default setup for Phase 0:

```ts
const defaultKitchenSetup = {
  human: 1,
  stove: 2,
  pot: 2,
  pan: 1,
  rice_cooker: 1,
  air_fryer: 0,
  oven: 0,
  knife_board: 1
};
```

### 7.5 Scheduled Task

```ts
type ScheduledTask = {
  taskId: string;
  dishId: string;
  name: string;
  startMinute: number;
  endMinute: number;
  durationMinutes: number;
  type: "active" | "passive";
  resources: KitchenResourceRequirement[];
  status: "pending" | "running" | "done" | "skipped";
};
```

### 7.6 Meal Plan

```ts
type MealPlan = {
  id: string;
  name: string;
  selectedDishIds: string[];
  kitchenSetup: KitchenSetup;
  targetFinishTime?: string;
  scheduledTasks: ScheduledTask[];
  createdAt: string;
  updatedAt: string;
};
```

## 8. Demo Dish Library for Phase 0

Create 8–10 predefined Vietnamese-style dishes.

Minimum required dishes:

```text
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
```

### 8.1 Example Dish Data: Cơm trắng

```ts
{
  id: "rice-white",
  name: "Cơm trắng",
  category: "rice",
  tags: ["nồi cơm điện", "giữ ấm được"],
  preferredFinishWindow: "early_ok",
  tasks: [
    {
      id: "rice-wash",
      dishId: "rice-white",
      name: "Vo gạo",
      durationMinutes: 5,
      type: "active",
      resources: [{ type: "human", amount: 1 }],
      dependsOn: [],
      canStartEarly: true
    },
    {
      id: "rice-cook",
      dishId: "rice-white",
      name: "Cắm cơm",
      durationMinutes: 30,
      type: "passive",
      resources: [{ type: "rice_cooker", amount: 1 }],
      dependsOn: ["rice-wash"],
      canStartEarly: true
    }
  ]
}
```

### 8.2 Example Dish Data: Thịt kho trứng

```ts
{
  id: "pork-braised-eggs",
  name: "Thịt kho trứng",
  category: "main",
  tags: ["món chính", "bếp", "nồi"],
  preferredFinishWindow: "hot_at_end",
  tasks: [
    {
      id: "pork-prep",
      dishId: "pork-braised-eggs",
      name: "Sơ chế thịt và trứng",
      durationMinutes: 10,
      type: "active",
      resources: [
        { type: "human", amount: 1 },
        { type: "knife_board", amount: 1 }
      ],
      dependsOn: []
    },
    {
      id: "pork-marinate",
      dishId: "pork-braised-eggs",
      name: "Ướp thịt",
      durationMinutes: 20,
      type: "passive",
      resources: [],
      dependsOn: ["pork-prep"]
    },
    {
      id: "pork-cook",
      dishId: "pork-braised-eggs",
      name: "Kho thịt",
      durationMinutes: 40,
      type: "passive",
      resources: [
        { type: "stove", amount: 1 },
        { type: "pot", amount: 1 }
      ],
      dependsOn: ["pork-marinate"],
      heatSensitivity: "best_hot"
    }
  ]
}
```

### 8.3 Example Dish Data: Rau luộc

```ts
{
  id: "boiled-vegetables",
  name: "Rau luộc",
  category: "vegetable",
  tags: ["nhanh", "ăn nóng"],
  preferredFinishWindow: "serve_immediately",
  tasks: [
    {
      id: "veg-wash",
      dishId: "boiled-vegetables",
      name: "Rửa rau",
      durationMinutes: 5,
      type: "active",
      resources: [{ type: "human", amount: 1 }],
      dependsOn: []
    },
    {
      id: "veg-boil",
      dishId: "boiled-vegetables",
      name: "Luộc rau",
      durationMinutes: 7,
      type: "active",
      resources: [
        { type: "human", amount: 1 },
        { type: "stove", amount: 1 },
        { type: "pot", amount: 1 }
      ],
      dependsOn: ["veg-wash"],
      heatSensitivity: "must_be_hot"
    }
  ]
}
```

## 9. Scheduler Logic for Phase 0

Use a simple heuristic scheduler first.

Do not use AI or complex optimization libraries in Phase 0.

### 9.1 Scheduler Input

```ts
type SchedulerInput = {
  dishes: Dish[];
  kitchenSetup: KitchenSetup;
  mode: "finish_fast" | "finish_together" | "low_stress";
  targetFinishTime?: string;
};
```

### 9.2 Scheduler Output

```ts
type SchedulerOutput = {
  scheduledTasks: ScheduledTask[];
  warnings: SchedulerWarning[];
  totalDurationMinutes: number;
};
```

```ts
type SchedulerWarning = {
  type: "resource_conflict" | "long_gap" | "late_hot_dish" | "impossible_schedule";
  message: string;
};
```

### 9.3 Basic Scheduling Strategy

Implement this initial heuristic:

```text
1. Flatten all selected dish tasks into one task list.
2. Build a dependency map using dependsOn.
3. Track available resources per minute.
4. Repeatedly select tasks whose dependencies are complete.
5. Priority order:
   a. Passive long tasks first
   b. Tasks that unlock many later tasks
   c. Hot/serve-immediately tasks later
   d. Short active tasks can fill gaps
6. Place each task at the earliest valid time where:
   - dependencies are complete
   - required resources are available
   - human active capacity is not exceeded
7. After initial schedule, move serve-immediately tasks closer to the end if possible.
8. Return timeline sorted by start time.
```

### 9.4 Simplified Resource Rule

For Phase 0:

```text
- Active tasks require human attention.
- Passive tasks do not require human attention unless explicitly defined.
- Two tasks cannot use the same limited resource beyond the configured amount.
- Tasks without resource requirements can run anytime after dependencies are done.
```

### 9.5 Pseudocode

```ts
function generateSchedule(input: SchedulerInput): SchedulerOutput {
  const tasks = flattenTasks(input.dishes);
  const scheduled: ScheduledTask[] = [];
  const completedTaskIds = new Set<string>();

  while (scheduled.length < tasks.length) {
    const availableTasks = tasks.filter(task =>
      !completedTaskIds.has(task.id) &&
      task.dependsOn.every(dep => completedTaskIds.has(dep))
    );

    const sortedTasks = sortByPriority(availableTasks, input.mode);

    const selectedTask = sortedTasks[0];

    const earliestStart = getEarliestStartAfterDependencies(selectedTask, scheduled);
    const startMinute = findFirstResourceAvailableSlot(
      selectedTask,
      earliestStart,
      scheduled,
      input.kitchenSetup
    );

    scheduled.push({
      taskId: selectedTask.id,
      dishId: selectedTask.dishId,
      name: selectedTask.name,
      startMinute,
      endMinute: startMinute + selectedTask.durationMinutes,
      durationMinutes: selectedTask.durationMinutes,
      type: selectedTask.type,
      resources: selectedTask.resources,
      status: "pending"
    });

    completedTaskIds.add(selectedTask.id);
  }

  return {
    scheduledTasks: scheduled.sort((a, b) => a.startMinute - b.startMinute),
    warnings: detectWarnings(scheduled, input),
    totalDurationMinutes: Math.max(...scheduled.map(t => t.endMinute))
  };
}
```

Important note:

This is not mathematically optimal yet. It only needs to produce a reasonable timeline for Phase 0.

## 10. UX Structure

The webapp should have 4 main screens.

### 10.1 Home / Create Meal

Purpose:

```text
Let the user start a meal plan quickly.
```

Main elements:

```text
- Product title
- Short value proposition
- Button: Create meal
- Optional demo button: Load sample dinner
```

### 10.2 Select Dishes

Purpose:

```text
Select 2–4 dishes for the meal.
```

Main elements:

```text
- Dish cards
- Category filters: Rice / Main / Soup / Vegetable / Side
- Estimated time per dish
- Tags: nồi cơm điện, bếp, ăn nóng, nhanh
- Selected dish count
- Button: Continue
```

### 10.3 Kitchen Setup

Purpose:

```text
Tell the scheduler what resources are available.
```

Fields:

```text
- Number of people cooking: default 1
- Number of stove burners: default 2
- Number of pots: default 2
- Number of pans: default 1
- Rice cooker: yes/no
- Air fryer: yes/no
- Oven: yes/no
```

Planner mode:

```text
- Finish as soon as possible
- Finish together
- Low stress
```

For Phase 0, implement only the UI and use the value in a basic priority function.

### 10.4 Timeline Review

Purpose:

```text
Show the generated plan before cooking.
```

Main elements:

```text
- Generated timeline list
- Each item displays:
  - Start time or relative minute
  - Task name
  - Dish name
  - Duration
  - Active/passive badge
  - Required resource
- Warnings panel
- Button: Start Cooking
- Button: Regenerate
```

### 10.5 Guided Cooking Mode

Purpose:

```text
Guide the user during cooking.
```

Main layout:

```text
Current step:
- Task name
- Dish name
- Description
- Countdown timer

Running timers:
- Passive tasks currently running
- Remaining time

Next steps:
- Next 2–3 upcoming tasks

Actions:
- Done
- Skip
- Delay 5 minutes
- Pause
```

UX principle:

```text
During cooking, do not show a complex Gantt chart.
Only show:
Now → Running timers → Next
```

## 11. UI Design Direction

Style:

```text
- Minimalist flat design
- Light background
- Rounded cards
- Clear typography
- Calm neutral colors
- Large timer display
- Mobile-friendly layout
```

Use visual hierarchy:

```text
Current task: very prominent
Running timers: secondary
Next steps: compact
Completed tasks: muted
Warnings: clear but not alarming
```

Suggested layout:

```text
Desktop:
Left sidebar:
- selected dishes
- kitchen setup

Main area:
- generated timeline or cooking mode

Mobile:
Top:
- meal summary
Main:
- current step / timeline
Bottom:
- primary action buttons
```

## 12. Suggested Folder Structure

```text
src/
  app/
    page.tsx
    meal/
      page.tsx
    cook/
      page.tsx

  components/
    layout/
      AppShell.tsx
      Header.tsx

    dishes/
      DishCard.tsx
      DishSelector.tsx

    kitchen/
      KitchenSetupForm.tsx
      ResourceControl.tsx

    timeline/
      TimelineView.tsx
      TimelineItem.tsx
      TimelineWarningPanel.tsx

    cooking/
      CookingMode.tsx
      CurrentStepCard.tsx
      RunningTimers.tsx
      NextSteps.tsx
      CookingControls.tsx

  data/
    demoDishes.ts

  lib/
    scheduler/
      types.ts
      generateSchedule.ts
      priority.ts
      resource.ts
      warnings.ts

    storage/
      mealStorage.ts

  types/
    domain.ts
```

## 13. Implementation Tasks for Codex

### Task 1 — Initialize Project

```text
Create a Next.js app with TypeScript and Tailwind CSS.
Install shadcn/ui and lucide-react.
Set up basic app layout.
```

Acceptance criteria:

```text
- App runs with npm run dev
- Tailwind works
- shadcn Button and Card render correctly
```

### Task 2 — Define Domain Types

Create:

```text
src/types/domain.ts
```

Include:

```ts
Dish
CookingTask
KitchenResourceType
KitchenResourceRequirement
KitchenSetup
ScheduledTask
MealPlan
SchedulerInput
SchedulerOutput
SchedulerWarning
```

Acceptance criteria:

```text
- All domain objects are strongly typed
- No use of any for core domain objects
```

### Task 3 — Create Demo Dish Data

Create:

```text
src/data/demoDishes.ts
```

Include at least:

```text
- Cơm trắng
- Thịt kho trứng
- Canh chua
- Rau luộc
- Trứng chiên
- Cá chiên
- Đậu hũ sốt cà
- Rau muống xào tỏi
```

Acceptance criteria:

```text
- Every dish has at least 2 tasks except very simple dishes
- Every task has durationMinutes, type, resources, and dependsOn
- IDs are stable and unique
```

### Task 4 — Implement Scheduler

Create:

```text
src/lib/scheduler/generateSchedule.ts
src/lib/scheduler/priority.ts
src/lib/scheduler/resource.ts
src/lib/scheduler/warnings.ts
```

Acceptance criteria:

```text
- Scheduler accepts multiple dishes and kitchen setup
- Scheduler respects task dependencies
- Scheduler respects resource limits
- Scheduler outputs sorted scheduled tasks
- Scheduler returns warnings if resource conflicts are impossible to resolve
```

### Task 5 — Build Dish Selection UI

Create:

```text
src/components/dishes/DishSelector.tsx
src/components/dishes/DishCard.tsx
```

Acceptance criteria:

```text
- User can select and unselect dishes
- Selected count is visible
- Continue button is disabled if no dish is selected
```

### Task 6 — Build Kitchen Setup UI

Create:

```text
src/components/kitchen/KitchenSetupForm.tsx
src/components/kitchen/ResourceControl.tsx
```

Acceptance criteria:

```text
- User can change stove, pot, pan, rice cooker values
- Values are stored in React state
- Default setup is prefilled
```

### Task 7 — Build Timeline Review UI

Create:

```text
src/components/timeline/TimelineView.tsx
src/components/timeline/TimelineItem.tsx
src/components/timeline/TimelineWarningPanel.tsx
```

Acceptance criteria:

```text
- Timeline items are shown in start order
- Each item shows start minute/time, task name, dish name, duration, type, and resources
- Active and passive tasks are visually distinct
- Warnings are visible
```

### Task 8 — Build Guided Cooking Mode

Create:

```text
src/components/cooking/CookingMode.tsx
src/components/cooking/CurrentStepCard.tsx
src/components/cooking/RunningTimers.tsx
src/components/cooking/NextSteps.tsx
src/components/cooking/CookingControls.tsx
```

Acceptance criteria:

```text
- Current task is shown prominently
- Countdown timer works
- Running passive tasks are shown
- Next 2–3 steps are shown
- Done moves to the next task
- Skip marks the current task skipped
- Delay 5 minutes shifts all remaining pending tasks by 5 minutes
```

### Task 9 — Add Local Persistence

Create:

```text
src/lib/storage/mealStorage.ts
```

Acceptance criteria:

```text
- Selected dishes, kitchen setup, and generated timeline are saved to localStorage
- Reloading page restores current meal plan
- User can reset demo state
```

### Task 10 — Polish Responsive UX

Acceptance criteria:

```text
- Desktop layout has sidebar + main timeline
- Mobile layout is single-column
- Timer text is large and readable
- Primary actions are easy to tap on mobile
```

## 14. Timer Behavior

Phase 0 timer rules:

```text
- Timer starts when user clicks Start Cooking.
- App uses scheduled task order as the main guide.
- Active current task has a countdown.
- Passive tasks can run in the background.
- When current timer reaches zero, show notification-like in-app alert and move to next task only after user confirms Done.
```

Do not auto-advance without user confirmation in Phase 0.

Reason:

```text
Cooking is physical. The user may need extra time.
```

## 15. Delay Behavior

When user clicks:

```text
Delay 5 minutes
```

Expected behavior:

```text
- Add 5 minutes to the start and end time of all pending tasks.
- Running tasks keep their existing countdown.
- Done tasks are not changed.
```

This is simple and predictable.

Later versions can implement smarter rescheduling.

## 16. Notification Strategy

Phase 0:

```text
- Use in-app visual alert first.
- Optional: use browser Notification API only after user permission.
```

Do not depend on browser notifications for the core experience.

## 17. Testing Plan

### 17.1 Scheduler Tests

Create unit tests for:

```text
- Single dish scheduling
- Multiple dishes with no conflicts
- Dependency ordering
- Resource conflict with one stove
- Passive task overlapping active task
- Serve-immediately dish scheduled near the end
```

### 17.2 UI Tests

Manual test cases:

```text
1. Select 3 dishes and generate timeline.
2. Change stove count from 2 to 1 and regenerate.
3. Start cooking mode.
4. Finish current step.
5. Skip a step.
6. Delay pending tasks by 5 minutes.
7. Reload page and confirm state is restored.
```

## 18. Phase 0 Success Criteria

The prototype is successful if:

```text
- A user can select multiple dishes and understand the generated timeline.
- A user can start cooking and know exactly what to do now.
- Passive timers and next steps are clear.
- The generated plan feels more useful than reading separate recipes.
```

Do not measure success by recipe quantity in Phase 0.

Measure success by:

```text
- Timeline clarity
- Cooking mode usability
- Scheduler output usefulness
```

## 19. Phase 1 Candidates

After Phase 0 is validated, consider:

```text
1. Recipe editor
2. Drag-and-drop timeline adjustment
3. Target finish time
4. Better schedule optimization
5. PWA install support
6. Browser notification support
7. AI recipe parser from pasted text
8. Shopping list generation
9. User accounts and cloud sync
```

## 20. Important Product Principle

The app should answer one question better than any normal recipe app:

> What should I do right now so that the whole meal finishes correctly?

Keep every Phase 0 decision aligned with that question.
