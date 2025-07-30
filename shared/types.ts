// Core Entity Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  model3D?: {
    url: string;
    format: 'glb' | 'gltf' | 'fbx';
    scale?: number;
    position?: Vector3;
    rotation?: Vector3;
  };
  inventory: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  shoppingHistory: ShoppingSession[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  favoriteCategories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  style: string[];
  notifications: {
    email: boolean;
    push: boolean;
  };
  privacy: {
    shareData: boolean;
    trackBehavior: boolean;
  };
}

export interface ShoppingSession {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  currency: string;
  status: 'active' | 'checkout' | 'completed' | 'abandoned';
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  customization?: {
    color?: string;
    size?: string;
    engraving?: string;
  };
  addedAt: Date;
}

// 3D Scene Types
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Store3DConfig {
  id: string;
  name: string;
  layout: 'showroom' | 'gallery' | 'mall' | 'custom';
  theme: {
    primaryColor: string;
    secondaryColor: string;
    lighting: 'warm' | 'cool' | 'neutral';
    ambiance: 'modern' | 'classic' | 'futuristic';
  };
  camera: {
    position: Vector3;
    target: Vector3;
    fov: number;
  };
  environment: {
    skybox?: string;
    ground?: string;
    walls?: string[];
  };
  interactionZones: InteractionZone[];
}

export interface InteractionZone {
  id: string;
  type: 'product_display' | 'checkout' | 'information' | 'navigation';
  position: Vector3;
  size: Vector3;
  productIds?: string[];
  content?: string;
  actions: string[];
}

export interface Scene3DObject {
  id: string;
  type: 'product' | 'furniture' | 'decoration' | 'ui_element';
  modelUrl: string;
  position: Vector3;
  rotation: Vector3;
  scale: Vector3;
  interactive: boolean;
  metadata?: {
    productId?: string;
    description?: string;
    price?: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Real-time Event Types
export interface SocketEvent {
  type: string;
  payload: any;
  timestamp: Date;
  userId?: string;
  sessionId: string;
}

export interface UserInteractionEvent extends SocketEvent {
  type: 'user_interaction';
  payload: {
    action: 'view_product' | 'add_to_cart' | 'remove_from_cart' | 'checkout' | 'navigate';
    productId?: string;
    position?: Vector3;
    duration?: number;
  };
}

export interface CartUpdateEvent extends SocketEvent {
  type: 'cart_update';
  payload: {
    items: CartItem[];
    total: number;
    itemCount: number;
  };
}

// Plugin Configuration Types
export interface PluginConfig {
  apiKey: string;
  storeId: string;
  theme?: Partial<Store3DConfig['theme']>;
  features: {
    personalization: boolean;
    realTimeSync: boolean;
    analytics: boolean;
    chatSupport: boolean;
  };
  customization?: {
    css?: string;
    js?: string;
    layout?: string;
  };
}

export interface EcommerceIntegration {
  platform: 'shopify' | 'woocommerce' | 'magento' | 'custom';
  credentials: {
    apiKey: string;
    secretKey?: string;
    storeUrl: string;
  };
  webhooks: {
    orderCreated: string;
    productUpdated: string;
    inventoryChanged: string;
  };
}

// Analytics Types
export interface AnalyticsEvent {
  eventType: string;
  properties: Record<string, any>;
  userId?: string;
  sessionId: string;
  timestamp: Date;
  metadata?: {
    userAgent?: string;
    ip?: string;
    referrer?: string;
  };
}

export interface UserBehavior {
  userId: string;
  sessionId: string;
  events: AnalyticsEvent[];
  summary: {
    totalTime: number;
    productsViewed: number;
    itemsAddedToCart: number;
    checkoutAttempts: number;
    purchaseValue?: number;
  };
} 