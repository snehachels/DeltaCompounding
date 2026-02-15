# Habit Tracker — Execution Plan

## Overview

This document outlines the implementation plan for building a minimalist iOS Habit Tracker app based on the product specification. The app features 4 main tabs (Habits, Today, History, Insights) with local SQLite storage.

**Target Platform:** iOS (SwiftUI)
**Storage:** Local SQLite/Core Data (MVP)
**Design Philosophy:** Calm, neutral, frictionless (<30 seconds daily usage)

---

## Phase 1: Project Setup & Foundation

### 1.1 Initialize iOS Project
- [ ] Create new Xcode project (iOS App, SwiftUI)
- [ ] Set minimum deployment target (iOS 16+)
- [ ] Configure app bundle identifier
- [ ] Add placeholder app icons
- [ ] Set up folder structure:

```
HabitTracker/
├── App/
│   ├── HabitTrackerApp.swift
│   └── ContentView.swift
├── Models/
│   ├── Habit.swift
│   └── DailyLog.swift
├── Views/
│   ├── Habits/
│   │   ├── HabitsView.swift
│   │   ├── HabitRowView.swift
│   │   └── AddEditHabitView.swift
│   ├── Today/
│   │   ├── TodayView.swift
│   │   └── TodayHabitRowView.swift
│   ├── History/
│   │   ├── HistoryView.swift
│   │   └── HistoryGridView.swift
│   └── Insights/
│       ├── InsightsView.swift
│       └── InsightCardView.swift
├── ViewModels/
│   ├── HabitsViewModel.swift
│   ├── TodayViewModel.swift
│   ├── HistoryViewModel.swift
│   └── InsightsViewModel.swift
├── Services/
│   ├── HabitStore.swift
│   └── PersistenceController.swift
└── Utils/
    ├── DesignSystem.swift
    └── Extensions.swift
```

### 1.2 Design System Implementation
- [ ] Create `DesignSystem.swift` with color palette:
  - Primary Text: `#1A1A1A`
  - Secondary Text: `#6B7280`
  - Background: `#FFFFFF`
  - Surface: `#F9FAFB`
  - Primary Accent: `#3B82F6`
  - Success: `#10B981`
  - Completion: `#D1FAE5`
  - Neutral: `#E5E7EB`
- [ ] Define typography styles:
  - H1: 28pt, Semi-bold
  - H2: 20pt, Medium
  - Body: 16pt, Regular
  - Body Secondary: 14pt, Regular
  - Caption: 12pt, Regular
- [ ] Create spacing constants (8pt grid)
- [ ] Build reusable button styles
- [ ] Build card view modifiers

### 1.3 Data Layer Setup
- [ ] Create Core Data model file (`HabitTracker.xcdatamodeld`)
- [ ] Define `Habit` entity:
  - `id` (UUID, primary key)
  - `name` (String, required, max 50 chars)
  - `habitDescription` (String, optional, max 200 chars)
  - `isActive` (Boolean, default true)
  - `createdAt` (Date)
  - `orderIndex` (Int32)
- [ ] Define `DailyLog` entity:
  - `id` (UUID, primary key)
  - `habitId` (UUID, foreign key)
  - `date` (Date, required)
  - `completed` (Boolean, default false)
  - `completedAt` (Date, optional)
- [ ] Add unique constraint on `habitId + date`
- [ ] Create `PersistenceController` for Core Data stack
- [ ] Create `HabitStore` service with CRUD operations:
  - `fetchAllHabits()`
  - `fetchActiveHabits()`
  - `createHabit(name:description:)`
  - `updateHabit(_:)`
  - `deleteHabit(_:)`
  - `reorderHabits(_:)`
  - `getLog(for:on:)`
  - `toggleCompletion(for:on:)`
  - `getLogs(from:to:)`

---

## Phase 2: Tab Navigation & Shell

### 2.1 Main Tab View
- [ ] Implement `ContentView` with TabView
- [ ] Configure 4 tabs with SF Symbols:
  - Habits: `list.bullet`
  - Today: `checkmark.circle`
  - History: `calendar`
  - Insights: `chart.bar`
- [ ] Set "Today" as default selected tab
- [ ] Apply design system colors to tab bar

---

## Phase 3: Habits Tab (Source of Truth)

### 3.1 Habits List View
- [ ] Create `HabitsView.swift`
- [ ] Header with "My Habits" title
- [ ] "+ Add Habit" button (top-right or floating)
- [ ] Scrollable list of habit cards
- [ ] Each card displays:
  - Habit name (16pt, medium weight)
  - Description (14pt, gray, single line ellipsis)
  - Active/inactive indicator
  - Overflow menu button (⋮)

### 3.2 Habit Row Component
- [ ] Create `HabitRowView.swift`
- [ ] Rounded card with subtle shadow
- [ ] Tap targets minimum 44x44pt
- [ ] Overflow menu with:
  - Edit action
  - Archive action (set isActive = false)
  - Delete action (with confirmation)

### 3.3 Drag to Reorder
- [ ] Implement drag handles
- [ ] Update `orderIndex` on reorder
- [ ] Smooth animation (300ms ease-out)
- [ ] Haptic feedback on drag

### 3.4 Add/Edit Habit Screen
- [ ] Create `AddEditHabitView.swift`
- [ ] Modal sheet presentation
- [ ] Form fields:
  - Habit name (TextField, required, 50 char limit)
  - Description (TextEditor, optional, 200 char limit)
  - Placeholder: "Why does this matter to you?"
  - Active toggle switch
- [ ] Cancel and Save buttons
- [ ] Validation: require non-empty name
- [ ] Toast confirmation on save

### 3.5 Delete Confirmation
- [ ] Two-step confirmation dialog
- [ ] Show data impact: "This will delete X days of history"
- [ ] Destructive button styling

### 3.6 Empty State
- [ ] Display when no habits exist
- [ ] Message: "Get started by adding your first habit."
- [ ] Prominent "+ Add Habit" button

---

## Phase 4: Today Tab (Daily Execution)

### 4.1 Today View Layout
- [ ] Create `TodayView.swift`
- [ ] Header: "Today"
- [ ] Subtitle: Current date (e.g., "Saturday, Jan 24")
- [ ] Optional completion counter ("3 of 7 completed")
- [ ] Scrollable habit list

### 4.2 Today Habit Row Component
- [ ] Create `TodayHabitRowView.swift`
- [ ] Large circular checkbox (32pt diameter)
- [ ] States:
  - Incomplete: hollow circle, gray border
  - Completed: filled circle, soft green, checkmark icon
- [ ] Habit name (16pt)
- [ ] Hairline divider between items

### 4.3 Completion Animation
- [ ] Tap checkbox triggers:
  - Immediate visual feedback
  - Checkmark scale + fade animation (200ms)
  - Haptic feedback (single subtle tap)
- [ ] No celebration effects

### 4.4 Dynamic Reordering
- [ ] Split list into two sections:
  - Incomplete habits (top, user-defined order)
  - Completed habits (bottom, completion order)
- [ ] Smooth transition animation (300ms ease-out)
- [ ] Persist state between sessions

### 4.5 Empty States
- [ ] All habits completed:
  - Checkmark icon
  - "All habits completed for today."
  - Subtitle: "See you tomorrow."
- [ ] No active habits:
  - "You have no active habits."
  - Link: "Go to Habits tab to add one"

---

## Phase 5: History Tab (Consistency Matrix)

### 5.1 History View Layout
- [ ] Create `HistoryView.swift`
- [ ] Header: "History"
- [ ] Optional date range selector (7/30/90 days)

### 5.2 Matrix Grid Component
- [ ] Create `HistoryGridView.swift`
- [ ] Sticky row headers (habit names, max 12 chars)
- [ ] Column headers: dates ("Jan 24" or "Sat 24")
- [ ] Dates in descending order (today at left)
- [ ] Habits in user-defined order

### 5.3 Grid Cell States
- [ ] Completed: filled circle (8pt, soft green)
- [ ] Missed: hollow/dot circle (6pt, gray)
- [ ] Not applicable: empty cell
- [ ] Today incomplete: dashed circle (gray outline)

### 5.4 Scrolling Behavior
- [ ] Vertical scroll for habits
- [ ] Horizontal scroll for dates
- [ ] Sticky headers remain visible
- [ ] Minimum cell size: 32x32pt

### 5.5 Cell Interaction
- [ ] Tap cell shows tooltip: "Completed" / "Missed"
- [ ] No editing allowed (read-only)

### 5.6 Lazy Loading
- [ ] Load last 30 days initially
- [ ] Infinite scroll for older dates
- [ ] Performance target: < 1s render

### 5.7 Empty State
- [ ] "Your history will appear here once you start tracking habits."

---

## Phase 6: Insights Tab (Reflection)

### 6.1 Insights View Layout
- [ ] Create `InsightsView.swift`
- [ ] Header: "Insights"
- [ ] Time range selector: 7 / 30 / 90 days
- [ ] Vertical scrollable card list

### 6.2 Insight Card Component
- [ ] Create `InsightCardView.swift`
- [ ] Rounded corners (12pt)
- [ ] Subtle shadow
- [ ] Generous padding

### 6.3 Overall Consistency Card
- [ ] Title: "Overall Consistency"
- [ ] Large percentage (32pt)
- [ ] Context: "X out of Y total habit instances"
- [ ] Neutral color (no green/red)

### 6.4 Habit-Wise Breakdown Card
- [ ] Title: "By Habit"
- [ ] Horizontal bar chart
- [ ] Each habit with percentage
- [ ] Gray bars (neutral palette)
- [ ] Example:
  ```
  Morning run       ████████░░  80%
  Read 30 min       ███████░░░  70%
  ```

### 6.5 Most Consistent Card
- [ ] Title: "Most Consistent"
- [ ] Plain text: "Your most consistent habit is [X] at Y%"
- [ ] No badge or celebration

### 6.6 Room for Growth Card
- [ ] Title: "Room for Growth"
- [ ] Plain text: "[X] has been completed Y times (Z%)"
- [ ] Neutral framing (no shaming)
- [ ] Optional: hide if < 5% (avoid guilt)

### 6.7 Design Compliance
- [ ] Neutral tone throughout
- [ ] No streaks or badges
- [ ] No comparisons to past periods
- [ ] Observation framing only

### 6.8 Empty State
- [ ] "Complete a few habits to see insights about your patterns."

---

## Phase 7: Polish & Edge Cases

### 7.1 Accessibility
- [ ] VoiceOver labels on all interactive elements
- [ ] Accessibility hints for complex actions
- [ ] Dynamic Type support (all text scales)
- [ ] High contrast mode support
- [ ] Minimum 4.5:1 color contrast ratio
- [ ] Reduce Motion support (disable animations)

### 7.2 Animations
- [ ] List reordering: 300ms ease-out
- [ ] Checkbox state: scale 0.95→1.0, 200ms
- [ ] Card entrance: fade-in, 250ms
- [ ] Tab transitions: slide, 350ms
- [ ] Respect system "Reduce Motion" setting

### 7.3 Haptic Feedback
- [ ] Habit completion: light impact
- [ ] Drag reorder: selection changed
- [ ] Button press: light impact

### 7.4 Edge Cases
- [ ] Midnight rollover: allow logging for previous day until 8 AM
- [ ] Habits created mid-period: show empty cells for prior dates
- [ ] Handle 0 habits gracefully (all tabs)
- [ ] Handle 0 completed habits (Insights)
- [ ] Very long habit names: truncate with ellipsis

### 7.5 Data Integrity
- [ ] Prevent duplicate logs (same habit + date)
- [ ] Validate habit name not empty
- [ ] Validate character limits

---

## Phase 8: Performance & Testing

### 8.1 Performance Targets
- [ ] Today tab loads in < 500ms
- [ ] History grid (30 days) renders in < 1s
- [ ] Insights calculations complete in < 2s
- [ ] App launch to interactive: < 1s

### 8.2 Performance Optimizations
- [ ] Lazy loading for History grid
- [ ] Efficient Core Data fetch requests
- [ ] Cache Insights calculations
- [ ] Use `@FetchRequest` with proper predicates

### 8.3 Unit Tests
- [ ] HabitStore CRUD operations
- [ ] Habit validation logic
- [ ] Insights calculation logic
- [ ] Date handling (midnight rollover)

### 8.4 UI Tests
- [ ] Add new habit flow
- [ ] Complete habit in Today view
- [ ] Navigate all tabs
- [ ] Delete habit with confirmation

### 8.5 Manual QA Checklist
- [ ] All empty states display correctly
- [ ] All animations are smooth
- [ ] Haptics trigger appropriately
- [ ] VoiceOver navigation works
- [ ] Dynamic Type scales correctly
- [ ] No crashes on edge cases

---

## Phase 9: First-Time User Experience

### 9.1 Onboarding Carousel (Optional)
- [ ] Screen 1: "Track habits without pressure"
- [ ] Screen 2: "See your patterns clearly"
- [ ] Screen 3: "No streaks, just data"
- [ ] Skip button on every screen
- [ ] Get Started button on final screen
- [ ] Store flag to show only once

### 9.2 First-Use Tooltip
- [ ] Today tab: "Tap the circle to mark as complete"
- [ ] Dismissible after first interaction
- [ ] Store flag to show only once

### 9.3 Example Habit Suggestions (Optional)
- [ ] Show when adding first habit:
  - Morning exercise
  - Read for 30 minutes
  - Drink 8 glasses of water
  - Journal before bed
- [ ] Tappable to pre-fill name

---

## Build Order Summary

| Phase | Component | Est. Complexity | Dependencies |
|-------|-----------|-----------------|--------------|
| 1.1 | Project setup | Low | None |
| 1.2 | Design system | Low | 1.1 |
| 1.3 | Data layer | Medium | 1.1 |
| 2.1 | Tab navigation | Low | 1.1, 1.2 |
| 3.x | Habits tab | Medium | 1.3, 2.1 |
| 4.x | Today tab | Medium | 1.3, 3.x |
| 5.x | History tab | High | 1.3 |
| 6.x | Insights tab | Medium | 1.3 |
| 7.x | Polish & edge cases | Medium | All tabs |
| 8.x | Testing | Medium | All |
| 9.x | Onboarding | Low | All tabs |

---

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| UI Framework | SwiftUI |
| Data Persistence | Core Data (SQLite) |
| State Management | @StateObject, @ObservableObject |
| Navigation | TabView, NavigationStack |
| Animations | SwiftUI built-in |
| Haptics | UIFeedbackGenerator |

---

## Files to Create

### Core Files
1. `HabitTrackerApp.swift` — App entry point
2. `ContentView.swift` — Tab navigation
3. `DesignSystem.swift` — Colors, typography, spacing
4. `PersistenceController.swift` — Core Data stack
5. `HabitStore.swift` — Data access layer

### Model Files
6. `Habit.swift` — Habit model extensions
7. `DailyLog.swift` — DailyLog model extensions

### View Files
8. `HabitsView.swift` — Habits tab main view
9. `HabitRowView.swift` — Single habit card
10. `AddEditHabitView.swift` — Add/edit modal
11. `TodayView.swift` — Today tab main view
12. `TodayHabitRowView.swift` — Checkable habit row
13. `HistoryView.swift` — History tab main view
14. `HistoryGridView.swift` — Matrix grid component
15. `InsightsView.swift` — Insights tab main view
16. `InsightCardView.swift` — Reusable insight card

### ViewModel Files
17. `HabitsViewModel.swift` — Habits tab logic
18. `TodayViewModel.swift` — Today tab logic
19. `HistoryViewModel.swift` — History tab logic
20. `InsightsViewModel.swift` — Insights calculations

---

## Next Steps

1. **Start with Phase 1** — Set up Xcode project and design system
2. **Build data layer** — Core Data models and HabitStore
3. **Create tab shell** — Basic navigation structure
4. **Implement Habits tab first** — This is the source of truth
5. **Then Today tab** — Core daily interaction
6. **Then History and Insights** — Depend on logged data
7. **Polish and test** — Accessibility, edge cases, performance

---

*Document created: January 24, 2026*
*Based on: habit_tracker_spec.md v1.0*
