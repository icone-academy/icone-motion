import React from 'react';
import {spring} from 'remotion';
import type {LucideIcon} from 'lucide-react';
import {colors, radius} from '../theme';
import {AUTHOR_FPS, useAuthoredFrame} from '../timeline';

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
  const frame = useAuthoredFrame();

  const pop = spring({
    frame: frame - delay,
    fps: AUTHOR_FPS,
    config: {damping: 16, stiffness: 150, mass: 0.7},
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
        transform: `scale(${0.7 + pop * 0.3})`,
        opacity: pop,
        ...style,
      }}
    >
      <Icon size={iconSize} color={color} strokeWidth={1.8} />
    </div>
  );
};
