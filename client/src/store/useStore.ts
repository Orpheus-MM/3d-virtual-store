import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { 
  Product, 
  User, 
  ShoppingSession, 
  CartItem, 
  Store3DConfig,
  UserPreferences 
} from '@shared/types'

interface StoreState {
  // Loading and UI state
  isLoading: boolean
  isCartOpen: boolean
  isCheckoutOpen: boolean
  isPreferencesOpen: boolean
  selectedProduct: Product | null
  
  // User and session
  user: User | null
  session: ShoppingSession | null
  
  // Products and store
  products: Product[]
  categories: string[]
  store3DConfig: Store3DConfig | null
  
  // Shopping cart
  cartItems: CartItem[]
  cartTotal: number
  
  // 3D Scene state
  cameraPosition: [number, number, number]
  selectedObjectId: string | null
  
  // Personalization
  recommendations: Product[]
  recentlyViewed: Product[]
  
  // Actions
  initializeStore: () => Promise<void>
  setLoading: (loading: boolean) => void
  setUser: (user: User | null) => void
  
  // Cart actions
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  
  // Product actions
  setSelectedProduct: (product: Product | null) => void
  addToRecentlyViewed: (product: Product) => void
  
  // UI actions
  toggleCheckout: () => void
  togglePreferences: () => void
  
  // 3D Scene actions
  setCameraPosition: (position: [number, number, number]) => void
  setSelectedObject: (objectId: string | null) => void
  
  // Store configuration
  setStore3DConfig: (config: Store3DConfig) => void
  
  // Personalization actions
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void
  setRecommendations: (products: Product[]) => void
}

const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isLoading: true,
        isCartOpen: false,
        isCheckoutOpen: false,
        isPreferencesOpen: false,
        selectedProduct: null,
        
        user: null,
        session: null,
        
        products: [],
        categories: [],
        store3DConfig: null,
        
        cartItems: [],
        cartTotal: 0,
        
        cameraPosition: [0, 5, 10],
        selectedObjectId: null,
        
        recommendations: [],
        recentlyViewed: [],
        
        // Actions
        initializeStore: async () => {
          set({ isLoading: true })
          
          try {
            // Initialize session with fallback for crypto.randomUUID
            const sessionId = (typeof crypto !== 'undefined' && crypto.randomUUID) 
              ? crypto.randomUUID() 
              : 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
            
            const newSession: ShoppingSession = {
              id: sessionId,
              items: [],
              total: 0,
              currency: 'USD',
              status: 'active',
              createdAt: new Date(),
              updatedAt: new Date()
            }
            
            // Load initial data (would come from API)
            const mockProducts: Product[] = [
              {
                id: '1',
                name: 'Modern Sofa',
                description: 'Comfortable 3-seater sofa perfect for any living room',
                price: 899.99,
                currency: 'USD',
                category: 'Furniture',
                images: ['/images/sofa1.jpg'],
                model3D: {
                  url: '/models/sofa.glb',
                  format: 'glb',
                  scale: 1,
                  position: { x: 0, y: 0, z: 0 },
                  rotation: { x: 0, y: 0, z: 0 }
                },
                inventory: 10,
                tags: ['furniture', 'living-room', 'modern'],
                createdAt: new Date(),
                updatedAt: new Date()
              },
              {
                id: '2',
                name: 'Wireless Headphones',
                description: 'Premium noise-canceling wireless headphones',
                price: 299.99,
                currency: 'USD',
                category: 'Electronics',
                images: ['/images/headphones1.jpg'],
                model3D: {
                  url: '/models/headphones.glb',
                  format: 'glb',
                  scale: 0.5,
                  position: { x: 2, y: 1, z: 0 },
                  rotation: { x: 0, y: 0, z: 0 }
                },
                inventory: 25,
                tags: ['electronics', 'audio', 'wireless'],
                createdAt: new Date(),
                updatedAt: new Date()
              }
            ]
            
            const mockStore3DConfig: Store3DConfig = {
              id: 'default-store',
              name: 'Virtual Showroom',
              layout: 'showroom',
              theme: {
                primaryColor: '#3b82f6',
                secondaryColor: '#6b7280',
                lighting: 'warm',
                ambiance: 'modern'
              },
              camera: {
                position: { x: 0, y: 5, z: 10 },
                target: { x: 0, y: 0, z: 0 },
                fov: 75
              },
              environment: {
                skybox: '/textures/skybox.hdr',
                ground: '/textures/floor.jpg'
              },
              interactionZones: []
            }
            
            set({
              session: newSession,
              products: mockProducts,
              categories: ['All', 'Furniture', 'Electronics'],
              store3DConfig: mockStore3DConfig,
              isLoading: false
            })
            
          } catch (error) {
            console.error('Failed to initialize store:', error)
            set({ isLoading: false })
          }
        },
        
        setLoading: (loading) => set({ isLoading: loading }),
        setUser: (user) => set({ user }),
        
        // Cart actions
        addToCart: (product, quantity = 1) => {
          const { cartItems } = get()
          const existingItem = cartItems.find(item => item.productId === product.id)
          
          let newItems: CartItem[]
          if (existingItem) {
            newItems = cartItems.map(item =>
              item.productId === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          } else {
            const newItem: CartItem = {
              productId: product.id,
              quantity,
              addedAt: new Date()
            }
            newItems = [...cartItems, newItem]
          }
          
          const total = newItems.reduce((sum, item) => {
            const prod = get().products.find(p => p.id === item.productId)
            return sum + (prod ? prod.price * item.quantity : 0)
          }, 0)
          
          set({ 
            cartItems: newItems, 
            cartTotal: total 
          })
          
          // Update session
          const { session } = get()
          if (session) {
            set({
              session: {
                ...session,
                items: newItems,
                total,
                updatedAt: new Date()
              }
            })
          }
        },
        
        removeFromCart: (productId) => {
          const { cartItems } = get()
          const newItems = cartItems.filter(item => item.productId !== productId)
          const total = newItems.reduce((sum, item) => {
            const prod = get().products.find(p => p.id === item.productId)
            return sum + (prod ? prod.price * item.quantity : 0)
          }, 0)
          
          set({ 
            cartItems: newItems, 
            cartTotal: total 
          })
        },
        
        updateCartQuantity: (productId, quantity) => {
          if (quantity <= 0) {
            get().removeFromCart(productId)
            return
          }
          
          const { cartItems } = get()
          const newItems = cartItems.map(item =>
            item.productId === productId
              ? { ...item, quantity }
              : item
          )
          
          const total = newItems.reduce((sum, item) => {
            const prod = get().products.find(p => p.id === item.productId)
            return sum + (prod ? prod.price * item.quantity : 0)
          }, 0)
          
          set({ 
            cartItems: newItems, 
            cartTotal: total 
          })
        },
        
        clearCart: () => set({ cartItems: [], cartTotal: 0 }),
        toggleCart: () => set(state => ({ isCartOpen: !state.isCartOpen })),
        
        // Product actions
        setSelectedProduct: (product) => set({ selectedProduct: product }),
        addToRecentlyViewed: (product) => {
          const { recentlyViewed } = get()
          const filtered = recentlyViewed.filter(p => p.id !== product.id)
          const newRecentlyViewed = [product, ...filtered].slice(0, 10)
          set({ recentlyViewed: newRecentlyViewed })
        },
        
        // UI actions
        toggleCheckout: () => set(state => ({ isCheckoutOpen: !state.isCheckoutOpen })),
        togglePreferences: () => set(state => ({ isPreferencesOpen: !state.isPreferencesOpen })),
        
        // 3D Scene actions
        setCameraPosition: (position) => set({ cameraPosition: position }),
        setSelectedObject: (objectId) => set({ selectedObjectId: objectId }),
        
        // Store configuration
        setStore3DConfig: (config) => set({ store3DConfig: config }),
        
        // Personalization actions
        updateUserPreferences: (preferences) => {
          const { user } = get()
          if (user) {
            set({
              user: {
                ...user,
                preferences: { ...user.preferences, ...preferences }
              }
            })
          }
        },
        
        setRecommendations: (products) => set({ recommendations: products })
      }),
      {
        name: '3d-ecommerce-store',
        partialize: (state) => ({
          user: state.user,
          cartItems: state.cartItems,
          cartTotal: state.cartTotal,
          recentlyViewed: state.recentlyViewed,
          session: state.session
        })
      }
    ),
    {
      name: '3D Ecommerce Store'
    }
  )
)

export { useStore }