/**
 * Dashboard Configuration
 * This file contains configuration settings for the dashboard.
 */

module.exports = {
    // Blog settings
    blog: {
        postsPerPage: 10,
        recentPostsCount: 6,
        featuredPostsCount: 3,
        defaultCategory: 'Uncategorized',
        defaultAuthor: 'Liquetax Team'
    },
    
    // Social media settings
    twitter: {
        apiKey: process.env.TWITTER_API_KEY || '',
        apiSecret: process.env.TWITTER_API_SECRET || '',
        accessToken: process.env.TWITTER_ACCESS_TOKEN || '',
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET || ''
    },
    
    linkedin: {
        clientId: process.env.LINKEDIN_CLIENT_ID || '',
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
        accessToken: process.env.LINKEDIN_ACCESS_TOKEN || '',
        personId: process.env.LINKEDIN_PERSON_ID || ''
    },
    
    facebook: {
        appId: process.env.FACEBOOK_APP_ID || '',
        appSecret: process.env.FACEBOOK_APP_SECRET || '',
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN || ''
    },
    
    // Website settings
    website: {
        name: 'Liquetax',
        domain: 'liquetax.com',
        baseUrl: 'https://liquetax.com',
        blogPath: '/blog-detaile/',
        contactEmail: 'info@liquetax.com'
    },
    
    // Dashboard settings
    dashboard: {
        sessionTimeout: 3600, // 1 hour in seconds
        maxUploadSize: 5 * 1024 * 1024, // 5MB
        allowedImageTypes: ['jpg', 'jpeg', 'png', 'gif'],
        allowedFileTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
    }
}; 