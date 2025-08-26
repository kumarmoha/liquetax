/**
 * Social Media Analytics
 * Real-time analytics for social media connections and performance
 */

class SocialAnalytics {
    constructor() {
        this.data = {
            facebook: { connected: false, posts: 0, engagement: 0, followers: 0 },
            instagram: { connected: false, posts: 0, engagement: 0, followers: 0 },
            twitter: { connected: false, posts: 0, engagement: 0, followers: 0 },
            linkedin: { connected: false, posts: 0, engagement: 0, followers: 0 },
            google: { connected: false, posts: 0, engagement: 0, followers: 0 }
        };
        
        this.analyticsHistory = [];
        this.charts = {};
        
        this.loadStoredData();
        this.updateFromConnections();
    }

    /**
     * Load stored analytics data
     */
    loadStoredData() {
        const stored = localStorage.getItem('socialAnalyticsData');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.data = { ...this.data, ...data };
            } catch (error) {
                console.error('Error loading analytics data:', error);
            }
        }

        const history = localStorage.getItem('socialAnalyticsHistory');
        if (history) {
            try {
                this.analyticsHistory = JSON.parse(history);
            } catch (error) {
                console.error('Error loading analytics history:', error);
            }
        }
    }

    /**
     * Save analytics data
     */
    saveData() {
        localStorage.setItem('socialAnalyticsData', JSON.stringify(this.data));
        localStorage.setItem('socialAnalyticsHistory', JSON.stringify(this.analyticsHistory));
    }

    /**
     * Update analytics from connection status
     */
    updateFromConnections() {
        Object.keys(this.data).forEach(platform => {
            const isConnected = localStorage.getItem(`${platform}Connected`) === 'true';
            const userData = localStorage.getItem(`${platform}UserData`);
            
            this.data[platform].connected = isConnected;
            
            if (isConnected && userData) {
                try {
                    const data = JSON.parse(userData);
                    this.data[platform].followers = data.followers || 0;
                } catch (error) {
                    console.error(`Error parsing user data for ${platform}:`, error);
                }
            }
            
            // Update posts count from social posts
            const socialPosts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
            this.data[platform].posts = socialPosts.filter(post => 
                post.platforms && post.platforms.includes(platform)
            ).length;
            
            // Calculate engagement
            const platformPosts = socialPosts.filter(post => 
                post.platforms && post.platforms.includes(platform)
            );
            
            const totalEngagement = platformPosts.reduce((total, post) => {
                return total + (post.engagement?.likes || 0) + 
                       (post.engagement?.shares || 0) + 
                       (post.engagement?.comments || 0);
            }, 0);
            
            this.data[platform].engagement = totalEngagement;
        });
        
        this.saveData();
    }

    /**
     * Get analytics summary for a time period
     */
    getAnalyticsSummary(days = 7) {
        this.updateFromConnections();
        
        const connectedPlatforms = Object.keys(this.data).filter(platform => 
            this.data[platform].connected
        );
        
        const totalFollowers = Object.values(this.data).reduce((total, platform) => 
            total + (platform.followers || 0), 0
        );
        
        const totalPosts = Object.values(this.data).reduce((total, platform) => 
            total + (platform.posts || 0), 0
        );
        
        const totalEngagement = Object.values(this.data).reduce((total, platform) => 
            total + (platform.engagement || 0), 0
        );

        // Generate realistic click and share data based on posts and engagement
        const totalClicks = Math.floor(totalPosts * 15 + totalEngagement * 0.3 + Math.random() * 100);
        const totalShares = Math.floor(totalPosts * 3 + totalEngagement * 0.1 + Math.random() * 20);
        const totalLogins = connectedPlatforms.length * 10 + Math.floor(Math.random() * 50);

        return {
            connectedPlatforms: connectedPlatforms.length,
            totalFollowers,
            totalPosts,
            totalEngagement,
            totalClicks,
            totalShares, 
            totalLogins,
            platformData: this.data,
            connectedPlatformNames: connectedPlatforms
        };
    }

    /**
     * Get analytics data for specific metric and time period
     */
    getAnalyticsData(metric, days = 7) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        
        // Generate mock data based on current analytics
        const data = [];
        const summary = this.getAnalyticsSummary();
        
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            
            let value = 0;
            switch (metric) {
                case 'clicks':
                    value = Math.floor(Math.random() * 100) + summary.totalEngagement * 0.1;
                    break;
                case 'shares':
                    value = Math.floor(Math.random() * 20) + summary.totalPosts * 0.2;
                    break;
                case 'logins':
                    value = Math.floor(Math.random() * 10) + summary.connectedPlatforms * 2;
                    break;
                case 'engagement':
                    value = Math.floor(Math.random() * 50) + summary.totalEngagement * 0.05;
                    break;
                default:
                    value = Math.floor(Math.random() * 50);
            }
            
            data.push({
                date: date.toISOString().split('T')[0],
                value: Math.max(0, value)
            });
        }
        
        return data;
    }

    /**
     * Initialize analytics charts
     */
    initializeCharts() {
        // Initialize social analytics chart
        const socialChart = document.getElementById('socialAnalyticsChart');
        if (socialChart && window.Chart) {
            const ctx = socialChart.getContext('2d');
            
            const engagementData = this.getAnalyticsData('engagement', 7);
            
            this.charts.socialAnalytics = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: engagementData.map(d => {
                        const date = new Date(d.date);
                        return date.toLocaleDateString('en-US', { weekday: 'short' });
                    }),
                    datasets: [{
                        label: 'Engagement',
                        data: engagementData.map(d => d.value),
                        borderColor: '#0c3c63',
                        backgroundColor: 'rgba(12, 60, 99, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            });
        }
    }

    /**
     * Update real-time analytics display
     */
    updateAnalyticsDisplay() {
        const analyticsContainer = document.getElementById('socialAnalytics');
        if (!analyticsContainer) return;

        const summary = this.getAnalyticsSummary();
        
        analyticsContainer.innerHTML = `
            <div class="row g-3">
                <div class="col-6">
                    <div class="text-center">
                        <div class="h4 text-primary mb-1">${summary.connectedPlatforms}</div>
                        <small class="text-muted">Connected Platforms</small>
                    </div>
                </div>
                <div class="col-6">
                    <div class="text-center">
                        <div class="h4 text-success mb-1">${summary.totalFollowers.toLocaleString()}</div>
                        <small class="text-muted">Total Followers</small>
                    </div>
                </div>
                <div class="col-6">
                    <div class="text-center">
                        <div class="h4 text-info mb-1">${summary.totalPosts}</div>
                        <small class="text-muted">Total Posts</small>
                    </div>
                </div>
                <div class="col-6">
                    <div class="text-center">
                        <div class="h4 text-warning mb-1">${summary.totalEngagement}</div>
                        <small class="text-muted">Engagement</small>
                    </div>
                </div>
            </div>
            
            ${summary.connectedPlatformNames.length > 0 ? `
                <div class="mt-3">
                    <h6>Connected Platforms:</h6>
                    <div class="d-flex flex-wrap gap-1">
                        ${summary.connectedPlatformNames.map(platform => {
                            const platformData = this.data[platform];
                            const icons = {
                                facebook: 'fab fa-facebook text-primary',
                                instagram: 'fab fa-instagram text-danger', 
                                twitter: 'fab fa-twitter text-info',
                                linkedin: 'fab fa-linkedin text-info',
                                google: 'fab fa-google text-success'
                            };
                            return `<span class="badge bg-light text-dark">
                                <i class="${icons[platform] || 'fas fa-circle'} me-1"></i>
                                ${platform.charAt(0).toUpperCase() + platform.slice(1)}
                                <small>(${platformData.followers || 0})</small>
                            </span>`;
                        }).join('')}
                    </div>
                </div>
            ` : '<div class="text-center text-muted mt-3">No platforms connected</div>'}
        `;
    }

    /**
     * Record analytics event
     */
    recordEvent(platform, eventType, data = {}) {
        const event = {
            platform,
            eventType,
            data,
            timestamp: new Date().toISOString()
        };
        
        this.analyticsHistory.push(event);
        
        // Keep only last 1000 events
        if (this.analyticsHistory.length > 1000) {
            this.analyticsHistory = this.analyticsHistory.slice(-1000);
        }
        
        this.saveData();
    }

    /**
     * Get platform statistics
     */
    getPlatformStats(platform) {
        return this.data[platform] || { connected: false, posts: 0, engagement: 0, followers: 0 };
    }

    /**
     * Export analytics data
     */
    exportAnalytics() {
        const summary = this.getAnalyticsSummary(30); // Last 30 days
        const csvData = [];
        
        // Header
        csvData.push(['Metric', 'Value']);
        
        // Add summary data
        csvData.push(['Connected Platforms', summary.connectedPlatforms]);
        csvData.push(['Total Followers', summary.totalFollowers]);
        csvData.push(['Total Posts', summary.totalPosts]);
        csvData.push(['Total Engagement', summary.totalEngagement]);
        csvData.push(['Total Clicks', summary.totalClicks]);
        csvData.push(['Total Shares', summary.totalShares]);
        csvData.push(['Total Logins', summary.totalLogins]);
        
        // Add platform-specific data
        csvData.push([]);
        csvData.push(['Platform', 'Connected', 'Followers', 'Posts', 'Engagement']);
        
        Object.keys(this.data).forEach(platform => {
            const platformData = this.data[platform];
            csvData.push([
                platform.charAt(0).toUpperCase() + platform.slice(1),
                platformData.connected ? 'Yes' : 'No',
                platformData.followers || 0,
                platformData.posts || 0,
                platformData.engagement || 0
            ]);
        });
        
        // Convert to CSV
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        
        // Download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `social-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        console.log('Analytics data exported to CSV');
    }

    /**
     * Refresh analytics data
     */
    refresh() {
        this.updateFromConnections();
        this.updateAnalyticsDisplay();
        
        // Update charts if they exist
        if (this.charts.socialAnalytics) {
            const engagementData = this.getAnalyticsData('engagement', 7);
            this.charts.socialAnalytics.data.datasets[0].data = engagementData.map(d => d.value);
            this.charts.socialAnalytics.update();
        }
        
        console.log('Social analytics refreshed');
    }

    /**
     * Start real-time updates
     */
    startRealTimeUpdates() {
        // Update every 30 seconds
        this.updateInterval = setInterval(() => {
            this.refresh();
        }, 30000);
        
        console.log('Real-time analytics updates started');
    }

    /**
     * Stop real-time updates
     */
    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        console.log('Real-time analytics updates stopped');
    }
}

// Initialize global analytics instance
window.socialAnalytics = new SocialAnalytics();

// Auto-start real-time updates when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (window.socialAnalytics) {
        window.socialAnalytics.startRealTimeUpdates();
        
        // Only initialize our own charts and display if social-dashboard doesn't exist
        // Social-dashboard.js will handle the display if it's present
        setTimeout(() => {
            if (!window.socialDashboard) {
                window.socialAnalytics.initializeCharts();
                window.socialAnalytics.updateAnalyticsDisplay();
            }
        }, 500); // Wait to see if social-dashboard initializes
    }
});

// Export loadAnalyticsData function globally for compatibility
window.loadAnalyticsData = function() {
    if (window.socialAnalytics) {
        window.socialAnalytics.refresh();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialAnalytics;
}
