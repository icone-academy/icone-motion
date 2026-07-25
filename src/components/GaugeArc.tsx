import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, radius, shadows} from '../theme';
import {fontBody} from '../fonts';
import {Card} from './Card';
import {Pill} from './Pill';

export type GaugeZone = {
  /** fração inicial 0–1 */
  from: number;
  /** fração final 0–1 */
  to: number;
  color: string;
};

const SWEEP = 270; // arco de ~270°, como no workbench
const START_ANGLE = -135;

const polar = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad)};
};

const arcPath = (
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
) => {
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
};

/**
 * Gauge circular fiel ao RecipeWorkbenchGauge: arco 270° com zonas
 * coloridas, agulha animada (~480ms) e valor grande no centro.
 */
export const GaugeArc: React.FC<{
  label: string;
  /** valor exibido no centro (string pronta — PAC/POD sem %) */
  value: string;
  /** posição da agulha, 0–1 */
  fraction: number;
  zones: GaugeZone[];
  delay?: number;
  size?: number;
  statusLabel?: string;
  statusBg?: string;
  statusColor?: string;
  /** pulso de alerta no card (para gauges fora da faixa) */
  alert?: boolean;
  bare?: boolean;
}> = ({
  label,
  value,
  fraction,
  zones,
  delay = 0,
  size = 220,
  statusLabel,
  statusBg,
  statusColor,
  alert = false,
  bare = false,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 18;
  const stroke = size * 0.075;

  // Entrada do card
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, stiffness: 130},
  });

  // Agulha: sweep de entrada ~480ms (≈14 frames) ease-out
  const needleProgress = spring({
    frame: frame - delay - 6,
    fps,
    durationInFrames: 16,
    config: {damping: 18, stiffness: 140, mass: 0.7},
  });
  const shownFraction = Math.max(0, Math.min(1, fraction)) * needleProgress;
  const needleAngle = START_ANGLE + SWEEP * shownFraction;
  const needleTip = polar(cx, cy, r - stroke * 0.9, needleAngle);
  const needleBase = polar(cx, cy, size * 0.06, needleAngle + 180);

  // Pulso de alerta (borda vermelha respirando)
  const pulse = alert ? 0.5 + 0.5 * Math.sin((frame - delay) / 6) : 0;

  const gap = 1.2; // graus de respiro entre segmentos

  const gaugeSvg = (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {zones.map((zone, i) => {
        const a0 = START_ANGLE + SWEEP * zone.from + gap;
        const a1 = START_ANGLE + SWEEP * zone.to - gap;
        if (a1 <= a0) return null;
        return (
          <path
            key={i}
            d={arcPath(cx, cy, r, a0, a1)}
            stroke={zone.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            opacity={interpolate(
              frame - delay - i * 2,
              [0, 8],
              [0, 1],
              {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
            )}
          />
        );
      })}
      {/* Agulha */}
      <line
        x1={needleBase.x}
        y1={needleBase.y}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke={colors.textPrimary}
        strokeWidth={size * 0.018}
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r={size * 0.035} fill={colors.textPrimary} />
      <circle cx={cx} cy={cy} r={size * 0.016} fill={colors.surface} />
    </svg>
  );

  const inner = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <div style={{position: 'relative', width: size, height: size * 0.88}}>
        {gaugeSvg}
        <div
          style={{
            position: 'absolute',
            top: '54%',
            left: 0,
            right: 0,
            textAlign: 'center',
            transform: 'translateY(30%)',
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: size * 0.16,
            color: colors.textPrimary,
          }}
        >
          {value}
        </div>
      </div>
      <div
        style={{
          fontFamily: fontBody,
          fontWeight: 600,
          fontSize: size * 0.085,
          color: colors.textSecondary,
        }}
      >
        {label}
      </div>
      {statusLabel ? (
        <Pill
          bg={statusBg ?? colors.successSoft}
          color={statusColor ?? colors.success}
          fontSize={size * 0.068}
          style={{marginTop: 4}}
        >
          {statusLabel}
        </Pill>
      ) : null}
    </div>
  );

  if (bare) {
    return (
      <div style={{opacity: enter, transform: `scale(${0.92 + enter * 0.08})`}}>
        {inner}
      </div>
    );
  }

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 24}px) scale(${0.94 + enter * 0.06})`,
      }}
    >
      <Card
        radiusSize={radius.lg}
        style={{
          padding: '18px 22px 20px',
          borderColor: alert
            ? `rgba(220, 38, 38, ${0.35 + pulse * 0.45})`
            : colors.border,
          boxShadow: alert
            ? `0 8px 24px 0 rgba(194, 65, 12, ${0.08 + pulse * 0.1})`
            : shadows.md,
        }}
      >
        {inner}
      </Card>
    </div>
  );
};
