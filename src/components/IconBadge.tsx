import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {LucideIcon} from 'lucide-react';
import {colors, radius} from '../theme';

/**
 * Ícone Lucide (outline) em container arredondado soft,
 * com pop-in em spring — padrão dos module cards da home.
 */
export const IconBadge: React.FC<{
  icon: LucideIcon;
  delay?: number;
  size?: number;
  iconSize?: number;
  bg?: string;
  color?: string;
  borderRadius?: number;
  style?: React.CSSProperties;
}> = ({
  icon: Icon,
  delay = 0,
  size = 72,
  iconSize = 34,
  bg = colors.primarySoft,
  color = colors.primary,
  borderRadius = radius.md,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({
    frame: frame - delay,
    fps,
    config: {damping: 12, stiffness: 180, mass: 0.6},
  });

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius,
        backgroundColor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${pop})`,
        ...style,
      }}
    >
      <Icon size={iconSize} color={color} strokeWidth={2} />
    </div>
  );
};
