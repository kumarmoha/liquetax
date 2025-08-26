/**
 * OAuth Connection Functions
 * Handles social media OAuth connections
 */

/**
 * Connect to Facebook
 */
function connectFacebook() {
    showConnectionNotification('Connecting to Facebook...', 'info');
    window.location.href = '/auth/facebook';
}

/**
 * Connect to Instagram
 */
function connectInstagram() {
    showConnectionNotification('Connecting to Instagram...', 'info');
    window.location.href = '/auth/instagram';
}

/**
 * Connect to Twitter
 */
function connectTwitter() {
    showConnectionNotification('Connecting to Twitter...', 'info');
    window.location.href = '/auth/twitter';
}

/**
 * Connect to LinkedIn
 */
function connectLinkedIn() {
    showConnectionNotification('Connecting to LinkedIn...', 'info');
    window.location.href = '/auth/linkedin';
}

/**
 * Connect to Google
 */
function connectGoogle() {
    showConnectionNotification('Connecting to Google...', 'info');
    window.location.href = '/auth/google';
}

/**
 * Connect all social accounts
 */
function connectAllSocialAccounts() {
    showConnectionNotification('Starting social media connections...', 'info');
    
    // For now, just connect to Facebook first
    setTimeout(() => {
        connectFacebook();
    }, 1000);
}

/**
 * Check connection status and update UI
 */
async function checkConnectionStatus() {
    // Check URL parameters for connection status
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get('platform');
    const status = urlParams.get('status');
    
    if (platform && status) {
        if (status === 'connected') {
            showConnectionNotification(`Successfully connected to ${platform}!`, 'success');
            updateConnectionUI(platform, true);
            
            // Fetch user profile data
            await fetchUserProfile(platform);
        } else if (status === 'error') {
            showConnectionNotification(`Failed to connect to ${platform}. Please try again.`, 'error');
            updateConnectionUI(platform, false);
        }
        
        // Clean up URL parameters
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
    
    // Check all platforms for existing connections
    await checkAllPlatformConnections();
}

/**
 * Update connection UI for a platform
 */
function updateConnectionUI(platform, connected) {
    const statusElement = document.getElementById(`${platform}SettingsStatus`);
    const infoElement = document.getElementById(`${platform}AccountInfo`);
    
    if (statusElement) {
        if (connected) {
            statusElement.textContent = 'Connected';
            statusElement.className = 'badge bg-success';
        } else {
            statusElement.textContent = 'Not Connected';
            statusElement.className = 'badge bg-warning';
        }
    }
    
    if (infoElement && !connected) {
        infoElement.textContent = `No ${platform} account connected`;
        infoElement.style.color = '';
    }
}

/**
 * Fetch user profile data after successful connection
 */
async function fetchUserProfile(platform) {
    try {
        const response = await fetch(`/api/auth/profile/${platform}`);
        if (response.ok) {
            const profileData = await response.json();
            updateProfileUI(platform, profileData);
        }
    } catch (error) {
        console.error(`Error fetching ${platform} profile:`, error);
    }
}

/**
 * Check all platform connections
 */
async function checkAllPlatformConnections() {
    try {
        const response = await fetch('/api/auth/connected');
        if (response.ok) {
            const connectedPlatforms = await response.json();
            
            // Update UI for all platforms
            Object.keys(connectedPlatforms).forEach(platform => {
                const isConnected = connectedPlatforms[platform];
                updateConnectionUI(platform, isConnected);
                
                if (isConnected && connectedPlatforms[platform].profile) {
                    updateProfileUI(platform, connectedPlatforms[platform].profile);
                }
            });
        }
    } catch (error) {
        console.error('Error checking platform connections:', error);
    }
}

/**
 * Update profile UI with user data
 */
function updateProfileUI(platform, profileData) {
    const infoElement = document.getElementById(`${platform}AccountInfo`);
    
    if (infoElement && profileData) {
        let profileText = '';
        
        switch (platform) {
            case 'facebook':
                profileText = `Connected as: ${profileData.name}`;
                if (profileData.email) {
                    profileText += ` (${profileData.email})`;
                }
                break;
            case 'instagram':
                profileText = `Connected as: @${profileData.username}`;
                break;
            case 'twitter':
                profileText = `Connected as: ${profileData.username}`;
                break;
            case 'linkedin':
                profileText = `Connected as: ${profileData.firstName} ${profileData.lastName}`;
                break;
            case 'google':
                profileText = `Connected as: ${profileData.name}`;
                if (profileData.email) {
                    profileText += ` (${profileData.email})`;
                }
                break;
            default:
                profileText = `Connected as: ${profileData.name || profileData.username || 'User'}`;
        }
        
        infoElement.textContent = profileText;
        infoElement.style.color = '#28a745';
    }
}

/**
 * Enhanced notification function
 */
function showConnectionNotification(message, type = 'info') {
    if (typeof showNotification === 'function') {
        showNotification(message, type);
    } else if (typeof Toastify !== 'undefined') {
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'
        }).showToast();
    } else {
        // Fallback to browser alert
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

/**
 * Initialize OAuth connections
 */
function initializeOAuthConnections() {
    // Check for connection status on page load
    checkConnectionStatus();
    
    // Set up periodic status checks
    setInterval(checkConnectionStatus, 30000); // Check every 30 seconds
}

// Export functions globally
window.connectFacebook = connectFacebook;
window.connectInstagram = connectInstagram;
window.connectTwitter = connectTwitter;
window.connectLinkedIn = connectLinkedIn;
window.connectGoogle = connectGoogle;
window.connectAllSocialAccounts = connectAllSocialAccounts;

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOAuthConnections);
} else {
    initializeOAuthConnections();
}