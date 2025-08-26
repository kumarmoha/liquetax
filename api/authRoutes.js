/**
 * OAuth Authentication Routes
 * Implements OAuth flow for various platforms
 */
const express = require('express');
const router = express.Router();
const tokenManager = require('./tokenManager');
const { TwitterApi } = require('twitter-api-v2');
const fetch = require('node-fetch');
const oauthConfig = require('../oauth-config');

// Middleware to handle errors
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Twitter OAuth routes
router.get('/twitter', asyncHandler(async (req, res) => {
  try {
    const client = new TwitterApi({
      appKey: oauthConfig.twitter.consumerKey,
      appSecret: oauthConfig.twitter.consumerSecret
    });
    
    const authLink = await client.generateAuthLink(oauthConfig.twitter.callbackURL);
    
    // Store the oauth token secret to verify the callback
    req.session.twitterOAuthSecret = authLink.oauth_token_secret;
    
    res.redirect(authLink.url);
  } catch (error) {
    console.error('Twitter auth error:', error);
    res.status(500).json({ error: 'Failed to initialize Twitter authentication' });
  }
}));

router.get('/twitter/callback', asyncHandler(async (req, res) => {
  try {
    const { oauth_token, oauth_verifier } = req.query;
    const { twitterOAuthSecret } = req.session;
    
    if (!oauth_token || !oauth_verifier || !twitterOAuthSecret) {
      return res.status(400).json({ error: 'Invalid OAuth callback parameters' });
    }
    
    const client = new TwitterApi({
      appKey: oauthConfig.twitter.consumerKey,
      appSecret: oauthConfig.twitter.consumerSecret,
      accessToken: oauth_token,
      accessSecret: twitterOAuthSecret
    });
    
    const { client: loggedClient, accessToken, accessSecret } = await client.login(oauth_verifier);
    
    // Get user information
    const currentUser = await loggedClient.currentUser();
    
    // Store the tokens
    await tokenManager.storeToken('twitter', currentUser.id_str, {
      accessToken,
      accessSecret,
      profile: {
        id: currentUser.id_str,
        username: currentUser.screen_name,
        name: currentUser.name,
        profileImage: currentUser.profile_image_url_https
      }
    });
    
    // Clear the session OAuth secret
    delete req.session.twitterOAuthSecret;
    
    // Redirect to dashboard with success
    res.redirect('/?platform=twitter&status=connected');
  } catch (error) {
    console.error('Twitter callback error:', error);
    res.redirect('/?platform=twitter&status=error');
  }
}));

// Facebook OAuth routes
router.get('/facebook', (req, res) => {
  const authUrl = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${oauthConfig.facebook.clientID}&redirect_uri=${encodeURIComponent(oauthConfig.facebook.callbackURL)}&scope=email,public_profile,pages_manage_posts,pages_read_engagement`;
  res.redirect(authUrl);
});

router.get('/facebook/callback', asyncHandler(async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.redirect('/?platform=facebook&status=error');
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch(`https://graph.facebook.com/v17.0/oauth/access_token?client_id=${oauthConfig.facebook.clientID}&redirect_uri=${encodeURIComponent(oauthConfig.facebook.callbackURL)}&client_secret=${oauthConfig.facebook.clientSecret}&code=${code}`);
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to obtain access token');
    }
    
    // Get user profile
    const profileResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`);
    const profileData = await profileResponse.json();
    
    // Store the tokens
    await tokenManager.storeToken('facebook', profileData.id, {
      accessToken: tokenData.access_token,
      expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
      profile: {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        profileImage: profileData.picture?.data?.url
      }
    });
    
    res.redirect('/?platform=facebook&status=connected');
  } catch (error) {
    console.error('Facebook callback error:', error);
    res.redirect('/?platform=facebook&status=error');
  }
}));

// LinkedIn OAuth routes
router.get('/linkedin', (req, res) => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${oauthConfig.linkedin.clientID}&redirect_uri=${encodeURIComponent(oauthConfig.linkedin.callbackURL)}&scope=${encodeURIComponent(oauthConfig.linkedin.scope.join(' '))}`;
  res.redirect(authUrl);
});

router.get('/linkedin/callback', asyncHandler(async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.redirect('/?platform=linkedin&status=error');
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: oauthConfig.linkedin.callbackURL,
        client_id: oauthConfig.linkedin.clientID,
        client_secret: oauthConfig.linkedin.clientSecret
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to obtain access token');
    }
    
    // Get user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`
      }
    });
    
    const profileData = await profileResponse.json();
    
    // Store the tokens
    await tokenManager.storeToken('linkedin', profileData.id, {
      accessToken: tokenData.access_token,
      expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
      profile: {
        id: profileData.id,
        firstName: profileData.localizedFirstName,
        lastName: profileData.localizedLastName
      }
    });
    
    res.redirect('/?platform=linkedin&status=connected');
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    res.redirect('/?platform=linkedin&status=error');
  }
}));

// Google OAuth routes
router.get('/google', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${oauthConfig.google.clientID}&redirect_uri=${encodeURIComponent(oauthConfig.google.callbackURL)}&scope=${encodeURIComponent(oauthConfig.google.scope.join(' '))}&access_type=offline&prompt=consent`;
  res.redirect(authUrl);
});

router.get('/google/callback', asyncHandler(async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.redirect('/?platform=google&status=error');
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code,
        client_id: oauthConfig.google.clientID,
        client_secret: oauthConfig.google.clientSecret,
        redirect_uri: oauthConfig.google.callbackURL,
        grant_type: 'authorization_code'
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to obtain access token');
    }
    
    // Get user profile
    const profileResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenData.access_token}`);
    const profileData = await profileResponse.json();
    
    // Store the tokens
    await tokenManager.storeToken('google', profileData.sub, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
      profile: {
        id: profileData.sub,
        name: profileData.name,
        email: profileData.email,
        picture: profileData.picture
      }
    });
    
    res.redirect('/?platform=google&status=connected');
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect('/?platform=google&status=error');
  }
}));

// Instagram OAuth routes
router.get('/instagram', (req, res) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${oauthConfig.instagram.clientID}&redirect_uri=${encodeURIComponent(oauthConfig.instagram.callbackURL)}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authUrl);
});

router.get('/instagram/callback', asyncHandler(async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.redirect('/?platform=instagram&status=error');
    }
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: oauthConfig.instagram.clientID,
        client_secret: oauthConfig.instagram.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: oauthConfig.instagram.callbackURL,
        code
      })
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to obtain access token');
    }
    
    // Get user profile
    const profileResponse = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`);
    const profileData = await profileResponse.json();
    
    // Store the tokens
    await tokenManager.storeToken('instagram', profileData.id, {
      accessToken: tokenData.access_token,
      profile: {
        id: profileData.id,
        username: profileData.username
      }
    });
    
    res.redirect('/?platform=instagram&status=connected');
  } catch (error) {
    console.error('Instagram callback error:', error);
    res.redirect('/?platform=instagram&status=error');
  }
}));

// Get connected accounts
router.get('/connected', asyncHandler(async (req, res) => {
  try {
    const connectedPlatforms = await tokenManager.getConnectedPlatforms();
    res.json(connectedPlatforms);
  } catch (error) {
    console.error('Error getting connected accounts:', error);
    res.status(500).json({ error: 'Failed to get connected accounts' });
  }
}));

// Verify token
router.get('/verify/:platform/:userId', asyncHandler(async (req, res) => {
  try {
    const { platform, userId } = req.params;
    const isValid = await tokenManager.verifyToken(platform, userId);
    res.json({ valid: isValid });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ error: 'Failed to verify token' });
  }
}));

// Disconnect account
router.post('/disconnect/:platform/:userId', asyncHandler(async (req, res) => {
  try {
    const { platform, userId } = req.params;
    const result = await tokenManager.removeToken(platform, userId);
    res.json({ success: result });
  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({ error: 'Failed to disconnect account' });
  }
}));

// Get profile data for a platform
router.get('/profile/:platform', asyncHandler(async (req, res) => {
  try {
    const { platform } = req.params;
    const connectedPlatforms = await tokenManager.getConnectedPlatforms();
    
    if (connectedPlatforms[platform] && connectedPlatforms[platform].profile) {
      res.json(connectedPlatforms[platform].profile);
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}));

module.exports = router;
