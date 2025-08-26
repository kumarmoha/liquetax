# Real-Time Social Media Analytics Implementation Guide

This guide provides step-by-step instructions for implementing the real-time social media analytics functionality in the Liquetax Dashboard.

## Overview

The real-time social media analytics integration allows you to connect to multiple social media platforms and view analytics data in real-time. This implementation addresses the issue with the current dashboard where analytics data is static and requires manual refreshing.

## Implementation Steps

### 1. Add Required Libraries

First, ensure the required libraries are included in your HTML file:

```html
<!-- Chart.js for analytics -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<!-- Socket.io for real-time data -->
<script src="https://cdn.socket.io/4.6.0/socket.io.min.js"></script>
```

### 2. Add the Real-Time Analytics Script

Add the `social-analytics-realtime.js` script to your HTML file:

```html
<!-- Real-time social media analytics -->
<script src="social-analytics-realtime.js"></script>
```

### 3. Update the Settings Tab

The social media settings tab has been enhanced to include API credential fields and real-time settings. Make sure your HTML includes these updated fields.

### 4. Testing the Implementation

To test the implementation:

1. Open the dashboard in your browser
2. Navigate to the Settings section
3. Go to the Social Media tab
4. Enter test API credentials for at least one platform
5. Save the settings
6. Navigate to the Analytics section
7. Verify that the real-time analytics are displayed

## Troubleshooting

### Multiple Analytics Sections

The dashboard has multiple sections with the ID "analytics". The script has been updated to handle this by:

1. Finding all analytics sections
2. Determining which one is currently visible
3. Initializing only the visible section
4. Adding event listeners to handle navigation between sections

If you encounter issues with the analytics not appearing:

1. Check the browser console for errors
2. Verify that the correct analytics section is being initialized
3. Make sure the API credentials are properly saved

### Real-Time Updates Not Working

If real-time updates are not working:

1. Check if the "Real-Time Updates" toggle is set to "ON"
2. Verify that the refresh interval is set correctly in the settings
3. Check the browser console for any errors related to the refresh interval

## API Integration

The script is designed to work with the following social media APIs:

- Facebook Graph API
- Twitter API v2
- LinkedIn Marketing API
- Instagram Graph API
- Google Analytics API

For each platform, you need to provide the appropriate API credentials in the settings.

## Security Considerations

API credentials are stored in the browser's localStorage. In a production environment, you should:

1. Use a secure backend to store API credentials
2. Implement proper authentication and authorization
3. Use HTTPS to encrypt all communications
4. Consider using a proxy server to make API requests

## Customization

You can customize the real-time analytics by:

1. Modifying the refresh interval in the settings
2. Changing the chart types and colors in the `updateAnalyticsChart` function
3. Adding additional metrics in the `generateRandomAnalyticsData` function
4. Customizing the UI elements in the `createAnalyticsContainer` function

## Support

If you need assistance with the implementation, please contact:

- Email: support@liquetax.com
- Phone: +1-800-LIQUETAX