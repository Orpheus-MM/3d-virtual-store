#!/bin/bash

echo "🚀 Setting up 3D Ecommerce Plugin Development Environment..."

# Create environment files
echo "📝 Creating environment configuration files..."

# Server .env file
cat > server/.env << 'EOF'
# Server Configuration
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database Configuration (Optional - will use mock data if not available)
MONGODB_URI=mongodb://localhost:27017/3d-ecommerce

# Redis Configuration (Optional - will work without Redis)
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=development-jwt-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Payment Configuration (Stripe test keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Plugin Configuration
PLUGIN_API_VERSION=1.0.0
PLUGIN_SECRET_KEY=development-plugin-secret-key
EOF

# Client .env.local file
cat > client/.env.local << 'EOF'
VITE_SERVER_URL=http://localhost:3001
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
EOF

echo "✅ Environment files created!"

# Create uploads directory
echo "📁 Creating necessary directories..."
mkdir -p server/uploads
mkdir -p client/public/models
mkdir -p client/public/textures
mkdir -p client/public/images

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install client dependencies
echo "Installing client dependencies..."
cd client && npm install && cd ..

# Install server dependencies
echo "Installing server dependencies..."
cd server && npm install && cd ..

# Install plugin dependencies
echo "Installing plugin dependencies..."
cd plugin && npm install && cd ..

# Install shared dependencies
echo "Installing shared dependencies..."
cd shared && npm install 2>/dev/null || echo "Shared has no package.json, skipping..." && cd ..

echo "🎨 Creating sample 3D assets..."

# Create placeholder model files (these would be replaced with real GLB files)
cat > client/public/models/sofa.glb << 'EOF'
# Placeholder for sofa.glb - Replace with actual GLB file
# You can download free models from:
# - Sketchfab (https://sketchfab.com)
# - Poly Pizza (https://poly.pizza)
# - Google Poly Archive
EOF

cat > client/public/models/headphones.glb << 'EOF'
# Placeholder for headphones.glb - Replace with actual GLB file
EOF

# Create placeholder texture files
cat > client/public/textures/floor.jpg << 'EOF'
# Placeholder for floor.jpg - Replace with actual texture
EOF

cat > client/public/textures/wall.jpg << 'EOF'
# Placeholder for wall.jpg - Replace with actual texture
EOF

echo "🔧 Setup complete!"
echo ""
echo "🚀 To start the development environment, run:"
echo "   npm run dev"
echo ""
echo "This will start:"
echo "   - Frontend (React + Three.js): http://localhost:3000"
echo "   - Backend (Node.js + Express): http://localhost:3001"
echo "   - WebSocket server for real-time features"
echo ""
echo "📝 Note: For the best experience, add real 3D models (.glb files) to client/public/models/"
echo "🎯 You can find free 3D models at:"
echo "   - Sketchfab: https://sketchfab.com"
echo "   - Poly Pizza: https://poly.pizza"
echo "   - Ready Player Me: https://readyplayer.me"
echo ""
echo "Happy coding! 🎉"