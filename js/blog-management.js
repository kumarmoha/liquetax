/**
 * Blog Management Functionality
 * Handles blog creation, editing, and management
 */

/**
 * Initialize blog management
 */
function initializeBlogManagement() {
    console.log('Initializing blog management...');
    
    // Set up blog form handler
    setupBlogForm();
    
    // Set up file drop zone
    setupFileDropZone();
    
    // Load existing blog posts
    loadBlogPosts();
    
    // Load draft if available
    loadBlogDraft();
}

/**
 * Initialize blog section
 */
function initializeBlogSection() {
    console.log('Initializing blog section...');
    loadBlogPosts();
}

/**
 * Setup blog form
 */
function setupBlogForm() {
    const blogForm = document.getElementById('blogForm');
    if (blogForm) {
        blogForm.addEventListener('submit', handleBlogSubmit);
        console.log('Blog form handler set up');
    }
}

/**
 * Handle blog form submission
 */
function handleBlogSubmit(event) {
    event.preventDefault();
    
    console.log('Handling blog form submission...');
    
    // Get form data
    const title = document.getElementById('blogTitle')?.value?.trim();
    const metaDescription = document.getElementById('blogMetaDescription')?.value?.trim();
    const tags = document.getElementById('blogTags')?.value?.trim();
    
    // Get content from Quill editor
    let content = '';
    if (window.dashboardCore?.quillEditor) {
        content = window.dashboardCore.quillEditor.root.innerHTML;
        // Check if content is just empty paragraphs
        const textContent = window.dashboardCore.quillEditor.getText().trim();
        if (!textContent) {
            content = '';
        }
    } else {
        const editor = document.getElementById('editor');
        if (editor) {
            content = editor.innerHTML || editor.value || '';
        }
    }
    
    // Validate required fields
    if (!title) {
        showNotification('Please enter a blog title', 'error');
        document.getElementById('blogTitle')?.focus();
        return;
    }
    
    if (!content || content === '<p><br></p>') {
        showNotification('Please enter blog content', 'error');
        return;
    }
    
    // Check if we're editing an existing post
    const editingId = document.getElementById('blogForm').getAttribute('data-editing');
    
    if (editingId) {
        updateBlogPost(editingId, title, metaDescription, tags, content);
    } else {
        createNewBlogPost(title, metaDescription, tags, content);
    }
}

/**
 * Create new blog post
 */
function createNewBlogPost(title, metaDescription, tags, content) {
    const blogPost = {
        id: 'blog_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        title: title,
        meta_description: metaDescription || `Learn about ${title.toLowerCase()} with our comprehensive guide.`,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        content: content,
        date: new Date().toISOString(),
        status: 'published',
        author: window.dashboardCore?.currentUser || 'Admin',
        source: 'editor'
    };
    
    // Get existing posts
    const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Add new post to the beginning
    existingPosts.unshift(blogPost);
    
    // Save to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(existingPosts));
    
    // Clear the form
    clearBlogForm();
    
    // Clear draft
    localStorage.removeItem('blogDraft');
    
    // Update blog list
    loadBlogPosts();
    
    // Generate HTML file
    generateBlogHTML(blogPost);
    
    showNotification('Blog post created successfully!', 'success');
    
    console.log('New blog post created:', blogPost);
}

/**
 * Update existing blog post
 */
function updateBlogPost(postId, title, metaDescription, tags, content) {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
        // Update the post
        posts[postIndex] = {
            ...posts[postIndex],
            title: title,
            meta_description: metaDescription || posts[postIndex].meta_description,
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : posts[postIndex].tags,
            content: content,
            lastModified: new Date().toISOString()
        };
        
        // Save back to localStorage
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        
        // Clear editing state
        document.getElementById('blogForm').removeAttribute('data-editing');
        
        // Clear the form
        clearBlogForm();
        
        // Update blog list
        loadBlogPosts();
        
        // Generate updated HTML file
        generateBlogHTML(posts[postIndex]);
        
        showNotification('Blog post updated successfully!', 'success');
        
        console.log('Blog post updated:', posts[postIndex]);
    }
}

/**
 * Clear blog form
 */
function clearBlogForm() {
    document.getElementById('blogTitle').value = '';
    document.getElementById('blogMetaDescription').value = '';
    document.getElementById('blogTags').value = '';
    
    if (window.dashboardCore?.quillEditor) {
        window.dashboardCore.quillEditor.setContents([]);
    } else {
        const editor = document.getElementById('editor');
        if (editor) {
            editor.innerHTML = '';
        }
    }
    
    // Remove editing state
    document.getElementById('blogForm').removeAttribute('data-editing');
    
    // Update button text
    const submitBtn = document.querySelector('#blogForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save me-1"></i> Save Blog Post';
    }
}

/**
 * Load blog posts and update UI
 */
function loadBlogPosts() {
    const blogListContainer = document.getElementById('blogList');
    if (!blogListContainer) return;
    
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    if (posts.length === 0) {
        blogListContainer.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
                <h6 class="text-muted">No blog posts yet</h6>
                <p class="text-muted small">Create your first blog post using the form above</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="list-group list-group-flush">';
    
    posts.slice(0, 10).forEach(post => {
        const date = new Date(post.date).toLocaleDateString();
        const time = new Date(post.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const source = post.source === 'file-import' ? 
            '<i class="fas fa-file-import text-info" title="Imported from file"></i>' : 
            '<i class="fas fa-edit text-primary" title="Created in editor"></i>';
        
        const tagsHtml = post.tags.slice(0, 3).map(tag => 
            `<span class="badge bg-secondary me-1">${tag}</span>`
        ).join('');
        
        html += `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${post.title}</h6>
                        <p class="mb-1 text-muted small">${post.meta_description || 'No description'}</p>
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                ${tagsHtml}
                            </div>
                            <small class="text-muted">${date} ${time} ${source}</small>
                        </div>
                    </div>
                    <div class="ms-3">
                        <div class="btn-group-vertical btn-group-sm">
                            <button class="btn btn-outline-primary btn-sm" onclick="editBlogPost('${post.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-success btn-sm" onclick="previewBlogPost('${post.id}')" title="Preview">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteBlogPost('${post.id}')" title="Delete">
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
                <br>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="showAllPosts()">
                    Show All Posts
                </button>
            </div>
        `;
    }
    
    blogListContainer.innerHTML = html;
    
    console.log(`Loaded ${posts.length} blog posts`);
}

/**
 * Edit blog post
 */
function editBlogPost(postId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        // Fill form with post data
        document.getElementById('blogTitle').value = post.title;
        document.getElementById('blogMetaDescription').value = post.meta_description || '';
        document.getElementById('blogTags').value = post.tags.join(', ');
        
        // Set content in editor
        if (window.dashboardCore?.quillEditor) {
            window.dashboardCore.quillEditor.root.innerHTML = post.content;
        } else {
            const editor = document.getElementById('editor');
            if (editor) {
                editor.innerHTML = post.content;
            }
        }
        
        // Set editing state
        document.getElementById('blogForm').setAttribute('data-editing', postId);
        
        // Update button text
        const submitBtn = document.querySelector('#blogForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save me-1"></i> Update Blog Post';
        }
        
        // Scroll to form
        document.getElementById('blogForm').scrollIntoView({ behavior: 'smooth' });
        
        showNotification('Blog post loaded for editing', 'info');
    }
}

/**
 * Preview blog post
 */
function previewBlogPost(postId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        // Create preview modal
        const modalHTML = `
            <div class="modal fade" id="previewModal" tabindex="-1" aria-labelledby="previewModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="previewModalLabel">Blog Preview</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <article>
                                <header class="mb-4">
                                    <h1>${post.title}</h1>
                                    <p class="text-muted">Published on ${new Date(post.date).toLocaleDateString()}</p>
                                    <div class="mb-3">
                                        ${post.tags.map(tag => `<span class="badge bg-primary me-1">${tag}</span>`).join('')}
                                    </div>
                                </header>
                                <div class="content">
                                    ${post.content}
                                </div>
                            </article>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="downloadBlogHTML('${post.id}')">
                                <i class="fas fa-download me-1"></i> Download HTML
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('previewModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('previewModal'));
        modal.show();
    }
}

/**
 * Delete blog post
 */
function deleteBlogPost(postId) {
    if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const filteredPosts = posts.filter(p => p.id !== postId);
        
        localStorage.setItem('blogPosts', JSON.stringify(filteredPosts));
        loadBlogPosts();
        
        showNotification('Blog post deleted successfully', 'success');
        
        console.log('Blog post deleted:', postId);
    }
}

/**
 * Generate HTML file for blog post
 */
function generateBlogHTML(blogPost) {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${blogPost.title} - Liquetax</title>
    <meta name="description" content="${blogPost.meta_description || blogPost.title}">
    <meta name="keywords" content="${blogPost.tags.join(', ')}">
    <meta name="author" content="${blogPost.author || 'Liquetax'}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 800px; }
        .content img { max-width: 100%; height: auto; }
        .content blockquote { border-left: 4px solid #007bff; padding-left: 1rem; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="container mt-5">
        <article>
            <header class="mb-4">
                <h1 class="display-4">${blogPost.title}</h1>
                <p class="text-muted">Published on ${new Date(blogPost.date).toLocaleDateString()} by ${blogPost.author || 'Liquetax'}</p>
                ${blogPost.meta_description ? `<p class="lead">${blogPost.meta_description}</p>` : ''}
                <div class="mb-3">
                    ${blogPost.tags.map(tag => `<span class="badge bg-primary me-1">${tag}</span>`).join('')}
                </div>
                <hr>
            </header>
            <div class="content">
                ${blogPost.content}
            </div>
            <footer class="mt-5 pt-4 border-top">
                <p class="text-muted">© ${new Date().getFullYear()} Liquetax. All rights reserved.</p>
            </footer>
        </article>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

    downloadFile(htmlContent, `${blogPost.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`, 'text/html');
}

/**
 * Download blog HTML
 */
function downloadBlogHTML(postId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        generateBlogHTML(post);
    }
}

/**
 * Download file
 */
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`${filename} downloaded successfully!`, 'success');
}

/**
 * Setup file drop zone
 */
function setupFileDropZone() {
    const dropZone = document.getElementById('blogDropZone');
    if (!dropZone) return;
    
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('border-primary', 'bg-light');
    });
    
    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('border-primary', 'bg-light');
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('border-primary', 'bg-light');
        
        const files = e.dataTransfer.files;
        handleFileImport(files);
    });
    
    dropZone.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.html,.htm';
        input.multiple = true;
        input.onchange = function(e) {
            handleFileImport(e.target.files);
        };
        input.click();
    });
}

/**
 * Handle file import
 */
function handleFileImport(files) {
    if (files.length === 0) return;
    
    showNotification(`Importing ${files.length} file(s)...`, 'info');
    
    Array.from(files).forEach(file => {
        if (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                importHTMLContent(file.name, e.target.result);
            };
            reader.readAsText(file);
        }
    });
}

/**
 * Import HTML content
 */
function importHTMLContent(filename, htmlContent) {
    // Extract title from filename
    const title = filename.replace(/\.(html|htm)$/i, '').replace(/[_-]/g, ' ');
    
    // Try to extract content from HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extract meta description
    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    // Extract keywords as tags
    const keywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
    const tags = keywords ? keywords.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    // Extract main content (try different selectors)
    let content = '';
    const contentSelectors = ['main', 'article', '.content', '.post-content', 'body'];
    
    for (const selector of contentSelectors) {
        const element = doc.querySelector(selector);
        if (element) {
            content = element.innerHTML;
            break;
        }
    }
    
    // If no content found, use body content
    if (!content) {
        content = doc.body?.innerHTML || htmlContent;
    }
    
    // Create blog post
    const blogPost = {
        id: 'blog_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        title: title,
        meta_description: metaDesc,
        tags: tags,
        content: content,
        date: new Date().toISOString(),
        status: 'published',
        author: window.dashboardCore?.currentUser || 'Admin',
        source: 'file-import',
        originalFilename: filename
    };
    
    // Add to existing posts
    const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Check if already exists
    const existingPost = existingPosts.find(post => post.title === title);
    if (existingPost) {
        showNotification(`Blog post "${title}" already exists`, 'warning');
        return;
    }
    
    existingPosts.unshift(blogPost);
    localStorage.setItem('blogPosts', JSON.stringify(existingPosts));
    
    // Update UI
    loadBlogPosts();
    
    showNotification(`Blog post "${title}" imported successfully!`, 'success');
}

/**
 * Load blog draft
 */
function loadBlogDraft() {
    const draft = localStorage.getItem('blogDraft');
    if (draft) {
        try {
            const draftData = JSON.parse(draft);
            
            // Only load if form is empty
            const titleInput = document.getElementById('blogTitle');
            if (titleInput && !titleInput.value && draftData.title) {
                if (confirm('A draft was found. Would you like to load it?')) {
                    titleInput.value = draftData.title;
                    
                    const metaInput = document.getElementById('blogMetaDescription');
                    if (metaInput && draftData.metaDescription) {
                        metaInput.value = draftData.metaDescription;
                    }
                    
                    const tagsInput = document.getElementById('blogTags');
                    if (tagsInput && draftData.tags) {
                        tagsInput.value = draftData.tags;
                    }
                    
                    if (window.dashboardCore?.quillEditor && draftData.content) {
                        window.dashboardCore.quillEditor.root.innerHTML = draftData.content;
                    }
                    
                    showNotification('Draft loaded successfully', 'info');
                }
            }
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
}

/**
 * Show all posts
 */
function showAllPosts() {
    // This could open a modal or navigate to a dedicated page
    showNotification('Feature coming soon: View all posts', 'info');
}

// Export functions for global access
window.editBlogPost = editBlogPost;
window.deleteBlogPost = deleteBlogPost;
window.previewBlogPost = previewBlogPost;
window.downloadBlogHTML = downloadBlogHTML;
window.showAllPosts = showAllPosts;/**
 * Blog Management Functionality
 * Handles blog creation, editing, and management
 */

/**
 * Initialize blog management
 */
function initializeBlogManagement() {
    console.log('Initializing blog management...');
    
    // Set up blog form handler
    setupBlogForm();
    
    // Set up file drop zone
    setupFileDropZone();
    
    // Load existing blog posts
    loadBlogPosts();
    
    // Load draft if available
    loadBlogDraft();
}

/**
 * Initialize blog section
 */
function initializeBlogSection() {
    console.log('Initializing blog section...');
    loadBlogPosts();
}

/**
 * Setup blog form
 */
function setupBlogForm() {
    const blogForm = document.getElementById('blogForm');
    if (blogForm) {
        blogForm.addEventListener('submit', handleBlogSubmit);
        console.log('Blog form handler set up');
    }
}

/**
 * Handle blog form submission
 */
function handleBlogSubmit(event) {
    event.preventDefault();
    
    console.log('Handling blog form submission...');
    
    // Get form data
    const title = document.getElementById('blogTitle')?.value?.trim();
    const metaDescription = document.getElementById('blogMetaDescription')?.value?.trim();
    const tags = document.getElementById('blogTags')?.value?.trim();
    
    // Get content from Quill editor
    let content = '';
    if (window.dashboardCore?.quillEditor) {
        content = window.dashboardCore.quillEditor.root.innerHTML;
        // Check if content is just empty paragraphs
        const textContent = window.dashboardCore.quillEditor.getText().trim();
        if (!textContent) {
            content = '';
        }
    } else {
        const editor = document.getElementById('editor');
        if (editor) {
            content = editor.innerHTML || editor.value || '';
        }
    }
    
    // Validate required fields
    if (!title) {
        showNotification('Please enter a blog title', 'error');
        document.getElementById('blogTitle')?.focus();
        return;
    }
    
    if (!content || content === '<p><br></p>') {
        showNotification('Please enter blog content', 'error');
        return;
    }
    
    // Check if we're editing an existing post
    const editingId = document.getElementById('blogForm').getAttribute('data-editing');
    
    if (editingId) {
        updateBlogPost(editingId, title, metaDescription, tags, content);
    } else {
        createNewBlogPost(title, metaDescription, tags, content);
    }
}

/**
 * Create new blog post
 */
function createNewBlogPost(title, metaDescription, tags, content) {
    const blogPost = {
        id: 'blog_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        title: title,
        meta_description: metaDescription || `Learn about ${title.toLowerCase()} with our comprehensive guide.`,
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        content: content,
        date: new Date().toISOString(),
        status: 'published',
        author: window.dashboardCore?.currentUser || 'Admin',
        source: 'editor'
    };
    
    // Get existing posts
    const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Add new post to the beginning
    existingPosts.unshift(blogPost);
    
    // Save to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(existingPosts));
    
    // Clear the form
    clearBlogForm();
    
    // Clear draft
    localStorage.removeItem('blogDraft');
    
    // Update blog list
    loadBlogPosts();
    
    // Generate HTML file
    generateBlogHTML(blogPost);
    
    showNotification('Blog post created successfully!', 'success');
    
    console.log('New blog post created:', blogPost);
}

/**
 * Update existing blog post
 */
function updateBlogPost(postId, title, metaDescription, tags, content) {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
        // Update the post
        posts[postIndex] = {
            ...posts[postIndex],
            title: title,
            meta_description: metaDescription || posts[postIndex].meta_description,
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : posts[postIndex].tags,
            content: content,
            lastModified: new Date().toISOString()
        };
        
        // Save back to localStorage
        localStorage.setItem('blogPosts', JSON.stringify(posts));
        
        // Clear editing state
        document.getElementById('blogForm').removeAttribute('data-editing');
        
        // Clear the form
        clearBlogForm();
        
        // Update blog list
        loadBlogPosts();
        
        // Generate updated HTML file
        generateBlogHTML(posts[postIndex]);
        
        showNotification('Blog post updated successfully!', 'success');
        
        console.log('Blog post updated:', posts[postIndex]);
    }
}

/**
 * Clear blog form
 */
function clearBlogForm() {
    document.getElementById('blogTitle').value = '';
    document.getElementById('blogMetaDescription').value = '';
    document.getElementById('blogTags').value = '';
    
    if (window.dashboardCore?.quillEditor) {
        window.dashboardCore.quillEditor.setContents([]);
    } else {
        const editor = document.getElementById('editor');
        if (editor) {
            editor.innerHTML = '';
        }
    }
    
    // Remove editing state
    document.getElementById('blogForm').removeAttribute('data-editing');
    
    // Update button text
    const submitBtn = document.querySelector('#blogForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-save me-1"></i> Save Blog Post';
    }
}

/**
 * Load blog posts and update UI
 */
function loadBlogPosts() {
    const blogListContainer = document.getElementById('blogList');
    if (!blogListContainer) return;
    
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    if (posts.length === 0) {
        blogListContainer.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
                <h6 class="text-muted">No blog posts yet</h6>
                <p class="text-muted small">Create your first blog post using the form above</p>
            </div>
        `;
        return;
    }
    
    let html = '<div class="list-group list-group-flush">';
    
    posts.slice(0, 10).forEach(post => {
        const date = new Date(post.date).toLocaleDateString();
        const time = new Date(post.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        const source = post.source === 'file-import' ? 
            '<i class="fas fa-file-import text-info" title="Imported from file"></i>' : 
            '<i class="fas fa-edit text-primary" title="Created in editor"></i>';
        
        const tagsHtml = post.tags.slice(0, 3).map(tag => 
            `<span class="badge bg-secondary me-1">${tag}</span>`
        ).join('');
        
        html += `
            <div class="list-group-item">
                <div class="d-flex w-100 justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${post.title}</h6>
                        <p class="mb-1 text-muted small">${post.meta_description || 'No description'}</p>
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                ${tagsHtml}
                            </div>
                            <small class="text-muted">${date} ${time} ${source}</small>
                        </div>
                    </div>
                    <div class="ms-3">
                        <div class="btn-group-vertical btn-group-sm">
                            <button class="btn btn-outline-primary btn-sm" onclick="editBlogPost('${post.id}')" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-outline-success btn-sm" onclick="previewBlogPost('${post.id}')" title="Preview">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="deleteBlogPost('${post.id}')" title="Delete">
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
                <br>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="showAllPosts()">
                    Show All Posts
                </button>
            </div>
        `;
    }
    
    blogListContainer.innerHTML = html;
    
    console.log(`Loaded ${posts.length} blog posts`);
}

/**
 * Edit blog post
 */
function editBlogPost(postId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        // Fill form with post data
        document.getElementById('blogTitle').value = post.title;
        document.getElementById('blogMetaDescription').value = post.meta_description || '';
        document.getElementById('blogTags').value = post.tags.join(', ');
        
        // Set content in editor
        if (window.dashboardCore?.quillEditor) {
            window.dashboardCore.quillEditor.root.innerHTML = post.content;
        } else {
            const editor = document.getElementById('editor');
            if (editor) {
                editor.innerHTML = post.content;
            }
        }
        
        // Set editing state
        document.getElementById('blogForm').setAttribute('data-editing', postId);
        
        // Update button text
        const submitBtn = document.querySelector('#blogForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-save me-1"></i> Update Blog Post';
        }
        
        // Scroll to form
        document.getElementById('blogForm').scrollIntoView({ behavior: 'smooth' });
        
        showNotification('Blog post loaded for editing', 'info');
    }
}

/**
 * Preview blog post
 */
function previewBlogPost(postId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        // Create preview modal
        const modalHTML = `
            <div class="modal fade" id="previewModal" tabindex="-1" aria-labelledby="previewModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="previewModalLabel">Blog Preview</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <article>
                                <header class="mb-4">
                                    <h1>${post.title}</h1>
                                    <p class="text-muted">Published on ${new Date(post.date).toLocaleDateString()}</p>
                                    <div class="mb-3">
                                        ${post.tags.map(tag => `<span class="badge bg-primary me-1">${tag}</span>`).join('')}
                                    </div>
                                </header>
                                <div class="content">
                                    ${post.content}
                                </div>
                            </article>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="downloadBlogHTML('${post.id}')">
                                <i class="fas fa-download me-1"></i> Download HTML
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('previewModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('previewModal'));
        modal.show();
    }
}

/**
 * Delete blog post
 */
function deleteBlogPost(postId) {
    if (confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
        const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
        const filteredPosts = posts.filter(p => p.id !== postId);
        
        localStorage.setItem('blogPosts', JSON.stringify(filteredPosts));
        loadBlogPosts();
        
        showNotification('Blog post deleted successfully', 'success');
        
        console.log('Blog post deleted:', postId);
    }
}

/**
 * Generate HTML file for blog post
 */
function generateBlogHTML(blogPost) {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${blogPost.title} - Liquetax</title>
    <meta name="description" content="${blogPost.meta_description || blogPost.title}">
    <meta name="keywords" content="${blogPost.tags.join(', ')}">
    <meta name="author" content="${blogPost.author || 'Liquetax'}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 800px; }
        .content img { max-width: 100%; height: auto; }
        .content blockquote { border-left: 4px solid #007bff; padding-left: 1rem; margin: 1rem 0; }
    </style>
</head>
<body>
    <div class="container mt-5">
        <article>
            <header class="mb-4">
                <h1 class="display-4">${blogPost.title}</h1>
                <p class="text-muted">Published on ${new Date(blogPost.date).toLocaleDateString()} by ${blogPost.author || 'Liquetax'}</p>
                ${blogPost.meta_description ? `<p class="lead">${blogPost.meta_description}</p>` : ''}
                <div class="mb-3">
                    ${blogPost.tags.map(tag => `<span class="badge bg-primary me-1">${tag}</span>`).join('')}
                </div>
                <hr>
            </header>
            <div class="content">
                ${blogPost.content}
            </div>
            <footer class="mt-5 pt-4 border-top">
                <p class="text-muted">© ${new Date().getFullYear()} Liquetax. All rights reserved.</p>
            </footer>
        </article>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>`;

    downloadFile(htmlContent, `${blogPost.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.html`, 'text/html');
}

/**
 * Download blog HTML
 */
function downloadBlogHTML(postId) {
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        generateBlogHTML(post);
    }
}

/**
 * Download file
 */
function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification(`${filename} downloaded successfully!`, 'success');
}

/**
 * Setup file drop zone
 */
function setupFileDropZone() {
    const dropZone = document.getElementById('blogDropZone');
    if (!dropZone) return;
    
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('border-primary', 'bg-light');
    });
    
    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('border-primary', 'bg-light');
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('border-primary', 'bg-light');
        
        const files = e.dataTransfer.files;
        handleFileImport(files);
    });
    
    dropZone.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.html,.htm';
        input.multiple = true;
        input.onchange = function(e) {
            handleFileImport(e.target.files);
        };
        input.click();
    });
}

/**
 * Handle file import
 */
function handleFileImport(files) {
    if (files.length === 0) return;
    
    showNotification(`Importing ${files.length} file(s)...`, 'info');
    
    Array.from(files).forEach(file => {
        if (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.htm')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                importHTMLContent(file.name, e.target.result);
            };
            reader.readAsText(file);
        }
    });
}

/**
 * Import HTML content
 */
function importHTMLContent(filename, htmlContent) {
    // Extract title from filename
    const title = filename.replace(/\.(html|htm)$/i, '').replace(/[_-]/g, ' ');
    
    // Try to extract content from HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extract meta description
    const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    // Extract keywords as tags
    const keywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || '';
    const tags = keywords ? keywords.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    // Extract main content (try different selectors)
    let content = '';
    const contentSelectors = ['main', 'article', '.content', '.post-content', 'body'];
    
    for (const selector of contentSelectors) {
        const element = doc.querySelector(selector);
        if (element) {
            content = element.innerHTML;
            break;
        }
    }
    
    // If no content found, use body content
    if (!content) {
        content = doc.body?.innerHTML || htmlContent;
    }
    
    // Create blog post
    const blogPost = {
        id: 'blog_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        title: title,
        meta_description: metaDesc,
        tags: tags,
        content: content,
        date: new Date().toISOString(),
        status: 'published',
        author: window.dashboardCore?.currentUser || 'Admin',
        source: 'file-import',
        originalFilename: filename
    };
    
    // Add to existing posts
    const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Check if already exists
    const existingPost = existingPosts.find(post => post.title === title);
    if (existingPost) {
        showNotification(`Blog post "${title}" already exists`, 'warning');
        return;
    }
    
    existingPosts.unshift(blogPost);
    localStorage.setItem('blogPosts', JSON.stringify(existingPosts));
    
    // Update UI
    loadBlogPosts();
    
    showNotification(`Blog post "${title}" imported successfully!`, 'success');
}

/**
 * Load blog draft
 */
function loadBlogDraft() {
    const draft = localStorage.getItem('blogDraft');
    if (draft) {
        try {
            const draftData = JSON.parse(draft);
            
            // Only load if form is empty
            const titleInput = document.getElementById('blogTitle');
            if (titleInput && !titleInput.value && draftData.title) {
                if (confirm('A draft was found. Would you like to load it?')) {
                    titleInput.value = draftData.title;
                    
                    const metaInput = document.getElementById('blogMetaDescription');
                    if (metaInput && draftData.metaDescription) {
                        metaInput.value = draftData.metaDescription;
                    }
                    
                    const tagsInput = document.getElementById('blogTags');
                    if (tagsInput && draftData.tags) {
                        tagsInput.value = draftData.tags;
                    }
                    
                    if (window.dashboardCore?.quillEditor && draftData.content) {
                        window.dashboardCore.quillEditor.root.innerHTML = draftData.content;
                    }
                    
                    showNotification('Draft loaded successfully', 'info');
                }
            }
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
}

/**
 * Show all posts
 */
function showAllPosts() {
    // This could open a modal or navigate to a dedicated page
    showNotification('Feature coming soon: View all posts', 'info');
}

// Export functions for global access
window.editBlogPost = editBlogPost;
window.deleteBlogPost = deleteBlogPost;
window.previewBlogPost = previewBlogPost;
window.downloadBlogHTML = downloadBlogHTML;
window.showAllPosts = showAllPosts;