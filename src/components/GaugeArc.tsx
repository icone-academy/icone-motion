import React from 'react';
import {interpolate, spring} from 'remotion';
import {colors, radius, shadows} from '../theme';
import {fontBody} from '../fonts';
import {AUTHOR_FPS, useAuthoredFrame} from '../timeline';
import {Card} from './Card';
import {Pill} from './Pill';

export type GaugeZone = {
  /** fração inicial 0–1 */
  from: number;
  /** fração final 0–1 */
  to: number;
  color: string;
};

const SWEEP = 270;
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

/** Conta o número no valor (ex.: "4,2%" → 4.2) e formata de volta. */
const formatCountedValue = (value: string, progress: number): string => {
  const match = value.match(/^(-?\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return value;
  const raw = match[1].replace(',', '.');
  const suffix = match[2] ?? '';
  const target = Number(raw);
  if (Number.isNaN(target)) return value;
  const current = target * Math.max(0, Math.min(1, progress));
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0;
  const formatted =
    decimals > 0
      ? current.toFixed(decimals).replace('.', ',')
      : String(Math.round(current));
  return `${formatted}${suffix}`;
};

/**
 * Gauge circular: arco 270°, agulha, contagem do valor e pill de status
 * atrasada — motion contido, sem exagero.
 */
export const GaugeArc: React.FC<{
  label: string;
  value: string;
  fraction: number;
  zones: GaugeZone[];
  delay?: number;
  size?: number;
  statusLabel?: string;
  statusBg?: string;
  statusColor?: string;
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
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 18;
  const stroke = size * 0.075;

  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 22, stiffness: 95, mass: 0.9},
  });

  const needleProgress = spring({
    frame: frame - delay - 8,
    fps,
    durationInFrames: 22,
    config: {damping: 20, stiffness: 110, mass: 0.85},
  });
  const shownFraction = Math.max(0, Math.min(1, fraction)) * needleProgress;
  const needleAngle = START_ANGLE + SWEEP * shownFraction;
  const needleTip = polar(cx, cy, r - stroke * 1.35, needleAngle);
  const needleBase = polar(cx, cy, size * 0.055, needleAngle + 180);

  const countProgress = interpolate(frame - delay - 8, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const displayValue = formatCountedValue(value, countProgress);

  // Pill só depois da agulha assentar
  const statusIn = spring({
    frame: frame - delay - 28,
    fps,
    config: {damping: 18, stiffness: 120, mass: 0.75},
  });

  // Alerta bem suave (só “Atenção”)
  const pulse = alert
    ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin((frame - delay) * 0.12))
    : 0;

  const gap = 1.2;

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
            opacity={interpolate(frame - delay - i * 3, [0, 10], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}
          />
        );
      })}
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
        gap: 10,
      }}
    >
      <div style={{position: 'relative', width: size, height: size * 0.9}}>
        {gaugeSvg}
        <div
          style={{
            position: 'absolute',
            top: '72%',
            left: 0,
            right: 0,
            textAlign: 'center',
            transform: 'translateY(-10%)',
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: size * 0.145,
            color: colors.textPrimary,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            paddingTop: size * 0.02,
          }}
        >
          {displayValue}
        </div>
      </div>
      <div
        style={{
          fontFamily: fontBody,
          fontWeight: 600,
          fontSize: size * 0.085,
          color: colors.textSecondary,
          marginTop: 2,
        }}
      >
        {label}
      </div>
      {statusLabel ? (
        <div
          style={{
            opacity: statusIn,
            transform: `translateY(${(1 - statusIn) * 8}px) scale(${0.92 + statusIn * 0.08})`,
            marginTop: 4,
          }}
        >
          <Pill
            bg={statusBg ?? colors.successSoft}
            color={statusColor ?? colors.success}
            fontSize={size * 0.068}
          >
            {statusLabel}
          </Pill>
        </div>
      ) : null}
    </div>
  );

  if (bare) {
    return (
      <div style={{opacity: enter, transform: `scale(${0.94 + enter * 0.06})`}}>
        {inner}
      </div>
    );
  }

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 18}px) scale(${0.96 + enter * 0.04})`,
      }}
    >
      <Card
        radiusSize={radius.lg}
        style={{
          padding: '14px 16px 16px',
          borderColor: alert
            ? `rgba(217, 119, 6, ${0.25 + pulse * 0.35})`
            : colors.border,
          boxShadow: alert
            ? `0 6px 18px 0 rgba(217, 119, 6, ${0.06 + pulse * 0.08})`
            : shadows.md,
        }}
      >
        {inner}
      </Card>
    </div>
  );
};
