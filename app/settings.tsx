import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/screen-container';
import { deleteApiKey, getApiKey, setApiKey } from '@/lib/api-key-store';
import { formatBYOKError, testProviderConnection } from '@/lib/byok-ai';
import {
  PROVIDER_DETAILS,
  providerSupportsVision,
  type AIProvider,
} from '@/lib/community-settings';
import { useCommunitySettings } from '@/lib/community-settings-context';
import { isCompactOracleWindow } from '@/lib/layout';

const PROVIDERS: AIProvider[] = ['openai', 'anthropic', 'gemini'];

type Status = { kind: 'idle' | 'success' | 'error'; message: string };

function ToggleRow({
  label,
  description,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={[styles.toggleRow, disabled && styles.disabledRow]}>
      <View style={styles.toggleCopy}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        disabled={disabled}
        onPress={() => onChange(!value)}
        style={({ pressed }) => [
          styles.toggle,
          value && styles.toggleActive,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <View style={[styles.toggleKnob, value && styles.toggleKnobActive]} />
      </Pressable>
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const isCompact = isCompactOracleWindow(width, height);
  const { settings, updateSettings } = useCommunitySettings();
  const [apiKey, setApiKeyInput] = useState('');
  const [hasStoredKey, setHasStoredKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle', message: '' });

  const provider = settings.provider;
  const details = PROVIDER_DETAILS[provider];
  const visionAvailable = providerSupportsVision(provider);

  useEffect(() => {
    let mounted = true;
    setApiKeyInput('');
    setStatus({ kind: 'idle', message: '' });

    void getApiKey(provider).then((stored) => {
      if (mounted) setHasStoredKey(Boolean(stored));
    });

    return () => {
      mounted = false;
    };
  }, [provider]);

  const handleProviderChange = async (nextProvider: AIProvider) => {
    await updateSettings({ provider: nextProvider });
  };

  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      setStatus({ kind: 'error', message: 'Enter a key before saving.' });
      return;
    }

    setIsSaving(true);
    try {
      await setApiKey(provider, apiKey);
      await updateSettings({});
      setHasStoredKey(true);
      setApiKeyInput('');
      setStatus({ kind: 'success', message: 'Key saved securely on this device.' });
    } catch (error) {
      setStatus({ kind: 'error', message: formatBYOKError(error) });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    const candidate = apiKey.trim() || (await getApiKey(provider)) || '';
    setIsTesting(true);
    setStatus({ kind: 'idle', message: '' });
    try {
      await testProviderConnection(provider, candidate);
      setStatus({ kind: 'success', message: 'Connection verified. No generation charge was used.' });
    } catch (error) {
      setStatus({ kind: 'error', message: formatBYOKError(error) });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDelete = async () => {
    await deleteApiKey(provider);
    setApiKeyInput('');
    setHasStoredKey(false);
    setStatus({ kind: 'success', message: 'Stored key removed from this device.' });
  };

  return (
    <ScreenContainer edges={['top', 'bottom', 'left', 'right']}>
      <View style={[styles.header, isCompact && styles.headerCompact]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>SETTINGS</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, isCompact && styles.contentCompact]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>CASTING</Text>
        <View style={styles.segmentedRow}>
          {(['tap', 'shake'] as const).map((mode) => (
            <Pressable
              key={mode}
              onPress={() => updateSettings({ castingMode: mode })}
              style={({ pressed }) => [
                styles.segment,
                settings.castingMode === mode && styles.segmentActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.segmentText, settings.castingMode === mode && styles.segmentTextActive]}>
                {mode.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.helpText}>
          Tap is the default. Shake mode disables tap-to-cast so each line has one intentional trigger.
        </Text>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>AI PROVIDER</Text>
        <View style={styles.providerList}>
          {PROVIDERS.map((item) => (
            <Pressable
              key={item}
              onPress={() => handleProviderChange(item)}
              style={({ pressed }) => [
                styles.providerButton,
                provider === item && styles.providerButtonActive,
                pressed && styles.pressed,
              ]}
            >
              <Text style={[styles.providerText, provider === item && styles.providerTextActive]}>
                {PROVIDER_DETAILS[item].name}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={styles.helpText}>{details.note}</Text>
        <Text style={styles.modelText}>TEXT: {details.textModel}</Text>
        {details.imageModel ? <Text style={styles.modelText}>IMAGE: {details.imageModel}</Text> : null}

        <View style={styles.keyHeader}>
          <Text style={styles.rowLabel}>{details.keyLabel}</Text>
          <Pressable onPress={() => Linking.openURL(details.keyUrl)} style={styles.textButton}>
            <Text style={styles.textButtonLabel}>GET KEY</Text>
          </Pressable>
        </View>
        <View style={styles.keyInputRow}>
          <TextInput
            value={apiKey}
            onChangeText={setApiKeyInput}
            placeholder={hasStoredKey ? 'A key is stored — enter a replacement' : 'Paste key here'}
            placeholderTextColor="#555555"
            secureTextEntry={!showKey}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            style={styles.keyInput}
          />
          <Pressable onPress={() => setShowKey((current) => !current)} style={styles.showButton}>
            <Text style={styles.showButtonText}>{showKey ? 'HIDE' : 'SHOW'}</Text>
          </Pressable>
        </View>
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleSaveKey}
            disabled={isSaving}
            style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
          >
            <Text style={styles.outlineButtonText}>{isSaving ? 'SAVING' : 'SAVE KEY'}</Text>
          </Pressable>
          <Pressable
            onPress={handleTest}
            disabled={isTesting}
            style={({ pressed }) => [styles.outlineButton, pressed && styles.pressed]}
          >
            {isTesting ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.outlineButtonText}>TEST</Text>}
          </Pressable>
          {hasStoredKey ? (
            <Pressable onPress={handleDelete} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>DELETE</Text>
            </Pressable>
          ) : null}
        </View>
        {status.message ? (
          <Text style={[styles.statusText, status.kind === 'error' && styles.errorText]}>{status.message}</Text>
        ) : null}
        <Text style={styles.privacyText}>
          The key is encrypted in Android secure storage and sent only to the selected provider. It is never included in the APK, your reading archive, or the I Ching Light server. Web preview keeps a key only in memory and clears it on refresh.
        </Text>

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>OPTIONAL AI FEATURES</Text>
        <ToggleRow
          label="Personal interpretation"
          description="Adds the tailored Pattern, Situation, and Reflection cards."
          value={settings.interpretationEnabled}
          onChange={(value) => updateSettings({ interpretationEnabled: value })}
        />
        <ToggleRow
          label="One-bit Vision"
          description={
            visionAvailable
              ? 'Generates one MacPaint-style image. This is usually the slowest and most expensive step.'
              : `${details.name} is text-only, so Vision is unavailable.`
          }
          value={settings.visionEnabled && visionAvailable}
          disabled={!visionAvailable}
          onChange={(value) => updateSettings({ visionEnabled: value })}
        />
        <ToggleRow
          label="Closing synthesis"
          description="Adds the final Carrying Forward reflection after the reading."
          value={settings.synthesisEnabled}
          onChange={(value) => updateSettings({ synthesisEnabled: value })}
        />
        <Text style={styles.privacyText}>
          Traditional I Ching text, changing lines, Tao passages, wisdom quotes, casting, and the archive always work without AI or an API key.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerCompact: { minHeight: 40 },
  backButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#FFFFFF', fontSize: 26, fontWeight: '200' },
  headerTitle: { color: '#888888', fontSize: 11, letterSpacing: 3, fontWeight: '400' },
  headerSpacer: { width: 36 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingVertical: 24, paddingBottom: 40 },
  contentCompact: { paddingHorizontal: 18, paddingVertical: 14, paddingBottom: 24 },
  sectionTitle: { color: '#FFFFFF', fontSize: 12, letterSpacing: 3, marginBottom: 14, fontWeight: '500' },
  segmentedRow: { flexDirection: 'row', gap: 10 },
  segment: { flex: 1, minHeight: 44, borderWidth: 1, borderColor: '#444444', alignItems: 'center', justifyContent: 'center' },
  segmentActive: { backgroundColor: '#FFFFFF', borderColor: '#FFFFFF' },
  segmentText: { color: '#888888', fontSize: 12, letterSpacing: 2 },
  segmentTextActive: { color: '#000000' },
  helpText: { color: '#777777', fontSize: 12, lineHeight: 18, marginTop: 10 },
  modelText: { color: '#555555', fontSize: 10, lineHeight: 16, letterSpacing: 1 },
  divider: { height: 1, backgroundColor: '#2A2A2A', marginVertical: 24 },
  providerList: { flexDirection: 'row', gap: 8 },
  providerButton: { flex: 1, minHeight: 44, borderWidth: 1, borderColor: '#444444', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  providerButtonActive: { borderColor: '#FFFFFF' },
  providerText: { color: '#666666', fontSize: 11, textAlign: 'center' },
  providerTextActive: { color: '#FFFFFF' },
  keyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 8 },
  rowLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '400' },
  textButton: { paddingVertical: 8, paddingLeft: 12 },
  textButtonLabel: { color: '#888888', fontSize: 10, letterSpacing: 2 },
  keyInputRow: { minHeight: 48, flexDirection: 'row', borderWidth: 1, borderColor: '#444444' },
  keyInput: { flex: 1, color: '#FFFFFF', paddingHorizontal: 12, fontSize: 13, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' },
  showButton: { width: 58, alignItems: 'center', justifyContent: 'center', borderLeftWidth: 1, borderLeftColor: '#333333' },
  showButtonText: { color: '#777777', fontSize: 10, letterSpacing: 1 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  outlineButton: { minWidth: 82, minHeight: 40, paddingHorizontal: 12, borderWidth: 1, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  outlineButtonText: { color: '#FFFFFF', fontSize: 10, letterSpacing: 1.5 },
  deleteButton: { minHeight: 40, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  deleteButtonText: { color: '#777777', fontSize: 10, letterSpacing: 1.5 },
  statusText: { color: '#FFFFFF', fontSize: 12, lineHeight: 18, marginTop: 10 },
  errorText: { color: '#B0B0B0' },
  privacyText: { color: '#666666', fontSize: 11, lineHeight: 17, marginTop: 14 },
  toggleRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#222222' },
  disabledRow: { opacity: 0.5 },
  toggleCopy: { flex: 1 },
  rowDescription: { color: '#777777', fontSize: 11, lineHeight: 17, marginTop: 4 },
  toggle: { width: 46, height: 26, borderWidth: 1, borderColor: '#666666', padding: 3, justifyContent: 'center' },
  toggleActive: { borderColor: '#FFFFFF' },
  toggleKnob: { width: 18, height: 18, backgroundColor: '#555555' },
  toggleKnobActive: { backgroundColor: '#FFFFFF', alignSelf: 'flex-end' },
  pressed: { opacity: 0.65 },
});
