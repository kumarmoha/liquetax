/**
 * Authentication System
 * Handles OAuth flows for all social media platforms
 */

class AuthSystem {
    constructor() {
        this.initializeFacebookSDK();
        this.initializeGoogleAPI();
        this.setupEventListeners();
    }

    /**
     * Initialize Facebook SDK
     */
    initializeFacebookSDK() {
        window.fbAsyncInit = function() {
            FB.init({
                appId: '392832006062324', // Replace with actual App ID
                cookie: true,
                xfbml: true,
                version: 'v18.0'
            });

            FB.AppEvents.logPageView();
            console.log('Facebook SDK initialized');
        };
    }

    /**
     * Initialize Google API
     */
    initializeGoogleAPI() {
        window.gapi = window.gapi || {};
        if (typeof gapi !== 'undefined' && gapi.load) {
            gapi.load('auth2', () => {
                gapi.auth2.init({
                    client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'
                }).then(() => {
                    console.log('Google API initialized');
                });
            });
        }
    }

    /**
     * Setup event listeners for social connect buttons
     */
    setupEventListeners() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindButtons());
        } else {
            this.bindButtons();
        }
    }

    /**
     * Bind click events to social media buttons
     */
    bindButtons() {
        const platforms = ['facebook', 'google', 'linkedin', 'instagram', 'twitter'];
        
        platforms.forEach(platform => {
            const button = document.getElementById(`${platform}ConnectBtn`);
            if (button) {
                button.onclick = (e) => {
                    e.preventDefault();
                    this.connectPlatform(platform);
                };
                console.log(`${platform} button connected`);
            }
        });
    }

    /**
     * Connect to social media platform
     */
    async connectPlatform(platform) {
        console.log(`Connecting to ${platform}...`);
        
        switch (platform) {
            case 'facebook':
                return this.connectFacebook();
            case 'google':
                return this.connectGoogle();
            case 'linkedin':
                return this.connectLinkedIn();
            case 'instagram':
                return this.connectInstagram();
            case 'twitter':
                return this.connectTwitter();
            default:
                console.error(`Unknown platform: ${platform}`);
        }
    }

    /**
     * Facebook OAuth flow
     */
    connectFacebook() {
        return new Promise((resolve, reject) => {
            FB.login((response) => {
                if (response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                    
                    // Get user info
                    FB.api('/me', { fields: 'name,email,picture' }, (userInfo) => {
                        const connectionData = {
                            platform: 'facebook',
                            accessToken: accessToken,
                            userInfo: userInfo,
                            connectedAt: new Date().toISOString()
                        };
                        
                        // Store connection data
                        localStorage.setItem('facebookConnection', JSON.stringify(connectionData));
                        localStorage.setItem('facebookConnected', 'true');
                        
                        // Update UI
                        this.updateConnectionStatus('facebook', true, userInfo);
                        
                        // Show success message
                        this.showNotification('Successfully connected to Facebook!', 'success');
                        
                        resolve(connectionData);
                    });
                } else {
                    this.showNotification('Facebook connection cancelled', 'warning');
                    reject(new Error('Facebook login cancelled'));
                }
            }, { scope: 'public_profile,email,pages_manage_posts' });
        });
    }

    /**
     * Google OAuth flow
     */
    connectGoogle() {
        return new Promise((resolve, reject) => {
            if (typeof gapi === 'undefined' || !gapi.auth2) {
                this.showNotification('Google API not loaded', 'error');
                reject(new Error('Google API not available'));
                return;
            }

            const authInstance = gapi.auth2.getAuthInstance();
            authInstance.signIn().then((googleUser) => {
                const profile = googleUser.getBasicProfile();
                const accessToken = googleUser.getAuthResponse().access_token;
                
                const connectionData = {
                    platform: 'google',
                    accessToken: accessToken,
                    userInfo: {
                        id: profile.getId(),
                        name: profile.getName(),
                        email: profile.getEmail(),
                        picture: profile.getImageUrl()
                    },
                    connectedAt: new Date().toISOString()
                };
                
                // Store connection data
                localStorage.setItem('googleConnection', JSON.stringify(connectionData));
                localStorage.setItem('googleConnected', 'true');
                
                // Update UI
                this.updateConnectionStatus('google', true, connectionData.userInfo);
                
                // Show success message
                this.showNotification('Successfully connected to Google!', 'success');
                
                resolve(connectionData);
            }).catch((error) => {
                this.showNotification('Google connection failed', 'error');
                reject(error);
            });
        });
    }

    /**
     * LinkedIn OAuth flow (opens popup)
     */
    connectLinkedIn() {
        const clientId = 'YOUR_LINKEDIN_CLIENT_ID';
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/linkedin/callback');
        const scope = encodeURIComponent('r_liteprofile r_emailaddress w_member_social');
        
        const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
        
        // Open popup for LinkedIn OAuth
        const popup = window.open(linkedinUrl, 'LinkedInAuth', 'width=500,height=600,scrollbars=yes,resizable=yes');
        
        // Listen for popup close or message
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkClosed);
                this.showNotification('LinkedIn connection cancelled', 'warning');
            }
        }, 1000);
        
        // Listen for auth success message
        window.addEventListener('message', (event) => {
            if (event.data.type === 'LINKEDIN_AUTH_SUCCESS') {
                clearInterval(checkClosed);
                popup.close();
                
                // Store connection data
                localStorage.setItem('linkedinConnection', JSON.stringify(event.data.connectionData));
                localStorage.setItem('linkedinConnected', 'true');
                
                // Update UI
                this.updateConnectionStatus('linkedin', true, event.data.connectionData.userInfo);
                this.showNotification('Successfully connected to LinkedIn!', 'success');
            }
        });
    }

    /**
     * Instagram OAuth flow
     */
    connectInstagram() {
        const clientId = 'YOUR_INSTAGRAM_CLIENT_ID';
        const redirectUri = encodeURIComponent(window.location.origin + '/auth/instagram/callback');
        const scope = encodeURIComponent('user_profile,user_media');
        
        const instagramUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
        
        // Open popup for Instagram OAuth
        const popup = window.open(instagramUrl, 'InstagramAuth', 'width=500,height=600,scrollbars=yes,resizable=yes');
        
        // Similar popup handling as LinkedIn
        this.handleOAuthPopup(popup, 'instagram', 'Instagram');
    }

    /**
     * Twitter OAuth flow
     */
    connectTwitter() {
        // Twitter OAuth 2.0 requires server-side implementation
        // Redirect to server endpoint that handles Twitter OAuth
        window.location.href = '/auth/twitter';
    }

    /**
     * Handle OAuth popup for Instagram and LinkedIn
     */
    handleOAuthPopup(popup, platform, platformName) {
        const checkClosed = setInterval(() => {
            if (popup.closed) {
                clearInterval(checkClosed);
                this.showNotification(`${platformName} connection cancelled`, 'warning');
            }
        }, 1000);
        
        window.addEventListener('message', (event) => {
            if (event.data.type === `${platform.toUpperCase()}_AUTH_SUCCESS`) {
                clearInterval(checkClosed);
                popup.close();
                
                localStorage.setItem(`${platform}Connection`, JSON.stringify(event.data.connectionData));
                localStorage.setItem(`${platform}Connected`, 'true');
                
                this.updateConnectionStatus(platform, true, event.data.connectionData.userInfo);
                this.showNotification(`Successfully connected to ${platformName}!`, 'success');
            }
        });
    }

    /**
     * Update connection status in UI
     */
    updateConnectionStatus(platform, connected, userInfo = null) {
        const platformElement = document.querySelector(`[data-platform="${platform}"]`);
        if (!platformElement) return;
        
        const badge = platformElement.querySelector('.badge');
        const button = platformElement.querySelector('.btn');
        
        if (badge) {
            if (connected) {
                badge.textContent = 'Connected';
                badge.className = 'badge bg-success ms-2';
            } else {
                badge.textContent = 'Not Connected';
                badge.className = 'badge bg-warning ms-2';
            }
        }
        
        if (button) {
            if (connected) {
                button.innerHTML = '<i class="fas fa-check me-1"></i> Connected';
                button.className = 'btn btn-success btn-sm';
                if (userInfo) {
                    button.title = `Connected as ${userInfo.name}`;
                }
            } else {
                button.innerHTML = '<i class="fas fa-link me-1"></i> Connect';
                button.className = 'btn btn-primary btn-sm';
                button.title = `Connect to ${platform}`;
            }
        }
        
        // Update social media module if available
        if (window.socialMedia && window.socialMedia.updateAllConnectionStatus) {
            window.socialMedia.updateAllConnectionStatus();
        }
    }

    /**
     * Disconnect from platform
     */
    disconnectPlatform(platform) {
        // Remove stored data
        localStorage.removeItem(`${platform}Connection`);
        localStorage.removeItem(`${platform}Connected`);
        
        // Update UI
        this.updateConnectionStatus(platform, false);
        
        // Platform-specific logout
        switch (platform) {
            case 'facebook':
                if (typeof FB !== 'undefined') {
                    FB.logout();
                }
                break;
            case 'google':
                if (typeof gapi !== 'undefined' && gapi.auth2) {
                    gapi.auth2.getAuthInstance().signOut();
                }
                break;
        }
        
        this.showNotification(`Disconnected from ${platform}`, 'info');
    }

    /**
     * Check connection status on page load
     */
    checkConnectionStatus() {
        const platforms = ['facebook', 'google', 'linkedin', 'instagram', 'twitter'];
        
        platforms.forEach(platform => {
            const connected = localStorage.getItem(`${platform}Connected`) === 'true';
            const connectionData = localStorage.getItem(`${platform}Connection`);
            
            if (connected && connectionData) {
                const data = JSON.parse(connectionData);
                this.updateConnectionStatus(platform, true, data.userInfo);
            }
        });
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Use existing notification system or create a simple one
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
            // Fallback to alert for now
            alert(message);
        }
    }
}

// Initialize auth system when DOM is ready
let authSystem;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        authSystem = new AuthSystem();
        authSystem.checkConnectionStatus();
    });
} else {
    authSystem = new AuthSystem();
    authSystem.checkConnectionStatus();
}

// Export for global access
window.authSystem = authSystem;
