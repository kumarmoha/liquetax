# Real-Time Social Media Analytics Integration

This document explains how to set up and use the real-time social media analytics functionality in the Liquetax Dashboard.

## Overview

The real-time social media analytics integration allows you to:

1. Connect to multiple social media platforms (Facebook, Twitter, LinkedIn, Instagram, Google)
2. View real-time analytics data from these platforms
3. Monitor engagement, followers, reach, and other key metrics
4. Receive automatic updates without manual refreshing

## Setup Instructions

### 1. Configure API Credentials

To enable real-time analytics, you need to configure API credentials for each social media platform:

1. Navigate to the **Settings** section in the dashboard
2. Click on the **Social Media** tab
3. Enter your API credentials for each platform:
   - **Facebook**: App ID, App Secret, Access Token
   - **Twitter**: API Key, API Secret, Access Token, Access Token Secret
   - **LinkedIn**: Client ID, Client Secret, Access Token
   - **Instagram**: Access Token, User ID
   - **Google**: Client ID, Client Secret, Access Token
4. Enable the "Real-Time Analytics" toggle for each platform you want to monitor
5. Set your preferred refresh interval (minimum 30 seconds)
6. Click "Save API Settings"

### 2. Obtaining API Credentials

#### Facebook
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Navigate to the app settings to find your App ID and App Secret
4. Generate an Access Token with the required permissions (pages_read_engagement, pages_show_list, etc.)

#### Twitter
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app or use an existing one
3. Navigate to the "Keys and Tokens" tab
4. Generate Consumer Keys (API Key and Secret) and Access Token and Secret

#### LinkedIn
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app or use an existing one
3. Navigate to the app settings to find your Client ID and Client Secret
4. Generate an Access Token with the required permissions

#### Instagram
1. Go to [Facebook Developers](https://developers.facebook.com/) (Instagram API is part of Facebook Graph API)
2. Create a new app or use an existing one
3. Add the Instagram Basic Display or Graph API
4. Generate an Access Token with the required permissions
5. Find your Instagram User ID

#### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use an existing one
3. Enable the required APIs (YouTube Data API, Google Analytics API, etc.)
4. Create OAuth credentials to get Client ID and Client Secret
5. Generate an Access Token with the required permissions

## Using the Analytics Dashboard

Once configured, the Analytics section of the dashboard will display real-time data from your connected social media accounts:

1. **Overview Stats**: Total followers, average engagement, total reach, and total posts across all platforms
2. **Platform-Specific Analytics**: Detailed metrics for each connected platform
3. **Real-Time Charts**: Visual representation of engagement, followers, and reach over time

### Controls

- **Refresh All**: Manually refresh data from all connected platforms
- **Real-Time Updates**: Toggle automatic updates on/off
- **Platform Refresh**: Each platform card has its own refresh button

## Troubleshooting

If you encounter issues with the real-time analytics:

1. **Connection Issues**:
   - Verify your API credentials are correct
   - Check that your access tokens haven't expired
   - Ensure you have the necessary API permissions

2. **Data Not Updating**:
   - Check if Real-Time Updates are enabled
   - Try manually refreshing the data
   - Verify your internet connection

3. **Missing Platforms**:
   - Ensure you've configured API credentials for the platform
   - Check that the platform is enabled in the settings

## Technical Details

The real-time analytics functionality uses:

- **Socket.io**: For real-time data streaming
- **Chart.js**: For data visualization
- **Local Storage**: For storing API credentials securely in the browser
- **Platform-specific APIs**: For fetching analytics data

Data is refreshed based on your configured interval, with a minimum of 30 seconds to avoid API rate limiting.

## Privacy and Security

- API credentials are stored in your browser's local storage
- Credentials are never sent to our servers
- All API requests are made directly from your browser to the social media platforms
- We recommend using read-only API tokens with minimal permissions

## Support

If you need assistance with the real-time social media analytics:

- Email: support@liquetax.com
- Phone: +1-800-LIQUETAX
- Live Chat: Available on the dashboard during business hours