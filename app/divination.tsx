import { useState, useCallback, useEffect, useRef } from 'react';
import { Text, View, Platform, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Accelerometer } from 'expo-sensors';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  FadeIn,
} from 'react-native-reanimated';

import { ScreenContainer } from '@/components/screen-container';
import { castLine, createReading, isYang } from '@/lib/iching';
import { useReadings } from '@/hooks/use-readings';
import { isCompactOracleWindow } from '@/lib/layout';
import { useCommunitySettings } from '@/lib/community-settings-context';
import { isShakeCastingEnabled, isTapCastingEnabled } from '@/lib/community-settings';

// Shake detection threshold and cooldown
const SHAKE_THRESHOLD = 1.8; // Acceleration magnitude to trigger shake
const SHAKE_COOLDOWN = 500; // Milliseconds between shake detections

// Animation duration for line reveal
const LINE_FADE_DURATION = 400; // ms

/**
 * Animated Line Component - fades in when revealed
 */
function AnimatedLine({ line, isChanging, compact }: { line: number; isChanging: boolean; compact: boolean }) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(8);
  
  useEffect(() => {
    // Animate in when mounted
    opacity.value = withTiming(1, { 
      duration: LINE_FADE_DURATION, 
      easing: Easing.out(Easing.cubic) 
    });
    translateY.value = withTiming(0, { 
      duration: LINE_FADE_DURATION, 
      easing: Easing.out(Easing.cubic) 
    });
  }, [opacity, translateY]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  
  const lineColor = isChanging ? '#888888' : '#FFFFFF';
  
  return (
    <Animated.View style={[styles.lineSlot, compact && styles.lineSlotCompact, animatedStyle]}>
      {isYang(line) ? (
        <View style={[styles.yangLine, compact && styles.yangLineCompact, { backgroundColor: lineColor }]} />
      ) : (
        <View style={[styles.yinLineContainer, compact && styles.yinLineContainerCompact]}>
          <View style={[styles.yinSegment, compact && styles.yinSegmentCompact, { backgroundColor: lineColor }]} />
          <View style={[styles.yinGap, compact && styles.yinGapCompact]} />
          <View style={[styles.yinSegment, compact && styles.yinSegmentCompact, { backgroundColor: lineColor }]} />
        </View>
      )}
    </Animated.View>
  );
}

/**
 * Divination Screen - I Ching Light Community
 * 
 * Uses the casting gesture selected in Settings
 * Provides haptic feedback
 * Optimized for 1080x1240 screen
 */
export default function DivinationScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isCompact = isCompactOracleWindow(width, height);
  const { saveReading } = useReadings();
  const { settings, isLoading: isLoadingSettings } = useCommunitySettings();
  const params = useLocalSearchParams<{ question: string }>();
  const tapCastingEnabled = isTapCastingEnabled(settings.castingMode, Platform.OS);
  const shakeCastingEnabled = isShakeCastingEnabled(settings.castingMode, Platform.OS);
  
  const question = params.question || 'Seeking guidance';
  
  const [lines, setLines] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const lastShakeTime = useRef(0);
  const linesRef = useRef<number[]>([]);
  
  // Keep linesRef in sync with lines state
  useEffect(() => {
    linesRef.current = lines;
  }, [lines]);

  const handleCastLine = useCallback(() => {
    if (linesRef.current.length >= 6) return;

    // Haptic feedback - medium impact for the casting action
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const newLine = castLine();
    const newLines = [...linesRef.current, newLine];
    setLines(newLines);

    if (newLines.length === 6) {
      setIsComplete(true);
      // Success haptic and notification for completion
      if (Platform.OS !== 'web') {
        setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 300);
      }
    }
  }, []);

  // Set up accelerometer for shake detection
  useEffect(() => {
    if (isLoadingSettings || !shakeCastingEnabled) return;

    let subscription: ReturnType<typeof Accelerometer.addListener> | null = null;

    const setupAccelerometer = async () => {
      // Set update interval (100ms = 10 readings per second)
      Accelerometer.setUpdateInterval(100);

      subscription = Accelerometer.addListener(({ x, y, z }) => {
        // Calculate total acceleration magnitude
        const acceleration = Math.sqrt(x * x + y * y + z * z);
        
        // Check if shake threshold exceeded and cooldown has passed
        const now = Date.now();
        if (acceleration > SHAKE_THRESHOLD && now - lastShakeTime.current > SHAKE_COOLDOWN) {
          lastShakeTime.current = now;
          handleCastLine();
        }
      });
    };

    setupAccelerometer();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [handleCastLine, isLoadingSettings, shakeCastingEnabled]);

  const handleViewReading = useCallback(async () => {
    const reading = createReading(lines);
    await saveReading({ ...reading, question });
    router.replace({
      pathname: '/reading',
      params: { 
        hexagramNumber: reading.hexagramNumber.toString(),
        lines: JSON.stringify(lines),
        readingId: reading.id,
        question,
      },
    });
  }, [lines, saveReading, router, question]);

  const handleGoBack = () => {
    router.back();
  };

  const handleReset = () => {
    setLines([]);
    setIsComplete(false);
  };

  // Display lines from bottom to top (line 1 at bottom)
  const displayLines = [...lines].reverse();
  const remainingSlots = 6 - lines.length;

  // Check if a line is changing (old yin = 6, old yang = 9)
  const isChangingLine = (line: number) => line === 6 || line === 9;

  return (
    <ScreenContainer>
      {/* Header */}
      <View style={[styles.header, isCompact && styles.headerCompact]}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>CASTING</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Question */}
      <Text style={[styles.question, isCompact && styles.questionCompact]} numberOfLines={isCompact ? 2 : undefined}>“{question}”</Text>

      {/* Tappable Middle Area - entire area is tappable when casting */}
      {!isComplete ? (
        <Pressable
          disabled={!tapCastingEnabled}
          onPress={tapCastingEnabled ? handleCastLine : undefined}
          style={({ pressed }) => [
            styles.tapArea,
            isCompact && styles.tapAreaCompact,
            pressed && styles.tapAreaPressed
          ]}
        >
          {/* Hexagram Display */}
          <View style={styles.hexagramArea}>
            {/* Empty slots */}
            {Array.from({ length: remainingSlots }).map((_, index) => (
              <View key={`empty-${index}`} style={[styles.lineSlot, isCompact && styles.lineSlotCompact]}>
                <View style={[styles.emptyLine, isCompact && styles.emptyLineCompact]} />
              </View>
            ))}
            
            {/* Cast lines with fade-in animation */}
            {displayLines.map((line, index) => (
              <AnimatedLine 
                key={`line-${lines.length - displayLines.length + index}`} 
                line={line}
                isChanging={isChangingLine(line)}
                compact={isCompact}
              />
            ))}
          </View>

          {/* Progress */}
          <Text style={styles.progress}>Line {lines.length + 1} of 6</Text>
          
          {/* Tap/Shake hint */}
          <Text style={styles.tapHint}>
            {tapCastingEnabled ? 'Tap anywhere to cast' : 'Shake to cast'}
          </Text>
        </Pressable>
      ) : (
        <Animated.View 
          entering={FadeIn.duration(300)}
          style={[styles.completeArea, isCompact && styles.tapAreaCompact]}
        >
          {/* Hexagram Display */}
          <View style={styles.hexagramArea}>
            {displayLines.map((line, index) => {
              const lineColor = isChangingLine(line) ? '#888888' : '#FFFFFF';
              return (
                <View key={`line-${index}`} style={[styles.lineSlot, isCompact && styles.lineSlotCompact]}>
                  {isYang(line) ? (
                    <View style={[styles.yangLine, isCompact && styles.yangLineCompact, { backgroundColor: lineColor }]} />
                  ) : (
                    <View style={[styles.yinLineContainer, isCompact && styles.yinLineContainerCompact]}>
                      <View style={[styles.yinSegment, isCompact && styles.yinSegmentCompact, { backgroundColor: lineColor }]} />
                      <View style={[styles.yinGap, isCompact && styles.yinGapCompact]} />
                      <View style={[styles.yinSegment, isCompact && styles.yinSegmentCompact, { backgroundColor: lineColor }]} />
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* Complete text */}
          <Text style={styles.progress}>Complete</Text>

          {/* Action buttons */}
          <Pressable
            onPress={handleViewReading}
            style={({ pressed }) => [
              styles.actionButton,
              isCompact && styles.actionButtonCompact,
              pressed && styles.actionButtonPressed
            ]}
          >
            <Text style={styles.actionButtonText}>View Reading</Text>
          </Pressable>
          
          <Pressable onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetText}>Cast Again</Text>
          </Pressable>
        </Animated.View>
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
    paddingVertical: 12,
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
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 4,
  },
  headerSpacer: {
    width: 44,
  },
  question: {
    color: '#888888',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 32,
    fontWeight: '300',
  },
  questionCompact: {
    fontSize: 12,
    lineHeight: 17,
    paddingHorizontal: 24,
  },
  tapArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  tapAreaCompact: {
    paddingHorizontal: 24,
  },
  tapAreaPressed: {
    backgroundColor: '#111111',
  },
  completeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  hexagramArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  hexagramAreaCompact: {
    marginBottom: 14,
  },
  lineSlot: {
    marginVertical: 5,
  },
  lineSlotCompact: {
    marginVertical: 4,
  },
  emptyLine: {
    width: 120,
    height: 10,
    borderWidth: 1,
    borderColor: '#333333',
    borderStyle: 'dashed',
  },
  emptyLineCompact: {
    width: 108,
    height: 8,
  },
  yangLine: {
    width: 120,
    height: 10,
    backgroundColor: '#FFFFFF',
  },
  yangLineCompact: {
    width: 108,
    height: 8,
  },
  yinLineContainer: {
    flexDirection: 'row',
    width: 120,
    justifyContent: 'space-between',
  },
  yinLineContainerCompact: {
    width: 108,
  },
  yinSegment: {
    width: 52,
    height: 10,
    backgroundColor: '#FFFFFF',
  },
  yinSegmentCompact: {
    width: 47,
    height: 8,
  },
  yinGap: {
    width: 16,
  },
  yinGapCompact: {
    width: 14,
  },
  progress: {
    color: '#888888',
    fontSize: 13,
    marginBottom: 16,
    fontWeight: '300',
  },
  tapHint: {
    color: '#444444',
    fontSize: 12,
    fontWeight: '300',
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    minWidth: 180,
    alignItems: 'center',
    marginBottom: 16,
  },
  actionButtonCompact: {
    paddingVertical: 12,
    marginBottom: 10,
  },
  actionButtonPressed: {
    backgroundColor: '#FFFFFF',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 2,
  },
  resetButton: {
    paddingVertical: 10,
  },
  resetText: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '300',
  },
});
