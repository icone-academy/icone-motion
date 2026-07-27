import React from 'react';
import {interpolate, spring} from 'remotion';
import {colors} from '../theme';
import {fontBody} from '../fonts';
import {AUTHOR_FPS, useAuthoredFrame} from '../timeline';

/**
 * Barra horizontal animada (métricas de ingredientes: água,
 * gordura, açúcares, PAC, POD — cores do §1.6 do design system).
 * delay em frames de autoria (30fps).
 */
export const GaugeBar: React.FC<{
  label: string;
  valueLabel: string;
  /** preenchimento 0–1 */
  fraction: number;
  color: string;
  trackColor?: string;
  delay?: number;
  width?: number;
  labelColor?: string;
  fontSize?: number;
  barHeight?: number;
}> = ({
  label,
  valueLabel,
  fraction,
  color,
  trackColor = colors.borderSoft,
  delay = 0,
  width = 420,
  labelColor,
  fontSize = 26,
  barHeight = 16,
}) => {
  const frame = useAuthoredFrame();

  const fill = spring({
    frame: frame - delay,
    fps: AUTHOR_FPS,
    config: {damping: 24, stiffness: 85, mass: 0.9},
  });

  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{width, opacity, fontFamily: fontBody}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: Math.round(barHeight * 0.5),
          fontSize,
        }}
      >
        <span style={{fontWeight: 600, color: labelColor ?? colors.textSecondary}}>
          {label}
        </span>
        <span style={{fontWeight: 700, color: labelColor ?? colors.textPrimary}}>
          {valueLabel}
        </span>
      </div>
      <div
        style={{
          height: barHeight,
          borderRadius: Math.round(barHeight / 2),
          backgroundColor: trackColor,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.min(1, fraction) * fill * 100}%`,
            borderRadius: Math.max(1, Math.round(barHeight / 2) - 1),
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};
