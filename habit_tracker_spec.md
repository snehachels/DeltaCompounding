# Habit Tracker – Product Specification

## Vision & Philosophy

A minimalist habit tracker that simply provides a clear mirror of consistency. No streaks, badges, or guilt-inducing notifications. Just honest data that helps users understand their patterns.

**Core Principles:**
- Frictionless daily logging (<30 seconds)
- Neutral presentation (no judgment, just facts)
- Clean, calm interface
- Behavioral visibility without pressure

---

## App Architecture

### Navigation Structure
Bottom tab bar with 4 primary sections:

1. **Habits** – Define and manage your habit list
2. **Today** – Quick daily check-in interface
3. **History** – Visual consistency grid
4. **Insights** – Pattern recognition and reflection

---

## 1. Habits Tab – Source of Truth

**Purpose:** Create and maintain the master habit list

### Layout

**Header:**
- Title: "My Habits"
- Primary CTA: "+ Add Habit" (floating action button or top-right)

**Habit List:**
- Vertical scrollable list
- Each item displays:
  - Habit name (16pt, medium weight)
  - Optional description (14pt, gray, single line with ellipsis)
  - Active/inactive indicator (subtle badge or toggle)
  - Overflow menu (⋮) for actions

**Overflow Menu Actions:**
- Edit – Modify habit details
- Archive – Hide without deleting (preserves history)
- Delete – Permanent removal with confirmation dialog
- Reorder – Drag handles to change display order

### Add/Edit Habit Screen

**Modal or full-screen form with minimal fields:**

**Required:**
- Habit name (text input, 50 char limit)

**Optional:**
- Description (textarea, 200 char limit)
  - Placeholder: "Why does this matter to you?"
  - Purpose: Personal context, not accountability pressure

**Frequency Settings (Future Enhancement):**
- Default: Daily
- Extensible to: Weekly, Custom days (M/W/F), N times per week
- MVP: Daily only

**Active Toggle:**
- ON: Habit appears in Today view
- OFF: Habit archived, history preserved, excluded from Today

**Save Behavior:**
- Validates required fields
- Returns to Habits list
- Shows brief confirmation toast

### Empty State
"Get started by adding your first habit."  
[+ Add Habit button]

### Design Details
- Rounded cards with subtle shadow
- Generous tap targets (minimum 44x44pt)
- Haptic feedback on toggle and reorder
- Smooth animations for list updates

---

## 2. Today Tab – Execution Interface

**Purpose:** Frictionless daily habit logging

### Layout

**Header:**
- Title: "Today"
- Subtitle: Current date in natural format (e.g., "Saturday, Jan 24")
- Optional: Completion counter (e.g., "3 of 7 completed" in subtle gray)

**Habit List:**
- Scrollable vertical list
- Two sections with dynamic reordering:
  1. **Incomplete habits** (pinned to top)
  2. **Completed habits** (auto-moved to bottom)

### Habit Item Design

**Each row contains:**
- **Checkbox:** Large circular tap target (32pt diameter)
  - Incomplete: Hollow circle with gray border
  - Completed: Filled circle with checkmark, soft green accent
- **Habit name:** Primary text (16pt)
- **Divider:** Hairline separator between items

**Interaction Behavior:**
1. Tap checkbox → immediate visual feedback
2. Checkmark animates in (subtle scale + fade)
3. Item smoothly transitions to "Completed" section
4. No celebration animations or sound effects
5. No undo button (tap again to toggle off if needed)

**Reordering Logic:**
- Incomplete habits stay in user-defined order
- Completed habits move to bottom in completion order
- Smooth CSS transitions (300ms ease-out)
- State persists between app sessions

### Empty State

**All habits completed:**
```
✓ All habits completed for today.

[Well done. See you tomorrow.]
```
- Neutral, non-celebratory tone
- Soft checkmark icon
- No confetti or streaks mentioned

**No active habits:**
```
You have no active habits.

[Go to Habits tab to add one]
```

### Design Details
- Plenty of white space between items
- Touch targets >= 44pt height
- Pull-to-refresh (optional: syncs data if using cloud storage)
- Haptic feedback on completion (single subtle tap)

---

## 3. History Tab – Consistency Matrix

**Purpose:** Visual overview of behavior patterns over time

### Layout

**Header:**
- Title: "History"
- Date range selector (optional): Last 7 days / 30 days / 90 days / All time

**Matrix View:**
- Scrollable table with sticky headers
- Columns: Individual dates (most recent at left)
- Row: Active habits
- Grid cells: Completion status indicators

### Table Structure

**Row Headers (Sticky):**
- Habit names or icons (if using icon system)
- Abbreviated names if space is tight (max 12 chars)


**Column Headers :**
- Date format: "Jan 24" (abbreviated month + day)
- Subtle day-of-week indicator: "Sat 24"
- Gray text for readability
- Horizontal scroll for > 5 days

**Cell States:**
- **Completed:** Filled circle (8pt diameter, soft green)
- **Missed:** Hollow circle or dot (gray, 6pt diameter)
- **Not applicable:** Empty (for habits created mid-period)
- **Today (incomplete):** Dashed circle (gray outline)

**Sorting:**
- Dates in descending order (today at left)
- Habits in user-defined order (matching Habits tab)

### Interaction

**Tap on cell:**
- Shows tooltip: "Completed" or "Missed"
- No editing allowed (prevents data manipulation)

**Long-press on date row (optional):**
- Quick summary: "4 of 7 completed"

### Scrolling Behavior
- Vertical scroll: Navigate through habits
- Horizontal scroll: View more dates
- Sticky header remains visible during scroll
- Dates load incrementally (infinite scroll for long histories)

### Empty State
"Your history will appear here once you start tracking habits."

### Design Details
- Monospaced grid for alignment
- Subtle gridlines (1px, very light gray)
- Minimum cell size: 32x32pt (tap-friendly)
- Color-blind friendly palette (use shapes + colors)

---

## 4. Insights Tab – Reflection Without Judgment

**Purpose:** Summarize patterns in a neutral, informative way

### Layout

**Header:**
- Title: "Insights"
- Time range selector: Last 7 / 30 / 90 days

**Card-Based Layout:**
- Vertical scroll
- Each insight in its own card
- Generous padding and white space

### Core Insight Cards (MVP)

#### 1. Overall Consistency
**Title:** "Overall Consistency"  
**Content:**
```
You completed 68% of your habits this month.

That's 142 out of 210 total habit instances.
```
- Large percentage (32pt, neutral color)
- Contextual denominator in smaller text
- No value judgments or comparisons

#### 2. Habit-Wise Breakdown
**Title:** "By Habit"  
**Content:**
- Simple horizontal bar chart
- Each habit listed with completion percentage
- Sorted by user preference or completion rate
- Neutral gray bars (no red/green extremes)

Example:
```
Morning run       ████████░░  80%
Read 30 min       ███████░░░  70%
Journal           ██████░░░░  60%
```

#### 3. Best Habit
**Title:** "Most Consistent"  
**Content:**
```
Your most consistent habit is "Morning run"
at 87% completion over 30 days.
```
- Plain text, no badge
- Neutral framing ("most consistent" not "best")

#### 4. Opportunity Habit
**Title:** "Room for Growth"  
**Content:**
```
"Meditation" has been completed 3 times
in the last 30 days (10%).
```
- No shaming language
- Frame as opportunity, not failure
- Optional: Hide if completion < 5% (avoid guilt)

#### 5. Weekly Patterns (Optional Enhancement)
**Title:** "Day of Week Trends"  
**Content:**
```
You're most consistent on Tuesdays (85%)
and least on Sundays (42%).
```
- Simple observation, no prescription

### Design Principles for Insights
- **Neutral tone:** Use "completed" not "succeeded"
- **No comparisons:** Avoid "better than last week"
- **No streaks:** No "5-day streak" or "don't break it" messaging
- **No rankings:** No leaderboards or social comparison
- **Calm colors:** Soft blues/grays, avoid aggressive reds
- **Observation framing:** "You completed..." not "You should..."

### Empty State
"Complete a few habits to see insights about your patterns."

---

## Design System

### Color Palette

**Primary Colors:**
- Text (Primary): `#1A1A1A` (near-black)
- Text (Secondary): `#6B7280` (medium gray)
- Background: `#FFFFFF` (white)
- Surface: `#F9FAFB` (light gray for cards)

**Accent Colors:**
- Primary Accent: `#3B82F6` (calm blue for CTAs)
- Success State: `#10B981` (soft green, not bright)
- Completion: `#D1FAE5` (very light green for completed states)
- Neutral: `#E5E7EB` (borders, dividers)

**Never Use:**
- Aggressive reds (avoid failure framing)
- Bright, gamified colors
- Gradient backgrounds

### Typography

**Font Family:**
- System default (SF Pro on iOS, Roboto on Android)
- Fallback: Inter or Arial

**Text Styles:**
- H1 (Page Titles): 28pt, Semi-bold
- H2 (Section Headers): 20pt, Medium
- Body (Primary): 16pt, Regular
- Body (Secondary): 14pt, Regular
- Caption: 12pt, Regular

**Line Height:**
- Generous spacing (1.5x for readability)

### Spacing & Layout

**Grid System:**
- 8pt base unit
- Padding: 16pt (mobile), 24pt (tablet)
- Card margins: 12pt between cards
- Section spacing: 32pt

**Touch Targets:**
- Minimum: 44x44pt (iOS guideline)
- Preferred: 48x48pt (Material Design guideline)

### Components

**Buttons:**
- Primary: Filled, rounded corners (8pt radius)
- Secondary: Outlined
- Text buttons: No border, minimal padding
- Haptic feedback on press

**Cards:**
- Border radius: 12pt
- Shadow: Subtle (0 2px 8px rgba(0,0,0,0.08))
- Background: White or light gray

**Inputs:**
- Border radius: 8pt
- Border: 1px solid gray
- Focus state: Blue outline (2px)
- Error state: Red border (no red background)

### Animations

**Principles:**
- Subtle and purposeful
- Never distracting or celebratory
- Smooth transitions only

**Allowed:**
- List reordering (ease-out, 300ms)
- Checkbox state change (scale 0.95→1.0, 200ms)
- Card entrance (fade-in, 250ms)
- Page transitions (slide, 350ms)

**Never:**
- Confetti or particle effects
- Sound effects or notifications
- Pulsing or shaking animations
- Auto-playing celebrations

---

## Data Model

### Schema

**Habit Table**
```
habit_id (UUID, primary key)
name (STRING, required, max 50 chars)
description (TEXT, optional, max 200 chars)
is_active (BOOLEAN, default true)
created_at (TIMESTAMP)
order_index (INTEGER, for custom sorting)
```

**DailyLog Table**
```
log_id (UUID, primary key)
habit_id (UUID, foreign key → Habit)
date (DATE, required)
completed (BOOLEAN, default false)
completed_at (TIMESTAMP, nullable)
```

**Indexes:**
- `habit_id + date` (unique constraint, prevents duplicates)
- `date` (for efficient history queries)
- `habit_id` (for per-habit statistics)

### Data Storage

**MVP: Local Storage**
- SQLite database (mobile ios app)
- IndexedDB (web)
- No cloud sync initially

**Future: Optional Cloud Sync**
- End-to-end encrypted
- User controls all data
- Export to JSON/CSV anytime
- Firebase backend data storage

### Data Lifecycle

**Habit Deletion:**
- Soft delete: Set `is_active = false`, preserve all logs
- Hard delete (optional): Requires confirmation, removes logs
- Export data before deletion (offer download)

**Log Retention:**
- Indefinite by default
- Optional: Auto-archive logs > 1 year old

---

## User Flows

### First-Time User Experience

1. **Onboarding (optional 3-screen carousel):**
   - "Track habits without pressure"
   - "See your patterns clearly"
   - "No streaks, just data"
   - Skip button on every screen

2. **Empty State (Habits tab):**
   - Clear prompt to add first habit
   - Example habits (optional suggestions):
     - Morning exercise
     - Read for 30 minutes
     - Drink 8 glasses of water
     - Journal before bed

3. **First Habit Creation:**
   - Guide user through form
   - Emphasize "Why does this matter to you?" field
   - Auto-save and return to Habits tab

4. **Today Tab Introduction:**
   - Tooltip on first visit: "Tap the circle to mark as complete"
   - Dismissible forever after first interaction

### Daily Usage Flow

**Most common path (< 30 seconds):**
1. Open app (defaults to Today tab)
2. Scan incomplete habits
3. Tap checkboxes for completed habits
4. Close app

**Expected frequency:** Once per day (evening or morning)

### Insights Review Flow

**Typical usage (weekly):**
1. Navigate to Insights tab
2. Scroll through cards
3. Note patterns without judgment
4. Optional: Adjust habits in Habits tab based on insights
5. No action required

---

## Technical Considerations

### Platform Targets
- **Primary:** iOS app
- **Secondary:** Progressive Web App (PWA)

### Performance Requirements
- Today tab loads in < 500ms and is the first page visible when app is opened
- History grid renders 30 days in < 1s
- Insights calculations complete in < 2s

### Offline Support
- Full offline functionality
- Queue sync operations when online
- Conflict resolution: Latest write wins

### Accessibility
- VoiceOver/TalkBack support
- Dynamic type scaling
- High contrast mode
- Keyboard navigation (web)
- Minimum 4.5:1 color contrast ratio

### Privacy & Security
- No analytics or tracking by default
- No third-party SDKs (except crash reporting)
- Local data encryption at rest
- Optional: Passcode/biometric lock

---

## Future Enhancements (Post-MVP)

### Phase 2: Custom Frequencies
- Weekly goals (e.g., "Exercise 3x per week")
- Specific day selections (M/W/F)
- Monthly habits (e.g., "Pay bills")

### Phase 3: Contextual Notes
- Optional note field per log (e.g., "Ran 5k today")
- Searchable text for reflection
- No forced journaling

### Phase 4: Export & Integrations
- CSV/JSON export
- API for third-party tools
- Apple Health / Google Fit integration (read-only)

### Phase 5: Shared Habits (Optional)
- Invite accountability partner
- View their consistency grid (with permission)
- No competitive elements

### Explicitly Out of Scope
- Social features (likes, comments, feeds)
- Leaderboards or rankings
- Achievements or badges
- Notifications (except optional gentle reminders)
- Habit recommendations from AI
- In-app purchases or ads

---

## Success Metrics

**Primary:**
- Daily active users (DAU)
- Average session duration < 60s (confirms frictionless UX)
- 7-day retention rate
- Habit completion rate (per user)

**Secondary:**
- Habits per user (healthy range: 3-7)
- Time to first habit creation
- Insights tab engagement (% of users who visit weekly)

**Anti-Metrics (things we DON'T want to optimize):**
- Session duration (longer ≠ better)
- Push notification click-through rate
- Social sharing

---

## Open Questions for Development

1. **Habit ordering:** Allow manual reordering, or always alphabetical?
   - **Recommendation:** Manual drag-to-reorder (gives users control)

2. **Midnight rollover:** What happens if user logs at 12:01 AM?
   - **Recommendation:** Allow retroactive logging for previous day until 8 AM

3. **Deletion confirmation:** Single-step or two-step confirmation?
   - **Recommendation:** Two-step with preview of data loss ("This will delete 90 days of history")

4. **History pagination:** Load all dates or lazy-load?
   - **Recommendation:** Load last 30 days on open, infinite scroll for earlier dates

5. **Color customization:** Per-habit accent colors?
   - **Recommendation:** Not in MVP (adds complexity, reduces calm aesthetic)

---

## Appendix: Design Inspiration

**Apps that get it right:**
- Streaks (iOS) – Minimal habit tracking
- Done (habit tracker) – Clean interface
- Momentum (Chrome extension) – Calm daily checklist

**Design principles borrowed from:**
- Apple's Human Interface Guidelines
- Material Design (Android)
- Calm app's neutral aesthetic

---

**Document Version:** 1.0  
**Last Updated:** January 24, 2026  
**Owner:** Product Team  
**Status:** Ready for Design & Development
