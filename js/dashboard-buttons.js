/**
 * Dashboard Button Handlers
 * Centralized button functionality for the Liquetax Dashboard
 */

class DashboardButtons {
    constructor() {
        this.initialized = false;
        this.init();
    }

    /**
     * Initialize all button handlers
     */
    init() {
        if (this.initialized) return;
        
        console.log('🔘 Initializing Dashboard Buttons...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAllButtons());
        } else {
            this.setupAllButtons();
        }
        
        this.initialized = true;
    }

    /**
     * Setup all button event handlers
     */
    setupAllButtons() {
        // Blog Management Buttons
        this.setupBlogButtons();
        
        // Social Media Buttons
        this.setupSocialButtons();
        
        // Analytics Buttons
        this.setupAnalyticsButtons();
        
        // Automation Buttons
        this.setupAutomationButtons();
        
        // Settings Buttons
        this.setupSettingsButtons();
        
        // Navigation Buttons
        this.setupNavigationButtons();
        
        // Connection Buttons
        this.setupConnectionButtons();
        
        console.log('✅ All Dashboard Buttons Initialized');
    }

    /**
     * Blog Management Buttons
     */
    setupBlogButtons() {
        // Blog Form Submit
        const blogForm = document.getElementById('blogForm');
        if (blogForm) {
            blogForm.addEventListener('submit', (e) => this.handleBlogSubmit(e));
        }

        // Update Homepage Button
        const updateHomepageBtn = document.querySelector('[onclick*="update-blogs"]');
        if (updateHomepageBtn) {
            updateHomepageBtn.removeAttribute('onclick');
            updateHomepageBtn.addEventListener('click', () => this.handleUpdateHomepage());
        }

        // Blog Drop Zone
        const blogDropZone = document.getElementById('blogDropZone');
        if (blogDropZone) {
            this.setupBlogDropZone(blogDropZone);
        }
    }

    /**
     * Social Media Buttons
     */
    setupSocialButtons() {
        // Post Now Button
        const postNowBtn = document.getElementById('postNowBtn');
        if (postNowBtn) {
            postNowBtn.addEventListener('click', () => this.handlePostNow());
        }

        // Schedule Post Button
        const schedulePostBtn = document.getElementById('schedulePostBtn');
        if (schedulePostBtn) {
            schedulePostBtn.addEventListener('click', () => this.handleSchedulePost());
        }

        // Generate from Blog Button
        const generateFromBlogBtn = document.getElementById('generateFromBlogBtn');
        if (generateFromBlogBtn) {
            generateFromBlogBtn.addEventListener('click', () => this.handleGenerateFromBlog());
        }

        // Social Post Form
        const socialPostForm = document.getElementById('socialPostForm');
        if (socialPostForm) {
            socialPostForm.addEventListener('submit', (e) => this.handleSocialPostSubmit(e));
        }
    }

    /**
     * Analytics Buttons
     */
    setupAnalyticsButtons() {
        // Refresh Analytics Button
        const refreshAnalyticsBtn = document.getElementById('refreshAnalyticsBtn');
        if (refreshAnalyticsBtn) {
            refreshAnalyticsBtn.addEventListener('click', () => this.handleRefreshAnalytics());
        }

        // Time Range Selector
        const timeRange = document.getElementById('timeRange');
        if (timeRange) {
            timeRange.addEventListener('change', () => this.handleTimeRangeChange());
        }
    }

    /**
     * Automation Buttons
     */
    setupAutomationButtons() {
        // Generate Content Button
        const generateContentBtn = document.getElementById('generateContentBtn');
        if (generateContentBtn) {
            generateContentBtn.addEventListener('click', () => this.handleGenerateContent());
        }

        // Setup Schedule Button
        const setupScheduleBtn = document.getElementById('setupScheduleBtn');
        if (setupScheduleBtn) {
            setupScheduleBtn.addEventListener('click', () => this.handleSetupSchedule());
        }

        // Auto Post Toggles
        const blogAutoPostToggle = document.getElementById('blogAutoPostToggle');
        if (blogAutoPostToggle) {
            blogAutoPostToggle.addEventListener('change', (e) => this.handleAutoPostToggle('blog', e.target.checked));
        }

        const facebookAutoPostToggle = document.getElementById('facebookAutoPostToggle');
        if (facebookAutoPostToggle) {
            facebookAutoPostToggle.addEventListener('change', (e) => this.handleAutoPostToggle('facebook', e.target.checked));
        }

        // Domain Checkboxes
        const domainCheckboxes = document.querySelectorAll('.domain-checkbox');
        domainCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => this.handleDomainToggle(e.target.dataset.domain, e.target.checked));
        });
    }

    /**
     * Settings Buttons
     */
    setupSettingsButtons() {
        // Save Settings Button
        const saveSettingsBtn = document.getElementById('saveSettingsBtn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => this.handleSaveSettings());
        }

        // Social Settings Form
        const socialSettingsForm = document.getElementById('socialSettingsForm');
        if (socialSettingsForm) {
            socialSettingsForm.addEventListener('submit', (e) => this.handleSocialSettingsSubmit(e));
        }
    }

    /**
     * Navigation Buttons
     */
    setupNavigationButtons() {
        // Toggle Sidebar Button
        const toggleSidebar = document.getElementById('toggleSidebar');
        if (toggleSidebar) {
            toggleSidebar.addEventListener('click', () => this.handleToggleSidebar());
        }

        // Navigation Links
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
    }

    /**
     * Connection Buttons
     */
    setupConnectionButtons() {
        // Platform Connect Buttons
        const connectButtons = [
            'googleConnectBtn',
            'instagramConnectBtn', 
            'facebookConnectBtnMain',
            'facebookConnectBtnAutomation',
            'linkedinConnectBtn',
            'twitterConnectBtn'
        ];

        connectButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                const platform = this.extractPlatformFromId(buttonId);
                button.addEventListener('click', () => this.handlePlatformConnect(platform));
            }
        });
    }

    /**
     * Blog Form Submit Handler
     */
    async handleBlogSubmit(e) {
        e.preventDefault();
        
        try {
            const title = document.getElementById('blogTitle')?.value;
            const metaDescription = document.getElementById('blogMetaDescription')?.value;
            const tags = document.getElementById('blogTags')?.value;
            
            if (!title) {
                this.showNotification('Blog title is required', 'error');
                return;
            }

            // Get Quill editor content
            let content = '';
            if (window.dashboardCore && window.dashboardCore.quillEditor) {
                content = window.dashboardCore.quillEditor.root.innerHTML;
            }

            const blogPost = {
                id: 'blog_' + Date.now(),
                title,
                meta_description: metaDescription,
                tags: tags.split(',').map(tag => tag.trim()),
                content,
                date: new Date().toISOString(),
                status: 'published',
                author: 'Liquetax Team'
            };

            // Save to localStorage
            const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
            existingPosts.unshift(blogPost);
            localStorage.setItem('blogPosts', JSON.stringify(existingPosts));

            this.showNotification('Blog post saved successfully!', 'success');
            
            // Clear form
            document.getElementById('blogForm').reset();
            if (window.dashboardCore && window.dashboardCore.quillEditor) {
                window.dashboardCore.quillEditor.setContents([]);
            }

            // Update blog list
            if (typeof loadBlogPosts === 'function') {
                loadBlogPosts();
            }

        } catch (error) {
            console.error('Blog submit error:', error);
            this.showNotification('Error saving blog post', 'error');
        }
    }

    /**
     * Post Now Handler
     */
    async handlePostNow() {
        try {
            const content = document.getElementById('socialPostContent')?.value;
            const selectedPlatforms = this.getSelectedPlatforms();

            if (!content) {
                this.showNotification('Please enter post content', 'error');
                return;
            }

            if (selectedPlatforms.length === 0) {
                this.showNotification('Please select at least one platform', 'error');
                return;
            }

            this.showNotification('Posting to social media...', 'info');

            // Create social post
            const socialPost = {
                id: 'social_' + Date.now(),
                content,
                platforms: selectedPlatforms,
                date: new Date().toISOString(),
                status: 'published',
                engagement: { likes: 0, shares: 0, comments: 0 }
            };

            // Save to localStorage
            const existingPosts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
            existingPosts.unshift(socialPost);
            localStorage.setItem('socialPosts', JSON.stringify(existingPosts));

            // Simulate posting with delay
            await this.simulatePosting(socialPost, selectedPlatforms);

            // Clear form
            document.getElementById('socialPostContent').value = '';
            this.clearSelectedPlatforms();

            // Update UI
            if (typeof loadSocialPosts === 'function') {
                loadSocialPosts();
            }

            this.showNotification('Posted successfully!', 'success');

        } catch (error) {
            console.error('Post now error:', error);
            this.showNotification('Error posting to social media', 'error');
        }
    }

    /**
     * Schedule Post Handler
     */
    handleSchedulePost() {
        const content = document.getElementById('socialPostContent')?.value;
        const scheduleTime = document.getElementById('socialPostSchedule')?.value;
        const selectedPlatforms = this.getSelectedPlatforms();

        if (!content) {
            this.showNotification('Please enter post content', 'error');
            return;
        }

        if (!scheduleTime) {
            this.showNotification('Please select schedule time', 'error');
            return;
        }

        if (selectedPlatforms.length === 0) {
            this.showNotification('Please select at least one platform', 'error');
            return;
        }

        // Create scheduled post
        const scheduledPost = {
            id: 'scheduled_' + Date.now(),
            content,
            platforms: selectedPlatforms,
            scheduledTime: scheduleTime,
            status: 'scheduled',
            created: new Date().toISOString()
        };

        // Save to localStorage
        const scheduledPosts = JSON.parse(localStorage.getItem('scheduledPosts') || '[]');
        scheduledPosts.push(scheduledPost);
        localStorage.setItem('scheduledPosts', JSON.stringify(scheduledPosts));

        this.showNotification('Post scheduled successfully!', 'success');

        // Clear form
        document.getElementById('socialPostContent').value = '';
        document.getElementById('socialPostSchedule').value = '';
        this.clearSelectedPlatforms();
    }

    /**
     * Generate from Blog Handler
     */
    handleGenerateFromBlog() {
        const blogPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        
        if (blogPosts.length === 0) {
            this.showNotification('No blog posts available. Create a blog post first.', 'error');
            return;
        }

        // Get latest blog post
        const latestPost = blogPosts[0];
        
        // Generate social media content from blog
        const socialContent = this.generateSocialContentFromBlog(latestPost);
        
        // Fill the social post form
        document.getElementById('socialPostContent').value = socialContent;
        
        this.showNotification('Content generated from latest blog post!', 'success');
    }

    /**
     * Platform Connect Handler
     */
    handlePlatformConnect(platform) {
        console.log(`Connecting to ${platform}...`);
        
        // Check if already connected
        const isConnected = localStorage.getItem(`${platform}Connected`) === 'true';
        
        if (isConnected) {
            if (confirm(`Disconnect from ${platform}?`)) {
                this.disconnectPlatform(platform);
            }
            return;
        }

        // Show loading state
        this.showConnectionLoading(platform);

        // Simulate connection (in real app, this would redirect to OAuth)
        setTimeout(() => {
            // Mark as connected
            localStorage.setItem(`${platform}Connected`, 'true');
            localStorage.setItem(`${platform}ConnectedAt`, new Date().toISOString());
            
            // Update UI
            this.updateConnectionStatus(platform, true);
            this.showNotification(`Successfully connected to ${platform}!`, 'success');
            
            // Update analytics
            if (window.socialAnalytics) {
                window.socialAnalytics.refresh();
            }
        }, 2000);
    }

    /**
     * Generate Content Handler
     */
    async handleGenerateContent() {
        try {
            this.showNotification('Generating automated content...', 'info');
            
            // Simulate AI content generation
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const generatedContent = this.generateAutomaticContent();
            
            // Create blog post
            const blogPost = {
                id: 'auto_' + Date.now(),
                title: generatedContent.title,
                meta_description: generatedContent.description,
                tags: generatedContent.tags,
                content: generatedContent.content,
                date: new Date().toISOString(),
                status: 'published',
                author: 'Auto-Generator',
                source: 'automation'
            };

            // Save to localStorage
            const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
            existingPosts.unshift(blogPost);
            localStorage.setItem('blogPosts', JSON.stringify(existingPosts));

            this.showNotification(`Generated: "${generatedContent.title}"`, 'success');

            // Update blog list
            if (typeof loadBlogPosts === 'function') {
                loadBlogPosts();
            }

        } catch (error) {
            console.error('Generate content error:', error);
            this.showNotification('Error generating content', 'error');
        }
    }

    /**
     * Auto Post Toggle Handler
     */
    handleAutoPostToggle(type, enabled) {
        localStorage.setItem(`${type}AutoPostEnabled`, enabled);
        
        const statusElement = document.getElementById(`${type}AutoPostStatus`);
        if (statusElement) {
            statusElement.innerHTML = enabled 
                ? '<i class="fas fa-play-circle text-success"></i> Active'
                : '<i class="fas fa-pause-circle text-warning"></i> Inactive';
        }

        this.showNotification(`${type} auto-posting ${enabled ? 'enabled' : 'disabled'}`, 'success');
    }

    /**
     * Navigation Handler
     */
    handleNavigation(e) {
        e.preventDefault();
        
        const targetSection = e.target.dataset.section;
        if (!targetSection) return;

        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetElement = document.getElementById(targetSection);
        if (targetElement) {
            targetElement.classList.add('active');
        }

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        e.target.classList.add('active');

        // Initialize section-specific functionality
        this.initializeSection(targetSection);
    }

    /**
     * Toggle Sidebar Handler
     */
    handleToggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (sidebar && mainContent) {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        }
    }

    /**
     * Update Homepage Handler
     */
    handleUpdateHomepage() {
        this.showNotification('Updating homepage with latest blog posts...', 'info');
        
        // Simulate homepage update
        setTimeout(() => {
            this.showNotification('Homepage updated successfully!', 'success');
        }, 2000);
    }

    /**
     * Helper Methods
     */
    getSelectedPlatforms() {
        const platforms = [];
        const checkboxes = document.querySelectorAll('#socialPostForm input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            platforms.push(checkbox.value);
        });
        return platforms;
    }

    clearSelectedPlatforms() {
        const checkboxes = document.querySelectorAll('#socialPostForm input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    extractPlatformFromId(buttonId) {
        return buttonId.replace(/ConnectBtn.*/, '').toLowerCase();
    }

    showConnectionLoading(platform) {
        const button = document.getElementById(`${platform}ConnectBtn`) || 
                      document.getElementById(`${platform}ConnectBtnMain`);
        if (button) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Connecting...';
            button.disabled = true;
        }
    }

    updateConnectionStatus(platform, connected) {
        const buttons = [
            document.getElementById(`${platform}ConnectBtn`),
            document.getElementById(`${platform}ConnectBtnMain`),
            document.getElementById(`${platform}ConnectBtnAutomation`)
        ].filter(Boolean);

        buttons.forEach(button => {
            button.disabled = false;
            if (connected) {
                button.innerHTML = '<i class="fas fa-check me-1"></i> Connected';
                button.classList.add('btn-success');
            } else {
                button.innerHTML = '<i class="fas fa-link me-1"></i> Connect';
                button.classList.remove('btn-success');
            }
        });

        // Update platform status in lists
        const platformElements = document.querySelectorAll(`[data-platform="${platform}"]`);
        platformElements.forEach(element => {
            const badge = element.querySelector('.badge');
            if (badge) {
                badge.textContent = connected ? 'Connected' : 'Not Connected';
                badge.className = `badge ${connected ? 'bg-success' : 'bg-warning'} ms-2`;
            }
        });
    }

    disconnectPlatform(platform) {
        localStorage.removeItem(`${platform}Connected`);
        localStorage.removeItem(`${platform}ConnectedAt`);
        this.updateConnectionStatus(platform, false);
        this.showNotification(`Disconnected from ${platform}`, 'info');
    }

    generateSocialContentFromBlog(blogPost) {
        const title = blogPost.title;
        const excerpt = blogPost.meta_description || 'Check out our latest blog post!';
        
        return `📝 New Blog Post: ${title}\n\n${excerpt}\n\nRead more: https://liquetax.com/blog/\n\n#Liquetax #BlogPost #BusinessTips`;
    }

    generateAutomaticContent() {
        const templates = [
            {
                title: 'Top 10 Tax Saving Tips for Small Businesses in 2024',
                description: 'Discover essential tax-saving strategies that every small business owner should know.',
                tags: ['tax-tips', 'small-business', 'savings'],
                content: '<h2>Tax Saving Strategies</h2><p>Smart tax planning can save your business thousands...</p>'
            },
            {
                title: 'Complete Guide to GST Registration in India',
                description: 'Step-by-step guide to register for GST and stay compliant with Indian tax laws.',
                tags: ['gst', 'registration', 'compliance'],
                content: '<h2>GST Registration Process</h2><p>Getting your GST registration right is crucial...</p>'
            },
            {
                title: 'Digital Accounting: Transform Your Business Finance',
                description: 'Learn how digital accounting can streamline your business operations.',
                tags: ['digital-accounting', 'finance', 'technology'],
                content: '<h2>Digital Transformation</h2><p>Modern businesses need modern solutions...</p>'
            }
        ];

        return templates[Math.floor(Math.random() * templates.length)];
    }

    async simulatePosting(post, platforms) {
        for (let i = 0; i < platforms.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.showNotification(`Posted to ${platforms[i]}`, 'success');
        }
    }

    initializeSection(sectionName) {
        switch(sectionName) {
            case 'socialMedia':
                if (window.socialAnalytics) {
                    window.socialAnalytics.refresh();
                }
                break;
            case 'analytics':
                this.loadAnalyticsData();
                break;
            case 'blogManagement':
                if (typeof loadBlogPosts === 'function') {
                    loadBlogPosts();
                }
                break;
        }
    }

    loadAnalyticsData() {
        // Simulate loading analytics
        console.log('Loading analytics data...');
    }

    setupBlogDropZone(dropZone) {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('border-primary');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('border-primary');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('border-primary');
            
            const files = e.dataTransfer.files;
            this.handleFileUpload(files);
        });

        dropZone.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.html,.htm';
            input.multiple = true;
            input.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
            input.click();
        });
    }

    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type === 'text/html' || file.name.endsWith('.html')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.processBlogFile(file.name, e.target.result);
                };
                reader.readAsText(file);
            }
        });
    }

    processBlogFile(filename, content) {
        // Extract blog metadata from HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        
        const title = doc.querySelector('title')?.textContent || filename.replace('.html', '');
        const description = doc.querySelector('meta[name="description"]')?.content || '';
        
        this.showNotification(`Imported blog: ${title}`, 'success');
    }

    showNotification(message, type = 'info') {
        // Use existing notification system or create simple one
        if (window.Toastify) {
            const colors = {
                success: 'linear-gradient(to right, #00b09b, #96c93d)',
                error: 'linear-gradient(to right, #ff5f6d, #ffc371)',
                warning: 'linear-gradient(to right, #f2994a, #f2c94c)',
                info: 'linear-gradient(to right, #2193b0, #6dd5ed)'
            };

            Toastify({
                text: message,
                duration: 3000,
                gravity: "top",
                position: "right",
                backgroundColor: colors[type] || colors.info
            }).showToast();
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }

    // Additional handlers for remaining buttons
    handleRefreshAnalytics() {
        if (window.socialAnalytics) {
            window.socialAnalytics.refresh();
        }
        this.showNotification('Analytics refreshed!', 'success');
    }

    handleTimeRangeChange() {
        const timeRange = document.getElementById('timeRange')?.value;
        this.showNotification(`Analytics updated for ${timeRange} days`, 'info');
    }

    handleSetupSchedule() {
        this.showNotification('Schedule setup coming soon!', 'info');
    }

    handleDomainToggle(domain, enabled) {
        localStorage.setItem(`domain_${domain}`, enabled);
        this.showNotification(`${domain} ${enabled ? 'enabled' : 'disabled'}`, 'success');
    }

    handleSaveSettings() {
        this.showNotification('Settings saved successfully!', 'success');
    }

    handleSocialSettingsSubmit(e) {
        e.preventDefault();
        this.showNotification('Social media settings updated!', 'success');
    }

    handleSocialPostSubmit(e) {
        e.preventDefault();
        this.handlePostNow();
    }
}

// Initialize dashboard buttons when DOM is ready
window.dashboardButtons = new DashboardButtons();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardButtons;
}
