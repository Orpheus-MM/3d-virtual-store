# 🚀 Quick Start Guide - Get Your 3D Store Running in 5 Minutes!

## 🎯 What You'll Get
- Interactive 3D virtual store running on http://localhost:3000
- Real-time backend API on http://localhost:3001
- Live WebSocket connections for real-time features
- Complete shopping cart and checkout flow
- Personalized recommendations
- Analytics dashboard

## ⚡ Super Quick Setup (Recommended)

### Step 1: Run the Setup Script

**On macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

**On Windows:**
```cmd
setup.bat
```

### Step 2: Start Development Servers
```bash
npm run dev
```

That's it! 🎉 Your 3D store will be running at http://localhost:3000

---

## 📋 Manual Setup (If You Prefer Step-by-Step)

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Create Environment Files

Create `server/.env`:
```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=development-jwt-secret
PLUGIN_SECRET_KEY=development-plugin-secret
```

Create `client/.env.local`:
```env
VITE_SERVER_URL=http://localhost:3001
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

### Step 2: Install Dependencies
```bash
# Install all dependencies at once
npm run install:all

# Or install manually:
npm install                # Root dependencies
cd client && npm install  # Frontend dependencies  
cd ../server && npm install # Backend dependencies
cd ../plugin && npm install # Plugin dependencies
```

### Step 3: Create Required Directories
```bash
mkdir -p server/uploads
mkdir -p client/public/models
mkdir -p client/public/textures
mkdir -p client/public/images
```

### Step 4: Start Development Servers
```bash
npm run dev
```

This starts both frontend and backend simultaneously.

---

## 🌐 Access Your 3D Store

- **3D Store Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Documentation**: http://localhost:3001/api

## 🎮 What You Can Do Right Away

### 🛍️ Shopping Experience
1. **Navigate the 3D Environment**: Use mouse to rotate, scroll to zoom
2. **Click on Products**: See detailed product information
3. **Add to Cart**: Click products and add them to your cart
4. **Real-time Cart**: Watch cart updates instantly
5. **Checkout Flow**: Complete the purchase process

### 📊 Analytics & Features
1. **User Interactions**: Every click and movement is tracked
2. **Personalized Recommendations**: AI suggests relevant products
3. **Real-time Sync**: Multiple browser tabs sync automatically
4. **WebSocket Features**: Live inventory updates and notifications

### 🎨 Customization
1. **Theme Colors**: Modify colors in the store configuration
2. **3D Models**: Add your own GLB files to `/client/public/models/`
3. **Store Layout**: Change from 'showroom' to 'gallery' or 'mall'
4. **Custom Branding**: Update logos and styling

---

## 🔧 Troubleshooting

### Common Issues & Solutions

**"Port 3000 already in use"**
```bash
# Kill the process using port 3000
npx kill-port 3000
# Or use a different port
PORT=3002 npm run dev:client
```

**"MongoDB connection failed"**
- The app works without MongoDB (uses mock data)
- To use real database: Install MongoDB locally or use MongoDB Atlas

**"Redis connection failed"**
- The app works without Redis (optional caching)
- To use Redis: Install Redis locally or use Redis Cloud

**"3D models not loading"**
- Add real GLB files to `client/public/models/`
- Free models available at:
  - [Sketchfab](https://sketchfab.com) (CC0 license)
  - [Poly Pizza](https://poly.pizza) (Free models)
  - [Ready Player Me](https://readyplayer.me) (Avatar models)

**"WebSocket connection failed"**
- Make sure both frontend and backend are running
- Check if port 3001 is accessible
- Disable ad blockers that might block WebSocket connections

---

## 🎯 Next Steps After Setup

### 1. Add Real 3D Models
Download some free GLB models and place them in `client/public/models/`:
- `sofa.glb` - For the furniture category
- `headphones.glb` - For electronics
- Add more models and update the product data in `server/src/routes/products.ts`

### 2. Customize Your Store
Edit the store configuration in `client/src/store/useStore.ts`:
```javascript
const mockStore3DConfig: Store3DConfig = {
  theme: {
    primaryColor: '#your-brand-color',
    secondaryColor: '#your-secondary-color',
    lighting: 'warm', // or 'cool', 'neutral'
    ambiance: 'modern' // or 'classic', 'futuristic'
  }
}
```

### 3. Test the Plugin Integration
Create a test HTML file:
```html
<!DOCTYPE html>
<html>
<head><title>Test 3D Store Plugin</title></head>
<body>
  <div id="store" style="width:100%; height:600px;"></div>
  <script src="http://localhost:3000/plugin.js"></script>
  <script>
    const store = create3DStorePlugin();
    store.init({
      apiKey: 'test-key',
      storeId: 'test-store',
      features: { personalization: true, realTimeSync: true }
    }).then(() => store.mount('store'));
  </script>
</body>
</html>
```

### 4. Explore the Analytics
- Check the browser console for real-time event tracking
- View network requests to see API calls
- Open multiple browser tabs to test real-time sync

---

## 📱 Mobile Testing

The 3D store is fully responsive! Test on mobile:
1. Get your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access from mobile: `http://YOUR_IP:3000`
3. Test touch gestures for 3D navigation

---

## 🆘 Need Help?

If you run into any issues:

1. **Check the console**: Look for error messages in browser dev tools
2. **Verify all services**: Make sure both frontend and backend are running
3. **Check network requests**: Ensure API calls are successful
4. **Test WebSocket**: Open browser dev tools → Network → WS tab

**Common Success Indicators:**
- ✅ Frontend loads without errors
- ✅ 3D scene renders properly
- ✅ Products are clickable and show information
- ✅ Cart functionality works
- ✅ WebSocket connection established
- ✅ Real-time features working

---

**🎉 Congratulations! Your 3D Virtual Store is now running locally!**

Explore the immersive shopping experience and start customizing it for your needs. The future of ecommerce is here! 🛍️✨