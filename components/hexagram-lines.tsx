import { View, StyleSheet } from 'react-native';

interface HexagramLinesProps {
  lines: number[];
  size?: 'small' | 'medium' | 'large';
  changingLines?: number[]; // Line positions (1-6) that are changing
  compact?: boolean;
}

// Colors for line display
const LINE_COLORS = {
  stable: '#FFFFFF',    // White for stable lines (7, 8)
  changing: '#888888',  // Gray for changing lines (6, 9)
};

/**
 * Displays a hexagram as 6 horizontal lines
 * Yang (7, 9) = solid line
 * Yin (6, 8) = broken line
 * Changing lines (6, 9) are displayed in gray
 */
export function HexagramLines({ lines, size = 'medium', changingLines = [], compact = false }: HexagramLinesProps) {
  const sizeConfig = {
    small: { lineHeight: 4, gap: 4, width: 60 },
    medium: { lineHeight: 8, gap: 6, width: 100 },
    large: { lineHeight: 12, gap: 8, width: 140 },
  };

  const config = compact && size === 'large'
    ? { lineHeight: 10, gap: 6, width: 120 }
    : sizeConfig[size];

  // Display lines from top to bottom (line 6 at top, line 1 at bottom)
  const displayLines = [...lines].reverse();

  return (
    <View style={[styles.container, { gap: config.gap }]}>
      {displayLines.map((line, index) => {
        const isYang = line === 7 || line === 9 || line === 1; // 1 is display yang
        // Calculate actual line position (1-6, where 1 is bottom)
        const linePosition = lines.length - index;
        const isChanging = changingLines.includes(linePosition) || line === 6 || line === 9;
        const lineColor = isChanging ? LINE_COLORS.changing : LINE_COLORS.stable;

        return (
          <View
            key={index}
            style={[
              styles.lineContainer,
              { width: config.width, gap: isYang ? 0 : config.width * 0.15 }
            ]}
          >
            {isYang ? (
              <View
                style={[
                  styles.line,
                  { width: config.width, height: config.lineHeight, backgroundColor: lineColor }
                ]}
              />
            ) : (
              <>
                <View
                  style={[
                    styles.line,
                    { width: config.width * 0.4, height: config.lineHeight, backgroundColor: lineColor }
                  ]}
                />
                <View
                  style={[
                    styles.line,
                    { width: config.width * 0.4, height: config.lineHeight, backgroundColor: lineColor }
                  ]}
                />
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}

interface SingleLineProps {
  isYang: boolean;
  isChanging?: boolean;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Single hexagram line component for animated reveals
 */
export function SingleLine({ isYang, isChanging = false, size = 'large' }: SingleLineProps) {
  const sizeConfig = {
    small: { lineHeight: 4, width: 60 },
    medium: { lineHeight: 8, width: 100 },
    large: { lineHeight: 12, width: 140 },
  };

  const config = sizeConfig[size];
  const lineColor = isChanging ? LINE_COLORS.changing : LINE_COLORS.stable;

  return (
    <View
      style={[
        styles.lineContainer,
        { width: config.width, gap: isYang ? 0 : config.width * 0.15 }
      ]}
    >
      {isYang ? (
        <View
          style={[
            styles.line,
            { width: config.width, height: config.lineHeight, backgroundColor: lineColor }
          ]}
        />
      ) : (
        <>
          <View
            style={[
              styles.line,
              { width: config.width * 0.4, height: config.lineHeight, backgroundColor: lineColor }
            ]}
          />
          <View
            style={[
              styles.line,
              { width: config.width * 0.4, height: config.lineHeight, backgroundColor: lineColor }
            ]}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    backgroundColor: '#FFFFFF',
  },
});
