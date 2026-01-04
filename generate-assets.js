#!/usr/bin/env node

/**
 * Asset Generation Script
 * 
 * This script creates basic PNG assets for the Expo app.
 * Run this script to generate the required icon, splash, and adaptive-icon files.
 * 
 * Requirements:
 * - Node.js with sharp package: npm install sharp
 * 
 * Usage:
 * node generate-assets.js
 */

const fs = require('fs');
const path = require('path');

// Simple base64 encoded 1x1 transparent PNG
const transparentPNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Simple colored PNG data for different sizes
function generateSimplePNG(width, height, color = '#7A6B9A') {
  // This is a basic approach - in practice you'd use a proper image library
  const canvas = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">SW</text>
  </svg>`;
  
  return canvas;
}

function createAssets() {
  const assetsDir = path.join(__dirname, 'assets', 'images');
  
  // Create basic SVG assets that can be manually converted to PNG
  const assets = [
    { name: 'icon.png', width: 1024, height: 1024, color: '#7A6B9A' },
    { name: 'splash.png', width: 1242, height: 2436, color: '#F5F0E8' },
    { name: 'adaptive-icon.png', width: 432, height: 432, color: '#7A6B9A' }
  ];
  
  console.log('📱 Generating app assets...\n');
  
  assets.forEach(asset => {
    const svgContent = generateSimplePNG(asset.width, asset.height, asset.color);
    const svgPath = path.join(assetsDir, asset.name.replace('.png', '.svg'));
    
    fs.writeFileSync(svgPath, svgContent);
    console.log(`✅ Created ${asset.name.replace('.png', '.svg')} (${asset.width}x${asset.height})`);
  });
  
  console.log('\n📋 Next Steps:');
  console.log('1. Convert SVG files to PNG using an online converter or image editor');
  console.log('2. Replace the generated SVG files with proper PNG versions');
  console.log('3. Or install sharp package and extend this script for automatic conversion');
  console.log('\nAlternatively, you can use Expo\'s asset generation tools:');
  console.log('npx expo install @expo/image-utils');
}

if (require.main === module) {
  try {
    createAssets();
  } catch (error) {
    console.error('❌ Error generating assets:', error.message);
    process.exit(1);
  }
}

module.exports = { createAssets };