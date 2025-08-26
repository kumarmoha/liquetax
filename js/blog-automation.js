/**
 * Blog Automation System
 * Automated blog posting with social media integration
 */

class BlogAutomation {
    constructor() {
        this.autoPostingEnabled = false;
        this.postingSchedule = [];
        this.contentTemplates = [];
        this.domains = [
            { name: 'liquetax.com', path: '/blog/', active: true },
            { name: 'nishkarsh.co.in', path: '/blog/', active: false },
            { name: 'nishkarsh.net', path: '/resources/', active: false },
            { name: 'nishkarsh.org', path: '/community/', active: false }
        ];
        
        this.init();
    }

    /**
     * Initialize blog automation
     */
    init() {
        console.log('Initializing Blog Automation...');
        
        this.loadSettings();
        this.setupEventListeners();
        this.loadContentTemplates();
        
        if (this.autoPostingEnabled) {
            this.startAutomation();
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Auto-posting toggle
        const autoPostToggle = document.getElementById('blogAutoPostToggle');
        if (autoPostToggle) {
            autoPostToggle.addEventListener('change', (e) => {
                this.toggleAutoPosting(e.target.checked);
            });
        }

        // Schedule setup button
        const scheduleBtn = document.getElementById('setupScheduleBtn');
        if (scheduleBtn) {
            scheduleBtn.addEventListener('click', () => {
                this.showScheduleModal();
            });
        }

        // Generate content button
        const generateBtn = document.getElementById('generateContentBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => {
                this.generateAutomaticContent();
            });
        }

        // Domain management
        const domainCheckboxes = document.querySelectorAll('.domain-checkbox');
        domainCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.updateDomainStatus(e.target.dataset.domain, e.target.checked);
            });
        });
    }

    /**
     * Load content templates
     */
    loadContentTemplates() {
        this.contentTemplates = [
            {
                category: 'Business Setup',
                templates: [
                    {
                        title: 'Complete Guide to {BUSINESS_TYPE} Registration in India',
                        metaDescription: 'Step-by-step guide to register your {BUSINESS_TYPE} in India. Learn about documentation, costs, timeline, and legal requirements.',
                        tags: ['business registration', 'startup', 'legal', 'india'],
                        contentOutline: [
                            'Introduction to {BUSINESS_TYPE}',
                            'Benefits and Advantages',
                            'Required Documents',
                            'Step-by-Step Process',
                            'Costs and Timeline',
                            'Common Mistakes to Avoid',
                            'Conclusion and Next Steps'
                        ]
                    },
                    {
                        title: 'Top {NUMBER} Mistakes to Avoid When Starting a {BUSINESS_TYPE}',
                        metaDescription: 'Avoid common pitfalls when starting your {BUSINESS_TYPE}. Expert insights on legal, financial, and operational mistakes.',
                        tags: ['startup mistakes', 'business tips', 'entrepreneurship'],
                        contentOutline: [
                            'Introduction',
                            'Mistake 1: Poor Legal Structure',
                            'Mistake 2: Inadequate Documentation',
                            'Mistake 3: Tax Planning Oversights',
                            'Mistake 4: Compliance Negligence',
                            'Mistake 5: Financial Mismanagement',
                            'How to Avoid These Mistakes',
                            'Conclusion'
                        ]
                    }
                ]
            },
            {
                category: 'Tax Optimization',
                templates: [
                    {
                        title: '{NUMBER} Smart Tax Saving Strategies for {YEAR}',
                        metaDescription: 'Discover effective tax saving strategies for {YEAR}. Legal methods to optimize your tax liability and maximize savings.',
                        tags: ['tax saving', 'tax planning', 'income tax', 'deductions'],
                        contentOutline: [
                            'Introduction to Tax Planning',
                            'Section 80C Investments',
                            'Health Insurance Benefits',
                            'Home Loan Tax Benefits',
                            'Business Expense Deductions',
                            'Advanced Tax Strategies',
                            'Tax Planning Calendar',
                            'Conclusion'
                        ]
                    }
                ]
            },
            {
                category: 'Compliance',
                templates: [
                    {
                        title: 'GST Compliance Checklist for {BUSINESS_TYPE}',
                        metaDescription: 'Complete GST compliance checklist for {BUSINESS_TYPE}. Ensure your business meets all GST requirements and deadlines.',
                        tags: ['GST', 'compliance', 'tax filing', 'business'],
                        contentOutline: [
                            'GST Overview',
                            'Registration Requirements',
                            'Monthly Compliance',
                            'Quarterly Requirements',
                            'Annual Compliance',
                            'Common Compliance Issues',
                            'Best Practices',
                            'Conclusion'
                        ]
                    }
                ]
            }
        ];
    }

    /**
     * Generate automatic content
     */
    async generateAutomaticContent() {
        try {
            const template = this.selectRandomTemplate();
            const variables = this.generateVariables();
            const content = this.populateTemplate(template, variables);
            
            // Create blog post
            const blogPost = {
                id: 'auto_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
                title: content.title,
                meta_description: content.metaDescription,
                tags: content.tags,
                content: content.htmlContent,
                date: new Date().toISOString(),
                status: 'published',
                author: 'Auto-Generator',
                source: 'automation',
                category: template.category
            };

            // Save to localStorage
            const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
            existingPosts.unshift(blogPost);
            localStorage.setItem('blogPosts', JSON.stringify(existingPosts));

            // Generate HTML files for active domains
            await this.publishToActiveDomains(blogPost);

            // Add to Facebook posting queue if connected
            if (window.facebookAutomation && window.facebookAutomation.isConnected) {
                window.facebookAutomation.addToPostingQueue(blogPost);
            }

            // Update UI
            if (typeof loadBlogPosts === 'function') {
                loadBlogPosts();
            }

            showNotification(`Auto-generated blog post: "${blogPost.title}"`, 'success');
            
            console.log('Auto-generated blog post:', blogPost);
            return blogPost;

        } catch (error) {
            console.error('Failed to generate automatic content:', error);
            showNotification('Failed to generate automatic content', 'error');
        }
    }

    /**
     * Select random template
     */
    selectRandomTemplate() {
        const allTemplates = this.contentTemplates.flatMap(category => 
            category.templates.map(template => ({...template, category: category.category}))
        );
        return allTemplates[Math.floor(Math.random() * allTemplates.length)];
    }

    /**
     * Generate variables for template
     */
    generateVariables() {
        const businessTypes = ['Private Limited Company', 'LLP', 'Partnership Firm', 'Sole Proprietorship', 'OPC'];
        const numbers = ['5', '7', '10', '12', '15'];
        const currentYear = new Date().getFullYear();

        return {
            BUSINESS_TYPE: businessTypes[Math.floor(Math.random() * businessTypes.length)],
            NUMBER: numbers[Math.floor(Math.random() * numbers.length)],
            YEAR: currentYear.toString()
        };
    }

    /**
     * Populate template with variables
     */
    populateTemplate(template, variables) {
        let title = template.title;
        let metaDescription = template.metaDescription;
        
        // Replace variables
        Object.keys(variables).forEach(key => {
            const regex = new RegExp(`{${key}}`, 'g');
            title = title.replace(regex, variables[key]);
            metaDescription = metaDescription.replace(regex, variables[key]);
        });

        // Generate HTML content
        const htmlContent = this.generateHTMLContent(template.contentOutline, variables);

        return {
            title,
            metaDescription,
            tags: template.tags,
            htmlContent
        };
    }

    /**
     * Generate HTML content from outline
     */
    generateHTMLContent(outline, variables) {
        let html = '<div class="blog-content">';
        
        outline.forEach((section, index) => {
            let sectionTitle = section;
            
            // Replace variables in section titles
            Object.keys(variables).forEach(key => {
                const regex = new RegExp(`{${key}}`, 'g');
                sectionTitle = sectionTitle.replace(regex, variables[key]);
            });

            if (index === 0) {
                // Introduction
                html += `<h2>${sectionTitle}</h2>`;
                html += `<p>In today's competitive business environment, understanding ${sectionTitle.toLowerCase()} is crucial for success. This comprehensive guide will walk you through everything you need to know.</p>`;
            } else if (index === outline.length - 1) {
                // Conclusion
                html += `<h2>${sectionTitle}</h2>`;
                html += `<p>By following the guidelines outlined in this article, you'll be well-equipped to make informed decisions. For personalized assistance, contact our experts at Liquetax.</p>`;
                html += `<div class="cta-section">`;
                html += `<h3>Need Professional Help?</h3>`;
                html += `<p>Our team of experts is ready to assist you with all your business and tax needs.</p>`;
                html += `<a href="https://wa.me/918902984671" class="btn btn-success">Contact Us Today</a>`;
                html += `</div>`;
            } else {
                // Regular sections
                html += `<h2>${sectionTitle}</h2>`;
                html += `<p>This section covers important aspects of ${sectionTitle.toLowerCase()}. Understanding these concepts will help you make better decisions for your business.</p>`;
                html += `<ul>`;
                html += `<li>Key point about ${sectionTitle.toLowerCase()}</li>`;
                html += `<li>Important consideration for implementation</li>`;
                html += `<li>Best practices and recommendations</li>`;
                html += `</ul>`;
            }
        });
        
        html += '</div>';
        return html;
    }

    /**
     * Publish to active domains
     */
    async publishToActiveDomains(blogPost) {
        const activeDomains = this.domains.filter(domain => domain.active);
        
        for (const domain of activeDomains) {
            try {
                await this.generateBlogHTML(blogPost, domain);
                console.log(`Published to ${domain.name}`);
            } catch (error) {
                console.error(`Failed to publish to ${domain.name}:`, error);
            }
        }
    }

    /**
     * Generate HTML file for blog post
     */
    async generateBlogHTML(blogPost, domain) {
        const slug = this.generateSlug(blogPost.title);
        const filename = `${slug}.html`;
        
        const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${blogPost.title} | ${domain.name}</title>
    <meta name="description" content="${blogPost.meta_description}">
    <meta name="keywords" content="${blogPost.tags.join(', ')}">
    <meta name="author" content="Liquetax">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://${domain.name}${domain.path}${filename}">
    <meta property="og:title" content="${blogPost.title}">
    <meta property="og:description" content="${blogPost.meta_description}">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://${domain.name}${domain.path}${filename}">
    <meta property="twitter:title" content="${blogPost.title}">
    <meta property="twitter:description" content="${blogPost.meta_description}">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    
    <style>
        .blog-header {
            background: linear-gradient(135deg, #0c3c63, #1c5a8d);
            color: white;
            padding: 60px 0;
        }
        .blog-content {
            line-height: 1.8;
        }
        .blog-content h2 {
            color: #0c3c63;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
        .cta-section {
            background: #f8f9fa;
            padding: 2rem;
            border-radius: 10px;
            margin: 2rem 0;
            text-align: center;
        }
        .tag-badge {
            background: #0c3c63;
            color: white;
            padding: 0.25rem 0.5rem;
            border-radius: 15px;
            font-size: 0.8rem;
            margin-right: 0.5rem;
        }
    </style>
</head>
<body>
    <header class="blog-header">
        <div class="container">
            <div class="row">
                <div class="col-lg-8 mx-auto text-center">
                    <h1 class="display-4">${blogPost.title}</h1>
                    <p class="lead">${blogPost.meta_description}</p>
                    <div class="mt-3">
                        ${blogPost.tags.map(tag => `<span class="tag-badge">${tag}</span>`).join('')}
                    </div>
                    <p class="mt-3">
                        <small>Published on ${new Date(blogPost.date).toLocaleDateString()} by ${blogPost.author}</small>
                    </p>
                </div>
            </div>
        </div>
    </header>

    <main class="container my-5">
        <div class="row">
            <div class="col-lg-8 mx-auto">
                ${blogPost.content}
            </div>
        </div>
    </main>

    <footer class="bg-dark text-white py-4">
        <div class="container text-center">
            <p>&copy; 2024 ${domain.name}. All rights reserved.</p>
            <p>
                <a href="https://liquetax.com" class="text-white">Visit Liquetax.com</a> |
                <a href="https://wa.me/918902984671" class="text-white">Contact Us</a>
            </p>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

        // In a real implementation, this would save to the server
        // For now, we'll create a downloadable file
        this.createDownloadableFile(filename, htmlTemplate, domain.name);
    }

    /**
     * Create downloadable file
     */
    createDownloadableFile(filename, content, domainName) {
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // Store for later download
        const downloads = JSON.parse(localStorage.getItem('pendingDownloads') || '[]');
        downloads.push({
            filename: `${domainName}_${filename}`,
            url: url,
            domain: domainName,
            created: new Date().toISOString()
        });
        localStorage.setItem('pendingDownloads', JSON.stringify(downloads));
        
        console.log(`Created downloadable file: ${domainName}_${filename}`);
    }

    /**
     * Generate URL slug
     */
    generateSlug(title) {
        return title.toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }

    /**
     * Setup posting schedule
     */
    setupPostingSchedule() {
        const schedule = [
            { day: 'monday', time: '09:00', domain: 'liquetax.com' },
            { day: 'tuesday', time: '10:00', domain: 'nishkarsh.co.in' },
            { day: 'wednesday', time: '09:00', domain: 'liquetax.com' },
            { day: 'thursday', time: '10:00', domain: 'nishkarsh.net' },
            { day: 'friday', time: '09:00', domain: 'liquetax.com' },
            { day: 'saturday', time: '11:00', domain: 'nishkarsh.net' },
            { day: 'sunday', time: '10:00', domain: 'nishkarsh.org' }
        ];

        this.postingSchedule = schedule;
        this.saveSettings();
    }

    /**
     * Start automation
     */
    startAutomation() {
        if (this.autoPostingEnabled) {
            // Check every hour for scheduled posts
            this.automationInterval = setInterval(() => {
                this.checkScheduledPosts();
            }, 60 * 60 * 1000); // 1 hour

            console.log('Blog automation started');
        }
    }

    /**
     * Stop automation
     */
    stopAutomation() {
        if (this.automationInterval) {
            clearInterval(this.automationInterval);
            this.automationInterval = null;
        }
        console.log('Blog automation stopped');
    }

    /**
     * Check for scheduled posts
     */
    checkScheduledPosts() {
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
        const currentTime = now.toTimeString().slice(0, 5);

        const scheduledPost = this.postingSchedule.find(schedule => 
            schedule.day === currentDay && schedule.time === currentTime
        );

        if (scheduledPost) {
            this.generateAutomaticContent();
        }
    }

    /**
     * Toggle auto-posting
     */
    toggleAutoPosting(enabled) {
        this.autoPostingEnabled = enabled;
        
        if (enabled) {
            this.setupPostingSchedule();
            this.startAutomation();
        } else {
            this.stopAutomation();
        }
        
        this.saveSettings();
        this.updateAutoPostingStatus();
    }

    /**
     * Update domain status
     */
    updateDomainStatus(domainName, active) {
        const domain = this.domains.find(d => d.name === domainName);
        if (domain) {
            domain.active = active;
            this.saveSettings();
        }
    }

    /**
     * Update auto-posting status in UI
     */
    updateAutoPostingStatus() {
        const toggle = document.getElementById('blogAutoPostToggle');
        const status = document.getElementById('blogAutoPostStatus');
        
        if (toggle) {
            toggle.checked = this.autoPostingEnabled;
        }
        
        if (status) {
            status.innerHTML = this.autoPostingEnabled ? 
                '<i class="fas fa-play-circle text-success"></i> Active' :
                '<i class="fas fa-pause-circle text-warning"></i> Inactive';
        }
    }

    /**
     * Show schedule modal
     */
    showScheduleModal() {
        // Implementation for schedule configuration modal
        console.log('Schedule modal - to be implemented');
    }

    /**
     * Save settings
     */
    saveSettings() {
        const settings = {
            autoPostingEnabled: this.autoPostingEnabled,
            postingSchedule: this.postingSchedule,
            domains: this.domains
        };
        
        localStorage.setItem('blogAutomationSettings', JSON.stringify(settings));
    }

    /**
     * Load settings
     */
    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('blogAutomationSettings') || '{}');
        
        this.autoPostingEnabled = settings.autoPostingEnabled || false;
        this.postingSchedule = settings.postingSchedule || [];
        this.domains = settings.domains || this.domains;
    }

    /**
     * Get automation analytics
     */
    getAutomationAnalytics() {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const autoPosts = posts.filter(post => post.source === 'automation');
        
        return {
            totalAutoPosts: autoPosts.length,
            postsThisWeek: autoPosts.filter(post => {
                const postDate = new Date(post.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return postDate >= weekAgo;
            }).length,
            postsThisMonth: autoPosts.filter(post => {
                const postDate = new Date(post.date);
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return postDate >= monthAgo;
            }).length,
            activeDomains: this.domains.filter(d => d.active).length
        };
    }
}

// Initialize blog automation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogAutomation = new BlogAutomation();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogAutomation;
}