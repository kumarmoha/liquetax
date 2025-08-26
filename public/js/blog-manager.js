/**
 * Blog Management Module - Handles all client-side blog functionality
 */
class BlogManager {
  constructor() {
    this.posts = [];
    this.categories = [];
    this.tags = [];
    this.currentPost = null;
    this.editor = null;
    this.initialized = false;
    this.isPreviewMode = false;
    
    // Quill editor configuration
    this.quillConfig = {
      modules: {
        toolbar: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'color': [] }, { 'background': [] }],
          ['blockquote', 'code-block'],
          ['link', 'image', 'video'],
          [{ 'align': [] }],
          ['clean']
        ],
        imageUpload: {
          url: '/api/blog/upload',
          method: 'POST',
          name: 'image',
          withCredentials: false,
          headers: {},
          callbackOK: (serverResponse, next) => {
            next(serverResponse.url);
          },
          callbackKO: (serverError) => {
            console.error('Image upload error:', serverError);
            Toastify({
              text: 'Failed to upload image',
              duration: 3000,
              close: true,
              gravity: 'top',
              position: 'right',
              backgroundColor: '#f44336'
            }).showToast();
          }
        }
      },
      placeholder: 'Write your content here...',
      theme: 'snow'
    };
  }

  /**
   * Initialize the blog manager
   */
  async initialize() {
    if (this.initialized) return;
    
    // Initialize Quill editor
    if (document.getElementById('blogEditor')) {
      this.editor = new Quill('#blogEditor', this.quillConfig);
      
      // Listen for content changes
      this.editor.on('text-change', () => {
        this.updateWordCount();
      });
    }
    
    // Bind event listeners
    this.bindEventListeners();
    
    // Load initial data
    await this.loadPosts();
    await this.loadCategories();
    await this.loadTags();
    
    this.initialized = true;
    
    console.log('Blog manager initialized');
  }
  
  /**
   * Bind all event listeners
   */
  bindEventListeners() {
    // New post button
    const newPostBtn = document.getElementById('newPostBtn');
    if (newPostBtn) {
      newPostBtn.addEventListener('click', () => this.createNewPost());
    }
    
    // Save draft button
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', () => this.savePost('draft'));
    }
    
    // Publish post button
    const publishPostBtn = document.getElementById('publishPostBtn');
    if (publishPostBtn) {
      publishPostBtn.addEventListener('click', () => this.savePost('published'));
    }
    
    // Preview post button
    const previewPostBtn = document.getElementById('previewPostBtn');
    if (previewPostBtn) {
      previewPostBtn.addEventListener('click', () => this.togglePreview());
    }
    
    // Blog form
    const blogForm = document.getElementById('blogForm');
    if (blogForm) {
      blogForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.savePost(this.currentPost?.status || 'draft');
      });
    }
    
    // Delete post button
    const deletePostBtn = document.getElementById('deletePostBtn');
    if (deletePostBtn) {
      deletePostBtn.addEventListener('click', () => this.deletePost());
    }
    
    // Search input
    const searchInput = document.getElementById('postSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.searchPosts(e.target.value));
    }
    
    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => this.filterPosts());
    }
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
      statusFilter.addEventListener('change', () => this.filterPosts());
    }
    
    // Regenerate blog index button
    const regenerateIndexBtn = document.getElementById('regenerateIndexBtn');
    if (regenerateIndexBtn) {
      regenerateIndexBtn.addEventListener('click', () => this.regenerateBlogIndex());
    }
    
    // Export to Excel button
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    if (exportExcelBtn) {
      exportExcelBtn.addEventListener('click', () => this.exportToExcel());
    }
    
    // Import from Excel button
    const importExcelBtn = document.getElementById('importExcelBtn');
    if (importExcelBtn) {
      importExcelBtn.addEventListener('click', () => this.importFromExcel());
    }
  }
  
  /**
   * Load all blog posts
   */
  async loadPosts() {
    try {
      const response = await fetch('/api/blog/posts');
      this.posts = await response.json();
      this.displayPosts();
      return this.posts;
    } catch (error) {
      console.error('Error loading posts:', error);
      this.showNotification('Error loading posts', 'error');
      return [];
    }
  }
  
  /**
   * Load blog categories
   */
  async loadCategories() {
    try {
      const response = await fetch('/api/blog/categories');
      this.categories = await response.json();
      this.populateCategoryFilters();
      return this.categories;
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }
  
  /**
   * Load blog tags
   */
  async loadTags() {
    try {
      const response = await fetch('/api/blog/tags');
      this.tags = await response.json();
      this.populateTagCloud();
      return this.tags;
    } catch (error) {
      console.error('Error loading tags:', error);
      return [];
    }
  }
  
  /**
   * Populate category select fields and filters
   */
  populateCategoryFilters() {
    // Populate category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.innerHTML = '<option value="">All Categories</option>';
      
      this.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = `${category.name} (${category.count})`;
        categoryFilter.appendChild(option);
      });
    }
    
    // Populate category select in form
    const categorySelect = document.getElementById('blogCategory');
    if (categorySelect) {
      categorySelect.innerHTML = '';
      
      this.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    }
  }
  
  /**
   * Populate tag cloud and select
   */
  populateTagCloud() {
    const tagCloud = document.getElementById('tagCloud');
    if (tagCloud) {
      tagCloud.innerHTML = '';
      
      // Sort tags by count (descending)
      const sortedTags = [...this.tags].sort((a, b) => b.count - a.count);
      
      sortedTags.forEach(tag => {
        const tagBadge = document.createElement('span');
        tagBadge.className = 'badge bg-info me-2 mb-2';
        tagBadge.textContent = `${tag.name} (${tag.count})`;
        tagBadge.addEventListener('click', () => {
          const tagInput = document.getElementById('blogTags');
          if (tagInput) {
            if (tagInput.value) {
              tagInput.value += `, ${tag.name}`;
            } else {
              tagInput.value = tag.name;
            }
          }
        });
        tagCloud.appendChild(tagBadge);
      });
    }
  }
  
  /**
   * Display posts in the list
   */
  displayPosts() {
    const postsList = document.getElementById('postsList');
    if (!postsList) return;
    
    // Clear existing posts
    postsList.innerHTML = '';
    
    if (this.posts.length === 0) {
      postsList.innerHTML = '<div class="text-center p-4">No posts found</div>';
      return;
    }
    
    // Apply filters (if any)
    const filteredPosts = this.filterPostsData();
    
    // Sort posts by date (newest first)
    const sortedPosts = filteredPosts.sort((a, b) => {
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    
    // Add posts to list
    sortedPosts.forEach(post => {
      const postItem = document.createElement('div');
      postItem.className = 'post-item card mb-3';
      postItem.dataset.postId = post.id;
      
      const statusClass = post.status === 'published' ? 'bg-success' : 'bg-warning';
      
      postItem.innerHTML = `
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">${post.title}</h5>
            <span class="badge ${statusClass}">${post.status}</span>
          </div>
          <p class="card-text text-muted small">
            ${new Date(post.updated_at).toLocaleDateString()}
          </p>
          <p class="card-text">${post.excerpt}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div>
              ${post.categories.map(category => `
                <span class="badge bg-primary me-1">${category}</span>
              `).join('')}
            </div>
            <button class="btn btn-sm btn-outline-primary edit-post-btn">
              <i class="fas fa-edit me-1"></i> Edit
            </button>
          </div>
        </div>
      `;
      
      // Add click handler for edit button
      const editBtn = postItem.querySelector('.edit-post-btn');
      editBtn.addEventListener('click', () => {
        this.editPost(post.id);
      });
      
      postsList.appendChild(postItem);
    });
    
    // Update post count
    const postCount = document.getElementById('postCount');
    if (postCount) {
      postCount.textContent = `${filteredPosts.length} posts`;
    }
  }
  
  /**
   * Filter posts based on search, category, and status
   */
  filterPostsData() {
    const searchInput = document.getElementById('postSearchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    let filteredPosts = [...this.posts];
    
    // Apply search filter
    if (searchInput && searchInput.value) {
      const searchTerm = searchInput.value.toLowerCase();
      filteredPosts = filteredPosts.filter(post => {
        return (
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.content_preview.toLowerCase().includes(searchTerm) ||
          post.categories.some(cat => cat.toLowerCase().includes(searchTerm)) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      });
    }
    
    // Apply category filter
    if (categoryFilter && categoryFilter.value) {
      const category = categoryFilter.value;
      filteredPosts = filteredPosts.filter(post => {
        return post.categories.includes(category);
      });
    }
    
    // Apply status filter
    if (statusFilter && statusFilter.value) {
      const status = statusFilter.value;
      filteredPosts = filteredPosts.filter(post => {
        return post.status === status;
      });
    }
    
    return filteredPosts;
  }
  
  /**
   * Filter posts based on user selections
   */
  filterPosts() {
    this.displayPosts();
  }
  
  /**
   * Search posts by query
   */
  searchPosts(query) {
    this.displayPosts();
  }
  
  /**
   * Create new post
   */
  createNewPost() {
    // Reset form
    const form = document.getElementById('blogForm');
    if (form) form.reset();
    
    // Clear editor
    if (this.editor) {
      this.editor.root.innerHTML = '';
    }
    
    // Reset post ID
    this.currentPost = null;
    document.getElementById('postId').value = '';
    
    // Update title
    const editorTitle = document.getElementById('editorTitle');
    if (editorTitle) {
      editorTitle.textContent = 'Create New Post';
    }
    
    // Switch to edit mode if in preview
    if (this.isPreviewMode) {
      this.togglePreview();
    }
    
    // Focus on title input
    const titleInput = document.getElementById('blogTitle');
    if (titleInput) {
      titleInput.focus();
    }
  }
  
  /**
   * Edit existing post
   */
  async editPost(postId) {
    try {
      // Fetch post details
      const response = await fetch(`/api/blog/posts/${postId}`);
      const post = await response.json();
      
      // Set current post
      this.currentPost = post;
      
      // Update form fields
      document.getElementById('postId').value = post.id;
      document.getElementById('blogTitle').value = post.title;
      document.getElementById('blogExcerpt').value = post.excerpt || '';
      
      // Set categories
      const categorySelect = document.getElementById('blogCategory');
      if (categorySelect) {
        if (post.categories && post.categories.length > 0) {
          categorySelect.value = post.categories[0];
        } else {
          categorySelect.selectedIndex = 0;
        }
      }
      
      // Set tags
      document.getElementById('blogTags').value = post.tags.join(', ');
      
      // Set content in editor
      if (this.editor) {
        this.editor.root.innerHTML = post.content;
      }
      
      // Update title
      const editorTitle = document.getElementById('editorTitle');
      if (editorTitle) {
        editorTitle.textContent = `Edit Post: ${post.title}`;
      }
      
      // Switch to edit mode if in preview
      if (this.isPreviewMode) {
        this.togglePreview();
      }
      
      this.updateWordCount();
      
      // Update buttons based on status
      const publishBtn = document.getElementById('publishPostBtn');
      if (publishBtn) {
        if (post.status === 'published') {
          publishBtn.textContent = 'Update Published Post';
        } else {
          publishBtn.textContent = 'Publish';
        }
      }
      
    } catch (error) {
      console.error('Error editing post:', error);
      this.showNotification('Error loading post', 'error');
    }
  }
  
  /**
   * Save post (as draft or published)
   */
  async savePost(status = 'draft') {
    try {
      // Get form data
      const postId = document.getElementById('postId').value;
      const title = document.getElementById('blogTitle').value;
      const excerpt = document.getElementById('blogExcerpt').value;
      const categorySelect = document.getElementById('blogCategory');
      const category = categorySelect ? categorySelect.value : 'Uncategorized';
      const tags = document.getElementById('blogTags').value;
      
      // Validate form
      if (!title) {
        this.showNotification('Please enter a title', 'error');
        return;
      }
      
      // Get content from editor
      const content = this.editor ? this.editor.root.innerHTML : '';
      
      // Create form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('excerpt', excerpt);
      formData.append('content', content);
      formData.append('categories', category);
      formData.append('tags', tags);
      formData.append('status', status);
      
      // Get featured image if available
      const featuredImage = document.getElementById('featuredImage');
      if (featuredImage && featuredImage.files[0]) {
        formData.append('featured_image', featuredImage.files[0]);
      }
      
      let url = '/api/blog/posts';
      let method = 'POST';
      
      // If editing existing post
      if (postId) {
        url = `/api/blog/posts/${postId}`;
        method = 'PUT';
        formData.append('id', postId);
      }
      
      // Show loading notification
      this.showNotification('Saving post...', 'info');
      
      // Send request
      const response = await fetch(url, {
        method,
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Show success notification
      this.showNotification(
        status === 'published' 
          ? 'Post published successfully!' 
          : 'Draft saved successfully!',
        'success'
      );
      
      // Reload posts
      await this.loadPosts();
      await this.loadCategories();
      await this.loadTags();
      
      // If creating new post, edit the newly created post
      if (!postId && result.id) {
        this.editPost(result.id);
      }
      
    } catch (error) {
      console.error('Error saving post:', error);
      this.showNotification('Error saving post', 'error');
    }
  }
  
  /**
   * Delete post
   */
  async deletePost() {
    try {
      const postId = document.getElementById('postId').value;
      
      if (!postId) {
        this.showNotification('No post selected', 'error');
        return;
      }
      
      // Confirm deletion
      if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        return;
      }
      
      // Show loading notification
      this.showNotification('Deleting post...', 'info');
      
      // Send delete request
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      // Show success notification
      this.showNotification('Post deleted successfully!', 'success');
      
      // Reload posts
      await this.loadPosts();
      await this.loadCategories();
      await this.loadTags();
      
      // Reset form
      this.createNewPost();
      
    } catch (error) {
      console.error('Error deleting post:', error);
      this.showNotification('Error deleting post', 'error');
    }
  }
  
  /**
   * Toggle preview mode
   */
  togglePreview() {
    const editorContainer = document.getElementById('editorContainer');
    const previewContainer = document.getElementById('previewContainer');
    const previewContent = document.getElementById('previewContent');
    const previewPostBtn = document.getElementById('previewPostBtn');
    
    if (!editorContainer || !previewContainer || !previewContent || !previewPostBtn) {
      return;
    }
    
    this.isPreviewMode = !this.isPreviewMode;
    
    if (this.isPreviewMode) {
      // Show preview
      const title = document.getElementById('blogTitle').value || 'Untitled Post';
      const content = this.editor ? this.editor.root.innerHTML : '';
      
      previewContent.innerHTML = `
        <h1>${title}</h1>
        <div class="post-content">
          ${content}
        </div>
      `;
      
      editorContainer.style.display = 'none';
      previewContainer.style.display = 'block';
      previewPostBtn.innerHTML = '<i class="fas fa-edit me-1"></i> Edit';
    } else {
      // Show editor
      editorContainer.style.display = 'block';
      previewContainer.style.display = 'none';
      previewPostBtn.innerHTML = '<i class="fas fa-eye me-1"></i> Preview';
    }
  }
  
  /**
   * Update word count
   */
  updateWordCount() {
    const wordCountElement = document.getElementById('wordCount');
    if (!wordCountElement || !this.editor) return;
    
    const text = this.editor.getText();
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    
    wordCountElement.textContent = `${wordCount} words`;
  }
  
  /**
   * Regenerate blog index
   */
  async regenerateBlogIndex() {
    try {
      // Show loading notification
      this.showNotification('Regenerating blog index...', 'info');
      
      // Send request
      const response = await fetch('/api/blog/regenerate-index', {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      
      // Show success notification
      this.showNotification('Blog index regenerated successfully!', 'success');
      
    } catch (error) {
      console.error('Error regenerating blog index:', error);
      this.showNotification('Error regenerating blog index', 'error');
    }
  }
  
  /**
   * Export posts to Excel
   */
  async exportToExcel() {
    try {
      const posts = await this.loadPosts();
      
      // Prepare data for export
      const exportData = posts.map(post => {
        return {
          'ID': post.id,
          'Title': post.title,
          'Excerpt': post.excerpt,
          'Categories': post.categories.join(', '),
          'Tags': post.tags.join(', '),
          'Status': post.status,
          'Created': new Date(post.created_at).toLocaleDateString(),
          'Updated': new Date(post.updated_at).toLocaleDateString()
        };
      });
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Blog Posts');
      
      // Save workbook
      XLSX.writeFile(workbook, 'liquetax-blog-posts.xlsx');
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      this.showNotification('Error exporting to Excel', 'error');
    }
  }
  
  /**
   * Import posts from Excel
   */
  importFromExcel() {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.xlsx, .xls';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    fileInput.addEventListener('change', async (e) => {
      try {
        const file = e.target.files[0];
        if (!file) return;
        
        // Show loading notification
        this.showNotification('Processing Excel file...', 'info');
        
        // Read file
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get first worksheet
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            
            // Convert to JSON
            const posts = XLSX.utils.sheet_to_json(worksheet);
            
            // Confirm import
            if (!confirm(`Import ${posts.length} posts? This will create new posts for each row in the Excel file.`)) {
              this.showNotification('Import canceled', 'info');
              return;
            }
            
            // Process each post
            let successCount = 0;
            let errorCount = 0;
            
            for (const post of posts) {
              try {
                // Convert Excel data to post format
                const postData = {
                  title: post.Title || 'Untitled Post',
                  excerpt: post.Excerpt || '',
                  content: post.Content || '',
                  categories: post.Categories ? post.Categories.split(',').map(c => c.trim()) : ['Uncategorized'],
                  tags: post.Tags ? post.Tags.split(',').map(t => t.trim()) : [],
                  status: post.Status || 'draft'
                };
                
                // Create post
                const response = await fetch('/api/blog/posts', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(postData)
                });
                
                if (!response.ok) {
                  throw new Error(`Error: ${response.statusText}`);
                }
                
                successCount++;
              } catch (error) {
                console.error('Error importing post:', error);
                errorCount++;
              }
            }
            
            // Show results notification
            this.showNotification(
              `Import complete: ${successCount} posts imported, ${errorCount} errors`,
              errorCount > 0 ? 'warning' : 'success'
            );
            
            // Reload posts
            await this.loadPosts();
            await this.loadCategories();
            await this.loadTags();
            
          } catch (error) {
            console.error('Error processing Excel file:', error);
            this.showNotification('Error processing Excel file', 'error');
          }
        };
        
        reader.readAsArrayBuffer(file);
        
      } catch (error) {
        console.error('Error importing from Excel:', error);
        this.showNotification('Error importing from Excel', 'error');
      } finally {
        // Remove file input
        document.body.removeChild(fileInput);
      }
    });
    
    // Trigger file input
    fileInput.click();
  }
  
  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const colors = {
      info: '#2196F3',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336'
    };
    
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top',
      position: 'right',
      backgroundColor: colors[type]
    }).showToast();
  }
}

// Initialize blog manager
document.addEventListener('DOMContentLoaded', function() {
  // Create blog manager instance
  window.blogManager = new BlogManager();
  
  // Initialize once the section is shown or immediately if already visible
  const blogSection = document.getElementById('blog-management');
  
  if (blogSection && blogSection.classList.contains('active')) {
    window.blogManager.initialize();
  }
  
  // Listen for section activation
  document.addEventListener('sectionActivated', function(e) {
    if (e.detail.sectionId === 'blog-management') {
      window.blogManager.initialize();
    }
  });
});
