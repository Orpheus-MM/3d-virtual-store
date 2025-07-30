import { Server as SocketIOServer, Socket } from 'socket.io'
import type { 
  SocketEvent, 
  UserInteractionEvent, 
  CartUpdateEvent,
  AnalyticsEvent 
} from '@shared/types'

import { PersonalizationService } from '../services/PersonalizationService'
import { AnalyticsService } from '../services/AnalyticsService'

interface ConnectedUser {
  socketId: string
  userId?: string
  sessionId: string
  joinedAt: Date
  lastActivity: Date
}

const connectedUsers: Map<string, ConnectedUser> = new Map()
const sessionRooms: Map<string, Set<string>> = new Map()

export function socketHandler(io: SocketIOServer) {
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`)

    // Handle user joining a session
    socket.on('join_session', async (data: { sessionId: string; userId?: string }) => {
      const { sessionId, userId } = data
      
      // Store user info
      const user: ConnectedUser = {
        socketId: socket.id,
        userId,
        sessionId,
        joinedAt: new Date(),
        lastActivity: new Date()
      }
      
      connectedUsers.set(socket.id, user)
      
      // Join session room
      socket.join(sessionId)
      
      // Track session rooms
      if (!sessionRooms.has(sessionId)) {
        sessionRooms.set(sessionId, new Set())
      }
      sessionRooms.get(sessionId)!.add(socket.id)
      
      console.log(`User ${userId || 'anonymous'} joined session ${sessionId}`)
      
      // Notify other users in the same session
      socket.to(sessionId).emit('user_joined', {
        userId,
        sessionId,
        timestamp: new Date()
      })
      
      // Send personalized recommendations if user is logged in
      if (userId) {
        try {
          const recommendations = await PersonalizationService.getRecommendations(userId)
          socket.emit('personalized_recommendations', recommendations)
        } catch (error) {
          console.error('Error getting recommendations:', error)
        }
      }
    })

    // Handle user interactions for analytics and personalization
    socket.on('user_interaction', async (event: UserInteractionEvent) => {
      const user = connectedUsers.get(socket.id)
      if (!user) return
      
      // Update last activity
      user.lastActivity = new Date()
      
      // Track analytics
      const analyticsEvent: AnalyticsEvent = {
        eventType: event.payload.action,
        properties: {
          productId: event.payload.productId,
          position: event.payload.position,
          duration: event.payload.duration,
          sessionId: event.sessionId,
          userId: event.userId
        },
        userId: event.userId,
        sessionId: event.sessionId,
        timestamp: new Date(),
        metadata: {
          userAgent: undefined,
          ip: undefined,
          referrer: undefined
        }
      }
      
      try {
        await AnalyticsService.trackEvent(analyticsEvent)
        
        // Broadcast interaction to other users in the same session (for social features)
        socket.to(user.sessionId).emit('product_interaction', {
          userId: event.userId,
          action: event.payload.action,
          productId: event.payload.productId,
          timestamp: new Date()
        })
        
        // Trigger real-time personalization updates
        if (event.userId && event.payload.action === 'view_product') {
          PersonalizationService.updateUserInteraction(event.userId, event.payload.productId!)
        }
        
      } catch (error) {
        console.error('Error handling user interaction:', error)
      }
    })

    // Handle cart updates
    socket.on('cart_update', async (event: CartUpdateEvent) => {
      const user = connectedUsers.get(socket.id)
      if (!user) return
      
      console.log(`Cart updated for session ${event.sessionId}:`, event.payload)
      
      // Broadcast cart sync to other devices/tabs of the same user
      if (event.userId) {
        socket.broadcast.emit('cart_sync', event.payload)
      }
      
      // Track cart analytics
      const analyticsEvent: AnalyticsEvent = {
        eventType: 'cart_update',
        properties: {
          items: event.payload.items,
          total: event.payload.total,
          itemCount: event.payload.itemCount,
          sessionId: event.sessionId,
          userId: event.userId
        },
        userId: event.userId,
        sessionId: event.sessionId,
        timestamp: new Date()
      }
      
      try {
        await AnalyticsService.trackEvent(analyticsEvent)
      } catch (error) {
        console.error('Error tracking cart update:', error)
      }
    })

    // Handle real-time inventory updates
    socket.on('inventory_check', async (productId: string) => {
      try {
        // In a real implementation, this would check actual inventory
        const inventory = Math.floor(Math.random() * 50) + 1
        
        socket.emit('inventory_update', {
          productId,
          inventory
        })
        
        // If inventory is low, notify all users
        if (inventory <= 5) {
          io.emit('inventory_update', {
            productId,
            inventory
          })
        }
      } catch (error) {
        console.error('Error checking inventory:', error)
      }
    })

    // Handle chat messages (for customer support)
    socket.on('chat_message', (data: { message: string; sessionId: string }) => {
      const user = connectedUsers.get(socket.id)
      if (!user) return
      
      // Broadcast to support team
      io.to('support').emit('customer_message', {
        userId: user.userId,
        sessionId: data.sessionId,
        message: data.message,
        timestamp: new Date()
      })
    })

    // Handle support responses
    socket.on('support_response', (data: { sessionId: string; message: string }) => {
      socket.to(data.sessionId).emit('support_message', {
        message: data.message,
        timestamp: new Date()
      })
    })

    // Handle flash sales and promotions
    socket.on('flash_sale_trigger', (data: { productId: string; discount: number; duration: number }) => {
      const endsAt = new Date(Date.now() + data.duration * 1000)
      
      io.emit('flash_sale', {
        productId: data.productId,
        discount: data.discount,
        endsAt
      })
      
      // Schedule sale end
      setTimeout(() => {
        io.emit('flash_sale_ended', {
          productId: data.productId
        })
      }, data.duration * 1000)
    })

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`)
      
      const user = connectedUsers.get(socket.id)
      if (user) {
        // Remove from session room tracking
        const sessionSockets = sessionRooms.get(user.sessionId)
        if (sessionSockets) {
          sessionSockets.delete(socket.id)
          if (sessionSockets.size === 0) {
            sessionRooms.delete(user.sessionId)
          }
        }
        
        // Notify other users in the session
        socket.to(user.sessionId).emit('user_left', {
          userId: user.userId,
          sessionId: user.sessionId,
          timestamp: new Date()
        })
        
        // Remove from connected users
        connectedUsers.delete(socket.id)
      }
    })

    // Error handling
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error)
    })
  })

  // Periodic cleanup of inactive connections
  setInterval(() => {
    const now = new Date()
    const inactiveThreshold = 30 * 60 * 1000 // 30 minutes
    
    connectedUsers.forEach((user, socketId) => {
      if (now.getTime() - user.lastActivity.getTime() > inactiveThreshold) {
        console.log(`Cleaning up inactive connection: ${socketId}`)
        connectedUsers.delete(socketId)
        
        // Clean up session rooms
        const sessionSockets = sessionRooms.get(user.sessionId)
        if (sessionSockets) {
          sessionSockets.delete(socketId)
          if (sessionSockets.size === 0) {
            sessionRooms.delete(user.sessionId)
          }
        }
      }
    })
  }, 5 * 60 * 1000) // Run every 5 minutes
}

export function getConnectedUsers() {
  return Array.from(connectedUsers.values())
}

export function getSessionUsers(sessionId: string) {
  const socketIds = sessionRooms.get(sessionId) || new Set()
  return Array.from(socketIds).map(socketId => connectedUsers.get(socketId)).filter(Boolean)
}