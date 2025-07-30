import mongoose from 'mongoose'

export async function connectDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/3d-ecommerce'
  
  try {
    await mongoose.connect(MONGODB_URI, {
      // Remove deprecated options
    })
    
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully')
    })
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })
    
  } catch (error: any) {
    console.warn('MongoDB connection failed - using mock data for development:', error?.message || 'Unknown error')
    // Don't throw error - continue with mock data
  }
}