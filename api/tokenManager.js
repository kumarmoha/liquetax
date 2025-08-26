/**
 * Token Manager
 * Handles storage, retrieval, and verification of OAuth tokens
 */
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class TokenManager {
  constructor() {
    this.tokensFilePath = path.join(__dirname, '../data/tokens.json');
    this.tokens = {};
    this.initialize();
  }

  async initialize() {
    try {
      // Create the data directory if it doesn't exist
      await fs.mkdir(path.dirname(this.tokensFilePath), { recursive: true });
      
      // Try to load existing tokens
      try {
        const data = await fs.readFile(this.tokensFilePath, 'utf8');
        this.tokens = JSON.parse(data);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.error('Error reading tokens file:', error);
        }
        // If file doesn't exist, initialize with empty object
        this.tokens = {};
        await this.saveTokens();
      }
    } catch (error) {
      console.error('Error initializing token manager:', error);
    }
  }

  async saveTokens() {
    try {
      await fs.writeFile(this.tokensFilePath, JSON.stringify(this.tokens, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  }

  async storeToken(platform, userId, tokenData) {
    if (!this.tokens[platform]) {
      this.tokens[platform] = {};
    }
    
    // Encrypt sensitive token data
    const encryptedData = this.encryptData(JSON.stringify(tokenData));
    
    this.tokens[platform][userId] = {
      userId,
      platform,
      encryptedData,
      connectedAt: new Date().toISOString(),
      expiresAt: tokenData.expiresAt || null
    };
    
    await this.saveTokens();
    return true;
  }

  async getToken(platform, userId) {
    if (!this.tokens[platform] || !this.tokens[platform][userId]) {
      return null;
    }
    
    const tokenEntry = this.tokens[platform][userId];
    
    // Check if token is expired
    if (tokenEntry.expiresAt && new Date(tokenEntry.expiresAt) < new Date()) {
      return null;
    }
    
    // Decrypt the token data
    try {
      const decryptedData = this.decryptData(tokenEntry.encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Error decrypting token:', error);
      return null;
    }
  }

  async removeToken(platform, userId) {
    if (this.tokens[platform] && this.tokens[platform][userId]) {
      delete this.tokens[platform][userId];
      await this.saveTokens();
      return true;
    }
    return false;
  }

  async getConnectedPlatforms() {
    const connectedPlatforms = {};
    
    for (const platform in this.tokens) {
      const userIds = Object.keys(this.tokens[platform]);
      if (userIds.length > 0) {
        connectedPlatforms[platform] = userIds.map(userId => {
          const { connectedAt, expiresAt } = this.tokens[platform][userId];
          return { userId, connectedAt, expiresAt };
        });
      }
    }
    
    return connectedPlatforms;
  }

  async verifyToken(platform, userId) {
    const token = await this.getToken(platform, userId);
    return !!token;
  }

  // Encryption/decryption helpers
  encryptData(data) {
    // In a production environment, use a proper encryption key management system
    const encryptionKey = process.env.ENCRYPTION_KEY || 'default-encryption-key-for-development-only';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey.padEnd(32).slice(0, 32)), iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  decryptData(encryptedData) {
    const encryptionKey = process.env.ENCRYPTION_KEY || 'default-encryption-key-for-development-only';
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey.padEnd(32).slice(0, 32)), iv);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

module.exports = new TokenManager();
