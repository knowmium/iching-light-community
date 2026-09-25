import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Pressable, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';

import { ScreenContainer } from '@/components/screen-container';
import { ReadingCards } from '@/components/reading-cards';
import { getHexagram, getChangingLines, getTransformedHexagram, hasChangingLines } from '@/lib/iching';
import { getWisdomQuote } from '@/data/wisdom-quotes';
import { getTaoVerse } from '@/data/tao-te-ching';
import { useReadings } from '@/hooks/use-readings';
import { isCompactOracleWindow } from '@/lib/layout';
import { useCommunitySettings } from '@/lib/community-settings-context';
import { providerSupportsVision } from '@/lib/community-settings';
import { getApiKey } from '@/lib/api-key-store';
import {
  formatBYOKError,
  generateInterpretation,
  generateSynthesis,
  generateVisionImage,
} from '@/lib/byok-ai';

export default function ReadingScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isCompact = isCompactOracleWindow(width, height);
  const params = useLocalSearchParams<{
    hexagram?: string;
    hexagramNumber?: string;
    lines: string;
    question?: string;
    readingId?: string;
  }>();
  const { settings, isLoading: isLoadingSettings } = useCommunitySettings();
  const { saveReading, updateReading, getReading, isLoading: isLoadingReadings } = useReadings();

  const hexagramNumber = parseInt(params.hexagramNumber || params.hexagram || '1', 10);
  const lines = useMemo(() => {
    try {
      return params.lines ? JSON.parse(params.lines) : [7, 7, 7, 7, 7, 7];
    } catch {
      return [7, 7, 7, 7, 7, 7];
    }
  }, [params.lines]);
  const question = params.question || 'What guidance do I need today?';
  const readingId = params.readingId;

  const hexagram = useMemo(() => getHexagram(hexagramNumber), [hexagramNumber]);
  const changingLines = useMemo(() => getChangingLines(lines), [lines]);
  const hasChanging = useMemo(() => hasChangingLines(lines), [lines]);
  const transformedHexagram = useMemo(() => {
    if (!hasChanging) return null;
    return getTransformedHexagram(hexagramNumber, lines);
  }, [hexagramNumber, lines, hasChanging]);
  const wisdomQuote = useMemo(() => getWisdomQuote(hexagramNumber), [hexagramNumber]);
  const taoVerse = useMemo(() => getTaoVerse(hexagramNumber), [hexagramNumber]);
  const displayLines = lines.map((line: number) => (line === 7 || line === 9 ? 1 : 0));

  const existingReading = useMemo(() => {
    if (readingId && !isLoadingReadings) return getReading(readingId);
    return null;
  }, [readingId, isLoadingReadings, getReading]);

  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [isLoadingInterpretation, setIsLoadingInterpretation] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [isLoadingSynthesis, setIsLoadingSynthesis] = useState(false);
  const [aiNotice, setAiNotice] = useState<string | null>(null);

  const currentReadingIdRef = useRef<string | null>(readingId || null);
  const interpretationStartedRef = useRef(false);
  const imageStartedRef = useRef(false);
  const synthesisStartedRef = useRef(false);
  const mountedRef = useRef(true);

  const effectiveVisionEnabled = settings.visionEnabled && providerSupportsVision(settings.provider);
  const needsInterpretation = settings.interpretationEnabled && !existingReading?.interpretation;
  const needsVision = effectiveVisionEnabled && !existingReading?.imageUrl;
  const needsSynthesis = settings.synthesisEnabled && !existingReading?.synthesis;
  const needsAnyAIRequest = needsInterpretation || needsVision || needsSynthesis;

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!existingReading) return;
    if (existingReading.interpretation) setInterpretation(existingReading.interpretation);
    if (existingReading.imageUrl) setGeneratedImageUrl(existingReading.imageUrl);
    if (existingReading.synthesis) setSynthesis(existingReading.synthesis);
  }, [existingReading]);

  useEffect(() => {
    if (isLoadingReadings || isLoadingSettings || !hexagram) return;

    const initializeReading = async () => {
      if (!currentReadingIdRef.current) {
        const newId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
        currentReadingIdRef.current = newId;
        await saveReading({
          id: newId,
          hexagramNumber,
          date: new Date().toISOString(),
          lines,
          question,
        });
      }

      if (needsAnyAIRequest) {
        const apiKey = await getApiKey(settings.provider);
        if (!apiKey) {
          if (mountedRef.current) {
            const providerName =
              settings.provider === 'gemini'
                ? 'Gemini'
                : settings.provider === 'anthropic'
                  ? 'Anthropic'
                  : 'OpenAI';
            setAiNotice(`Add your ${providerName} API key in Settings to enable the selected AI cards.`);
          }
          return;
        }
        if (mountedRef.current) setAiNotice(null);
      }

      const currentId = currentReadingIdRef.current;

      if (
        settings.interpretationEnabled &&
        !existingReading?.interpretation &&
        !interpretationStartedRef.current
      ) {
        interpretationStartedRef.current = true;
        setIsLoadingInterpretation(true);
        void generateInterpretation(settings.provider, {
          question,
          hexagramNumber,
          hexagramName: hexagram.english,
          hexagramChinese: hexagram.trad_chinese,
          judgmentText: hexagram.wilhelm_judgment.text,
          imageText: hexagram.wilhelm_image.text,
          changingLinesText: changingLines.map((lineNumber) => ({
            lineNumber,
            text: hexagram.wilhelm_lines[String(lineNumber)]?.text || '',
          })),
          transformedHexagramNumber: transformedHexagram?.hex,
          transformedHexagramName: transformedHexagram?.english,
        })
          .then(async (result) => {
            if (mountedRef.current) setInterpretation(result);
            if (currentId) await updateReading(currentId, { interpretation: result });
          })
          .catch((error) => {
            if (mountedRef.current) setAiNotice(`Interpretation: ${formatBYOKError(error)}`);
          })
          .finally(() => {
            if (mountedRef.current) setIsLoadingInterpretation(false);
          });
      }

      if (effectiveVisionEnabled && !existingReading?.imageUrl && !imageStartedRef.current) {
        imageStartedRef.current = true;
        setIsLoadingImage(true);
        void generateVisionImage(settings.provider, {
          hexagramName: hexagram.english,
          question,
        })
          .then(async (imageUri) => {
            if (mountedRef.current) setGeneratedImageUrl(imageUri);
            if (currentId) await updateReading(currentId, { imageUrl: imageUri });
          })
          .catch((error) => {
            if (mountedRef.current) setAiNotice(`Vision: ${formatBYOKError(error)}`);
          })
          .finally(() => {
            if (mountedRef.current) setIsLoadingImage(false);
          });
      }
    };

    void initializeReading();
    // Generation refs prevent duplicate paid calls while settings/key changes
    // can resume work that has not started yet.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingReadings, isLoadingSettings, hexagram, settings]);

  useEffect(() => {
    if (
      isLoadingReadings ||
      isLoadingSettings ||
      !hexagram ||
      !currentReadingIdRef.current ||
      !settings.synthesisEnabled ||
      existingReading?.synthesis ||
      synthesisStartedRef.current
    ) {
      return;
    }

    const sourceInterpretation = interpretation || (
      !settings.interpretationEnabled
        ? `The traditional Judgment says: ${hexagram.wilhelm_judgment.text}\nThe Image says: ${hexagram.wilhelm_image.text}`
        : null
    );
    if (!sourceInterpretation) return;

    synthesisStartedRef.current = true;
    setIsLoadingSynthesis(true);
    const currentId = currentReadingIdRef.current;

    void generateSynthesis(settings.provider, {
      question,
      hexagramNumber,
      hexagramName: hexagram.english,
      interpretation: sourceInterpretation,
      taoChapter: taoVerse.chapter,
      taoText: taoVerse.text,
      wisdomQuote: wisdomQuote?.text,
      transformedHexagramName: transformedHexagram?.english,
    })
      .then(async (result) => {
        if (mountedRef.current) setSynthesis(result);
        if (currentId) await updateReading(currentId, { synthesis: result });
      })
      .catch((error) => {
        if (mountedRef.current) setAiNotice(`Closing synthesis: ${formatBYOKError(error)}`);
      })
      .finally(() => {
        if (mountedRef.current) setIsLoadingSynthesis(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interpretation, isLoadingReadings, isLoadingSettings, hexagram, settings]);

  if (!hexagram) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Hexagram not found</Text>
        </View>
      </ScreenContainer>
    );
  }

  const handleHome = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.replace('/');
  };

  return (
    <ScreenContainer edges={['top', 'bottom', 'left', 'right']}>
      <View style={[styles.header, isCompact && styles.headerCompact]}>
        <Pressable onPress={handleHome} style={styles.homeButton}>
          <Text style={styles.homeText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>READING</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ReadingCards
        hexagram={hexagram}
        hexagramNumber={hexagramNumber}
        lines={displayLines}
        changingLines={changingLines}
        transformedHexagram={transformedHexagram}
        wisdomQuote={wisdomQuote}
        taoVerse={taoVerse}
        interpretation={settings.interpretationEnabled ? interpretation : null}
        isLoadingInterpretation={settings.interpretationEnabled && isLoadingInterpretation}
        generatedImageUrl={effectiveVisionEnabled ? generatedImageUrl : null}
        isLoadingImage={effectiveVisionEnabled && isLoadingImage}
        question={question}
        synthesis={settings.synthesisEnabled ? synthesis : null}
        isLoadingSynthesis={settings.synthesisEnabled && isLoadingSynthesis}
        aiNotice={aiNotice}
        onOpenSettings={() => router.push('/settings')}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerCompact: {
    paddingVertical: 2,
    minHeight: 40,
  },
  homeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '200',
  },
  headerTitle: {
    color: '#888888',
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 3,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  headerSpacer: {
    width: 32,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});
