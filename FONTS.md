# Custom Fonts Setup for Reading App

## Overview
This app now supports custom fonts optimized for readability, especially for children with dyslexia or reading difficulties.

## Available Fonts

### 1. **Default (System)**
- Uses device's built-in font
- Clean, familiar appearance
- Good general readability

### 2. **OpenDyslexic**
- Specially designed for dyslexic readers
- Bottom-heavy letters prevent rotation/confusion
- Unique character shapes for easier differentiation
- Open-source, free for educational use

### 3. **Comic Sans MS**
- Simple, friendly letterforms
- Clear distinction between similar letters (b/d, p/q)
- Often recommended for early readers
- Built-in on most devices

## Installation

### Step 1: Download OpenDyslexic Font

1. Visit: https://opendyslexic.org/
2. Download the font package
3. Extract the following files to `assets/fonts/`:
   - `OpenDyslexic-Regular.otf`
   - `OpenDyslexic-Bold.otf`

### Step 2: File Structure

Place font files in:
```
assets/
  fonts/
    OpenDyslexic-Regular.otf
    OpenDyslexic-Bold.otf
```

### Step 3: Font Loading

The app automatically loads fonts on startup using `expo-font`. No additional configuration needed.

## Usage

1. Open **Settings** screen
2. Tap **Parent Mode** button (hold 3 seconds)
3. Select **Font** option
4. Choose from:
   - **System** (default)
   - **OpenDyslexic** (dyslexia-friendly)
   - **Comic Sans** (child-friendly)

Font choice is saved per child profile.

## Technical Details

### Font Configuration
- Defined in: `src/theme/typography.ts`
- Applied via: `AppSettings.fontFamily`
- Persisted in: AsyncStorage per profile

### Font Families Exported
```typescript
export type FontFamily = 'system' | 'opendyslexic' | 'comic-sans';

export const FONT_FAMILIES = {
  system: 'System',
  opendyslexic: 'OpenDyslexic-Regular',
  'comic-sans': 'Comic Sans MS',
};
```

### Applied To
- Word cards (main learning text)
- All UI text (buttons, labels, headings)
- Settings and progress screens
- Review mode

## Benefits

### For Children with Dyslexia
- **OpenDyslexic**: Reduces letter confusion and reversal
- **Weighted bottoms**: Letters anchored to prevent flipping
- **Clear spacing**: Better word recognition

### For Early Readers
- **Comic Sans**: Friendly, approachable appearance
- **Simple shapes**: Easy letter recognition
- **Clear differentiation**: Reduces b/d/p/q confusion

### For All Children
- **Consistent typography**: Same font throughout app
- **Large sizes**: Optimized for visibility
- **High contrast**: Easy to read on all backgrounds

## Font Licensing

### OpenDyslexic
- License: SIL Open Font License 1.1
- Free for personal and educational use
- Attribution appreciated but not required
- https://opendyslexic.org/

### Comic Sans MS
- Built-in system font
- Widely available on iOS and Android
- No additional licensing needed

### System Font
- Native device font
- Always available
- No licensing concerns

## Troubleshooting

### Font Not Loading
If OpenDyslexic doesn't appear:
1. Verify files are in `assets/fonts/`
2. Check file names match exactly
3. Restart app after adding fonts
4. Check console for font loading errors

### Font Appears Incorrect
- Clear app cache
- Reinstall app
- Verify font file integrity

### Performance Issues
If app loads slowly:
- Fonts are loaded asynchronously
- Loading screen shows until ready
- Should only occur on first launch

## Future Enhancements

Potential font additions:
- **Sassoon Primary**: UK-based educational font
- **Andika**: Designed for literacy programs
- **Atkinson Hyperlegible**: High legibility for low vision
- **Read Regular**: Another dyslexia-focused option

## Resources

- OpenDyslexic: https://opendyslexic.org/
- Dyslexia fonts research: https://www.bdadyslexia.org.uk/advice/employers/creating-a-dyslexia-friendly-workplace/dyslexia-friendly-style-guide
- British Dyslexia Association style guide
