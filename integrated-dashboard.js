/**
 * Integrated Dashboard
 * Combines blog management, social media, and website monitoring in one interface
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Integrated dashboard loaded');
    initIntegratedDashboard();
});

/**
 * Initialize the integrated dashboard
 */
function initIntegratedDashboard() {
    console.log('Initializing integrated dashboard');
    
    // Set up dashboard layout
    setupDashboardLayout();
    
    // Initialize website monitoring
    initWebsiteMonitoring();
    
    // Set up dashboard widgets
    setupDashboardWidgets();
    
    // Set up notification center
    setupNotificationCenter();
    
    // Load initial data
    loadDashboardData();
}

/**
 * Set up the dashboard layout
 */
function setupDashboardLayout() {
    console.log('Setting up dashboard layout');
    
    // Find the dashboard container
    const dashboardContainer = document.getElementById('dashboardContainer');
    if (!dashboardContainer) {
        console.warn('Dashboard container not found');
        return;
    }
    
    // Create dashboard layout
    dashboardContainer.innerHTML = `
        <div class="row">
            <div class="col-12 mb-4">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title mb-0">Dashboard Overview</h5>
                            <div>
                                <button id="refreshDashboardBtn" class="btn btn-sm btn-outline-primary me-2">
                                    <i class="fas fa-sync-alt me-1"></i> Refresh
                                </button>
                                <button id="customizeDashboardBtn" class="btn btn-sm btn-outline-secondary">
                                    <i class="fas fa-cog me-1"></i> Customize
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row" id="statsCards">
            <!-- Stats cards will be inserted here -->
        </div>
        
        <div class="row">
            <div class="col-lg-8 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Website Performance</h5>
                    </div>
                    <div class="card-body">
                        <div class="chart-container" style="position: relative; height:300px;">
                            <canvas id="websitePerformanceChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Social Media Overview</h5>
                    </div>
                    <div class="card-body">
                        <div class="chart-container" style="position: relative; height:300px;">
                            <canvas id="socialOverviewChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Recent Blog Posts</h5>
                    </div>
                    <div class="card-body">
                        <div id="recentBlogPosts">
                            <div class="text-center py-3">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <a href="#blogManagement" class="btn btn-sm btn-primary">Manage Blogs</a>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Social Media Activity</h5>
                    </div>
                    <div class="card-body">
                        <div id="recentSocialActivity">
                            <div class="text-center py-3">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <a href="#socialMedia" class="btn btn-sm btn-primary">Social Media Dashboard</a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Quick Actions</h5>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-md-3 col-6 mb-3">
                                <button id="newBlogBtn" class="btn btn-lg btn-outline-primary w-100 h-100 py-3">
                                    <i class="fas fa-file-alt fa-2x mb-2"></i><br>
                                    New Blog Post
                                </button>
                            </div>
                            <div class="col-md-3 col-6 mb-3">
                                <button id="scheduleSocialBtn" class="btn btn-lg btn-outline-info w-100 h-100 py-3">
                                    <i class="fas fa-calendar-alt fa-2x mb-2"></i><br>
                                    Schedule Post
                                </button>
                            </div>
                            <div class="col-md-3 col-6 mb-3">
                                <button id="scanBlogsBtn" class="btn btn-lg btn-outline-success w-100 h-100 py-3">
                                    <i class="fas fa-sync-alt fa-2x mb-2"></i><br>
                                    Scan for Blogs
                                </button>
                            </div>
                            <div class="col-md-3 col-6 mb-3">
                                <button id="viewReportsBtn" class="btn btn-lg btn-outline-secondary w-100 h-100 py-3">
                                    <i class="fas fa-chart-bar fa-2x mb-2"></i><br>
                                    View Reports
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-12 mb-4">
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Notifications</h5>
                    </div>
                    <div class="card-body">
                        <div id="notificationCenter">
                            <div class="text-center py-3">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Set up refresh button
    const refreshBtn = document.getElementById('refreshDashboardBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadDashboardData();
        });
    }
    
    // Set up customize button
    const customizeBtn = document.getElementById('customizeDashboardBtn');
    if (customizeBtn) {
        customizeBtn.addEventListener('click', function() {
            showCustomizationModal();
        });
    }
    
    // Set up quick action buttons
    setupQuickActionButtons();
}

/**
 * Set up quick action buttons
 */
function setupQuickActionButtons() {
    // New Blog button
    const newBlogBtn = document.getElementById('newBlogBtn');
    if (newBlogBtn) {
        newBlogBtn.addEventListener('click', function() {
            // Navigate to blog creation section
            const blogLink = document.querySelector('a[href="#blogManagement"]');
            if (blogLink) {
                blogLink.click();
                
                // Focus on the new blog form
                setTimeout(() => {
                    const blogTitleInput = document.getElementById('blogTitle');
                    if (blogTitleInput) {
                        blogTitleInput.focus();
                    }
                }, 500);
            }
        });
    }
    
    // Schedule Social button
    const scheduleSocialBtn = document.getElementById('scheduleSocialBtn');
    if (scheduleSocialBtn) {
        scheduleSocialBtn.addEventListener('click', function() {
            // Navigate to social media section
            const socialLink = document.querySelector('a[href="#socialMedia"]');
            if (socialLink) {
                socialLink.click();
                
                // Open scheduling modal if available
                setTimeout(() => {
                    const scheduleBtn = document.getElementById('scheduleSocialPostBtn');
                    if (scheduleBtn) {
                        scheduleBtn.click();
                    }
                }, 500);
            }
        });
    }
    
    // Scan Blogs button
    const scanBlogsBtn = document.getElementById('scanBlogsBtn');
    if (scanBlogsBtn) {
        scanBlogsBtn.addEventListener('click', function() {
            // Call the scan function if available
            if (typeof scanBlogFolder === 'function') {
                scanBlogFolder();
            } else {
                alert('Blog scanning functionality is not available');
            }
        });
    }
    
    // View Reports button
    const viewReportsBtn = document.getElementById('viewReportsBtn');
    if (viewReportsBtn) {
        viewReportsBtn.addEventListener('click', function() {
            // Navigate to reports section
            const reportsLink = document.querySelector('a[href="#reports"]');
            if (reportsLink) {
                reportsLink.click();
            } else {
                alert('Reports section is not available');
            }
        });
    }
}

/**
 * Initialize website monitoring functionality
 */
function initWebsiteMonitoring() {
    console.log('Initializing website monitoring');
    
    // Set up performance monitoring
    setupPerformanceMonitoring();
    
    // Set up uptime monitoring
    setupUptimeMonitoring();
    
    // Set up error tracking
    setupErrorTracking();
}

/**
 * Set up performance monitoring
 */
function setupPerformanceMonitoring() {
    console.log('Setting up performance monitoring');
    
    // In a real implementation, this would connect to a performance monitoring API
    // For this demo, we'll use mock data
    
    // Set up the performance chart
    const performanceChart = document.getElementById('websitePerformanceChart');
    if (!performanceChart || typeof Chart === 'undefined') {
        console.warn('Performance chart or Chart.js not found');
        return;
    }
    
    // Generate labels (last 7 days)
    const labels = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    // Generate random performance data
    const loadTimes = [];
    const serverResponse = [];
    
    for (let i = 0; i < 7; i++) {
        // Page load time between 1.0 and 3.0 seconds
        loadTimes.push((Math.random() * 2 + 1).toFixed(2));
        
        // Server response time between 0.1 and 0.5 seconds
        serverResponse.push((Math.random() * 0.4 + 0.1).toFixed(2));
    }
    
    // Create the chart
    new Chart(performanceChart, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Page Load Time (s)',
                    data: loadTimes,
                    borderColor: '#0c3c63',
                    backgroundColor: 'rgba(12, 60, 99, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Server Response Time (s)',
                    data: serverResponse,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                }
            }
        }
    });
}

/**
 * Set up uptime monitoring
 */
function setupUptimeMonitoring() {
    console.log('Setting up uptime monitoring');
    
    // In a real implementation, this would connect to an uptime monitoring service
    // For this demo, we'll use mock data
    
    // Add uptime to stats cards
    const statsCards = document.getElementById('statsCards');
    if (!statsCards) return;
    
    // Add uptime card
    const uptimeCard = document.createElement('div');
    uptimeCard.className = 'col-xl-3 col-md-6 mb-4';
    uptimeCard.innerHTML = `
        <div class="card stats-card">
            <div class="card-body">
                <h5>Uptime</h5>
                <h2>99.98%</h2>
                <p class="mb-0">Last 30 days</p>
                <i class="fas fa-server icon"></i>
            </div>
        </div>
    `;
    
    statsCards.appendChild(uptimeCard);
}

/**
 * Set up error tracking
 */
function setupErrorTracking() {
    console.log('Setting up error tracking');
    
    // In a real implementation, this would connect to an error tracking service
    // For this demo, we'll use mock data
    
    // Add error tracking to stats cards
    const statsCards = document.getElementById('statsCards');
    if (!statsCards) return;
    
    // Add errors card
    const errorsCard = document.createElement('div');
    errorsCard.className = 'col-xl-3 col-md-6 mb-4';
    errorsCard.innerHTML = `
        <div class="card stats-card">
            <div class="card-body">
                <h5>JS Errors</h5>
                <h2>0</h2>
                <p class="mb-0">Last 24 hours</p>
                <i class="fas fa-exclamation-triangle icon"></i>
            </div>
        </div>
    `;
    
    statsCards.appendChild(errorsCard);
}

/**
 * Set up dashboard widgets
 */
function setupDashboardWidgets() {
    console.log('Setting up dashboard widgets');
    
    // Add blog stats to stats cards
    const statsCards = document.getElementById('statsCards');
    if (!statsCards) return;
    
    // Add blog posts card
    const blogPostsCard = document.createElement('div');
    blogPostsCard.className = 'col-xl-3 col-md-6 mb-4';
    blogPostsCard.innerHTML = `
        <div class="card stats-card">
            <div class="card-body">
                <h5>Blog Posts</h5>
                <h2 id="totalBlogPosts">0</h2>
                <p class="mb-0">Total posts</p>
                <i class="fas fa-file-alt icon"></i>
            </div>
        </div>
    `;
    
    // Add social connections card
    const socialConnectionsCard = document.createElement('div');
    socialConnectionsCard.className = 'col-xl-3 col-md-6 mb-4';
    socialConnectionsCard.innerHTML = `
        <div class="card stats-card">
            <div class="card-body">
                <h5>Social Connections</h5>
                <h2 id="totalSocialConnections">0</h2>
                <p class="mb-0">Connected platforms</p>
                <i class="fas fa-share-alt icon"></i>
            </div>
        </div>
    `;
    
    // Add cards to container
    statsCards.appendChild(blogPostsCard);
    statsCards.appendChild(socialConnectionsCard);
}

/**
 * Set up notification center
 */
function setupNotificationCenter() {
    console.log('Setting up notification center');
    
    // Find notification center container
    const notificationCenter = document.getElementById('notificationCenter');
    if (!notificationCenter) return;
    
    // Create notification list
    notificationCenter.innerHTML = `
        <ul class="list-group" id="notificationList">
            <li class="list-group-item text-center text-muted">
                Loading notifications...
            </li>
        </ul>
    `;
    
    // Load notifications
    loadNotifications();
}

/**
 * Load notifications
 */
function loadNotifications() {
    console.log('Loading notifications');
    
    // In a real implementation, this would fetch notifications from an API
    // For this demo, we'll use mock data
    
    // Generate mock notifications
    const notifications = [
        {
            id: 'notif_1',
            type: 'blog',
            title: 'New blog post imported',
            message: 'A new blog post was automatically imported from the HTML folder.',
            time: '10 minutes ago',
            read: false
        },
        {
            id: 'notif_2',
            type: 'social',
            title: 'Facebook engagement spike',
            message: 'Your latest Facebook post is receiving higher than average engagement.',
            time: '2 hours ago',
            read: false
        },
        {
            id: 'notif_3',
            type: 'performance',
            title: 'Website performance improved',
            message: 'Average page load time decreased by 15% in the last 24 hours.',
            time: '1 day ago',
            read: true
        }
    ];
    
    // Update notification list
    updateNotificationList(notifications);
}

/**
 * Update notification list in the UI
 */
function updateNotificationList(notifications) {
    const notificationList = document.getElementById('notificationList');
    if (!notificationList) return;
    
    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <li class="list-group-item text-center text-muted">
                No notifications to display
            </li>
        `;
        return;
    }
    
    // Generate HTML for notifications
    let html = '';
    
    notifications.forEach(notification => {
        const iconClass = getNotificationIcon(notification.type);
        const bgClass = notification.read ? '' : 'bg-light';
        
        html += `
            <li class="list-group-item ${bgClass}" data-id="${notification.id}">
                <div class="d-flex">
                    <div class="me-3">
                        <i class="${iconClass} fa-lg text-${getNotificationColor(notification.type)}"></i>
                    </div>
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${notification.title}</h6>
                        <p class="mb-1">${notification.message}</p>
                        <small class="text-muted">${notification.time}</small>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-link mark-read-btn" title="Mark as read">
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                </div>
            </li>
        `;
    });
    
    // Update the DOM
    notificationList.innerHTML = html;
    
    // Add event listeners
    document.querySelectorAll('.mark-read-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const notificationId = this.closest('li').getAttribute('data-id');
            markNotificationAsRead(notificationId);
        });
    });
}

/**
 * Get icon class for notification type
 */
function getNotificationIcon(type) {
    const icons = {
        blog: 'fas fa-file-alt',
        social: 'fas fa-share-alt',
        performance: 'fas fa-tachometer-alt',
        error: 'fas fa-exclamation-triangle',
        security: 'fas fa-shield-alt',
        default: 'fas fa-bell'
    };
    
    return icons[type] || icons.default;
}

/**
 * Get color for notification type
 */
function getNotificationColor(type) {
    const colors = {
        blog: 'primary',
        social: 'info',
        performance: 'success',
        error: 'danger',
        security: 'warning',
        default: 'secondary'
    };
    
    return colors[type] || colors.default;
}

/**
 * Mark notification as read
 */
function markNotificationAsRead(notificationId) {
    console.log('Marking notification as read:', notificationId);
    
    // In a real implementation, this would update the notification status in the database
    // For this demo, we'll just update the UI
    
    const notification = document.querySelector(`li[data-id="${notificationId}"]`);
    if (notification) {
        notification.classList.remove('bg-light');
    }
}

/**
 * Load dashboard data
 */
function loadDashboardData() {
    console.log('Loading dashboard data');
    
    // Show loading state
    showLoadingState();
    
    // Load blog data
    loadBlogData();
    
    // Load social media data
    loadSocialMediaData();
    
    // Update stats
    updateDashboardStats();
    
    // Create social overview chart
    createSocialOverviewChart();
}

/**
 * Show loading state for dashboard
 */
function showLoadingState() {
    // Show loading for recent blog posts
    const recentBlogPosts = document.getElementById('recentBlogPosts');
    if (recentBlogPosts) {
        recentBlogPosts.innerHTML = `
            <div class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading blog posts...</p>
            </div>
        `;
    }
    
    // Show loading for recent social activity
    const recentSocialActivity = document.getElementById('recentSocialActivity');
    if (recentSocialActivity) {
        recentSocialActivity.innerHTML = `
            <div class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading social activity...</p>
            </div>
        `;
    }
}

/**
 * Load blog data
 */
function loadBlogData() {
    console.log('Loading blog data');
    
    // Get blog posts from localStorage
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Update recent blog posts
    updateRecentBlogPosts(posts);
    
    // Update total blog posts count
    const totalBlogPosts = document.getElementById('totalBlogPosts');
    if (totalBlogPosts) {
        totalBlogPosts.textContent = posts.length;
    }
}

/**
 * Update recent blog posts in the UI
 */
function updateRecentBlogPosts(posts) {
    const recentBlogPosts = document.getElementById('recentBlogPosts');
    if (!recentBlogPosts) return;
    
    if (posts.length === 0) {
        recentBlogPosts.innerHTML = `
            <div class="text-center py-3">
                <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
                <p class="text-muted">No blog posts yet</p>
            </div>
        `;
        return;
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Take the first 5 posts
    const recentPosts = posts.slice(0, 5);
    
    // Generate HTML
    let html = '<div class="list-group list-group-flush">';
    
    recentPosts.forEach(post => {
        const date = new Date(post.date).toLocaleDateString();
        
        html += `
            <a href="#" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">${post.title}</h6>
                    <small>${date}</small>
                </div>
                <p class="mb-1 text-truncate">${post.meta_description || 'No description'}</p>
                <small class="text-muted">
                    <span class="badge bg-${post.status === 'published' ? 'success' : 'secondary'} me-1">
                        ${post.status}
                    </span>
                    ${post.tags.map(tag => `<span class="badge bg-light text-dark me-1">${tag}</span>`).join('')}
                </small>
            </a>
        `;
    });
    
    html += '</div>';
    
    // Update the DOM
    recentBlogPosts.innerHTML = html;
}

/**
 * Load social media data
 */
function loadSocialMediaData() {
    console.log('Loading social media data');
    
    // Check which platforms are connected
    const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'google'];
    const connectedPlatforms = platforms.filter(platform => 
        localStorage.getItem(`${platform}Connected`) === 'true'
    );
    
    // Update total social connections count
    const totalSocialConnections = document.getElementById('totalSocialConnections');
    if (totalSocialConnections) {
        totalSocialConnections.textContent = connectedPlatforms.length;
    }
    
    // Update recent social activity
    updateRecentSocialActivity(connectedPlatforms);
}

/**
 * Update recent social activity in the UI
 */
function updateRecentSocialActivity(connectedPlatforms) {
    const recentSocialActivity = document.getElementById('recentSocialActivity');
    if (!recentSocialActivity) return;
    
    if (connectedPlatforms.length === 0) {
        recentSocialActivity.innerHTML = `
            <div class="text-center py-3">
                <i class="fas fa-share-alt fa-3x text-muted mb-3"></i>
                <p class="text-muted">No social media accounts connected</p>
                <a href="#socialConnections" class="btn btn-sm btn-primary mt-2">
                    Connect Accounts
                </a>
            </div>
        `;
        return;
    }
    
    // Generate mock social activity
    const activities = generateMockSocialActivity(connectedPlatforms);
    
    // Generate HTML
    let html = '<div class="list-group list-group-flush">';
    
    activities.forEach(activity => {
        html += `
            <div class="list-group-item">
                <div class="d-flex">
                    <div class="me-3">
                        <i class="fab fa-${activity.platform.toLowerCase()} fa-lg text-${getPlatformColor(activity.platform)}"></i>
                    </div>
                    <div>
                        <p class="mb-1">${activity.message}</p>
                        <small class="text-muted">${activity.time}</small>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Update the DOM
    recentSocialActivity.innerHTML = html;
}

/**
 * Generate mock social activity
 */
function generateMockSocialActivity(platforms) {
    const activities = [];
    
    const activityTypes = {
        facebook: [
            'New page like',
            'Post received {count} likes',
            'Comment on your post',
            'Page post shared {count} times',
            'New message received'
        ],
        instagram: [
            'New follower',
            'Post received {count} likes',
            'New comment on your photo',
            'Story viewed {count} times',
            'Post saved {count} times'
        ],
        twitter: [
            'New follower',
            'Tweet received {count} likes',
            'Your tweet was retweeted {count} times',
            'Mentioned in a tweet',
            'New direct message'
        ],
        linkedin: [
            'New connection',
            'Post received {count} reactions',
            'Comment on your article',
            'Profile viewed {count} times',
            'Post shared {count} times'
        ],
        google: [
            'New review',
            'Business profile viewed {count} times',
            'Photo viewed {count} times',
            'Click to call action',
            'Click for directions'
        ]
    };
    
    const times = [
        '5 minutes ago',
        '10 minutes ago',
        '30 minutes ago',
        '1 hour ago',
        '2 hours ago',
        'Yesterday'
    ];
    
    // Generate 5 random activities
    for (let i = 0; i < 5; i++) {
        // Pick a random platform
        const platform = platforms[Math.floor(Math.random() * platforms.length)];
        
        // Pick a random activity type
        const activityType = activityTypes[platform][Math.floor(Math.random() * activityTypes[platform].length)];
        
        // Replace {count} with a random number
        const count = Math.floor(Math.random() * 50) + 1;
        const message = activityType.replace('{count}', count);
        
        // Pick a random time
        const time = times[Math.floor(Math.random() * times.length)];
        
        activities.push({
            platform,
            message,
            time
        });
    }
    
    return activities;
}

/**
 * Update dashboard stats
 */
function updateDashboardStats() {
    console.log('Updating dashboard stats');
    
    // In a real implementation, this would fetch stats from an API
    // For this demo, we'll use data from localStorage
    
    // Get blog posts count
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const totalBlogPosts = document.getElementById('totalBlogPosts');
    if (totalBlogPosts) {
        totalBlogPosts.textContent = posts.length;
    }
    
    // Get connected social platforms count
    const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'google'];
    const connectedPlatforms = platforms.filter(platform => 
        localStorage.getItem(`${platform}Connected`) === 'true'
    );
    
    const totalSocialConnections = document.getElementById('totalSocialConnections');
    if (totalSocialConnections) {
        totalSocialConnections.textContent = connectedPlatforms.length;
    }
}

/**
 * Create social overview chart
 */
function createSocialOverviewChart() {
    console.log('Creating social overview chart');
    
    const ctx = document.getElementById('socialOverviewChart');
    if (!ctx || typeof Chart === 'undefined') {
        console.warn('Social overview chart or Chart.js not found');
        return;
    }
    
    // Check which platforms are connected
    const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'google'];
    const connectedPlatforms = platforms.filter(platform => 
        localStorage.getItem(`${platform}Connected`) === 'true'
    );
    
    if (connectedPlatforms.length === 0) {
        // No platforms connected, show empty chart
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['No Data'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#e9ecef'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
        return;
    }
    
    // Generate random engagement data for connected platforms
    const data = [];
    const labels = [];
    const colors = [];
    
    connectedPlatforms.forEach(platform => {
        // Random engagement between 10 and 100
        data.push(Math.floor(Math.random() * 90) + 10);
        labels.push(capitalizeFirstLetter(platform));
        colors.push(getPlatformColor(platform));
    });
    
    // Create the chart
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}% of engagement`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Show customization modal
 */
function showCustomizationModal() {
    console.log('Showing customization modal');
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('customizeDashboardModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = 'customizeDashboardModal';
        modal.tabIndex = '-1';
        modal.setAttribute('aria-labelledby', 'customizeDashboardModalLabel');
        modal.setAttribute('aria-hidden', 'true');
        
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="customizeDashboardModalLabel">Customize Dashboard</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Select which widgets to display on your dashboard:</p>
                        
                        <div class="mb-3">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="showBlogStats" checked>
                                <label class="form-check-label" for="showBlogStats">Blog Statistics</label>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="showSocialStats" checked>
                                <label class="form-check-label" for="showSocialStats">Social Media Statistics</label>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="showPerformanceStats" checked>
                                <label class="form-check-label" for="showPerformanceStats">Website Performance</label>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="showNotifications" checked>
                                <label class="form-check-label" for="showNotifications">Notifications</label>
                            </div>
                        </div>
                        
                        <hr>
                        
                        <p>Dashboard Theme:</p>
                        <div class="mb-3">
                            <select class="form-select" id="dashboardTheme">
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="blue">Blue</option>
                                <option value="green">Green</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="saveCustomizationBtn">Save Changes</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Set up save button
        const saveBtn = document.getElementById('saveCustomizationBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function() {
                saveCustomization();
                
                // Close modal
                if (window.bootstrap) {
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                }
            });
        }
    }
    
    // Load saved preferences
    loadCustomizationPreferences();
    
    // Show the modal
    if (window.bootstrap) {
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    }
}

/**
 * Load customization preferences
 */
function loadCustomizationPreferences() {
    // Load preferences from localStorage
    const showBlogStats = localStorage.getItem('showBlogStats') !== 'false';
    const showSocialStats = localStorage.getItem('showSocialStats') !== 'false';
    const showPerformanceStats = localStorage.getItem('showPerformanceStats') !== 'false';
    const showNotifications = localStorage.getItem('showNotifications') !== 'false';
    const dashboardTheme = localStorage.getItem('dashboardTheme') || 'light';
    
    // Update checkboxes
    const blogStatsCheckbox = document.getElementById('showBlogStats');
    if (blogStatsCheckbox) blogStatsCheckbox.checked = showBlogStats;
    
    const socialStatsCheckbox = document.getElementById('showSocialStats');
    if (socialStatsCheckbox) socialStatsCheckbox.checked = showSocialStats;
    
    const performanceStatsCheckbox = document.getElementById('showPerformanceStats');
    if (performanceStatsCheckbox) performanceStatsCheckbox.checked = showPerformanceStats;
    
    const notificationsCheckbox = document.getElementById('showNotifications');
    if (notificationsCheckbox) notificationsCheckbox.checked = showNotifications;
    
    // Update theme selector
    const themeSelector = document.getElementById('dashboardTheme');
    if (themeSelector) themeSelector.value = dashboardTheme;
}

/**
 * Save customization preferences
 */
function saveCustomization() {
    console.log('Saving customization preferences');
    
    // Get values from form
    const showBlogStats = document.getElementById('showBlogStats')?.checked ?? true;
    const showSocialStats = document.getElementById('showSocialStats')?.checked ?? true;
    const showPerformanceStats = document.getElementById('showPerformanceStats')?.checked ?? true;
    const showNotifications = document.getElementById('showNotifications')?.checked ?? true;
    const dashboardTheme = document.getElementById('dashboardTheme')?.value || 'light';
    
    // Save to localStorage
    localStorage.setItem('showBlogStats', showBlogStats);
    localStorage.setItem('showSocialStats', showSocialStats);
    localStorage.setItem('showPerformanceStats', showPerformanceStats);
    localStorage.setItem('showNotifications', showNotifications);
    localStorage.setItem('dashboardTheme', dashboardTheme);
    
    // Apply changes
    applyCustomization();
    
    // Show success message
    if (window.Toastify) {
        Toastify({
            text: 'Dashboard customization saved!',
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast();
    } else {
        alert('Dashboard customization saved!');
    }
}

/**
 * Apply customization changes
 */
function applyCustomization() {
    console.log('Applying customization changes');
    
    // Get preferences from localStorage
    const showBlogStats = localStorage.getItem('showBlogStats') !== 'false';
    const showSocialStats = localStorage.getItem('showSocialStats') !== 'false';
    const showPerformanceStats = localStorage.getItem('showPerformanceStats') !== 'false';
    const showNotifications = localStorage.getItem('showNotifications') !== 'false';
    const dashboardTheme = localStorage.getItem('dashboardTheme') || 'light';
    
    // Apply visibility settings
    const blogStatsCard = document.querySelector('.card:has(#totalBlogPosts)');
    if (blogStatsCard) blogStatsCard.style.display = showBlogStats ? 'block' : 'none';
    
    const socialStatsCard = document.querySelector('.card:has(#totalSocialConnections)');
    if (socialStatsCard) socialStatsCard.style.display = showSocialStats ? 'block' : 'none';
    
    const performanceCard = document.querySelector('.card:has(#websitePerformanceChart)');
    if (performanceCard) performanceCard.style.display = showPerformanceStats ? 'block' : 'none';
    
    const notificationsCard = document.querySelector('.card:has(#notificationCenter)');
    if (notificationsCard) notificationsCard.style.display = showNotifications ? 'block' : 'none';
    
    // Apply theme
    applyDashboardTheme(dashboardTheme);
}

/**
 * Apply dashboard theme
 */
function applyDashboardTheme(theme) {
    console.log('Applying dashboard theme:', theme);
    
    // Remove existing theme classes
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-green');
    
    // Add new theme class
    document.body.classList.add(`theme-${theme}`);
    
    // Apply theme-specific styles
    const themeStyles = {
        light: {
            '--primary-color': '#0c3c63',
            '--secondary-color': '#1c5a8d',
            '--bg-color': '#f8f9fa',
            '--text-color': '#2c3e50'
        },
        dark: {
            '--primary-color': '#375a7f',
            '--secondary-color': '#2c3e50',
            '--bg-color': '#222',
            '--text-color': '#fff'
        },
        blue: {
            '--primary-color': '#1976d2',
            '--secondary-color': '#0d47a1',
            '--bg-color': '#f5f9ff',
            '--text-color': '#0d47a1'
        },
        green: {
            '--primary-color': '#2e7d32',
            '--secondary-color': '#1b5e20',
            '--bg-color': '#f1f8e9',
            '--text-color': '#1b5e20'
        }
    };
    
    // Apply CSS variables
    const root = document.documentElement;
    const styles = themeStyles[theme] || themeStyles.light;
    
    for (const [property, value] of Object.entries(styles)) {
        root.style.setProperty(property, value);
    }
}

/**
 * Get color for a specific platform
 */
function getPlatformColor(platform) {
    const colors = {
        facebook: '#3b5998',
        instagram: '#e1306c',
        twitter: '#1da1f2',
        linkedin: '#0077b5',
        google: '#db4437'
    };
    
    return colors[platform.toLowerCase()] || '#6c757d';
}

/**
 * Helper function to capitalize first letter
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}