import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
} from 'remotion';
import {CheckCircle2, Sparkles, Wand2} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {AnimatedText} from '../components/AnimatedText';
import {LogoReveal} from '../components/LogoReveal';
import {colors, tracking} from '../theme';
import {fontBody, fontDisplay} from '../fonts';
import {AUTHOR_FPS, useAuthoredFrame} from '../timeline';

/**
 * Teaser vertical Instagram — sync com teaser-vo.mp3 (~10.21s @ 30fps).
 *
 * VO:
 *  0.00–1.74  Ainda formula sua receita no olho?
 *  2.14–5.82  A ICone identifica o desequilíbrio e corrige… na hora.
 *  6.16–9.74  ICone, lançamento dia 15 de agosto, em breve no site.
 */

export const TEASER_FPS = 30;
export const TEASER_WIDTH = 1080;
export const TEASER_HEIGHT = 1920;
export const TEASER_AUDIO = 'audio/teaser-vo.mp3';
export const TEASER_AUDIO_SEC = 10.213875;
export const TEASER_DURATION = Math.ceil(TEASER_AUDIO_SEC * TEASER_FPS);

const SAFE_TOP = 170;
const SAFE_BOTTOM = 210;

/** Segundos → frames do teaser (30fps). */
const F = (seconds: number) => Math.round(seconds * TEASER_FPS);

/**
 * Cortes VO (Whisper word-level).
 * Intervalos em segundos [start, end).
 */
const VO = {
  hookEnd: 2.14,
  /** “desequilíbrio” */
  imbalance: 3.42,
  /** “corrige” */
  corrects: 4.32,
  /** fim da frase de correção */
  fixEnd: 5.82,
  brand: 6.16,
  launch: 6.84,
  site: 8.82,
  voEnd: 9.74,
} as const;

const BLOCK = {
  hook: {from: 0, dur: F(VO.hookEnd)},
  differential: {
    from: F(VO.hookEnd),
    dur: F(VO.brand) - F(VO.hookEnd),
  },
  brand: {
    from: F(VO.brand),
    dur: F(VO.launch) - F(VO.brand) + 12,
  },
  cta: {
    from: F(VO.launch) - 6,
    dur: TEASER_DURATION - (F(VO.launch) - 6),
  },
} as const;

/* ─── Shared atmosphere ──────────────────────────────────────────── */

const SoftOrbs: React.FC<{intensity?: number}> = ({intensity = 1}) => {
  const frame = useAuthoredFrame();
  const orbs = [
    {x: -8, y: 18, size: 520, drift: 0.22},
    {x: 62, y: 58, size: 640, drift: 0.16},
    {x: 20, y: 72, size: 380, drift: 0.28},
  ];

  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      {orbs.map((o, i) => {
        const y = Math.sin((frame + i * 40) * o.drift * 0.06) * 28;
        const x = Math.cos((frame + i * 22) * o.drift * 0.05) * 16;
        const op =
          (0.22 + 0.08 * Math.sin((frame + i * 15) * 0.05)) * intensity;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${o.x}%`,
              top: `${o.y}%`,
              width: o.size,
              height: o.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.primarySoft} 0%, transparent 68%)`,
              opacity: op,
              transform: `translate(${x}px, ${y}px)`,
              filter: 'blur(2px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const FadeShell: React.FC<{
  children: React.ReactNode;
  duration: number;
  fadeIn?: number;
  fadeOut?: number;
}> = ({children, duration, fadeIn = 8, fadeOut = 10}) => {
  const frame = useAuthoredFrame();
  const inOp = interpolate(frame, [0, fadeIn], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outOp = interpolate(
    frame,
    [Math.max(fadeIn + 1, duration - fadeOut), duration - 1],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return (
    <AbsoluteFill style={{opacity: inOp * outOp}}>{children}</AbsoluteFill>
  );
};

/* ─── Bloco 1: Hook — receita fantasma + pergunta ────────────────── */

const GHOST_ROWS: Array<{
  name: string;
  qty: string;
  tone?: 'ok' | 'bad' | 'guess';
}> = [
  {name: 'Leite integral', qty: '~1 L?', tone: 'guess'},
  {name: 'Creme 35%', qty: '180 g', tone: 'ok'},
  {name: 'Pistache', qty: '80 g', tone: 'ok'},
  {name: 'Açúcares', qty: '???', tone: 'bad'},
  {name: 'Estabilizante', qty: 'a olho', tone: 'guess'},
];

const GhostRecipe: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const enter = spring({
    frame: frame - 1,
    fps,
    config: {damping: 20, stiffness: 90, mass: 1},
  });
  const wobble = Math.sin(frame * 0.11) * 0.55;
  const floatY = Math.sin(frame * 0.07) * 6;

  return (
    <div
      style={{
        opacity: enter * 0.55,
        transform: `translateY(${(1 - enter) * 40 + floatY}px) rotate(${-3.5 + wobble}deg) scale(${0.94 + enter * 0.06})`,
        width: 720,
        padding: '44px 48px 40px',
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.72)',
        border: `1.5px solid ${colors.border}`,
        boxShadow: '0 24px 60px rgba(63, 48, 40, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 36,
            color: colors.textPrimary,
            letterSpacing: '-0.02em',
          }}
        >
          Gelato de Pistache
        </div>
        <div
          style={{
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 20,
            letterSpacing: tracking.wide,
            textTransform: 'uppercase',
            color: colors.gaugeRed,
            opacity: 0.85,
          }}
        >
          rascunho
        </div>
      </div>

      <div
        style={{
          height: 1,
          backgroundColor: colors.borderSoft,
          marginBottom: 4,
        }}
      />

      {GHOST_ROWS.map((row, i) => {
        const rowIn = spring({
          frame: frame - (6 + i * 4),
          fps,
          config: {damping: 18, stiffness: 120, mass: 0.7},
        });
        const qtyColor =
          row.tone === 'bad'
            ? colors.gaugeRed
            : row.tone === 'guess'
              ? colors.warning
              : colors.textMuted;

        return (
          <div
            key={row.name}
            style={{
              opacity: rowIn,
              transform: `translateX(${(1 - rowIn) * 18}px)`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 24,
              padding: '10px 0',
              borderBottom:
                i < GHOST_ROWS.length - 1
                  ? `1px solid ${colors.borderSoft}`
                  : 'none',
            }}
          >
            <span
              style={{
                fontFamily: fontBody,
                fontWeight: 500,
                fontSize: 28,
                color: colors.textSecondary,
              }}
            >
              {row.name}
            </span>
            <span
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 28,
                color: qtyColor,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: row.tone === 'bad' ? '0.08em' : undefined,
              }}
            >
              {row.qty}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const BlockHook: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const rise = spring({
    frame: frame - 2,
    fps,
    config: {damping: 18, stiffness: 120, mass: 0.8},
  });
  const line = spring({
    frame: frame - 22,
    fps,
    config: {damping: 20, stiffness: 100, mass: 0.85},
  });
  const breath = 1 + Math.sin(frame * 0.08) * 0.008;

  return (
    <FadeShell duration={BLOCK.hook.dur} fadeOut={12}>
      <SceneBackground>
        <SoftOrbs />

        {/* Receita fantasma — contexto do “no olho” */}
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: SAFE_TOP + 40,
            paddingBottom: SAFE_BOTTOM,
          }}
        >
          <GhostRecipe />
        </AbsoluteFill>

        {/* Véu p/ legibilidade do headline */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(
              180deg,
              rgba(248,246,242,0.15) 0%,
              rgba(248,246,242,0.55) 38%,
              rgba(248,246,242,0.72) 50%,
              rgba(248,246,242,0.55) 62%,
              rgba(248,246,242,0.2) 100%
            )`,
            pointerEvents: 'none',
          }}
        />

        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: SAFE_TOP,
            paddingBottom: SAFE_BOTTOM,
            paddingLeft: 48,
            paddingRight: 48,
          }}
        >
          <div
            style={{
              opacity: rise,
              transform: `translateY(${(1 - rise) * 36}px) scale(${0.96 + rise * 0.04 * breath})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 28,
              maxWidth: 960,
            }}
          >
            <AnimatedText
              text="Ainda formula"
              delay={2}
              stagger={2}
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 102,
                lineHeight: 1.02,
                color: colors.textPrimary,
                textAlign: 'center',
                letterSpacing: '-0.025em',
                textShadow: '0 1px 0 rgba(248,246,242,0.8)',
              }}
            />
            <AnimatedText
              text="no olho?"
              delay={F(1.34)}
              stagger={3}
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 110,
                lineHeight: 1.02,
                color: colors.primary,
                textAlign: 'center',
                letterSpacing: '-0.025em',
                textShadow: '0 1px 0 rgba(248,246,242,0.8)',
              }}
            />
            <div
              style={{
                width: 140,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.primary,
                transform: `scaleX(${line})`,
                transformOrigin: 'center',
                opacity: 0.85,
              }}
            />
          </div>
        </AbsoluteFill>
      </SceneBackground>
    </FadeShell>
  );
};

/* ─── Bloco 2: Diferencial — identifica / corrige ────────────────── */

const METRIC_CHIPS = [
  {label: 'Açúcares', before: '32%', after: '18%', accent: true},
  {label: 'POD', before: 'Alto', after: 'Ideal', accent: false},
  {label: 'Sólidos', before: '38%', after: '42%', accent: false},
] as const;

const FixSparks: React.FC<{active: number}> = ({active}) => {
  const sparks = [
    {x: -120, y: -90, s: 1.1, d: 0},
    {x: 130, y: -70, s: 0.9, d: 3},
    {x: -90, y: 100, s: 0.85, d: 5},
    {x: 110, y: 110, s: 1, d: 2},
    {x: 0, y: -140, s: 0.75, d: 4},
  ];

  return (
    <>
      {sparks.map((sp, i) => {
        const p = spring({
          frame: active - sp.d,
          fps: AUTHOR_FPS,
          durationInFrames: 16,
          config: {damping: 12, stiffness: 160, mass: 0.45},
        });
        const fade = interpolate(active - sp.d, [0, 8, 28], [0, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              opacity: fade,
              transform: `translate(-50%, -50%) translate(${sp.x * p}px, ${sp.y * p}px) scale(${0.4 + p * sp.s})`,
              pointerEvents: 'none',
            }}
          >
            <Sparkles
              size={28}
              color={colors.success}
              strokeWidth={2.2}
            />
          </div>
        );
      })}
    </>
  );
};

const BlockDifferential: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  // Tempos locais (bloco começa em VO.hookEnd)
  const tImbalance = F(VO.imbalance - VO.hookEnd); // ~38
  const tCorrects = F(VO.corrects - VO.hookEnd); // ~65
  const tFixEnd = F(VO.fixEnd - VO.hookEnd); // ~110

  const heroIn = spring({
    frame: frame - 3,
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.8},
  });
  const browIn = spring({
    frame: frame - 2,
    fps,
    config: {damping: 16, stiffness: 140, mass: 0.65},
  });
  const chipsIn = spring({
    frame: frame - 14,
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.8},
  });
  const barIn = spring({
    frame: frame - 18,
    fps,
    config: {damping: 20, stiffness: 100, mass: 0.85},
  });
  const process = spring({
    frame: frame - (tImbalance - 6),
    fps,
    config: {damping: 20, stiffness: 85, mass: 0.95},
  });
  const fix = spring({
    frame: frame - tCorrects,
    fps,
    config: {damping: 14, stiffness: 95, mass: 0.85},
  });
  const checkPop = spring({
    frame: frame - (tFixEnd - 8),
    fps,
    durationInFrames: 12,
    config: {damping: 10, stiffness: 200, mass: 0.5},
  });
  const wandPop = spring({
    frame: frame - tCorrects,
    fps,
    durationInFrames: 14,
    config: {damping: 11, stiffness: 180, mass: 0.5},
  });
  const copyIn = spring({
    frame: frame - tCorrects,
    fps,
    config: {damping: 16, stiffness: 130, mass: 0.7},
  });

  const value = Math.round(interpolate(fix, [0, 1], [32, 18]));
  const fill = interpolate(fix, [0, 1], [0.9, 0.42]);
  const ringFrac = interpolate(fix, [0, 1], [0.32, 0.18]);
  const punch = interpolate(fix, [0, 0.35, 1], [1, 1.06, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const barColor =
    fix > 0.65 ? colors.success : fix > 0.25 ? colors.warning : colors.gaugeRed;
  const status =
    fix > 0.65 ? 'Faixa ideal' : fix > 0.25 ? 'Corrigindo' : 'Desequilibrado';
  const statusColor =
    fix > 0.65 ? colors.success : fix > 0.25 ? colors.warning : colors.gaugeRed;
  const glowColor =
    fix > 0.65
      ? 'rgba(47, 133, 90, 0.28)'
      : fix > 0.25
        ? 'rgba(183, 121, 31, 0.22)'
        : 'rgba(220, 38, 38, 0.22)';
  const barLabel =
    fix > 0.65 ? 'corrigido' : fix > 0.25 ? 'ajustando…' : 'fora da faixa';

  const ringSize = 400;
  const ringR = 154;
  const stroke = 22;
  const circ = 2 * Math.PI * ringR;
  const dash = circ * ringFrac;

  const spinOp = interpolate(
    frame,
    [tImbalance - 4, tImbalance + 4, tCorrects - 4, tCorrects + 10],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const ringSpin = (Math.max(0, frame - (tImbalance - 4)) / 40) * 360;

  // Scan vertical — “identifica”
  const scanY = interpolate(
    frame,
    [tImbalance - 18, tImbalance + 6],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const scanOp = interpolate(
    frame,
    [tImbalance - 18, tImbalance - 10, tImbalance + 2, tImbalance + 14],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const alertPulse = interpolate(
    frame,
    [tImbalance, tImbalance + 8, tImbalance + 18],
    [0, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const phaseLabel =
    fix > 0.55
      ? 'Receita corrigida'
      : process > 0.4
        ? 'Identificando desequilíbrio'
        : 'Análise ICone';

  return (
    <FadeShell duration={BLOCK.differential.dur} fadeIn={10} fadeOut={12}>
      <SceneBackground>
        <SoftOrbs intensity={0.65} />
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: SAFE_TOP,
            paddingBottom: SAFE_BOTTOM,
            paddingLeft: 44,
            paddingRight: 44,
            gap: 28,
          }}
        >
          {/* Eyebrow de fase */}
          <div
            style={{
              opacity: browIn,
              transform: `translateY(${(1 - browIn) * 12}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 22px',
              borderRadius: 999,
              backgroundColor:
                fix > 0.55
                  ? colors.successSoft
                  : process > 0.4
                    ? colors.dangerSoft
                    : colors.primarySoft,
            }}
          >
            {fix > 0.55 ? (
              <CheckCircle2 size={26} color={colors.success} strokeWidth={2.4} />
            ) : process > 0.4 ? (
              <Wand2 size={26} color={colors.gaugeRed} strokeWidth={2.2} />
            ) : (
              <Sparkles size={26} color={colors.primary} strokeWidth={2.2} />
            )}
            <span
              style={{
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: 24,
                letterSpacing: tracking.wide,
                textTransform: 'uppercase',
                color:
                  fix > 0.55
                    ? colors.success
                    : process > 0.4
                      ? colors.gaugeRed
                      : colors.primary,
              }}
            >
              {phaseLabel}
            </span>
          </div>

          <div
            style={{
              opacity: heroIn,
              transform: `translateY(${(1 - heroIn) * 24}px)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 32,
              width: '100%',
            }}
          >
            {/* Gauge + efeitos */}
            <div
              style={{
                position: 'relative',
                width: ringSize,
                height: ringSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: ringSize * 0.82,
                  height: ringSize * 0.82,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${glowColor} 0%, transparent 72%)`,
                  opacity: 0.85 + process * 0.15,
                  transform: `scale(${0.92 + process * 0.08 + alertPulse * 0.06})`,
                }}
              />

              {/* Pulse de alerta ao detectar */}
              <div
                style={{
                  position: 'absolute',
                  inset: 18,
                  borderRadius: '50%',
                  border: `3px solid ${colors.gaugeRed}`,
                  opacity: alertPulse * 0.7,
                  transform: `scale(${1 + alertPulse * 0.12})`,
                }}
              />

              <svg
                width={ringSize}
                height={ringSize}
                style={{position: 'absolute', inset: 0}}
              >
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={ringR}
                  fill="none"
                  stroke={colors.primarySoft}
                  strokeWidth={stroke}
                />
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={ringR}
                  fill="none"
                  stroke={barColor}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${circ}`}
                  transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
                  style={{
                    filter:
                      fix > 0.65
                        ? 'drop-shadow(0 0 14px rgba(47,133,90,0.45))'
                        : fix < 0.25
                          ? 'drop-shadow(0 0 12px rgba(220,38,38,0.35))'
                          : 'none',
                  }}
                />
              </svg>

              <svg
                width={ringSize}
                height={ringSize}
                style={{
                  position: 'absolute',
                  inset: 0,
                  opacity: spinOp * 0.9,
                  transform: `rotate(${ringSpin}deg)`,
                }}
              >
                <circle
                  cx={ringSize / 2}
                  cy={ringSize / 2}
                  r={ringR + 16}
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={`${circ * 0.14} ${circ}`}
                  opacity={0.55}
                />
              </svg>

              {/* Scan line */}
              <div
                style={{
                  position: 'absolute',
                  left: 48,
                  right: 48,
                  top: 48 + scanY * (ringSize - 96),
                  height: 3,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
                  boxShadow: `0 0 18px ${colors.primaryMuted}`,
                  opacity: scanOp,
                  zIndex: 3,
                }}
              />

              <FixSparks active={frame - tCorrects} />

              {/* Wand burst no momento da correção */}
              <div
                style={{
                  position: 'absolute',
                  top: 28,
                  right: 20,
                  opacity: interpolate(frame - tCorrects, [0, 6, 28], [0, 1, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                  transform: `scale(${wandPop}) rotate(${-18 + wandPop * 24}deg)`,
                  zIndex: 4,
                }}
              >
                <Wand2 size={48} color={colors.primary} strokeWidth={2} />
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  zIndex: 2,
                  transform: `scale(${punch})`,
                }}
              >
                {fix > 0.85 ? (
                  <div style={{transform: `scale(${checkPop})`, marginBottom: 2}}>
                    <CheckCircle2
                      size={40}
                      color={colors.success}
                      strokeWidth={2.4}
                    />
                  </div>
                ) : null}
                <span
                  style={{
                    fontFamily: fontDisplay,
                    fontWeight: 700,
                    fontSize: 136,
                    lineHeight: 0.92,
                    letterSpacing: '-0.04em',
                    color: colors.textPrimary,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {value}
                  <span
                    style={{
                      fontSize: 52,
                      marginLeft: 2,
                      letterSpacing: '-0.02em',
                      opacity: 0.9,
                    }}
                  >
                    %
                  </span>
                </span>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontWeight: 700,
                    fontSize: 26,
                    letterSpacing: tracking.wide,
                    textTransform: 'uppercase',
                    color: statusColor,
                    marginTop: 2,
                  }}
                >
                  {status}
                </span>
              </div>
            </div>

            {/* Chips de métricas — viram no “corrige” */}
            <div
              style={{
                opacity: chipsIn,
                transform: `translateY(${(1 - chipsIn) * 16}px)`,
                display: 'flex',
                gap: 14,
                width: '100%',
                maxWidth: 900,
                justifyContent: 'center',
              }}
            >
              {METRIC_CHIPS.map((chip, i) => {
                const flip = spring({
                  frame: frame - (tCorrects + i * 4),
                  fps,
                  config: {damping: 13, stiffness: 140, mass: 0.65},
                });
                const fixed = flip > 0.55;
                return (
                  <div
                    key={chip.label}
                    style={{
                      flex: 1,
                      maxWidth: 280,
                      padding: '18px 16px',
                      borderRadius: 18,
                      backgroundColor: fixed
                        ? colors.successSoft
                        : colors.surface,
                      border: `1.5px solid ${fixed ? 'rgba(47,133,90,0.35)' : colors.border}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      transform: `scale(${0.96 + flip * 0.04})`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: fontBody,
                        fontWeight: 600,
                        fontSize: 20,
                        letterSpacing: tracking.wide,
                        textTransform: 'uppercase',
                        color: colors.textMuted,
                      }}
                    >
                      {chip.label}
                    </span>
                    <span
                      style={{
                        fontFamily: fontDisplay,
                        fontWeight: 700,
                        fontSize: chip.accent ? 40 : 34,
                        color: fixed
                          ? colors.success
                          : chip.accent
                            ? colors.gaugeRed
                            : colors.textPrimary,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {fixed ? chip.after : chip.before}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Barra */}
            <div
              style={{
                width: '100%',
                maxWidth: 860,
                opacity: barIn,
                transform: `translateY(${(1 - barIn) * 14}px)`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: 12,
                  fontFamily: fontBody,
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 28,
                    color: colors.textSecondary,
                  }}
                >
                  Açúcares totais
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: 26,
                    color: statusColor,
                  }}
                >
                  {barLabel}
                </span>
              </div>

              <div style={{position: 'relative', height: 20}}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 10,
                    backgroundColor: colors.borderSoft,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '38%',
                    width: '16%',
                    top: 0,
                    bottom: 0,
                    borderRadius: 10,
                    backgroundColor: colors.successSoft,
                    border: `1.5px solid ${colors.success}`,
                    opacity: 0.45 + process * 0.35,
                    boxSizing: 'border-box',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${fill * 100}%`,
                    borderRadius: 10,
                    backgroundColor: barColor,
                    boxShadow:
                      fix > 0.65
                        ? `0 0 28px rgba(47, 133, 90, ${0.35 * fix})`
                        : fix < 0.25
                          ? '0 0 20px rgba(220, 38, 38, 0.28)'
                          : 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: `calc(${fill * 100}% - 7px)`,
                    top: -5,
                    width: 14,
                    height: 30,
                    borderRadius: 7,
                    backgroundColor: barColor,
                    border: `3px solid ${colors.background}`,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              opacity: copyIn,
              transform: `translateY(${(1 - copyIn) * 18}px)`,
              textAlign: 'center',
              maxWidth: 920,
            }}
          >
            <div
              style={{
                fontFamily: fontBody,
                fontWeight: 500,
                fontSize: 38,
                lineHeight: 1.3,
                color: colors.textPrimary,
              }}
            >
              Identifica o desequilíbrio
              <br />e corrige na hora.
            </div>
          </div>
        </AbsoluteFill>
      </SceneBackground>
    </FadeShell>
  );
};

/* ─── Bloco 3: Brand — “ICone,” ──────────────────────────────────── */

const BlockBrand: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const bloom = spring({
    frame: frame - 1,
    fps,
    config: {damping: 18, stiffness: 90, mass: 0.95},
  });
  const tagIn = spring({
    frame: frame - 10,
    fps,
    config: {damping: 16, stiffness: 130, mass: 0.7},
  });

  return (
    <FadeShell duration={BLOCK.brand.dur} fadeIn={8} fadeOut={14}>
      <SceneBackground>
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: SAFE_TOP,
            paddingBottom: SAFE_BOTTOM,
          }}
        >
          <div
            style={{
              position: 'absolute',
              width: 820,
              height: 820,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${colors.primarySoft} 0%, transparent 70%)`,
              opacity: 0.2 + bloom * 0.5,
              transform: `scale(${0.75 + bloom * 0.4})`,
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 36,
              zIndex: 2,
            }}
          >
            <LogoReveal delay={0} size={440} variant="light" />
            <div
              style={{
                opacity: tagIn,
                transform: `translateY(${(1 - tagIn) * 14}px)`,
                fontFamily: fontDisplay,
                fontWeight: 600,
                fontSize: 40,
                letterSpacing: tracking.industrial,
                textTransform: 'uppercase',
                color: colors.primary,
                textAlign: 'center',
              }}
            >
              Inteligência para Gelato
            </div>
          </div>
        </AbsoluteFill>
      </SceneBackground>
    </FadeShell>
  );
};

/* ─── Bloco 4: CTA — lançamento / em breve no site ───────────────── */

const BlockCta: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  // Local: sequence starts ~6 frames before “lançamento”
  const tLaunch = 6;
  const tSite = F(VO.site - VO.launch) + 6; // ~65

  const titleIn = spring({
    frame: frame - tLaunch,
    fps,
    config: {damping: 14, stiffness: 130, mass: 0.7},
  });
  const lineIn = spring({
    frame: frame - (tLaunch + 10),
    fps,
    config: {damping: 20, stiffness: 110, mass: 0.75},
  });
  const subIn = spring({
    frame: frame - tSite,
    fps,
    config: {damping: 16, stiffness: 130, mass: 0.7},
  });
  const logoIn = spring({
    frame: frame - (tSite + 8),
    fps,
    config: {damping: 200, stiffness: 120},
  });

  return (
    <FadeShell duration={BLOCK.cta.dur} fadeIn={10} fadeOut={6}>
      <SceneBackground>
        <SoftOrbs intensity={0.55} />
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: SAFE_TOP,
            paddingBottom: SAFE_BOTTOM + 80,
            paddingLeft: 48,
            paddingRight: 48,
            gap: 28,
          }}
        >
          <div
            style={{
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 26}px) scale(${0.97 + titleIn * 0.03})`,
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 68,
              lineHeight: 1.12,
              color: colors.textPrimary,
              textAlign: 'center',
              maxWidth: 920,
              letterSpacing: '-0.02em',
            }}
          >
            Lançamento
            <br />
            dia 15 de agosto.
          </div>

          <div
            style={{
              width: 96,
              height: 3,
              backgroundColor: colors.primary,
              transform: `scaleX(${lineIn})`,
              opacity: 0.8,
            }}
          />

          <div
            style={{
              opacity: subIn,
              transform: `translateY(${(1 - subIn) * 14}px)`,
              fontFamily: fontBody,
              fontWeight: 500,
              fontSize: 38,
              color: colors.textMuted,
              textAlign: 'center',
            }}
          >
            Em breve no site.
          </div>
        </AbsoluteFill>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: SAFE_BOTTOM - 28,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            opacity: logoIn,
            transform: `translateY(${(1 - logoIn) * 14}px)`,
          }}
        >
          <Img
            src={staticFile('brand/logo-light-transparent.png')}
            style={{width: 88, height: 88, objectFit: 'contain'}}
          />
          <span
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: tracking.industrial,
              textTransform: 'uppercase',
              color: colors.primaryMuted,
            }}
          >
            ICone
          </span>
        </div>
      </SceneBackground>
    </FadeShell>
  );
};

/* ─── Composition ────────────────────────────────────────────────── */

export const TeaserVertical15s: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      <Audio src={staticFile(TEASER_AUDIO)} />

      <Sequence
        from={BLOCK.hook.from}
        durationInFrames={BLOCK.hook.dur}
        name="Hook"
      >
        <BlockHook />
      </Sequence>
      <Sequence
        from={BLOCK.differential.from}
        durationInFrames={BLOCK.differential.dur}
        name="Diferencial"
      >
        <BlockDifferential />
      </Sequence>
      <Sequence
        from={BLOCK.brand.from}
        durationInFrames={BLOCK.brand.dur}
        name="Reveal marca"
      >
        <BlockBrand />
      </Sequence>
      <Sequence
        from={BLOCK.cta.from}
        durationInFrames={BLOCK.cta.dur}
        name="CTA"
      >
        <BlockCta />
      </Sequence>
    </AbsoluteFill>
  );
};
