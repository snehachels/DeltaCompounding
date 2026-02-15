/**
 * Habits Tab Logic
 * Manage habit creation, editing, and deletion
 */

// Track which habit is being edited/deleted
let editingHabitId = null;
let deletingHabitId = null;

/**
 * Load the Habits tab
 */
async function loadHabitsTab() {
    const habits = await getAllHabits();
    const listEl = document.getElementById('habits-list');
    const emptyEl = document.getElementById('habits-empty');

    if (habits.length === 0) {
        listEl.innerHTML = '';
        emptyEl.classList.remove('hidden');
        return;
    }

    emptyEl.classList.add('hidden');
    listEl.innerHTML = habits.map(habit => createHabitCard(habit)).join('');
}

/**
 * Create habit card HTML
 */
function createHabitCard(habit) {
    const statusClass = habit.isActive ? '' : 'inactive';
    const description = habit.description ? `<p>${truncate(habit.description, 50)}</p>` : '';

    return `
        <div class="habit-card" data-id="${habit.id}">
            <div class="habit-status ${statusClass}"></div>
            <div class="habit-info">
                <h3>${truncate(habit.name, 30)}</h3>
                ${description}
            </div>
            <button class="habit-menu" onclick="toggleHabitMenu(event, '${habit.id}')">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                    <circle cx="12" cy="19" r="2"></circle>
                </svg>
                <div class="dropdown-menu" id="menu-${habit.id}">
                    <div class="dropdown-item" onclick="editHabit('${habit.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                    </div>
                    <div class="dropdown-item" onclick="toggleHabitActive('${habit.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${habit.isActive
                                ? '<path d="M21 8v13H3V8"></path><path d="M1 3h22v5H1z"></path><path d="M10 12h4"></path>'
                                : '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path>'}
                        </svg>
                        ${habit.isActive ? 'Archive' : 'Reactivate'}
                    </div>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-item danger" onclick="showDeleteConfirm('${habit.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete
                    </div>
                </div>
            </button>
        </div>
    `;
}

/**
 * Toggle dropdown menu
 */
function toggleHabitMenu(event, habitId) {
    event.stopPropagation();

    const menu = document.getElementById(`menu-${habitId}`);
    const wasOpen = menu.classList.contains('show');

    // Close all menus first
    closeAllDropdowns();

    // Toggle this menu
    if (!wasOpen) {
        menu.classList.add('show');
    }
}

/**
 * Show add habit modal
 */
function showAddHabitModal() {
    editingHabitId = null;
    document.getElementById('modal-title').textContent = 'Add Habit';
    document.getElementById('habit-id').value = '';
    document.getElementById('habit-name').value = '';
    document.getElementById('habit-description').value = '';
    document.getElementById('name-count').textContent = '0';
    document.getElementById('desc-count').textContent = '0';
    document.getElementById('habit-modal').classList.remove('hidden');

    // Focus name input
    setTimeout(() => {
        document.getElementById('habit-name').focus();
    }, 100);
}

/**
 * Edit an existing habit
 */
async function editHabit(habitId) {
    closeAllDropdowns();
    editingHabitId = habitId;

    const habit = await getHabit(habitId);
    if (!habit) return;

    document.getElementById('modal-title').textContent = 'Edit Habit';
    document.getElementById('habit-id').value = habit.id;
    document.getElementById('habit-name').value = habit.name;
    document.getElementById('habit-description').value = habit.description || '';
    document.getElementById('name-count').textContent = habit.name.length;
    document.getElementById('desc-count').textContent = (habit.description || '').length;
    document.getElementById('habit-modal').classList.remove('hidden');

    // Focus name input
    setTimeout(() => {
        document.getElementById('habit-name').focus();
    }, 100);
}

/**
 * Close habit modal
 */
function closeHabitModal() {
    document.getElementById('habit-modal').classList.add('hidden');
    editingHabitId = null;
}

/**
 * Save habit (create or update)
 */
async function saveHabit(event) {
    event.preventDefault();

    const name = document.getElementById('habit-name').value.trim();
    const description = document.getElementById('habit-description').value.trim();

    if (!name) {
        showToast('Please enter a habit name');
        return;
    }

    try {
        if (editingHabitId) {
            // Update existing habit
            const habit = await getHabit(editingHabitId);
            habit.name = name;
            habit.description = description;
            await updateHabit(habit);
            showToast('Habit updated');
        } else {
            // Create new habit
            await createHabit(name, description);
            showToast('Habit created');
        }

        hapticFeedback('success');
        closeHabitModal();

        // Reload current tab
        if (currentTab === 'habits') {
            loadHabitsTab();
        } else if (currentTab === 'today') {
            loadTodayTab();
        }
    } catch (error) {
        console.error('Error saving habit:', error);
        showToast('Failed to save habit');
    }
}

/**
 * Toggle habit active/archived status
 */
async function toggleHabitActive(habitId) {
    closeAllDropdowns();

    try {
        const habit = await getHabit(habitId);
        habit.isActive = !habit.isActive;
        await updateHabit(habit);

        hapticFeedback('light');
        showToast(habit.isActive ? 'Habit reactivated' : 'Habit archived');
        loadHabitsTab();

        // Also update Today tab if switching there
        if (currentTab === 'today') {
            loadTodayTab();
        }
    } catch (error) {
        console.error('Error toggling habit:', error);
        showToast('Failed to update habit');
    }
}

/**
 * Show delete confirmation modal
 */
async function showDeleteConfirm(habitId) {
    closeAllDropdowns();
    deletingHabitId = habitId;

    const habit = await getHabit(habitId);
    const logCount = await countLogsForHabit(habitId);

    const message = logCount > 0
        ? `This will delete "${habit.name}" and ${logCount} days of history. This cannot be undone.`
        : `This will delete "${habit.name}". This cannot be undone.`;

    document.getElementById('delete-message').textContent = message;
    document.getElementById('delete-modal').classList.remove('hidden');
}

/**
 * Close delete confirmation modal
 */
function closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    deletingHabitId = null;
}

/**
 * Confirm and execute deletion
 */
async function confirmDelete() {
    if (!deletingHabitId) return;

    try {
        await deleteHabit(deletingHabitId);
        hapticFeedback('medium');
        showToast('Habit deleted');
        closeDeleteModal();
        loadHabitsTab();

        // Also update Today tab
        if (currentTab === 'today') {
            loadTodayTab();
        }
    } catch (error) {
        console.error('Error deleting habit:', error);
        showToast('Failed to delete habit');
    }
}
