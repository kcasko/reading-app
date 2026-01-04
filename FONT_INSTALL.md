# Font Installation Guide

## Quick Start

The reading app supports 3 font options:
1. **System** (default) - Always available
2. **Comic Sans MS** - Built into iOS/Android
3. **OpenDyslexic** - Optional download (see below)

## Installing OpenDyslexic Fonts

### Step 1: Download Fonts

1. Visit https://opendyslexic.org/
2. Click "Download" or go to: https://github.com/antijingoist/opendyslexic/releases
3. Download the latest release (look for `opendyslexic-*.zip`)
4. Extract the ZIP file

### Step 2: Locate Font Files

In the extracted folder, find these files in the `otf/` subdirectory:
- `OpenDyslexic-Regular.otf`
- `OpenDyslexic-Bold.otf`

### Step 3: Copy to Project

Copy both `.otf` files to:
```
reading-app/
  assets/
    fonts/
      OpenDyslexic-Regular.otf
      OpenDyslexic-Bold.otf
```

### Step 4: Install Dependencies

Run:
```bash
npm install
```

This installs `expo-font` which is needed to load custom fonts.

### Step 5: Restart App

If the app is running, restart it:
```bash
# Press Ctrl+C to stop, then:
npm start
```

The fonts will be loaded on startup. Once loaded, the OpenDyslexic option will appear in Settings.

## Verifying Installation

1. Launch the app
2. Open **Settings** (tap "Parent Mode" for 3 seconds on home screen)
3. Scroll to **Font Style** section
4. You should see 3 options:
   - System
   - OpenDyslexic ← This confirms fonts loaded successfully
   - Comic Sans

If OpenDyslexic doesn't appear, check the console for errors.

## Troubleshooting

### "Cannot find module" error

**Problem**: App shows error about missing font files

**Solution**:
1. Verify font files are in `assets/fonts/` folder
2. Check file names match exactly:
   - `OpenDyslexic-Regular.otf` (case-sensitive)
   - `OpenDyslexic-Bold.otf` (case-sensitive)
3. Restart the development server

### Fonts don't appear different

**Problem**: Selecting OpenDyslexic doesn't change the font

**Solutions**:
1. Make sure you selected it in Settings and tapped the button
2. Settings are saved immediately - no "Save" button needed
3. Try switching to another font and back
4. Restart the app

### App crashes on startup after adding fonts

**Problem**: App won't load after copying font files

**Solutions**:
1. Check that font files are valid `.otf` files
2. Verify file names are correct (no typos)
3. Clear Metro bundler cache:
   ```bash
   npm start -- --clear
   ```
4. If still failing, temporarily remove font files and file an issue

## Font Not Installing? Use System/Comic Sans

The app works perfectly without OpenDyslexic! 

- **System font** is clean and readable
- **Comic Sans MS** is already built-in and great for early readers

You can always add OpenDyslexic later if you want.

## Technical Details

### How Font Loading Works

1. **App Start**: `App.tsx` calls `loadCustomFonts()`
2. **Font Load**: `fonts.ts` attempts to load `.otf` files
3. **Fallback**: If files missing, silently continues (no crash)
4. **Selection**: User chooses font in Settings
5. **Apply**: `typography.ts` generates styles with selected font
6. **Render**: All text components use dynamic typography

### Font Files Required

Only 2 files needed:
- **Regular**: Used for body text, labels, captions
- **Bold**: Used for headings, buttons, word display

### Supported Formats

- `.otf` (OpenType Font) - Preferred
- `.ttf` (TrueType Font) - Also works

## Alternative Fonts

Want to add other fonts? Edit these files:

1. **Add font definition**: `src/state/progressStore.ts`
   ```typescript
   export type FontFamily = 'system' | 'opendyslexic' | 'comic-sans' | 'your-font';
   ```

2. **Map font files**: `src/theme/typography.ts`
   ```typescript
   'your-font': {
     regular: 'YourFont-Regular',
     bold: 'YourFont-Bold',
   }
   ```

3. **Load font**: `src/utils/fonts.ts`
   ```typescript
   'YourFont-Regular': require('../../assets/fonts/YourFont-Regular.otf'),
   ```

4. **Add to Settings**: `src/screens/SettingsScreen.tsx`
   ```typescript
   { id: 'your-font', label: 'Your Font' }
   ```

## License Information

### OpenDyslexic
- **License**: SIL Open Font License 1.1
- **Commercial Use**: Allowed
- **Attribution**: Not required but appreciated
- **Website**: https://opendyslexic.org/

### Comic Sans MS
- **License**: Built into iOS/Android
- **Availability**: System font, always available
- **No files needed**

### System Font
- **License**: Native device font
- **Availability**: Always available
- **No files needed**

## Getting Help

If you have issues:
1. Check console for error messages
2. Verify file paths and names
3. Try clearing cache: `npm start -- --clear`
4. Check [FONTS.md](FONTS.md) for more details
5. File an issue with error message

## Summary

✅ **Minimum setup**: Nothing needed - System/Comic Sans work out of box

📥 **For OpenDyslexic**: 
1. Download from https://opendyslexic.org/
2. Copy 2 `.otf` files to `assets/fonts/`
3. Run `npm install`
4. Restart app

🎨 **Select in app**: Settings → Font Style → Choose your preference

That's it! Fonts persist per child profile.
