require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const http = require('http');
const socketIo = require('socket.io');
const { exec } = require('child_process');
const cron = require('node-cron');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Import API routes and services
const apiRoutes = require('./api/routes');
const authRoutes = require('./api/authRoutes');
const BlogService = require('./api/blogService');
const SocialService = require('./api/socialService');
const tokenManager = require('./api/tokenManager');
const oauthConfig = require('./oauth-config');

// Try to import optional dependencies
let TwitterApi, LinkedInApi, Facebook;
try {
    TwitterApi = require('twitter-api-v2').TwitterApi;
    LinkedInApi = require('node-linkedin').LinkedInApi;
    Facebook = require('fb').Facebook;
} catch (error) {
    console.warn('Some social media libraries not available. Mock functionality will be used instead.');
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

// Initialize services
const blogService = new BlogService();
const socialService = new SocialService();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(oauthConfig.session));
app.use(express.static(path.join(__dirname, 'public')));

// Create directories if they don't exist
const publicDir = path.join(__dirname, 'public');
const uploadsDir = path.join(publicDir, 'uploads');
const blogsDir = path.join(publicDir, 'blogs');
const dataDir = path.join(__dirname, 'data');

[publicDir, uploadsDir, blogsDir, dataDir].forEach(dir => {
    if (!fsSync.existsSync(dir)) {
        fsSync.mkdirSync(dir, { recursive: true });
    }
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard-new.html'));
});

// API Routes
app.use('/api', apiRoutes);

// OAuth Authentication Routes
app.use('/auth', authRoutes);

// API endpoint to check authentication status
app.get('/api/auth/status', async (req, res) => {
    try {
        const connectedPlatforms = await tokenManager.getConnectedPlatforms();
        res.json({
            isAuthenticated: Object.keys(connectedPlatforms).length > 0,
            connectedPlatforms
        });
    } catch (error) {
        console.error('Error checking auth status:', error);
        res.status(500).json({ error: 'Failed to check authentication status' });
    }
});

// Backward compatibility for legacy API routes
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await blogService.getAllPosts();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

app.get('/api/stats', async (req, res) => {
    try {
        const posts = await blogService.getAllPosts();
        const stats = {
            totalPosts: posts.length,
            shares: posts.reduce((acc, post) => acc + (post.shares || 0), 0),
            views: posts.reduce((acc, post) => acc + (post.views || 0), 0),
            engagement: calculateEngagement(posts)
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stats' });
    }
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
    console.log('Client connected to socket');

    // Notify client about new blog posts
    socket.on('subscribe-blog-updates', () => {
        console.log('Client subscribed to blog updates');
        socket.join('blog-subscribers');
    });

    // Notify client about social media updates
    socket.on('subscribe-social-updates', () => {
        console.log('Client subscribed to social media updates');
        socket.join('social-subscribers');
    });

    // Real-time analytics updates
    socket.on('subscribe-analytics', () => {
        console.log('Client subscribed to analytics updates');
        socket.join('analytics-subscribers');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected from socket');
    });
});

// Schedule cron jobs for automatic tasks
// Process scheduled social media posts every 15 minutes
cron.schedule('*/15 * * * *', async () => {
    try {
        console.log('Processing scheduled social media posts...');
        const result = await socialService.processScheduledPosts();
        if (result.processed > 0) {
            io.to('social-subscribers').emit('social-posts-published', result);
        }
    } catch (error) {
        console.error('Error processing scheduled posts:', error);
    }
});

// Update analytics data every 30 minutes
cron.schedule('*/30 * * * *', async () => {
    try {
        console.log('Updating social media analytics...');
        const analytics = await socialService.getAccountAnalytics();
        io.to('analytics-subscribers').emit('analytics-updated', analytics);
    } catch (error) {
        console.error('Error updating analytics:', error);
    }
});

// Helper functions
function calculateEngagement(posts) {
    if (posts.length === 0) return 0;
    const totalInteractions = posts.reduce((acc, post) => {
        return acc + (post.views || 0) + (post.comments || 0);
    }, 0);
    return Math.round((totalInteractions / (posts.length * 100)) * 100);
}

// Start server
server.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    
    // Initialize blog and social services
    try {
        // Ensure blog index exists
        await blogService.updateBlogIndex();
        console.log('Blog service initialized');
        
        // Process any pending scheduled posts
        await socialService.processScheduledPosts();
        console.log('Social service initialized');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
}); 