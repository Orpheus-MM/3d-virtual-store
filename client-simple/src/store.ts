import { create } from 'zustand'
import { Product, Store } from './types'

// Mock products for the 3D store
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Modern Sofa',
    price: 899,
    category: 'furniture',
    description: 'Comfortable modern sofa perfect for any living room',
    image: '/images/sofa.jpg',
    position: [-3, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    inStock: true
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    price: 199,
    category: 'electronics',
    description: 'Premium wireless headphones with noise cancellation',
    image: '/images/headphones.jpg',
    position: [3, 1, 0],
    scale: [0.5, 0.5, 0.5],
    rotation: [0, Math.PI / 4, 0],
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Table',
    price: 299,
    category: 'furniture',
    description: 'Elegant wooden coffee table',
    image: '/images/table.jpg',
    position: [0, 0, 2],
    scale: [0.8, 0.8, 0.8],
    rotation: [0, 0, 0],
    inStock: true
  }
]

export const useStore = create<Store>((set, get) => ({
  products: mockProducts,
  cart: [],
  selectedProduct: null,

  addToCart: (product: Product) => {
    set((state) => {
      const existingItem = state.cart.find(item => item.product.id === product.id)
      if (existingItem) {
        return {
          cart: state.cart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      } else {
        return {
          cart: [...state.cart, { product, quantity: 1 }]
        }
      }
    })
  },

  removeFromCart: (productId: string) => {
    set((state) => ({
      cart: state.cart.filter(item => item.product.id !== productId)
    }))
  },

  selectProduct: (product: Product | null) => {
    set({ selectedProduct: product })
  },

  getTotalPrice: () => {
    return get().cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  },

  getTotalItems: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0)
  }
}))