const fs = require('fs');
const path = require('path');

class BlogUpdater {
    constructor(indexPath) {
        this.indexPath = indexPath;
        this.blogDataPath = path.join(__dirname, 'public', 'blog-data.json');
        this.blogSectionStart = '<!-- BLOG-START -->';
        this.blogSectionEnd = '<!-- BLOG-END -->';
    }

    async updateIndexWithRecentPosts() {
        // Read blog data
        let blogData;
        try {
            const data = fs.readFileSync(this.blogDataPath, 'utf-8');
            blogData = JSON.parse(data);
        } catch (err) {
            throw new Error('Failed to read blog data: ' + err.message);
        }

        // Generate HTML for recent posts (show 5 most recent)
        const posts = (blogData.posts || []).slice(0, 5);
        let blogHtml = '<div class="recent-blogs">\n';
        if (posts.length === 0) {
            blogHtml += '<p>No recent blog posts available.</p>\n';
        } else {
            for (const post of posts) {
                blogHtml += `<div class="blog-preview">
                    <h4><a href="blog/${post.id}.html">${post.title}</a></h4>
                    <p>${post.metaDescription || ''}</p>
                    <small>${post.date || ''}</small>
                </div>\n`;
            }
        }
        blogHtml += '</div>\n';

        // Read index.html
        let indexContent;
        try {
            indexContent = fs.readFileSync(this.indexPath, 'utf-8');
        } catch (err) {
            throw new Error('Failed to read index.html: ' + err.message);
        }

        // Replace blog section
        const startIdx = indexContent.indexOf(this.blogSectionStart);
        const endIdx = indexContent.indexOf(this.blogSectionEnd);
        if (startIdx === -1 || endIdx === -1) {
            throw new Error('Blog section markers not found in index.html');
        }
        const before = indexContent.slice(0, startIdx + this.blogSectionStart.length);
        const after = indexContent.slice(endIdx);
        const newContent = before + '\n' + blogHtml + after;

        // Write back to index.html
        try {
            fs.writeFileSync(this.indexPath, newContent, 'utf-8');
        } catch (err) {
            throw new Error('Failed to write to index.html: ' + err.message);
        }
    }
}

module.exports = BlogUpdater; 