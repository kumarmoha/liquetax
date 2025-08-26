/**
 * Dashboard Core Functionality
 * Main dashboard initialization and core functions
 */

// Global variables
window.dashboardCore = {
    initialized: false,
    quillEditor: null,
    currentUser: null
};

/**
 * Initialize the dashboard
 */
function initializeDashboard() {
    console.log('Initializing dashboard core...');
    
    if (window.dashboardCore.initialized) {
        console.log('Dashboard already initialized');
        return;
    }

    // Wait for DOM to be fully loaded
    if (document.readyState !== 'complete') {
        document.addEventListener('DOMContentLoaded', initializeDashboard);
        return;
    }

    try {
        // Check authentication
        if (!checkAuthentication()) {
            return;
        }

        // Initialize components in proper order
        initializeNavigation();
        initializeQuillEditor();
        initializeBlogManagement();
        initializeSocialMedia();

        // Load initial data
        loadBlogPosts();
        loadSocialConnections();

        // Set up auto-save
        setupAutoSave();

        window.dashboardCore.initialized = true;
        console.log('Dashboard core initialized successfully');
    } catch (error) {
        console.error('Dashboard initialization failed:', error);
        Toastify({
            text: 'Error initializing dashboard. Please refresh the page.',
            duration: 5000,
            gravity: 'top',
            backgroundColor: '#dc3545'
        }).showToast();
    }
}

/**
 * Check user authentication
 */
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    
    if (!isLoggedIn) {
        showLoginModal();
        return false;
    }
    
    window.dashboardCore.currentUser = username;
    updateUserInterface(username);
    return true;
}

/**
 * Show login modal
 */
function showLoginModal() {
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        const modal = new bootstrap.Modal(loginModal);
        modal.show();
    } else {
        createLoginModal();
    }
}

/**
 * Create login modal if it doesn't exist
 */
function createLoginModal() {
    const modalHTML = `
        <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="loginModalLabel">Admin Login</h5>
                    </div>
                    <div class="modal-body">
                        <form id="loginForm">
                            <div class="mb-3">
                                <label for="loginUsername" class="form-label">Username</label>
                                <input type="text" class="form-control" id="loginUsername" value="admin" required>
                            </div>
                            <div class="mb-3">
                                <label for="loginPassword" class="form-label">Password</label>
                                <input type="password" class="form-control" id="loginPassword" value="hello" required>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary">Login</button>
                            </div>
                        </form>
                        <div class="mt-3 text-center">
                            <small class="text-muted">Demo credentials: admin/admin</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Set up login form handler
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
    
    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple demo authentication - matches main site credentials
    if (username === 'admin' && password === 'hello') {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        
        // Update UI
        window.dashboardCore.currentUser = username;
        updateUserInterface(username);
        
        showNotification('Login successful!', 'success');
        
        // Initialize dashboard components
        setTimeout(() => {
            initializeDashboard();
        }, 500);
    } else {
        showNotification('Invalid credentials. Use admin/admin', 'error');
    }
}

/**
 * Update user interface after login
 */
function updateUserInterface(username) {
    // Update any user-specific elements
    const userElements = document.querySelectorAll('[data-user]');
    userElements.forEach(element => {
        element.textContent = username;
    });
}

/**
 * Initialize Quill editor
 */
function initializeQuillEditor() {
    if (typeof Quill === 'undefined') {
        console.warn('Quill editor not loaded');
        return;
    }
    
    const editorElement = document.getElementById('editor');
    if (editorElement && !window.dashboardCore.quillEditor) {
        window.dashboardCore.quillEditor = new Quill('#editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    ['link', 'image'],
                    ['clean']
                ]
            },
            placeholder: 'Write your blog content here...'
        });
        
        console.log('Quill editor initialized');
    }
}

/**
 * Initialize navigation
 */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all nav links
            navLinks.forEach(nl => nl.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const target = document.getElementById(targetSection);
            if (target) {
                target.classList.add('active');
                
                // Trigger section-specific initialization
                initializeSection(targetSection);
            }
        });
    });
    
    console.log('Navigation initialized');
}

/**
 * Initialize section-specific functionality
 */
function initializeSection(sectionName) {
    switch(sectionName) {
        case 'socialMedia':
            initializeSocialMediaSection();
            break;
        case 'analytics':
            initializeAnalyticsSection();
            break;
        case 'blogManagement':
            initializeBlogSection();
            break;
    }
}

/**
 * Show notification
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
            backgroundColor: bgColors[type] || bgColors.info,
            stopOnFocus: true
        }).showToast();
    } else {
        // Fallback notification
        createFallbackNotification(message, type);
    }
}

/**
 * Create fallback notification
 */
function createFallbackNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Setup auto-save functionality
 */
function setupAutoSave() {
    // Auto-save blog content
    const blogTitle = document.getElementById('blogTitle');
    const blogMetaDescription = document.getElementById('blogMetaDescription');
    const blogTags = document.getElementById('blogTags');
    
    if (blogTitle) {
        blogTitle.addEventListener('input', debounce(autoSaveBlogDraft, 2000));
    }
    
    if (blogMetaDescription) {
        blogMetaDescription.addEventListener('input', debounce(autoSaveBlogDraft, 2000));
    }
    
    if (blogTags) {
        blogTags.addEventListener('input', debounce(autoSaveBlogDraft, 2000));
    }
    
    // Auto-save Quill content
    if (window.dashboardCore.quillEditor) {
        window.dashboardCore.quillEditor.on('text-change', debounce(autoSaveBlogDraft, 2000));
    }
}

/**
 * Auto-save blog draft
 */
function autoSaveBlogDraft() {
    const title = document.getElementById('blogTitle')?.value;
    const metaDescription = document.getElementById('blogMetaDescription')?.value;
    const tags = document.getElementById('blogTags')?.value;
    let content = '';
    
    if (window.dashboardCore.quillEditor) {
        content = window.dashboardCore.quillEditor.root.innerHTML;
    }
    
    if (title || content || metaDescription || tags) {
        const draft = {
            title: title || '',
            metaDescription: metaDescription || '',
            tags: tags || '',
            content: content || '',
            lastSaved: new Date().toISOString()
        };
        
        localStorage.setItem('blogDraft', JSON.stringify(draft));
        showAutoSaveIndicator();
    }
}

/**
 * Show auto-save indicator
 */
function showAutoSaveIndicator() {
    // Remove existing indicator
    const existingIndicator = document.querySelector('.auto-save-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create new indicator
    const indicator = document.createElement('div');
    indicator.className = 'auto-save-indicator position-fixed';
    indicator.style.cssText = 'bottom: 20px; left: 20px; z-index: 9999;';
    indicator.innerHTML = `
        <div class="alert alert-success alert-sm mb-0">
            <i class="fas fa-check me-1"></i> Auto-saved
        </div>
    `;
    
    document.body.appendChild(indicator);
    
    // Auto-remove after 2 seconds
    setTimeout(() => {
        if (indicator.parentNode) {
            indicator.remove();
        }
    }, 2000);
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Logout function
 */
function logout() {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('blogDraft');
    
    showNotification('Logged out successfully', 'info');
    
    // Reload page to reset state
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

/**
 * Load social connection status and update UI
 */
function loadSocialConnections() {
    fetch('/api/social/status')
        .then(res => res.json())
        .then(status => {
            // Update badges and buttons for each platform
            const platforms = ['google', 'facebook'];
            platforms.forEach(platform => {
                const item = document.querySelector(`.list-group-item[data-platform="${platform}"]`);
                if (item) {
                    const badge = item.querySelector('.badge');
                    const btn = item.querySelector('.btn');
                    if (status[platform]) {
                        badge.textContent = 'Connected';
                        badge.classList.remove('bg-warning');
                        badge.classList.add('bg-success');
                        btn.textContent = 'Connected';
                        btn.classList.remove('btn-success', 'btn-primary');
                        btn.classList.add('btn-outline-secondary');
                        btn.disabled = true;
                    } else {
                        badge.textContent = 'Not Connected';
                        badge.classList.remove('bg-success');
                        badge.classList.add('bg-warning');
                        btn.textContent = 'Connect';
                        btn.classList.remove('btn-outline-secondary');
                        btn.classList.add(platform === 'google' ? 'btn-success' : 'btn-primary');
                        btn.disabled = false;
                        // Set correct OAuth link
                        btn.href = `/auth/${platform}`;
                        btn.target = '_self';
                    }
                }
            });
        })
        .catch(() => {
            showNotification('Could not load social connection status', 'error');
        });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing dashboard...');
    setTimeout(initializeDashboard, 100);
    // Wire up connect buttons for Google and Facebook
    document.querySelectorAll('.list-group-item[data-platform="google"] .btn, .list-group-item[data-platform="facebook"] .btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Let href work for OAuth, but can add loading state if desired
        });
    });
});

// Export functions for global access
window.dashboardCore.showNotification = showNotification;
window.dashboardCore.logout = logout;