import { useEffect } from 'react'
import { motion } from 'framer-motion'

import { useStore } from '../store/useStore'
import { useSocket } from '../contexts/SocketContext'

export function Store3DPage() {
  const { 
    products, 
    selectedProduct, 
    recentlyViewed,
    recommendations,
    addToRecentlyViewed,
    setSelectedProduct 
  } = useStore()
  
  const { emit } = useSocket()

  useEffect(() => {
    // Emit page view event for analytics
    emit('user_interaction', {
      action: 'navigate',
      position: { x: 0, y: 0, z: 0 }
    })
  }, [emit])

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product)
    addToRecentlyViewed(product)
    
    // Emit product view event
    emit('user_interaction', {
      action: 'view_product',
      productId: product.id
    })
  }

  return (
    <div className="relative h-full">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute top-24 left-4 z-30 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 max-w-sm"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Welcome to the 3D Store! 👋
        </h2>
        <p className="text-gray-600 text-sm mb-3">
          Navigate around using your mouse or touch. Click on products to learn more and add them to your cart.
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>🖱️ Click & Drag to rotate</span>
          <span>🔍 Scroll to zoom</span>
        </div>
      </motion.div>

      {/* Product Recommendations Panel */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="absolute top-24 right-4 z-30 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 max-w-xs"
        >
          <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">✨</span>
            Recommended for You
          </h3>
          <div className="space-y-2">
            {recommendations.slice(0, 3).map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs">
                    📦
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute bottom-20 left-4 z-30 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200 max-w-md"
        >
          <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">👁️</span>
            Recently Viewed
          </h3>
          <div className="flex space-x-2 overflow-x-auto">
            {recentlyViewed.slice(0, 5).map((product) => (
              <button
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                title={product.name}
              >
                <span className="text-xs">📦</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Store Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 0.5 }}
        className="absolute bottom-20 right-4 z-30 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{products.length}</div>
          <div className="text-sm text-gray-600">Products Available</div>
        </div>
      </motion.div>

      {/* Interactive Help */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3, duration: 0.5 }}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20"
      >
        <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-blue-600 transition-colors">
          <div className="text-xl">💡</div>
        </div>
      </motion.div>

      {/* Floating Action Buttons */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 space-y-3">
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.5, duration: 0.5 }}
          className="w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          title="View All Products"
        >
          🔍
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 4, duration: 0.5 }}
          className="w-12 h-12 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-colors flex items-center justify-center"
          title="Store Map"
        >
          🗺️
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 4.5, duration: 0.5 }}
          className="w-12 h-12 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
          title="Get Help"
        >
          ❓
        </motion.button>
      </div>
    </div>
  )
}