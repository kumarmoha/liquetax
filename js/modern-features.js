/**
 * Modern Features for Liquetax Dashboard
 * Advanced UI/UX enhancements and modern features
 */

class ModernFeatures {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎨 Initializing Modern Features...');
        
        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupFeatures());
        } else {
            this.setupFeatures();
        }
    }

    setupFeatures() {
        this.setupDarkMode();
        this.setupKeyboardShortcuts();
        this.setupProgressIndicators();
        this.setupTooltips();
        this.setupAnimations();
        this.setupSearchFunctionality();
        this.setupQuickActions();
        this.setupAutoSave();
        this.setupNotificationCenter();
        this.setupAdvancedAnalytics();
        
        console.log('✨ Modern Features Loaded');
    }

    /**
     * Dark Mode Toggle
     */
    setupDarkMode() {
        // Add dark mode toggle to navbar
        const navbar = document.querySelector('.sidebar-header');
        if (navbar) {
            const darkModeToggle = document.createElement('div');
            darkModeToggle.className = 'form-check form-switch mt-2';
            darkModeToggle.innerHTML = `
                <input class="form-check-input" type="checkbox" id="darkModeToggle">
                <label class="form-check-label text-white-50" for="darkModeToggle">
                    <i class="fas fa-moon me-1"></i> Dark Mode
                </label>
            `;
            navbar.appendChild(darkModeToggle);

            const toggle = document.getElementById('darkModeToggle');
            
            // Load saved preference
            const isDark = localStorage.getItem('darkMode') === 'true';
            toggle.checked = isDark;
            this.applyDarkMode(isDark);

            // Toggle event
            toggle.addEventListener('change', (e) => {
                const isDark = e.target.checked;
                this.applyDarkMode(isDark);
                localStorage.setItem('darkMode', isDark);
            });
        }
    }

    applyDarkMode(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        
        // Update charts if they exist
        setTimeout(() => {
            if (window.socialAnalytics && window.socialAnalytics.charts) {
                Object.values(window.socialAnalytics.charts).forEach(chart => {
                    if (chart) chart.update();
                });
            }
        }, 100);
    }

    /**
     * Keyboard Shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.quickSave();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.newPost();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.postNow();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.refreshData();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.showHelp();
                        break;
                }
            }

            // Alt + number keys for navigation
            if (e.altKey && e.key >= '1' && e.key <= '6') {
                e.preventDefault();
                const sections = ['integratedDashboard', 'blogManagement', 'socialMedia', 'automation', 'analytics', 'settings'];
                const sectionIndex = parseInt(e.key) - 1;
                if (sections[sectionIndex]) {
                    this.navigateToSection(sections[sectionIndex]);
                }
            }
        });

        // Show shortcuts help
        this.addShortcutsHelp();
    }

    addShortcutsHelp() {
        const helpIcon = document.createElement('div');
        helpIcon.className = 'position-fixed bottom-0 start-0 m-3';
        helpIcon.innerHTML = `
            <button class="btn btn-sm btn-outline-secondary" id="shortcutsHelp" title="Keyboard Shortcuts (Ctrl+H)">
                <i class="fas fa-keyboard"></i>
            </button>
        `;
        document.body.appendChild(helpIcon);

        document.getElementById('shortcutsHelp').addEventListener('click', () => this.showHelp());
    }

    showHelp() {
        const modal = `
            <div class="modal fade" id="shortcutsModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">⌨️ Keyboard Shortcuts</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6>General</h6>
                                    <div class="d-flex justify-content-between">
                                        <kbd>Ctrl+S</kbd> <span>Quick Save</span>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <kbd>Ctrl+N</kbd> <span>New Post</span>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <kbd>Ctrl+P</kbd> <span>Post Now</span>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <kbd>Ctrl+R</kbd> <span>Refresh</span>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h6>Navigation</h6>
                                    <div class="d-flex justify-content-between">
                                        <kbd>Alt+1</kbd> <span>Dashboard</span>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <kbd>Alt+2</kbd> <span>Blog Management</span>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <kbd>Alt+3</kbd> <span>Social Media</span>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <kbd>Alt+4</kbd> <span>Automation</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modal);
        const modalElement = new bootstrap.Modal(document.getElementById('shortcutsModal'));
        modalElement.show();
        
        // Remove modal after hiding
        document.getElementById('shortcutsModal').addEventListener('hidden.bs.modal', (e) => {
            e.target.remove();
        });
    }

    /**
     * Progress Indicators
     */
    setupProgressIndicators() {
        // Add progress bar for page loading
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar-top';
        progressBar.innerHTML = '<div class="progress-bar-fill"></div>';
        document.body.prepend(progressBar);

        // Style the progress bar
        const style = document.createElement('style');
        style.textContent = `
            .progress-bar-top {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: transparent;
                z-index: 9999;
            }
            .progress-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                width: 0;
                transition: width 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    showProgress(percentage) {
        const fill = document.querySelector('.progress-bar-fill');
        if (fill) {
            fill.style.width = percentage + '%';
        }
    }

    hideProgress() {
        setTimeout(() => {
            const fill = document.querySelector('.progress-bar-fill');
            if (fill) {
                fill.style.width = '0%';
            }
        }, 500);
    }

    /**
     * Enhanced Tooltips
     */
    setupTooltips() {
        // Initialize Bootstrap tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Add helpful tooltips to buttons
        const buttonTooltips = {
            'postNowBtn': 'Post immediately to selected platforms (Ctrl+P)',
            'schedulePostBtn': 'Schedule post for later',
            'generateContentBtn': 'Auto-generate blog content',
            'refreshSocialDataBtn': 'Refresh social media data (Ctrl+R)',
            'saveSettingsBtn': 'Save all settings (Ctrl+S)'
        };

        Object.entries(buttonTooltips).forEach(([id, title]) => {
            const element = document.getElementById(id);
            if (element && !element.hasAttribute('title')) {
                element.setAttribute('data-bs-toggle', 'tooltip');
                element.setAttribute('title', title);
                new bootstrap.Tooltip(element);
            }
        });
    }

    /**
     * Smooth Animations
     */
    setupAnimations() {
        // Add loading animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideInLeft {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes fadeInUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            .animate-slide-right { animation: slideInRight 0.5s ease-out; }
            .animate-slide-left { animation: slideInLeft 0.5s ease-out; }
            .animate-fade-up { animation: fadeInUp 0.3s ease-out; }
            .animate-pulse { animation: pulse 2s infinite; }
            
            .card { transition: all 0.3s ease; }
            .card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.15); }
            
            .btn { transition: all 0.2s ease; }
            .btn:hover { transform: translateY(-2px); }
        `;
        document.head.appendChild(style);

        // Animate cards on scroll
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-up');
                }
            });
        }, observerOptions);

        // Observe all cards
        document.querySelectorAll('.card').forEach(card => {
            observer.observe(card);
        });
    }

    /**
     * Search Functionality
     */
    setupSearchFunctionality() {
        const searchBar = document.createElement('div');
        searchBar.className = 'search-container position-fixed top-0 end-0 m-3';
        searchBar.innerHTML = `
            <div class="input-group">
                <input type="text" class="form-control" id="globalSearch" placeholder="Search dashboard..." style="width: 250px;">
                <button class="btn btn-outline-secondary" type="button" id="searchButton">
                    <i class="fas fa-search"></i>
                </button>
            </div>
            <div class="search-results" id="searchResults"></div>
        `;
        document.body.appendChild(searchBar);

        const searchInput = document.getElementById('globalSearch');
        const searchResults = document.getElementById('searchResults');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                this.performSearch(query, searchResults);
            } else {
                searchResults.innerHTML = '';
            }
        });

        // Add search styles
        const style = document.createElement('style');
        style.textContent = `
            .search-container {
                z-index: 1040;
            }
            .search-results {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                max-height: 300px;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                display: none;
            }
            .search-result-item {
                padding: 10px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                transition: background 0.2s;
            }
            .search-result-item:hover {
                background: #f8f9fa;
            }
        `;
        document.head.appendChild(style);
    }

    performSearch(query, resultsContainer) {
        const searchableElements = [
            { type: 'Section', selector: '.nav-link', attr: 'textContent' },
            { type: 'Button', selector: 'button', attr: 'textContent' },
            { type: 'Card', selector: '.card-title', attr: 'textContent' },
            { type: 'Form', selector: 'label', attr: 'textContent' }
        ];

        let results = [];

        searchableElements.forEach(({ type, selector, attr }) => {
            document.querySelectorAll(selector).forEach(element => {
                if (element[attr] && element[attr].toLowerCase().includes(query)) {
                    results.push({
                        type,
                        text: element[attr].trim(),
                        element
                    });
                }
            });
        });

        this.displaySearchResults(results.slice(0, 8), resultsContainer);
    }

    displaySearchResults(results, container) {
        if (results.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.innerHTML = results.map(result => `
            <div class="search-result-item" data-type="${result.type}">
                <strong>${result.type}:</strong> ${result.text}
            </div>
        `).join('');

        container.style.display = 'block';

        // Add click handlers
        container.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                results[index].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                results[index].element.focus();
                container.style.display = 'none';
            });
        });
    }

    /**
     * Quick Actions Panel
     */
    setupQuickActions() {
        const quickActions = document.createElement('div');
        quickActions.className = 'quick-actions position-fixed bottom-0 end-0 m-3';
        quickActions.innerHTML = `
            <div class="btn-group-vertical">
                <button class="btn btn-primary btn-sm" id="quickNewPost" title="Quick New Post">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="btn btn-success btn-sm" id="quickSave" title="Quick Save">
                    <i class="fas fa-save"></i>
                </button>
                <button class="btn btn-info btn-sm" id="quickRefresh" title="Quick Refresh">
                    <i class="fas fa-sync-alt"></i>
                </button>
                <button class="btn btn-warning btn-sm" id="quickBackup" title="Export Data">
                    <i class="fas fa-download"></i>
                </button>
            </div>
        `;
        document.body.appendChild(quickActions);

        // Add event listeners
        document.getElementById('quickNewPost').addEventListener('click', () => this.newPost());
        document.getElementById('quickSave').addEventListener('click', () => this.quickSave());
        document.getElementById('quickRefresh').addEventListener('click', () => this.refreshData());
        document.getElementById('quickBackup').addEventListener('click', () => this.exportData());
    }

    /**
     * Auto-save functionality
     */
    setupAutoSave() {
        const formInputs = document.querySelectorAll('input, textarea, select');
        
        formInputs.forEach(input => {
            input.addEventListener('input', this.debounce(() => {
                this.autoSave(input);
            }, 2000));
        });
    }

    autoSave(element) {
        const key = `autosave_${element.id || element.name || 'unknown'}`;
        localStorage.setItem(key, element.value);
        
        // Show subtle save indicator
        this.showSaveIndicator(element);
    }

    showSaveIndicator(element) {
        const indicator = document.createElement('div');
        indicator.className = 'autosave-indicator';
        indicator.innerHTML = '<i class="fas fa-check text-success"></i>';
        indicator.style.cssText = `
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
            pointer-events: none;
            z-index: 1;
        `;
        
        element.style.position = 'relative';
        element.parentNode.style.position = 'relative';
        element.parentNode.appendChild(indicator);
        
        setTimeout(() => indicator.remove(), 2000);
    }

    /**
     * Notification Center
     */
    setupNotificationCenter() {
        const notificationCenter = document.createElement('div');
        notificationCenter.className = 'notification-center position-fixed top-0 end-0 mt-5 me-3';
        notificationCenter.id = 'notificationCenter';
        notificationCenter.style.cssText = `
            z-index: 1050;
            max-width: 350px;
        `;
        document.body.appendChild(notificationCenter);

        // Override the global notification function
        window.showNotification = (message, type = 'info', duration = 5000) => {
            this.addNotification(message, type, duration);
        };
    }

    addNotification(message, type, duration) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show mb-2`;
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.getElementById('notificationCenter').appendChild(notification);
        
        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    /**
     * Advanced Analytics
     */
    setupAdvancedAnalytics() {
        // Track user interactions
        this.trackUserInteractions();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
    }

    trackUserInteractions() {
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const buttonText = e.target.textContent.trim();
                const buttonId = e.target.id;
                
                // Store interaction data
                const interactions = JSON.parse(localStorage.getItem('userInteractions') || '[]');
                interactions.push({
                    type: 'button_click',
                    button: buttonText || buttonId,
                    timestamp: new Date().toISOString()
                });
                
                // Keep only last 100 interactions
                if (interactions.length > 100) {
                    interactions.splice(0, interactions.length - 100);
                }
                
                localStorage.setItem('userInteractions', JSON.stringify(interactions));
            }
        });
    }

    setupPerformanceMonitoring() {
        // Monitor page load time
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page loaded in ${loadTime}ms`);
            
            // Store performance data
            const perfData = JSON.parse(localStorage.getItem('performanceData') || '[]');
            perfData.push({
                loadTime,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            });
            
            if (perfData.length > 50) {
                perfData.splice(0, perfData.length - 50);
            }
            
            localStorage.setItem('performanceData', JSON.stringify(perfData));
        });
    }

    /**
     * Utility Methods
     */
    debounce(func, wait) {
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

    navigateToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            
            // Show target section
            section.classList.add('active');
            
            // Update nav
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.section === sectionId) {
                    link.classList.add('active');
                }
            });
        }
    }

    newPost() {
        this.navigateToSection('socialMedia');
        setTimeout(() => {
            const contentInput = document.getElementById('socialPostContent');
            if (contentInput) {
                contentInput.focus();
                contentInput.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    }

    quickSave() {
        // Trigger save for current active form
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            const form = activeSection.querySelector('form');
            if (form) {
                const event = new Event('submit', { bubbles: true, cancelable: true });
                form.dispatchEvent(event);
            }
        }
        this.addNotification('Quick save triggered', 'success', 2000);
    }

    refreshData() {
        if (window.socialAnalytics) {
            window.socialAnalytics.refresh();
        }
        if (window.socialDashboard) {
            window.socialDashboard.refreshData();
        }
        this.addNotification('Data refreshed', 'success', 2000);
    }

    postNow() {
        const postButton = document.getElementById('postNowBtn');
        if (postButton) {
            postButton.click();
        }
    }

    exportData() {
        const data = {
            blogPosts: JSON.parse(localStorage.getItem('blogPosts') || '[]'),
            socialPosts: JSON.parse(localStorage.getItem('socialPosts') || '[]'),
            userInteractions: JSON.parse(localStorage.getItem('userInteractions') || '[]'),
            performanceData: JSON.parse(localStorage.getItem('performanceData') || '[]'),
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `liquetax-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.addNotification('Dashboard data exported successfully', 'success');
    }
}

// Initialize modern features
window.modernFeatures = new ModernFeatures();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernFeatures;
}
