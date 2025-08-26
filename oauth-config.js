/**
 * OAuth Configuration
 * Contains configuration for various OAuth providers
 */
require('dotenv').config();

module.exports = {
  // Twitter OAuth Configuration
  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL || 'http://localhost:3000/auth/twitter/callback',
    passReqToCallback: true
  },
  
  // Facebook OAuth Configuration
  facebook: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'https://liquetax.com/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email'],
    passReqToCallback: true
  },
  
  // LinkedIn OAuth Configuration
  linkedin: {
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3000/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
    passReqToCallback: true
  },
  
  // Google OAuth Configuration
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    scope: ['profile', 'email'],
    passReqToCallback: true
  },
  
  // Instagram OAuth Configuration
  instagram: {
    clientID: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackURL: process.env.INSTAGRAM_CALLBACK_URL || 'http://localhost:3000/auth/instagram/callback',
    passReqToCallback: true
  },

  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }
};
