import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils';

interface AnimatedLineProps {
  isYang: boolean;
  isChanging?: boolean;
  size?: 'small' | 'medium' | 'large';
  delay?: number;
}

/**
 * Animated hexagram line that fades and scales in
 */
export function AnimatedLine({ 
  isYang, 
  isChanging = false, 
  size = 'large',
  delay = 0,
}: AnimatedLineProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const sizeConfig = {
    small: { lineHeight: 4, width: 48 },
    medium: { lineHeight: 6, width: 80 },
    large: { lineHeight: 10, width: 140 },
  };

  const config = sizeConfig[size];

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
    );
    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.05, { duration: 150, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) })
      )
    );
  }, [delay, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: config.width,
          gap: isYang ? 0 : config.width * 0.2,
        },
      ]}
    >
      {isYang ? (
        <View
          className={cn('bg-foreground', isChanging && 'bg-primary')}
          style={{
            width: config.width,
            height: config.lineHeight,
            borderRadius: config.lineHeight / 2,
          }}
        />
      ) : (
        <>
          <View
            className={cn('bg-foreground', isChanging && 'bg-primary')}
            style={{
              width: config.width * 0.35,
              height: config.lineHeight,
              borderRadius: config.lineHeight / 2,
            }}
          />
          <View
            className={cn('bg-foreground', isChanging && 'bg-primary')}
            style={{
              width: config.width * 0.35,
              height: config.lineHeight,
              borderRadius: config.lineHeight / 2,
            }}
          />
        </>
      )}
    </Animated.View>
  );
}

/**
 * Pulsing dot indicator for loading/casting states
 */
export function PulsingDot({ delay = 0 }: { delay?: number }) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const animate = () => {
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 600, easing: Easing.inOut(Easing.ease) })
        )
      );
    };
    
    animate();
    const interval = setInterval(animate, 1200);
    return () => clearInterval(interval);
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="w-2 h-2 rounded-full bg-foreground"
    />
  );
}
