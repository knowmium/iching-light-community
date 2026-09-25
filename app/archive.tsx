import { Text, View, FlatList, Pressable, Alert, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { HexagramLines } from '@/components/hexagram-lines';
import { useReadings } from '@/hooks/use-readings';
import { getHexagram, formatReadingDate } from '@/lib/iching';
import type { Reading } from '@/data/types';
import { isCompactOracleWindow } from '@/lib/layout';

/**
 * Archive Screen - I Ching Light for LightPhone 3
 */
export default function ArchiveScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isCompact = isCompactOracleWindow(width, height);
  const { readings, isLoading, deleteReading, clearAllReadings } = useReadings();

  const handleGoBack = () => {
    router.back();
  };

  const handleViewReading = (reading: Reading) => {
    router.push({
      pathname: '/reading',
      params: {
        hexagramNumber: reading.hexagramNumber.toString(),
        lines: JSON.stringify(reading.lines),
        readingId: reading.id,
        question: reading.question || 'Seeking guidance',
      },
    });
  };

  const handleDeleteReading = (id: string) => {
    if (Platform.OS === 'web') {
      if (confirm('Delete this reading?')) {
        deleteReading(id);
      }
    } else {
      Alert.alert(
        'Delete Reading',
        'Are you sure you want to delete this reading?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => deleteReading(id) },
        ]
      );
    }
  };

  const handleClearAll = () => {
    if (Platform.OS === 'web') {
      if (confirm('Clear all readings? This cannot be undone.')) {
        clearAllReadings();
      }
    } else {
      Alert.alert(
        'Clear All Readings',
        'Are you sure you want to delete all readings? This cannot be undone.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear All', style: 'destructive', onPress: clearAllReadings },
        ]
      );
    }
  };

  const renderReading = ({ item }: { item: Reading }) => {
    const hexagram = getHexagram(item.hexagramNumber);
    if (!hexagram) return null;

    return (
      <Pressable
        onPress={() => handleViewReading(item)}
        style={({ pressed }) => [
          styles.readingItem,
          isCompact && styles.readingItemCompact,
          pressed && styles.readingItemPressed
        ]}
      >
        {item.question && (
          <Text style={[styles.questionText, isCompact && styles.questionTextCompact]} numberOfLines={1}>
            “{item.question}”
          </Text>
        )}
        
        <View style={styles.readingContent}>
          <View style={[styles.hexagramLines, isCompact && styles.hexagramLinesCompact]}>
            <HexagramLines lines={item.lines} size="small" />
          </View>

          <View style={styles.readingInfo}>
            <Text style={styles.hexagramName}>{hexagram.english}</Text>
            <Text style={styles.hexagramMeta}>
              Hexagram {hexagram.hex}
            </Text>
            <Text style={styles.readingDate}>
              {formatReadingDate(item.date)}
            </Text>
          </View>

          <Pressable
            onPress={() => handleDeleteReading(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>×</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Readings</Text>
      <Text style={styles.emptySubtitle}>
        Your consultations will appear here.
      </Text>
    </View>
  );

  return (
    <ScreenContainer edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, isCompact && styles.headerCompact]}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>ARCHIVE</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : readings.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <FlatList
            data={readings}
            keyExtractor={(item) => item.id}
            renderItem={renderReading}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, isCompact && styles.listContentCompact]}
          />
          
          {readings.length > 0 && (
            <View style={[styles.clearAllContainer, isCompact && styles.clearAllContainerCompact]}>
              <Pressable onPress={handleClearAll} style={styles.clearAllButton}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </Pressable>
            </View>
          )}
        </>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerCompact: {
    paddingVertical: 0,
    minHeight: 44,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '200',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  headerSpacer: {
    width: 44,
  },
  listContent: {
    paddingBottom: 20,
  },
  listContentCompact: {
    paddingBottom: 8,
  },
  readingItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  readingItemCompact: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  readingItemPressed: {
    backgroundColor: '#111111',
  },
  questionText: {
    color: '#666666',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  questionTextCompact: {
    marginBottom: 7,
  },
  readingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hexagramLines: {
    marginRight: 16,
  },
  hexagramLinesCompact: {
    marginRight: 12,
  },
  readingInfo: {
    flex: 1,
  },
  hexagramName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  hexagramMeta: {
    color: '#666666',
    fontSize: 12,
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  readingDate: {
    color: '#444444',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  deleteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#666666',
    fontSize: 24,
    fontWeight: '200',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '300',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  emptySubtitle: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '300',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  clearAllContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  clearAllContainerCompact: {
    paddingVertical: 6,
    minHeight: 44,
  },
  clearAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearAllText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '300',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});
