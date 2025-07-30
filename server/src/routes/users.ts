import { Router } from 'express'
import type { ApiResponse } from '@shared/types'
import { PersonalizationService } from '../services/PersonalizationService'

const router = Router()

// GET /api/users/:id/recommendations - Get personalized recommendations
router.get('/:id/recommendations', async (req, res) => {
  try {
    const { id } = req.params
    const recommendations = await PersonalizationService.getRecommendations(id)

    const response: ApiResponse<any> = {
      success: true,
      data: recommendations
    }

    res.json(response)
  } catch (error) {
    console.error('Error getting recommendations:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get recommendations'
    })
  }
})

// PUT /api/users/:id/preferences - Update user preferences
router.put('/:id/preferences', async (req, res) => {
  try {
    const { id } = req.params
    const preferences = req.body

    // Mock update - in production, save to database
    console.log(`Updated preferences for user ${id}:`, preferences)

    const response: ApiResponse<any> = {
      success: true,
      data: preferences,
      message: 'Preferences updated successfully'
    }

    res.json(response)
  } catch (error) {
    console.error('Error updating preferences:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences'
    })
  }
})

export default router