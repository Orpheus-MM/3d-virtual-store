import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Heart, Share2, Star } from 'lucide-react'
import toast from 'react-hot-toast'

import { useStore } from '../../store/useStore'
import { useSocket } from '../../contexts/SocketContext'

export function ProductModal() {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    cartItems
  } = useStore()

  const { emit } = useSocket()

  if (!selectedProduct) return null

  const isInCart = cartItems.some(item => item.productId === selectedProduct.id)
  const colors = ['Black', 'White', 'Blue', 'Red'] // Mock colors
  const sizes = ['S', 'M', 'L', 'XL'] // Mock sizes

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity)
    toast.success(`Added ${quantity} ${selectedProduct.name} to cart!`)
    
    emit('user_interaction', {
      action: 'add_to_cart',
      productId: selectedProduct.id
    })
  }

  const handleClose = () => {
    setSelectedProduct(null)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* Product Image/3D View */}
              <div className="bg-gray-100 relative flex items-center justify-center p-8">
                <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <p className="text-gray-600">3D Model View</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Interactive 3D preview would be here
                    </p>
                  </div>
                </div>
                
                {/* Image Gallery Dots */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {[1, 2, 3].map((i) => (
                    <button
                      key={i}
                      className="w-2 h-2 rounded-full bg-white/60 hover:bg-white transition-colors"
                    />
                  ))}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-8 overflow-y-auto">
                <div className="space-y-6">
                  {/* Product Header */}
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <span>{selectedProduct.category}</span>
                      <span>•</span>
                      <span>#{selectedProduct.id}</span>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {selectedProduct.name}
                    </h1>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-green-600">
                        ${selectedProduct.price.toFixed(2)}
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Description */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedProduct.description}
                    </p>
                  </div>

                  {/* Color Selection */}
                  {colors.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
                      <div className="flex space-x-3">
                        {colors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-4 py-2 rounded-lg border transition-colors ${
                              selectedColor === color
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {sizes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                      <div className="flex space-x-3">
                        {sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-4 py-2 rounded-lg border transition-colors ${
                              selectedSize === size
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity Selection */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity(Math.min(selectedProduct.inventory, quantity + 1))}
                          className="px-3 py-2 hover:bg-gray-100 transition-colors"
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {selectedProduct.inventory} available
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      disabled={selectedProduct.inventory === 0}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        {isInCart ? 'Add More to Cart' : 'Add to Cart'}
                      </span>
                    </button>
                    
                    <div className="flex space-x-3">
                      <button className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <Heart className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      
                      <button className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Tags */}
                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}