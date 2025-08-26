# Liquetax Admin Dashboard Setup Guide

## ✅ Issues Fixed

### 1. Facebook SDK Configuration
- ✅ **Fixed**: Updated Facebook SDK from debug version to production version
- ✅ **Fixed**: Synchronized SDK version (v23.0) between dashboard and main site
- ✅ **Fixed**: Proper cookie handling and configuration

### 2. OAuth Flow Implementation
- ✅ **Fixed**: Replaced `simple-social.html` redirects with proper OAuth endpoints
- ✅ **Fixed**: All social media buttons now redirect to `/auth/{platform}` endpoints
- ✅ **Fixed**: Added real-time connection status updates
- ✅ **Fixed**: Enhanced user feedback with notifications

### 3. CSS Optimization
- ✅ **Fixed**: Removed non-existent `dashboard-styles.css` reference
- ✅ **Fixed**: Consolidated CSS loading for better performance
- ✅ **Fixed**: Maintained separate files for main styles and animations

### 4. Enhanced User Experience
- ✅ **Added**: Real-time success/error indicators
- ✅ **Added**: User profile display after successful connection
- ✅ **Added**: Auto-detection of connection status
- ✅ **Added**: Enhanced notification system

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ installed
- Facebook App ID and Secret
- Other social media app credentials (optional)

### 1. Install Dependencies
```bash
cd admin-dashboard
npm install
```

### 2. Environment Setup
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

### 3. Configure Social Media Apps

#### Facebook App Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing app ID: `392832006062324`
3. Add your callback URL: `http://localhost:3000/auth/facebook/callback`
4. Copy App ID and Secret to `.env` file

#### Google OAuth Setup (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add callback URL: `http://localhost:3000/auth/google/callback`
4. Add credentials to `.env` file

#### Twitter API Setup (Optional)
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create an app and get API keys
3. Add callback URL: `http://localhost:3000/auth/twitter/callback`
4. Add credentials to `.env` file

### 4. Start the Server
```bash
npm start
```

### 5. Access the Dashboard
- Dashboard: http://localhost:3000/admin-dashboard
- Main Site: http://localhost:3000

## 🔧 Configuration

### Environment Variables (.env)
```env
# Facebook (Required)
FACEBOOK_APP_ID=392832006062324
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Google (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Twitter (Optional)
TWITTER_CONSUMER_KEY=your_twitter_consumer_key
TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret

# LinkedIn (Optional)
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Server Configuration
SESSION_SECRET=your_random_session_secret
PORT=3000
NODE_ENV=development
```

## 📱 Social Media Integration

### Supported Platforms
- ✅ Facebook (Fully implemented)
- ✅ Instagram (Via Facebook Business)
- ✅ Google/YouTube (OAuth ready)
- ✅ Twitter (OAuth ready)
- ✅ LinkedIn (OAuth ready)

### How It Works
1. User clicks "Connect" button in dashboard
2. Redirects to `/auth/{platform}` endpoint
3. OAuth flow handles authentication
4. User returns to dashboard with connection status
5. Profile information is displayed
6. Connection status is stored in session

## 🎯 Features

### Real-time Updates
- Connection status updates automatically
- User profile information displayed after connection
- Success/error notifications
- Periodic status checks every 30 seconds

### Enhanced UI/UX
- Modern glass-effect design
- Smooth animations and transitions
- Responsive layout
- Toast notifications
- Loading states

### Security
- Secure session management
- OAuth 2.0 implementation
- Environment variable protection
- CSRF protection ready

## 🐛 Troubleshooting

### Common Issues

#### 1. "Cannot GET /auth/facebook"
**Solution**: Make sure the server is running and OAuth routes are properly configured.

#### 2. Facebook Login Not Working
**Solution**: 
- Check Facebook App ID in both `.env` and HTML files
- Verify callback URL in Facebook App settings
- Ensure Facebook App is not in development mode for production

#### 3. "showNotification is not defined"
**Solution**: The notification system has fallbacks. Check browser console for any JavaScript errors.

#### 4. CSS Not Loading
**Solution**: 
- Verify file paths in `dashboard-new.html`
- Check if CSS files exist in `public/css/` directory
- Clear browser cache

### Debug Mode
To enable debug logging:
```bash
DEBUG=* npm start
```

## 📊 API Endpoints

### Authentication Status
```
GET /api/auth/connected
Response: {
  "facebook": { "connected": true, "profile": {...} },
  "google": { "connected": false, "profile": null },
  ...
}
```

### User Profile
```
GET /api/auth/profile/{platform}
Response: {
  "id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  ...
}
```

## 🔄 Development

### File Structure
```
admin-dashboard/
├── server.js              # Main server file
├── dashboard-new.html     # Dashboard interface
├── package.json           # Dependencies
├── .env.example          # Environment template
├── api/                  # API routes and services
│   ├── authRoutes.js     # OAuth routes
│   ├── routes.js         # General API routes
│   └── tokenManager.js   # Token management
├── js/                   # Frontend JavaScript
│   ├── oauth-connections.js  # OAuth handling
│   ├── dashboard-core.js     # Core functionality
│   └── social-media.js       # Social media features
└── public/css/           # Stylesheets
    ├── dashboard.css     # Main styles
    └── dashboard-animations.css  # Animations
```

### Adding New Platforms
1. Add OAuth strategy to `server.js`
2. Add routes in `api/authRoutes.js`
3. Update frontend in `js/oauth-connections.js`
4. Add UI elements in `dashboard-new.html`

## 📞 Support

For issues or questions:
1. Check this setup guide
2. Review browser console for errors
3. Check server logs
4. Verify environment variables
5. Test with minimal configuration first

## 🎉 Success Checklist

- [ ] Server starts without errors
- [ ] Dashboard loads at http://localhost:3000/admin-dashboard
- [ ] Facebook connect button works
- [ ] Connection status updates in real-time
- [ ] User profile displays after connection
- [ ] Notifications appear for success/error states
- [ ] No console errors in browser
- [ ] CSS styles load properly

Once all items are checked, your social media integration is ready! 🚀