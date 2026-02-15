/**
 * Authentication Module
 * Handles user sign up, sign in, sign out, and auth state
 */

// Current user ID (set when authenticated)
let currentUserId = null;

/**
 * Initialize authentication
 * Sets up auth state listener and handles UI state
 */
function initAuth() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in
                currentUserId = user.uid;
                showApp(user);
                resolve(user);
            } else {
                // User is signed out
                currentUserId = null;
                showAuthScreen();
                resolve(null);
            }
        });
    });
}

/**
 * Sign up with email and password
 */
async function signUp(email, password) {
    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        return { success: true, user: result.user };
    } catch (error) {
        console.error('Sign up error:', error);
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

/**
 * Sign in with email and password
 */
async function signIn(email, password) {
    try {
        const result = await auth.signInWithEmailAndPassword(email, password);
        return { success: true, user: result.user };
    } catch (error) {
        console.error('Sign in error:', error);
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

/**
 * Sign out the current user
 */
async function signOutUser() {
    try {
        await auth.signOut();
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error);
        return { success: false, error: 'Failed to sign out' };
    }
}

/**
 * Get the current user ID
 */
function getCurrentUserId() {
    return currentUserId;
}

/**
 * Show the main app (hide auth screen)
 */
function showApp(user) {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('app-content').classList.remove('hidden');

    // Update user display
    const userEmail = document.getElementById('user-email');
    if (userEmail) {
        userEmail.textContent = user.email;
    }

    // Initialize the app
    initAppAfterAuth();
}

/**
 * Show the auth screen (hide main app)
 */
function showAuthScreen() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('app-content').classList.add('hidden');

    // Reset form
    resetAuthForm();
}

/**
 * Reset auth form to initial state
 */
function resetAuthForm() {
    document.getElementById('auth-email').value = '';
    document.getElementById('auth-password').value = '';
    document.getElementById('auth-error').textContent = '';
    document.getElementById('auth-error').classList.add('hidden');
    switchToSignIn();
}

/**
 * Switch to sign in mode
 */
function switchToSignIn() {
    document.getElementById('auth-title').textContent = 'Welcome back';
    document.getElementById('auth-submit').textContent = 'Sign In';
    document.getElementById('auth-switch-text').innerHTML =
        'Don\'t have an account? <a href="#" onclick="switchToSignUp(); return false;">Sign up</a>';
    document.getElementById('auth-form').dataset.mode = 'signin';
}

/**
 * Switch to sign up mode
 */
function switchToSignUp() {
    document.getElementById('auth-title').textContent = 'Create account';
    document.getElementById('auth-submit').textContent = 'Sign Up';
    document.getElementById('auth-switch-text').innerHTML =
        'Already have an account? <a href="#" onclick="switchToSignIn(); return false;">Sign in</a>';
    document.getElementById('auth-form').dataset.mode = 'signup';
}

/**
 * Handle auth form submission
 */
async function handleAuthSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const mode = document.getElementById('auth-form').dataset.mode;
    const errorEl = document.getElementById('auth-error');
    const submitBtn = document.getElementById('auth-submit');

    // Validate inputs
    if (!email || !password) {
        showAuthError('Please fill in all fields');
        return;
    }

    if (password.length < 6) {
        showAuthError('Password must be at least 6 characters');
        return;
    }

    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.textContent = mode === 'signin' ? 'Signing in...' : 'Creating account...';
    errorEl.classList.add('hidden');

    try {
        let result;
        if (mode === 'signup') {
            result = await signUp(email, password);
        } else {
            result = await signIn(email, password);
        }

        if (!result.success) {
            showAuthError(result.error);
            submitBtn.disabled = false;
            submitBtn.textContent = mode === 'signin' ? 'Sign In' : 'Sign Up';
        }
        // If successful, onAuthStateChanged will handle the UI update
    } catch (error) {
        showAuthError('An unexpected error occurred');
        submitBtn.disabled = false;
        submitBtn.textContent = mode === 'signin' ? 'Sign In' : 'Sign Up';
    }
}

/**
 * Show auth error message
 */
function showAuthError(message) {
    const errorEl = document.getElementById('auth-error');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
}

/**
 * Handle sign out button click
 */
async function handleSignOut() {
    const result = await signOutUser();
    if (!result.success) {
        showToast(result.error);
    }
}

/**
 * Toggle user menu dropdown
 */
function toggleUserMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('user-menu-dropdown');
    menu.classList.toggle('show');
}

/**
 * Get user-friendly error message
 */
function getAuthErrorMessage(code) {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'An account with this email already exists';
        case 'auth/invalid-email':
            return 'Please enter a valid email address';
        case 'auth/weak-password':
            return 'Password must be at least 6 characters';
        case 'auth/user-not-found':
            return 'No account found with this email';
        case 'auth/wrong-password':
            return 'Incorrect password';
        case 'auth/invalid-credential':
            return 'Invalid email or password';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection';
        default:
            return 'An error occurred. Please try again';
    }
}
