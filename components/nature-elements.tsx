import { View, Text } from 'react-native';
import Svg, { Path, Circle, Line, G, Rect } from 'react-native-svg';
import { useColors } from '@/hooks/use-colors';

/**
 * Simple tree illustration in 1-bit MacPaint style
 */
export function TreeIllustration({ size = 80 }: { size?: number }) {
  const colors = useColors();
  
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      {/* Tree trunk */}
      <Rect x="36" y="50" width="8" height="20" fill={colors.foreground} />
      {/* Tree crown - layered triangles */}
      <Path d="M40 10 L55 35 L25 35 Z" fill={colors.foreground} />
      <Path d="M40 20 L58 45 L22 45 Z" fill={colors.foreground} />
      <Path d="M40 30 L60 55 L20 55 Z" fill={colors.foreground} />
    </Svg>
  );
}

/**
 * River/water waves illustration
 */
export function RiverIllustration({ width = 200, height = 40 }: { width?: number; height?: number }) {
  const colors = useColors();
  
  return (
    <Svg width={width} height={height} viewBox="0 0 200 40">
      {/* Wavy lines representing flowing water */}
      <Path
        d="M0 20 Q25 10, 50 20 T100 20 T150 20 T200 20"
        stroke={colors.muted}
        strokeWidth="2"
        fill="none"
        opacity={0.5}
      />
      <Path
        d="M0 28 Q25 18, 50 28 T100 28 T150 28 T200 28"
        stroke={colors.muted}
        strokeWidth="1.5"
        fill="none"
        opacity={0.3}
      />
      <Path
        d="M0 12 Q25 22, 50 12 T100 12 T150 12 T200 12"
        stroke={colors.muted}
        strokeWidth="1"
        fill="none"
        opacity={0.2}
      />
    </Svg>
  );
}

/**
 * Forest silhouette for background decoration
 */
export function ForestSilhouette({ width = 300, height = 60 }: { width?: number; height?: number }) {
  const colors = useColors();
  
  return (
    <Svg width={width} height={height} viewBox="0 0 300 60">
      {/* Multiple trees of varying heights */}
      <G opacity={0.15}>
        <Path d="M20 60 L20 45 L10 45 L20 30 L12 30 L20 15 L28 30 L20 30 L30 45 L20 45 Z" fill={colors.foreground} />
        <Path d="M50 60 L50 50 L42 50 L50 38 L44 38 L50 25 L56 38 L50 38 L58 50 L50 50 Z" fill={colors.foreground} />
        <Path d="M80 60 L80 42 L70 42 L80 25 L72 25 L80 10 L88 25 L80 25 L90 42 L80 42 Z" fill={colors.foreground} />
        <Path d="M110 60 L110 48 L102 48 L110 35 L104 35 L110 22 L116 35 L110 35 L118 48 L110 48 Z" fill={colors.foreground} />
        <Path d="M140 60 L140 45 L130 45 L140 28 L132 28 L140 12 L148 28 L140 28 L150 45 L140 45 Z" fill={colors.foreground} />
        <Path d="M170 60 L170 52 L164 52 L170 42 L166 42 L170 32 L174 42 L170 42 L176 52 L170 52 Z" fill={colors.foreground} />
        <Path d="M200 60 L200 40 L188 40 L200 20 L190 20 L200 5 L210 20 L200 20 L212 40 L200 40 Z" fill={colors.foreground} />
        <Path d="M230 60 L230 48 L222 48 L230 35 L224 35 L230 22 L236 35 L230 35 L238 48 L230 48 Z" fill={colors.foreground} />
        <Path d="M260 60 L260 45 L250 45 L260 28 L252 28 L260 12 L268 28 L260 28 L270 45 L260 45 Z" fill={colors.foreground} />
        <Path d="M285 60 L285 50 L278 50 L285 38 L280 38 L285 26 L290 38 L285 38 L292 50 L285 50 Z" fill={colors.foreground} />
      </G>
    </Svg>
  );
}

/**
 * Leaf decoration
 */
export function LeafDecoration({ size = 24 }: { size?: number }) {
  const colors = useColors();
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2C6 8 4 14 4 18C4 20 6 22 12 22C18 22 20 20 20 18C20 14 18 8 12 2Z"
        stroke={colors.muted}
        strokeWidth="1.5"
        fill="none"
      />
      <Path
        d="M12 6V18"
        stroke={colors.muted}
        strokeWidth="1"
      />
      <Path
        d="M12 10L8 14M12 14L16 10"
        stroke={colors.muted}
        strokeWidth="0.75"
      />
    </Svg>
  );
}

/**
 * Decorative branch divider
 */
export function BranchDivider({ width = 200 }: { width?: number }) {
  const colors = useColors();
  
  return (
    <View className="items-center py-4">
      <Svg width={width} height={20} viewBox="0 0 200 20">
        {/* Main branch */}
        <Line x1="0" y1="10" x2="200" y2="10" stroke={colors.border} strokeWidth="1" />
        {/* Center leaf cluster */}
        <G transform="translate(100, 10)">
          <Circle r="3" fill={colors.muted} opacity={0.5} />
          <Path d="M-8 0L-3 -3L0 0L-3 3Z" fill={colors.muted} opacity={0.4} />
          <Path d="M8 0L3 -3L0 0L3 3Z" fill={colors.muted} opacity={0.4} />
        </G>
        {/* Small leaves along branch */}
        <Circle cx="40" cy="10" r="1.5" fill={colors.muted} opacity={0.3} />
        <Circle cx="160" cy="10" r="1.5" fill={colors.muted} opacity={0.3} />
      </Svg>
    </View>
  );
}

/**
 * Nature-themed trigram footer using text symbols instead of emojis
 */
export function NatureTrigramFooter() {
  return (
    <View className="items-center pb-4">
      <Text className="text-xs text-muted opacity-40 tracking-widest">
        ☰  ☱  ☲  ☳  ☴  ☵  ☶  ☷
      </Text>
    </View>
  );
}
