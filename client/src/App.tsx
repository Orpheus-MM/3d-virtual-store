import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Store and context
import { useStore } from './store/useStore'
import { SocketProvider } from './contexts/SocketContext'

// 3D Components
import { Scene3D } from './components/3D/Scene3D'
import { CameraController } from './components/3D/CameraController'
import { Lighting } from './components/3D/Lighting'

// UI Components
import { LoadingScreen } from './components/UI/LoadingScreen'
import { Navigation } from './components/UI/Navigation'
import { CartSidebar } from './components/UI/CartSidebar'
import { ProductModal } from './components/UI/ProductModal'
import { CheckoutModal } from './components/UI/CheckoutModal'
import { UserPreferences } from './components/UI/UserPreferences'
import { MiniMap } from './components/UI/MiniMap'
import { ChatSupport } from './components/UI/ChatSupport'

// Pages
import { Store3DPage } from './pages/Store3DPage'
import { ProductPage } from './pages/ProductPage'
import { CheckoutPage } from './pages/CheckoutPage'

function App() {
  const { 
    isLoading, 
    isCartOpen, 
    selectedProduct, 
    isCheckoutOpen,
    isPreferencesOpen,
    user,
    initializeStore 
  } = useStore()

  useEffect(() => {
    // Initialize the store on app load
    initializeStore()
  }, [initializeStore])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <SocketProvider>
      <Router>
        <div className="w-full h-screen overflow-hidden bg-gray-900">
          {/* Canvas for 3D Scene */}
          <Canvas
            className="canvas-container"
            camera={{ 
              position: [0, 5, 10], 
              fov: 75,
              near: 0.1,
              far: 1000 
            }}
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: 'high-performance'
            }}
            shadows
          >
            <Suspense fallback={null}>
              <Lighting />
              <CameraController />
              <Scene3D />
            </Suspense>
          </Canvas>

          {/* UI Overlay */}
          <div className="canvas-overlay">
            <Routes>
              <Route path="/" element={<Store3DPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>

            {/* Navigation */}
            <Navigation />

            {/* Mini Map */}
            <MiniMap />

            {/* Modals and Sidebars */}
            {isCartOpen && <CartSidebar />}
            {selectedProduct && <ProductModal />}
            {isCheckoutOpen && <CheckoutModal />}
            {isPreferencesOpen && <UserPreferences />}

            {/* Chat Support */}
            {user && <ChatSupport />}
          </div>

          {/* Toast Notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e5e7eb'
              }
            }}
          />
        </div>
      </Router>
    </SocketProvider>
  )
}

export default App