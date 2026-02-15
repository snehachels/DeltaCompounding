/**
 * Insights Tab Logic
 * Display statistics and patterns
 */

/**
 * Load the Insights tab
 */
async function loadInsightsTab() {
    const days = parseInt(document.getElementById('insights-range').value);
    const habits = await getActiveHabits();

    const cardsEl = document.getElementById('insights-cards');
    const emptyEl = document.getElementById('insights-empty');

    if (habits.length === 0) {
        cardsEl.innerHTML = '';
        emptyEl.classList.remove('hidden');
        return;
    }

    emptyEl.classList.add('hidden');

    // Calculate date range
    const today = getToday();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - days + 1);

    // Get statistics
    const stats = await getStatistics(startDate, today);

    // Build cards
    let html = '';

    // Overall Consistency Card
    html += createOverallCard(stats, days);

    // By Habit Card
    if (stats.habitStats.length > 0) {
        html += createByHabitCard(stats.habitStats);
    }

    // Most Consistent Card
    if (stats.mostConsistent && stats.habitStats.length > 1) {
        html += createMostConsistentCard(stats.mostConsistent, days);
    }

    // Room for Growth Card
    if (stats.leastConsistent && stats.leastConsistent.rate < 50 && stats.habitStats.length > 1) {
        html += createLeastConsistentCard(stats.leastConsistent, days);
    }

    cardsEl.innerHTML = html;
}

/**
 * Get time range label
 */
function getRangeLabel(days) {
    if (days === 7) return 'this week';
    if (days === 30) return 'this month';
    return `last ${days} days`;
}

/**
 * Create overall consistency card
 */
function createOverallCard(stats, days) {
    const percentage = Math.round(stats.overallRate);

    return `
        <div class="insight-card">
            <h3>Overall Consistency</h3>
            <div class="insight-percentage">${percentage}%</div>
            <p class="insight-detail">
                You completed ${stats.totalCompleted} out of ${stats.totalPossible} habit instances ${getRangeLabel(days)}.
            </p>
        </div>
    `;
}

/**
 * Create by-habit breakdown card
 */
function createByHabitCard(habitStats) {
    const items = habitStats.map(item => {
        const percentage = Math.round(item.rate);
        return `
            <div class="progress-item">
                <div class="progress-item-header">
                    <span class="progress-item-name">${truncate(item.habit.name, 20)}</span>
                    <span class="progress-item-value">${percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="insight-card">
            <h3>By Habit</h3>
            <div class="progress-bar-container">
                ${items}
            </div>
        </div>
    `;
}

/**
 * Create most consistent habit card
 */
function createMostConsistentCard(item, days) {
    const percentage = Math.round(item.rate);

    return `
        <div class="insight-card">
            <h3>Most Consistent</h3>
            <p class="insight-detail">
                Your most consistent habit is "${item.habit.name}" at ${percentage}% completion over ${days} days.
            </p>
        </div>
    `;
}

/**
 * Create least consistent habit card
 */
function createLeastConsistentCard(item, days) {
    const percentage = Math.round(item.rate);

    return `
        <div class="insight-card">
            <h3>Room for Growth</h3>
            <p class="insight-detail">
                "${item.habit.name}" has been completed ${percentage}% of the time ${getRangeLabel(days)}.
            </p>
        </div>
    `;
}
