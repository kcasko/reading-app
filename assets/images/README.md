# Image Assets for Reading App

## Directory Structure

```text
assets/images/
├── animals/     # 8 animal images
├── food/        # 8 food images  
├── objects/     # 8 object images
└── vehicles/    # 8 vehicle images
```

## Image Requirements

### Technical Specifications

- **Format**: PNG with transparency
- **Size**: 512x512 pixels (will be displayed at 200x200)
- **Style**: Simple, clean photographs or realistic illustrations
- **Background**: White or transparent
- **Quality**: High resolution, clear and uncluttered

### Content Guidelines

- **Realistic**: Use real photos or photo-realistic illustrations
- **Unambiguous**: Each image should clearly represent ONE object
- **Child-appropriate**: Simple, friendly, non-threatening
- **Consistent lighting**: Evenly lit, no harsh shadows
- **Centered**: Object centered in frame with minimal background

## Where to Find Images

### Free Stock Photos (Recommended)

1. **Unsplash** (<https://unsplash.com>) - Free high-quality photos
   - Search: "{word} white background"
   - License: Free for commercial use
   
2. **Pexels** (<https://pexels.com>) - Free stock photos
   - Filter by orientation: Square
   - High quality, simple compositions

3. **Pixabay** (<https://pixabay.com>) - Free images
   - Search with "isolated" or "white background"
   - Download large size

### Icon/Illustration Resources

1. **The Noun Project** (<https://thenounproject.com>)
   - Filter: Public Domain
   - Style: Flat, simple icons
   - Download as PNG 512x512

2. **Flaticon** (<https://flaticon.com>)
   - Free tier available (requires attribution)
   - Kid-friendly styles available
   - Download PNG format

## Required Images

### Animals (8)

- [ ] cat.png
- [ ] dog.png
- [ ] bird.png
- [ ] fish.png
- [ ] cow.png
- [ ] pig.png
- [ ] horse.png
- [ ] duck.png

### Food (8)

- [ ] apple.png
- [ ] banana.png
- [ ] bread.png
- [ ] milk.png
- [ ] egg.png
- [ ] cake.png
- [ ] pizza.png
- [ ] cookie.png

### Objects (8)

- [ ] ball.png
- [ ] book.png
- [ ] cup.png
- [ ] chair.png
- [ ] door.png
- [ ] bed.png
- [ ] table.png
- [ ] hat.png

### Vehicles (8)

- [ ] car.png
- [ ] bus.png
- [ ] truck.png
- [ ] train.png
- [ ] boat.png
- [ ] plane.png
- [ ] bike.png
- [ ] ship.png

## Quick Processing Steps

If images need editing:

1. **Remove background**: Use remove.bg (<https://remove.bg>)
2. **Resize to 512x512**: Use ImageMagick or online tools
3. **Optimize PNG**: Use TinyPNG (<https://tinypng.com>)
4. **Save** to appropriate category folder

## Testing

Until real images are added, the app will display emoji placeholders (🐱🍎⚽🚗). Once you add a PNG file with the correct name, it will automatically use the real image instead.

To test:

1. Add one image (e.g., `animals/cat.png`)
2. Start the app
3. Verify the image displays when the word "cat" appears
4. If you see the emoji 🐱, the image isn't loading (check filename/path)
