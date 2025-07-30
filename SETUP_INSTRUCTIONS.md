# 📦 Complete Setup Instructions for 3D Ecommerce Plugin

## 🎯 Prerequisites Installation

### Step 1: Install Node.js

**You'll need Node.js 18+ to run this project.**

#### On macOS:
```bash
# Option 1: Using Homebrew (Recommended)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node

# Option 2: Download from official website
# Visit: https://nodejs.org/en/download/
# Download the macOS installer and run it
```

#### On Windows:
```cmd
# Option 1: Download from official website (Recommended)
# Visit: https://nodejs.org/en/download/
# Download the Windows installer and run it

# Option 2: Using Chocolatey
choco install nodejs

# Option 3: Using Winget
winget install OpenJS.NodeJS
```

#### On Linux (Ubuntu/Debian):
```bash
# Update package index
sudo apt update

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Verify Installation
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

---

## 🚀 Quick Start (After Node.js is Installed)

### Option A: Automated Setup (Recommended)

**On macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
npm run dev
```

**On Windows:**
```cmd
setup.bat
npm run dev
```

### Option B: Manual Setup

1. **Install Dependencies:**
```bash
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..
cd plugin && npm install && cd ..
```

2. **Environment Files Created (Already Done):**
- `server/.env` ✅
- `client/.env.local` ✅

3. **Start Development Servers:**
```bash
npm run dev
```

---

## 🌐 Access Your 3D Store

After running `npm run dev`, you'll see:

```
🚀 Server running on port 3001
📊 Health check: http://localhost:3001/health
🔌 Socket.IO server ready
🌐 Environment: development

> client@0.0.0 dev
> vite

  VITE v5.0.0  ready in 1.2s

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Your 3D Store is now running at: http://localhost:3000** 🎉

---

## 🎮 What You Can Do Immediately

### 1. **Navigate the 3D Environment**
- **Mouse Controls**: Click and drag to rotate the camera
- **Scroll**: Zoom in and out
- **Click Products**: Interactive product displays with hover effects

### 2. **Test Shopping Features**
- Click on any product (Modern Sofa, Wireless Headphones)
- View detailed product information in modal
- Add items to cart and see real-time updates
- Open cart sidebar and modify quantities

### 3. **Experience Real-time Features**
- Open multiple browser tabs → cart syncs automatically
- WebSocket connection shows live status
- User interactions tracked in real-time

### 4. **Explore the Interface**
- **Top Navigation**: Search, user profile, cart with item count
- **Bottom Navigation**: Quick access to store features
- **Floating UI**: Recommendations panel, recently viewed
- **Mini Map**: Store layout overview

---

## 🔧 Current Features Working

### ✅ **3D Experience**
- Interactive 3D scene with Three.js
- Product displays with 3D placeholders
- Realistic lighting and shadows
- Smooth camera controls
- Hover effects and animations

### ✅ **Shopping Cart**
- Add/remove products
- Quantity management
- Real-time total calculation
- Cart persistence
- Multi-tab synchronization

### ✅ **Real-time Features**
- WebSocket connections
- Live cart updates
- User interaction tracking
- Real-time notifications

### ✅ **User Interface**
- Responsive design (mobile-friendly)
- Modern UI with Tailwind CSS
- Smooth animations with Framer Motion
- Loading screens and transitions

### ✅ **Backend API**
- RESTful endpoints for products, users, orders
- WebSocket server for real-time features
- Analytics and personalization services
- Mock data for immediate testing

---

## 🎨 Customization Options

### Change Store Theme
Edit `client/src/store/useStore.ts`:
```javascript
const mockStore3DConfig: Store3DConfig = {
  theme: {
    primaryColor: '#ff6b6b',    // Your brand color
    secondaryColor: '#4ecdc4',  // Secondary color
    lighting: 'cool',           // warm, cool, neutral
    ambiance: 'futuristic'      // modern, classic, futuristic
  }
}
```

### Add Real 3D Models
1. Download GLB files from [Sketchfab](https://sketchfab.com) or [Poly Pizza](https://poly.pizza)
2. Place them in `client/public/models/`
3. Update product data in `server/src/routes/products.ts`

### Modify Products
Edit the `mockProducts` array in `server/src/routes/products.ts`:
```javascript
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Your Product Name',
    price: 299.99,
    category: 'Your Category',
    model3D: {
      url: '/models/your-model.glb',
      scale: 1.0
    }
    // ... other properties
  }
]
```

---

## 🐛 Troubleshooting

### Common Issues:

**"Port already in use"**
```bash
# Kill process on port 3000 or 3001
npx kill-port 3000
npx kill-port 3001
```

**"Cannot find module"**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**"Permission denied" (macOS/Linux)**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

**"3D Scene not rendering"**
- Make sure you're using a modern browser (Chrome, Firefox, Safari, Edge)
- Check if WebGL is enabled: Visit https://get.webgl.org/

**"WebSocket connection failed"**
- Ensure both frontend and backend are running
- Check browser console for error messages
- Disable ad blockers that might block WebSocket

---

## 📱 Mobile Testing

Test on mobile devices:
1. Find your local IP address:
   - **macOS/Linux**: `ifconfig | grep inet`
   - **Windows**: `ipconfig`
2. Access from mobile: `http://YOUR_IP:3000`
3. Test touch gestures for 3D navigation

---

## 🔍 What's Next?

### 1. **Add Real Content**
- Replace placeholder 3D models with real GLB files
- Update product data with your actual inventory
- Add real product images

### 2. **Integrate with Your Platform**
- Use the plugin wrapper for Shopify/WooCommerce
- Connect to your existing product database
- Set up payment processing

### 3. **Advanced Features**
- Set up MongoDB for persistent data
- Configure Redis for better caching
- Add email notifications
- Set up analytics dashboard

### 4. **Production Deployment**
- Build for production: `npm run build`
- Deploy to your preferred hosting service
- Configure domain and SSL certificates

---

## 🆘 Support

If you encounter any issues:

1. **Check the logs**: Both frontend and backend show detailed logs
2. **Browser DevTools**: Check console for errors
3. **Network Tab**: Verify API calls are successful
4. **WebSocket Tab**: Ensure WebSocket connection is established

**Success Indicators:**
- ✅ Both servers start without errors
- ✅ Frontend loads at http://localhost:3000
- ✅ 3D scene renders properly
- ✅ Products are clickable
- ✅ Cart functionality works
- ✅ WebSocket connection established (check Network → WS in DevTools)

---

**🎉 Your 3D Virtual Store is Ready!**

The future of ecommerce is immersive, interactive, and incredibly engaging. You now have a cutting-edge 3D shopping platform that will wow your customers and boost your conversions! 🛍️✨