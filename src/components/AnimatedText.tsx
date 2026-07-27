import React from 'react';
import {interpolate, spring} from 'remotion';
import {AUTHOR_FPS, useAuthoredFrame} from '../timeline';

/**
 * Texto cinético: revela palavra por palavra com spring
 * (pop + fade). delay/stagger em frames de autoria (30fps).
 */
export const AnimatedText: React.FC<{
  text: string;
  delay?: number;
  /** frames (30fps) entre cada palavra */
  stagger?: number;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
}> = ({text, delay = 0, stagger = 3, style, wordStyle}) => {
  const frame = useAuthoredFrame();
  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: '0.32em',
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordDelay = delay + i * stagger;
        const pop = spring({
          frame: frame - wordDelay,
          fps: AUTHOR_FPS,
          config: {damping: 18, stiffness: 140, mass: 0.7},
        });
        const opacity = interpolate(frame - wordDelay, [0, 7], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity,
              transform: `translateY(${(1 - pop) * 20}px) scale(${0.92 + pop * 0.08})`,
              ...wordStyle,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
