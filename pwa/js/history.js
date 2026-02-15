/**
 * History Tab Logic
 * Display habit completion history in a grid
 */

/**
 * Load the History tab
 */
async function loadHistoryTab() {
    const days = parseInt(document.getElementById('history-range').value);
    const habits = await getActiveHabits();

    const gridEl = document.getElementById('history-grid');
    const emptyEl = document.getElementById('history-empty');

    if (habits.length === 0) {
        gridEl.innerHTML = '';
        emptyEl.classList.remove('hidden');
        return;
    }

    emptyEl.classList.add('hidden');

    // Get history data
    const historyData = await getHistoryData(days);

    // Build the table
    gridEl.innerHTML = createHistoryTable(historyData);
}

/**
 * Create the history table HTML
 */
function createHistoryTable(data) {
    const { dates, habits } = data;
    const today = getToday();

    // Header row with dates
    let headerCells = '<th></th>'; // Empty corner cell
    dates.forEach(date => {
        const isToday = date.toDateString() === today.toDateString();
        const dateClass = isToday ? 'date-today' : '';
        headerCells += `<th class="${dateClass}">${formatDayDate(date)}</th>`;
    });

    // Data rows
    let rows = '';
    habits.forEach(({ habit, cells }) => {
        let rowCells = `<td>${truncate(habit.name, 12)}</td>`;

        cells.forEach(cell => {
            let dotClass = '';
            if (!cell.isApplicable) {
                dotClass = ''; // Empty cell
            } else if (cell.completed) {
                dotClass = 'completed';
            } else if (cell.isToday) {
                dotClass = 'today-incomplete';
            } else {
                dotClass = 'missed';
            }

            const dotHtml = dotClass ? `<div class="history-dot ${dotClass}"></div>` : '';
            rowCells += `<td><div class="history-cell">${dotHtml}</div></td>`;
        });

        rows += `<tr>${rowCells}</tr>`;
    });

    return `
        <table class="history-table">
            <thead>
                <tr>${headerCells}</tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;
}
