import React from 'react';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {AUTHOR_FPS, useAuthoredFrame} from '../timeline';

/**
 * Dissolve suave na entrada/saída da cena (frames de autoria @ 30fps).
 * Mantém a duração da Sequence — o fundo cream do Main aparece no meio.
 */
export const SceneFade: React.FC<{
  children: React.ReactNode;
  /** frames 30fps para fade-in no início */
  fadeIn?: number;
  /** frames 30fps para fade-out no fim */
  fadeOut?: number;
  /** leve zoom na entrada (1 = sem zoom) */
  enterFromScale?: number;
  /** leve zoom na saída */
  exitToScale?: number;
}> = ({
  children,
  fadeIn = 0,
  fadeOut = 0,
  enterFromScale = 1,
  exitToScale = 1,
}) => {
  const frame = useAuthoredFrame();
  const {durationInFrames, fps} = useVideoConfig();
  const authoredLen = durationInFrames * (AUTHOR_FPS / fps);

  const inOp =
    fadeIn > 0
      ? interpolate(frame, [0, fadeIn], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  const outOp =
    fadeOut > 0
      ? interpolate(frame, [authoredLen - fadeOut, authoredLen - 0.5], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  const inScale =
    fadeIn > 0 && enterFromScale !== 1
      ? interpolate(frame, [0, fadeIn], [enterFromScale, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  const outScale =
    fadeOut > 0 && exitToScale !== 1
      ? interpolate(frame, [authoredLen - fadeOut, authoredLen - 0.5], [1, exitToScale], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  return (
    <AbsoluteFill
      style={{
        opacity: inOp * outOp,
        transform: `scale(${inScale * outScale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
