import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useStore } from '../../store/useStore'

export function UserPreferences() {
  const { isPreferencesOpen, togglePreferences } = useStore()

  if (!isPreferencesOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
      >
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={togglePreferences}
        />
        
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8"
          >
            <button
              onClick={togglePreferences}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h2 className="text-2xl font-bold mb-6">User Preferences</h2>
            <p className="text-gray-600">User preferences and settings will be implemented here.</p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}