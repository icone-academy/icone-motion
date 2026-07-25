import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * Texto cinético: revela palavra por palavra com spring
 * (pop + fade), configurável por delay e stagger.
 */
export const AnimatedText: React.FC<{
  text: string;
  delay?: number;
  /** frames entre cada palavra */
  stagger?: number;
  style?: React.CSSProperties;
  wordStyle?: React.CSSProperties;
}> = ({text, delay = 0, stagger = 3, style, wordStyle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
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
          fps,
          config: {damping: 16, stiffness: 160, mass: 0.6},
        });
        const opacity = interpolate(frame - wordDelay, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity,
              transform: `translateY(${(1 - pop) * 24}px) scale(${0.9 + pop * 0.1})`,
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
