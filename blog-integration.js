/**
 * Blog Integration Module
 * Connects Blog Manager Pro with existing admin dashboard
 */

// Integration with existing dashboard
function initializeBlogManagerPro() {
    // Check if Blog Manager Pro is available
    if (typeof BlogManagerPro !== 'undefined') {
        console.log('Blog Manager Pro loaded successfully');
        return true;
    } else {
        console.log('Blog Manager Pro not found, loading...');
        loadBlogManagerPro();
        return false;
    }
}

// Dynamically load Blog Manager Pro
function loadBlogManagerPro() {
    const script = document.createElement('script');
    script.src = 'blog-manager-pro.js';
    script.onload = () => {
        console.log('Blog Manager Pro loaded and ready');
    };
    document.head.appendChild(script);
}

// Integration functions for existing dashboard
window.blogIntegration = {
    // Get blog statistics for main dashboard
    getBlogStats: () => {
        if (typeof blogManager !== 'undefined') {
            const blogs = blogManager.blogs || [];
            return {
                total: blogs.length,
                published: blogs.filter(b => b.status === 'published').length,
                drafts: blogs.filter(b => b.status === 'draft').length,
                recentUploads: blogs.filter(b => {
                    const uploadDate = new Date(b.uploadDate);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return uploadDate > weekAgo;
                }).length
            };
        }
        return { total: 0, published: 0, drafts: 0, recentUploads: 0 };
    },

    // Get latest published blogs
    getLatestBlogs: (count = 5) => {
        if (typeof blogManager !== 'undefined') {
            return blogManager.blogs
                .filter(blog => blog.status === 'published')
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, count);
        }
        return [];
    },

    // Open Blog Manager Pro in new tab
    openBlogManager: () => {
        window.open('blog-manager-pro.html', '_blank');
    },

    // Generate quick blog summary for main dashboard
    generateBlogSummaryHTML: () => {
        const stats = window.blogIntegration.getBlogStats();
        const latestBlogs = window.blogIntegration.getLatestBlogs(3);

        return `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0"><i class="fas fa-blog me-2"></i>Blog Management</h5>
                    <button class="btn btn-primary btn-sm" onclick="blogIntegration.openBlogManager()">
                        <i class="fas fa-external-link-alt me-1"></i>Open Blog Manager Pro
                    </button>
                </div>
                <div class="card-body">
                    <div class="row mb-3">
                        <div class="col-3 text-center">
                            <div class="h4 text-primary mb-0">${stats.total}</div>
                            <small class="text-muted">Total Blogs</small>
                        </div>
                        <div class="col-3 text-center">
                            <div class="h4 text-success mb-0">${stats.published}</div>
                            <small class="text-muted">Published</small>
                        </div>
                        <div class="col-3 text-center">
                            <div class="h4 text-warning mb-0">${stats.drafts}</div>
                            <small class="text-muted">Drafts</small>
                        </div>
                        <div class="col-3 text-center">
                            <div class="h4 text-info mb-0">${stats.recentUploads}</div>
                            <small class="text-muted">This Week</small>
                        </div>
                    </div>
                    ${latestBlogs.length > 0 ? `
                        <h6 class="mb-2">Latest Published Blogs:</h6>
                        <div class="list-group list-group-flush">
                            ${latestBlogs.map(blog => `
                                <div class="list-group-item px-0 py-2 border-0">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 class="mb-1 text-truncate" style="max-width: 300px;">${blog.title}</h6>
                                            <small class="text-muted">${blog.date} • ${blog.category}</small>
                                        </div>
                                        <span class="badge bg-success rounded-pill">Published</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p class="text-muted mb-0">No published blogs yet. <a href="#" onclick="blogIntegration.openBlogManager()">Upload your first blog</a></p>'}
                </div>
            </div>
        `;
    },

    // Auto-refresh integration
    startAutoRefresh: () => {
        setInterval(() => {
            // Refresh blog stats in main dashboard
            const blogSummaryContainer = document.getElementById('blogSummaryContainer');
            if (blogSummaryContainer) {
                blogSummaryContainer.innerHTML = window.blogIntegration.generateBlogSummaryHTML();
            }
        }, 30000); // Refresh every 30 seconds
    }
};

// Auto-initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add blog summary to main dashboard if container exists
    const dashboardMain = document.querySelector('.dashboard-main, .main-content');
    if (dashboardMain && !document.getElementById('blogSummaryContainer')) {
        const blogContainer = document.createElement('div');
        blogContainer.id = 'blogSummaryContainer';
        blogContainer.className = 'mb-4';
        blogContainer.innerHTML = window.blogIntegration.generateBlogSummaryHTML();
        
        // Insert after existing cards
        const firstCard = dashboardMain.querySelector('.card');
        if (firstCard) {
            firstCard.parentNode.insertBefore(blogContainer, firstCard.nextSibling);
        } else {
            dashboardMain.appendChild(blogContainer);
        }
    }

    // Start auto-refresh
    window.blogIntegration.startAutoRefresh();
    
    // Initialize Blog Manager Pro
    initializeBlogManagerPro();
});

// Add CSS for integration
const integrationStyles = `
    <style>
        .blog-integration-card {
            background: linear-gradient(135deg, rgba(12, 60, 99, 0.1), rgba(28, 90, 141, 0.1));
            border: 1px solid rgba(12, 60, 99, 0.2);
            border-radius: 12px;
            transition: all 0.3s ease;
        }
        
        .blog-integration-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(12, 60, 99, 0.15);
        }
        
        .blog-stat-item {
            padding: 1rem;
            text-align: center;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.5);
            margin: 0.25rem;
        }
        
        .blog-quick-action {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, #0c3c63, #1c5a8d);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
        }
        
        .blog-quick-action:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(12, 60, 99, 0.3);
            color: white;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', integrationStyles);
