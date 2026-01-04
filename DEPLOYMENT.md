# Deployment Guide

This guide covers building and deploying the Reading App to iOS and Android app stores.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [Building with EAS Build](#building-with-eas-build)
- [Testing Builds](#testing-builds)
- [App Store Submission](#app-store-submission)
- [Google Play Submission](#google-play-submission)
- [OTA Updates](#ota-updates)
- [Environment Management](#environment-management)

## Prerequisites

### Required Accounts
- **Expo Account** - Create at https://expo.dev
- **Apple Developer Account** - $99/year (for iOS)
- **Google Play Developer Account** - $25 one-time (for Android)

### Required Tools
```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login
```

## Configuration

### 1. Update app.json

Replace placeholder values in `app.json`:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.appname",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.appname",
      "versionCode": 1
    },
    "extra": {
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

### 2. Create App Icons

Required icon assets in `assets/images/`:

**icon.png** - 1024x1024px
- App icon for iOS and Android
- No transparency
- Square with rounded corners applied by OS

**adaptive-icon.png** - 1024x1024px (Android)
- Foreground layer for Android adaptive icons
- Center 512x512px safe zone for important content

**splash.png** - 1284x2778px
- Launch screen image
- Keep important content in center 1080x1080px

**favicon.png** - 48x48px (Web, optional)
- Browser tab icon

### 3. Initialize EAS

```bash
# Initialize EAS project
eas build:configure

# This creates eas.json with build profiles
```

### 4. Configure eas.json

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Building with EAS Build

### Development Build (for testing)

```bash
# iOS development build
eas build --profile development --platform ios

# Android development build
eas build --profile development --platform android
```

### Preview Build (for testing before production)

```bash
# iOS preview (TestFlight)
eas build --profile preview --platform ios

# Android preview (APK for direct install)
eas build --profile preview --platform android
```

### Production Build

```bash
# iOS production build
eas build --profile production --platform ios

# Android production build (AAB for Play Store)
eas build --profile production --platform android

# Both platforms
eas build --profile production --platform all
```

## Testing Builds

### iOS Testing (TestFlight)

1. Build completes and appears in App Store Connect
2. Add internal testers in App Store Connect
3. Testers receive email with TestFlight invitation
4. Install TestFlight app and test build

### Android Testing (Internal Testing)

```bash
# Upload to Play Console Internal Testing
eas submit --platform android --latest
```

Or download APK from build page and install directly:
```bash
# Download build artifact
eas build:download --latest --platform android

# Install on connected device
adb install your-app.apk
```

## App Store Submission

### iOS Submission (Apple App Store)

#### 1. Prepare Metadata

In App Store Connect:
- App name and subtitle
- Description (up to 4000 characters)
- Keywords (max 100 characters)
- Screenshots (6.5" and 5.5" displays required)
- Category (Education)
- Age rating (4+)
- Privacy policy URL (if collecting data)

#### 2. Submit Build

```bash
# Build production version
eas build --profile production --platform ios

# Submit to App Store
eas submit --platform ios --latest
```

Or submit manually in App Store Connect:
1. Select your app
2. Go to "App Store" tab
3. Click "+" under "Build"
4. Select your build
5. Complete all required information
6. Submit for review

#### 3. Review Process

- Average review time: 1-2 days
- Address any feedback from Apple reviewers
- Update and resubmit if rejected

### Google Play Submission

#### 1. Prepare Metadata

In Google Play Console:
- App name
- Short description (80 characters)
- Full description (4000 characters)
- Screenshots (phone, 7" tablet, 10" tablet)
- Feature graphic (1024x500px)
- App icon (512x512px)
- Category (Education)
- Content rating questionnaire
- Privacy policy URL (if collecting data)

#### 2. Submit Build

```bash
# Build production AAB
eas build --profile production --platform android

# Submit to Play Console
eas submit --platform android --latest
```

Or upload manually:
1. Open Play Console
2. Select your app
3. Go to "Production" → "Releases"
4. Click "Create new release"
5. Upload AAB file
6. Complete release notes
7. Review and roll out

#### 3. Review Process

- Usually automatic approval within hours
- May take up to 7 days for first release
- App will be available after approval

## OTA Updates

Over-the-air updates allow pushing changes without app store review.

### Enable Expo Updates

```bash
# Install expo-updates
npx expo install expo-updates

# Configure in app.json
```

Add to `app.json`:
```json
{
  "expo": {
    "updates": {
      "fallbackToCacheTimeout": 0,
      "url": "https://u.expo.dev/your-project-id"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

### Publishing Updates

```bash
# Publish update to production
eas update --branch production --message "Bug fixes and improvements"

# Publish to staging
eas update --branch staging --message "Test new features"
```

### Update Channels

Link channels to build profiles in `eas.json`:

```json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "preview": {
      "channel": "staging"
    }
  }
}
```

### Update Strategy

**Use OTA updates for:**
- Bug fixes
- Content updates (new words, images)
- UI tweaks
- Performance improvements

**Require new build for:**
- Native code changes
- New native dependencies
- Expo SDK upgrades
- Major feature additions

## Environment Management

### Environment Variables

Create `.env` files (DO NOT commit to git):

```bash
# .env.production
API_URL=https://api.production.com
ANALYTICS_KEY=prod-key-123

# .env.staging
API_URL=https://api.staging.com
ANALYTICS_KEY=staging-key-456
```

Load in app:
```typescript
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl;
```

Update `app.json`:
```json
{
  "expo": {
    "extra": {
      "apiUrl": process.env.API_URL,
      "analyticsKey": process.env.ANALYTICS_KEY
    }
  }
}
```

### Build Profiles for Environments

```json
{
  "build": {
    "production": {
      "env": {
        "ENVIRONMENT": "production"
      }
    },
    "staging": {
      "env": {
        "ENVIRONMENT": "staging"
      }
    }
  }
}
```

## Versioning Strategy

### Semantic Versioning

Follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backwards compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backwards compatible

### iOS Version Numbers

```json
{
  "expo": {
    "version": "1.2.3",
    "ios": {
      "buildNumber": "42"
    }
  }
}
```

- `version`: User-facing version (1.2.3)
- `buildNumber`: Internal build number (auto-incremented)

### Android Version Numbers

```json
{
  "expo": {
    "version": "1.2.3",
    "android": {
      "versionCode": 42
    }
  }
}
```

- `version`: User-facing version (1.2.3)
- `versionCode`: Integer, must increment for each release

## Monitoring & Analytics

### Crash Reporting

Set up crash reporting service:

```bash
# Sentry
npx expo install @sentry/react-native

# Configure in App.tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
  enableInExpoDevelopment: false,
});
```

### Analytics (Privacy-Focused)

For privacy-first analytics, consider:
- **Expo Analytics** - Built-in, privacy-focused
- **Privacy-focused alternatives** - Ensure COPPA compliance

Always:
- Get parental consent
- Be transparent about data collection
- Follow COPPA regulations (app targets children under 13)
- Provide opt-out options

## Pre-Launch Checklist

### Testing
- [ ] Test on real iOS device
- [ ] Test on real Android device
- [ ] Test on tablets
- [ ] Test with VoiceOver (iOS)
- [ ] Test with TalkBack (Android)
- [ ] Test all audio features
- [ ] Test offline functionality
- [ ] Test on slow devices
- [ ] Test data backup/restore

### Content
- [ ] All words have audio
- [ ] All words have images (or emojis)
- [ ] App icons look good
- [ ] Splash screen displays correctly
- [ ] No placeholder text
- [ ] All features documented

### Legal
- [ ] Privacy policy (if collecting any data)
- [ ] Terms of service
- [ ] Age rating appropriate (4+)
- [ ] COPPA compliance
- [ ] Content rating questionnaire completed

### Store Presence
- [ ] App name unique and descriptive
- [ ] Description compelling
- [ ] Keywords optimized for search
- [ ] Screenshots show key features
- [ ] Category selected correctly
- [ ] Support URL provided
- [ ] Marketing URL (optional)

### Technical
- [ ] No console errors
- [ ] No ESLint errors
- [ ] Performance acceptable on low-end devices
- [ ] Battery usage reasonable
- [ ] Storage usage minimal
- [ ] Crash rate < 1%

## Post-Launch

### Monitoring

```bash
# Check build status
eas build:list

# View update deployments
eas update:list

# Check submission status
eas submit:list
```

### User Feedback

Monitor:
- App Store reviews
- Google Play reviews
- Crash reports
- Support emails

### Iterating

1. Collect user feedback
2. Prioritize improvements
3. Develop and test changes
4. Push OTA update (if possible)
5. Submit new build (if needed)
6. Monitor results

## Troubleshooting

### Build Fails

```bash
# View build logs
eas build:view

# Clear credentials and retry
eas credentials:delete

# Update dependencies
npm update
```

### Submission Rejected

**iOS Common Issues:**
- Missing privacy policy
- Inappropriate age rating
- Guideline violations
- Crashes during review

**Android Common Issues:**
- Missing required screenshots
- Content rating incomplete
- Privacy policy missing
- Target API level too low

### OTA Update Not Working

- Verify runtime version matches
- Check update channel configuration
- Ensure app has network access
- Clear app cache and retry

## Resources

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **EAS Submit Docs**: https://docs.expo.dev/submit/introduction/
- **Expo Updates Docs**: https://docs.expo.dev/versions/latest/sdk/updates/
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Google Play Console Help**: https://support.google.com/googleplay/android-developer/

## Support

For deployment issues:
- Expo Discord: https://chat.expo.dev
- Expo Forums: https://forums.expo.dev
- GitHub Issues: [Your repo]/issues

---

**Ready to deploy?** Start with preview builds and thoroughly test before production submission!
