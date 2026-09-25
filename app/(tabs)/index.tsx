import { useState } from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, Platform, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { isCompactOracleWindow } from '@/lib/layout';

/**
 * Home Screen - I Ching Light for LightPhone 3
 * 
 * Pure black/white minimalist design with clean typography
 * Optimized for 1080x1240 screen (tighter spacing)
 */
export default function HomeScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isCompact = isCompactOracleWindow(width, height);
  const [question, setQuestion] = useState('');

  const handleCast = () => {
    router.push({
      pathname: '/divination',
      params: { question: question.trim() || 'Seeking guidance' },
    });
  };

  const handleViewArchive = () => {
    router.push('/archive');
  };

  const handleAbout = () => {
    router.push('/about');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={[styles.content, isCompact && styles.contentCompact]}>
          {/* Header */}
          <View style={[styles.header, isCompact && styles.headerCompact]}>
            <Text style={[styles.title, isCompact && styles.titleCompact]}>I Ching</Text>
            <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>COMMUNITY</Text>
          </View>

          {/* Question Input */}
          <View style={[styles.inputContainer, isCompact && styles.inputContainerCompact]}>
            <TextInput
              value={question}
              onChangeText={setQuestion}
              placeholder="What guidance do you seek?"
              placeholderTextColor="#666666"
              multiline
              numberOfLines={3}
              style={[styles.input, isCompact && styles.inputCompact]}
              returnKeyType="done"
              blurOnSubmit
            />
          </View>

          {/* Cast Button */}
          <Pressable
            onPress={handleCast}
            style={({ pressed }) => [
              styles.castButton,
              isCompact && styles.castButtonCompact,
              pressed && styles.castButtonPressed
            ]}
          >
            <Text style={[styles.castButtonText]}>CAST</Text>
          </Pressable>

          {/* Links */}
          <View style={styles.links}>
            <Pressable onPress={handleViewArchive} style={styles.link}>
              <Text style={styles.linkText}>Past Readings</Text>
            </Pressable>
            <View style={styles.linkDivider} />
            <Pressable onPress={handleAbout} style={styles.link}>
              <Text style={styles.linkText}>About</Text>
            </Pressable>
            <View style={styles.linkDivider} />
            <Pressable onPress={handleSettings} style={styles.link}>
              <Text style={styles.linkText}>Settings</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: 'center',
  },
  contentCompact: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerCompact: {
    marginBottom: 16,
  },
  title: {
    fontSize: 38,
    fontWeight: '300',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  titleCompact: {
    fontSize: 32,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#888888',
    letterSpacing: 5,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  subtitleCompact: {
    fontSize: 11,
    letterSpacing: 4,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#333333',
    marginBottom: 24,
  },
  inputContainerCompact: {
    marginBottom: 16,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '300',
    paddingHorizontal: 16,
    paddingVertical: 20,
    minHeight: 80,
    textAlignVertical: 'top',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  inputCompact: {
    paddingVertical: 12,
    minHeight: 64,
  },
  castButton: {
    borderWidth: 1,
    borderColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginBottom: 32,
  },
  castButtonCompact: {
    paddingVertical: 12,
    marginBottom: 16,
  },
  castButtonPressed: {
    backgroundColor: '#FFFFFF',
  },
  castButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  link: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  linkDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#444444',
  },
  linkText: {
    color: '#888888',
    fontSize: 13,
    fontWeight: '300',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
});
