/**
 * Enhanced Social Media Connect Functionality
 * This script provides a unified solution for social media connections
 * Replaces and combines functionality from social-connect.js, social-fix.js, and social-integration.js
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced social connect script loaded');
    
    // Initialize all social media functionality
    initSocialConnectFunctionality();
});

/**
 * Initialize all social media connect functionality
 */
function initSocialConnectFunctionality() {
    console.log('Initializing social connect functionality');
    
    // Set up global error handling
    setupErrorHandling();
    
    // Initialize social media buttons
    setupSocialButtons();
    
    // Check for OAuth redirects
    checkUrlForOAuthRedirect();
    
    // Update UI based on connection status
    updateConnectionStatus();
}

/**
 * Set up error handling to prevent black screens
 */
function setupErrorHandling() {
    window.addEventListener('error', function(event) {
        console.error('Global error caught:', event.error);
        cleanupModalBackdrops();
        return false;
    });
}

/**
 * Set up event listeners for all social media connect buttons in modals
 */
function setupSocialButtons() {
    const socialPlatforms = ['facebook', 'linkedin', 'google', 'instagram', 'twitter'];
    
    socialPlatforms.forEach(platform => {
        const buttonId = `${platform}ConnectBtn`;
        const button = document.getElementById(buttonId);
        
        if (button) {
            // Remove existing listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add new listener
            newButton.addEventListener('click', async function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                try {
                    if (!isUserLoggedIn()) {
                        showLoginPrompt();
                        return;
                    }
                    
                    const isConnected = localStorage.getItem(`${platform}Connected`) === 'true';
                    if (isConnected) {
                        if (confirm(`You are already connected to ${capitalizeFirstLetter(platform)}. Do you want to reconnect?`)) {
                            await handleSocialConnect(platform);
                        }
                    } else {
                        await handleSocialConnect(platform);
                    }
                } catch (error) {
                    console.error(`Error handling ${platform} connection:`, error);
                    showError(`Failed to connect to ${capitalizeFirstLetter(platform)}. Please try again.`);
                }
            });
        }
    });
}

/**
 * Handle social media connection
 * Redirects to appropriate OAuth endpoint with fallback for development
 */
async function handleSocialConnect(platform) {
    try {
        // Show loading state
        updateButtonState(platform, 'loading');
        
        // Check if we're in development/testing mode
        const isDevMode = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1' ||
                          window.location.protocol === 'file:';
        
        if (isDevMode) {
            // In development/testing mode, use the mock connection for demo purposes
            console.log(`Development mode: Simulating ${platform} connection`);
            
            // Simulate connection success with delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Update localStorage for compatibility with existing code
            localStorage.setItem(`${platform}Connected`, 'true');
            updateButtonState(platform, 'connected');
            showSuccess(`${capitalizeFirstLetter(platform)} connected successfully! (Development Mode)`); 
            return;
        }
        
        // Production mode - use real OAuth
        // Get the server base URL
        const serverBaseUrl = window.location.protocol + '//' + window.location.host;
        
        // Redirect to OAuth endpoint using the full server URL
        window.location.href = `${serverBaseUrl}/auth/${platform}`;
        
        // Note: The success state will be handled when redirected back from OAuth provider
    } catch (error) {
        console.error(`Error connecting to ${platform}:`, error);
        updateButtonState(platform, 'error');
        showError(`Failed to connect to ${capitalizeFirstLetter(platform)}. Please try again.`);
    }
}

/**
 * Update UI for social media connection
 */
function updateButtonState(platform, state) {
    const button = document.getElementById(`${platform}ConnectBtn`);
    if (!button) return;
    
    const states = {
        loading: {
            text: 'Connecting...',
            class: 'btn-secondary'
        },
        connected: {
            text: 'Connected',
            class: 'btn-success'
        },
        error: {
            text: 'Retry Connection',
            class: 'btn-danger'
        },
        default: {
            text: 'Connect',
            class: 'btn-primary'
        }
    };
    
    const buttonState = states[state] || states.default;
    button.innerHTML = buttonState.text;
    button.className = `btn ${buttonState.class}`;
}

/**
 * Update connection status indicators by checking with backend
 */
async function updateConnectionStatus() {
    const socialPlatforms = ['facebook', 'linkedin', 'google', 'instagram', 'twitter'];
    
    try {
        // Fetch connection status from server
        const response = await fetch('/api/auth/status');
        if (!response.ok) {
            throw new Error('Failed to fetch authentication status');
        }
        
        const data = await response.json();
        const connectedPlatforms = data.connectedPlatforms || {};
        
        // Update UI based on connected platforms
        socialPlatforms.forEach(platform => {
            const isConnected = connectedPlatforms[platform] && connectedPlatforms[platform].length > 0;
            updateButtonState(platform, isConnected ? 'connected' : 'default');
            
            // For backward compatibility
            if (isConnected) {
                localStorage.setItem(`${platform}Connected`, 'true');
            } else {
                localStorage.removeItem(`${platform}Connected`);
            }
        });
    } catch (error) {
        console.error('Error updating connection status:', error);
        
        // Fallback to localStorage if API fails
        socialPlatforms.forEach(platform => {
            const isConnected = localStorage.getItem(`${platform}Connected`) === 'true';
            updateButtonState(platform, isConnected ? 'connected' : 'default');
        });
    }
}

/**
 * Check if user is logged in
 */
function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

/**
 * Show login prompt
 */
function showLoginPrompt() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        try {
            if (window.bootstrap) {
                const modal = new bootstrap.Modal(loginModal);
                modal.show();
            } else if (window.jQuery) {
                $('#loginModal').modal('show');
            }
        } catch (e) {
            console.error('Error showing login modal:', e);
            alert('Please log in first before connecting social accounts');
        }
    }
}

/**
 * Show success message
 */
function showSuccess(message) {
    if (window.toastify) {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast();
    } else {
        alert(message);
    }
}

/**
 * Show error message
 */
function showError(message) {
    if (window.toastify) {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)"
        }).showToast();
    } else {
        alert(message);
    }
}

/**
 * Clean up modal backdrops
 */
function cleanupModalBackdrops() {
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => backdrop.remove());
}

/**
 * Helper function to capitalize first letter
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Check URL parameters on page load to handle OAuth redirects
 */
function checkUrlForOAuthRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get('platform');
    const status = urlParams.get('status');
    
    if (platform && status) {
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Handle OAuth redirect result
        if (status === 'connected') {
            showSuccess(`${capitalizeFirstLetter(platform)} connected successfully!`);
            // Update connection status
            updateConnectionStatus();
        } else if (status === 'error') {
            showError(`Failed to connect to ${capitalizeFirstLetter(platform)}. Please try again.`);
        }
    }
}

/**
 * Disconnect a platform
 */
async function disconnectPlatform(platform, userId) {
    try {
        updateButtonState(platform, 'loading');
        
        const response = await fetch(`/auth/disconnect/${platform}/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to disconnect');
        }
        
        const result = await response.json();
        
        if (result.success) {
            localStorage.removeItem(`${platform}Connected`);
            updateButtonState(platform, 'default');
            showSuccess(`${capitalizeFirstLetter(platform)} disconnected successfully!`);
        } else {
            throw new Error('Disconnection failed');
        }
    } catch (error) {
        console.error(`Error disconnecting from ${platform}:`, error);
        updateButtonState(platform, 'error');
        showError(`Failed to disconnect from ${capitalizeFirstLetter(platform)}. Please try again.`);
    }
}
