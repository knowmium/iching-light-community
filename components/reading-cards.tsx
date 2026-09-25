import React, { useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet,
  Platform,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import type { Hexagram } from '@/data/types';
import { HexagramLines } from './hexagram-lines';
import { WisdomQuote } from '@/data/wisdom-quotes';
import { TaoVerse } from '@/data/tao-te-ching';
import { isCompactOracleWindow } from '@/lib/layout';

const SWIPE_THRESHOLD = 50;

type CardSection = 'intro' | 'ai' | 'wilhelm' | 'wisdom';

interface ReadingCardsProps {
  hexagram: Hexagram;
  hexagramNumber: number;
  lines: number[];
  changingLines: number[];
  transformedHexagram?: Hexagram | null;
  wisdomQuote: WisdomQuote;
  taoVerse: TaoVerse;
  interpretation: string | null;
  isLoadingInterpretation: boolean;
  generatedImageUrl: string | null;
  isLoadingImage: boolean;
  question: string;
  synthesis?: string | null;
  isLoadingSynthesis?: boolean;
  aiNotice?: string | null;
  onOpenSettings?: () => void;
}

interface CardData {
  id: string;
  title: string;
  content: React.ReactNode;
  section: CardSection;
  hasImage?: boolean;
}

export function ReadingCards({
  hexagram,
  hexagramNumber,
  lines,
  changingLines,
  transformedHexagram,
  wisdomQuote,
  taoVerse,
  interpretation,
  isLoadingInterpretation,
  generatedImageUrl,
  isLoadingImage,
  question,
  synthesis,
  isLoadingSynthesis,
  aiNotice,
  onOpenSettings,
}: ReadingCardsProps) {
  const { width, height } = useWindowDimensions();
  const isCompact = isCompactOracleWindow(width, height);
  const generatedImageSize = Math.max(
    120,
    Math.min(width - (isCompact ? 104 : 180), height * (isCompact ? 0.34 : 0.45)),
  );
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const translateX = useSharedValue(0);
  const scrollRefs = useRef<{ [key: string]: ScrollView | null }>({});

  const parseInterpretation = (text: string | null) => {
    if (!text) return { about: '', situation: '', questions: [] };
    
    const sections = {
      about: '',
      situation: '',
      questions: [] as string[],
    };

    const aboutMatch = text.match(/WHAT THIS PATTERN IS ABOUT[:\s]*([\s\S]*?)(?=HOW THIS MIGHT SPEAK|QUESTIONS TO SIT WITH|$)/i);
    const situationMatch = text.match(/HOW THIS MIGHT SPEAK TO YOUR SITUATION[:\s]*([\s\S]*?)(?=QUESTIONS TO SIT WITH|$)/i);
    const questionsMatch = text.match(/QUESTIONS TO SIT WITH[:\s]*([\s\S]*?)$/i);

    if (aboutMatch) sections.about = aboutMatch[1].trim();
    if (situationMatch) sections.situation = situationMatch[1].trim();
    if (questionsMatch) {
      const questionsText = questionsMatch[1].trim();
      sections.questions = questionsText
        .split(/\n/)
        .map(q => q.replace(/^[-•*]\s*/, '').trim())
        .filter(q => q.length > 0 && q.includes('?'));
    }

    return sections;
  };

  const parsedInterpretation = parseInterpretation(interpretation);

  const cards: CardData[] = [];

  // INTRO SECTION
  cards.push({
    id: 'question',
    title: 'Your Question',
    section: 'intro',
    content: (
      <View style={styles.centeredContent}>
        <Text style={[styles.questionText, isCompact && styles.questionTextCompact]}>“{question}”</Text>
      </View>
    ),
  });

  cards.push({
    id: 'hexagram',
    title: 'Your Hexagram',
    section: 'intro',
    content: (
      <View style={styles.centeredContent}>
        <View style={[styles.hexagramVisual, isCompact && styles.hexagramVisualCompact]}>
          <HexagramLines lines={lines} size="large" changingLines={changingLines} compact={isCompact} />
        </View>
        <Text style={[styles.hexagramName, isCompact && styles.hexagramNameCompact]}>{hexagram.english}</Text>
        <Text style={[styles.hexagramChinese, isCompact && styles.hexagramChineseCompact]}>{hexagram.trad_chinese}</Text>
        <Text style={styles.hexagramNumber}>Hexagram {hexagramNumber}</Text>
      </View>
    ),
  });

  if (aiNotice) {
    cards.push({
      id: 'ai-notice',
      title: 'AI Setup',
      section: 'ai',
      content: (
        <View style={styles.centeredContent}>
          <Text style={styles.noticeText}>{aiNotice}</Text>
          {onOpenSettings ? (
            <Pressable
              onPress={onOpenSettings}
              style={({ pressed }) => [styles.settingsButton, pressed && styles.settingsButtonPressed]}
            >
              <Text style={styles.settingsButtonText}>OPEN SETTINGS</Text>
            </Pressable>
          ) : null}
        </View>
      ),
    });
  }

  // AI SECTION
  if (parsedInterpretation.about || isLoadingInterpretation) {
    cards.push({
      id: 'pattern',
      title: 'The Pattern',
      section: 'ai',
      content: (
        <ScrollView 
          ref={(ref) => { scrollRefs.current['pattern'] = ref; }}
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoadingInterpretation ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingTitle}>Contemplating</Text>
              <Text style={styles.loadingSubtitle}>
                The oracle gathers wisdom...
              </Text>
            </View>
          ) : (
            <Text style={styles.bodyText}>{parsedInterpretation.about}</Text>
          )}
        </ScrollView>
      ),
    });
  }

  if (parsedInterpretation.situation) {
    cards.push({
      id: 'situation',
      title: 'For Your Situation',
      section: 'ai',
      content: (
        <ScrollView 
          ref={(ref) => { scrollRefs.current['situation'] = ref; }}
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.bodyText}>{parsedInterpretation.situation}</Text>
        </ScrollView>
      ),
    });
  }

  if (parsedInterpretation.questions.length > 0) {
    parsedInterpretation.questions.forEach((q, i) => {
      cards.push({
        id: `reflection-${i}`,
        title: 'Reflection',
        section: 'ai',
        content: (
          <View style={styles.centeredContent}>
            <Text style={[styles.reflectionNumber, isCompact && styles.reflectionNumberCompact]}>{i + 1}</Text>
            <Text style={[styles.reflectionQuestion, isCompact && styles.reflectionQuestionCompact]}>{q}</Text>
          </View>
        ),
      });
    });
  }

  if (transformedHexagram) {
    const transformedLines = lines.map((l, i) => 
      changingLines.includes(i + 1) ? (l === 6 ? 8 : l === 9 ? 7 : l) : l
    );
    cards.push({
      id: 'transformation',
      title: 'Where This Leads',
      section: 'ai',
      content: (
        <View style={styles.centeredContent}>
          <Text style={[styles.transformIntro, isCompact && styles.transformIntroCompact]}>
            Your changing lines suggest movement toward...
          </Text>
          <View style={[styles.hexagramVisual, isCompact && styles.hexagramVisualCompact]}>
            <HexagramLines lines={transformedLines} size="large" compact={isCompact} />
          </View>
          <Text style={[styles.hexagramName, isCompact && styles.hexagramNameCompact]}>{transformedHexagram.english}</Text>
          <Text style={[styles.hexagramChinese, isCompact && styles.hexagramChineseCompact]}>{transformedHexagram.trad_chinese}</Text>
        </View>
      ),
    });
  }

  if (changingLines.length > 0) {
    changingLines.forEach((lineNum) => {
      const lineData = hexagram.wilhelm_lines[String(lineNum)];
      if (lineData) {
        cards.push({
          id: `line-${lineNum}`,
          title: `Changing Line ${lineNum}`,
          section: 'ai',
          content: (
            <ScrollView 
              ref={(ref) => { scrollRefs.current[`line-${lineNum}`] = ref; }}
              style={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.textBox}>
                <Text style={styles.boxText}>{lineData.text}</Text>
              </View>
              {lineData.comments && (
                <Text style={styles.bodyText}>{lineData.comments}</Text>
              )}
            </ScrollView>
          ),
        });
      }
    });
  }

  // WILHELM SECTION
  cards.push({
    id: 'judgment',
    title: 'The Judgment',
    section: 'wilhelm',
    content: (
      <ScrollView 
        ref={(ref) => { scrollRefs.current['judgment'] = ref; }}
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textBox}>
          <Text style={styles.boxText}>
            {hexagram.wilhelm_judgment?.text || 'The judgment speaks to the core meaning.'}
          </Text>
        </View>
        {hexagram.wilhelm_judgment?.comments && (
          <Text style={styles.bodyText}>{hexagram.wilhelm_judgment.comments}</Text>
        )}
      </ScrollView>
    ),
  });

  cards.push({
    id: 'image',
    title: 'The Image',
    section: 'wilhelm',
    content: (
      <ScrollView 
        ref={(ref) => { scrollRefs.current['image'] = ref; }}
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textBox}>
          <Text style={styles.boxText}>
            {hexagram.wilhelm_image?.text || 'The image offers a visual metaphor.'}
          </Text>
        </View>
        {hexagram.wilhelm_image?.comments && (
          <Text style={styles.bodyText}>{hexagram.wilhelm_image.comments}</Text>
        )}
      </ScrollView>
    ),
  });

  if (hexagram.wilhelm_symbolic) {
    cards.push({
      id: 'symbolic',
      title: 'The Symbol',
      section: 'wilhelm',
      content: (
        <ScrollView 
          ref={(ref) => { scrollRefs.current['symbolic'] = ref; }}
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.bodyText}>{hexagram.wilhelm_symbolic}</Text>
        </ScrollView>
      ),
    });
  }

  // WISDOM SECTION
  cards.push({
    id: 'wisdom',
    title: 'Ancient Wisdom',
    section: 'wisdom',
    content: (
      <View style={styles.centeredContent}>
        <Text style={[styles.quoteText, isCompact && styles.quoteTextCompact]}>“{wisdomQuote.text}”</Text>
        <View style={[styles.spacer, isCompact && styles.spacerCompact]} />
        <Text style={styles.quoteAuthor}>— {wisdomQuote.author}</Text>
      </View>
    ),
  });

  cards.push({
    id: 'tao',
    title: 'From the Tao',
    section: 'wisdom',
    content: (
      <ScrollView 
        ref={(ref) => { scrollRefs.current['tao'] = ref; }}
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.taoIntro}>Chapter {taoVerse.chapter}</Text>
        <View style={styles.textBox}>
          <Text style={styles.boxText}>{taoVerse.text}</Text>
        </View>
        <Text style={styles.bodyText}>{taoVerse.reflection}</Text>
      </ScrollView>
    ),
  });

  if (generatedImageUrl || isLoadingImage) {
    cards.push({
      id: 'vision',
      title: 'Vision',
      section: 'wisdom',
      hasImage: true,
      content: (
        <View style={styles.centeredContent}>
          {isLoadingImage ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingTitle}>Creating Vision</Text>
              <Text style={styles.loadingSubtitle}>The one-bit image is still forming...</Text>
            </View>
          ) : generatedImageUrl ? (
            <View style={[styles.generatedImageContainer, isCompact && styles.generatedImageContainerCompact]}>
              <Image
                source={{ uri: generatedImageUrl }}
                style={[styles.generatedImage, { width: generatedImageSize, height: generatedImageSize }]}
                contentFit="contain"
                cachePolicy="memory-disk"
                priority="high"
                transition={220}
              />
            </View>
          ) : null}
        </View>
      ),
    });
  }

  if (synthesis || isLoadingSynthesis) {
    cards.push({
      id: 'synthesis',
      title: 'Carrying Forward',
      section: 'wisdom',
      content: (
        <ScrollView 
          ref={(ref) => { scrollRefs.current['synthesis'] = ref; }}
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoadingSynthesis ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingTitle}>Weaving</Text>
              <Text style={styles.loadingSubtitle}>
                Drawing together the wisdom...
              </Text>
            </View>
          ) : synthesis ? (
            <View>
              <Text style={styles.synthesisText}>{synthesis}</Text>
              <View style={styles.synthesisFooter}>
                <Text style={styles.synthesisSymbol}>✧</Text>
              </View>
            </View>
          ) : null}
        </ScrollView>
      ),
    });
  }

  const currentCard = cards[currentIndex];

  useEffect(() => {
    if (currentCard && scrollRefs.current[currentCard.id]) {
      scrollRefs.current[currentCard.id]?.scrollTo({ y: 0, animated: false });
    }
  }, [currentIndex, currentCard]);

  const goToNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, cards.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD && currentIndex < cards.length - 1) {
        runOnJS(goToNext)();
      } else if (event.translationX > SWIPE_THRESHOLD && currentIndex > 0) {
        runOnJS(goToPrev)();
      }
      translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 0.3 }],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardContainer, isCompact && styles.cardContainerCompact, animatedStyle]}>
          <View style={styles.card}>
            <View style={[styles.cardHeader, isCompact && styles.cardHeaderCompact]}>
              <Text style={[styles.cardTitle, isCompact && styles.cardTitleCompact]}>{currentCard.title}</Text>
            </View>
            <View style={[styles.cardContent, isCompact && styles.cardContentCompact]}>
              {currentCard.content}
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
      
      <View style={[styles.progressContainer, isCompact && styles.progressContainerCompact]}>
        <Text style={styles.progressText}>
          {currentIndex + 1} / {cards.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cardContainer: {
    flex: 1,
    padding: 16,
    paddingBottom: 8,
  },
  cardContainerCompact: {
    padding: 10,
    paddingBottom: 4,
  },
  card: {
    flex: 1,
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#333333',
  },
  cardHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  cardHeaderCompact: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 4,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  cardTitleCompact: {
    fontSize: 11,
    letterSpacing: 3,
  },
  cardContent: {
    flex: 1,
    padding: 24,
  },
  cardContentCompact: {
    padding: 18,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  scrollContent: {
    flex: 1,
  },
  spacer: {
    height: 24,
  },
  spacerCompact: {
    height: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  loadingSubtitle: {
    fontSize: 14,
    fontWeight: '300',
    color: '#666666',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '300',
    color: '#666666',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  noticeText: {
    color: '#B0B0B0',
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '300',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  settingsButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  settingsButtonPressed: {
    backgroundColor: '#222222',
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    letterSpacing: 2,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  questionTextCompact: {
    fontSize: 19,
    lineHeight: 27,
  },
  hexagramVisual: {
    marginBottom: 16,
  },
  hexagramVisualCompact: {
    marginBottom: 10,
  },
  hexagramName: {
    fontSize: 20,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  hexagramNameCompact: {
    fontSize: 18,
    marginBottom: 4,
  },
  hexagramChinese: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 6,
  },
  hexagramChineseCompact: {
    fontSize: 14,
    marginBottom: 4,
  },
  hexagramNumber: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  generatedImage: {
    marginBottom: 16,
  },
  generatedImageContainer: {
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 4,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generatedImageContainerCompact: {
    padding: 4,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#FFFFFF',
    lineHeight: 26,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  reflectionNumber: {
    fontSize: 36,
    fontWeight: '200',
    color: '#333333',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  reflectionNumberCompact: {
    fontSize: 30,
    marginBottom: 8,
  },
  reflectionQuestion: {
    fontSize: 17,
    fontWeight: '300',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  reflectionQuestionCompact: {
    fontSize: 16,
    lineHeight: 24,
  },
  transformIntro: {
    fontSize: 14,
    fontWeight: '300',
    color: '#888888',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  transformIntroCompact: {
    marginBottom: 14,
  },
  textBox: {
    borderWidth: 1,
    borderColor: '#333333',
    padding: 20,
    marginBottom: 20,
  },
  boxText: {
    fontSize: 16,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#FFFFFF',
    lineHeight: 26,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  quoteText: {
    fontSize: 22,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  quoteTextCompact: {
    fontSize: 20,
    lineHeight: 30,
  },
  quoteAuthor: {
    fontSize: 14,
    fontWeight: '400',
    color: '#888888',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  taoIntro: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  synthesisText: {
    fontSize: 18,
    fontWeight: '300',
    color: '#FFFFFF',
    lineHeight: 30,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  synthesisFooter: {
    marginTop: 32,
    alignItems: 'center',
  },
  synthesisSymbol: {
    fontSize: 24,
    color: '#666666',
  },
  progressContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  progressContainerCompact: {
    paddingVertical: 8,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '300',
    color: '#666666',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});
