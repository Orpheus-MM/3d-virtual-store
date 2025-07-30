import type { AnalyticsEvent, UserBehavior } from '@shared/types'
import { cacheGet, cacheSet } from '../config/redis'

export class AnalyticsService {
  private static events: AnalyticsEvent[] = [] // In-memory storage for demo
  private static readonly CACHE_TTL = 1800 // 30 minutes

  /**
   * Track a user event
   */
  static async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Store event (in production: save to database)
      this.events.push(event)
      
      // Keep only recent events in memory (last 1000)
      if (this.events.length > 1000) {
        this.events = this.events.slice(-1000)
      }
      
      console.log(`Analytics event tracked: ${event.eventType} for user ${event.userId || 'anonymous'}`)
      
      // Trigger real-time analytics processing
      await this.processEventRealTime(event)
      
    } catch (error) {
      console.error('Error tracking analytics event:', error)
    }
  }

  /**
   * Get user behavior summary
   */
  static async getUserBehavior(userId: string, sessionId?: string): Promise<UserBehavior | null> {
    try {
      const cacheKey = `behavior:${userId}:${sessionId || 'all'}`
      const cached = await cacheGet(cacheKey)
      if (cached) {
        return cached
      }

      // Filter events for this user/session
      const userEvents = this.events.filter(event => 
        event.userId === userId && 
        (!sessionId || event.sessionId === sessionId)
      )

      if (userEvents.length === 0) {
        return null
      }

      // Calculate behavior summary
      const behavior: UserBehavior = {
        userId,
        sessionId: sessionId || 'all',
        events: userEvents,
        summary: {
          totalTime: this.calculateTotalTime(userEvents),
          productsViewed: this.countUniqueProducts(userEvents, 'view_product'),
          itemsAddedToCart: this.countEvents(userEvents, 'add_to_cart'),
          checkoutAttempts: this.countEvents(userEvents, 'checkout'),
          purchaseValue: this.calculatePurchaseValue(userEvents)
        }
      }

      // Cache the result
      await cacheSet(cacheKey, behavior, this.CACHE_TTL)
      
      return behavior
    } catch (error) {
      console.error('Error getting user behavior:', error)
      return null
    }
  }

  /**
   * Get analytics dashboard data
   */
  static async getDashboardData(): Promise<any> {
    try {
      const cached = await cacheGet('dashboard:analytics')
      if (cached) {
        return cached
      }

      const now = new Date()
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      
      const recentEvents = this.events.filter(event => 
        new Date(event.timestamp) >= last24Hours
      )

      const dashboard = {
        totalEvents: recentEvents.length,
        uniqueUsers: new Set(recentEvents.map(e => e.userId).filter(Boolean)).size,
        uniqueSessions: new Set(recentEvents.map(e => e.sessionId)).size,
        topEvents: this.getTopEvents(recentEvents),
        topProducts: this.getTopProducts(recentEvents),
        conversionRate: this.calculateConversionRate(recentEvents),
        averageSessionDuration: this.calculateAverageSessionDuration(recentEvents),
        timestamp: now
      }

      await cacheSet('dashboard:analytics', dashboard, 300) // 5 minutes cache
      
      return dashboard
    } catch (error) {
      console.error('Error getting dashboard data:', error)
      return null
    }
  }

  /**
   * Get product analytics
   */
  static async getProductAnalytics(productId: string): Promise<any> {
    try {
      const cacheKey = `product:analytics:${productId}`
      const cached = await cacheGet(cacheKey)
      if (cached) {
        return cached
      }

      const productEvents = this.events.filter(event => 
        event.properties.productId === productId
      )

      const analytics = {
        productId,
        totalViews: this.countEvents(productEvents, 'view_product'),
        totalAddToCarts: this.countEvents(productEvents, 'add_to_cart'),
        conversionRate: this.calculateProductConversionRate(productEvents),
        averageViewDuration: this.calculateAverageViewDuration(productEvents),
        uniqueViewers: new Set(productEvents.map(e => e.userId).filter(Boolean)).size,
        viewsByHour: this.getViewsByHour(productEvents),
        timestamp: new Date()
      }

      await cacheSet(cacheKey, analytics, this.CACHE_TTL)
      
      return analytics
    } catch (error) {
      console.error('Error getting product analytics:', error)
      return null
    }
  }

  /**
   * Process event in real-time for immediate insights
   */
  private static async processEventRealTime(event: AnalyticsEvent): Promise<void> {
    try {
      // Example: Detect high-intent users
      if (event.eventType === 'view_product' && event.userId) {
        const userEvents = this.events.filter(e => 
          e.userId === event.userId && 
          e.eventType === 'view_product'
        )
        
        // If user has viewed many products recently, they might be ready to buy
        if (userEvents.length >= 5) {
          console.log(`High-intent user detected: ${event.userId}`)
          // Could trigger personalized offers, etc.
        }
      }

      // Example: Detect cart abandonment
      if (event.eventType === 'add_to_cart' && event.userId) {
        // Set up a delayed check for cart abandonment
        setTimeout(async () => {
          const recentEvents = this.events.filter(e => 
            e.userId === event.userId && 
            e.timestamp > event.timestamp &&
            (e.eventType === 'checkout' || e.eventType === 'remove_from_cart')
          )
          
          if (recentEvents.length === 0) {
            console.log(`Potential cart abandonment detected for user: ${event.userId}`)
            // Could trigger retargeting campaigns
          }
        }, 15 * 60 * 1000) // Check after 15 minutes
      }
      
    } catch (error) {
      console.error('Error processing real-time event:', error)
    }
  }

  // Helper methods
  private static calculateTotalTime(events: AnalyticsEvent[]): number {
    if (events.length < 2) return 0
    
    const sortedEvents = events.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
    
    const firstEvent = new Date(sortedEvents[0].timestamp)
    const lastEvent = new Date(sortedEvents[sortedEvents.length - 1].timestamp)
    
    return lastEvent.getTime() - firstEvent.getTime()
  }

  private static countUniqueProducts(events: AnalyticsEvent[], eventType: string): number {
    const products = new Set(
      events
        .filter(e => e.eventType === eventType && e.properties.productId)
        .map(e => e.properties.productId)
    )
    return products.size
  }

  private static countEvents(events: AnalyticsEvent[], eventType: string): number {
    return events.filter(e => e.eventType === eventType).length
  }

  private static calculatePurchaseValue(events: AnalyticsEvent[]): number | undefined {
    const purchaseEvents = events.filter(e => e.eventType === 'checkout')
    if (purchaseEvents.length === 0) return undefined
    
    return purchaseEvents.reduce((total, event) => 
      total + (event.properties.total || 0), 0
    )
  }

  private static getTopEvents(events: AnalyticsEvent[]): Array<{ event: string; count: number }> {
    const eventCounts: { [key: string]: number } = {}
    
    events.forEach(event => {
      eventCounts[event.eventType] = (eventCounts[event.eventType] || 0) + 1
    })
    
    return Object.entries(eventCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([event, count]) => ({ event, count }))
  }

  private static getTopProducts(events: AnalyticsEvent[]): Array<{ productId: string; views: number }> {
    const productViews: { [key: string]: number } = {}
    
    events.forEach(event => {
      if (event.eventType === 'view_product' && event.properties.productId) {
        const productId = event.properties.productId
        productViews[productId] = (productViews[productId] || 0) + 1
      }
    })
    
    return Object.entries(productViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([productId, views]) => ({ productId, views }))
  }

  private static calculateConversionRate(events: AnalyticsEvent[]): number {
    const views = this.countEvents(events, 'view_product')
    const purchases = this.countEvents(events, 'checkout')
    
    return views > 0 ? (purchases / views) * 100 : 0
  }

  private static calculateAverageSessionDuration(events: AnalyticsEvent[]): number {
    const sessionDurations: { [key: string]: number } = {}
    
    // Group events by session
    const sessionEvents: { [key: string]: AnalyticsEvent[] } = {}
    events.forEach(event => {
      if (!sessionEvents[event.sessionId]) {
        sessionEvents[event.sessionId] = []
      }
      sessionEvents[event.sessionId].push(event)
    })
    
    // Calculate duration for each session
    Object.entries(sessionEvents).forEach(([sessionId, sessionEventList]) => {
      if (sessionEventList.length >= 2) {
        const sortedEvents = sessionEventList.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
        
        const firstEvent = new Date(sortedEvents[0].timestamp)
        const lastEvent = new Date(sortedEvents[sortedEvents.length - 1].timestamp)
        
        sessionDurations[sessionId] = lastEvent.getTime() - firstEvent.getTime()
      }
    })
    
    const durations = Object.values(sessionDurations)
    return durations.length > 0 
      ? durations.reduce((a, b) => a + b, 0) / durations.length 
      : 0
  }

  private static calculateProductConversionRate(events: AnalyticsEvent[]): number {
    const views = this.countEvents(events, 'view_product')
    const addToCarts = this.countEvents(events, 'add_to_cart')
    
    return views > 0 ? (addToCarts / views) * 100 : 0
  }

  private static calculateAverageViewDuration(events: AnalyticsEvent[]): number {
    const viewEvents = events.filter(e => 
      e.eventType === 'view_product' && e.properties.duration
    )
    
    if (viewEvents.length === 0) return 0
    
    const totalDuration = viewEvents.reduce((sum, event) => 
      sum + (event.properties.duration || 0), 0
    )
    
    return totalDuration / viewEvents.length
  }

  private static getViewsByHour(events: AnalyticsEvent[]): Array<{ hour: number; views: number }> {
    const hourCounts: { [key: number]: number } = {}
    
    events
      .filter(e => e.eventType === 'view_product')
      .forEach(event => {
        const hour = new Date(event.timestamp).getHours()
        hourCounts[hour] = (hourCounts[hour] || 0) + 1
      })
    
    return Array.from({ length: 24 }, (_, hour) => ({
      hour,
      views: hourCounts[hour] || 0
    }))
  }
}