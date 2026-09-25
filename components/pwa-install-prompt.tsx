import { useState, useEffect } from 'react';
import { Text, View, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

const PWA_PROMPT_DISMISSED_KEY = 'pwa_prompt_dismissed';
const PWA_PROMPT_DELAY_MS = 3000; // Show after 3 seconds

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * PWA Install Prompt Component
 * 
 * Shows a subtle prompt encouraging users to add the app to their home screen.
 * Only appears on web, on mobile devices, after a short delay.
 */
export function PWAInstallPrompt() {
  const colors = useColors();
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Only run on web
    if (Platform.OS !== 'web') return;

    const checkAndShowPrompt = async () => {
      // Check if already dismissed
      const dismissed = await AsyncStorage.getItem(PWA_PROMPT_DISMISSED_KEY);
      if (dismissed) return;

      // Check if already installed as PWA
      if (window.matchMedia('(display-mode: standalone)').matches) return;

      // Detect iOS
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(isIOSDevice);

      // For non-iOS, listen for beforeinstallprompt
      if (!isIOSDevice) {
        const handler = (e: Event) => {
          e.preventDefault();
          setDeferredPrompt(e as BeforeInstallPromptEvent);
        };
        window.addEventListener('beforeinstallprompt', handler);
        
        // Show prompt after delay
        setTimeout(() => {
          setShowPrompt(true);
        }, PWA_PROMPT_DELAY_MS);

        return () => window.removeEventListener('beforeinstallprompt', handler);
      } else {
        // For iOS, show instructions after delay
        setTimeout(() => {
          setShowPrompt(true);
        }, PWA_PROMPT_DELAY_MS);
      }
    };

    checkAndShowPrompt();
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = async () => {
    setShowPrompt(false);
    await AsyncStorage.setItem(PWA_PROMPT_DISMISSED_KEY, 'true');
  };

  if (!showPrompt || Platform.OS !== 'web') return null;

  return (
    <View 
      className="absolute bottom-20 left-4 right-4 bg-surface border-2 border-primary p-4 shadow-lg"
      style={{ zIndex: 1000 }}
    >
      {/* Close button */}
      <Pressable
        onPress={handleDismiss}
        className="absolute top-2 right-2 p-1"
        style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
      >
        <Text className="text-muted text-lg">×</Text>
      </Pressable>

      <View className="flex-row items-start gap-3">
        <View className="w-10 h-10 bg-primary items-center justify-center">
          <IconSymbol name="house.fill" size={20} color={colors.background} />
        </View>
        
        <View className="flex-1 pr-4">
          <Text className="text-foreground font-semibold text-sm mb-1">
            Add to Home Screen
          </Text>
          
          {isIOS ? (
            <Text className="text-muted text-xs leading-5">
              Tap the share button below, then select “Add to Home Screen” to access I Ching Light anytime.
            </Text>
          ) : deferredPrompt ? (
            <>
              <Text className="text-muted text-xs leading-5 mb-2">
                Install I Ching Light for quick access and an app-like experience.
              </Text>
              <Pressable
                onPress={handleInstall}
                className="bg-primary px-3 py-2 self-start"
                style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
              >
                <Text className="text-background text-xs font-semibold uppercase tracking-wide">
                  Install App
                </Text>
              </Pressable>
            </>
          ) : (
            <Text className="text-muted text-xs leading-5">
              Add this app to your home screen for quick access and an app-like experience.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
