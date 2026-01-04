# App Assets

This directory contains the app's visual assets.

## Required Assets for Expo

The following assets are required for the app to build and deploy properly:

### Icon Assets
- `icon.png` (1024x1024) - Main app icon
- `adaptive-icon.png` (432x432) - Android adaptive icon foreground  
- `splash.png` (1242x2436) - Splash screen image

### Current Status
- ✅ SVG templates created for all required assets
- ⏳ PNG conversion needed for Expo compatibility

## Converting SVG to PNG

You can convert the provided SVG files to PNG using:

1. **Online converters** (easiest):
   - https://svgtopng.com/
   - https://cloudconvert.com/svg-to-png

2. **Command line tools**:
   ```bash
   # Using ImageMagick
   convert icon.svg -background none icon.png
   
   # Using Inkscape
   inkscape icon.svg --export-png=icon.png
   ```

3. **Node.js with sharp**:
   ```bash
   npm install sharp
   node generate-assets.js
   ```

## Asset Specifications

### App Icon (icon.png)
- Size: 1024x1024 pixels
- Format: PNG with transparency
- Used for: iOS App Store, Android Play Store

### Splash Screen (splash.png)  
- Size: 1242x2436 pixels (iPhone X/11 Pro resolution)
- Format: PNG
- Background: Matches app theme (#F5F0E8)
- Used for: App loading screen

### Adaptive Icon (adaptive-icon.png)
- Size: 432x432 pixels
- Format: PNG with transparency
- Safe area: 108px margin from edges
- Used for: Android adaptive icons

## Design Guidelines

The app uses a reading/education theme with:
- Primary color: #7A6B9A (purple)
- Secondary color: #D48A5D (orange)
- Accent color: #F9D71C (yellow)
- Background: #F5F0E8 (cream)

Icons should include:
- Book or reading elements
- Letter "A" or text elements
- Child-friendly, approachable design
- High contrast for accessibility