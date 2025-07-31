import { useStore } from '../store'

interface NavigationProps {
  onToggleCart: () => void
}

export function Navigation({ onToggleCart }: NavigationProps) {
  const { getTotalItems } = useStore()
  const totalItems = getTotalItems()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              🛍️ 3D Virtual Store
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Instructions */}
            <div className="hidden md:block text-sm text-gray-400">
              Click products to view • Drag to rotate • Scroll to zoom
            </div>
            
            {/* Cart Button */}
            <button
              onClick={onToggleCart}
              className="relative bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>🛒 Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}