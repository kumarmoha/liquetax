# Liquetax Dashboard Guide

A comprehensive guide for the enhanced Liquetax dashboard for monitoring the website, managing blogs, and connecting with social media platforms.

## Features Overview

### Integrated Dashboard

The main dashboard provides a unified view of all key metrics and functionality:

- Real-time website performance monitoring
- Blog post statistics and management
- Social media engagement metrics
- Quick action buttons for common tasks
- Customizable layout and theme options

### Blog Management

Comprehensive blog management system with the following features:

- Create, edit, and publish blog posts with a rich text editor
- Import HTML blog files automatically
- Tag and categorize blog posts
- Schedule posts for future publication
- Automated scanning of designated folders for new HTML blog files
- Automatic updating of the website index when new blogs are found

### Social Media Integration

Connect and manage all your social media platforms in one place:

- Connect to Facebook, Twitter/X, LinkedIn, Instagram, and Google
- View unified analytics across all platforms
- Schedule and publish posts to multiple platforms simultaneously
- Monitor engagement and performance metrics
- Receive notifications for important social media events

### Automation Features

Streamline your workflow with powerful automation tools:

- Automated blog scanning and importing
- Scheduled scanning at customizable intervals
- Automatic index file updates
- Social media post scheduling
- Performance monitoring and alerts

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **UI Framework**: Bootstrap 5
- **Charts**: Chart.js
- **Rich Text Editor**: Quill
- **Data Storage**: LocalStorage (demo), can be extended to use server-side storage

## Getting Started

1. Open `dashboard-new.html` in your web browser
2. Navigate through the different sections using the sidebar
3. Connect your social media accounts in the Social Media section
4. Configure automation settings in the Automation section
5. Start managing your blogs and social media from one central dashboard

## File Structure

- `dashboard-new.html` - Main dashboard HTML file
- `dashboard.js` - Core dashboard functionality
- `dashboard-styles.css` - Dashboard styling
- `blog-automation.js` - Blog automation functionality
- `social-analytics.js` - Enhanced social media analytics
- `social-connect.js` - Social media connection functionality
- `integrated-dashboard.js` - Unified dashboard experience

## Customization

The dashboard can be customized in several ways:

1. **Theme**: Choose between light, dark, blue, or green themes
2. **Widgets**: Show/hide different dashboard components
3. **Layout**: Rearrange dashboard elements to suit your workflow
4. **Automation Settings**: Configure scanning intervals and folder paths

## Blog Automation

The blog automation system automatically scans designated folders for HTML blog files and updates the website index. Key features include:

1. **Folder Monitoring**: Watches a specified folder for new HTML blog files
2. **Content Extraction**: Parses HTML files to extract title, meta description, and content
3. **Auto-Indexing**: Automatically updates the website index with new blog posts
4. **Scheduled Scanning**: Periodically checks for new blog files at configurable intervals

### Setting Up Blog Automation

1. Navigate to the Automation section in the dashboard
2. Set the path to your HTML blog files folder
3. Configure the scan interval (how often to check for new files)
4. Enable auto-indexing if you want the index to update automatically
5. Click "Scan Now" to perform an immediate scan

## Social Media Management

The social media management system provides a unified interface for managing all your social media platforms. Key features include:

1. **Platform Connections**: Connect to Facebook, Twitter/X, LinkedIn, Instagram, and Google
2. **Analytics Dashboard**: View engagement metrics across all platforms
3. **Content Publishing**: Create and schedule posts for multiple platforms
4. **Performance Monitoring**: Track the performance of your social media content

### Connecting Social Media Accounts

1. Navigate to the Social Media section in the dashboard
2. Go to the Connections tab
3. Click the Connect button next to each platform you want to connect
4. Follow the authentication process for each platform
5. Once connected, you'll see analytics and be able to publish content

## Website Monitoring

The dashboard includes comprehensive website monitoring features:

1. **Performance Tracking**: Monitor page load times and server response times
2. **Uptime Monitoring**: Track website availability
3. **Error Tracking**: Monitor JavaScript errors and server exceptions
4. **Traffic Analysis**: View visitor statistics and behavior

## Dashboard Customization

To customize your dashboard:

1. Click the "Customize" button in the top-right corner of the dashboard
2. Select which widgets to display
3. Choose your preferred theme
4. Save your changes

## Troubleshooting

If you encounter issues:

1. **Social Media Connections**: Try reconnecting the account
2. **Blog Importing**: Ensure HTML files are properly formatted
3. **Dashboard Loading**: Check browser console for errors
4. **Performance Issues**: Try refreshing the dashboard or clearing browser cache

## Best Practices

1. **Regular Scanning**: Set up automatic scanning at reasonable intervals (e.g., hourly)
2. **Content Planning**: Use the social media scheduling feature to plan content in advance
3. **Performance Monitoring**: Regularly check website performance metrics
4. **Backup**: Regularly export your blog posts and settings
5. **Security**: Keep your social media credentials secure