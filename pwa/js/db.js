/**
 * Database Layer using Firestore
 * Handles all persistent data storage for habits and daily logs
 * All data is scoped to the current authenticated user
 */

// Database state
let dbInitialized = false;

/**
 * Initialize the database for the current user
 * Called after authentication is confirmed
 */
function initDB() {
    return new Promise((resolve, reject) => {
        const userId = getCurrentUserId();
        if (!userId) {
            reject(new Error('User not authenticated'));
            return;
        }
        dbInitialized = true;
        console.log('Database initialized for user:', userId);
        resolve();
    });
}

/**
 * Get the user's habits collection reference
 */
function getHabitsCollection() {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return firestore.collection('users').doc(userId).collection('habits');
}

/**
 * Get the user's logs collection reference
 */
function getLogsCollection() {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    return firestore.collection('users').doc(userId).collection('logs');
}

/**
 * Generate a UUID
 */
function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Get start of day for a date
 */
function startOfDay(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Get today's date (start of day)
 */
function getToday() {
    return startOfDay(new Date());
}

// ==================== HABITS ====================

/**
 * Get all habits
 */
async function getAllHabits() {
    const snapshot = await getHabitsCollection()
        .orderBy('orderIndex', 'asc')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

/**
 * Get active habits only
 */
async function getActiveHabits() {
    const habits = await getAllHabits();
    return habits.filter(h => h.isActive);
}

/**
 * Get a single habit by ID
 */
async function getHabit(id) {
    const doc = await getHabitsCollection().doc(id).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() };
}

/**
 * Create a new habit
 */
async function createHabit(name, description = '') {
    const habits = await getAllHabits();
    const maxOrder = habits.reduce((max, h) => Math.max(max, h.orderIndex || 0), -1);

    const habit = {
        name: name.trim(),
        description: description.trim(),
        isActive: true,
        createdAt: new Date().toISOString(),
        orderIndex: maxOrder + 1
    };

    const id = generateId();
    await getHabitsCollection().doc(id).set(habit);

    return { id, ...habit };
}

/**
 * Update a habit
 */
async function updateHabit(habit) {
    const { id, ...data } = habit;
    await getHabitsCollection().doc(id).update(data);
    return habit;
}

/**
 * Delete a habit and its logs
 */
async function deleteHabit(id) {
    const batch = firestore.batch();

    // Delete habit
    batch.delete(getHabitsCollection().doc(id));

    // Delete all logs for this habit
    const logsSnapshot = await getLogsCollection()
        .where('habitId', '==', id)
        .get();

    logsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}

/**
 * Reorder habits
 */
async function reorderHabits(orderedIds) {
    const batch = firestore.batch();

    for (let i = 0; i < orderedIds.length; i++) {
        const habitRef = getHabitsCollection().doc(orderedIds[i]);
        batch.update(habitRef, { orderIndex: i });
    }

    await batch.commit();
}

// ==================== DAILY LOGS ====================

/**
 * Get log for a habit on a specific date
 */
async function getLog(habitId, date) {
    const dateStr = startOfDay(date).toISOString();

    const snapshot = await getLogsCollection()
        .where('habitId', '==', habitId)
        .where('date', '==', dateStr)
        .limit(1)
        .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
}

/**
 * Get all logs for a habit
 */
async function getLogsForHabit(habitId) {
    const snapshot = await getLogsCollection()
        .where('habitId', '==', habitId)
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

/**
 * Get all logs for a date range
 */
async function getLogsInRange(startDate, endDate) {
    const start = startOfDay(startDate).toISOString();
    const end = startOfDay(endDate).toISOString();

    const snapshot = await getLogsCollection()
        .where('date', '>=', start)
        .where('date', '<=', end)
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
}

/**
 * Toggle completion status for a habit on a date
 */
async function toggleCompletion(habitId, date) {
    const dateStr = startOfDay(date).toISOString();
    let log = await getLog(habitId, date);

    if (log) {
        // Toggle existing log
        log.completed = !log.completed;
        log.completedAt = log.completed ? new Date().toISOString() : null;
        await getLogsCollection().doc(log.id).update({
            completed: log.completed,
            completedAt: log.completedAt
        });
    } else {
        // Create new log
        const id = generateId();
        log = {
            id: id,
            habitId: habitId,
            date: dateStr,
            completed: true,
            completedAt: new Date().toISOString()
        };
        await getLogsCollection().doc(id).set({
            habitId: log.habitId,
            date: log.date,
            completed: log.completed,
            completedAt: log.completedAt
        });
    }

    return log;
}

/**
 * Check if a habit is completed on a date
 */
async function isCompleted(habitId, date) {
    const log = await getLog(habitId, date);
    return log ? log.completed : false;
}

// ==================== STATISTICS ====================

/**
 * Calculate completion statistics for a date range
 */
async function getStatistics(startDate, endDate) {
    const habits = await getActiveHabits();
    const logs = await getLogsInRange(startDate, endDate);

    // Create a map of logs by habitId and date
    const logMap = new Map();
    logs.forEach(log => {
        const key = `${log.habitId}_${log.date}`;
        logMap.set(key, log);
    });

    // Calculate stats per habit
    const habitStats = [];
    let totalCompleted = 0;
    let totalPossible = 0;

    const start = startOfDay(startDate);
    const end = startOfDay(endDate);

    for (const habit of habits) {
        const habitCreated = startOfDay(new Date(habit.createdAt));
        let completed = 0;
        let possible = 0;

        // Iterate through each day
        let current = new Date(start);
        while (current <= end) {
            // Only count days after habit was created
            if (current >= habitCreated) {
                possible++;
                const key = `${habit.id}_${current.toISOString()}`;
                const log = logMap.get(key);
                if (log && log.completed) {
                    completed++;
                }
            }
            current.setDate(current.getDate() + 1);
        }

        const rate = possible > 0 ? (completed / possible) * 100 : 0;
        habitStats.push({
            habit: habit,
            completed: completed,
            possible: possible,
            rate: rate
        });

        totalCompleted += completed;
        totalPossible += possible;
    }

    // Sort by rate descending
    habitStats.sort((a, b) => b.rate - a.rate);

    return {
        totalCompleted,
        totalPossible,
        overallRate: totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0,
        habitStats,
        mostConsistent: habitStats[0] || null,
        leastConsistent: habitStats[habitStats.length - 1] || null
    };
}

/**
 * Get history data for the grid view
 */
async function getHistoryData(days) {
    const habits = await getActiveHabits();
    const today = getToday();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days + 1);

    const logs = await getLogsInRange(startDate, today);

    // Create a map for quick lookup
    const logMap = new Map();
    logs.forEach(log => {
        const key = `${log.habitId}_${log.date}`;
        logMap.set(key, log);
    });

    // Generate dates array (most recent first)
    const dates = [];
    for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date);
    }

    // Build the grid data
    const gridData = habits.map(habit => {
        const habitCreated = startOfDay(new Date(habit.createdAt));
        const cells = dates.map(date => {
            const dateStr = startOfDay(date).toISOString();
            const key = `${habit.id}_${dateStr}`;
            const log = logMap.get(key);
            const isToday = date.toDateString() === today.toDateString();
            const isApplicable = date >= habitCreated;

            return {
                date: date,
                isToday: isToday,
                isApplicable: isApplicable,
                completed: log ? log.completed : false
            };
        });

        return {
            habit: habit,
            cells: cells
        };
    });

    return {
        dates: dates,
        habits: gridData
    };
}

/**
 * Count total logs for a habit (for delete confirmation)
 */
async function countLogsForHabit(habitId) {
    const logs = await getLogsForHabit(habitId);
    return logs.length;
}
