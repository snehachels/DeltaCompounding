/**
 * Main Application Logic
 * Handles navigation, initialization, and global state
 */

// Current active tab
let currentTab = 'today';

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize authentication first
        // This will handle showing auth screen or app based on auth state
        await initAuth();
        console.log('Auth initialized');
    } catch (error) {
        console.error('Failed to initialize auth:', error);
        showToast('Failed to load app. Please refresh.');
    }
});

/**
 * Initialize app after authentication is confirmed
 * Called from auth.js when user is authenticated
 */
async function initAppAfterAuth() {
    try {
        // Initialize database for the current user
        await initDB();
        console.log('App initialized for user');

        // Set up navigation
        setupNavigation();

        // Set up global event listeners
        setupEventListeners();

        // Load initial tab
        switchTab('today');
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showToast('Failed to load app. Please refresh.');
    }
}

/**
 * Set up tab navigation
 */
function setupNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
}

/**
 * Switch to a different tab
 */
function switchTab(tab) {
    currentTab = tab;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `${tab}-tab`);
    });

    // Update header
    updateHeader(tab);

    // Load tab content
    loadTabContent(tab);
}

/**
 * Update header based on current tab
 */
function updateHeader(tab) {
    const titleEl = document.getElementById('page-title');
    const subtitleEl = document.getElementById('page-subtitle');
    const fabBtn = document.getElementById('fab-add');

    switch (tab) {
        case 'today':
            titleEl.textContent = 'Today';
            subtitleEl.textContent = formatDate(new Date());
            if (fabBtn) fabBtn.classList.add('hidden');
            break;
        case 'habits':
            titleEl.textContent = 'My Habits';
            subtitleEl.textContent = '';
            if (fabBtn) fabBtn.classList.remove('hidden');
            break;
        case 'history':
            titleEl.textContent = 'History';
            subtitleEl.textContent = '';
            if (fabBtn) fabBtn.classList.add('hidden');
            break;
        case 'insights':
            titleEl.textContent = 'Insights';
            subtitleEl.textContent = '';
            if (fabBtn) fabBtn.classList.add('hidden');
            break;
    }
}

/**
 * Load content for a tab
 */
function loadTabContent(tab) {
    switch (tab) {
        case 'today':
            loadTodayTab();
            break;
        case 'habits':
            loadHabitsTab();
            break;
        case 'history':
            loadHistoryTab();
            break;
        case 'insights':
            loadInsightsTab();
            break;
    }
}

/**
 * Set up global event listeners
 */
function setupEventListeners() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.habit-menu')) {
            closeAllDropdowns();
        }
        // Close user menu when clicking outside
        if (!e.target.closest('.user-menu')) {
            const userMenu = document.getElementById('user-menu-dropdown');
            if (userMenu) {
                userMenu.classList.remove('show');
            }
        }
    });

    // Form character counts
    const nameInput = document.getElementById('habit-name');
    const descInput = document.getElementById('habit-description');
    const nameCount = document.getElementById('name-count');
    const descCount = document.getElementById('desc-count');

    if (nameInput && nameCount) {
        nameInput.addEventListener('input', () => {
            nameCount.textContent = nameInput.value.length;
        });
    }

    if (descInput && descCount) {
        descInput.addEventListener('input', () => {
            descCount.textContent = descInput.value.length;
        });
    }

    // History range change
    const historyRange = document.getElementById('history-range');
    if (historyRange) {
        historyRange.addEventListener('change', () => {
            loadHistoryTab();
        });
    }

    // Insights range change
    const insightsRange = document.getElementById('insights-range');
    if (insightsRange) {
        insightsRange.addEventListener('change', () => {
            loadInsightsTab();
        });
    }
}

/**
 * Close all dropdown menus
 */
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
        menu.classList.remove('show');
    });
}

/**
 * Format date as "Saturday, Jan 24"
 */
function formatDate(date) {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format date as "Jan 24"
 */
function formatShortDate(date) {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format date as "Sat 24"
 */
function formatDayDate(date) {
    const options = { weekday: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Show toast notification
 */
function showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

/**
 * Trigger haptic feedback if available
 */
function hapticFeedback(type = 'light') {
    if ('vibrate' in navigator) {
        switch (type) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(20);
                break;
            case 'success':
                navigator.vibrate([10, 50, 10]);
                break;
        }
    }
}

/**
 * Truncate string to max length
 */
function truncate(str, maxLength) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 1) + '...';
}
