/**
 * Social Media Analytics
 * Provides comprehensive analytics for all connected social media platforms
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Social media analytics loaded');
    initSocialAnalytics();
});

/**
 * Initialize social media analytics functionality
 */
function initSocialAnalytics() {
    console.log('Initializing social media analytics');
    
    // Check if any social media accounts are connected
    const hasSocialConnections = checkSocialConnections();
    
    if (hasSocialConnections) {
        // Load analytics data
        loadAnalyticsData();
        
        // Set up analytics charts
        setupAnalyticsCharts();
        
        // Set up analytics filters
        setupAnalyticsFilters();
        
        // Set up data refresh
        setupDataRefresh();
    } else {
        // Show connection prompt
        showConnectionPrompt();
    }
}

/**
 * Check if any social media accounts are connected
 */
function checkSocialConnections() {
    const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'google'];
    
    // Check if any platform is connected
    return platforms.some(platform => localStorage.getItem(`${platform}Connected`) === 'true');
}

/**
 * Load analytics data for all connected platforms
 */
function loadAnalyticsData() {
    console.log('Loading social media analytics data');
    
    // In a real implementation, this would fetch data from APIs
    // For this demo, we'll use mock data
    
    // Show loading state
    const analyticsContainer = document.getElementById('socialAnalyticsData');
    if (analyticsContainer) {
        analyticsContainer.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading analytics data from all platforms...</p>
            </div>
        `;
    }
    
    // Simulate API delay
    setTimeout(() => {
        // Generate mock data
        const analyticsData = generateMockAnalyticsData();
        
        // Store data in localStorage for charts to use
        localStorage.setItem('socialAnalyticsData', JSON.stringify(analyticsData));
        
        // Update the UI
        updateAnalyticsUI(analyticsData);
        
        // Update charts
        updateAnalyticsCharts(analyticsData);
    }, 1500);
}

/**
 * Generate mock analytics data for demonstration
 */
function generateMockAnalyticsData() {
    const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'google'];
    const data = {};
    
    // Only include connected platforms
    platforms.forEach(platform => {
        if (localStorage.getItem(`${platform}Connected`) === 'true') {
            data[platform] = generatePlatformData(platform);
        }
    });
    
    return {
        platforms: data,
        summary: generateSummaryData(data),
        trends: generateTrendData(data),
        lastUpdated: new Date().toISOString()
    };
}

/**
 * Generate mock data for a specific platform
 */
function generatePlatformData(platform) {
    // Base metrics for all platforms
    const baseMetrics = {
        followers: Math.floor(1000 + Math.random() * 9000),
        engagement: Math.floor(50 + Math.random() * 200),
        reach: Math.floor(5000 + Math.random() * 15000),
        impressions: Math.floor(8000 + Math.random() * 22000),
        clicks: Math.floor(100 + Math.random() * 900)
    };
    
    // Platform-specific metrics
    const platformMetrics = {
        facebook: {
            likes: Math.floor(500 + Math.random() * 1500),
            shares: Math.floor(50 + Math.random() * 150),
            comments: Math.floor(30 + Math.random() * 120)
        },
        instagram: {
            likes: Math.floor(800 + Math.random() * 2200),
            comments: Math.floor(50 + Math.random() * 150),
            saves: Math.floor(20 + Math.random() * 80)
        },
        twitter: {
            retweets: Math.floor(30 + Math.random() * 120),
            likes: Math.floor(200 + Math.random() * 800),
            replies: Math.floor(10 + Math.random() * 40)
        },
        linkedin: {
            reactions: Math.floor(100 + Math.random() * 400),
            shares: Math.floor(20 + Math.random() * 80),
            comments: Math.floor(15 + Math.random() * 60)
        },
        google: {
            views: Math.floor(1000 + Math.random() * 5000),
            clicks: Math.floor(50 + Math.random() * 200),
            ctr: (Math.random() * 5 + 1).toFixed(2) + '%'
        }
    };
    
    // Generate historical data (last 7 days)
    const historical = {
        followers: generateHistoricalData(baseMetrics.followers, 7),
        engagement: generateHistoricalData(baseMetrics.engagement, 7),
        reach: generateHistoricalData(baseMetrics.reach, 7),
        impressions: generateHistoricalData(baseMetrics.impressions, 7)
    };
    
    // Generate content performance data
    const contentPerformance = generateContentPerformance(platform);
    
    return {
        ...baseMetrics,
        ...platformMetrics[platform],
        historical,
        contentPerformance,
        growthRate: (Math.random() * 8 - 2).toFixed(2) + '%'
    };
}

/**
 * Generate historical data points
 */
function generateHistoricalData(currentValue, days) {
    const data = [];
    let value = currentValue;
    
    // Generate data points for each day, working backwards
    for (let i = 0; i < days; i++) {
        // Random fluctuation between -5% and +5%
        const change = value * (Math.random() * 0.1 - 0.05);
        value = Math.max(0, Math.round(value - change));
        
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.unshift({
            date: date.toISOString().split('T')[0],
            value
        });
    }
    
    return data;
}

/**
 * Generate content performance data
 */
function generateContentPerformance(platform) {
    const contentTypes = {
        facebook: ['Link', 'Photo', 'Video', 'Status', 'Event'],
        instagram: ['Photo', 'Video', 'Carousel', 'Reel', 'Story'],
        twitter: ['Text', 'Image', 'Video', 'Link', 'Poll'],
        linkedin: ['Article', 'Document', 'Image', 'Video', 'Poll'],
        google: ['Post', 'Photo', 'Event', 'Offer', 'Update']
    };
    
    return contentTypes[platform].map(type => ({
        type,
        engagement: Math.floor(10 + Math.random() * 90),
        reach: Math.floor(500 + Math.random() * 1500),
        clicks: Math.floor(5 + Math.random() * 45)
    }));
}

/**
 * Generate summary data across all platforms
 */
function generateSummaryData(platformData) {
    const summary = {
        totalFollowers: 0,
        totalEngagement: 0,
        totalReach: 0,
        totalImpressions: 0,
        averageEngagementRate: 0,
        platformComparison: []
    };
    
    // Calculate totals
    Object.keys(platformData).forEach(platform => {
        const data = platformData[platform];
        summary.totalFollowers += data.followers;
        summary.totalEngagement += data.engagement;
        summary.totalReach += data.reach;
        summary.totalImpressions += data.impressions;
        
        summary.platformComparison.push({
            platform,
            followers: data.followers,
            engagement: data.engagement,
            reach: data.reach,
            growthRate: data.growthRate
        });
    });
    
    // Calculate average engagement rate
    if (summary.totalImpressions > 0) {
        summary.averageEngagementRate = ((summary.totalEngagement / summary.totalImpressions) * 100).toFixed(2) + '%';
    } else {
        summary.averageEngagementRate = '0%';
    }
    
    return summary;
}

/**
 * Generate trend data
 */
function generateTrendData(platformData) {
    return {
        growingPlatform: findGrowingPlatform(platformData),
        topContentType: findTopContentType(platformData),
        bestTimeToPost: generateBestTimeToPost(),
        recommendedActions: generateRecommendedActions(platformData)
    };
}

/**
 * Find the platform with the highest growth rate
 */
function findGrowingPlatform(platformData) {
    let highestGrowth = -100;
    let growingPlatform = '';
    
    Object.keys(platformData).forEach(platform => {
        const growthRate = parseFloat(platformData[platform].growthRate);
        if (growthRate > highestGrowth) {
            highestGrowth = growthRate;
            growingPlatform = platform;
        }
    });
    
    return {
        platform: growingPlatform,
        growthRate: platformData[growingPlatform]?.growthRate || '0%'
    };
}

/**
 * Find the top performing content type across platforms
 */
function findTopContentType(platformData) {
    let highestEngagement = 0;
    let topType = '';
    let platform = '';
    
    Object.keys(platformData).forEach(p => {
        platformData[p].contentPerformance.forEach(content => {
            if (content.engagement > highestEngagement) {
                highestEngagement = content.engagement;
                topType = content.type;
                platform = p;
            }
        });
    });
    
    return {
        type: topType,
        platform,
        engagement: highestEngagement
    };
}

/**
 * Generate best time to post recommendation
 */
function generateBestTimeToPost() {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const times = ['9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '8:00 PM'];
    
    return {
        day: days[Math.floor(Math.random() * days.length)],
        time: times[Math.floor(Math.random() * times.length)]
    };
}

/**
 * Generate recommended actions based on data
 */
function generateRecommendedActions(platformData) {
    const recommendations = [
        'Increase posting frequency on your fastest growing platform',
        'Focus on creating more of your top-performing content type',
        'Engage more with comments to boost engagement rates',
        'Cross-promote content between platforms for wider reach',
        'Schedule posts for optimal engagement times'
    ];
    
    // Randomly select 3 recommendations
    const selected = [];
    while (selected.length < 3) {
        const index = Math.floor(Math.random() * recommendations.length);
        if (!selected.includes(recommendations[index])) {
            selected.push(recommendations[index]);
        }
    }
    
    return selected;
}

/**
 * Update the analytics UI with data
 */
function updateAnalyticsUI(data) {
    console.log('Updating analytics UI with data');
    
    const analyticsContainer = document.getElementById('socialAnalyticsData');
    if (!analyticsContainer) return;
    
    // Create the analytics dashboard
    analyticsContainer.innerHTML = `
        <div class="row">
            <div class="col-12 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Social Media Summary</h5>
                        <div class="row text-center">
                            <div class="col-md-3 col-6 mb-3">
                                <h6 class="text-muted">Total Followers</h6>
                                <h3>${data.summary.totalFollowers.toLocaleString()}</h3>
                            </div>
                            <div class="col-md-3 col-6 mb-3">
                                <h6 class="text-muted">Total Engagement</h6>
                                <h3>${data.summary.totalEngagement.toLocaleString()}</h3>
                            </div>
                            <div class="col-md-3 col-6 mb-3">
                                <h6 class="text-muted">Total Reach</h6>
                                <h3>${data.summary.totalReach.toLocaleString()}</h3>
                            </div>
                            <div class="col-md-3 col-6 mb-3">
                                <h6 class="text-muted">Engagement Rate</h6>
                                <h3>${data.summary.averageEngagementRate}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-lg-8 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Engagement Trends</h5>
                        <div class="chart-container" style="position: relative; height:300px;">
                            <canvas id="engagementChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Platform Comparison</h5>
                        <div class="chart-container" style="position: relative; height:300px;">
                            <canvas id="platformComparisonChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Content Performance</h5>
                        <div class="chart-container" style="position: relative; height:250px;">
                            <canvas id="contentPerformanceChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Insights & Recommendations</h5>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <i class="fas fa-chart-line text-success me-2"></i>
                                <strong>Fastest Growing:</strong> ${capitalizeFirstLetter(data.trends.growingPlatform.platform)} (${data.trends.growingPlatform.growthRate} growth)
                            </li>
                            <li class="list-group-item">
                                <i class="fas fa-star text-warning me-2"></i>
                                <strong>Top Content:</strong> ${data.trends.topContentType.type} on ${capitalizeFirstLetter(data.trends.topContentType.platform)}
                            </li>
                            <li class="list-group-item">
                                <i class="fas fa-clock text-info me-2"></i>
                                <strong>Best Time to Post:</strong> ${data.trends.bestTimeToPost.day} at ${data.trends.bestTimeToPost.time}
                            </li>
                        </ul>
                        <h6 class="mt-3">Recommended Actions:</h6>
                        <ul class="list-group list-group-flush">
                            ${data.trends.recommendedActions.map(action => `
                                <li class="list-group-item">
                                    <i class="fas fa-check-circle text-primary me-2"></i> ${action}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="row">
            ${Object.keys(data.platforms).map(platform => `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card">
                        <div class="card-header bg-light">
                            <h5 class="mb-0">
                                <i class="fab fa-${platform.toLowerCase()} me-2"></i>
                                ${capitalizeFirstLetter(platform)}
                            </h5>
                        </div>
                        <div class="card-body">
                            <div class="row text-center">
                                <div class="col-6 mb-3">
                                    <h6 class="text-muted">Followers</h6>
                                    <h4>${data.platforms[platform].followers.toLocaleString()}</h4>
                                    <small class="text-${parseFloat(data.platforms[platform].growthRate) >= 0 ? 'success' : 'danger'}">
                                        <i class="fas fa-${parseFloat(data.platforms[platform].growthRate) >= 0 ? 'arrow-up' : 'arrow-down'}"></i>
                                        ${data.platforms[platform].growthRate}
                                    </small>
                                </div>
                                <div class="col-6 mb-3">
                                    <h6 class="text-muted">Engagement</h6>
                                    <h4>${data.platforms[platform].engagement.toLocaleString()}</h4>
                                </div>
                            </div>
                            <div class="platform-chart-container" style="position: relative; height:150px;">
                                <canvas id="${platform}Chart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="text-end text-muted mt-2">
            <small>Last updated: ${new Date(data.lastUpdated).toLocaleString()}</small>
            <button id="refreshAnalyticsBtn" class="btn btn-sm btn-outline-primary ms-2">
                <i class="fas fa-sync-alt me-1"></i> Refresh Data
            </button>
        </div>
    `;
    
    // Set up refresh button
    const refreshBtn = document.getElementById('refreshAnalyticsBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            loadAnalyticsData();
        });
    }
}

/**
 * Set up analytics charts
 */
function setupAnalyticsCharts() {
    console.log('Setting up analytics charts');
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not found, skipping chart initialization');
        return;
    }
    
    // Load data from localStorage
    const data = JSON.parse(localStorage.getItem('socialAnalyticsData') || '{}');
    if (Object.keys(data).length === 0) {
        console.warn('No analytics data available for charts');
        return;
    }
    
    // Update charts with data
    updateAnalyticsCharts(data);
}

/**
 * Update analytics charts with data
 */
function updateAnalyticsCharts(data) {
    console.log('Updating analytics charts with data');
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not found, skipping chart updates');
        return;
    }
    
    // Clear any existing charts
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.destroy();
    });
    
    // Create engagement trend chart
    createEngagementChart(data);
    
    // Create platform comparison chart
    createPlatformComparisonChart(data);
    
    // Create content performance chart
    createContentPerformanceChart(data);
    
    // Create individual platform charts
    Object.keys(data.platforms).forEach(platform => {
        createPlatformChart(platform, data.platforms[platform]);
    });
}

/**
 * Create engagement trend chart
 */
function createEngagementChart(data) {
    const ctx = document.getElementById('engagementChart');
    if (!ctx) return;
    
    const platforms = Object.keys(data.platforms);
    const datasets = [];
    const labels = [];
    
    // Get labels from the first platform (all should have same dates)
    if (platforms.length > 0) {
        const firstPlatform = platforms[0];
        labels.push(...data.platforms[firstPlatform].historical.engagement.map(item => item.date));
    }
    
    // Create datasets for each platform
    platforms.forEach(platform => {
        const platformData = data.platforms[platform];
        const color = getPlatformColor(platform);
        
        datasets.push({
            label: capitalizeFirstLetter(platform),
            data: platformData.historical.engagement.map(item => item.value),
            borderColor: color,
            backgroundColor: color + '20',
            tension: 0.4,
            fill: true
        });
    });
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
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
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Create platform comparison chart
 */
function createPlatformComparisonChart(data) {
    const ctx = document.getElementById('platformComparisonChart');
    if (!ctx) return;
    
    const platforms = Object.keys(data.platforms);
    const followers = [];
    const engagement = [];
    const colors = [];
    
    platforms.forEach(platform => {
        followers.push(data.platforms[platform].followers);
        engagement.push(data.platforms[platform].engagement);
        colors.push(getPlatformColor(platform));
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: platforms.map(capitalizeFirstLetter),
            datasets: [
                {
                    label: 'Followers',
                    data: followers,
                    backgroundColor: colors.map(color => color + '80'),
                    borderColor: colors,
                    borderWidth: 1
                },
                {
                    label: 'Engagement',
                    data: engagement,
                    backgroundColor: colors.map(color => color + '40'),
                    borderColor: colors,
                    borderWidth: 1
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
                    beginAtZero: true
                }
            }
        }
    });
}

/**
 * Create content performance chart
 */
function createContentPerformanceChart(data) {
    const ctx = document.getElementById('contentPerformanceChart');
    if (!ctx) return;
    
    // Find platform with most content types
    let platformWithMostContent = '';
    let maxContentTypes = 0;
    
    Object.keys(data.platforms).forEach(platform => {
        const contentCount = data.platforms[platform].contentPerformance.length;
        if (contentCount > maxContentTypes) {
            maxContentTypes = contentCount;
            platformWithMostContent = platform;
        }
    });
    
    if (!platformWithMostContent) return;
    
    const contentData = data.platforms[platformWithMostContent].contentPerformance;
    const labels = contentData.map(item => item.type);
    const engagement = contentData.map(item => item.engagement);
    const reach = contentData.map(item => item.reach / 10); // Scale down for better visualization
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Engagement',
                    data: engagement,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                },
                {
                    label: 'Reach (scaled)',
                    data: reach,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: `${capitalizeFirstLetter(platformWithMostContent)} Content Performance`
                }
            }
        }
    });
}

/**
 * Create individual platform chart
 */
function createPlatformChart(platform, platformData) {
    const ctx = document.getElementById(`${platform}Chart`);
    if (!ctx) return;
    
    const labels = platformData.historical.followers.map(item => item.date);
    const followers = platformData.historical.followers.map(item => item.value);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Followers',
                    data: followers,
                    borderColor: getPlatformColor(platform),
                    backgroundColor: getPlatformColor(platform) + '20',
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
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

/**
 * Set up analytics filters
 */
function setupAnalyticsFilters() {
    console.log('Setting up analytics filters');
    
    // Find the filter container
    const filterContainer = document.getElementById('analyticsFilters');
    if (!filterContainer) {
        console.warn('Analytics filter container not found');
        return;
    }
    
    // Create filter UI
    filterContainer.innerHTML = `
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">Analytics Filters</h5>
                <div class="row g-3">
                    <div class="col-md-4">
                        <label class="form-label">Date Range</label>
                        <select class="form-select" id="dateRangeFilter">
                            <option value="7" selected>Last 7 days</option>
                            <option value="30">Last 30 days</option>
                            <option value="90">Last 90 days</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Platforms</label>
                        <div id="platformFilters">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="checkbox" id="allPlatforms" checked>
                                <label class="form-check-label" for="allPlatforms">All Platforms</label>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Metrics</label>
                        <select class="form-select" id="metricFilter">
                            <option value="all" selected>All Metrics</option>
                            <option value="engagement">Engagement</option>
                            <option value="followers">Followers</option>
                            <option value="reach">Reach</option>
                            <option value="impressions">Impressions</option>
                        </select>
                    </div>
                </div>
                <div class="text-end mt-3">
                    <button id="applyFiltersBtn" class="btn btn-primary">
                        <i class="fas fa-filter me-1"></i> Apply Filters
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add platform checkboxes
    const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'google'];
    const platformFilters = document.getElementById('platformFilters');
    
    if (platformFilters) {
        platforms.forEach(platform => {
            if (localStorage.getItem(`${platform}Connected`) === 'true') {
                const checkbox = document.createElement('div');
                checkbox.className = 'form-check form-check-inline';
                checkbox.innerHTML = `
                    <input class="form-check-input platform-filter" type="checkbox" id="${platform}Filter" value="${platform}" checked>
                    <label class="form-check-label" for="${platform}Filter">${capitalizeFirstLetter(platform)}</label>
                `;
                platformFilters.appendChild(checkbox);
            }
        });
    }
    
    // Set up all platforms checkbox
    const allPlatformsCheckbox = document.getElementById('allPlatforms');
    const platformCheckboxes = document.querySelectorAll('.platform-filter');
    
    if (allPlatformsCheckbox) {
        allPlatformsCheckbox.addEventListener('change', function() {
            platformCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
    
    // Set up apply filters button
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // In a real implementation, this would filter the data
            // For this demo, we'll just reload the data
            loadAnalyticsData();
        });
    }
}

/**
 * Set up data refresh functionality
 */
function setupDataRefresh() {
    console.log('Setting up data refresh');
    
    // Set up auto-refresh
    const refreshInterval = 5 * 60 * 1000; // 5 minutes
    
    setInterval(() => {
        console.log('Auto-refreshing analytics data');
        loadAnalyticsData();
    }, refreshInterval);
}

/**
 * Show connection prompt if no social media accounts are connected
 */
function showConnectionPrompt() {
    console.log('Showing connection prompt');
    
    const analyticsContainer = document.getElementById('socialAnalyticsData');
    if (!analyticsContainer) return;
    
    analyticsContainer.innerHTML = `
        <div class="card">
            <div class="card-body text-center py-5">
                <i class="fas fa-share-alt fa-4x text-muted mb-3"></i>
                <h4>Connect Your Social Media Accounts</h4>
                <p class="text-muted">You need to connect at least one social media account to view analytics.</p>
                <a href="#socialConnections" class="btn btn-primary mt-3">
                    <i class="fas fa-plug me-1"></i> Connect Accounts
                </a>
            </div>
        </div>
    `;
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
    
    return colors[platform] || '#6c757d';
}

/**
 * Helper function to capitalize first letter
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}