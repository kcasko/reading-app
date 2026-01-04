/**
 * ProfileSelectorScreen - Choose which child is using the app.
 * 
 * Shows all profiles as large cards.
 * Allows creating new profiles.
 * Parent can switch between children quickly.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { Profile, loadProfiles, setActiveProfileId, deleteProfile } from '../state/profileStore';

type ProfileSelectorScreenProps = NativeStackScreenProps<RootStackParamList, 'ProfileSelector'>;

export function ProfileSelectorScreen({ navigation }: ProfileSelectorScreenProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfilesList();
  }, []);

  const loadProfilesList = async () => {
    const loadedProfiles = await loadProfiles();
    setProfiles(loadedProfiles);
    setLoading(false);
  };

  const handleSelectProfile = async (profile: Profile) => {
    await setActiveProfileId(profile.id);
    navigation.navigate('Home');
  };

  const handleCreateProfile = () => {
    navigation.navigate('CreateProfile');
  };

  const handleDeleteProfile = (profile: Profile) => {
    if (profiles.length === 1) {
      Alert.alert('Cannot Delete', 'You must have at least one profile.');
      return;
    }

    Alert.alert(
      'Delete Profile',
      `Delete ${profile.name}'s profile and all progress?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteProfile(profile.id);
            await loadProfilesList();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Who's learning today?</Text>
        <Text style={styles.subtitle}>Choose a profile to continue</Text>

        <View style={styles.profilesGrid}>
          {profiles.map((profile) => (
            <Pressable
              key={profile.id}
              style={styles.profileCard}
              onPress={() => handleSelectProfile(profile)}
              onLongPress={() => handleDeleteProfile(profile)}
            >
              <Text style={styles.profileAvatar}>{profile.avatar}</Text>
              <Text style={styles.profileName}>{profile.name}</Text>
            </Pressable>
          ))}

          {/* Add New Profile Card */}
          <Pressable
            style={[styles.profileCard, styles.addProfileCard]}
            onPress={handleCreateProfile}
          >
            <Text style={styles.addProfileIcon}>+</Text>
            <Text style={styles.addProfileText}>Add Child</Text>
          </Pressable>
        </View>

        <Text style={styles.hint}>
          Tip: Long press a profile to delete it
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.heading,
    fontSize: 32,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  profileCard: {
    width: 140,
    height: 160,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  profileAvatar: {
    fontSize: 56,
    marginBottom: spacing.sm,
  },
  profileName: {
    ...typography.title,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  addProfileCard: {
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.background,
  },
  addProfileIcon: {
    fontSize: 48,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  addProfileText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: '600',
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    fontStyle: 'italic',
  },
});
