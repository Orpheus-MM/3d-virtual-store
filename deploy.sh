#!/bin/bash

echo "🚀 Deploying 3D Ecommerce Store to Vercel"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Install Vercel CLI if not installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Build the client
echo "🔨 Building client for production..."
cd client
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Client build failed"
    exit 1
fi

cd ..

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "📋 Your 3D store should now be live on Vercel"
echo ""
echo "🔍 Next steps:"
echo "1. Check the deployment URL provided by Vercel"
echo "2. Test the 3D store functionality"
echo "3. Share the live URL with others!"
echo ""
echo "🎉 Congratulations! Your 3D Virtual Store is now live!"