/**
 * Blog Automation System
 * Automatically scans designated folders for HTML blog files and updates the website index
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Blog automation system loaded');
    initBlogAutomation();
});

/**
 * Initialize blog automation functionality
 */
function initBlogAutomation() {
    console.log('Initializing blog automation');
    
    // Set up folder monitoring
    setupFolderMonitoring();
    
    // Set up auto-indexing
    setupAutoIndexing();
    
    // Set up scheduled scanning
    setupScheduledScanning();
    
    // Add UI elements for automation settings
    addAutomationSettingsUI();
}

/**
 * Set up folder monitoring for new blog files
 */
function setupFolderMonitoring() {
    console.log('Setting up folder monitoring');
    
    // Get folder path from settings
    const folderPath = localStorage.getItem('blogFolderPath') || 'blogs';
    
    // Set up the folder path input
    const folderPathInput = document.getElementById('blogFolderPath');
    if (folderPathInput) {
        folderPathInput.value = folderPath;
        
        // Save changes to localStorage
        folderPathInput.addEventListener('change', function() {
            localStorage.setItem('blogFolderPath', this.value);
            showNotification('Blog folder path updated', 'success');
        });
    }
    
    // Set up manual scan button
    const scanButton = document.getElementById('scanBlogsButton');
    if (scanButton) {
        scanButton.addEventListener('click', function() {
            scanBlogFolder();
        });
    }
}

/**
 * Scan the blog folder for new HTML files
 */
function scanBlogFolder() {
    console.log('Scanning blog folder for new files');
    
    // In a real implementation, this would use server-side code or an API
    // For this demo, we'll simulate finding new blog files
    
    showNotification('Scanning for new blog files...', 'info');
    
    // Simulate scanning delay
    setTimeout(() => {
        // Simulate finding new blogs
        const newBlogsFound = Math.floor(Math.random() * 3); // 0-2 new blogs
        
        if (newBlogsFound > 0) {
            showNotification(`Found ${newBlogsFound} new blog files!`, 'success');
            
            // Simulate processing the blogs
            processMockBlogs(newBlogsFound);
        } else {
            showNotification('No new blog files found', 'info');
        }
    }, 1500);
}

/**
 * Process mock blog files (for demonstration)
 */
function processMockBlogs(count) {
    console.log(`Processing ${count} mock blogs`);
    
    // Get existing posts
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const initialCount = posts.length;
    
    // Generate mock blog posts
    for (let i = 0; i < count; i++) {
        const post = generateMockBlogPost();
        posts.unshift(post);
    }
    
    // Save back to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    // Update the blog list in the UI
    if (typeof updateBlogList === 'function') {
        updateBlogList();
    }
    
    // Update the index
    updateBlogIndex(posts);
    
    showNotification(`${count} new blog posts added to the system`, 'success');
}

/**
 * Generate a mock blog post
 */
function generateMockBlogPost() {
    const titles = [
        'Understanding Tax Implications for Small Businesses',
        'New Tax Laws You Need to Know About',
        'Tax Planning Strategies for Entrepreneurs',
        'How to Maximize Your Tax Deductions',
        'International Tax Considerations for Expanding Businesses'
    ];
    
    const tags = [
        ['tax', 'small business', 'finance'],
        ['tax law', 'legislation', 'compliance'],
        ['tax planning', 'strategy', 'entrepreneurs'],
        ['tax deductions', 'savings', 'finance'],
        ['international tax', 'global business', 'expansion']
    ];
    
    const index = Math.floor(Math.random() * titles.length);
    
    return {
        id: 'blog_' + Date.now() + Math.floor(Math.random() * 1000),
        title: titles[index],
        meta_description: 'Automatically imported blog post about ' + titles[index].toLowerCase(),
        tags: tags[index],
        content: `<h2>${titles[index]}</h2><p>This is an automatically imported blog post about ${titles[index].toLowerCase()}. The content would normally be extracted from an HTML file.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.</p>`,
        date: new Date().toISOString(),
        status: 'published',
        source: 'auto-import'
    };
}

/**
 * Set up automatic index updating
 */
function setupAutoIndexing() {
    console.log('Setting up auto-indexing');
    
    // Get auto-index setting
    const autoIndex = localStorage.getItem('autoIndexEnabled') === 'true';
    
    // Set up the auto-index toggle
    const autoIndexToggle = document.getElementById('autoIndexToggle');
    if (autoIndexToggle) {
        autoIndexToggle.checked = autoIndex;
        
        // Save changes to localStorage
        autoIndexToggle.addEventListener('change', function() {
            localStorage.setItem('autoIndexEnabled', this.checked);
            showNotification(
                this.checked ? 'Auto-indexing enabled' : 'Auto-indexing disabled', 
                'info'
            );
        });
    }
}

/**
 * Update the blog index with the latest posts
 */
function updateBlogIndex(posts) {
    console.log('Updating blog index');
    
    // Check if auto-indexing is enabled
    const autoIndexEnabled = localStorage.getItem('autoIndexEnabled') === 'true';
    if (!autoIndexEnabled) {
        console.log('Auto-indexing is disabled, skipping index update');
        return;
    }
    
    showNotification('Updating blog index...', 'info');
    
    // In a real implementation, this would update the actual index.html file
    // For this demo, we'll simulate the update
    
    setTimeout(() => {
        showNotification('Blog index updated successfully!', 'success');
        
        // Update the index preview if it exists
        updateIndexPreview(posts);
    }, 1000);
}

/**
 * Update the index preview in the UI
 */
function updateIndexPreview(posts) {
    const indexPreview = document.getElementById('indexPreview');
    if (!indexPreview) return;
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate HTML for the preview
    let html = '<div class="list-group">';
    
    // Take the first 5 posts for the preview
    const previewPosts = posts.slice(0, 5);
    
    previewPosts.forEach(post => {
        const date = new Date(post.date).toLocaleDateString();
        
        html += `
            <a href="#" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">${post.title}</h5>
                    <small>${date}</small>
                </div>
                <p class="mb-1">${post.meta_description || 'No description available'}</p>
                <small>${post.tags.join(', ')}</small>
            </a>
        `;
    });
    
    html += '</div>';
    
    // Update the preview
    indexPreview.innerHTML = html;
}

/**
 * Set up scheduled scanning for new blog posts
 */
function setupScheduledScanning() {
    console.log('Setting up scheduled scanning');
    
    // Get scan interval from settings (default to 60 minutes)
    const scanInterval = parseInt(localStorage.getItem('scanInterval') || '60', 10);
    
    // Set up the scan interval input
    const scanIntervalInput = document.getElementById('scanInterval');
    if (scanIntervalInput) {
        scanIntervalInput.value = scanInterval;
        
        // Save changes to localStorage
        scanIntervalInput.addEventListener('change', function() {
            const value = parseInt(this.value, 10) || 60;
            localStorage.setItem('scanInterval', value);
            showNotification(`Scan interval updated to ${value} minutes`, 'info');
            
            // Reset the interval timer
            setupIntervalTimer(value);
        });
    }
    
    // Set up the interval timer
    setupIntervalTimer(scanInterval);
}

/**
 * Set up the interval timer for scheduled scanning
 */
function setupIntervalTimer(minutes) {
    // Clear any existing interval
    if (window.scanIntervalTimer) {
        clearInterval(window.scanIntervalTimer);
    }
    
    // Convert minutes to milliseconds
    const interval = minutes * 60 * 1000;
    
    // Set up new interval
    window.scanIntervalTimer = setInterval(() => {
        console.log(`Scheduled scan triggered (every ${minutes} minutes)`);
        scanBlogFolder();
    }, interval);
    
    console.log(`Scheduled scanning set for every ${minutes} minutes`);
}

/**
 * Add UI elements for automation settings
 */
function addAutomationSettingsUI() {
    console.log('Adding automation settings UI');
    
    // Find the automation settings container
    const container = document.getElementById('automationSettings');
    if (!container) {
        console.warn('Automation settings container not found');
        return;
    }
    
    // Create the settings UI
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h5 class="mb-0">Blog Automation Settings</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="blogFolderPath" class="form-label">Blog Folder Path</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="blogFolderPath" placeholder="Path to HTML blog files">
                        <button class="btn btn-primary" id="scanBlogsButton">
                            <i class="fas fa-sync-alt me-1"></i> Scan Now
                        </button>
                    </div>
                    <div class="form-text">Specify the folder where your HTML blog files are stored</div>
                </div>
                
                <div class="mb-3">
                    <label for="scanInterval" class="form-label">Scan Interval (minutes)</label>
                    <input type="number" class="form-control" id="scanInterval" min="5" max="1440">
                    <div class="form-text">How often to automatically scan for new blog files</div>
                </div>
                
                <div class="mb-3 form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="autoIndexToggle">
                    <label class="form-check-label" for="autoIndexToggle">Automatically Update Index</label>
                    <div class="form-text">When enabled, the website index will be updated automatically when new blogs are found</div>
                </div>
                
                <div class="mt-4">
                    <h6>Index Preview</h6>
                    <div id="indexPreview" class="border rounded p-3 bg-light">
                        <p class="text-muted text-center mb-0">Index preview will appear here after scanning</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize the UI elements
    setupFolderMonitoring();
    setupAutoIndexing();
    setupScheduledScanning();
    
    // Update the index preview with existing posts
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    updateIndexPreview(posts);
}

/**
 * Show a notification to the user
 */
function showNotification(message, type = 'info') {
    console.log(`Notification (${type}): ${message}`);
    
    // Use Toastify if available
    if (window.Toastify) {
        const bgColors = {
            success: 'linear-gradient(to right, #00b09b, #96c93d)',
            info: 'linear-gradient(to right, #2193b0, #6dd5ed)',
            warning: 'linear-gradient(to right, #f2994a, #f2c94c)',
            error: 'linear-gradient(to right, #ff5f6d, #ffc371)'
        };
        
        Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: bgColors[type] || bgColors.info
        }).showToast();
    } else {
        // Fallback to alert for simple cases
        alert(message);
    }
}