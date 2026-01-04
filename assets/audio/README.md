# Adding Audio Files - Quick Guide

## Required Audio Files

### 1. Success Chime

**Location**: `assets/audio/ui/success.mp3`

**Free Sources**:

- **Freesound.org**: Search "success chime", "positive ding", "achievement"
  - Filter: CC0 (public domain)
  - Example: soft bell, gentle xylophone, positive jingle
  
- **Zapsplat.com**: Free sound effects
  - Category: UI → Success/Achievement
  - Download MP3 format

**Specifications**:

- Format: MP3
- Duration: 1-2 seconds
- Volume: Normalized to -6dB to -3dB
- Style: Gentle, encouraging, child-friendly

**Quick Test Sounds** (Replace later):

```bash
# Create directories
mkdir -p assets/audio/ui

# Download a simple success sound (example using curl)
# Replace with actual sound file from Freesound/Zapsplat
```

---

### 2. Background Music

**Location**: `assets/audio/background.mp3`

**Free Sources**:

- **YouTube Audio Library** (studio.youtube.com/channel/UC.../music)
  - Filter: "Calm", "Ambient", "Children"
  - Download as MP3
  
- **Free Music Archive** (freemusicarchive.org)
  - Genre: Ambient, Classical, Lullaby
  - License: CC0 or CC-BY
  
- **Incompetech** (incompetech.com)
  - Search: "calm", "peaceful", "meditation"
  - Royalty-free downloads

**Specifications**:

- Format: MP3
- Duration: 2-5 minutes (seamless loop)
- BPM: 60-80 (slow, calming)
- Style: Instrumental only (no vocals)
- Volume: Mixed low (-12dB to -9dB)
- Loop: Must be seamless (no gap)

**Recommended Tracks** (examples):

- "Peaceful Morning" - soft piano
- "Gentle Breeze" - ambient pads
- "Lullaby Dreams" - soft strings

---

## Implementation Steps

### Step 1: Create Directory Structure

```bash
cd assets
mkdir -p audio/ui
```

### Step 2: Add Success Sound

1. Download a success chime from Freesound.org or Zapsplat
2. Rename to `success.mp3`
3. Place in `assets/audio/ui/success.mp3`

### Step 3: Add Background Music

1. Download ambient music from YouTube Audio Library
2. Use audio editor (Audacity) to:
   - Trim to 2-5 minutes
   - Normalize to -12dB
   - Add 0.5s fade in/out
   - Ensure seamless loop
3. Export as MP3 (128-192 kbps)
4. Place in `assets/audio/background.mp3`

### Step 4: Update Code

Once files are added, update these files:

**src/audio/SoundEffects.ts**:

```typescript
// Replace this line:
console.log('🎉 Success sound would play here');

// With this:
const { sound } = await Audio.Sound.createAsync(
  require('../../assets/audio/ui/success.mp3')
);
await sound.playAsync();
await sound.unloadAsync();
```

```typescript
// Replace this line:
console.log(`🎵 Background music would start at ${volume * 100}% volume`);

// With this:
const { sound } = await Audio.Sound.createAsync(
  require('../../assets/audio/background.mp3'),
  { isLooping: true, volume }
);
backgroundMusic = sound;
await sound.playAsync();
```

---

## Testing

### Test Success Sound

1. Start a lesson
2. Complete 20 words (or your session length)
3. Listen for success chime when returning to home

### Test Background Music

1. Go to Settings
2. Enable "Background music"
3. Start a lesson
4. Music should play softly in background
5. Tap words - TTS should be clearly audible over music
6. Adjust volume slider - should hear change immediately

---

## Quick Start (Placeholders)

If you want to test the feature **without** real audio files:

The current implementation uses `console.log` placeholders:

- Success: Logs "🎉 Success sound would play here"
- Music: Logs "🎵 Background music would start at X% volume"

This allows testing the **logic** without requiring audio files yet.

---

## Audio Editing Tools

### Free Desktop Apps

- **Audacity** (Windows/Mac/Linux) - Full-featured audio editor
- **GarageBand** (Mac) - Music production
- **Ocenaudio** (Windows/Mac/Linux) - Simple audio editor

### Online Tools

- **Audio Trimmer** (audiotrimmer.com) - Trim MP3
- **MP3Cut** (mp3cut.net) - Cut and trim
- **Online Audio Converter** (online-audio-converter.com) - Format conversion

---

## Licensing

### Safe Licenses for Commercial Use

- **CC0** (Public Domain) - No attribution required ✅
- **CC-BY** (Attribution) - Credit required ✅
- **Royalty-Free** - One-time purchase ✅

### Avoid

- **CC-NC** (Non-Commercial) - Cannot use ❌
- **Copyrighted** - Requires licensing ❌

Always check license before using!

---

## File Size Optimization

Target sizes:

- Success chime: < 50 KB
- Background music: < 2 MB

**Optimization**:

```bash
# Convert to mono (music only)
ffmpeg -i input.mp3 -ac 1 output.mp3

# Reduce bitrate
ffmpeg -i input.mp3 -b:a 96k output.mp3

# Compress success chime
ffmpeg -i success.mp3 -b:a 64k success_compressed.mp3
```

---

## Troubleshooting

### Music doesn't loop smoothly

- Use Audacity: Effect → Crossfade Tracks
- Ensure start/end are at zero-crossing points

### Success sound too loud

- Normalize to -6dB in Audacity
- Or reduce volume in code: `await sound.setVolumeAsync(0.5)`

### Music interferes with TTS

- Lower music volume to 20-30%
- Apply EQ: cut 2-4kHz (voice frequency range)

### File not found error

- Check path exactly matches: `assets/audio/ui/success.mp3`
- Run `npx expo start --clear` to clear cache
- Verify file exists with `ls assets/audio/ui/`

---

## Next Steps

1. **Development**: Use console.log placeholders (current state) ✅
2. **Testing**: Add temporary audio files
3. **Production**: Replace with high-quality licensed audio
4. **Polish**: Fine-tune volumes and timing based on user testing

The implementation is complete and ready to use real audio files whenever you add them!
