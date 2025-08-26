/**
 * Dashboard Main JavaScript
 * This file contains the main functionality for the Liquetax Dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard script loaded');
    
    // Initialize dashboard functionality
    initDashboard();
});

/**
 * Initialize all dashboard functionality
 */
function initDashboard() {
    console.log('Initializing dashboard');
    
    // Set up the dashboard UI
    setupDashboardUI();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize charts
    initCharts();
    
    // Initialize blog functionality
    initBlogFunctionality();
    
    // Initialize notification system
    initNotifications();
    
    // Initialize social media buttons
    initSocialMediaButtons();
    
    // Initialize blog automation
    if (typeof initBlogAutomation === 'function') {
        initBlogAutomation();
    }
    
    // Initialize social media analytics
    if (typeof initSocialAnalytics === 'function') {
        initSocialAnalytics();
    }
    
    // Initialize integrated dashboard
    if (typeof initIntegratedDashboard === 'function') {
        initIntegratedDashboard();
    }
}

/**
 * Initialize social media buttons
 */
function initSocialMediaButtons() {
    console.log('Initializing social media buttons');
    
    // Set up social media connect buttons
    const socialButtons = [
        { id: 'facebookConnect', platform: 'facebook' },
        { id: 'instagramConnect', platform: 'instagram' },
        { id: 'linkedinConnect', platform: 'linkedin' },
        { id: 'googleConnect', platform: 'google' },
        { id: 'twitterConnect', platform: 'twitter' }
    ];
    
    socialButtons.forEach(function(button) {
        const element = document.getElementById(button.id);
        if (element) {
            console.log(`Found ${button.platform} connect button`);
            
            // Remove any existing event listeners by cloning
            const newElement = element.cloneNode(true);
            if (element.parentNode) {
                element.parentNode.replaceChild(newElement, element);
            }
            
            // Add new event listener
            newElement.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`${button.platform} connect button clicked`);
                
                if (typeof handleSocialConnect === 'function') {
                    handleSocialConnect(button.platform, 'simple');
                } else {
                    console.error('handleSocialConnect function not found');
                    alert(`Connecting to ${button.platform}...`);
                    window.location.href = `/auth/${button.platform.toLowerCase()}`;
                }
            });
        } else {
            console.log(`${button.platform} connect button not found`);
        }
    });
    
    // Set up social media API connect buttons
    const apiButtons = [
        { id: 'facebookApiConnect', platform: 'facebook' },
        { id: 'instagramApiConnect', platform: 'instagram' },
        { id: 'linkedinApiConnect', platform: 'linkedin' },
        { id: 'googleApiConnect', platform: 'google' },
        { id: 'twitterApiConnect', platform: 'twitter' }
    ];
    
    apiButtons.forEach(function(button) {
        const element = document.getElementById(button.id);
        if (element) {
            console.log(`Found ${button.platform} API connect button`);
            
            // Remove any existing event listeners by cloning
            const newElement = element.cloneNode(true);
            if (element.parentNode) {
                element.parentNode.replaceChild(newElement, element);
            }
            
            // Add new event listener
            newElement.addEventListener('click', function() {
                console.log(`${button.platform} API connect button clicked`);
                
                if (typeof handleSocialConnect === 'function') {
                    handleSocialConnect(button.platform, 'api');
                } else {
                    console.error('handleSocialConnect function not found');
                    alert(`Connecting to ${button.platform}...`);
                    window.location.href = `/auth/${button.platform.toLowerCase()}`;
                }
            });
        } else {
            console.log(`${button.platform} API connect button not found`);
        }
    });
    
    // Simple Method radio buttons (in the main dashboard)
    const simpleMethodButtons = [
        { id: 'googleSimpleMethod', platform: 'google' },
        { id: 'facebookSimpleMethod', platform: 'facebook' },
        { id: 'linkedinSimpleMethod', platform: 'linkedin' },
        { id: 'instagramSimpleMethod', platform: 'instagram' },
        { id: 'twitterSimpleMethod', platform: 'twitter' }
    ];
    
    simpleMethodButtons.forEach(function(button) {
        const element = document.getElementById(button.id);
        if (element) {
            console.log(`Found ${button.platform} simple method radio button`);
            
            // Add change event listener
            element.addEventListener('change', function() {
                if (this.checked) {
                    console.log(`${button.platform} simple method selected`);
                    
                    // Check if already connected
                    const isConnected = localStorage.getItem(`${button.platform}Connected`) === 'true';
                    
                    // Get the label element
                    const label = document.querySelector(`label[for="${button.id}"]`);
                    if (label) {
                        // Add click event to the label
                        label.addEventListener('click', function(e) {
                            e.stopPropagation(); // Prevent triggering the radio button again
                            
                            console.log(`${button.platform} simple method label clicked`);
                            
                            if (typeof openSocialLoginModal === 'function') {
                                if (isConnected) {
                                    if (confirm(`You are already connected to ${capitalizeFirstLetter(button.platform)}. Do you want to reconnect?`)) {
                                        openSocialLoginModal(capitalizeFirstLetter(button.platform));
                                    }
                                } else {
                                    openSocialLoginModal(capitalizeFirstLetter(button.platform));
                                }
                            } else {
                                console.error('openSocialLoginModal function not found');
                                alert(`Connecting to ${button.platform}...`);
                                window.location.href = `/auth/${button.platform.toLowerCase()}`;
                            }
                        });
                    }
                    
                    // Also add a connect button next to the radio button
                    const parentDiv = element.closest('.form-check');
                    if (parentDiv) {
                        // Check if we already added a button
                        if (!parentDiv.querySelector('.connect-btn')) {
                            const connectBtn = document.createElement('button');
                            connectBtn.className = 'btn btn-sm btn-primary ms-2 connect-btn';
                            connectBtn.innerHTML = 'Connect';
                            connectBtn.addEventListener('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                console.log(`${button.platform} connect button clicked`);
                                
                                if (typeof openSocialLoginModal === 'function') {
                                    openSocialLoginModal(capitalizeFirstLetter(button.platform));
                                } else {
                                    console.error('openSocialLoginModal function not found');
                                    alert(`Connecting to ${button.platform}...`);
                                    window.location.href = `/auth/${button.platform.toLowerCase()}`;
                                }
                            });
                            
                            parentDiv.appendChild(connectBtn);
                        }
                    }
                }
            });
            
            // Trigger change event if already checked
            if (element.checked) {
                element.dispatchEvent(new Event('change'));
            }
        } else {
            console.log(`${button.platform} simple method radio button not found`);
        }
    });
    
    console.log('Social connect buttons initialized');
}

/**
 * Set up the dashboard UI
 */
function setupDashboardUI() {
    console.log('Setting up dashboard UI');
    
    // Set up sidebar toggle
    const sidebarToggle = document.getElementById('toggleSidebar');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-collapsed');
            
            // Store preference in localStorage
            const isCollapsed = document.body.classList.contains('sidebar-collapsed');
            localStorage.setItem('sidebarCollapsed', isCollapsed);
        });
        
        // Apply saved preference
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            document.body.classList.add('sidebar-collapsed');
        }
    }
    
    // Set up theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Store preference in localStorage
            const isDarkTheme = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkTheme', isDarkTheme);
        });
        
        // Apply saved preference
        const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
        if (isDarkTheme) {
            document.body.classList.add('dark-mode');
        }
    }
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Set up section navigation
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get section ID
            const sectionId = this.getAttribute('data-section');
            
            // Hide all sections
            document.querySelectorAll('.section').forEach(function(section) {
                section.classList.remove('active');
            });
            
            // Show selected section
            const selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.classList.add('active');
            }
            
            // Update active link
            navLinks.forEach(function(navLink) {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Store active section in localStorage
            localStorage.setItem('activeSection', sectionId);
        });
    });
    
    // Restore active section
    const activeSection = localStorage.getItem('activeSection');
    if (activeSection) {
        const link = document.querySelector(`.nav-link[data-section="${activeSection}"]`);
        if (link) {
            link.click();
        }
    }
    
    // Set up Connect Safely buttons
    setupConnectSafelyButtons();
    
    // Set up Direct Connect buttons
    setTimeout(function() {
        setupDirectConnectSafelyButtons();
    }, 500);
}

/**
 * Initialize charts
 */
function initCharts() {
    console.log('Initializing charts');
    
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not found, skipping chart initialization');
        return;
    }
    
    // Blog views chart
    const blogViewsChart = document.getElementById('blogViewsChart');
    if (blogViewsChart) {
        new Chart(blogViewsChart, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Blog Views',
                    data: [1200, 1900, 1500, 2500, 2200, 3000],
                    borderColor: '#0c3c63',
                    backgroundColor: 'rgba(12, 60, 99, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Social shares chart
    const socialSharesChart = document.getElementById('socialSharesChart');
    if (socialSharesChart) {
        new Chart(socialSharesChart, {
            type: 'doughnut',
            data: {
                labels: ['Facebook', 'Twitter', 'LinkedIn', 'Instagram'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#3b5998', '#1da1f2', '#0077b5', '#e1306c'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                cutout: '70%'
            }
        });
    }
}

/**
 * Initialize blog functionality
 */
function initBlogFunctionality() {
    console.log('Initializing blog functionality');
    
    // Initialize blog drop zone
    initBlogDropZone();
    
    // Set up blog post form
    setupBlogPostForm();
    
    // Load blog posts
    loadBlogPosts();
    
    // Set up Excel export/import
    setupExcelFunctionality();
}

/**
 * Initialize the blog drop zone
 */
function initBlogDropZone() {
    console.log('Initializing blog drop zone');
    
    const blogDropZone = document.getElementById('blogDropZone');
    if (!blogDropZone) {
        console.warn('Blog drop zone not found');
        return;
    }
    
    console.log('Blog drop zone found, setting up event listeners');
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        blogDropZone.addEventListener(eventName, e => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`${eventName} event triggered`);
        });
    });
    
    // Highlight on dragover
    ['dragenter', 'dragover'].forEach(eventName => {
        blogDropZone.addEventListener(eventName, () => {
            console.log(`Adding highlight classes on ${eventName}`);
            blogDropZone.classList.add('border-success', 'bg-white');
        });
    });
    
    // Remove highlight on dragleave/drop
    ['dragleave', 'drop'].forEach(eventName => {
        blogDropZone.addEventListener(eventName, () => {
            console.log(`Removing highlight classes on ${eventName}`);
            blogDropZone.classList.remove('border-success', 'bg-white');
        });
    });
    
    // Handle file drop
    blogDropZone.addEventListener('drop', e => {
        console.log('File dropped');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            console.log('Dropped file:', file.name, file.type);
            
            if (file.type === 'text/html' || file.name.endsWith('.html')) {
                console.log('Valid HTML file detected, processing...');
                const reader = new FileReader();
                
                reader.onload = function(evt) {
                    try {
                        console.log('File read successfully');
                        const html = evt.target.result;
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        
                        // Try to extract title, meta, and content
                        const title = doc.querySelector('title')?.innerText || '';
                        console.log('Extracted title:', title);
                        
                        const metaDesc = doc.querySelector('meta[name="description"]')?.content || '';
                        console.log('Extracted meta description:', metaDesc);
                        
                        // Try to find main content (common selectors)
                        let content = '';
                        const mainSelectors = ['article', '.blog-content', '.post-content', 'main', '#content', '.content'];
                        for (const sel of mainSelectors) {
                            const el = doc.querySelector(sel);
                            if (el) { 
                                console.log(`Found content using selector: ${sel}`);
                                content = el.innerHTML; 
                                break; 
                            }
                        }
                        
                        if (!content) {
                            console.log('No content found with common selectors, using body content');
                            // fallback: use body
                            content = doc.body.innerHTML;
                        }
                        
                        // Fill the blog editor fields
                        const titleField = document.getElementById('blogTitle');
                        if (titleField) {
                            titleField.value = title;
                            console.log('Title field populated');
                        } else {
                            console.warn('Blog title field not found');
                        }
                        
                        const metaField = document.getElementById('blogMetaDescription');
                        if (metaField) {
                            metaField.value = metaDesc;
                            console.log('Meta description field populated');
                        } else {
                            console.warn('Blog meta description field not found');
                        }
                        
                        // Try to populate the editor content
                        if (window.Quill && window.editor) {
                            console.log('Using Quill editor to set content');
                            window.editor.root.innerHTML = content;
                        } else {
                            console.log('Quill editor not found, trying direct editor div');
                            const editorDiv = document.getElementById('editor');
                            if (editorDiv) {
                                console.log('Editor div found, setting innerHTML');
                                editorDiv.innerHTML = content;
                            } else {
                                console.warn('Editor element not found');
                            }
                        }
                        
                        // Show success
                        if (window.Toastify) {
                            console.log('Showing Toastify success message');
                            Toastify({ 
                                text: 'Blog imported from HTML!', 
                                backgroundColor: '#28a745', 
                                duration: 3000 
                            }).showToast();
                        } else {
                            console.log('Toastify not available, using alert');
                            alert('Blog imported from HTML!');
                        }
                    } catch (err) {
                        console.error('Error processing HTML file:', err);
                        alert('Failed to import blog: ' + err.message);
                    }
                };
                
                reader.onerror = function(err) {
                    console.error('Error reading file:', err);
                    alert('Error reading file: ' + err);
                };
                
                reader.readAsText(file);
            } else {
                console.warn('Invalid file type dropped');
                alert('Please drop a valid HTML file.');
            }
        } else {
            console.warn('No files found in drop event');
        }
    });
    
    // Also add click handler to make it more intuitive
    blogDropZone.addEventListener('click', () => {
        console.log('Blog drop zone clicked');
        // Create a file input and trigger it
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.html,text/html';
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                console.log('File selected via click:', file.name);
                
                // Create a fake drop event
                const dropEvent = new Event('drop');
                dropEvent.dataTransfer = { files: e.target.files };
                blogDropZone.dispatchEvent(dropEvent);
            }
        });
        
        fileInput.click();
    });
    
    console.log('Blog drop zone initialized successfully');
}

/**
 * Set up blog post form
 */
function setupBlogPostForm() {
    console.log('Setting up blog post form');
    
    const blogForm = document.getElementById('blogForm');
    if (!blogForm) {
        console.warn('Blog form not found');
        return;
    }
    
    blogForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const title = document.getElementById('blogTitle').value;
        const metaDescription = document.getElementById('blogMetaDescription').value;
        const tags = document.getElementById('blogTags')?.value || '';
        
        // Get content from editor
        let content = '';
        if (window.Quill && window.editor) {
            content = window.editor.root.innerHTML;
        } else {
            const editorDiv = document.getElementById('editor');
            if (editorDiv) {
                content = editorDiv.innerHTML;
            }
        }
        
        // Validate
        if (!title) {
            alert('Please enter a blog title');
            return;
        }
        
        if (!content) {
            alert('Please add some content to your blog post');
            return;
        }
        
        // Create blog post object
        const post = {
            id: 'blog_' + Date.now(),
            title: title,
            meta_description: metaDescription,
            tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            content: content,
            date: new Date().toISOString(),
            status: 'published'
        };
        
        // Save to localStorage
        saveBlogPost(post);
        
        // Show success message
        if (window.Toastify) {
            Toastify({
                text: 'Blog post saved successfully!',
                backgroundColor: '#28a745',
                duration: 3000
            }).showToast();
        } else {
            alert('Blog post saved successfully!');
        }
        
        // Reset form
        blogForm.reset();
        
        // Clear editor
        if (window.Quill && window.editor) {
            window.editor.root.innerHTML = '';
        } else {
            const editorDiv = document.getElementById('editor');
            if (editorDiv) {
                editorDiv.innerHTML = '';
            }
        }
        
        // Update blog list
        loadBlogPosts();
        
        // Update stats
        updateBlogStats();
    });
}

/**
 * Save a blog post to localStorage
 */
function saveBlogPost(post) {
    console.log('Saving blog post:', post.title);
    
    // Get existing posts
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Check if post already exists (for updates)
    const existingIndex = posts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
        // Update existing post
        posts[existingIndex] = post;
    } else {
        // Add new post
        posts.unshift(post);
    }
    
    // Save back to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(posts));
    
    return post.id;
}

/**
 * Load blog posts from localStorage
 */
function loadBlogPosts() {
    console.log('Loading blog posts');
    
    const blogList = document.getElementById('blogList');
    if (!blogList) {
        console.warn('Blog list element not found');
        return;
    }
    
    // Get posts from localStorage
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    if (posts.length === 0) {
        blogList.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-file-alt fa-3x text-muted mb-3"></i>
                <p class="text-muted">No blog posts yet. Create your first post!</p>
            </div>
        `;
        return;
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate HTML
    let html = '<ul class="list-group">';
    
    posts.forEach(post => {
        const date = new Date(post.date).toLocaleDateString();
        
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center" data-id="${post.id}">
                <div>
                    <h6 class="mb-0">${post.title}</h6>
                    <small class="text-muted">${date}</small>
                </div>
                <div>
                    <span class="badge bg-${post.status === 'published' ? 'success' : 'secondary'} me-2">
                        ${post.status}
                    </span>
                    <button class="btn btn-sm btn-outline-primary edit-post-btn me-1" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-post-btn" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
        `;
    });
    
    html += '</ul>';
    
    // Update the DOM
    blogList.innerHTML = html;
    
    // Add event listeners
    document.querySelectorAll('.edit-post-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.closest('li').getAttribute('data-id');
            editBlogPost(postId);
        });
    });
    
    document.querySelectorAll('.delete-post-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.closest('li').getAttribute('data-id');
            if (confirm('Are you sure you want to delete this blog post?')) {
                deleteBlogPost(postId);
            }
        });
    });
    
    // Update stats
    updateBlogStats();
}

/**
 * Edit a blog post
 */
function editBlogPost(postId) {
    console.log('Editing blog post:', postId);
    
    // Get posts from localStorage
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Find the post
    const post = posts.find(p => p.id === postId);
    if (!post) {
        console.warn('Post not found:', postId);
        return;
    }
    
    // Fill the form
    document.getElementById('blogTitle').value = post.title;
    document.getElementById('blogMetaDescription').value = post.meta_description || '';
    
    if (document.getElementById('blogTags')) {
        document.getElementById('blogTags').value = (post.tags || []).join(', ');
    }
    
    // Fill the editor
    if (window.Quill && window.editor) {
        window.editor.root.innerHTML = post.content;
    } else {
        const editorDiv = document.getElementById('editor');
        if (editorDiv) {
            editorDiv.innerHTML = post.content;
        }
    }
    
    // Scroll to form
    document.getElementById('blogForm').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Delete a blog post
 */
function deleteBlogPost(postId) {
    console.log('Deleting blog post:', postId);
    
    // Get posts from localStorage
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Filter out the post to delete
    const updatedPosts = posts.filter(p => p.id !== postId);
    
    // Save back to localStorage
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    
    // Update the UI
    loadBlogPosts();
    
    // Show success message
    if (window.Toastify) {
        Toastify({
            text: 'Blog post deleted successfully!',
            backgroundColor: '#dc3545',
            duration: 3000
        }).showToast();
    } else {
        alert('Blog post deleted successfully!');
    }
}

/**
 * Set up Excel functionality
 */
function setupExcelFunctionality() {
    console.log('Setting up Excel functionality');
    
    // Export to Excel
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    if (exportExcelBtn) {
        exportExcelBtn.addEventListener('click', function() {
            exportBlogsToExcel();
        });
    }
    
    // Import from Excel
    const importExcelInput = document.getElementById('importExcelInput');
    if (importExcelInput) {
        importExcelInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                importBlogsFromExcel(e.target.files[0]);
            }
        });
    }
}

/**
 * Export blogs to Excel
 */
function exportBlogsToExcel() {
    console.log('Exporting blogs to Excel');
    
    // Check if SheetJS is available
    if (typeof XLSX === 'undefined') {
        console.warn('SheetJS not found, cannot export to Excel');
        alert('Excel export functionality is not available. Please include SheetJS library.');
        return;
    }
    
    // Get posts from localStorage
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    if (posts.length === 0) {
        alert('No blog posts to export');
        return;
    }
    
    // Prepare data for export
    const data = posts.map(post => {
        return {
            'Title': post.title,
            'Meta Description': post.meta_description || '',
            'Tags': (post.tags || []).join(', '),
            'Date': new Date(post.date).toLocaleDateString(),
            'Status': post.status
        };
    });
    
    // Create workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Blog Posts');
    
    // Generate Excel file
    XLSX.writeFile(wb, 'blog_posts_export.xlsx');
    
    // Show success message
    if (window.Toastify) {
        Toastify({
            text: 'Blog posts exported to Excel successfully!',
            backgroundColor: '#28a745',
            duration: 3000
        }).showToast();
    } else {
        alert('Blog posts exported to Excel successfully!');
    }
}

/**
 * Import blogs from Excel
 */
function importBlogsFromExcel(file) {
    console.log('Importing blogs from Excel');
    
    // Check if SheetJS is available
    if (typeof XLSX === 'undefined') {
        console.warn('SheetJS not found, cannot import from Excel');
        alert('Excel import functionality is not available. Please include SheetJS library.');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get first sheet
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            
            if (jsonData.length === 0) {
                alert('No data found in Excel file');
                return;
            }
            
            // Get existing posts
            const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
            
            // Process imported data
            const importedPosts = jsonData.map(row => {
                return {
                    id: 'blog_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
                    title: row['Title'] || '',
                    meta_description: row['Meta Description'] || '',
                    tags: (row['Tags'] || '').split(',').map(tag => tag.trim()).filter(tag => tag),
                    content: row['Content'] || '<p>Imported from Excel</p>',
                    date: new Date().toISOString(),
                    status: row['Status'] || 'published'
                };
            });
            
            // Combine with existing posts
            const allPosts = [...importedPosts, ...existingPosts];
            
            // Save to localStorage
            localStorage.setItem('blogPosts', JSON.stringify(allPosts));
            
            // Update UI
            loadBlogPosts();
            
            // Show success message
            if (window.Toastify) {
                Toastify({
                    text: `${importedPosts.length} blog posts imported successfully!`,
                    backgroundColor: '#28a745',
                    duration: 3000
                }).showToast();
            } else {
                alert(`${importedPosts.length} blog posts imported successfully!`);
            }
        } catch (err) {
            console.error('Error importing from Excel:', err);
            alert('Failed to import from Excel: ' + err.message);
        }
    };
    
    reader.onerror = function(err) {
        console.error('Error reading Excel file:', err);
        alert('Error reading Excel file: ' + err);
    };
    
    reader.readAsArrayBuffer(file);
}

/**
 * Update blog stats
 */
function updateBlogStats() {
    console.log('Updating blog stats');
    
    // Get posts from localStorage
    const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    
    // Update total posts
    const totalPostsElement = document.getElementById('totalPosts');
    if (totalPostsElement) {
        totalPostsElement.textContent = posts.length;
    }
    
    // Update social shares (simulated)
    const socialSharesElement = document.getElementById('socialShares');
    if (socialSharesElement) {
        const shares = posts.length * 5; // Simulate 5 shares per post
        socialSharesElement.textContent = shares;
    }
    
    // Update total views (simulated)
    const totalViewsElement = document.getElementById('totalViews');
    if (totalViewsElement) {
        const views = posts.length * 25; // Simulate 25 views per post
        totalViewsElement.textContent = views;
    }
    
    // Update engagement (simulated)
    const engagementElement = document.getElementById('engagement');
    if (engagementElement) {
        const engagement = posts.length > 0 ? Math.round((posts.length * 3 / (posts.length * 25)) * 100) : 0;
        engagementElement.textContent = engagement + '%';
    }
}

/**
 * Initialize notifications
 */
function initNotifications() {
    console.log('Initializing notifications');
    
    // Check for notifications
    const hasNotifications = localStorage.getItem('hasNotifications') === 'true';
    
    // Update notification badge
    const notificationBadge = document.querySelector('.notification-badge');
    if (notificationBadge) {
        notificationBadge.style.display = hasNotifications ? 'block' : 'none';
    }
    
    // Set up notification toggle
    const notificationToggle = document.getElementById('notificationToggle');
    if (notificationToggle) {
        notificationToggle.addEventListener('click', function() {
            // Toggle notifications
            localStorage.setItem('hasNotifications', 'false');
            
            // Hide badge
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });
    }
}

/**
 * Set up Connect Safely buttons
 */
function setupConnectSafelyButtons() {
    console.log('Setting up Connect Safely buttons');
    
    const connectSafelyButtons = document.querySelectorAll('.connect-safely-btn');
    connectSafelyButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.getAttribute('data-platform');
            if (!platform) {
                console.warn('No platform specified for Connect Safely button');
                return;
            }
            
            console.log(`Connect Safely button clicked for ${platform}`);
            
            // Show the appropriate modal
            const modalId = `connect${capitalizeFirstLetter(platform)}Modal`;
            const modal = document.getElementById(modalId);
            
            if (modal) {
                try {
                    if (window.bootstrap) {
                        const bsModal = new bootstrap.Modal(modal);
                        bsModal.show();
                    } else if (window.jQuery) {
                        $('#' + modalId).modal('show');
                    }
                } catch (e) {
                    console.error('Error showing modal:', e);
                    alert(`Connecting to ${platform}...`);
                    window.location.href = `/auth/${platform.toLowerCase()}`;
                }
            } else {
                console.warn(`Modal not found: ${modalId}`);
                alert(`Connecting to ${platform}...`);
                window.location.href = `/auth/${platform.toLowerCase()}`;
            }
        });
    });
}

/**
 * Set up Direct Connect Safely buttons
 */
function setupDirectConnectSafelyButtons() {
    console.log('Setting up Direct Connect Safely buttons');
    
    const directConnectButtons = document.querySelectorAll('.direct-connect-btn');
    directConnectButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.getAttribute('data-platform');
            if (!platform) {
                console.warn('No platform specified for Direct Connect button');
                return;
            }
            
            console.log(`Direct Connect button clicked for ${platform}`);
            
            // Redirect to OAuth endpoint
            window.location.href = `/auth/${platform.toLowerCase()}`;
        });
    });
}

/**
 * Helper function to capitalize first letter
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}