/**
 * Social Media Real-Time Analytics Integration
 * This script provides real-time connectivity with social media platforms
 * for analytics data visualization and monitoring.
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Social Media Real-Time Analytics loaded');
    
    // Handle the case where there are multiple analytics sections
    // We need to make sure we only initialize once the correct section is visible
    setTimeout(() => {
        initSocialAnalytics();
        
        // Add event listeners for tab/section changes to reinitialize if needed
        document.querySelectorAll('[data-section="analytics"]').forEach(link => {
            link.addEventListener('click', function() {
                // Wait for the section to become visible
                setTimeout(() => {
                    console.log('Analytics section activated via navigation');
                    initSocialAnalytics();
                }, 100);
            });
        });
    }, 500); // Small delay to ensure DOM is fully processed
});

/**
 * Initialize social media analytics functionality
 */
function initSocialAnalytics() {
    console.log('Initializing social analytics');
    
    // Find all analytics sections (there might be multiple in different views)
    const analyticsSections = document.querySelectorAll('.section[id="analytics"]');
    if (analyticsSections.length === 0) {
        console.warn('No analytics sections found');
        return;
    }
    
    console.log(`Found ${analyticsSections.length} analytics sections`);
    
    // Find visible analytics section
    let visibleSection = null;
    for (const section of analyticsSections) {
        if (section.offsetParent !== null) { // Check if element is visible
            visibleSection = section;
            break;
        }
    }
    
    // If no visible section, use the last one
    if (!visibleSection) {
        visibleSection = analyticsSections[analyticsSections.length - 1];
    }
    
    // If we already initialized this section, don't do it again
    if (visibleSection.getAttribute('data-analytics-initialized') === 'true') {
        console.log('Analytics section already initialized');
        return;
    }
    
    // Mark this section as initialized
    visibleSection.setAttribute('data-analytics-initialized', 'true');
    
    // Store the active section
    window.activeAnalyticsSection = visibleSection;
    
    // Set up API connections
    setupApiConnections();
    
    // Initialize real-time data fetching
    initRealTimeData();
    
    // Set up analytics charts
    setupAnalyticsCharts();
    
    // Add event listeners for settings changes
    setupSettingsListeners();
}

/**
 * Set up API connections based on settings
 */
function setupApiConnections() {
    console.log('Setting up API connections');
    
    // Get API settings from localStorage or config
    const apiSettings = getApiSettings();
    
    // Check if we have the necessary API credentials
    const platforms = ['facebook', 'twitter', 'linkedin', 'instagram', 'google'];
    
    platforms.forEach(platform => {
        const hasCredentials = checkApiCredentials(platform, apiSettings);
        updateConnectionStatus(platform, hasCredentials);
        
        if (hasCredentials) {
            // Initialize connection for this platform
            initPlatformConnection(platform, apiSettings[platform]);
        }
    });
}

/**
 * Get API settings from localStorage or config
 */
function getApiSettings() {
    // Try to get from localStorage first (for demo/testing)
    const localSettings = localStorage.getItem('socialApiSettings');
    if (localSettings) {
        try {
            return JSON.parse(localSettings);
        } catch (e) {
            console.error('Error parsing local API settings:', e);
        }
    }
    
    // Default settings structure
    return {
        facebook: {
            appId: localStorage.getItem('facebookAppId') || '',
            appSecret: localStorage.getItem('facebookAppSecret') || '',
            accessToken: localStorage.getItem('facebookAccessToken') || '',
            connected: localStorage.getItem('facebookConnected') === 'true'
        },
        twitter: {
            apiKey: localStorage.getItem('twitterApiKey') || '',
            apiSecret: localStorage.getItem('twitterApiSecret') || '',
            accessToken: localStorage.getItem('twitterAccessToken') || '',
            accessTokenSecret: localStorage.getItem('twitterAccessTokenSecret') || '',
            connected: localStorage.getItem('twitterConnected') === 'true'
        },
        linkedin: {
            clientId: localStorage.getItem('linkedinClientId') || '',
            clientSecret: localStorage.getItem('linkedinClientSecret') || '',
            accessToken: localStorage.getItem('linkedinAccessToken') || '',
            connected: localStorage.getItem('linkedinConnected') === 'true'
        },
        instagram: {
            accessToken: localStorage.getItem('instagramAccessToken') || '',
            userId: localStorage.getItem('instagramUserId') || '',
            connected: localStorage.getItem('instagramConnected') === 'true'
        },
        google: {
            clientId: localStorage.getItem('googleClientId') || '',
            clientSecret: localStorage.getItem('googleClientSecret') || '',
            accessToken: localStorage.getItem('googleAccessToken') || '',
            connected: localStorage.getItem('googleConnected') === 'true'
        }
    };
}

/**
 * Check if we have the necessary API credentials for a platform
 */
function checkApiCredentials(platform, settings) {
    if (!settings || !settings[platform]) {
        return false;
    }
    
    const platformSettings = settings[platform];
    
    // Check if connected flag is set
    if (platformSettings.connected) {
        return true;
    }
    
    // Platform-specific credential checks
    switch (platform) {
        case 'facebook':
            return platformSettings.accessToken && (platformSettings.appId || platformSettings.appSecret);
        case 'twitter':
            return platformSettings.apiKey && platformSettings.apiSecret && 
                   platformSettings.accessToken && platformSettings.accessTokenSecret;
        case 'linkedin':
            return platformSettings.accessToken && (platformSettings.clientId || platformSettings.clientSecret);
        case 'instagram':
            return platformSettings.accessToken;
        case 'google':
            return platformSettings.accessToken && (platformSettings.clientId || platformSettings.clientSecret);
        default:
            return false;
    }
}

/**
 * Update connection status in the UI
 */
function updateConnectionStatus(platform, isConnected) {
    // Update status in the analytics section
    const statusElement = document.getElementById(`${platform}AnalyticsStatus`);
    if (statusElement) {
        statusElement.textContent = isConnected ? 'Connected' : 'Not Connected';
        statusElement.className = `badge ${isConnected ? 'bg-success' : 'bg-danger'}`;
    }
    
    // Update connection toggle if it exists
    const toggleElement = document.getElementById(`${platform}AnalyticsToggle`);
    if (toggleElement && toggleElement.type === 'checkbox') {
        toggleElement.checked = isConnected;
    }
    
    // Show/hide the analytics container
    const containerElement = document.getElementById(`${platform}AnalyticsContainer`);
    if (containerElement) {
        containerElement.style.display = isConnected ? 'block' : 'none';
    }
}

/**
 * Initialize connection to a specific platform
 */
function initPlatformConnection(platform, settings) {
    console.log(`Initializing ${platform} connection`);
    
    // In a real implementation, this would use the platform's SDK or API
    // For demo purposes, we'll simulate the connection
    
    // Create a connection status element if it doesn't exist
    createConnectionStatusElement(platform);
    
    // Create analytics container if it doesn't exist
    createAnalyticsContainer(platform);
    
    // Simulate API connection
    simulateApiConnection(platform, settings);
}

/**
 * Create connection status element
 */
function createConnectionStatusElement(platform) {
    const analyticsSection = window.activeAnalyticsSection;
    if (!analyticsSection) return;
    
    // Check if status element already exists
    let statusElement = document.getElementById(`${platform}AnalyticsStatus`);
    if (!statusElement) {
        // Create status container if it doesn't exist
        let statusContainer = document.getElementById('socialAnalyticsStatus');
        if (!statusContainer) {
            statusContainer = document.createElement('div');
            statusContainer.id = 'socialAnalyticsStatus';
            statusContainer.className = 'mb-4 d-flex flex-wrap gap-2';
            
            // Add heading
            const heading = document.createElement('h5');
            heading.className = 'w-100 mb-2';
            heading.textContent = 'Social Media Connections:';
            statusContainer.appendChild(heading);
            
            // Add to analytics section (after the first heading)
            const firstHeading = analyticsSection.querySelector('h3');
            if (firstHeading && firstHeading.nextElementSibling) {
                analyticsSection.insertBefore(statusContainer, firstHeading.nextElementSibling.nextElementSibling);
            } else {
                analyticsSection.appendChild(statusContainer);
            }
        }
        
        // Create platform status element
        const platformContainer = document.createElement('div');
        platformContainer.className = 'd-flex align-items-center me-3 mb-2';
        
        const platformIcon = document.createElement('i');
        platformIcon.className = `fab fa-${platform} me-2`;
        platformContainer.appendChild(platformIcon);
        
        const platformName = document.createElement('span');
        platformName.textContent = `${capitalizeFirstLetter(platform)}: `;
        platformName.className = 'me-1';
        platformContainer.appendChild(platformName);
        
        statusElement = document.createElement('span');
        statusElement.id = `${platform}AnalyticsStatus`;
        statusElement.className = 'badge bg-secondary';
        statusElement.textContent = 'Connecting...';
        platformContainer.appendChild(statusElement);
        
        statusContainer.appendChild(platformContainer);
    }
    
    return statusElement;
}

/**
 * Create analytics container for a platform
 */
function createAnalyticsContainer(platform) {
    const analyticsSection = window.activeAnalyticsSection;
    if (!analyticsSection) return;
    
    // Check if container already exists
    let container = document.getElementById(`${platform}AnalyticsContainer`);
    if (!container) {
        // Create analytics containers section if it doesn't exist
        let containersSection = document.getElementById('socialAnalyticsContainers');
        if (!containersSection) {
            containersSection = document.createElement('div');
            containersSection.id = 'socialAnalyticsContainers';
            containersSection.className = 'row';
            analyticsSection.appendChild(containersSection);
        }
        
        // Create platform container
        container = document.createElement('div');
        container.id = `${platform}AnalyticsContainer`;
        container.className = 'col-md-6 mb-4';
        
        // Create card
        const card = document.createElement('div');
        card.className = 'card h-100';
        
        // Create card header
        const cardHeader = document.createElement('div');
        cardHeader.className = 'card-header d-flex justify-content-between align-items-center';
        
        const headerTitle = document.createElement('h5');
        headerTitle.className = 'mb-0';
        headerTitle.innerHTML = `<i class="fab fa-${platform} me-2"></i> ${capitalizeFirstLetter(platform)} Analytics`;
        cardHeader.appendChild(headerTitle);
        
        // Create refresh button
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn btn-sm btn-outline-primary refresh-analytics-btn';
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i>';
        refreshBtn.setAttribute('data-platform', platform);
        refreshBtn.addEventListener('click', function() {
            refreshAnalyticsData(platform);
        });
        cardHeader.appendChild(refreshBtn);
        
        card.appendChild(cardHeader);
        
        // Create card body
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
        
        // Create canvas for chart
        const canvas = document.createElement('canvas');
        canvas.id = `${platform}AnalyticsChart`;
        cardBody.appendChild(canvas);
        
        // Create stats container
        const statsContainer = document.createElement('div');
        statsContainer.id = `${platform}StatsContainer`;
        statsContainer.className = 'mt-3';
        cardBody.appendChild(statsContainer);
        
        card.appendChild(cardBody);
        container.appendChild(card);
        
        // Add to containers section
        containersSection.appendChild(container);
    }
    
    return container;
}

/**
 * Simulate API connection to a platform
 */
function simulateApiConnection(platform, settings) {
    console.log(`Simulating ${platform} API connection`);
    
    // Update status to connecting
    const statusElement = document.getElementById(`${platform}AnalyticsStatus`);
    if (statusElement) {
        statusElement.textContent = 'Connecting...';
        statusElement.className = 'badge bg-warning';
    }
    
    // Simulate connection delay
    setTimeout(() => {
        // Update status to connected
        if (statusElement) {
            statusElement.textContent = 'Connected';
            statusElement.className = 'badge bg-success';
        }
        
        // Initialize data for this platform
        initPlatformData(platform);
    }, 1500);
}

/**
 * Initialize real-time data fetching
 */
function initRealTimeData() {
    console.log('Initializing real-time data fetching');
    
    // Clear any existing interval
    if (window.socialAnalyticsInterval) {
        console.log('Clearing existing analytics interval');
        clearInterval(window.socialAnalyticsInterval);
    }
    
    // Get refresh interval from settings (default to 60 seconds)
    const refreshInterval = parseInt(localStorage.getItem('refreshInterval') || '60', 10) * 1000;
    console.log(`Setting refresh interval to ${refreshInterval/1000} seconds`);
    
    // Set up periodic data refresh
    window.socialAnalyticsInterval = setInterval(() => {
        refreshAllAnalyticsData();
    }, refreshInterval);
    
    // Initial data refresh
    refreshAllAnalyticsData();
    
    // Add event listener for the toggle button
    const toggleButton = document.getElementById('toggleRealTimeUpdates');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            const statusSpan = document.getElementById('realTimeStatus');
            if (window.socialAnalyticsInterval) {
                // Turn off real-time updates
                clearInterval(window.socialAnalyticsInterval);
                window.socialAnalyticsInterval = null;
                this.classList.remove('btn-outline-secondary');
                this.classList.add('btn-outline-danger');
                if (statusSpan) statusSpan.textContent = 'OFF';
            } else {
                // Turn on real-time updates
                window.socialAnalyticsInterval = setInterval(() => {
                    refreshAllAnalyticsData();
                }, refreshInterval);
                this.classList.remove('btn-outline-danger');
                this.classList.add('btn-outline-secondary');
                if (statusSpan) statusSpan.textContent = 'ON';
            }
        });
    }
}

/**
 * Refresh analytics data for all connected platforms
 */
function refreshAllAnalyticsData() {
    const platforms = ['facebook', 'twitter', 'linkedin', 'instagram', 'google'];
    
    platforms.forEach(platform => {
        const isConnected = document.getElementById(`${platform}AnalyticsStatus`)?.textContent === 'Connected';
        if (isConnected) {
            refreshAnalyticsData(platform);
        }
    });
}

/**
 * Refresh analytics data for a specific platform
 */
function refreshAnalyticsData(platform) {
    console.log(`Refreshing ${platform} analytics data`);
    
    // Get the refresh button and add spinning animation
    const refreshBtn = document.querySelector(`.refresh-analytics-btn[data-platform="${platform}"]`);
    if (refreshBtn) {
        const icon = refreshBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-spinner fa-spin';
        }
    }
    
    // Simulate API data fetch
    setTimeout(() => {
        // Generate random data
        const data = generateRandomAnalyticsData(platform);
        
        // Update chart
        updateAnalyticsChart(platform, data);
        
        // Update stats
        updateAnalyticsStats(platform, data);
        
        // Reset refresh button
        if (refreshBtn) {
            const icon = refreshBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-sync-alt';
            }
        }
        
        // Show success toast
        if (window.Toastify) {
            Toastify({
                text: `${capitalizeFirstLetter(platform)} analytics data updated`,
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
            }).showToast();
        }
    }, 1000);
}

/**
 * Generate random analytics data for demo purposes
 */
function generateRandomAnalyticsData(platform) {
    // Generate labels (last 7 days)
    const labels = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    // Generate engagement data
    const engagementData = [];
    for (let i = 0; i < 7; i++) {
        engagementData.push(Math.floor(Math.random() * 500) + 100);
    }
    
    // Generate followers/likes data
    const followersData = [];
    let followers = Math.floor(Math.random() * 5000) + 1000;
    for (let i = 0; i < 7; i++) {
        const change = Math.floor(Math.random() * 50) - 10;
        followers += change;
        followersData.push(followers);
    }
    
    // Generate reach data
    const reachData = [];
    for (let i = 0; i < 7; i++) {
        reachData.push(Math.floor(Math.random() * 2000) + 500);
    }
    
    // Generate platform-specific stats
    const stats = {
        posts: Math.floor(Math.random() * 20) + 5,
        engagement: Math.floor(Math.random() * 15) + 2,
        followers: followersData[followersData.length - 1],
        reach: reachData.reduce((a, b) => a + b, 0),
        likes: Math.floor(Math.random() * 1000) + 200,
        shares: Math.floor(Math.random() * 300) + 50
    };
    
    return {
        labels,
        engagementData,
        followersData,
        reachData,
        stats
    };
}

/**
 * Set up analytics charts
 */
function setupAnalyticsCharts() {
    console.log('Setting up analytics charts');
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not available');
        return;
    }
    
    // Set default chart options
    Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    Chart.defaults.color = '#666';
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
}

/**
 * Update analytics chart for a platform
 */
function updateAnalyticsChart(platform, data) {
    const chartCanvas = document.getElementById(`${platform}AnalyticsChart`);
    if (!chartCanvas) return;
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not available');
        return;
    }
    
    // Destroy existing chart if it exists
    if (window[`${platform}Chart`]) {
        window[`${platform}Chart`].destroy();
    }
    
    // Get platform color
    const color = getPlatformColor(platform);
    
    // Create new chart
    window[`${platform}Chart`] = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [
                {
                    label: 'Engagement',
                    data: data.engagementData,
                    borderColor: color,
                    backgroundColor: hexToRgba(color, 0.1),
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Followers',
                    data: data.followersData,
                    borderColor: '#28a745',
                    backgroundColor: 'transparent',
                    tension: 0.4,
                    borderDash: [5, 5]
                },
                {
                    label: 'Reach',
                    data: data.reachData,
                    borderColor: '#17a2b8',
                    backgroundColor: 'transparent',
                    tension: 0.4,
                    borderDash: [3, 3]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
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
    
    // Set canvas height
    chartCanvas.style.height = '250px';
}

/**
 * Update analytics stats for a platform
 */
function updateAnalyticsStats(platform, data) {
    const statsContainer = document.getElementById(`${platform}StatsContainer`);
    if (!statsContainer) return;
    
    // Create stats HTML
    const statsHtml = `
        <div class="row text-center">
            <div class="col-4">
                <div class="stat-item">
                    <div class="stat-value">${data.stats.followers.toLocaleString()}</div>
                    <div class="stat-label">Followers</div>
                </div>
            </div>
            <div class="col-4">
                <div class="stat-item">
                    <div class="stat-value">${data.stats.engagement}%</div>
                    <div class="stat-label">Engagement</div>
                </div>
            </div>
            <div class="col-4">
                <div class="stat-item">
                    <div class="stat-value">${data.stats.reach.toLocaleString()}</div>
                    <div class="stat-label">Reach</div>
                </div>
            </div>
        </div>
        <div class="row text-center mt-3">
            <div class="col-4">
                <div class="stat-item">
                    <div class="stat-value">${data.stats.posts}</div>
                    <div class="stat-label">Posts</div>
                </div>
            </div>
            <div class="col-4">
                <div class="stat-item">
                    <div class="stat-value">${data.stats.likes.toLocaleString()}</div>
                    <div class="stat-label">Likes</div>
                </div>
            </div>
            <div class="col-4">
                <div class="stat-item">
                    <div class="stat-value">${data.stats.shares.toLocaleString()}</div>
                    <div class="stat-label">Shares</div>
                </div>
            </div>
        </div>
    `;
    
    // Update container
    statsContainer.innerHTML = statsHtml;
    
    // Add CSS if not already added
    if (!document.getElementById('socialAnalyticsStyles')) {
        const style = document.createElement('style');
        style.id = 'socialAnalyticsStyles';
        style.textContent = `
            .stat-item {
                padding: 10px;
                border-radius: 8px;
                background-color: rgba(0,0,0,0.03);
            }
            .stat-value {
                font-size: 1.2rem;
                font-weight: bold;
                color: #333;
            }
            .stat-label {
                font-size: 0.8rem;
                color: #666;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Set up event listeners for settings changes
 */
function setupSettingsListeners() {
    // Listen for settings form submission
    const socialSettingsForm = document.getElementById('socialSettingsForm');
    if (socialSettingsForm) {
        socialSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSocialApiSettings();
        });
    }
    
    // Listen for API key changes in settings
    const apiInputs = document.querySelectorAll('input[id$="ApiKey"], input[id$="AccessToken"], input[id$="AppId"], input[id$="ClientId"]');
    apiInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Mark settings as changed
            localStorage.setItem('socialSettingsChanged', 'true');
        });
    });
    
    // Add save button to social tab if it doesn't exist
    const socialTab = document.getElementById('social');
    if (socialTab && !document.getElementById('saveSocialSettings')) {
        const saveBtn = document.createElement('button');
        saveBtn.id = 'saveSocialSettings';
        saveBtn.className = 'btn btn-primary mt-3';
        saveBtn.textContent = 'Save API Settings';
        saveBtn.addEventListener('click', saveSocialApiSettings);
        socialTab.appendChild(saveBtn);
    }
}

/**
 * Save social API settings
 */
function saveSocialApiSettings() {
    console.log('Saving social API settings');
    
    // Collect settings from form inputs
    const settings = {
        facebook: {
            appId: document.getElementById('facebookAppId')?.value || '',
            appSecret: document.getElementById('facebookAppSecret')?.value || '',
            accessToken: document.getElementById('facebookAccessToken')?.value || '',
            connected: localStorage.getItem('facebookConnected') === 'true'
        },
        twitter: {
            apiKey: document.getElementById('twitterApiKey')?.value || '',
            apiSecret: document.getElementById('twitterApiSecret')?.value || '',
            accessToken: document.getElementById('twitterAccessToken')?.value || '',
            accessTokenSecret: document.getElementById('twitterAccessTokenSecret')?.value || '',
            connected: localStorage.getItem('twitterConnected') === 'true'
        },
        linkedin: {
            clientId: document.getElementById('linkedinClientId')?.value || '',
            clientSecret: document.getElementById('linkedinClientSecret')?.value || '',
            accessToken: document.getElementById('linkedinAccessToken')?.value || '',
            connected: localStorage.getItem('linkedinConnected') === 'true'
        },
        instagram: {
            accessToken: document.getElementById('instagramAccessToken')?.value || '',
            userId: document.getElementById('instagramUserId')?.value || '',
            connected: localStorage.getItem('instagramConnected') === 'true'
        },
        google: {
            clientId: document.getElementById('googleClientId')?.value || '',
            clientSecret: document.getElementById('googleClientSecret')?.value || '',
            accessToken: document.getElementById('googleAccessToken')?.value || '',
            connected: localStorage.getItem('googleConnected') === 'true'
        }
    };
    
    // Save to localStorage
    localStorage.setItem('socialApiSettings', JSON.stringify(settings));
    
    // Save individual settings
    Object.keys(settings).forEach(platform => {
        Object.keys(settings[platform]).forEach(key => {
            if (key !== 'connected') {
                localStorage.setItem(`${platform}${capitalizeFirstLetter(key)}`, settings[platform][key]);
            }
        });
    });
    
    // Clear changed flag
    localStorage.removeItem('socialSettingsChanged');
    
    // Show success message
    if (window.Toastify) {
        Toastify({
            text: 'Social API settings saved successfully!',
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
        }).showToast();
    } else {
        alert('Social API settings saved successfully!');
    }
    
    // Reinitialize connections
    setupApiConnections();
}

/**
 * Initialize platform data
 */
function initPlatformData(platform) {
    // Generate initial data
    const data = generateRandomAnalyticsData(platform);
    
    // Update chart
    updateAnalyticsChart(platform, data);
    
    // Update stats
    updateAnalyticsStats(platform, data);
}

/**
 * Get platform color
 */
function getPlatformColor(platform) {
    const colors = {
        facebook: '#1877f2',
        twitter: '#1da1f2',
        linkedin: '#0077b5',
        instagram: '#e1306c',
        google: '#ea4335'
    };
    
    return colors[platform] || '#6c757d';
}

/**
 * Convert hex color to rgba
 */
function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Helper function to capitalize first letter
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}