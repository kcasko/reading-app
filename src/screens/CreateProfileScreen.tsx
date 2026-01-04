/**
 * CreateProfileScreen - Create a new child profile.
 * 
 * Simple form with:
 * - Name input
 * - Avatar emoji picker
 * - Create button
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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
import { BigButton } from '../components/BigButton';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { createProfile, DEFAULT_AVATARS, setActiveProfileId } from '../state/profileStore';

type CreateProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateProfile'>;

export function CreateProfileScreen({ navigation }: CreateProfileScreenProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Name Required', 'Please enter a name for this profile.');
      return;
    }

    setIsCreating(true);
    try {
      const profile = await createProfile(name.trim(), selectedAvatar);
      await setActiveProfileId(profile.id);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Failed to create profile:', error);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable
            onPress={handleCancel}
            style={styles.backButton}
            accessibilityLabel="Cancel"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Create Profile</Text>
          <View style={styles.backButton} />
        </View>

        <Text style={styles.sectionTitle}>Child's Name</Text>
        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="words"
          autoCorrect={false}
          maxLength={20}
        />

        <Text style={styles.sectionTitle}>Choose Avatar</Text>
        <View style={styles.avatarGrid}>
          {DEFAULT_AVATARS.map((avatar) => (
            <Pressable
              key={avatar}
              style={[
                styles.avatarOption,
                selectedAvatar === avatar && styles.avatarOptionSelected,
              ]}
              onPress={() => setSelectedAvatar(avatar)}
            >
              <Text style={styles.avatarEmoji}>{avatar}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <BigButton
            label={isCreating ? 'Creating...' : 'Create Profile'}
            variant="primary"
            onPress={handleCreate}
            disabled={isCreating}
          />
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
  sectionTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  nameInput: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: 20,
    color: colors.textPrimary,
    minHeight: spacing.largeTouchTarget,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  avatarOption: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  buttonContainer: {
    marginTop: spacing.xxl,
  },
});
