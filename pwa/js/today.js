/**
 * Today Tab Logic
 * Handle daily habit check-ins
 */

/**
 * Load the Today tab
 */
async function loadTodayTab() {
    const habits = await getActiveHabits();
    const today = getToday();

    const listEl = document.getElementById('today-list');
    const emptyEl = document.getElementById('today-empty');
    const completeEl = document.getElementById('today-complete');

    if (habits.length === 0) {
        listEl.innerHTML = '';
        emptyEl.classList.remove('hidden');
        completeEl.classList.add('hidden');
        return;
    }

    emptyEl.classList.add('hidden');

    // Get completion status for each habit
    const habitsWithStatus = await Promise.all(
        habits.map(async (habit) => {
            const completed = await isCompleted(habit.id, today);
            return { ...habit, completed };
        })
    );

    // Separate incomplete and completed
    const incomplete = habitsWithStatus.filter(h => !h.completed);
    const completed = habitsWithStatus.filter(h => h.completed);

    // Check if all completed
    if (incomplete.length === 0 && completed.length > 0) {
        completeEl.classList.remove('hidden');
    } else {
        completeEl.classList.add('hidden');
    }

    // Build the list HTML - all habits in grid (incomplete first, then completed)
    let html = '';

    // Incomplete habits first
    incomplete.forEach(habit => {
        html += createTodayHabitRow(habit, false);
    });

    // Completed habits
    completed.forEach(habit => {
        html += createTodayHabitRow(habit, true);
    });

    listEl.innerHTML = html;
}

/**
 * Create today habit row HTML
 */
function createTodayHabitRow(habit, completed) {
    const completedClass = completed ? 'completed' : '';
    const checkedClass = completed ? 'checked' : '';

    return `
        <div class="today-habit-row ${completedClass}" data-id="${habit.id}" onclick="toggleHabitCompletion('${habit.id}', this)">
            <div class="checkbox ${checkedClass}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <span class="habit-name">${habit.name}</span>
        </div>
    `;
}

/**
 * Toggle habit completion for today
 */
async function toggleHabitCompletion(habitId, rowElement) {
    const today = getToday();

    // Add animation class
    rowElement.classList.add('completing');

    try {
        const log = await toggleCompletion(habitId, today);
        hapticFeedback('light');

        // Reload the tab to reorder
        setTimeout(() => {
            loadTodayTab();
        }, 150);
    } catch (error) {
        console.error('Error toggling completion:', error);
        rowElement.classList.remove('completing');
        showToast('Failed to update');
    }
}
