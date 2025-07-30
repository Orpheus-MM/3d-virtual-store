import { Router } from 'express'
import type { ApiResponse } from '@shared/types'
import { AnalyticsService } from '../services/AnalyticsService'

const router = Router()

// GET /api/analytics/dashboard - Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const dashboardData = await AnalyticsService.getDashboardData()

    const response: ApiResponse<any> = {
      success: true,
      data: dashboardData
    }

    res.json(response)
  } catch (error) {
    console.error('Error getting dashboard analytics:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get dashboard analytics'
    })
  }
})

// GET /api/analytics/users/:id - Get user behavior analytics
router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const sessionId = req.query.sessionId as string

    const userBehavior = await AnalyticsService.getUserBehavior(id, sessionId)

    const response: ApiResponse<any> = {
      success: true,
      data: userBehavior
    }

    res.json(response)
  } catch (error) {
    console.error('Error getting user analytics:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get user analytics'
    })
  }
})

export default router