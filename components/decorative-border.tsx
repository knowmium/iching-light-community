import { View } from 'react-native';
import { cn } from '@/lib/utils';

interface DecorativeBorderProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'dotted' | 'dashed' | 'double';
}

/**
 * A decorative border wrapper inspired by early Mac dialog boxes
 */
export function DecorativeBorder({ 
  children, 
  className,
  variant = 'dotted' 
}: DecorativeBorderProps) {
  const borderStyle = {
    dotted: 'border-dotted',
    dashed: 'border-dashed',
    double: 'border-double',
  };

  return (
    <View 
      className={cn(
        'border-2 border-foreground p-4',
        borderStyle[variant],
        className
      )}
    >
      {children}
    </View>
  );
}

/**
 * Corner decorations for a more elaborate frame
 */
export function CornerFrame({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <View className={cn('relative', className)}>
      {/* Corner decorations */}
      <View className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-foreground" />
      <View className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-foreground" />
      <View className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-foreground" />
      <View className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-foreground" />
      
      <View className="p-6">
        {children}
      </View>
    </View>
  );
}

/**
 * Horizontal decorative divider
 */
export function Divider({ className }: { className?: string }) {
  return (
    <View className={cn('flex-row items-center justify-center gap-2 py-4', className)}>
      <View className="h-px flex-1 bg-border" />
      <View className="w-2 h-2 rotate-45 border border-border" />
      <View className="h-px flex-1 bg-border" />
    </View>
  );
}

/**
 * Ornamental asterisk divider
 */
export function AsteriskDivider({ className }: { className?: string }) {
  return (
    <View className={cn('flex-row items-center justify-center gap-3 py-4', className)}>
      <View className="h-px w-12 bg-border" />
      <View className="flex-row gap-1">
        <View className="w-1 h-1 rounded-full bg-muted" />
        <View className="w-1 h-1 rounded-full bg-muted" />
        <View className="w-1 h-1 rounded-full bg-muted" />
      </View>
      <View className="h-px w-12 bg-border" />
    </View>
  );
}
