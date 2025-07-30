import { Router } from 'express'
import type { Product, ApiResponse, PaginatedResponse } from '@shared/types'
import { AnalyticsService } from '../services/AnalyticsService'
import { PersonalizationService } from '../services/PersonalizationService'

const router = Router()

// Mock product data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Modern Sofa',
    description: 'Comfortable 3-seater sofa perfect for any living room',
    price: 899.99,
    currency: 'USD',
    category: 'Furniture',
    images: ['/images/sofa1.jpg'],
    model3D: {
      url: '/models/sofa.glb',
      format: 'glb',
      scale: 1,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    },
    inventory: 10,
    tags: ['furniture', 'living-room', 'modern'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling wireless headphones',
    price: 299.99,
    currency: 'USD',
    category: 'Electronics',
    images: ['/images/headphones1.jpg'],
    model3D: {
      url: '/models/headphones.glb',
      format: 'glb',
      scale: 0.5,
      position: { x: 2, y: 1, z: 0 },
      rotation: { x: 0, y: 0, z: 0 }
    },
    inventory: 25,
    tags: ['electronics', 'audio', 'wireless'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// GET /api/products - Get all products with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const category = req.query.category as string
    const search = req.query.search as string
    const sortBy = req.query.sortBy as string || 'name'
    const sortOrder = req.query.sortOrder as string || 'asc'

    let filteredProducts = [...mockProducts]

    // Apply category filter
    if (category && category !== 'All') {
      filteredProducts = filteredProducts.filter(p => p.category === category)
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product]
      let bValue: any = b[sortBy as keyof Product]

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : 1
      }
      return aValue < bValue ? -1 : 1
    })

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    const response: ApiResponse<PaginatedResponse<Product>> = {
      success: true,
      data: {
        items: paginatedProducts,
        total: filteredProducts.length,
        page,
        limit,
        hasNext: endIndex < filteredProducts.length,
        hasPrev: page > 1
      }
    }

    res.json(response)
  } catch (error) {
    console.error('Error getting products:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get products'
    })
  }
})

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = mockProducts.find(p => p.id === id)

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      })
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: product
    }

    res.json(response)
  } catch (error) {
    console.error('Error getting product:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get product'
    })
  }
})

// GET /api/products/:id/analytics - Get product analytics
router.get('/:id/analytics', async (req, res) => {
  try {
    const { id } = req.params
    const analytics = await AnalyticsService.getProductAnalytics(id)

    const response: ApiResponse<any> = {
      success: true,
      data: analytics
    }

    res.json(response)
  } catch (error) {
    console.error('Error getting product analytics:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get product analytics'
    })
  }
})

// GET /api/products/:id/similar - Get similar products
router.get('/:id/similar', async (req, res) => {
  try {
    const { id } = req.params
    const similarProducts = await PersonalizationService.getSimilarProducts(id)

    const response: ApiResponse<Product[]> = {
      success: true,
      data: similarProducts
    }

    res.json(response)
  } catch (error) {
    console.error('Error getting similar products:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get similar products'
    })
  }
})

// GET /api/products/trending - Get trending products
router.get('/trending', async (req, res) => {
  try {
    const trendingProducts = await PersonalizationService.getTrendingProducts()

    const response: ApiResponse<Product[]> = {
      success: true,
      data: trendingProducts
    }

    res.json(response)
  } catch (error) {
    console.error('Error getting trending products:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get trending products'
    })
  }
})

// GET /api/products/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [...new Set(mockProducts.map(p => p.category))]
    categories.unshift('All') // Add 'All' category at the beginning

    const response: ApiResponse<string[]> = {
      success: true,
      data: categories
    }

    res.json(response)
  } catch (error) {
    console.error('Error getting categories:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get categories'
    })
  }
})

export default router