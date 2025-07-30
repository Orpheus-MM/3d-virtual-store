import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'

import { useStore } from '../../store/useStore'
import { useSocket } from '../../contexts/SocketContext'

export function CartSidebar() {
  const {
    cartItems,
    cartTotal,
    products,
    toggleCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleCheckout
  } = useStore()

  const { emit } = useSocket()

  const getProductById = (id: string) => products.find(p => p.id === id)

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity)
    
    // Emit cart interaction event
    emit('user_interaction', {
      action: newQuantity === 0 ? 'remove_from_cart' : 'add_to_cart',
      productId
    })
  }

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId)
    toast.success('Item removed from cart')
    
    emit('user_interaction', {
      action: 'remove_from_cart',
      productId
    })
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    toggleCart()
    toggleCheckout()
    
    emit('user_interaction', {
      action: 'checkout'
    })
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Cart cleared')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-hidden"
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={toggleCart}
        />

        {/* Sidebar */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-900">
                Shopping Cart
              </h2>
            </div>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Browse our 3D store and add some amazing products!
                </p>
                <button
                  onClick={toggleCart}
                  className="btn-primary"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const product = getProductById(item.productId)
                  if (!product) return null

                  const itemTotal = product.price * item.quantity

                  return (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-gray-50 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Product Image Placeholder */}
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl">📦</span>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 mb-1 truncate">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            ${product.price.toFixed(2)} each
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            
                            <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total & Remove */}
                        <div className="text-right">
                          <div className="font-semibold text-gray-900 mb-2">
                            ${itemTotal.toFixed(2)}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className="text-red-500 hover:text-red-700 text-sm transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Customization Options */}
                      {item.customization && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex flex-wrap gap-2 text-xs">
                            {item.customization.color && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                Color: {item.customization.color}
                              </span>
                            )}
                            {item.customization.size && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                Size: {item.customization.size}
                              </span>
                            )}
                            {item.customization.engraving && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                                Engraving: {item.customization.engraving}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Cart Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Proceed to Checkout</span>
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={toggleCart}
                    className="flex-1 btn-secondary"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={handleClearCart}
                    className="px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}