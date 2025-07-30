import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  User, 
  Search, 
  Settings, 
  Home,
  Grid3X3,
  Map,
  Zap
} from 'lucide-react'

import { useStore } from '../../store/useStore'

export function Navigation() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  
  const {
    cartItems,
    cartTotal,
    user,
    toggleCart,
    togglePreferences,
    categories,
    products
  } = useStore()

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery)
    }
  }

  const navItems = [
    { icon: Home, label: 'Home', action: () => {} },
    { icon: Grid3X3, label: 'Categories', action: () => {} },
    { icon: Map, label: 'Store Map', action: () => {} },
    { icon: Zap, label: 'Featured', action: () => {} },
  ]

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3D</span>
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">
                  Virtual Store
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <form onSubmit={handleSearch} className="relative">
                <motion.div
                  animate={{ width: isSearchExpanded ? '100%' : '280px' }}
                  className="relative"
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchExpanded(true)}
                    onBlur={() => setIsSearchExpanded(false)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                </motion.div>
              </form>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <button
                onClick={togglePreferences}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="User Profile"
              >
                <User className="w-6 h-6" />
                {user && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </button>

              {/* Settings */}
              <button
                onClick={togglePreferences}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Settings"
              >
                <Settings className="w-6 h-6" />
              </button>

              {/* Shopping Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                <AnimatePresence>
                  {cartItemCount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium"
                    >
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Cart Total */}
              {cartTotal > 0 && (
                <div className="hidden sm:block text-sm font-medium text-gray-700">
                  ${cartTotal.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation (Mobile/Quick Actions) */}
      <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:w-auto">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-2"
        >
          <div className="flex items-center space-x-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
                <span className="hidden sm:block text-sm font-medium">
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Categories Filter Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 py-3 overflow-x-auto">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Categories:
            </span>
            {categories.map((category) => (
              <button
                key={category}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors whitespace-nowrap"
              >
                {category}
              </button>
            ))}
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {products.length} products
            </div>
          </div>
        </div>
      </div>
    </>
  )
}