import { Text, View, ScrollView, Pressable, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { isCompactOracleWindow } from '@/lib/layout';

/**
 * About Screen - I Ching Light for LightPhone 3
 */
export default function AboutScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isCompact = isCompactOracleWindow(width, height);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ScreenContainer edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View style={[styles.header, isCompact && styles.headerCompact]}>
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>ABOUT</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, isCompact && styles.scrollContentCompact]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View style={[styles.titleSection, isCompact && styles.titleSectionCompact]}>
          <Text style={[styles.title, isCompact && styles.titleCompact]}>How This Works</Text>
        </View>

        {/* Introduction */}
        <View style={[styles.section, isCompact && styles.sectionCompact]}>
          <Text style={[styles.bodyText, isCompact && styles.bodyTextCompact]}>
            The I Ching is not magic, and it’s not random. It’s one of the most elegant systems humans have ever created for thinking about change.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Binary Logic Section */}
        <View style={[styles.section, isCompact && styles.sectionCompact]}>
          <Text style={styles.sectionTitle}>BINARY LOGIC</Text>
          <Text style={[styles.bodyText, isCompact && styles.bodyTextCompact]}>
            Three thousand years before computers, the I Ching was using binary logic. Two states: yin and yang. Broken line, solid line. The same on/off thinking that powers this device.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Mathematical Structure */}
        <View style={[styles.section, isCompact && styles.sectionCompact]}>
          <Text style={styles.sectionTitle}>THE MATH</Text>
          <Text style={[styles.bodyText, isCompact && styles.bodyTextCompact]}>
            Each hexagram has six lines. Each line can be one of two states. 2⁶ = 64 hexagrams, representing every possible combination. A complete map of change.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Probability Mechanics */}
        <View style={[styles.section, isCompact && styles.sectionCompact]}>
          <Text style={styles.sectionTitle}>WEIGHTED PROBABILITY</Text>
          <Text style={[styles.bodyText, isCompact && styles.bodyTextCompact]}>
            The traditional method creates weighted probabilities. Stable lines appear more often than changing lines. This reflects reality: most things stay the same. Change is the exception.
          </Text>
        </View>

        <View style={styles.divider} />

        {/* Decision Framework */}
        <View style={[styles.section, isCompact && styles.sectionCompact]}>
          <Text style={styles.sectionTitle}>A THINKING TOOL</Text>
          <Text style={[styles.bodyText, isCompact && styles.bodyTextCompact]}>
            The I Ching gives you a random pattern, then asks you to find meaning. The randomness bypasses your usual thinking. The wisdom isn’t in the hexagram—it’s in you. The hexagram helps you access it.
          </Text>
        </View>

        {/* Closing Quote */}
        <View style={[styles.quoteSection, isCompact && styles.quoteSectionCompact]}>
          <View style={styles.quoteBorder}>
            <Text style={styles.quoteText}>
              “The I Ching does not offer itself with proofs and results; it does not vaunt itself, nor is it easy to approach. Like a part of nature, it waits until it is discovered.”
            </Text>
            <Text style={styles.quoteAuthor}>— Carl Jung</Text>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  scrollContentCompact: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  titleSection: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  titleSectionCompact: {
    paddingVertical: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  titleCompact: {
    fontSize: 21,
  },
  section: {
    paddingVertical: 20,
  },
  sectionCompact: {
    paddingVertical: 13,
  },
  sectionTitle: {
    color: '#666666',
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 3,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  bodyText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '300',
    lineHeight: 24,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  bodyTextCompact: {
    fontSize: 14,
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: '#222222',
  },
  quoteSection: {
    paddingVertical: 32,
  },
  quoteSectionCompact: {
    paddingVertical: 18,
  },
  quoteBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#444444',
    paddingLeft: 16,
  },
  quoteText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'italic',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  quoteAuthor: {
    color: '#666666',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});
