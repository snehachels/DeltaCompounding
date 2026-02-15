New project: Habit Tracker

## Overall App Structure

Navigation:
Bottom tab bar with 4 primary tabs

Habits
Today
History
Insights


## 1) Habits Tab — Define & Manage Habits

Purpose: Create and maintain the habit list (source of truth)

Layout-

Header: “My Habits”

Primary CTA: + Add Habit (top-right or floating)

List view (vertical):
Habit name (primary)
Optional subtext (secondary, muted)
Overflow menu (⋮): Edit | Archive | Delete

Add / Edit Habit (Modal or New Screen)-

Minimal fields only:
Habit name (required)
Optional description (why it matters)
Frequency (default: Daily, extensible later)

Active toggle (on/off instead of delete)



## 2) Today Tab — Daily Execution

Purpose: Let the user quickly log today’s progress

Layout-

Header: “Today”
Subtext: Today’s date (small, contextual)
Scrollable habit list

Habit Item Design-

Each row contains:
-Circular checkbox (tap to complete)
-Habit name
-Optional subtle divider

Behavior Rules (as you defined)-

- Incomplete habits pinned at top
- Completed habits auto-move to bottom
- Smooth animation (no celebration)

Empty State-

If all habits completed:
“All habits completed for today.”

This screen should feel frictionless, optimized for <30 seconds/day usage.


## 3) History Tab — Visual Consistency Tracker

Purpose: See consistency over time without analysis overload

Layout-

Header: “History”
Scrollable matrix view


Table Structure-
- Rows: Dates (latest at top)
- Columns: Habits (icons or abbreviated names)
- Cells:
  - Filled circle → completed
  - Hollow / muted → not completed
  - Neutral color palette (e.g., gray / soft green)

UX Considerations-

- Horizontal scroll for habits
- Vertical scroll for dates
- Sticky habit headers
- Tap cell → quick tooltip (“Completed” / “Missed”)

This becomes the behavioral mirror of the app
No judgments, just visibility
Make sure to have the dates in descending order so the last date (today) is visible as the top row of the table


## 4) Insights Tab — Reflection, Not Pressure

Purpose: Summarize patterns, not motivate via gamification

Layout-
- Header: “Insights”
- Scrollable cards (modular)

Core Insight Cards (MVP)-
- Overall consistency: “You completed 68% of habits this month”
- Habit-wise completion: Simple bar chart or percentage list
- Most consistent habit: Plain text highlight
- Least consistent habit: Plain text, no warning colors

Design Principles- 
- Neutral tones
- No streaks, badges, rankings
- Insights framed as observations, not evaluations


---------------------------

## Design System (Lightweight but Intentional)

Color Palette-
- Primary: neutral dark (text)
- Accent: single soft color (green/blue)
- Completed states: muted success color
- Missed states: light gray (not red)

Typography-
- System font (SF / Inter)
- Clear hierarchy, no decorative fonts

Interactions-
- Subtle animations only
- No sound effects
- No congratulatory copy


## Data Model

Habit
- habit_id
- name
- description
- is_active

DailyLog
- date
- habit_id
- completed (boolean)

