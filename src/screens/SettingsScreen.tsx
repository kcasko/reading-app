/**
 * SettingsScreen - App settings and preferences.
 * 
 * Features:
 * - Audio speed toggle
 * - Auto-play toggle
 * - Reset progress option
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import { BigButton } from '../components/BigButton';
import { AUDIO_CONFIG } from '../utils/constants';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { AppSettings, FontFamily } from '../state/progressStore';
import { VoiceType } from '../audio/TextToSpeech';
import type { StreakData } from '../state/streakStore';
import { getStreakMessage, getStreakEmoji } from '../state/streakStore';

type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

interface SettingsScreenComponentProps extends SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  onResetProgress: () => Promise<void>;
  streakData: StreakData;
}

export function SettingsScreen({
  navigation,
  settings,
  onUpdateSettings,
  onResetProgress,
  streakData,
}: SettingsScreenComponentProps) {
  const [isResetting, setIsResetting] = useState(false);
  
  const handleAutoPlayToggle = (value: boolean) => {
    onUpdateSettings({ autoPlayAudio: value });
  };
  
  const handleSpeedToggle = () => {
    const isCurrentlySlow = settings.audioRate === AUDIO_CONFIG.SLOW_RATE;
    const newRate = isCurrentlySlow ? AUDIO_CONFIG.DEFAULT_RATE : AUDIO_CONFIG.SLOW_RATE;
    onUpdateSettings({ audioRate: newRate });
  };
  
  const handleSessionLengthChange = (delta: number) => {
    const newLength = Math.max(10, Math.min(30, settings.sessionLength + delta));
    onUpdateSettings({ sessionLength: newLength });
  };

  const handleVoiceTypeChange = (voice: VoiceType) => {
    onUpdateSettings({ voiceType: voice });
  };

  const handleSuccessSoundToggle = (value: boolean) => {
    onUpdateSettings({ successSoundEnabled: value });
  };

  const handleBackgroundMusicToggle = (value: boolean) => {
    onUpdateSettings({ backgroundMusicEnabled: value });
  };

  const handleVolumeChange = (delta: number) => {
    const newVolume = Math.max(0, Math.min(1, settings.backgroundMusicVolume + delta));
    onUpdateSettings({ backgroundMusicVolume: newVolume });
  };
  
  const handleFontChange = (font: FontFamily) => {
    onUpdateSettings({ fontFamily: font });
  };
  
  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will erase all learning progress. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setIsResetting(true);
            try {
              await onResetProgress();
              Alert.alert('Progress Reset', 'All progress has been cleared.');
            } finally {
              setIsResetting(false);
            }
          },
        },
      ]
    );
  };
  
  const isSlowSpeed = settings.audioRate === AUDIO_CONFIG.SLOW_RATE;
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.backButton} />
        </View>
        
        {/* Learning Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          
          {/* Streak Overview */}
          <Pressable
            style={styles.streakRow}
            onPress={() => navigation.navigate('Streak')}
            accessibilityRole="button"
            accessibilityLabel="View learning streak details"
          >
            <View style={styles.streakInfo}>
              <View style={styles.streakHeader}>
                <Text style={styles.streakEmoji}>{getStreakEmoji(streakData.currentStreak)}</Text>
                <View>
                  <Text style={styles.streakTitle}>
                    {streakData.currentStreak > 0 ? getStreakMessage(streakData.currentStreak) : 'Ready to start!'}
                  </Text>
                  <Text style={styles.streakSubtitle}>
                    {streakData.totalDays} day{streakData.totalDays !== 1 ? 's' : ''} total
                  </Text>
                </View>
              </View>
              <Text style={styles.streakArrow}>→</Text>
            </View>
          </Pressable>
        </View>
        
        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Auto-play words</Text>
              <Text style={styles.settingDescription}>
                Play audio automatically when a word appears
              </Text>
            </View>
            <Switch
              value={settings.autoPlayAudio}
              onValueChange={handleAutoPlayToggle}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={settings.autoPlayAudio ? colors.primary : colors.surface}
            />
          </View>
          
          <Pressable
            style={styles.settingRow}
            onPress={handleSpeedToggle}
            accessibilityRole="button"
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Slower audio</Text>
              <Text style={styles.settingDescription}>
                Play words at a slower pace
              </Text>
            </View>
            <View style={[
              styles.speedIndicator,
              isSlowSpeed && styles.speedIndicatorActive,
            ]}>
              <Text style={[
                styles.speedIndicatorText,
                isSlowSpeed && styles.speedIndicatorTextActive,
              ]}>
                {isSlowSpeed ? 'ON' : 'OFF'}
              </Text>
            </View>
          </Pressable>

          {/* Voice Selection */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Voice type</Text>
              <Text style={styles.settingDescription}>
                Choose voice for word pronunciation
              </Text>
            </View>
          </View>
          <View style={styles.voiceSelector}>
            {(['default', 'male', 'female', 'child'] as VoiceType[]).map((voice) => (
              <Pressable
                key={voice}
                style={[
                  styles.voiceButton,
                  settings.voiceType === voice && styles.voiceButtonActive,
                ]}
                onPress={() => handleVoiceTypeChange(voice)}
              >
                <Text style={[
                  styles.voiceButtonText,
                  settings.voiceType === voice && styles.voiceButtonTextActive,
                ]}>
                  {voice.charAt(0).toUpperCase() + voice.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Font Selection */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Font style</Text>
              <Text style={styles.settingDescription}>
                Choose font for better readability
              </Text>
            </View>
          </View>
          <View style={styles.fontSelector}>
            {([
              { id: 'system', label: 'System' },
              { id: 'opendyslexic', label: 'OpenDyslexic' },
              { id: 'comic-sans', label: 'Comic Sans' },
            ] as { id: FontFamily; label: string }[]).map((font) => (
              <Pressable
                key={font.id}
                style={[
                  styles.fontButton,
                  settings.fontFamily === font.id && styles.fontButtonActive,
                ]}
                onPress={() => handleFontChange(font.id)}
              >
                <Text style={[
                  styles.fontButtonText,
                  settings.fontFamily === font.id && styles.fontButtonTextActive,
                ]}>
                  {font.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.fontHint}>
            OpenDyslexic helps with dyslexia. Comic Sans is friendly for early readers.
          </Text>
        </View>
        
        {/* Session Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Session length</Text>
              <Text style={styles.settingDescription}>
                Number of words per session
              </Text>
            </View>
            <View style={styles.sessionLengthControl}>
              <Pressable
                style={styles.sessionButton}
                onPress={() => handleSessionLengthChange(-5)}
                disabled={settings.sessionLength <= 10}
              >
                <Text style={styles.sessionButtonText}>-</Text>
              </Pressable>
              <Text style={styles.sessionLengthValue}>{settings.sessionLength}</Text>
              <Pressable
                style={styles.sessionButton}
                onPress={() => handleSessionLengthChange(5)}
                disabled={settings.sessionLength >= 30}
              >
                <Text style={styles.sessionButtonText}>+</Text>
              </Pressable>
            </View>
          </View>
          
          <Text style={styles.sessionHint}>
            Range: 10-30 words. Shorter sessions for younger children.
          </Text>

          {/* Success Sound */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Success sound</Text>
              <Text style={styles.settingDescription}>
                Play a chime when session completes
              </Text>
            </View>
            <Switch
              value={settings.successSoundEnabled}
              onValueChange={handleSuccessSoundToggle}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={settings.successSoundEnabled ? colors.primary : colors.surface}
            />
          </View>

          {/* Background Music */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Background music</Text>
              <Text style={styles.settingDescription}>
                Subtle ambient music during lessons
              </Text>
            </View>
            <Switch
              value={settings.backgroundMusicEnabled}
              onValueChange={handleBackgroundMusicToggle}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={settings.backgroundMusicEnabled ? colors.primary : colors.surface}
            />
          </View>

          {/* Music Volume (only when enabled) */}
          {settings.backgroundMusicEnabled && (
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Music volume</Text>
                <Text style={styles.settingDescription}>
                  {Math.round(settings.backgroundMusicVolume * 100)}%
                </Text>
              </View>
              <View style={styles.sessionLengthControl}>
                <Pressable
                  style={styles.sessionButton}
                  onPress={() => handleVolumeChange(-0.1)}
                  disabled={settings.backgroundMusicVolume <= 0}
                >
                  <Text style={styles.sessionButtonText}>-</Text>
                </Pressable>
                <Pressable
                  style={styles.sessionButton}
                  onPress={() => handleVolumeChange(0.1)}
                  disabled={settings.backgroundMusicVolume >= 1}
                >
                  <Text style={styles.sessionButtonText}>+</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
        
        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          {/* Data Management */}
          <Pressable
            style={styles.dataManagementRow}
            onPress={() => navigation.navigate('DataManagement')}
            accessibilityRole="button"
            accessibilityLabel="Manage data backup and restore"
          >
            <View style={styles.dataManagementInfo}>
              <Text style={styles.dataManagementTitle}>Backup & Restore</Text>
              <Text style={styles.dataManagementDescription}>
                Export progress, import backups, and manage storage
              </Text>
            </View>
            <Text style={styles.dataManagementArrow}>→</Text>
          </Pressable>
          
          <View style={styles.dangerZone}>
            <Text style={styles.dangerText}>
              Reset all progress and start over
            </Text>
            <BigButton
              label={isResetting ? 'Resetting...' : 'Reset Progress'}
              variant="attention"
              onPress={handleResetProgress}
              disabled={isResetting}
              style={styles.resetButton}
            />
          </View>
        </View>
        
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Sight Words Reading App{'\n'}
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 28,
    color: colors.textPrimary,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    minHeight: spacing.largeTouchTarget,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingDescription: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  speedIndicator: {
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  speedIndicatorActive: {
    backgroundColor: colors.primary,
  },
  speedIndicatorText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textMuted,
  },
  speedIndicatorTextActive: {
    color: colors.surface,
  },
  sessionLengthControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  sessionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  sessionButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  sessionLengthValue: {
    ...typography.body,
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 40,
    textAlign: 'center',
  },
  sessionHint: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginLeft: spacing.md,
    fontStyle: 'italic',
  },
  fontSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
    marginHorizontal: spacing.md,
  },
  fontButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  fontButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  fontButtonText: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
  },
  fontButtonTextActive: {
    color: colors.primary,
  },
  fontHint: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.sm,
    marginHorizontal: spacing.md,
    fontStyle: 'italic',
  },
  dangerZone: {
    backgroundColor: colors.attentionLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.attention,
  },
  dangerText: {
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  resetButton: {
    backgroundColor: colors.attention,
  },
  aboutText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  voiceSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  voiceButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.border,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  voiceButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  voiceButtonText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textMuted,
    fontSize: 12,
  },
  voiceButtonTextActive: {
    color: colors.primary,
  },
  streakRow: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  streakEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  streakTitle: {
    ...typography.body,
    fontSize: 20,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  streakSubtitle: {
    ...typography.caption,
    color: colors.primary,
    opacity: 0.8,
  },
  streakArrow: {
    ...typography.body,
    fontSize: 24,
    color: colors.primary,
    opacity: 0.6,
  },
  dataManagementRow: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dataManagementInfo: {
    flex: 1,
  },
  dataManagementTitle: {
    ...typography.body,
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  dataManagementDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  dataManagementArrow: {
    ...typography.body,
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '500',
    position: 'absolute',
    right: spacing.lg,
    top: spacing.lg + 4,
  },
});
