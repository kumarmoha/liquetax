/**
 * Social Media Dashboard Widget
 * Real-time social media analytics and management
 */

class SocialMediaDashboard {
    constructor() {
        this.platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube'];
        this.refreshInterval = 30000; // 30 seconds
        this.charts = {};
        
        this.init();
    }

    /**
     * Initialize dashboard
     */
    init() {
        console.log('🎛️ Initializing Social Media Dashboard...');
        
        this.createDashboardHTML();
        this.loadAnalyticsData();
        this.setupEventListeners();
        this.startAutoRefresh();
        
        console.log('✅ Social Media Dashboard initialized');
    }

    /**
     * Create dashboard HTML structure
     */
    createDashboardHTML() {
        console.log('Creating social dashboard HTML...');
        const dashboardContainer = document.getElementById('social-media-dashboard');
        if (!dashboardContainer) {
            console.error('Social media dashboard container not found');
            return;
        }
        console.log('Dashboard container found, injecting content...');

        dashboardContainer.innerHTML = `
            <div class="social-dashboard">
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="d-flex justify-content-between align-items-center">
                            <h4><i class="fas fa-chart-line me-2"></i>Social Media Analytics</h4>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-outline-primary" onclick="socialDashboard.refreshData()">
                                    <i class="fas fa-sync-alt"></i> Refresh
                                </button>
                                <button class="btn btn-sm btn-outline-success" onclick="socialDashboard.exportData()">
                                    <i class="fas fa-download"></i> Export
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Connection Status Cards -->
                <div class="row mb-4">
                    ${this.platforms.map(platform => `
                        <div class="col-md-2 col-sm-4 mb-3">
                            <div class="card border-0 shadow-sm h-100">
                                <div class="card-body text-center p-3">
                                    <i class="fab fa-${platform} fa-2x mb-2 text-${this.getPlatformColor(platform)}"></i>
                                    <h6 class="card-title text-capitalize">${platform}</h6>
                                    <div id="${platform}-connection-status" class="connection-status">
                                        <span class="badge bg-secondary">Checking...</span>
                                    </div>
                                    <div class="mt-2">
                                        <small class="text-muted" id="${platform}-last-activity">-</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Analytics Overview -->
                <div class="row mb-4">
                    <div class="col-md-3 mb-3">
                        <div class="card border-0 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-mouse-pointer fa-2x text-primary"></i>
                                    </div>
                                    <div class="flex-grow-1 ms-3">
                                        <div class="fw-bold" id="total-clicks">0</div>
                                        <div class="text-muted small">Total Clicks</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card border-0 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-share-alt fa-2x text-success"></i>
                                    </div>
                                    <div class="flex-grow-1 ms-3">
                                        <div class="fw-bold" id="total-shares">0</div>
                                        <div class="text-muted small">Total Shares</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card border-0 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-sign-in-alt fa-2x text-info"></i>
                                    </div>
                                    <div class="flex-grow-1 ms-3">
                                        <div class="fw-bold" id="total-logins">0</div>
                                        <div class="text-muted small">Total Logins</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="card border-0 shadow-sm">
                            <div class="card-body">
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0">
                                        <i class="fas fa-chart-line fa-2x text-warning"></i>
                                    </div>
                                    <div class="flex-grow-1 ms-3">
                                        <div class="fw-bold" id="engagement-rate">0%</div>
                                        <div class="text-muted small">Engagement Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Activity Feed -->
                <div class="row">
                    <div class="col-md-8">
                        <div class="card border-0 shadow-sm">
                            <div class="card-header bg-transparent">
                                <h6 class="mb-0"><i class="fas fa-chart-area me-2"></i>Analytics Chart</h6>
                            </div>
                            <div class="card-body">
                                <canvas id="analytics-chart" height="300"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card border-0 shadow-sm">
                            <div class="card-header bg-transparent">
                                <h6 class="mb-0"><i class="fas fa-clock me-2"></i>Real-time Activity</h6>
                            </div>
                            <div class="card-body p-0">
                                <div id="activity-feed" class="activity-feed">
                                    <div class="p-3 text-center text-muted">
                                        <i class="fas fa-spinner fa-spin"></i> Loading activity...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        console.log('Dashboard HTML injected successfully');
        
        // Update with real data after HTML is created
        setTimeout(() => {
            this.updateConnectionStatus();
            this.loadAnalyticsData();
        }, 100);
    }

    /**
     * Load analytics data
     */
    loadAnalyticsData() {
        console.log('Loading analytics data...');
        if (typeof socialAnalytics === 'undefined') {
            console.warn('Social analytics not available');
            return;
        }

        const summary = socialAnalytics.getAnalyticsSummary(7); // Last 7 days
        console.log('Analytics summary received:', summary);
        
        // Update overview cards
        const totalClicksEl = document.getElementById('total-clicks');
        const totalSharesEl = document.getElementById('total-shares');
        const totalLoginsEl = document.getElementById('total-logins');
        const engagementRateEl = document.getElementById('engagement-rate');
        
        if (totalClicksEl) totalClicksEl.textContent = summary.totalClicks || 0;
        if (totalSharesEl) totalSharesEl.textContent = summary.totalShares || 0;
        if (totalLoginsEl) totalLoginsEl.textContent = summary.totalLogins || 0;
        
        // Calculate engagement rate
        const totalInteractions = (summary.totalClicks || 0) + (summary.totalShares || 0) + (summary.totalLogins || 0);
        const engagementRate = totalInteractions > 0 ? ((totalInteractions / 100) * 100).toFixed(1) : 0;
        if (engagementRateEl) engagementRateEl.textContent = engagementRate + '%';

        // Update connection status
        this.updateConnectionStatus();
        
        // Update charts
        this.updateCharts(summary);
        
        console.log('Analytics data loaded successfully');
    }

    /**
     * Get platform color for styling
     */
    getPlatformColor(platform) {
        const colors = {
            facebook: 'primary',
            instagram: 'danger',
            twitter: 'info',
            linkedin: 'info',
            youtube: 'danger'
        };
        return colors[platform] || 'secondary';
    }

    /**
     * Update connection status for all platforms
     */
    updateConnectionStatus() {
        this.platforms.forEach(platform => {
            const isConnected = localStorage.getItem(`${platform}Connected`) === 'true';
            const statusElement = document.getElementById(`${platform}-connection-status`);
            const activityElement = document.getElementById(`${platform}-last-activity`);
            
            if (statusElement) {
                if (isConnected) {
                    statusElement.innerHTML = '<span class="badge bg-success">Connected</span>';
                    if (activityElement) {
                        activityElement.textContent = 'Active';
                    }
                } else {
                    statusElement.innerHTML = '<span class="badge bg-secondary">Not Connected</span>';
                    if (activityElement) {
                        activityElement.textContent = 'Inactive';
                    }
                }
            }
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Any additional event listeners for the dashboard
        console.log('Setting up dashboard event listeners');
    }

    /**
     * Start auto-refresh
     */
    startAutoRefresh() {
        setInterval(() => {
            this.refreshData();
        }, this.refreshInterval);
        
        console.log(`Auto-refresh started (${this.refreshInterval / 1000}s interval)`);
    }

    /**
     * Refresh dashboard data
     */
    refreshData() {
        console.log('Refreshing dashboard data...');
        this.loadAnalyticsData();
        this.updateRealTimeActivity();
    }

    /**
     * Export dashboard data
     */
    exportData() {
        console.log('Exporting dashboard data...');
        if (typeof socialAnalytics !== 'undefined' && socialAnalytics.exportAnalytics) {
            socialAnalytics.exportAnalytics();
        } else {
            console.warn('Export functionality not available');
        }
    }

    /**
     * Update charts
     */
    updateCharts(summary) {
        // Initialize chart if it doesn't exist
        const chartCanvas = document.getElementById('analytics-chart');
        if (chartCanvas && window.Chart) {
            if (!this.charts.analytics) {
                const ctx = chartCanvas.getContext('2d');
                this.charts.analytics = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'Engagement',
                            data: [
                                summary.totalClicks * 0.1,
                                summary.totalShares * 0.8,
                                summary.totalLogins * 0.3,
                                summary.totalEngagement * 0.2,
                                summary.totalClicks * 0.15,
                                summary.totalShares * 0.6,
                                summary.totalLogins * 0.4
                            ],
                            borderColor: '#007bff',
                            backgroundColor: 'rgba(0, 123, 255, 0.1)',
                            tension: 0.4
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
                                beginAtZero: true
                            }
                        }
                    }
                });
            } else {
                // Update existing chart
                this.charts.analytics.data.datasets[0].data = [
                    summary.totalClicks * 0.1,
                    summary.totalShares * 0.8,
                    summary.totalLogins * 0.3,
                    summary.totalEngagement * 0.2,
                    summary.totalClicks * 0.15,
                    summary.totalShares * 0.6,
                    summary.totalLogins * 0.4
                ];
                this.charts.analytics.update();
            }
        }
    }

    /**
     * Update real-time activity feed
     */
    updateRealTimeActivity() {
        const activityFeed = document.getElementById('activity-feed');
        if (!activityFeed) return;

        if (typeof socialAnalytics === 'undefined') {
            activityFeed.innerHTML = '<div class="text-center text-muted py-3">Social analytics not available</div>';
            return;
        }

        const recentClicks = socialAnalytics.getAnalyticsData('clicks', 1); // Last 24 hours
        const recentShares = socialAnalytics.getAnalyticsData('shares', 1);
        const recentLogins = socialAnalytics.getAnalyticsData('logins', 1);

        const activities = [
            { type: 'click', count: recentClicks.reduce((sum, d) => sum + d.value, 0), icon: 'mouse-pointer', color: 'primary' },
            { type: 'share', count: recentShares.reduce((sum, d) => sum + d.value, 0), icon: 'share-alt', color: 'success' },
            { type: 'login', count: recentLogins.reduce((sum, d) => sum + d.value, 0), icon: 'sign-in-alt', color: 'info' }
        ];

        let activityHTML = '';
        activities.forEach(activity => {
            if (activity.count > 0) {
                activityHTML += `
                    <div class="d-flex align-items-center p-3 border-bottom">
                        <div class="flex-shrink-0">
                            <i class="fas fa-${activity.icon} text-${activity.color}"></i>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <div class="fw-bold">${activity.count} ${activity.type}s</div>
                            <div class="text-muted small">Last 24 hours</div>
                        </div>
                    </div>
                `;
            }
        });

        if (activityHTML === '') {
            activityHTML = '<div class="text-center text-muted py-3">No recent activity</div>';
        }

        activityFeed.innerHTML = activityHTML;
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if dashboard container exists
    if (document.getElementById('social-media-dashboard')) {
        console.log('Initializing Social Media Dashboard...');
        window.socialDashboard = new SocialMediaDashboard();
    } else {
        console.log('Social media dashboard container not found, skipping initialization');
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialMediaDashboard;
}
