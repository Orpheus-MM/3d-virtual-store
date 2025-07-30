import { createClient } from 'redis'

let redisClient: any = null

export async function connectRedis() {
  const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
  
  try {
    redisClient = createClient({
      url: REDIS_URL
    })
    
    redisClient.on('error', (err: any) => {
      console.error('Redis Client Error:', err)
    })
    
    redisClient.on('connect', () => {
      console.log('Redis connected successfully')
    })
    
    await redisClient.connect()
    
  } catch (error: any) {
    console.warn('Redis connection failed - caching disabled:', error?.message || 'Unknown error')
    // Don't throw error - Redis is optional for development
    console.log('✅ Continuing without Redis (caching disabled)')
    redisClient = null
  }
}

export function getRedisClient() {
  return redisClient
}

export async function cacheSet(key: string, value: any, ttl: number = 3600) {
  if (!redisClient) return
  
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(value))
  } catch (error) {
    console.error('Redis cache set error:', error)
  }
}

export async function cacheGet(key: string) {
  if (!redisClient) return null
  
  try {
    const value = await redisClient.get(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('Redis cache get error:', error)
    return null
  }
}

export async function cacheDel(key: string) {
  if (!redisClient) return
  
  try {
    await redisClient.del(key)
  } catch (error) {
    console.error('Redis cache del error:', error)
  }
}