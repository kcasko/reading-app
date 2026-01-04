# Real Image Setup Guide

**Status**: ✅ App now supports real PNG images with automatic emoji fallback.

## Quick Start

The app will automatically use PNG images if they exist, otherwise it displays emoji placeholders.

### Add Images (3 Steps)

1. **Get images** - Download 32 simple PNG images (512x512px minimum)
2. **Place files** - Drop into `assets/images/{category}/{word}.png`
3. **Restart app** - Images load automatically

That's it! No code changes needed.

## Image Requirements

- **Format**: PNG (transparent or white background)
- **Size**: 512x512 pixels minimum (app displays at 200x200)
- **Style**: Simple, realistic photos OR clear illustrations
- **Content**: One object, centered, uncluttered
- **Naming**: Exact match to word (e.g., `cat.png` not `Cat.png` or `CAT.png`)

## Where to Find Free Images

### Recommended: Unsplash (Best Quality)
**https://unsplash.com**
- Search: "{word} isolated" or "{word} white background"
- Free for commercial use, no attribution required
- High-quality, professional photos
- Download "Medium" size (usually 1000px+)

### Alternative: Pexels
**https://pexels.com**
- Similar to Unsplash, also free
- Good variety of simple object photos
- Filter by: Square orientation when available

### For Icons/Illustrations: The Noun Project
**https://thenounproject.com**
- Filter by "Public Domain"
- Simple, clear icons work great for children
- Download as PNG, 512x512 or larger

### Quick Background Removal
**https://remove.bg**
- Paste any image, automatically removes background
- Free for personal use
- Creates clean PNG with transparency

## Complete Image List

**32 total images needed:**

### Animals (8)
- cat.png, dog.png, bird.png, fish.png
- cow.png, pig.png, horse.png, duck.png

### Food (8)
- apple.png, banana.png, bread.png, milk.png
- egg.png, cake.png, pizza.png, cookie.png

### Objects (8)
- ball.png, book.png, cup.png, chair.png
- door.png, bed.png, table.png, hat.png

### Vehicles (8)
- car.png, bus.png, truck.png, train.png
- boat.png, plane.png, bike.png, ship.png

See detailed checklist in `assets/images/README.md`

## Testing

1. Add any single image (e.g., `assets/images/animals/cat.png`)
2. Start app and navigate to that word
3. Should see real image instead of emoji 🐱
4. If emoji still shows: check filename matches exactly (lowercase, .png extension)

## Pro Tips

- **Start small**: Add 8 images (one category) to validate setup works
- **Consistency**: Use all photos OR all illustrations, not mixed
- **Background**: White background looks cleanest on app's neutral interface
- **Size**: Slightly larger than 512x512 is fine (app will scale down)
- **Cropping**: Don't worry about perfect cropping - app shows 200x200 centered
- **Quality over speed**: Take time to find clear, simple images - they're critical for learning

## How It Works (Technical)

The app uses this fallback strategy:
1. Try to load PNG from `assets/images/{category}/{word}.png`
2. If image exists → Display real image
3. If image missing or fails → Display emoji placeholder
4. Error handling ensures app never crashes from missing images

Code is in `src/components/WordCard.tsx` if you want to customize.
