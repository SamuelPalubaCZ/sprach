/**
 * Main Application Entry Point
 * Initializes all modules and starts the Numbers Station Simulator
 */

import { initializeUI } from './ui.js';

/**
 * Application initialization
 */
async function initializeApp() {
    try {
        console.log('Starting Numbers Station Simulator...');
        
        // Show loading state
        showLoadingState();
        
        // Initialize UI system (which will initialize other modules)
        const success = await initializeUI();
        
        if (success) {
            console.log('Numbers Station Simulator initialized successfully');
            hideLoadingState();
            showWelcomeMessage();
        } else {
            throw new Error('UI initialization failed');
        }
        
    } catch (error) {
        console.error('Application initialization failed:', error);
        showErrorState(error.message);
    }
}

/**
 * Show loading state
 */
function showLoadingState() {
    const statusDisplay = document.getElementById('statusDisplay');
    if (statusDisplay) {
        statusDisplay.textContent = 'Initializing audio system...';
        statusDisplay.className = 'status info';
    }
    
    // Disable controls during initialization
    const controls = document.querySelectorAll('button, input, select');
    controls.forEach(control => {
        control.disabled = true;
    });
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    // Re-enable controls
    const controls = document.querySelectorAll('button, input, select');
    controls.forEach(control => {
        control.disabled = false;
    });
    
    // Special handling for transport controls (will be managed by UI state)
    const stopButton = document.getElementById('stopButton');
    if (stopButton) {
        stopButton.disabled = true;
    }
}

/**
 * Show welcome message
 */
function showWelcomeMessage() {
    const statusDisplay = document.getElementById('statusDisplay');
    if (statusDisplay) {
        statusDisplay.textContent = 'Ready - Enter message to begin';
        statusDisplay.className = 'status info';
    }
}

/**
 * Show error state
 */
function showErrorState(message) {
    const statusDisplay = document.getElementById('statusDisplay');
    if (statusDisplay) {
        statusDisplay.textContent = `Initialization failed: ${message}`;
        statusDisplay.className = 'status error';
    }
    
    // Keep controls disabled on error
    console.error('Application in error state');
}

/**
 * Handle unhandled errors
 */
window.addEventListener('error', (event) => {
    console.error('Unhandled error:', event.error);
    
    const statusDisplay = document.getElementById('statusDisplay');
    if (statusDisplay) {
        statusDisplay.textContent = 'Application error occurred';
        statusDisplay.className = 'status error';
    }
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    const statusDisplay = document.getElementById('statusDisplay');
    if (statusDisplay) {
        statusDisplay.textContent = 'Application error occurred';
        statusDisplay.className = 'status error';
    }
});

/**
 * Export for debugging
 */
window.NumbersStation = {
    version: '1.0.0',
    initialized: false
};

/**
 * Start the application when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initializeApp().then(() => {
            window.NumbersStation.initialized = true;
        }).catch(() => {
            window.NumbersStation.initialized = false;
        });
    });
} else {
    // DOM is already ready
    initializeApp().then(() => {
        window.NumbersStation.initialized = true;
    }).catch(() => {
        window.NumbersStation.initialized = false;
    });
}