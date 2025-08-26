#!/usr/bin/env node

// Simple working server for Liquetax Dashboard
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Serve the dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard-new.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard-new.html'));
});

app.get('/dashboard-new.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard-new.html'));
});

// Basic API endpoints for blog management
app.get('/api/blogs', (req, res) => {
    // Mock blog data
    const blogs = [
        {
            id: 1,
            title: 'Getting Started with Liquetax',
            excerpt: 'Learn how to use our platform effectively',
            date: '2024-06-16',
            status: 'published'
        },
        {
            id: 2,
            title: 'Tax Optimization Tips',
            excerpt: 'Save money with these expert tips',
            date: '2024-06-15',
            status: 'draft'
        }
    ];
    res.json(blogs);
});

app.post('/api/blogs', (req, res) => {
    console.log('New blog post:', req.body);
    res.json({ 
        success: true, 
        message: 'Blog post created successfully',
        id: Date.now()
    });
});

app.put('/api/blogs/:id', (req, res) => {
    console.log('Updating blog post:', req.params.id, req.body);
    res.json({ 
        success: true, 
        message: 'Blog post updated successfully'
    });
});

app.delete('/api/blogs/:id', (req, res) => {
    console.log('Deleting blog post:', req.params.id);
    res.json({ 
        success: true, 
        message: 'Blog post deleted successfully'
    });
});

// Social media mock endpoints
app.get('/api/social/status', (req, res) => {
    res.json({
        facebook: { connected: false, reason: 'API key not configured' },
        twitter: { connected: false, reason: 'API key not configured' },
        linkedin: { connected: false, reason: 'API key not configured' }
    });
});

app.post('/api/social/connect/:platform', (req, res) => {
    console.log('Connecting to platform:', req.params.platform);
    res.json({ 
        success: true, 
        message: `Connected to ${req.params.platform} successfully`
    });
});

// Analytics mock endpoint
app.get('/api/analytics', (req, res) => {
    res.json({
        visitors: 1234,
        pageviews: 5678,
        posts: 23,
        comments: 45,
        socialShares: 89
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not found',
        path: req.path 
    });
});

// Start server
app.listen(port, () => {
    console.log('🚀 Liquetax Dashboard Server Started!');
    console.log('================================');
    console.log(`📱 Dashboard: http://localhost:${port}/dashboard-new.html`);
    console.log(`🔧 API: http://localhost:${port}/api/`);
    console.log(`📊 Health: http://localhost:${port}/health`);
    console.log('================================');
    console.log('✅ Server is running and ready!');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

module.exports = app;
