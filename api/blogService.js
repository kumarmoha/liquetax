/**
 * Blog Service - Handles all blog management operations
 */
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const cheerio = require('cheerio');
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');

class BlogService {
  constructor(options = {}) {
    this.blogDir = options.blogDir || path.join(__dirname, '../public/blogs');
    this.metadataFile = options.metadataFile || path.join(this.blogDir, 'metadata.json');
    this.indexFile = options.indexFile || path.join(__dirname, '../../index.html');
    this.blogIndexFile = options.blogIndexFile || path.join(__dirname, '../../blog.html');
    
    // Create directories if they don't exist
    this.initDirectories();
  }

  async initDirectories() {
    try {
      await fs.mkdir(this.blogDir, { recursive: true });
      // Create metadata file if it doesn't exist
      try {
        await fs.access(this.metadataFile);
      } catch (error) {
        await fs.writeFile(this.metadataFile, JSON.stringify({}));
      }
    } catch (error) {
      console.error('Error initializing directories:', error);
      throw error;
    }
  }

  /**
   * Load blog metadata from file
   */
  async loadMetadata() {
    try {
      const data = await fs.readFile(this.metadataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading blog metadata:', error);
      return {};
    }
  }

  /**
   * Save blog metadata to file
   */
  async saveMetadata(metadata) {
    try {
      await fs.writeFile(this.metadataFile, JSON.stringify(metadata, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving blog metadata:', error);
      throw error;
    }
  }

  /**
   * Generate a unique slug for a blog post
   */
  generateSlug(title) {
    const baseSlug = slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
    
    // Add a timestamp to ensure uniqueness
    const timestamp = Date.now().toString(36);
    return `${baseSlug}-${timestamp}`;
  }

  /**
   * Create a new blog post
   */
  async createPost(postData) {
    try {
      const metadata = await this.loadMetadata();
      
      // Generate a unique ID
      const id = crypto.randomUUID();
      
      // Generate slug if not provided
      const slug = postData.slug || this.generateSlug(postData.title);
      
      // Sanitize HTML content
      const sanitizedContent = sanitizeHtml(postData.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          'img', 'video', 'audio', 'source', 'iframe', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          '*': ['class', 'id', 'style'],
          'img': ['src', 'alt', 'height', 'width', 'loading'],
          'iframe': ['src', 'frameborder', 'allowfullscreen', 'height', 'width'],
          'video': ['src', 'controls', 'height', 'width'],
          'audio': ['src', 'controls'],
          'source': ['src', 'type']
        }
      });

      // Create post object
      const post = {
        id,
        slug,
        title: postData.title,
        content: sanitizedContent,
        excerpt: postData.excerpt || this.generateExcerpt(sanitizedContent),
        featured_image: postData.featured_image || null,
        categories: postData.categories || ['Uncategorized'],
        tags: postData.tags || [],
        author: postData.author || 'Admin',
        status: postData.status || 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        social_snippets: postData.social_snippets || this.generateSocialSnippets(postData.title, sanitizedContent),
        version_history: [{
          version: 1,
          content: sanitizedContent,
          updated_at: new Date().toISOString()
        }]
      };
      
      // Save to HTML file
      const htmlPath = path.join(this.blogDir, `${slug}.html`);
      await this.savePostAsHtml(post, htmlPath);
      
      // Add to metadata
      metadata[id] = { ...post, content_path: htmlPath };
      await this.saveMetadata(metadata);
      
      // Update blog index
      await this.updateBlogIndex();
      
      return post;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  /**
   * Update an existing blog post
   */
  async updatePost(id, postData) {
    try {
      const metadata = await this.loadMetadata();
      
      // Check if post exists
      if (!metadata[id]) {
        throw new Error('Post not found');
      }
      
      const existingPost = metadata[id];
      
      // Sanitize HTML content
      const sanitizedContent = sanitizeHtml(postData.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          'img', 'video', 'audio', 'source', 'iframe', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
        ]),
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          '*': ['class', 'id', 'style'],
          'img': ['src', 'alt', 'height', 'width', 'loading'],
          'iframe': ['src', 'frameborder', 'allowfullscreen', 'height', 'width'],
          'video': ['src', 'controls', 'height', 'width'],
          'audio': ['src', 'controls'],
          'source': ['src', 'type']
        }
      });

      // Create new version in history
      const newVersion = {
        version: (existingPost.version_history || []).length + 1,
        content: sanitizedContent,
        updated_at: new Date().toISOString()
      };
      
      // Update post object
      const updatedPost = {
        ...existingPost,
        title: postData.title || existingPost.title,
        content: sanitizedContent,
        excerpt: postData.excerpt || existingPost.excerpt,
        featured_image: postData.featured_image || existingPost.featured_image,
        categories: postData.categories || existingPost.categories,
        tags: postData.tags || existingPost.tags,
        status: postData.status || existingPost.status,
        updated_at: new Date().toISOString(),
        social_snippets: postData.social_snippets || existingPost.social_snippets,
        version_history: [...(existingPost.version_history || []), newVersion]
      };
      
      // If slug changed, rename file
      if (postData.slug && postData.slug !== existingPost.slug) {
        const oldPath = existingPost.content_path;
        const newPath = path.join(this.blogDir, `${postData.slug}.html`);
        
        // Save to new HTML file
        await this.savePostAsHtml(updatedPost, newPath);
        
        // Try to delete old file
        try {
          await fs.unlink(oldPath);
        } catch (error) {
          console.warn('Could not delete old post file:', error);
        }
        
        updatedPost.slug = postData.slug;
        updatedPost.content_path = newPath;
      } else {
        // Save to HTML file
        await this.savePostAsHtml(updatedPost, existingPost.content_path);
      }
      
      // Update metadata
      metadata[id] = updatedPost;
      await this.saveMetadata(metadata);
      
      // Update blog index
      await this.updateBlogIndex();
      
      return updatedPost;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  /**
   * Delete a blog post
   */
  async deletePost(id) {
    try {
      const metadata = await this.loadMetadata();
      
      // Check if post exists
      if (!metadata[id]) {
        throw new Error('Post not found');
      }
      
      const post = metadata[id];
      
      // Delete HTML file
      try {
        await fs.unlink(post.content_path);
      } catch (error) {
        console.warn('Could not delete post file:', error);
      }
      
      // Remove from metadata
      delete metadata[id];
      await this.saveMetadata(metadata);
      
      // Update blog index
      await this.updateBlogIndex();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }

  /**
   * Get all blog posts
   */
  async getAllPosts() {
    try {
      const metadata = await this.loadMetadata();
      return Object.values(metadata).map(post => {
        // Remove content to reduce payload size
        const { content, ...postData } = post;
        return {
          ...postData,
          content_preview: this.generateExcerpt(content, 100)
        };
      });
    } catch (error) {
      console.error('Error getting all blog posts:', error);
      throw error;
    }
  }

  /**
   * Get a single blog post by ID
   */
  async getPostById(id) {
    try {
      const metadata = await this.loadMetadata();
      
      if (!metadata[id]) {
        throw new Error('Post not found');
      }
      
      return metadata[id];
    } catch (error) {
      console.error(`Error getting blog post with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search for blog posts
   */
  async searchPosts(query, options = {}) {
    try {
      const metadata = await this.loadMetadata();
      const posts = Object.values(metadata);
      
      const filteredPosts = posts.filter(post => {
        // Filter by query
        if (query) {
          const searchFields = [
            post.title,
            post.content,
            post.excerpt,
            ...post.categories,
            ...post.tags
          ].join(' ').toLowerCase();
          
          if (!searchFields.includes(query.toLowerCase())) {
            return false;
          }
        }
        
        // Filter by status
        if (options.status && post.status !== options.status) {
          return false;
        }
        
        // Filter by category
        if (options.category && !post.categories.includes(options.category)) {
          return false;
        }
        
        // Filter by tag
        if (options.tag && !post.tags.includes(options.tag)) {
          return false;
        }
        
        return true;
      });
      
      // Sort posts
      const sortedPosts = filteredPosts.sort((a, b) => {
        if (options.sortBy === 'title') {
          return a.title.localeCompare(b.title);
        } else {
          // Default sort by date
          return new Date(b.updated_at) - new Date(a.updated_at);
        }
      });
      
      // Paginate
      if (options.page && options.limit) {
        const startIndex = (options.page - 1) * options.limit;
        const endIndex = startIndex + options.limit;
        return sortedPosts.slice(startIndex, endIndex).map(post => {
          // Remove content to reduce payload size
          const { content, ...postData } = post;
          return {
            ...postData,
            content_preview: this.generateExcerpt(content, 100)
          };
        });
      }
      
      return sortedPosts.map(post => {
        // Remove content to reduce payload size
        const { content, ...postData } = post;
        return {
          ...postData,
          content_preview: this.generateExcerpt(content, 100)
        };
      });
    } catch (error) {
      console.error('Error searching blog posts:', error);
      throw error;
    }
  }

  /**
   * Get categories and their post counts
   */
  async getCategories() {
    try {
      const metadata = await this.loadMetadata();
      const posts = Object.values(metadata);
      
      const categories = {};
      
      posts.forEach(post => {
        post.categories.forEach(category => {
          if (categories[category]) {
            categories[category]++;
          } else {
            categories[category] = 1;
          }
        });
      });
      
      return Object.entries(categories).map(([name, count]) => ({ name, count }));
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  /**
   * Get tags and their post counts
   */
  async getTags() {
    try {
      const metadata = await this.loadMetadata();
      const posts = Object.values(metadata);
      
      const tags = {};
      
      posts.forEach(post => {
        post.tags.forEach(tag => {
          if (tags[tag]) {
            tags[tag]++;
          } else {
            tags[tag] = 1;
          }
        });
      });
      
      return Object.entries(tags).map(([name, count]) => ({ name, count }));
    } catch (error) {
      console.error('Error getting tags:', error);
      throw error;
    }
  }

  /**
   * Generate an excerpt from HTML content
   */
  generateExcerpt(htmlContent, maxLength = 160) {
    // Extract text from HTML
    const $ = cheerio.load(htmlContent);
    const text = $.text().trim();
    
    // Truncate to maxLength
    if (text.length <= maxLength) {
      return text;
    }
    
    return text.substring(0, maxLength) + '...';
  }

  /**
   * Generate social media snippets from post content
   */
  generateSocialSnippets(title, content) {
    const excerpt = this.generateExcerpt(content, 280);
    
    return {
      twitter: `${title} ${excerpt.substring(0, 280 - title.length - 20)}... #Liquetax #TaxTips`,
      facebook: `${title}\n\n${excerpt}\n\nRead more on our website!`,
      linkedin: `${title}\n\n${excerpt}\n\n#Liquetax #TaxCompliance #BusinessTips`,
      instagram: `${title}\n\n${excerpt.substring(0, 100)}...\n\n#Liquetax #TaxTips #BusinessAdvice`
    };
  }

  /**
   * Save post as HTML file
   */
  async savePostAsHtml(post, filePath) {
    try {
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} - Liquetax</title>
    <meta name="description" content="${post.excerpt}">
    <meta property="og:title" content="${post.title}">
    <meta property="og:description" content="${post.excerpt}">
    ${post.featured_image ? `<meta property="og:image" content="${post.featured_image}">` : ''}
    <meta property="og:type" content="article">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>Liquetax</h1>
            <nav>
                <a href="/">Home</a>
                <a href="/blog.html">Blog</a>
                <a href="/about.html">About</a>
                <a href="/contact.html">Contact</a>
            </nav>
        </div>
    </header>
    <main>
        <article class="blog-post">
            <div class="container">
                <header class="post-header">
                    <h1>${post.title}</h1>
                    <div class="post-meta">
                        <span class="post-date">${new Date(post.created_at).toLocaleDateString()}</span>
                        <span class="post-author">By ${post.author}</span>
                    </div>
                    ${post.featured_image ? `<img src="${post.featured_image}" alt="${post.title}" class="featured-image">` : ''}
                </header>
                <div class="post-content">
                    ${post.content}
                </div>
                <footer class="post-footer">
                    <div class="post-categories">
                        Categories: ${post.categories.map(cat => `<a href="/blog.html?category=${encodeURIComponent(cat)}">${cat}</a>`).join(', ')}
                    </div>
                    <div class="post-tags">
                        Tags: ${post.tags.map(tag => `<a href="/blog.html?tag=${encodeURIComponent(tag)}">#${tag}</a>`).join(' ')}
                    </div>
                </footer>
            </div>
        </article>
    </main>
    <footer>
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} Liquetax. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
      
      await fs.writeFile(filePath, html);
      return true;
    } catch (error) {
      console.error('Error saving post as HTML:', error);
      throw error;
    }
  }

  /**
   * Update blog index file
   */
  async updateBlogIndex() {
    try {
      // Get all published posts
      const metadata = await this.loadMetadata();
      const publishedPosts = Object.values(metadata)
        .filter(post => post.status === 'published')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      // Create categories and tags map
      const categories = {};
      const tags = {};
      
      publishedPosts.forEach(post => {
        post.categories.forEach(cat => {
          if (!categories[cat]) {
            categories[cat] = [];
          }
          categories[cat].push(post);
        });
        
        post.tags.forEach(tag => {
          if (!tags[tag]) {
            tags[tag] = [];
          }
          tags[tag].push(post);
        });
      });
      
      // Generate blog index HTML
      const blogIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog - Liquetax</title>
    <meta name="description" content="Tax optimization and compliance blog by Liquetax">
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>Liquetax</h1>
            <nav>
                <a href="/">Home</a>
                <a href="/blog.html" class="active">Blog</a>
                <a href="/about.html">About</a>
                <a href="/contact.html">Contact</a>
            </nav>
        </div>
    </header>
    <main>
        <div class="container">
            <div class="blog-header">
                <h1>Liquetax Blog</h1>
                <p>Tax optimization and compliance insights for businesses and individuals</p>
            </div>
            
            <!-- Search and Filter -->
            <div class="blog-filters">
                <div class="search-container">
                    <input type="text" id="blog-search" placeholder="Search blog posts...">
                    <button id="search-btn"><i class="fas fa-search"></i></button>
                </div>
                <div class="filter-container">
                    <select id="category-filter">
                        <option value="">All Categories</option>
                        ${Object.keys(categories).map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                    </select>
                </div>
            </div>
            
            <!-- Blog Posts -->
            <div class="blog-posts">
                ${publishedPosts.map(post => `
                <article class="blog-card">
                    ${post.featured_image ? `<img src="${post.featured_image}" alt="${post.title}" class="card-image">` : ''}
                    <div class="card-content">
                        <header>
                            <h2><a href="/blogs/${post.slug}.html">${post.title}</a></h2>
                            <div class="post-meta">
                                <span class="post-date">${new Date(post.created_at).toLocaleDateString()}</span>
                                <span class="post-author">By ${post.author}</span>
                            </div>
                        </header>
                        <div class="post-excerpt">
                            <p>${post.excerpt}</p>
                        </div>
                        <footer>
                            <a href="/blogs/${post.slug}.html" class="read-more">Read More</a>
                            <div class="post-categories">
                                ${post.categories.map(cat => `<a href="/blog.html?category=${encodeURIComponent(cat)}">${cat}</a>`).join(', ')}
                            </div>
                        </footer>
                    </div>
                </article>
                `).join('')}
            </div>
            
            <!-- Tags Cloud -->
            <div class="tags-cloud">
                <h3>Popular Tags</h3>
                <div class="tags">
                    ${Object.entries(tags)
                      .sort((a, b) => b[1].length - a[1].length)
                      .slice(0, 20)
                      .map(([tag, posts]) => `<a href="/blog.html?tag=${encodeURIComponent(tag)}" class="tag" data-count="${posts.length}">#${tag}</a>`)
                      .join('')}
                </div>
            </div>
        </div>
    </main>
    <footer>
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} Liquetax. All rights reserved.</p>
        </div>
    </footer>
    
    <script>
        // Search and filtering functionality
        document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('blog-search');
            const categoryFilter = document.getElementById('category-filter');
            const blogPosts = document.querySelectorAll('.blog-card');
            
            // Search functionality
            searchInput.addEventListener('input', filterPosts);
            
            // Category filter
            categoryFilter.addEventListener('change', filterPosts);
            
            // URL params for direct filtering
            const urlParams = new URLSearchParams(window.location.search);
            const categoryParam = urlParams.get('category');
            const tagParam = urlParams.get('tag');
            
            if (categoryParam) {
                categoryFilter.value = categoryParam;
            }
            
            if (tagParam) {
                searchInput.value = '#' + tagParam;
            }
            
            // Initial filter
            filterPosts();
            
            function filterPosts() {
                const searchTerm = searchInput.value.toLowerCase();
                const category = categoryFilter.value;
                
                blogPosts.forEach(post => {
                    const title = post.querySelector('h2').textContent.toLowerCase();
                    const excerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();
                    const categories = Array.from(post.querySelectorAll('.post-categories a')).map(a => a.textContent.toLowerCase());
                    
                    let matchesSearch = true;
                    let matchesCategory = true;
                    
                    if (searchTerm) {
                        matchesSearch = title.includes(searchTerm) || excerpt.includes(searchTerm);
                    }
                    
                    if (category) {
                        matchesCategory = categories.includes(category.toLowerCase());
                    }
                    
                    if (matchesSearch && matchesCategory) {
                        post.style.display = 'flex';
                    } else {
                        post.style.display = 'none';
                    }
                });
            }
        });
    </script>
</body>
</html>`;
      
      // Update blog index file
      await fs.writeFile(this.blogIndexFile, blogIndexHtml);
      
      // Update recent posts in main index file
      try {
        const indexHtml = await fs.readFile(this.indexFile, 'utf8');
        const $ = cheerio.load(indexHtml);
        
        // Find the recent posts section
        const recentPostsSection = $('#recent-posts');
        
        if (recentPostsSection.length) {
          // Clear existing posts
          recentPostsSection.empty();
          
          // Add recent posts (up to 6)
          const recentPosts = publishedPosts.slice(0, 6);
          
          recentPosts.forEach(post => {
            recentPostsSection.append(`
              <div class="recent-post">
                ${post.featured_image ? `<img src="${post.featured_image}" alt="${post.title}" class="post-thumbnail">` : ''}
                <div class="post-details">
                  <h3><a href="/blogs/${post.slug}.html">${post.title}</a></h3>
                  <p>${post.excerpt}</p>
                  <a href="/blogs/${post.slug}.html" class="read-more">Read More</a>
                </div>
              </div>
            `);
          });
          
          // Save updated index file
          await fs.writeFile(this.indexFile, $.html());
        }
      } catch (error) {
        console.warn('Could not update recent posts in index file:', error);
      }
      
      return true;
    } catch (error) {
      console.error('Error updating blog index:', error);
      throw error;
    }
  }

  /**
   * Regenerate all HTML files from metadata
   */
  async regenerateAllHtmlFiles() {
    try {
      const metadata = await this.loadMetadata();
      
      for (const id in metadata) {
        const post = metadata[id];
        await this.savePostAsHtml(post, post.content_path);
      }
      
      await this.updateBlogIndex();
      
      return true;
    } catch (error) {
      console.error('Error regenerating HTML files:', error);
      throw error;
    }
  }
}

module.exports = BlogService;
