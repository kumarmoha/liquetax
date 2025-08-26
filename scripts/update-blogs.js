/**
 * Update Blogs Script
 * This script updates the main index.html file with recent blog posts.
 */

const path = require('path');
const BlogUpdater = require('../blog-updater');

// Initialize blog updater
const blogUpdater = new BlogUpdater(path.join(__dirname, '..', '..', 'index.html'));

async function updateBlogs() {
    try {
        console.log('Updating index.html with recent blog posts...');
        
        // Update index.html with recent blog posts
        await blogUpdater.updateIndexWithRecentPosts();
        
        console.log('Successfully updated index.html with recent blog posts');
    } catch (error) {
        console.error('Error updating blogs:', error);
        process.exit(1);
    }
}

// Run the update
updateBlogs();