@echo off
echo 🚀 Setting up 3D Ecommerce Plugin Development Environment...

REM Create environment files
echo 📝 Creating environment configuration files...

REM Server .env file
(
echo # Server Configuration
echo PORT=3001
echo NODE_ENV=development
echo CLIENT_URL=http://localhost:3000
echo.
echo # Database Configuration ^(Optional - will use mock data if not available^)
echo MONGODB_URI=mongodb://localhost:27017/3d-ecommerce
echo.
echo # Redis Configuration ^(Optional - will work without Redis^)
echo REDIS_URL=redis://localhost:6379
echo.
echo # JWT Configuration
echo JWT_SECRET=development-jwt-secret-key-change-in-production
echo JWT_EXPIRES_IN=7d
echo.
echo # Payment Configuration ^(Stripe test keys^)
echo STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
echo STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
echo.
echo # Plugin Configuration
echo PLUGIN_API_VERSION=1.0.0
echo PLUGIN_SECRET_KEY=development-plugin-secret-key
) > server\.env

REM Client .env.local file
(
echo VITE_SERVER_URL=http://localhost:3001
echo VITE_API_URL=http://localhost:3001/api
echo VITE_SOCKET_URL=http://localhost:3001
) > client\.env.local

echo ✅ Environment files created!

REM Create directories
echo 📁 Creating necessary directories...
mkdir server\uploads 2>nul
mkdir client\public\models 2>nul
mkdir client\public\textures 2>nul
mkdir client\public\images 2>nul

echo 📦 Installing dependencies...

REM Install root dependencies
call npm install

REM Install client dependencies
echo Installing client dependencies...
cd client && call npm install && cd ..

REM Install server dependencies
echo Installing server dependencies...
cd server && call npm install && cd ..

REM Install plugin dependencies
echo Installing plugin dependencies...
cd plugin && call npm install && cd ..

echo 🔧 Setup complete!
echo.
echo 🚀 To start the development environment, run:
echo    npm run dev
echo.
echo This will start:
echo    - Frontend ^(React + Three.js^): http://localhost:3000
echo    - Backend ^(Node.js + Express^): http://localhost:3001
echo    - WebSocket server for real-time features
echo.
echo 📝 Note: For the best experience, add real 3D models ^(.glb files^) to client/public/models/
echo 🎯 You can find free 3D models at:
echo    - Sketchfab: https://sketchfab.com
echo    - Poly Pizza: https://poly.pizza
echo    - Ready Player Me: https://readyplayer.me
echo.
echo Happy coding! 🎉
pause