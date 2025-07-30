import { Router } from 'express'
import type { ApiResponse, Store3DConfig } from '@shared/types'

const router = Router()

// Mock store3D configuration
const mockStore3DConfig: Store3DConfig = {
  id: 'default-store',
  name: 'Virtual Showroom',
  layout: 'showroom',
  theme: {
    primaryColor: '#3b82f6',
    secondaryColor: '#6b7280',
    lighting: 'warm',
    ambiance: 'modern'
  },
  camera: {
    position: { x: 0, y: 5, z: 10 },
    target: { x: 0, y: 0, z: 0 },
    fov: 75
  },
  environment: {
    skybox: '/textures/skybox.hdr',
    ground: '/textures/floor.jpg'
  },
  interactionZones: [
    {
      id: 'checkout-zone',
      type: 'checkout',
      position: { x: 5, y: 0, z: 5 },
      size: { x: 2, y: 2, z: 2 },
      content: 'Complete your purchase here',
      actions: ['checkout', 'view_cart']
    }
  ]
}

// GET /api/store3d/config - Get store 3D configuration
router.get('/config', async (req, res) => {
  try {
    const response: ApiResponse<Store3DConfig> = {
      success: true,
      data: mockStore3DConfig
    }

    res.json(response)
  } catch (error) {
    console.error('Error getting store3D config:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get store3D configuration'
    })
  }
})

// PUT /api/store3d/config - Update store 3D configuration
router.put('/config', async (req, res) => {
  try {
    const config = req.body

    // Mock update - in production, save to database
    Object.assign(mockStore3DConfig, config)

    const response: ApiResponse<Store3DConfig> = {
      success: true,
      data: mockStore3DConfig,
      message: 'Store configuration updated successfully'
    }

    res.json(response)
  } catch (error) {
    console.error('Error updating store3D config:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update store3D configuration'
    })
  }
})

export default router