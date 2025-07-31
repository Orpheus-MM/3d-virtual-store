import { useState } from 'react'
import { Store3D } from './components/Store3D'
import { ProductModal } from './components/ProductModal'
import { CartSidebar } from './components/CartSidebar'
import { Navigation } from './components/Navigation'
import { useStore } from './store'

function App() {
  const [showCart, setShowCart] = useState(false)
  const { selectedProduct, selectProduct } = useStore()

  return (
    <div className="w-full h-screen bg-gray-900 relative">
      {/* Navigation */}
      <Navigation onToggleCart={() => setShowCart(!showCart)} />
      
      {/* 3D Store */}
      <Store3D />
      
      {/* Product Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => selectProduct(null)}
        />
      )}
      
      {/* Cart Sidebar */}
      {showCart && (
        <CartSidebar onClose={() => setShowCart(false)} />
      )}
      
      {/* Loading Screen */}
      <div className="absolute inset-0 bg-gray-900 flex items-center justify-center pointer-events-none">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Loading 3D Store...</h2>
          <p className="text-gray-400">Preparing your shopping experience</p>
        </div>
      </div>
    </div>
  )
}

export default App