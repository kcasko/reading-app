/**
 * DataManagementScreen - Enhanced offline-first data management
 * 
 * Provides parents with:
 * - Backup/export functionality for child progress
 * - Import/restore from backup files
 * - Storage statistics and optimization
 * - Data integrity monitoring
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { BigButton } from '../components/BigButton';
import {
  exportBackupToFile,
  importBackupFromFile,
  getStorageStats,
  cleanupOrphanedData,
  ImportOptions,
} from '../utils/DataManager';

interface DataManagementScreenProps {
  route: any;
  navigation: any;
}

interface StorageStats {
  totalKeys: number;
  estimatedSize: string;
  profileCount: number;
  keysPerProfile: number;
}

export default function DataManagementScreen({ navigation }: DataManagementScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  useEffect(() => {
    loadStorageStats();
  }, []);

  const loadStorageStats = async () => {
    try {
      const stats = await getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    }
  };

  const handleExportBackup = async () => {
    try {
      setIsLoading(true);
      const success = await exportBackupToFile();
      
      if (success) {
        setLastBackup(new Date().toLocaleDateString());
        Alert.alert(
          'Backup Created',
          'Your backup has been saved successfully. You can share it via email, cloud storage, or save it to your device.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Backup Failed',
          'Unable to create backup. Please ensure you have sufficient storage space and permissions.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Backup export error:', error);
      Alert.alert('Error', 'An unexpected error occurred while creating the backup.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportBackup = () => {
    Alert.alert(
      'Import Backup',
      'Choose how to handle existing data:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Merge Data',
          onPress: () => performImport({ overwriteExisting: false, mergeProgress: true, createNewProfiles: true }),
        },
        {
          text: 'Replace All',
          style: 'destructive',
          onPress: () => confirmReplaceAll(),
        },
      ]
    );
  };

  const confirmReplaceAll = () => {
    Alert.alert(
      'Replace All Data?',
      'This will overwrite all existing profiles and progress. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Replace All',
          style: 'destructive',
          onPress: () => performImport({ overwriteExisting: true, mergeProgress: false, createNewProfiles: false }),
        },
      ]
    );
  };

  const performImport = async (options: ImportOptions) => {
    try {
      setIsLoading(true);
      const result = await importBackupFromFile(options);
      
      if (result.success) {
        Alert.alert(
          'Import Successful',
          result.message,
          [
            {
              text: 'OK',
              onPress: () => {
                loadStorageStats(); // Refresh stats
                navigation.goBack(); // Return to settings
              },
            },
          ]
        );
      } else {
        Alert.alert('Import Failed', result.message);
      }
    } catch (error) {
      console.error('Import error:', error);
      Alert.alert('Error', 'An unexpected error occurred during import.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanupStorage = async () => {
    Alert.alert(
      'Clean Up Storage',
      'This will remove unused data from deleted profiles. Your current profiles and progress will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clean Up',
          onPress: async () => {
            try {
              setIsLoading(true);
              const result = await cleanupOrphanedData();
              
              if (result.cleaned > 0) {
                Alert.alert(
                  'Cleanup Complete',
                  `Removed ${result.cleaned} unused data entries. ${result.errors.length > 0 ? `${result.errors.length} errors occurred.` : ''}`
                );
              } else {
                Alert.alert('Cleanup Complete', 'No unused data found. Your storage is already optimized.');
              }
              
              loadStorageStats(); // Refresh stats
            } catch (error) {
              console.error('Cleanup error:', error);
              Alert.alert('Error', 'An error occurred during cleanup.');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Data Management</Text>
          <Text style={styles.subtitle}>
            Backup, restore, and manage your children's learning progress
          </Text>
        </View>

        {/* Storage Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage Information</Text>
          {storageStats ? (
            <View style={styles.statsContainer}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Profiles:</Text>
                <Text style={styles.statValue}>{storageStats.profileCount}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Data Size:</Text>
                <Text style={styles.statValue}>{storageStats.estimatedSize}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Total Keys:</Text>
                <Text style={styles.statValue}>{storageStats.totalKeys}</Text>
              </View>
            </View>
          ) : (
            <ActivityIndicator size="small" color={colors.primary} />
          )}
        </View>

        {/* Backup Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup & Restore</Text>
          <Text style={styles.sectionDescription}>
            Create backups to protect your data and transfer it between devices.
          </Text>

          <BigButton
            label="Create Backup"
            onPress={handleExportBackup}
            disabled={isLoading}
            style={styles.actionButton}
          />

          <BigButton
            label="Restore from Backup"
            onPress={handleImportBackup}
            disabled={isLoading}
            style={styles.actionButton}
          />

          {lastBackup && (
            <Text style={styles.lastBackupText}>Last backup: {lastBackup}</Text>
          )}
        </View>

        {/* Storage Optimization */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage Optimization</Text>
          <Text style={styles.sectionDescription}>
            Clean up unused data from deleted profiles to free up storage space.
          </Text>

          <BigButton
            label="Clean Up Storage"
            variant="attention"
            onPress={handleCleanupStorage}
            disabled={isLoading}
            style={styles.actionButton}
          />
        </View>

        {/* Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Data Management</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              • <Text style={styles.infoBold}>Backups</Text> include all profiles, progress, settings, and streaks
            </Text>
            <Text style={styles.infoText}>
              • <Text style={styles.infoBold}>Merge Data</Text> combines progress from backup with existing data
            </Text>
            <Text style={styles.infoText}>
              • <Text style={styles.infoBold}>Replace All</Text> overwrites all current data with backup
            </Text>
            <Text style={styles.infoText}>
              • <Text style={styles.infoBold}>Cleanup</Text> removes data from deleted profiles safely
            </Text>
            <Text style={styles.infoText}>
              • All data is stored locally on your device for complete privacy
            </Text>
          </View>
        </View>

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.heading,
    fontSize: 28,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  statsContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  actionButton: {
    marginBottom: spacing.md,
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
  },
  cleanupButton: {
    backgroundColor: colors.warning,
  },
  lastBackupText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  infoContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    padding: spacing.md,
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  loadingContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
});