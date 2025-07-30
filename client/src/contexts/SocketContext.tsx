import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'
import toast from 'react-hot-toast'

import { useStore } from '../store/useStore'
import type { 
  SocketEvent, 
  UserInteractionEvent, 
  CartUpdateEvent 
} from '@shared/types'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  emit: (event: string, data?: any) => void
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  emit: () => {}
})

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

interface SocketProviderProps {
  children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  const { 
    user, 
    session,
    cartItems,
    cartTotal,
    setRecommendations,
    addToCart
  } = useStore()

  useEffect(() => {
    // Initialize socket connection
    const serverUrl = (import.meta as any).env?.VITE_SERVER_URL || 'http://localhost:3001'
    const socketInstance = io(serverUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('Connected to server')
      setIsConnected(true)
      toast.success('Connected to store', { duration: 2000 })
      
      // Join session room
      if (session) {
        socketInstance.emit('join_session', { sessionId: session.id, userId: user?.id })
      }
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server')
      setIsConnected(false)
      toast.error('Disconnected from store', { duration: 2000 })
    })

    socketInstance.on('connect_error', (error) => {
      console.error('Connection error:', error)
      toast.error('Connection failed', { duration: 3000 })
    })

    // Real-time event handlers
    socketInstance.on('cart_sync', (data: CartUpdateEvent['payload']) => {
      console.log('Cart synced from server:', data)
      // Could sync cart state here if multiple devices/tabs
    })

    socketInstance.on('personalized_recommendations', (products) => {
      console.log('Received personalized recommendations:', products)
      setRecommendations(products)
      toast.success('New recommendations available!', { duration: 3000 })
    })

    socketInstance.on('product_interaction', (data) => {
      console.log('Product interaction event:', data)
      // Handle real-time product interactions from other users
    })

    socketInstance.on('inventory_update', (data: { productId: string; inventory: number }) => {
      console.log('Inventory updated:', data)
      if (data.inventory <= 0) {
        toast.error(`Product ${data.productId} is now out of stock`, { duration: 4000 })
      } else if (data.inventory <= 5) {
        toast(`Only ${data.inventory} left for product ${data.productId}`, { 
          duration: 3000,
          icon: '⚠️',
          style: { background: '#f59e0b', color: 'white' }
        })
      }
    })

    socketInstance.on('flash_sale', (data: { productId: string; discount: number; endsAt: Date }) => {
      toast.success(`Flash Sale! ${data.discount}% off selected items`, { 
        duration: 5000,
        icon: '⚡'
      })
    })

    socketInstance.on('user_joined', (data: { userId: string; sessionId: string }) => {
      if (data.userId !== user?.id) {
        console.log('Another user joined the store:', data)
      }
    })

    setSocket(socketInstance)

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [user, session])

  // Emit cart updates when cart changes
  useEffect(() => {
    if (socket && isConnected && session) {
      const cartUpdateEvent: CartUpdateEvent = {
        type: 'cart_update',
        payload: {
          items: cartItems,
          total: cartTotal,
          itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
        },
        timestamp: new Date(),
        userId: user?.id,
        sessionId: session.id
      }
      
      socket.emit('cart_update', cartUpdateEvent)
    }
  }, [cartItems, cartTotal, socket, isConnected, session, user])

  const emit = (event: string, data?: any) => {
    if (socket && isConnected) {
      socket.emit(event, data)
    } else {
      console.warn('Socket not connected. Cannot emit event:', event)
    }
  }

  // Emit user interactions for analytics and personalization
  const emitUserInteraction = (action: UserInteractionEvent['payload']['action'], productId?: string, position?: any) => {
    if (socket && isConnected && session) {
      const interactionEvent: UserInteractionEvent = {
        type: 'user_interaction',
        payload: {
          action,
          productId,
          position,
          duration: Date.now() // This would be calculated properly in a real implementation
        },
        timestamp: new Date(),
        userId: user?.id,
        sessionId: session.id
      }
      
      socket.emit('user_interaction', interactionEvent)
    }
  }

  const contextValue: SocketContextType = {
    socket,
    isConnected,
    emit: (event: string, data?: any) => {
      if (event === 'user_interaction') {
        emitUserInteraction(data.action, data.productId, data.position)
      } else {
        emit(event, data)
      }
    }
  }

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  )
}