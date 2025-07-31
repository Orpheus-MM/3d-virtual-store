export interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  image: string
  model3d?: string
  position: [number, number, number]
  scale: [number, number, number]
  rotation: [number, number, number]
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Store {
  products: Product[]
  cart: CartItem[]
  selectedProduct: Product | null
  addToCart: (product: Product) => void
  removeFromCart: (productId: string) => void
  selectProduct: (product: Product | null) => void
  getTotalPrice: () => number
  getTotalItems: () => number
}