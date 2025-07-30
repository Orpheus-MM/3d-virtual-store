import type { PluginConfig, EcommerceIntegration, Product } from '@shared/types'

export interface Store3DPlugin {
  init(config: PluginConfig): Promise<void>
  mount(containerId: string): void
  unmount(): void
  updateProducts(products: Product[]): void
  updateConfig(config: Partial<PluginConfig>): void
  on(event: string, callback: Function): void
  off(event: string, callback: Function): void
  getAnalytics(): Promise<any>
}

export class Store3DEcommercePlugin implements Store3DPlugin {
  private config: PluginConfig | null = null
  private container: HTMLElement | null = null
  private iframe: HTMLIFrameElement | null = null
  private eventListeners: Map<string, Function[]> = new Map()
  private isInitialized = false

  /**
   * Initialize the 3D store plugin
   */
  async init(config: PluginConfig): Promise<void> {
    try {
      this.config = config
      
      // Validate configuration
      this.validateConfig(config)
      
      // Set up event listeners for the iframe communication
      this.setupMessageHandler()
      
      this.isInitialized = true
      this.emit('initialized', { config })
      
      console.log('3D Ecommerce Plugin initialized successfully')
    } catch (error) {
      console.error('Failed to initialize 3D Ecommerce Plugin:', error)
      throw error
    }
  }

  /**
   * Mount the 3D store to a DOM element
   */
  mount(containerId: string): void {
    if (!this.isInitialized) {
      throw new Error('Plugin must be initialized before mounting')
    }

    const container = document.getElementById(containerId)
    if (!container) {
      throw new Error(`Container with ID '${containerId}' not found`)
    }

    this.container = container
    
    // Create iframe for the 3D store
    this.iframe = document.createElement('iframe')
    this.iframe.src = this.buildIframeSrc()
    this.iframe.style.width = '100%'
    this.iframe.style.height = '100%'
    this.iframe.style.border = 'none'
    this.iframe.allow = 'camera; microphone; gyroscope; accelerometer'
    
    // Apply custom styles if provided
    if (this.config?.customization?.css) {
      const style = document.createElement('style')
      style.textContent = this.config.customization.css
      document.head.appendChild(style)
    }

    container.appendChild(this.iframe)
    
    this.emit('mounted', { containerId })
    console.log(`3D Ecommerce Plugin mounted to container: ${containerId}`)
  }

  /**
   * Unmount the 3D store
   */
  unmount(): void {
    if (this.iframe && this.container) {
      this.container.removeChild(this.iframe)
      this.iframe = null
      this.container = null
      this.emit('unmounted')
      console.log('3D Ecommerce Plugin unmounted')
    }
  }

  /**
   * Update products in the 3D store
   */
  updateProducts(products: Product[]): void {
    if (!this.iframe) {
      throw new Error('Plugin must be mounted before updating products')
    }

    this.postMessage('updateProducts', { products })
    this.emit('productsUpdated', { products })
  }

  /**
   * Update plugin configuration
   */
  updateConfig(config: Partial<PluginConfig>): void {
    if (!this.config) {
      throw new Error('Plugin must be initialized before updating config')
    }

    this.config = { ...this.config, ...config }
    
    if (this.iframe) {
      this.postMessage('updateConfig', { config: this.config })
    }
    
    this.emit('configUpdated', { config: this.config })
  }

  /**
   * Add event listener
   */
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(callback)
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * Get analytics data
   */
  async getAnalytics(): Promise<any> {
    if (!this.config) {
      throw new Error('Plugin not initialized')
    }

    try {
      // This would make an API call to get analytics
      const response = await fetch(`${this.getApiUrl()}/analytics/dashboard`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Failed to get analytics:', error)
      throw error
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event listener for '${event}':`, error)
        }
      })
    }
  }

  /**
   * Build iframe source URL with configuration
   */
  private buildIframeSrc(): string {
    if (!this.config) {
      throw new Error('Configuration not available')
    }

    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : 'https://your-3d-store-domain.com'

    const params = new URLSearchParams({
      apiKey: this.config.apiKey,
      storeId: this.config.storeId,
      theme: JSON.stringify(this.config.theme || {}),
      features: JSON.stringify(this.config.features),
      plugin: 'true'
    })

    return `${baseUrl}?${params.toString()}`
  }

  /**
   * Get API base URL
   */
  private getApiUrl(): string {
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/api'
      : 'https://your-api-domain.com/api'
  }

  /**
   * Post message to iframe
   */
  private postMessage(type: string, data: any): void {
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage({
        type,
        data,
        source: '3d-ecommerce-plugin'
      }, '*')
    }
  }

  /**
   * Set up message handler for iframe communication
   */
  private setupMessageHandler(): void {
    window.addEventListener('message', (event) => {
      // Verify origin in production
      if (event.data?.source === '3d-ecommerce-store') {
        this.handleIframeMessage(event.data)
      }
    })
  }

  /**
   * Handle messages from iframe
   */
  private handleIframeMessage(message: any): void {
    const { type, data } = message

    switch (type) {
      case 'productViewed':
        this.emit('productViewed', data)
        break
      case 'productAddedToCart':
        this.emit('productAddedToCart', data)
        break
      case 'cartUpdated':
        this.emit('cartUpdated', data)
        break
      case 'checkoutStarted':
        this.emit('checkoutStarted', data)
        break
      case 'orderCompleted':
        this.emit('orderCompleted', data)
        break
      case 'userInteraction':
        this.emit('userInteraction', data)
        break
      case 'error':
        this.emit('error', data)
        console.error('3D Store Error:', data)
        break
      default:
        console.log('Unknown message from 3D store:', message)
    }
  }

  /**
   * Validate plugin configuration
   */
  private validateConfig(config: PluginConfig): void {
    if (!config.apiKey) {
      throw new Error('API key is required')
    }
    if (!config.storeId) {
      throw new Error('Store ID is required')
    }
    if (!config.features) {
      throw new Error('Features configuration is required')
    }
  }
}

/**
 * Shopify integration helper
 */
export class ShopifyIntegration {
  private plugin: Store3DPlugin
  private shopifyConfig: any

  constructor(plugin: Store3DPlugin, shopifyConfig: any) {
    this.plugin = plugin
    this.shopifyConfig = shopifyConfig
  }

  async syncProducts(): Promise<void> {
    try {
      // Fetch products from Shopify API
      const products = await this.fetchShopifyProducts()
      
      // Convert to our product format
      const convertedProducts = this.convertShopifyProducts(products)
      
      // Update 3D store
      this.plugin.updateProducts(convertedProducts)
    } catch (error) {
      console.error('Failed to sync Shopify products:', error)
      throw error
    }
  }

  private async fetchShopifyProducts(): Promise<any[]> {
    // Implementation would fetch from Shopify API
    return []
  }

  private convertShopifyProducts(shopifyProducts: any[]): Product[] {
    // Convert Shopify product format to our format
    return shopifyProducts.map(product => ({
      id: product.id.toString(),
      name: product.title,
      description: product.body_html,
      price: parseFloat(product.variants[0]?.price || '0'),
      currency: 'USD',
      category: product.product_type || 'Uncategorized',
      images: product.images.map((img: any) => img.src),
      inventory: product.variants[0]?.inventory_quantity || 0,
      tags: product.tags.split(',').map((tag: string) => tag.trim()),
      createdAt: new Date(product.created_at),
      updatedAt: new Date(product.updated_at)
    }))
  }
}

/**
 * WooCommerce integration helper
 */
export class WooCommerceIntegration {
  private plugin: Store3DPlugin
  private wooConfig: any

  constructor(plugin: Store3DPlugin, wooConfig: any) {
    this.plugin = plugin
    this.wooConfig = wooConfig
  }

  async syncProducts(): Promise<void> {
    try {
      // Similar implementation for WooCommerce
      console.log('WooCommerce sync not yet implemented')
    } catch (error) {
      console.error('Failed to sync WooCommerce products:', error)
      throw error
    }
  }
}

// Export factory function for easy initialization
export function create3DStorePlugin(): Store3DPlugin {
  return new Store3DEcommercePlugin()
}

// Export integration helpers (already exported above)

// Export types
export type { PluginConfig, EcommerceIntegration, Product } from '@shared/types'