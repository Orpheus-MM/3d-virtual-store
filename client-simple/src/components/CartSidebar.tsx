import { motion } from 'framer-motion'
import { useStore } from '../store'

interface CartSidebarProps {
  onClose: () => void
}

export function CartSidebar({ onClose }: CartSidebarProps) {
  const { cart, removeFromCart, getTotalPrice, getTotalItems } = useStore()
  
  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="ml-auto w-full max-w-md bg-gray-800 border-l border-gray-700 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Shopping Cart ({totalItems})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-lg font-medium text-white mb-2">Your cart is empty</h3>
              <p className="text-gray-400">Click on products in the 3D store to add them</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{item.product.name}</h4>
                      <p className="text-sm text-gray-400 capitalize mb-2">
                        {item.product.category}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-green-400 font-medium">
                          ${item.product.price}
                        </span>
                        <span className="text-gray-400">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-400 hover:text-red-300 ml-4"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-white">Total:</span>
              <span className="text-2xl font-bold text-green-400">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              💳 Checkout ({totalItems} items)
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">
              Demo store - checkout not functional
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}