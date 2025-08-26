/**
 * Blog Manager Pro Configuration
 * Central configuration for the blog management system
 */

window.BlogConfig = {
    // General Settings
    siteName: 'Liquetax',
    siteUrl: 'https://liquetax.com',
    blogPath: '/blog-detaile/',
    
    // Default Blog Settings
    defaults: {
        author: 'Liquetax Team',
        category: 'Business & Tax',
        status: 'draft',
        blogsPerPage: 3,
        imageFolder: './img/blog/',
        defaultImage: './img/blog/default-blog.jpg'
    },
    
    // SEO Configuration
    seo: {
        autoGenerate: true,
        siteName: 'Liquetax',
        defaultDescription: 'Expert business solutions and tax guidance from Liquetax - your trusted partner for business growth.',
        twitterHandle: '@liquetax',
        facebookPage: 'https://www.facebook.com/Liquetax/',
        logoUrl: '/img/logo.png'
    },
    
    // Blog Categories
    categories: [
        'Tax & Compliance',
        'Business Setup', 
        'Legal & Regulatory',
        'Import/Export',
        'Intellectual Property',
        'Digital Services',
        'Startup Guide',
        'GST & Returns',
        'Company Registration',
        'General'
    ],
    
    // Common Tags
    commonTags: [
        'tax', 'gst', 'business', 'registration', 'company', 'startup',
        'itr', 'filing', 'compliance', 'legal', 'finance', 'accounting',
        'trademark', 'patent', 'license', 'export', 'import', 'msme',
        'private limited', 'llp', 'proprietorship', 'partnership',
        'digital signature', 'pan', 'aadhaar', 'government'
    ],
    
    // File Upload Configuration
    upload: {
        maxFileSize: 50 * 1024 * 1024, // 50MB
        allowedExtensions: ['.html', '.htm'],
        autoProcess: true,
        showProgress: true
    },
    
    // UI Configuration
    ui: {
        theme: 'light', // 'light' or 'dark'
        animations: true,
        autoRefresh: 30000, // 30 seconds
        toastDuration: 3000,
        fadeInDelay: 100
    },
    
    // Analytics Configuration
    analytics: {
        enabled: true,
        trackViews: true,
        trackClicks: true,
        dailyStats: true
    },
    
    // Integration Settings
    integration: {
        autoUpdateIndex: true,
        showInDashboard: true,
        realTimeSync: true
    },
    
    // Social Media Templates
    socialTemplates: {
        facebook: {
            template: "Check out our latest blog: {title} - {url}",
            hashtags: ["#Liquetax", "#Business", "#Tax"]
        },
        twitter: {
            template: "📖 New Blog: {title}\n\n{summary}\n\n{url} {hashtags}",
            hashtags: ["#Liquetax", "#Business", "#Tax", "#Startup"]
        },
        linkedin: {
            template: "🚀 {title}\n\n{summary}\n\nRead more: {url}",
            hashtags: ["#Liquetax", "#Business", "#Tax", "#Entrepreneurship"]
        }
    },
    
    // Email Templates
    emailTemplates: {
        blogNotification: {
            subject: "New Blog Published: {title}",
            template: "We've published a new blog post that you might find interesting:\n\n{title}\n{summary}\n\nRead more: {url}"
        }
    },
    
    // Validation Rules
    validation: {
        title: {
            minLength: 10,
            maxLength: 100,
            required: true
        },
        summary: {
            minLength: 50,
            maxLength: 300,
            required: true
        },
        tags: {
            minCount: 1,
            maxCount: 10,
            required: true
        }
    },
    
    // Performance Settings
    performance: {
        lazyLoading: true,
        imageOptimization: true,
        caching: true,
        preloadImages: false
    },
    
    // Backup Configuration
    backup: {
        autoBackup: true,
        backupInterval: 24 * 60 * 60 * 1000, // 24 hours
        maxBackups: 7, // Keep 7 days of backups
        includeAnalytics: true
    },
    
    // Error Handling
    errorHandling: {
        showUserFriendlyMessages: true,
        logErrors: true,
        fallbackImage: './img/blog/default-blog.jpg',
        retryAttempts: 3
    },
    
    // Feature Flags
    features: {
        darkMode: true,
        bulkOperations: true,
        advancedSearch: true,
        blogScheduling: false, // Future feature
        socialAutoPost: false, // Future feature
        commentSystem: false,  // Future feature
        blogAnalytics: true,
        exportImport: true
    }
};

// Helper Functions
window.BlogConfig.utils = {
    // Get full blog URL
    getBlogUrl: (filename) => {
        return `${window.BlogConfig.siteUrl}${window.BlogConfig.blogPath}${encodeURIComponent(filename)}`;
    },
    
    // Format date for display
    formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Generate social sharing URLs
    getSocialUrls: (blog) => {
        const url = window.BlogConfig.utils.getBlogUrl(blog.filename);
        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(blog.title);
        const encodedSummary = encodeURIComponent(blog.summary);
        
        return {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            whatsapp: `https://wa.me/?text=${encodedTitle} - ${encodedUrl}`
        };
    },
    
    // Validate blog data
    validateBlog: (blog) => {
        const errors = [];
        
        // Title validation
        if (!blog.title || blog.title.length < window.BlogConfig.validation.title.minLength) {
            errors.push(`Title must be at least ${window.BlogConfig.validation.title.minLength} characters`);
        }
        
        // Summary validation
        if (!blog.summary || blog.summary.length < window.BlogConfig.validation.summary.minLength) {
            errors.push(`Summary must be at least ${window.BlogConfig.validation.summary.minLength} characters`);
        }
        
        // Tags validation
        if (!blog.tags || blog.tags.length < window.BlogConfig.validation.tags.minCount) {
            errors.push(`At least ${window.BlogConfig.validation.tags.minCount} tag is required`);
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },
    
    // Generate SEO-friendly slug
    generateSlug: (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    },
    
    // Calculate reading time
    calculateReadingTime: (content) => {
        const wordsPerMinute = 200;
        const wordCount = content.trim().split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readingTime} min read`;
    },
    
    // Get category color
    getCategoryColor: (category) => {
        const colors = {
            'Tax & Compliance': '#dc3545',
            'Business Setup': '#28a745',
            'Legal & Regulatory': '#6f42c1',
            'Import/Export': '#fd7e14',
            'Intellectual Property': '#20c997',
            'Digital Services': '#17a2b8',
            'Startup Guide': '#ffc107',
            'GST & Returns': '#e83e8c',
            'Company Registration': '#6610f2',
            'General': '#6c757d'
        };
        return colors[category] || '#6c757d';
    }
};

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.BlogConfig;
}

// Initialize configuration
document.addEventListener('DOMContentLoaded', () => {
    console.log('Blog Manager Pro Configuration loaded successfully!');
    
    // Apply theme if saved
    const savedTheme = localStorage.getItem('blogManagerTheme');
    if (savedTheme) {
        window.BlogConfig.ui.theme = savedTheme;
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }
    
    // Set up auto-backup if enabled
    if (window.BlogConfig.backup.autoBackup) {
        setInterval(() => {
            if (typeof blogManager !== 'undefined') {
                blogManager.createAutoBackup();
            }
        }, window.BlogConfig.backup.backupInterval);
    }
});
