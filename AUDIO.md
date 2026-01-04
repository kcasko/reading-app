# Audio Files Setup

> **Quick Links:** [README](README.md) | [Features](FEATURES.md) | [Fonts Setup](FONTS.md)

The reading app supports optional audio files for enhanced learning experience. Audio features work without these files (they'll fall back to console messages), but adding them provides better user experience.

## Required Audio Files

Place these audio files in `assets/audio/ui/`:

### 1. Success Sound (`success.mp3`)
- **Purpose**: Plays when a lesson is completed
- **Duration**: 1-3 seconds
- **Style**: Gentle, encouraging chime or bell sound
- **Volume**: Medium (app plays at 60% volume)
- **Format**: MP3, 44.1kHz, 128kbps or higher

### 2. Background Music (`background.mp3`) 
- **Purpose**: Optional ambient music during lessons
- **Duration**: 30+ seconds (will loop)
- **Style**: Very subtle, calming, instrumental
- **Volume**: Quiet (app plays at 30% volume by default)
- **Format**: MP3, 44.1kHz, 96-128kbps
- **Note**: Should not distract from learning

## Audio File Recommendations

### Success Sound Options:
- Simple bell chime
- Gentle "ding" or "chime" sound
- Short musical phrase (major scale)
- Xylophone notes
- Soft notification sound

### Background Music Options:
- Gentle piano melody
- Soft acoustic guitar
- Nature sounds (rain, ocean waves)
- Minimal ambient music
- Classical music (very quiet)

## Free Audio Resources

### Royalty-Free Sound Libraries:
- **Freesound.org** - Community-driven sound library
- **Zapsplat.com** - Professional sound effects (free with registration)
- **YouTube Audio Library** - Free music and sound effects
- **ccMixter.org** - Creative Commons music
- **OpenGameArt.org** - Game audio assets

### Search Terms:
- "gentle bell chime"
- "success notification sound"
- "positive feedback audio"
- "ambient background music"
- "calm instrumental loop"

## Technical Requirements

### File Specifications:
- **Format**: MP3 (recommended) or WAV
- **Sample Rate**: 44.1kHz (standard)
- **Bit Rate**: 96-320kbps
- **Channels**: Mono or Stereo
- **File Size**: Keep under 5MB per file

### Testing:
1. Add audio files to `assets/audio/ui/`
2. Restart the app (audio files are loaded at startup)
3. Complete a lesson to test success sound
4. Enable background music in Settings to test music
5. Use device volume controls to adjust overall volume

## Folder Structure

```
assets/
  audio/
    ui/
      success.mp3    ← Success chime (required for success sounds)
      background.mp3 ← Background music (required for ambient music)
    words/           ← Reserved for future word pronunciation audio
```

## Fallback Behavior

If audio files are missing:
- **Success Sound**: Shows console message "🎉 Success! (Add success.mp3...)"
- **Background Music**: Shows console message "🎵 Background music disabled..."
- **App Functionality**: All features work normally, just without audio
- **Settings**: Audio toggles still appear and save preferences

## Parent Notes

- All audio is optional - the app works perfectly without it
- Audio can be completely disabled in Settings
- Volume is kept gentle and child-friendly
- Background music is very subtle to not interfere with learning
- Success sounds provide positive reinforcement without being overwhelming

## Troubleshooting

### Audio Not Playing:
1. Check file names match exactly: `success.mp3`, `background.mp3`
2. Ensure files are in correct folder: `assets/audio/ui/`
3. Restart the app after adding files
4. Check device volume is not muted
5. Verify audio toggle is enabled in Settings

### Audio Too Loud/Quiet:
- Use device volume controls for overall adjustment
- Background music volume can be adjusted in Settings
- Success sound volume is fixed at gentle level (60%)

### Performance Issues:
- Keep audio files under 5MB each
- Use compressed MP3 format
- Avoid very high quality/large files on older devices