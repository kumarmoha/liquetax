/**
 * Blog Manager Pro - World-Class Blog Management System
 * Advanced JavaScript for blog upload, management, and real-time website updates
 */

class BlogManagerPro {
    constructor() {
        this.blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
        this.settings = JSON.parse(localStorage.getItem('blogSettings') || '{}');
        this.currentEditingBlog = null;
        this.analytics = JSON.parse(localStorage.getItem('blogAnalytics') || '{}');
        
        this.initializeSettings();
        this.initializeEventListeners();
        this.updateStatistics();
        this.refreshBlogList();
        this.updateTime();
        this.generateIndexHTML();
        
        // Update time every minute
        setInterval(() => this.updateTime(), 60000);
        
        console.log('Blog Manager Pro initialized successfully!');
    }

    initializeSettings() {
        const defaultSettings = {
            defaultStatus: 'draft',
            autoSEO: true,
            blogsPerPage: 3,
            darkMode: false
        };
        
        this.settings = { ...defaultSettings, ...this.settings };
        this.saveSettings();
        
        // Apply dark mode if enabled
        if (this.settings.darkMode) {
            document.body.classList.add('dark-mode');
            document.getElementById('themeIcon').className = 'fas fa-sun';
        }
    }

    initializeEventListeners() {
        // File input and drop zone
        const fileInput = document.getElementById('fileInput');
        const dropZone = document.getElementById('dropZone');

        fileInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files));

        // Drag and drop functionality
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            this.handleFileUpload(e.dataTransfer.files);
        });

        // Search and filter
        document.getElementById('searchBlogs').addEventListener('input', (e) => {
            this.filterBlogs();
        });

        document.getElementById('filterStatus').addEventListener('change', () => {
            this.filterBlogs();
        });

        document.getElementById('sortBy').addEventListener('change', () => {
            this.filterBlogs();
        });

        // Settings form
        document.getElementById('settingsForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettingsFromForm();
        });

        // Load settings into form
        this.loadSettingsIntoForm();
    }

    async handleFileUpload(files) {
        const fileArray = Array.from(files);
        const htmlFiles = fileArray.filter(file => 
            file.type === 'text/html' || file.name.toLowerCase().endsWith('.html') || file.name.toLowerCase().endsWith('.htm')
        );

        if (htmlFiles.length === 0) {
            this.showToast('Please select HTML files only', 'error');
            return;
        }

        // Show progress
        this.showUploadProgress(true);

        let processed = 0;
        const total = htmlFiles.length;

        for (const file of htmlFiles) {
            try {
                const blogData = await this.processHTMLFile(file);
                if (blogData) {
                    this.addBlog(blogData);
                }
                processed++;
                this.updateProgress((processed / total) * 100);
            } catch (error) {
                console.error('Error processing file:', file.name, error);
                this.showToast(`Error processing ${file.name}: ${error.message}`, 'error');
            }
        }

        // Hide progress and update UI
        setTimeout(() => {
            this.showUploadProgress(false);
            this.updateStatistics();
            this.refreshBlogList();
            this.generateIndexHTML();
            this.showToast(`Successfully processed ${processed} blog(s)!`, 'success');
        }, 500);
    }

    async processHTMLFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const htmlContent = e.target.result;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlContent, 'text/html');

                    // Extract metadata
                    const metadata = this.extractMetadata(doc, file.name);
                    
                    // Generate SEO tags if enabled
                    if (this.settings.autoSEO) {
                        metadata.seoTags = this.generateSEOTags(metadata);
                    }

                    // Store the processed content
                    metadata.htmlContent = htmlContent;
                    metadata.id = this.generateUniqueId();
                    metadata.uploadDate = new Date().toISOString();
                    metadata.status = this.settings.defaultStatus;
                    metadata.views = 0;

                    resolve(metadata);
                } catch (error) {
                    console.error('Error parsing HTML:', error);
                    resolve(null);
                }
            };
            reader.readAsText(file);
        });
    }

    extractMetadata(doc, filename) {
        // Extract title
        let title = doc.querySelector('title')?.textContent?.trim();
        if (!title) {
            title = doc.querySelector('h1')?.textContent?.trim();
        }
        if (!title) {
            title = filename.replace(/\.[^/.]+$/, ""); // Remove extension
        }

        // Extract summary/description
        let summary = doc.querySelector('meta[name="description"]')?.getAttribute('content');
        if (!summary) {
            // Get first paragraph
            const firstP = doc.querySelector('p');
            if (firstP) {
                summary = firstP.textContent.trim().substring(0, 200) + '...';
            }
        }

        // Extract image
        let image = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
        if (!image) {
            const firstImg = doc.querySelector('img');
            if (firstImg) {
                image = firstImg.getAttribute('src');
            }
        }

        // Extract date
        let date = doc.querySelector('meta[name="date"]')?.getAttribute('content');
        if (!date) {
            // Try to find date in various formats
            const dateRegex = /\d{4}-\d{2}-\d{2}/;
            const textContent = doc.body.textContent;
            const dateMatch = textContent.match(dateRegex);
            if (dateMatch) {
                date = dateMatch[0];
            } else {
                date = new Date().toISOString().split('T')[0];
            }
        }

        // Extract keywords/tags
        let keywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content');
        const tags = keywords ? keywords.split(',').map(k => k.trim()) : this.extractTagsFromContent(doc);

        return {
            title: title || 'Untitled Blog',
            summary: summary || 'No description available',
            image: image || './img/blog/default-blog.jpg',
            date: date,
            filename: filename,
            tags: tags,
            author: 'Liquetax Team',
            category: this.categorizeContent(doc),
            readTime: this.calculateReadTime(doc.body.textContent)
        };
    }

    extractTagsFromContent(doc) {
        const text = doc.body.textContent.toLowerCase();
        const commonTags = [
            'tax', 'gst', 'business', 'registration', 'company', 'startup',
            'itr', 'filing', 'compliance', 'legal', 'finance', 'accounting',
            'trademark', 'patent', 'license', 'export', 'import'
        ];
        
        return commonTags.filter(tag => text.includes(tag)).slice(0, 5);
    }

    categorizeContent(doc) {
        const text = doc.body.textContent.toLowerCase();
        
        if (text.includes('tax') || text.includes('itr') || text.includes('gst')) return 'Tax & Compliance';
        if (text.includes('company') || text.includes('registration') || text.includes('startup')) return 'Business Setup';
        if (text.includes('trademark') || text.includes('patent')) return 'Intellectual Property';
        if (text.includes('export') || text.includes('import')) return 'Import/Export';
        if (text.includes('legal') || text.includes('compliance')) return 'Legal';
        
        return 'General';
    }

    calculateReadTime(text) {
        const wordsPerMinute = 200;
        const wordCount = text.trim().split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} min read`;
    }

    generateSEOTags(metadata) {
        const siteUrl = 'https://liquetax.com';
        const blogUrl = `${siteUrl}/blog-detaile/${encodeURIComponent(metadata.filename)}`;
        
        return {
            title: metadata.title,
            description: metadata.summary,
            keywords: metadata.tags.join(', '),
            ogTitle: metadata.title,
            ogDescription: metadata.summary,
            ogImage: metadata.image,
            ogUrl: blogUrl,
            twitterTitle: metadata.title,
            twitterDescription: metadata.summary,
            twitterImage: metadata.image,
            canonical: blogUrl,
            jsonLd: {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": metadata.title,
                "description": metadata.summary,
                "image": metadata.image,
                "author": {
                    "@type": "Organization",
                    "name": "Liquetax"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Liquetax",
                    "logo": {
                        "@type": "ImageObject",
                        "url": `${siteUrl}/img/logo.png`
                    }
                },
                "datePublished": metadata.date,
                "dateModified": metadata.date,
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": blogUrl
                }
            }
        };
    }

    addBlog(blogData) {
        this.blogs.unshift(blogData); // Add to beginning
        this.saveBlogs();
        
        // Initialize analytics for new blog
        if (!this.analytics[blogData.id]) {
            this.analytics[blogData.id] = {
                views: 0,
                dailyViews: {},
                createdDate: new Date().toISOString()
            };
            this.saveAnalytics();
        }
    }

    updateStatistics() {
        const total = this.blogs.length;
        const published = this.blogs.filter(blog => blog.status === 'published').length;
        const drafts = this.blogs.filter(blog => blog.status === 'draft').length;
        const totalViews = Object.values(this.analytics).reduce((sum, data) => sum + (data.views || 0), 0);

        // Animate numbers
        this.animateCounter('totalBlogs', total);
        this.animateCounter('publishedBlogs', published);
        this.animateCounter('draftBlogs', drafts);
        this.animateCounter('totalViews', totalViews);
    }

    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        const currentValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const steps = 20;
        const increment = (targetValue - currentValue) / steps;
        
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const newValue = Math.round(currentValue + (increment * step));
            element.textContent = newValue;
            
            if (step >= steps) {
                element.textContent = targetValue;
                clearInterval(timer);
            }
        }, duration / steps);
    }

    refreshBlogList() {
        this.filterBlogs();
    }

    filterBlogs() {
        const searchTerm = document.getElementById('searchBlogs').value.toLowerCase();
        const statusFilter = document.getElementById('filterStatus').value;
        const sortBy = document.getElementById('sortBy').value;

        let filteredBlogs = this.blogs.filter(blog => {
            const matchesSearch = blog.title.toLowerCase().includes(searchTerm) ||
                                blog.summary.toLowerCase().includes(searchTerm) ||
                                blog.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            
            const matchesStatus = !statusFilter || blog.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });

        // Sort blogs
        filteredBlogs.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return new Date(b.uploadDate) - new Date(a.uploadDate);
            }
        });

        this.renderBlogList(filteredBlogs);
    }

    renderBlogList(blogs) {
        const blogList = document.getElementById('blogList');
        
        if (blogs.length === 0) {
            blogList.innerHTML = `
                <div class="col-12">
                    <div class="glass-card p-5 text-center">
                        <i class="fas fa-newspaper fa-3x text-muted mb-3"></i>
                        <h4 class="text-muted">No blogs found</h4>
                        <p class="text-muted">Upload some blog files or adjust your filters</p>
                    </div>
                </div>
            `;
            return;
        }

        blogList.innerHTML = blogs.map(blog => this.createBlogCard(blog)).join('');
    }

    createBlogCard(blog) {
        const analytics = this.analytics[blog.id] || { views: 0 };
        
        return `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="blog-card h-100 fade-in">
                    <div class="blog-status status-${blog.status}">${blog.status.toUpperCase()}</div>
                    
                    <div class="position-relative overflow-hidden" style="height: 200px;">
                        <img src="${blog.image}" alt="${blog.title}" 
                             class="w-100 h-100 object-fit-cover"
                             onerror="this.src='./img/blog/default-blog.jpg'">
                        <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-flex align-items-center justify-content-center opacity-0 hover-overlay">
                            <button class="btn btn-light btn-sm me-2" onclick="blogManager.previewBlog('${blog.id}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="blogManager.editBlog('${blog.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="p-4">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge bg-primary rounded-pill">${blog.category}</span>
                            <small class="text-muted">${analytics.views} views</small>
                        </div>
                        
                        <h5 class="mb-2 fw-bold text-truncate" title="${blog.title}">${blog.title}</h5>
                        
                        <p class="text-muted small mb-3" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                            ${blog.summary}
                        </p>
                        
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <small class="text-muted">
                                <i class="fas fa-calendar me-1"></i>${this.formatDate(blog.date)}
                            </small>
                            <small class="text-muted">
                                <i class="fas fa-clock me-1"></i>${blog.readTime}
                            </small>
                        </div>
                        
                        <div class="d-flex flex-wrap gap-1 mb-3">
                            ${blog.tags.slice(0, 3).map(tag => 
                                `<span class="badge bg-light text-dark rounded-pill">${tag}</span>`
                            ).join('')}
                            ${blog.tags.length > 3 ? `<span class="badge bg-light text-dark rounded-pill">+${blog.tags.length - 3}</span>` : ''}
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-primary btn-sm flex-fill" onclick="blogManager.previewBlog('${blog.id}')">
                                <i class="fas fa-eye me-1"></i>Preview
                            </button>
                            <button class="btn btn-primary btn-sm flex-fill" onclick="blogManager.editBlog('${blog.id}')">
                                <i class="fas fa-edit me-1"></i>Edit
                            </button>
                            <div class="dropdown">
                                <button class="btn btn-outline-secondary btn-sm" data-bs-toggle="dropdown">
                                    <i class="fas fa-ellipsis-v"></i>
                                </button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#" onclick="blogManager.toggleStatus('${blog.id}')">
                                        <i class="fas fa-toggle-${blog.status === 'published' ? 'off' : 'on'} me-2"></i>
                                        ${blog.status === 'published' ? 'Unpublish' : 'Publish'}
                                    </a></li>
                                    <li><a class="dropdown-item" href="#" onclick="blogManager.duplicateBlog('${blog.id}')">
                                        <i class="fas fa-copy me-2"></i>Duplicate
                                    </a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item text-danger" href="#" onclick="blogManager.deleteBlog('${blog.id}')">
                                        <i class="fas fa-trash me-2"></i>Delete
                                    </a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    previewBlog(blogId) {
        const blog = this.blogs.find(b => b.id === blogId);
        if (!blog) return;

        // Create a blob URL for the HTML content
        const blob = new Blob([blog.htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // Update modal and show
        document.getElementById('previewFrame').src = url;
        const modal = new bootstrap.Modal(document.getElementById('previewModal'));
        modal.show();

        // Store current blog for potential publishing
        this.currentEditingBlog = blog;

        // Clean up URL after modal is hidden
        document.getElementById('previewModal').addEventListener('hidden.bs.modal', () => {
            URL.revokeObjectURL(url);
        }, { once: true });
    }

    editBlog(blogId) {
        const blog = this.blogs.find(b => b.id === blogId);
        if (!blog) return;

        this.currentEditingBlog = blog;

        // Populate form
        document.getElementById('editTitle').value = blog.title;
        document.getElementById('editSummary').value = blog.summary;
        document.getElementById('editImage').value = blog.image;
        document.getElementById('editDate').value = blog.date;
        document.getElementById('editStatus').value = blog.status;
        document.getElementById('editTags').value = blog.tags.join(', ');

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editModal'));
        modal.show();
    }

    saveBlogChanges() {
        if (!this.currentEditingBlog) return;

        const blogIndex = this.blogs.findIndex(b => b.id === this.currentEditingBlog.id);
        if (blogIndex === -1) return;

        // Update blog data
        this.blogs[blogIndex] = {
            ...this.blogs[blogIndex],
            title: document.getElementById('editTitle').value,
            summary: document.getElementById('editSummary').value,
            image: document.getElementById('editImage').value,
            date: document.getElementById('editDate').value,
            status: document.getElementById('editStatus').value,
            tags: document.getElementById('editTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
            lastModified: new Date().toISOString()
        };

        this.saveBlogs();
        this.refreshBlogList();
        this.updateStatistics();
        this.generateIndexHTML();

        // Hide modal
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        this.showToast('Blog updated successfully!', 'success');
    }

    toggleStatus(blogId) {
        const blogIndex = this.blogs.findIndex(b => b.id === blogId);
        if (blogIndex === -1) return;

        const currentStatus = this.blogs[blogIndex].status;
        this.blogs[blogIndex].status = currentStatus === 'published' ? 'draft' : 'published';
        this.blogs[blogIndex].lastModified = new Date().toISOString();

        this.saveBlogs();
        this.refreshBlogList();
        this.updateStatistics();
        this.generateIndexHTML();

        this.showToast(`Blog ${this.blogs[blogIndex].status === 'published' ? 'published' : 'unpublished'} successfully!`, 'success');
    }

    duplicateBlog(blogId) {
        const blog = this.blogs.find(b => b.id === blogId);
        if (!blog) return;

        const duplicatedBlog = {
            ...blog,
            id: this.generateUniqueId(),
            title: blog.title + ' (Copy)',
            status: 'draft',
            uploadDate: new Date().toISOString(),
            lastModified: new Date().toISOString()
        };

        this.addBlog(duplicatedBlog);
        this.refreshBlogList();
        this.updateStatistics();
        this.showToast('Blog duplicated successfully!', 'success');
    }

    deleteBlog(blogId) {
        if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
            return;
        }

        const blogIndex = this.blogs.findIndex(b => b.id === blogId);
        if (blogIndex === -1) return;

        // Remove from blogs array
        this.blogs.splice(blogIndex, 1);
        
        // Remove analytics data
        delete this.analytics[blogId];

        this.saveBlogs();
        this.saveAnalytics();
        this.refreshBlogList();
        this.updateStatistics();
        this.generateIndexHTML();

        this.showToast('Blog deleted successfully!', 'success');
    }

    generateIndexHTML() {
        const publishedBlogs = this.blogs
            .filter(blog => blog.status === 'published')
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, parseInt(this.settings.blogsPerPage) || 3);

        if (publishedBlogs.length === 0) {
            document.getElementById('generatedHTML').textContent = '<!-- No published blogs found -->';
            return;
        }

        const blogHTML = `
<section class="latest-blogs py-5" id="latest-blogs">
    <h2 class="text-center mb-4">Latest Blog Posts</h2>
    <div class="container">
        <div class="row">
${publishedBlogs.map(blog => `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img alt="${blog.title}" class="card-img-top" src="${blog.image}" 
                         onerror="this.src='./img/blog/default-blog.jpg'" loading="lazy"/>
                    <div class="card-body">
                        <h5 class="card-title">${blog.title}</h5>
                        <p class="card-text">${blog.summary}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <small class="text-muted">${this.formatDate(blog.date)}</small>
                            <a class="btn btn-primary" href="./blog-detaile/${encodeURIComponent(blog.filename)}">Read More</a>
                        </div>
                    </div>
                </div>
            </div>`).join('')}
        </div>
        <div class="row mt-4">
            <div class="col-12 text-center">
                <a href="./blog.html" class="btn btn-outline-primary">View All Blog Posts</a>
            </div>
        </div>
    </div>
</section>
        `.trim();

        document.getElementById('generatedHTML').textContent = blogHTML;
        this.currentGeneratedHTML = blogHTML;
        this.showToast('Index HTML generated! You can now auto-update your website.', 'info');
    }

    // Direct file modification methods
    async updateIndexFileDirectly() {
        try {
            // Method 1: File System Access API (Modern browsers)
            if ('showOpenFilePicker' in window) {
                await this.updateIndexWithFileSystemAPI();
            } else {
                // Fallback: Download updated file
                this.downloadUpdatedIndexFile();
            }
        } catch (error) {
            console.error('Error updating index file:', error);
            this.showToast('Direct update failed. Please use the copy-paste method.', 'error');
        }
    }

    async updateIndexWithFileSystemAPI() {
        try {
            // Request file access
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'HTML files',
                    accept: { 'text/html': ['.html', '.htm'] }
                }],
                suggestedName: 'index.html'
            });

            // Read current file
            const file = await fileHandle.getFile();
            let content = await file.text();

            // Update the blog section
            const updatedContent = this.replaceBlogSection(content);

            // Write back to file
            const writable = await fileHandle.createWritable();
            await writable.write(updatedContent);
            await writable.close();

            this.showToast('Index.html updated successfully! 🎉', 'success');
            
            // Track successful auto-update
            this.analytics.autoUpdates = (this.analytics.autoUpdates || 0) + 1;
            this.saveAnalytics();

        } catch (error) {
            if (error.name === 'AbortError') {
                this.showToast('File selection cancelled', 'info');
            } else {
                throw error;
            }
        }
    }

    downloadUpdatedIndexFile() {
        // Create a template index.html with updated blog section
        const indexTemplate = this.generateCompleteIndexHTML();
        
        const blob = new Blob([indexTemplate], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `index-updated-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Updated index.html downloaded! Replace your current index.html file.', 'success');
    }

    async loadCurrentIndexFile() {
        try {
            // Try to fetch the current index.html
            const response = await fetch('../index.html');
            if (response.ok) {
                const content = await response.text();
                this.currentIndexContent = content;
                return content;
            }
        } catch (error) {
            console.log('Could not fetch current index.html, using template');
        }
        
        // Fallback to template
        return this.generateCompleteIndexHTML();
    }

    replaceBlogSection(htmlContent) {
        // Find and replace the blog section
        const blogSectionRegex = /<section[^>]*class="[^"]*latest-blogs[^"]*"[^>]*>[\s\S]*?<\/section>/i;
        
        if (blogSectionRegex.test(htmlContent)) {
            return htmlContent.replace(blogSectionRegex, this.currentGeneratedHTML);
        } else {
            // If no blog section found, add it before the footer or at the end of main content
            const footerRegex = /<footer/i;
            const bodyEndRegex = /<\/body>/i;
            
            const newSection = '\n' + this.currentGeneratedHTML + '\n';
            
            if (footerRegex.test(htmlContent)) {
                return htmlContent.replace(footerRegex, newSection + '<footer');
            } else if (bodyEndRegex.test(htmlContent)) {
                return htmlContent.replace(bodyEndRegex, newSection + '</body>');
            } else {
                return htmlContent + newSection;
            }
        }
    }

    generateCompleteIndexHTML() {
        // Generate a complete index.html file with the blog section
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liquetax: Grow Your Business & Optimize Taxes from Startup to Success</title>
    <meta name="description" content="Liquetax - Your trusted partner for business setup, tax optimization, compliance, and corporate solutions in India. Expert consultation for startups, GST, trademark registration, and import-export services.">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .hero-section { background: linear-gradient(to right, #0c3c63, #1c5a8d); color: white; padding: 100px 0; text-align: center; }
        .hero-section h1 { font-size: 3rem; font-weight: 700; margin-bottom: 20px; }
        .hero-section p { font-size: 1.25rem; max-width: 800px; margin: 0 auto 30px; }
        .btn-success { background: #28a745; border: none; padding: 15px 30px; font-size: 1.2rem; border-radius: 8px; }
    </style>
</head>
<body>
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <h1>Business Incorporation to Revenue Generation</h1>
            <p>Liquetax supports you at every stage – from legal registration and compliance to tax filings, branding, and unlocking growth opportunities.</p>
            <a class="btn btn-success btn-lg" href="https://wa.me/918902984671">📲 Schedule a Free Consultation</a>
        </div>
    </section>

    <!-- Blog Section (Auto-Updated by Blog Manager Pro) -->
    ${this.currentGeneratedHTML || '<!-- Blog section will be automatically updated -->'}

    <!-- Footer -->
    <footer class="bg-dark text-light py-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <h5>Liquetax</h5>
                    <p>Your trusted partner for business growth and tax optimization.</p>
                </div>
                <div class="col-md-6">
                    <h5>Contact Us</h5>
                    <p>Email: info@liquetax.com<br>Phone: +91 8902984671</p>
                </div>
            </div>
            <hr>
            <div class="text-center">
                <p>&copy; 2024 Liquetax. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;
    }

    // GitHub Pages integration (if using GitHub)
    async updateViaGitHub() {
        try {
            // This would require GitHub token and API integration
            // For now, we'll show a guide for GitHub users
            this.showGitHubUpdateGuide();
        } catch (error) {
            console.error('GitHub update failed:', error);
            this.showToast('GitHub integration not configured', 'error');
        }
    }

    showGitHubUpdateGuide() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fab fa-github me-2"></i>GitHub Integration Guide
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>Quick Setup for GitHub Pages Users</strong>
                        </div>
                        
                        <h6>Method 1: Direct File Update (Recommended)</h6>
                        <ol>
                            <li>Click "Update Index File" button above</li>
                            <li>Select your local index.html file</li>
                            <li>File will be automatically updated</li>
                            <li>Commit and push to GitHub</li>
                        </ol>
                        
                        <h6>Method 2: Copy-Paste Method</h6>
                        <ol>
                            <li>Copy the generated HTML code</li>
                            <li>Open your index.html in editor</li>
                            <li>Replace the blog section</li>
                            <li>Commit and push to GitHub</li>
                        </ol>
                        
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            <strong>Future Enhancement:</strong> Direct GitHub API integration coming soon!
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <a href="https://docs.github.com/pages" target="_blank" class="btn btn-primary">
                            <i class="fab fa-github me-2"></i>GitHub Pages Docs
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    // FTP/SFTP integration for advanced users
    showFTPGuide() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-server me-2"></i>FTP/SFTP Integration Guide
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>Advanced Integration Options</strong>
                        </div>
                        
                        <h6>Option 1: FileZilla Integration</h6>
                        <ol>
                            <li>Download updated index.html using "Download Updated File" button</li>
                            <li>Open FileZilla and connect to your server</li>
                            <li>Upload the new index.html file</li>
                            <li>Your website is now updated!</li>
                        </ol>
                        
                        <h6>Option 2: cPanel File Manager</h6>
                        <ol>
                            <li>Copy the generated HTML code</li>
                            <li>Login to your hosting cPanel</li>
                            <li>Open File Manager → public_html</li>
                            <li>Edit index.html and paste the new blog section</li>
                        </ol>
                        
                        <div class="bg-light p-3 rounded">
                            <h6>Automation Script (Advanced)</h6>
                            <p>For developers who want full automation, we can provide a custom script that:</p>
                            <ul>
                                <li>Monitors the dashboard for changes</li>
                                <li>Automatically uploads via SFTP</li>
                                <li>Sends notifications on completion</li>
                            </ul>
                            <small class="text-muted">Contact us for custom automation setup.</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success" onclick="blogManager.downloadUpdatedIndexFile()">
                            <i class="fas fa-download me-2"></i>Download Updated File
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        
        modal.addEventListener('hidden.bs.modal', () => {
            document.body.removeChild(modal);
        });
    }

    // Utility functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    generateUniqueId() {
        return 'blog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showUploadProgress(show) {
        const progressDiv = document.getElementById('uploadProgress');
        progressDiv.style.display = show ? 'block' : 'none';
        
        if (!show) {
            this.updateProgress(0);
        }
    }

    updateProgress(percentage) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        progressBar.style.width = percentage + '%';
        progressText.textContent = Math.round(percentage) + '%';
    }

    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('currentTime').textContent = timeString;
    }

    showToast(message, type = 'info') {
        const toast = Toastify({
            text: message,
            duration: 3000,
            gravity: "top",
            position: "right",
            className: `toast-${type}`,
            stopOnFocus: true
        });
        toast.showToast();
    }

    // Settings management
    loadSettingsIntoForm() {
        document.getElementById('defaultStatus').value = this.settings.defaultStatus;
        document.getElementById('autoSEO').checked = this.settings.autoSEO;
        document.getElementById('blogsPerPage').value = this.settings.blogsPerPage;
    }

    saveSettingsFromForm() {
        this.settings.defaultStatus = document.getElementById('defaultStatus').value;
        this.settings.autoSEO = document.getElementById('autoSEO').checked;
        this.settings.blogsPerPage = parseInt(document.getElementById('blogsPerPage').value);
        
        this.saveSettings();
        this.showToast('Settings saved successfully!', 'success');
    }

    // Data persistence
    saveBlogs() {
        localStorage.setItem('blogs', JSON.stringify(this.blogs));
    }

    saveSettings() {
        localStorage.setItem('blogSettings', JSON.stringify(this.settings));
    }

    saveAnalytics() {
        localStorage.setItem('blogAnalytics', JSON.stringify(this.analytics));
    }

    // Export/Import functionality
    exportBlogs() {
        const data = {
            blogs: this.blogs,
            settings: this.settings,
            analytics: this.analytics,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `blog-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Blog data exported successfully!', 'success');
    }

    importBlogs(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (confirm('This will replace all existing blog data. Continue?')) {
                    this.blogs = data.blogs || [];
                    this.settings = { ...this.settings, ...(data.settings || {}) };
                    this.analytics = data.analytics || {};
                    
                    this.saveBlogs();
                    this.saveSettings();
                    this.saveAnalytics();
                    
                    this.refreshBlogList();
                    this.updateStatistics();
                    this.loadSettingsIntoForm();
                    
                    this.showToast('Blog data imported successfully!', 'success');
                }
            } catch (error) {
                this.showToast('Error importing data: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset input
        input.value = '';
    }
}

// Global functions
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('themeIcon');
    const isDark = document.body.classList.contains('dark-mode');
    
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    blogManager.settings.darkMode = isDark;
    blogManager.saveSettings();
}

function refreshBlogList() {
    blogManager.refreshBlogList();
}

function generateIndexHTML() {
    blogManager.generateIndexHTML();
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        blogManager.showToast('HTML code copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Could not copy text: ', err);
        blogManager.showToast('Failed to copy to clipboard', 'error');
    });
}

function exportBlogs() {
    blogManager.exportBlogs();
}

function importBlogs(input) {
    blogManager.importBlogs(input);
}

function publishBlog() {
    if (blogManager.currentEditingBlog) {
        blogManager.toggleStatus(blogManager.currentEditingBlog.id);
        bootstrap.Modal.getInstance(document.getElementById('previewModal')).hide();
    }
}

function saveBlogChanges() {
    blogManager.saveBlogChanges();
}

// New direct update functions
function updateIndexFileDirectly() {
    blogManager.updateIndexFileDirectly();
}

function downloadUpdatedIndexFile() {
    blogManager.downloadUpdatedIndexFile();
}

function showGitHubUpdateGuide() {
    blogManager.showGitHubUpdateGuide();
}

function showFTPGuide() {
    blogManager.showFTPGuide();
}

// Initialize the blog manager when the page loads
let blogManager;
document.addEventListener('DOMContentLoaded', () => {
    blogManager = new BlogManagerPro();
});

// Add custom styles for hover effects
const style = document.createElement('style');
style.textContent = `
    .blog-card .hover-overlay {
        transition: opacity 0.3s ease;
    }
    
    .blog-card:hover .hover-overlay {
        opacity: 1 !important;
    }
    
    .object-fit-cover {
        object-fit: cover;
    }
`;
document.head.appendChild(style);
