/**
 * API Routes for Blog and Social Media Management
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const BlogService = require('./blogService');
const SocialService = require('./socialService');

// Initialize services
const blogService = new BlogService();
const socialService = new SocialService();

// Configure file upload for blog images and social media content
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/uploads');
    fs.mkdir(uploadDir, { recursive: true })
      .then(() => cb(null, uploadDir))
      .catch(err => cb(err));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});


// Secure multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        // Sanitize filename and add timestamp
        const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, Date.now() + '-' + sanitizedName)
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1,
        fieldSize: 100 * 1024 // 100KB field limit
    },
    fileFilter: (req, file, cb) => {
        // Whitelist allowed file types
        const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|html/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only images, PDFs, and documents allowed.'));
        }
    }
});

// Middleware to handle errors
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Error handler middleware
router.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ----- BLOG API ROUTES -----

// Get all blog posts
router.get('/blog/posts', asyncHandler(async (req, res) => {
  const posts = await blogService.getAllPosts();
  res.json(posts);
}));

// Get a single blog post
router.get('/blog/posts/:id', asyncHandler(async (req, res) => {
  const post = await blogService.getPostById(req.params.id);
  res.json(post);
}));

// Search blog posts
router.get('/blog/search', asyncHandler(async (req, res) => {
  const { query, category, tag, status, page, limit, sortBy } = req.query;
  const options = {
    category,
    tag,
    status,
    page: page ? parseInt(page) : undefined,
    limit: limit ? parseInt(limit) : undefined,
    sortBy
  };
  
  const posts = await blogService.searchPosts(query, options);
  res.json(posts);
}));

// Get blog categories
router.get('/blog/categories', asyncHandler(async (req, res) => {
  const categories = await blogService.getCategories();
  res.json(categories);
}));

// Get blog tags
router.get('/blog/tags', asyncHandler(async (req, res) => {
  const tags = await blogService.getTags();
  res.json(tags);
}));

// Create a new blog post
router.post('/blog/posts', upload.single('featured_image'), asyncHandler(async (req, res) => {
  const postData = req.body;
  
  // Handle file upload
  if (req.file) {
    postData.featured_image = `/uploads/${req.file.filename}`;
  }
  
  // Handle categories and tags
  if (postData.categories && typeof postData.categories === 'string') {
    postData.categories = postData.categories.split(',').map(category => category.trim());
  }
  
  if (postData.tags && typeof postData.tags === 'string') {
    postData.tags = postData.tags.split(',').map(tag => tag.trim());
  }
  
  const post = await blogService.createPost(postData);
  res.status(201).json(post);
}));

// Update a blog post
router.put('/blog/posts/:id', upload.single('featured_image'), asyncHandler(async (req, res) => {
  const postData = req.body;
  
  // Handle file upload
  if (req.file) {
    postData.featured_image = `/uploads/${req.file.filename}`;
  }
  
  // Handle categories and tags
  if (postData.categories && typeof postData.categories === 'string') {
    postData.categories = postData.categories.split(',').map(category => category.trim());
  }
  
  if (postData.tags && typeof postData.tags === 'string') {
    postData.tags = postData.tags.split(',').map(tag => tag.trim());
  }
  
  const post = await blogService.updatePost(req.params.id, postData);
  res.json(post);
}));

// Delete a blog post
router.delete('/blog/posts/:id', asyncHandler(async (req, res) => {
  await blogService.deletePost(req.params.id);
  res.json({ success: true });
}));

// Regenerate blog index
router.post('/blog/regenerate-index', asyncHandler(async (req, res) => {
  await blogService.updateBlogIndex();
  res.json({ success: true });
}));

// Regenerate all HTML files
router.post('/blog/regenerate-all', asyncHandler(async (req, res) => {
  await blogService.regenerateAllHtmlFiles();
  res.json({ success: true });
}));

// ----- SOCIAL MEDIA API ROUTES -----

// Get connected social media accounts
router.get('/social/accounts', asyncHandler(async (req, res) => {
  const accounts = await socialService.getConnectedAccounts();
  res.json(accounts);
}));

// Connect a social media account
router.post('/social/connect/:platform', asyncHandler(async (req, res) => {
  const platform = req.params.platform.toLowerCase();
  let result;
  
  switch (platform) {
    case 'facebook':
      result = await socialService.connectFacebook(req.body);
      break;
    case 'twitter':
      result = await socialService.connectTwitter(req.body);
      break;
    case 'linkedin':
      result = await socialService.connectLinkedIn(req.body);
      break;
    case 'instagram':
      result = await socialService.connectInstagram(req.body);
      break;
    case 'google':
      result = await socialService.connectGoogle(req.body);
      break;
    default:
      return res.status(400).json({ error: 'Invalid platform' });
  }
  
  res.json(result);
}));

// Disconnect a social media account
router.post('/social/disconnect/:platform', asyncHandler(async (req, res) => {
  const platform = req.params.platform.toLowerCase();
  const result = await socialService.disconnectAccount(platform);
  res.json(result);
}));

// Get all social media posts
router.get('/social/posts', asyncHandler(async (req, res) => {
  const posts = await socialService.getAllSocialPosts();
  res.json(posts);
}));

// Get a single social media post
router.get('/social/posts/:id', asyncHandler(async (req, res) => {
  const post = await socialService.getSocialPostById(req.params.id);
  res.json(post);
}));

// Create a new social media post
router.post('/social/posts', upload.array('images', 5), asyncHandler(async (req, res) => {
  const postData = req.body;
  
  // Handle file uploads
  if (req.files && req.files.length > 0) {
    postData.images = req.files.map(file => `/uploads/${file.filename}`);
  }
  
  // Handle platforms array
  if (postData.platforms && typeof postData.platforms === 'string') {
    postData.platforms = postData.platforms.split(',').map(platform => platform.trim());
  }
  
  const post = await socialService.createSocialPost(postData);
  res.status(201).json(post);
}));

// Update a social media post
router.put('/social/posts/:id', upload.array('images', 5), asyncHandler(async (req, res) => {
  const postData = req.body;
  
  // Handle file uploads
  if (req.files && req.files.length > 0) {
    postData.images = req.files.map(file => `/uploads/${file.filename}`);
  }
  
  // Handle platforms array
  if (postData.platforms && typeof postData.platforms === 'string') {
    postData.platforms = postData.platforms.split(',').map(platform => platform.trim());
  }
  
  const post = await socialService.updateSocialPost(req.params.id, postData);
  res.json(post);
}));

// Delete a social media post
router.delete('/social/posts/:id', asyncHandler(async (req, res) => {
  await socialService.deleteSocialPost(req.params.id);
  res.json({ success: true });
}));

// Publish a social media post
router.post('/social/posts/:id/publish', asyncHandler(async (req, res) => {
  const result = await socialService.publishPost(req.params.id);
  res.json(result);
}));

// Get analytics for a social media post
router.get('/social/posts/:id/analytics', asyncHandler(async (req, res) => {
  const result = await socialService.generateSampleAnalytics(req.params.id);
  res.json(result);
}));

// Get account analytics for all connected social media accounts
router.get('/social/analytics', asyncHandler(async (req, res) => {
  const analytics = await socialService.getAccountAnalytics();
  res.json(analytics);
}));

// Process scheduled social media posts
router.post('/social/process-scheduled', asyncHandler(async (req, res) => {
  const result = await socialService.processScheduledPosts();
  res.json(result);
}));

module.exports = router;
