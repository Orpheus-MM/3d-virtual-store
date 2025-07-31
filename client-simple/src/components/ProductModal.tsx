import { motion } from 'framer-motion'
import { Product } from '../types'
import { useStore } from '../store'

interface ProductModalProps {
  product: Product
  onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useStore()

  const handleAddToCart = () => {
    addToCart(product)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {/* Product Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
          <div className="text-2xl font-bold text-green-400 mb-4">
            ${product.price}
          </div>
          <p className="text-gray-300 mb-4">{product.description}</p>
          
          {/* Category */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full capitalize">
              {product.category}
            </span>
            {product.inStock ? (
              <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                In Stock
              </span>
            ) : (
              <span className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {product.inStock ? '🛒 Add to Cart' : 'Out of Stock'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}