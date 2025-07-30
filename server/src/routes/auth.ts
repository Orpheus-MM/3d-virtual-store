import { Router } from 'express'
import type { ApiResponse } from '@shared/types'

const router = Router()

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Mock authentication - in production, verify against database
    if (email && password) {
      const mockUser = {
        id: '1',
        email,
        name: 'Demo User',
        avatar: '/avatars/demo.jpg',
        preferences: {
          favoriteCategories: ['Electronics', 'Furniture'],
          priceRange: { min: 50, max: 1000 },
          style: ['modern', 'minimalist'],
          notifications: { email: true, push: true },
          privacy: { shareData: true, trackBehavior: true }
        },
        shoppingHistory: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const response: ApiResponse<any> = {
        success: true,
        data: {
          user: mockUser,
          token: 'mock-jwt-token'
        },
        message: 'Login successful'
      }

      res.json(response)
    } else {
      res.status(400).json({
        success: false,
        error: 'Email and password are required'
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Login failed'
    })
  }
})

// POST /api/auth/register - User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and name are required'
      })
    }

    // Mock registration
    const mockUser = {
      id: Date.now().toString(),
      email,
      name,
      preferences: {
        favoriteCategories: [],
        priceRange: { min: 0, max: 1000 },
        style: [],
        notifications: { email: true, push: false },
        privacy: { shareData: false, trackBehavior: false }
      },
      shoppingHistory: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const response: ApiResponse<any> = {
      success: true,
      data: {
        user: mockUser,
        token: 'mock-jwt-token'
      },
      message: 'Registration successful'
    }

    res.status(201).json(response)
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    })
  }
})

// POST /api/auth/logout - User logout
router.post('/logout', async (req, res) => {
  try {
    const response: ApiResponse<null> = {
      success: true,
      message: 'Logout successful'
    }

    res.json(response)
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    })
  }
})

export default router