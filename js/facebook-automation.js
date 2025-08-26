/**
 * Facebook Automation System
 * Enhanced Facebook integration with automated posting capabilities
 */

class FacebookAutomation {
    constructor() {
        this.isConnected = false;
        this.pageAccessToken = null;
        this.pageId = null;
        this.scheduledPosts = [];
        this.postingQueue = [];
        this.autoPostingEnabled = false;
        
        this.init();
    }

    /**
     * Initialize Facebook automation
     */
    init() {
        console.log('Initializing Facebook Automation...');
        
        // Load saved settings
        this.loadSettings();
        
        // Set up Facebook SDK
        this.initializeFacebookSDK();
        
        // Set up UI event listeners
        this.setupEventListeners();
        
        // Start automation if enabled
        if (this.autoPostingEnabled) {
            this.startAutomation();
        }
    }

    /**
     * Initialize Facebook SDK
     */
    initializeFacebookSDK() {
        window.fbAsyncInit = () => {
            FB.init({
                appId: '392832006062324', // Your Facebook App ID
                cookie: true,
                xfbml: true,
                version: 'v23.0' // Updated to match main page // Updated to match main page
            });

            // Check login status
            FB.getLoginStatus((response) => {
                this.handleLoginStatus(response);
            });
        };

        // Load Facebook SDK if not already loaded
        if (!window.FB) {
            (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    }

    /**
     * Handle Facebook login status
     */
    handleLoginStatus(response) {
        if (response.status === 'connected') {
            this.isConnected = true;
            this.getUserPages();
            this.updateConnectionStatus(true);
        } else {
            this.isConnected = false;
            this.updateConnectionStatus(false);
        }
    }

    /**
     * Connect to Facebook
     */
    connectToFacebook() {
        return new Promise((resolve, reject) => {
            if (!window.FB) {
                reject('Facebook SDK not loaded');
                return;
            }

            FB.login((response) => {
                if (response.authResponse) {
                    this.isConnected = true;
                    this.getUserPages();
                    this.updateConnectionStatus(true);
                    this.saveSettings();
                    resolve(response);
                } else {
                    reject('User cancelled login or did not fully authorize.');
                }
            }, {
                scope: 'pages_manage_posts,pages_read_engagement,publish_to_groups'
            });
        });
    }

    /**
     * Setup event listeners after DOM is loaded
     */
    setupEventListeners() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupEventListeners());
            return;
        }

        // Main Facebook connection button
        const mainConnectBtn = document.getElementById('facebookConnectBtnMain');
        if (mainConnectBtn) {
            mainConnectBtn.addEventListener('click', () => this.connectToFacebook());
        }

        // Sidebar Facebook connection button
        const sidebarConnectBtn = document.getElementById('facebookConnectBtnSidebar');
        if (sidebarConnectBtn) {
            sidebarConnectBtn.addEventListener('click', () => this.connectToFacebook());
        }
    }
    }

    /**
     * Get user's Facebook pages
     */
    getUserPages() {
        FB.api('/me/accounts', (response) => {
            if (response.data && response.data.length > 0) {
                // Use the first page or let user select
                const page = response.data[0];
                this.pageId = page.id;
                this.pageAccessToken = page.access_token;
                this.saveSettings();
                this.updatePageInfo(page);
            }
        });
    }

    /**
     * Post to Facebook page
     */
    async postToFacebook(content, imageUrl = null, scheduleTime = null) {
        if (!this.isConnected || !this.pageAccessToken) {
            throw new Error('Not connected to Facebook');
        }

        const postData = {
            message: content,
            access_token: this.pageAccessToken
        };

        // Add image if provided
        if (imageUrl) {
            postData.link = imageUrl;
        }

        // Schedule post if time provided
        if (scheduleTime) {
            const scheduledTime = Math.floor(new Date(scheduleTime).getTime() / 1000);
            postData.scheduled_publish_time = scheduledTime;
            postData.published = false;
        }

        return new Promise((resolve, reject) => {
            FB.api(`/${this.pageId}/feed`, 'POST', postData, (response) => {
                if (response.error) {
                    reject(response.error);
                } else {
                    resolve(response);
                }
            });
        });
    }

    /**
     * Auto-post blog content to Facebook
     */
    async autoPostBlog(blogPost) {
        try {
            const content = this.generateFacebookContent(blogPost);
            const result = await this.postToFacebook(content);
            
            // Log successful post
            this.logPost({
                type: 'blog',
                blogId: blogPost.id,
                facebookPostId: result.id,
                content: content,
                timestamp: new Date().toISOString(),
                status: 'success'
            });

            return result;
        } catch (error) {
            console.error('Failed to auto-post blog:', error);
            
            // Log failed post
            this.logPost({
                type: 'blog',
                blogId: blogPost.id,
                content: content,
                timestamp: new Date().toISOString(),
                status: 'failed',
                error: error.message
            });
            
            throw error;
        }
    }

    /**
     * Generate Facebook content from blog post
     */
    generateFacebookContent(blogPost) {
        const templates = [
            `🚀 New Blog Post Alert! 📝\n\n"${blogPost.title}"\n\n${blogPost.meta_description}\n\nRead more: https://liquetax.com/blog/${this.generateSlug(blogPost.title)}.html\n\n#Liquetax #Business #Tax #Startup`,
            
            `💡 Fresh insights on our blog! \n\n${blogPost.title}\n\n${blogPost.meta_description}\n\n👉 Check it out: https://liquetax.com/blog/${this.generateSlug(blogPost.title)}.html\n\n${blogPost.tags.map(tag => '#' + tag.replace(/\s+/g, '')).join(' ')}`,
            
            `📚 Knowledge Drop! \n\n"${blogPost.title}"\n\nWe've just published a comprehensive guide that covers:\n${this.extractKeyPoints(blogPost.content)}\n\nDive in: https://liquetax.com/blog/${this.generateSlug(blogPost.title)}.html\n\n#BusinessGrowth #TaxOptimization #Liquetax`
        ];

        // Randomly select a template
        return templates[Math.floor(Math.random() * templates.length)];
    }

    /**
     * Extract key points from blog content
     */
    extractKeyPoints(content) {
        // Simple extraction - in production, use more sophisticated NLP
        const sentences = content.replace(/<[^>]*>/g, '').split('.').slice(0, 3);
        return sentences.map((sentence, index) => `• ${sentence.trim()}`).join('\n');
    }

    /**
     * Generate URL slug from title
     */
    generateSlug(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    /**
     * Schedule automated posting
     */
    scheduleAutoPosts() {
        // Clear existing intervals
        if (this.autoPostInterval) {
            clearInterval(this.autoPostInterval);
        }

        // Set up posting schedule (every 4 hours during business hours)
        this.autoPostInterval = setInterval(() => {
            this.processPostingQueue();
        }, 4 * 60 * 60 * 1000); // 4 hours

        console.log('Auto-posting scheduled');
    }

    /**
     * Process posting queue
     */
    async processPostingQueue() {
        if (this.postingQueue.length === 0) return;

        const currentHour = new Date().getHours();
        
        // Only post during business hours (9 AM - 6 PM)
        if (currentHour < 9 || currentHour > 18) return;

        const post = this.postingQueue.shift();
        
        try {
            await this.autoPostBlog(post);
            console.log('Successfully posted to Facebook:', post.title);
        } catch (error) {
            console.error('Failed to post to Facebook:', error);
            // Re-add to queue for retry
            this.postingQueue.push(post);
        }

        this.saveSettings();
    }

    /**
     * Add blog post to posting queue
     */
    addToPostingQueue(blogPost) {
        // Check if already in queue
        const exists = this.postingQueue.find(post => post.id === blogPost.id);
        if (!exists) {
            this.postingQueue.push(blogPost);
            this.saveSettings();
            console.log('Added to Facebook posting queue:', blogPost.title);
        }
    }

    /**
     * Enable/disable auto-posting
     */
    toggleAutoPosting(enabled) {
        this.autoPostingEnabled = enabled;
        
        if (enabled) {
            this.startAutomation();
        } else {
            this.stopAutomation();
        }
        
        this.saveSettings();
        this.updateAutoPostingStatus();
    }

    /**
     * Start automation
     */
    startAutomation() {
        if (!this.isConnected) {
            console.warn('Cannot start automation: Not connected to Facebook');
            return;
        }

        this.scheduleAutoPosts();
        console.log('Facebook automation started');
    }

    /**
     * Stop automation
     */
    stopAutomation() {
        if (this.autoPostInterval) {
            clearInterval(this.autoPostInterval);
            this.autoPostInterval = null;
        }
        console.log('Facebook automation stopped');
    }

    /**
     * Log post activity
     */
    logPost(postData) {
        const logs = JSON.parse(localStorage.getItem('facebookPostLogs') || '[]');
        logs.unshift(postData);
        
        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.splice(100);
        }
        
        localStorage.setItem('facebookPostLogs', JSON.stringify(logs));
    }

    /**
     * Get posting analytics
     */
    getPostingAnalytics() {
        const logs = JSON.parse(localStorage.getItem('facebookPostLogs') || '[]');
        const last30Days = logs.filter(log => {
            const logDate = new Date(log.timestamp);
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return logDate >= thirtyDaysAgo;
        });

        return {
            totalPosts: last30Days.length,
            successfulPosts: last30Days.filter(log => log.status === 'success').length,
            failedPosts: last30Days.filter(log => log.status === 'failed').length,
            postsThisWeek: last30Days.filter(log => {
                const logDate = new Date(log.timestamp);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return logDate >= weekAgo;
            }).length
        };
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Facebook connect button
        const connectBtn = document.getElementById('facebookConnectBtn');
        if (connectBtn) {
            connectBtn.addEventListener('click', () => {
                if (this.isConnected) {
                    this.disconnectFromFacebook();
                } else {
                    this.connectToFacebook();
                }
            });
        }

        // Auto-posting toggle
        const autoPostToggle = document.getElementById('facebookAutoPostToggle');
        if (autoPostToggle) {
            autoPostToggle.addEventListener('change', (e) => {
                this.toggleAutoPosting(e.target.checked);
            });
        }

        // Manual post button
        const manualPostBtn = document.getElementById('facebookManualPostBtn');
        if (manualPostBtn) {
            manualPostBtn.addEventListener('click', () => {
                this.showManualPostModal();
            });
        }
    }

    /**
     * Update connection status in UI
     */
    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('facebookConnectionStatus');
        const connectBtn = document.getElementById('facebookConnectBtn');
        
        if (statusElement) {
            statusElement.innerHTML = connected ? 
                '<i class="fas fa-check-circle text-success"></i> Connected' :
                '<i class="fas fa-times-circle text-danger"></i> Not Connected';
        }
        
        if (connectBtn) {
            connectBtn.textContent = connected ? 'Disconnect' : 'Connect to Facebook';
            connectBtn.className = connected ? 'btn btn-danger' : 'btn btn-primary';
        }
    }

    /**
     * Update page info in UI
     */
    updatePageInfo(page) {
        const pageInfoElement = document.getElementById('facebookPageInfo');
        if (pageInfoElement) {
            pageInfoElement.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="https://graph.facebook.com/${page.id}/picture" alt="${page.name}" class="rounded-circle me-2" width="32" height="32">
                    <div>
                        <strong>${page.name}</strong>
                        <br><small class="text-muted">Page ID: ${page.id}</small>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Update auto-posting status in UI
     */
    updateAutoPostingStatus() {
        const toggle = document.getElementById('facebookAutoPostToggle');
        const status = document.getElementById('facebookAutoPostStatus');
        
        if (toggle) {
            toggle.checked = this.autoPostingEnabled;
        }
        
        if (status) {
            status.innerHTML = this.autoPostingEnabled ? 
                '<i class="fas fa-play-circle text-success"></i> Active' :
                '<i class="fas fa-pause-circle text-warning"></i> Inactive';
        }
    }

    /**
     * Show manual post modal
     */
    showManualPostModal() {
        // Implementation for manual posting modal
        console.log('Manual post modal - to be implemented');
    }

    /**
     * Disconnect from Facebook
     */
    disconnectFromFacebook() {
        FB.logout(() => {
            this.isConnected = false;
            this.pageAccessToken = null;
            this.pageId = null;
            this.stopAutomation();
            this.updateConnectionStatus(false);
            this.clearSettings();
        });
    }

    /**
     * Save settings to localStorage
     */
    saveSettings() {
        const settings = {
            isConnected: this.isConnected,
            pageId: this.pageId,
            autoPostingEnabled: this.autoPostingEnabled,
            postingQueue: this.postingQueue,
            scheduledPosts: this.scheduledPosts
        };
        
        localStorage.setItem('facebookAutomationSettings', JSON.stringify(settings));
    }

    /**
     * Load settings from localStorage
     */
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('facebookAutomationSettings') || '{}');
        
        this.isConnected = settings.isConnected || false;
        this.pageId = settings.pageId || null;
        this.autoPostingEnabled = settings.autoPostingEnabled || false;
        this.postingQueue = settings.postingQueue || [];
        this.scheduledPosts = settings.scheduledPosts || [];
    }

    /**
     * Clear settings
     */
    clearSettings() {
        localStorage.removeItem('facebookAutomationSettings');
        this.postingQueue = [];
        this.scheduledPosts = [];
    }
}

// Initialize Facebook automation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.facebookAutomation = new FacebookAutomation();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FacebookAutomation;
}