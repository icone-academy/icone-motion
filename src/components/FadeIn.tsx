import React from 'react';
import {interpolate, spring} from 'remotion';
import {AUTHOR_FPS, useAuthoredFrame} from '../timeline';

/**
 * Wrapper de entrada: fade + deslize suave com spring
 * (curva próxima do --ease-standard do app).
 * Delays em frames de autoria (30fps).
 */
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  from?: 'bottom' | 'top' | 'left' | 'right' | 'none';
  distance?: number;
  style?: React.CSSProperties;
}> = ({children, delay = 0, from = 'bottom', distance = 28, style}) => {
  const frame = useAuthoredFrame();

  const progress = spring({
    frame: frame - delay,
    fps: AUTHOR_FPS,
    config: {damping: 22, stiffness: 110, mass: 0.85},
  });

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const offset = (1 - progress) * distance;
  const translate =
    from === 'bottom'
      ? `translateY(${offset}px)`
      : from === 'top'
        ? `translateY(${-offset}px)`
        : from === 'left'
          ? `translateX(${-offset}px)`
          : from === 'right'
            ? `translateX(${offset}px)`
            : 'none';

  return (
    <div style={{opacity, transform: translate, ...style}}>{children}</div>
  );
};
