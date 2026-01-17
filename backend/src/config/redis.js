const Redis = require('ioredis');
require('dotenv').config();

let redisClient;
let useMemoryCache = false;

const createRedisClient = () => {
  const client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: process.env.REDIS_DB || 0,
    retryStrategy: (times) => {
      if (times > 3) {
        // Silently use memory cache - this is expected in development without Redis
        useMemoryCache = true;
        return false; // stop retrying
      }
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: false
  });

  client.on('connect', () => {
    console.log('✓ Redis connected successfully.');
    useMemoryCache = false;
  });

  client.on('error', (err) => {
    // Silently switch to memory cache - this is expected in development
    useMemoryCache = true;
  });

  return client;
};

redisClient = createRedisClient();

// In-memory cache service as fallback
const memoryCache = new Map();
const memoryCacheTTL = new Map();

// Cache utility functions
class CacheService {
  constructor(client, useMemory) {
    this.client = client;
    this.useMemory = useMemory;
  }

  async get(key) {
    try {
      if (this.useMemory || useMemoryCache) {
        return memoryCache.get(key) || null;
      }
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Cache get error:', error.message);
      return null;
    }
  }

  async set(key, value, expiryInSeconds = 3600) {
    try {
      if (this.useMemory || useMemoryCache) {
        memoryCache.set(key, value);
        // Set TTL for memory cache
        if (memoryCacheTTL.has(key)) {
          clearTimeout(memoryCacheTTL.get(key));
        }
        const timeout = setTimeout(() => {
          memoryCache.delete(key);
          memoryCacheTTL.delete(key);
        }, expiryInSeconds * 1000);
        memoryCacheTTL.set(key, timeout);
        return true;
      }
      await this.client.setex(key, expiryInSeconds, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Cache set error:', error.message);
      return false;
    }
  }

  async del(key) {
    try {
      if (this.useMemory || useMemoryCache) {
        memoryCache.delete(key);
        if (memoryCacheTTL.has(key)) {
          clearTimeout(memoryCacheTTL.get(key));
          memoryCacheTTL.delete(key);
        }
        return true;
      }
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error.message);
      return false;
    }
  }

  async exists(key) {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  async flushPattern(pattern) {
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      return true;
    } catch (error) {
      console.error('Cache flush pattern error:', error);
      return false;
    }
  }

  // Store face embeddings
  async storeFaceEmbedding(studentId, embedding) {
    const key = `face:embedding:${studentId}`;
    return this.set(key, embedding, 86400); // 24 hours
  }

  async getFaceEmbedding(studentId) {
    const key = `face:embedding:${studentId}`;
    return this.get(key);
  }

  // Store active QR codes
  async storeQRCode(token, data, ttl = 300) {
    const key = `qr:${token}`;
    return this.set(key, data, ttl);
  }

  async getQRCode(token) {
    const key = `qr:${token}`;
    return this.get(key);
  }

  async deleteQRCode(token) {
    const key = `qr:${token}`;
    return this.del(key);
  }

  // Rate limiting
  async checkRateLimit(identifier, limit, windowInSeconds) {
    const key = `ratelimit:${identifier}`;
    const current = await this.client.incr(key);
    
    if (current === 1) {
      await this.client.expire(key, windowInSeconds);
    }
    
    return {
      count: current,
      exceeded: current > limit,
      remaining: Math.max(0, limit - current)
    };
  }

  // Session management
  async storeSession(sessionId, data, ttl = 3600) {
    const key = `session:${sessionId}`;
    return this.set(key, data, ttl);
  }

  async getSession(sessionId) {
    const key = `session:${sessionId}`;
    return this.get(key);
  }

  async deleteSession(sessionId) {
    const key = `session:${sessionId}`;
    return this.del(key);
  }
}

const cacheService = new CacheService(redisClient);

module.exports = {
  redisClient,
  cacheService
};