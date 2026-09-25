import { Pressable, Text, View, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { cn } from '@/lib/utils';

interface RetroButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
}

/**
 * A retro-styled button with dotted borders and press feedback
 */
export function RetroButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className,
}: RetroButtonProps) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  const sizeStyles = {
    small: 'px-4 py-2',
    medium: 'px-6 py-3',
    large: 'px-8 py-4',
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const variantStyles = {
    primary: 'bg-primary border-primary',
    secondary: 'bg-transparent border-primary',
    ghost: 'bg-transparent border-transparent',
  };

  const textVariantStyles = {
    primary: 'text-background',
    secondary: 'text-primary',
    ghost: 'text-primary',
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.97 : 1 }],
          opacity: pressed ? 0.9 : disabled ? 0.5 : 1,
        },
      ]}
    >
      <View
        className={cn(
          'border-2 items-center justify-center',
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
      >
        <Text
          className={cn(
            'font-semibold tracking-wider uppercase',
            textSizes[size],
            textVariantStyles[variant]
          )}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

/**
 * A circular icon button for navigation
 */
export function IconButton({
  children,
  onPress,
  className,
}: {
  children: React.ReactNode;
  onPress: () => void;
  className?: string;
}) {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        {
          transform: [{ scale: pressed ? 0.95 : 1 }],
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View
        className={cn(
          'w-10 h-10 rounded-full border border-border items-center justify-center bg-surface',
          className
        )}
      >
        {children}
      </View>
    </Pressable>
  );
}

/**
 * Text link button
 */
export function TextButton({
  title,
  onPress,
  className,
}: {
  title: string;
  onPress: () => void;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.6 : 1,
        },
      ]}
    >
      <Text
        className={cn(
          'text-primary text-sm underline',
          className
        )}
      >
        {title}
      </Text>
    </Pressable>
  );
}
