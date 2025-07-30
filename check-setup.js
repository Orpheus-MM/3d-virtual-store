#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking 3D Ecommerce Plugin Setup...\n');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

console.log(`📦 Node.js Version: ${nodeVersion}`);
if (majorVersion >= 18) {
  console.log('✅ Node.js version is compatible\n');
} else {
  console.log('❌ Node.js version should be 18+ for best compatibility\n');
}

// Check if required files exist
const requiredFiles = [
  'package.json',
  'client/package.json',
  'server/package.json',
  'plugin/package.json',
  'shared/types.ts',
  'server/.env',
  'client/.env.local'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

// Check if directories exist
const requiredDirs = [
  'client/public/models',
  'client/public/textures',
  'client/public/images',
  'server/uploads'
];

console.log('\n📂 Checking required directories:');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - MISSING`);
  }
});

// Check if node_modules exist
const nodeModulesDirs = [
  'node_modules',
  'client/node_modules',
  'server/node_modules',
  'plugin/node_modules'
];

console.log('\n📦 Checking installed dependencies:');
let allDepsInstalled = true;
nodeModulesDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - RUN: npm install`);
    allDepsInstalled = false;
  }
});

// Check ports
console.log('\n🌐 Port Information:');
console.log('📍 Frontend will run on: http://localhost:3000');
console.log('📍 Backend will run on: http://localhost:3001');
console.log('📍 Health check: http://localhost:3001/health');

// Final status
console.log('\n📊 Setup Status:');
if (allDepsInstalled && majorVersion >= 18) {
  console.log('🎉 Setup looks good! Run "npm run dev" to start the development servers.');
} else {
  console.log('⚠️  Setup needs attention. Please install missing dependencies or update Node.js.');
}

// Next steps
console.log('\n🚀 Next Steps:');
console.log('1. Run: npm run dev');
console.log('2. Open: http://localhost:3000');
console.log('3. Start shopping in your 3D store!');

console.log('\n💡 Pro Tips:');
console.log('- Add real GLB models to client/public/models/ for better visuals');
console.log('- Check browser console for any errors');
console.log('- Test WebSocket connection in DevTools → Network → WS');
console.log('- Try opening multiple tabs to see real-time sync');

console.log('\n🆘 If you need help:');
console.log('- Check SETUP_INSTRUCTIONS.md for detailed setup');
console.log('- Check QUICK_START.md for common troubleshooting');
console.log('- Ensure ports 3000 and 3001 are available');