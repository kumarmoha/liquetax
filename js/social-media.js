/**
 * Social Media Management
 * Handles social media connections and posting
 */

// Social media platforms configuration
const SOCIAL_PLATFORMS = {
    facebook: {
        name: 'Facebook',
        icon: 'fab fa-facebook',
        color: '#1877f2',
        buttonClass: 'btn-primary'
    },
    instagram: {
        name: 'Instagram',
        icon: 'fab fa-instagram',
        color: '#e4405f',
        buttonClass: 'btn-danger'
    },
    twitter: {
        name: 'Twitter',
        icon: 'fab fa-twitter',
        color: '#1da1f2',
        buttonClass: 'btn-info'
    },
    linkedin: {
        name: 'LinkedIn',
        icon: 'fab fa-linkedin',
        color: '#0077b5',
        buttonClass: 'btn-info'
    },
    google: {
        name: 'Google Business',
        icon: 'fab fa-google',
        color: '#4285f4',
        buttonClass: 'btn-success'
    }
};

/**
 * Initialize social media functionality
 */
function initializeSocialMedia() {
    console.log('Initializing social media management...');
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSocialMedia);
        return;
    }

    // Set up social connection buttons
    setupSocialConnections();
    
    // Set up social post form
    setupSocialPostForm();
    
    // Update connection status
    updateAllConnectionStatus();
    
    // Load social posts
    loadSocialPosts();

    // Add error handling
    window.addEventListener('error', (event) => {
        console.error('Social media initialization error:', event);
        Toastify({
            text: 'Error initializing social media features. Please refresh the page.',
            duration: 5000,
            gravity: 'top',
            backgroundColor: '#dc3545'
        }).showToast();
    });
}

/**
 * Initialize social media section
 */
function initializeSocialMediaSection() {
    console.log('Initializing social media section...');
    updateAllConnectionStatus();
    loadSocialPosts();
}

/**
 * Setup social connection buttons
 */
function setupSocialConnections() {
    // Find all platform connection elements
    Object.keys(SOCIAL_PLATFORMS).forEach(platform => {
        const platformElement = document.querySelector(`[data-platform="${platform}"]`);
        if (platformElement) {
            const button = platformElement.querySelector('.btn');
            if (button) {
                // Remove existing event listeners
                button.replaceWith(button.cloneNode(true));
                const newButton = platformElement.querySelector('.btn');
                
                // Add new event listener
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    handleSocialConnection(platform);
                });
            }
        }
    });
    
    console.log('Social connection buttons set up');
}

/**
 * Handle social media connection
 */
function handleSocialConnection(platform) {
    console.log(`Attempting to connect to ${platform}`);
    
    const platformConfig = SOCIAL_PLATFORMS[platform];
    if (!platformConfig) {
        showNotification(`Unknown platform: ${platform}`, 'error');
        return;
    }
    
    // Check if already connected
    const isConnected = localStorage.getItem(`${platform}Connected`) === 'true';
    
    if (isConnected) {
        // Show disconnect option
        if (confirm(`Disconnect from ${platformConfig.name}?`)) {
            disconnectPlatform(platform);
        }
        return;
    }
    
    // Show loading state
    showConnectionLoading(platform);
    
    // Simulate connection process
    setTimeout(() => {
        // For demo purposes, always succeed
        const success = true; // Math.random() > 0.2; // 80% success rate
        
        if (success) {
            // Mark as connected
            localStorage.setItem(`${platform}Connected`, 'true');
            localStorage.setItem(`${platform}ConnectedAt`, new Date().toISOString());
            
            // Store mock user data
            const mockUserData = generateMockUserData(platform);
            localStorage.setItem(`${platform}UserData`, JSON.stringify(mockUserData));
            
            // Update UI
            updatePlatformConnectionStatus(platform, true);
            
            // Show success notification
            showNotification(`Successfully connected to ${platformConfig.name}!`, 'success');
            
            // Update analytics if available
            if (typeof loadAnalyticsData === 'function') {
                setTimeout(loadAnalyticsData, 1000);
            }
        } else {
            // Show error
            showNotification(`Failed to connect to ${platformConfig.name}. Please try again.`, 'error');
            updatePlatformConnectionStatus(platform, false);
        }
        
        // Hide loading state
        hideConnectionLoading(platform);
    }, 2000 + Math.random() * 1000); // 2-3 seconds
}

/**
 * Generate mock user data for platform
 */
function generateMockUserData(platform) {
    const baseData = {
        id: `${platform}_${Date.now()}`,
        name: `Demo ${SOCIAL_PLATFORMS[platform].name} Account`,
        connectedAt: new Date().toISOString(),
        platform: platform
    };
    
    switch(platform) {
        case 'facebook':
            return {
                ...baseData,
                pageId: 'demo_page_123',
                pageName: 'Liquetax Demo Page',
                followers: Math.floor(1000 + Math.random() * 9000)
            };
        case 'instagram':
            return {
                ...baseData,
                username: 'liquetax_demo',
                followers: Math.floor(500 + Math.random() * 4500),
                following: Math.floor(100 + Math.random() * 900)
            };
        case 'twitter':
            return {
                ...baseData,
                username: '@liquetax_demo',
                followers: Math.floor(200 + Math.random() * 1800),
                tweets: Math.floor(50 + Math.random() * 450)
            };
        case 'linkedin':
            return {
                ...baseData,
                companyName: 'Liquetax Demo Company',
                followers: Math.floor(100 + Math.random() * 900),
                employees: '1-10'
            };
        case 'google':
            return {
                ...baseData,
                businessName: 'Liquetax Demo Business',
                reviews: Math.floor(10 + Math.random() * 90),
                rating: (4 + Math.random()).toFixed(1)
            };
        default:
            return baseData;
    }
}

/**
 * Show loading state for platform connection
 */
function showConnectionLoading(platform) {
    const platformElement = document.querySelector(`[data-platform="${platform}"]`);
    if (platformElement) {
        const button = platformElement.querySelector('.btn');
        if (button) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Connecting...';
            button.disabled = true;
            button.classList.add('btn-warning');
        }
    }
}

/**
 * Hide loading state for platform connection
 */
function hideConnectionLoading(platform) {
    const platformElement = document.querySelector(`[data-platform="${platform}"]`);
    if (platformElement) {
        const button = platformElement.querySelector('.btn');
        if (button) {
            button.disabled = false;
            button.classList.remove('btn-warning');
            updatePlatformConnectionStatus(platform, localStorage.getItem(`${platform}Connected`) === 'true');
        }
    }
}

/**
 * Update platform connection status
 */
function updatePlatformConnectionStatus(platform, connected) {
    const platformElement = document.querySelector(`[data-platform="${platform}"]`);
    if (!platformElement) return;
    
    const badge = platformElement.querySelector('.badge');
    const button = platformElement.querySelector('.btn');
    const platformConfig = SOCIAL_PLATFORMS[platform];
    
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
        // Reset classes
        button.className = `btn btn-sm ${platformConfig.buttonClass}`;
        
        if (connected) {
            button.innerHTML = '<i class="fas fa-check me-1"></i> Connected';
            button.title = `Disconnect from ${platformConfig.name}`;
        } else {
            button.innerHTML = '<i class="fas fa-link me-1"></i> Connect';
            button.title = `Connect to ${platformConfig.name}`;
        }
    }
}

/**
 * Update all connection statuses
 */
function updateAllConnectionStatus() {
    Object.keys(SOCIAL_PLATFORMS).forEach(platform => {
        const isConnected = localStorage.getItem(`${platform}Connected`) === 'true';
        updatePlatformConnectionStatus(platform, isConnected);
    });
    
    console.log('Updated all connection statuses');
}

/**
 * Disconnect from platform
 */
function disconnectPlatform(platform) {
    const platformConfig = SOCIAL_PLATFORMS[platform];
    
    // Remove connection data
    localStorage.removeItem(`${platform}Connected`);
    localStorage.removeItem(`${platform}ConnectedAt`);
    localStorage.removeItem(`${platform}UserData`);
    localStorage.removeItem(`${platform}Token`);
    localStorage.removeItem(`${platform}RefreshToken`);
    
    // Update UI
    updatePlatformConnectionStatus(platform, false);
    
    showNotification(`Disconnected from ${platformConfig.name}`, 'info');
    
    console.log(`Disconnected from ${platform}`);
}

/**
 * Setup social post form
 */
function setupSocialPostForm() {
    const socialPostForm = document.getElementById('socialPostForm');
    if (socialPostForm) {
        socialPostForm.addEventListener('submit', handleSocialPostSubmit);
        console.log('Social post form handler set up');
    }
    
    // Update platform checkboxes based on connections
    updatePlatformCheckboxes();
}

/**
 * Update platform checkboxes
 */
function updatePlatformCheckboxes() {
    Object.keys(SOCIAL_PLATFORMS).forEach(platform => {
        const checkbox = document.getElementById(`platform${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
        if (checkbox) {
            const isConnected = localStorage.getItem(`${platform}Connected`) === 'true';
            const label = checkbox.nextElementSibling;
            
            if (isConnected) {
                checkbox.disabled = false;
                if (label) {
                    label.classList.remove('text-muted');
                    label.title = `Post to ${SOCIAL_PLATFORMS[platform].name}`;
                }
            } else {
                checkbox.disabled = true;
                checkbox.checked = false;
                if (label) {
                    label.classList.add('text-muted');
                    label.title = `Connect to ${SOCIAL_PLATFORMS[platform].name} first`;
                }
            }
        }
    });
}

/**
 * Handle social post form submission
 */
function handleSocialPostSubmit(event) {
    event.preventDefault();
    
    console.log('Handling social post submission...');
    
    const content = document.getElementById('socialPostContent')?.value?.trim();
    const selectedPlatforms = [];
    
    // Get selected platforms
    Object.keys(SOCIAL_PLATFORMS).forEach(platform => {
        const checkbox = document.getElementById(`platform${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
        if (checkbox && checkbox.checked) {
            selectedPlatforms.push(platform);
        }
    });
    
    // Validate
    if (!content) {
        showNotification('Please enter post content', 'error');
        document.getElementById('socialPostContent')?.focus();
        return;
    }
    
    if (selectedPlatforms.length === 0) {
        showNotification('Please select at least one platform', 'error');
        return;
    }
    
    // Create social post object
    const socialPost = {
        id: 'social_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        content: content,
        platforms: selectedPlatforms,
        date: new Date().toISOString(),
        status: 'published',
        author: window.dashboardCore?.currentUser || 'Admin',
        engagement: {
            likes: 0,
            shares: 0,
            comments: 0
        }
    };
    
    // Save to localStorage
    const existingPosts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
    existingPosts.unshift(socialPost);
    localStorage.setItem('socialPosts', JSON.stringify(existingPosts));
    
    // Simulate posting to platforms
    simulatePosting(socialPost, selectedPlatforms);
    
    // Clear form
    document.getElementById('socialPostContent').value = '';
    Object.keys(SOCIAL_PLATFORMS).forEach(platform => {
        const checkbox = document.getElementById(`platform${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
        if (checkbox) {
            checkbox.checked = false;
        }
    });
    
    // Update social posts list
    loadSocialPosts();
    
    showNotification(`Post scheduled for ${selectedPlatforms.map(p => SOCIAL_PLATFORMS[p].name).join(', ')}!`, 'success');
    
    console.log('Social post created:', socialPost);
}

/**
 * Simulate posting to platforms
 */
function simulatePosting(post, platforms) {
    platforms.forEach((platform, index) => {
        setTimeout(() => {
            // Simulate random engagement
            const engagement = {
                likes: Math.floor(Math.random() * 50),
                shares: Math.floor(Math.random() * 10),
                comments: Math.floor(Math.random() * 5)
            };
            
            // Update post engagement
            const posts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
            const postIndex = posts.findIndex(p => p.id === post.id);
            if (postIndex !== -1) {
                posts[postIndex].engagement = {
                    likes: posts[postIndex].engagement.likes + engagement.likes,
                    shares: posts[postIndex].engagement.shares + engagement.shares,
                    comments: posts[postIndex].engagement.comments + engagement.comments
                };
                localStorage.setItem('socialPosts', JSON.stringify(posts));
            }
            
            showNotification(`Posted to ${SOCIAL_PLATFORMS[platform].name} successfully!`, 'success');
        }, (index + 1) * 1000);
    });
}

/**
 * Load and display social posts
 */
function loadSocialPosts() {
    const socialPostsContainer = document.getElementById('socialPostsList');
    if (!socialPostsContainer) return;
    
    const posts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
    
    if (posts.length === 0) {
        socialPostsContainer.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-share-alt fa-3x text-muted mb-3"></i>
                <h6 class="text-muted">No social posts yet</h6>
                <p class="text-muted small">Create your first social media post using the form above</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="list-group list-group-flush">';
    
    posts.slice(0, 10).forEach(post => {
        const date = new Date(post.date).toLocaleDateString();
        const time = new Date(post.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const platformBadges = post.platforms.map(platform => {
            const config = SOCIAL_PLATFORMS[platform];
            return `<span class="badge me-1" style="background-color: ${config.color}">
                <i class="${config.icon} me-1"></i>${config.name}
            </span>`;
        }).join('');
        
        const totalEngagement = post.engagement.likes + post.engagement.shares + post.engagement.comments;
        
        html += `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <p class="mb-2">${post.content}</p>
                        <div class="mb-2">
                            ${platformBadges}
                        </div>
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="text-muted small">
                                <i class="fas fa-heart text-danger me-1"></i>${post.engagement.likes}
                                <i class="fas fa-share text-primary me-1 ms-2"></i>${post.engagement.shares}
                                <i class="fas fa-comment text-info me-1 ms-2"></i>${post.engagement.comments}
                            </div>
                            <small class="text-muted">${date} ${time}</small>
                        </div>
                    </div>
                    <div class="ms-3">
                        <div class="btn-group-vertical btn-group-sm">
                            <button class="btn btn-outline-primary btn-sm" onclick="editSocialPost('${post.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteSocialPost('${post.id}')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    if (posts.length > 10) {
        html += `
            <div class="text-center mt-3">
                <small class="text-muted">Showing 10 of ${posts.length} posts</small>
            </div>
        `;
    }
    
    socialPostsContainer.innerHTML = html;
    
    console.log(`Loaded ${posts.length} social posts`);
}

/**
 * Edit social post
 */
function editSocialPost(postId) {
    const posts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        // Fill form with post data
        document.getElementById('socialPostContent').value = post.content;
        
        // Check platforms
        post.platforms.forEach(platform => {
            const checkbox = document.getElementById(`platform${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // Scroll to form
        document.getElementById('socialPostForm').scrollIntoView({ behavior: 'smooth' });
        
        showNotification('Social post loaded for editing', 'info');
    }
}

/**
 * Delete social post
 */
function deleteSocialPost(postId) {
    if (confirm('Are you sure you want to delete this social post?')) {
        const posts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
        const filteredPosts = posts.filter(p => p.id !== postId);
        
        localStorage.setItem('socialPosts', JSON.stringify(filteredPosts));
        loadSocialPosts();
        
        showNotification('Social post deleted successfully', 'success');
        
        console.log('Social post deleted:', postId);
    }
}

/**
 * Get connection status for all platforms
 */
function getAllConnectionStatus() {
    const status = {};
    
    Object.keys(SOCIAL_PLATFORMS).forEach(platform => {
        status[platform] = {
            connected: localStorage.getItem(`${platform}Connected`) === 'true',
            connectedAt: localStorage.getItem(`${platform}ConnectedAt`),
            userData: localStorage.getItem(`${platform}UserData`)
        };
    });
    
    return status;
}

/**
 * Get connected platforms count
 */
function getConnectedPlatformsCount() {
    return Object.keys(SOCIAL_PLATFORMS).filter(platform => 
        localStorage.getItem(`${platform}Connected`) === 'true'
    ).length;
}

/**
 * Show social post modal (missing function)
 */
function showSocialPostModal() {
    console.log('Opening social post modal...');
    
    // Focus on the social post content input
    const contentInput = document.getElementById('socialPostContent');
    if (contentInput) {
        contentInput.focus();
        // Scroll to the social post form
        document.getElementById('socialPostForm')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    showNotification('Create a new social post below', 'info');
}

/**
 * Refresh social data (missing function)
 */
function refreshSocialData() {
    console.log('Refreshing social data...');
    
    // Show loading notification
    showNotification('Refreshing social media data...', 'info');
    
    // Update connection status
    updateAllConnectionStatus();
    
    // Reload social posts
    loadSocialPosts();
    
    // Update platform checkboxes
    updatePlatformCheckboxes();
    
    // Simulate data refresh
    setTimeout(() => {
        showNotification('Social media data refreshed successfully!', 'success');
    }, 1000);
}

// Export functions for global access
window.editSocialPost = editSocialPost;
window.deleteSocialPost = deleteSocialPost;
window.showSocialPostModal = showSocialPostModal;
window.refreshSocialData = refreshSocialData;
window.socialMedia = {
    handleSocialConnection,
    disconnectPlatform,
    getAllConnectionStatus,
    getConnectedPlatformsCount,
    updateAllConnectionStatus,
    showSocialPostModal,
    refreshSocialData
};