import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';
import {AUTHOR_FPS, T, useAuthoredFrame} from '../timeline';
import {ArrowRight, CheckCircle2, TrendingUp, Wand2} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {AnimatedText} from '../components/AnimatedText';
import {Pill} from '../components/Pill';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 6 — Correção automática: gauges em vermelho →
 * processamento (ring + steps) → resultado antes/depois em verde.
 */

const PROCESS_IN = 90;
const RESULT_IN = 220;

const STEPS = [
  'Analisando a formulação',
  'Ajustando açúcares e sólidos',
  'Preservando a identidade da receita',
  'Validando parâmetros técnicos',
];

const PARAMS = [
  {label: 'PAC', before: '32.4', after: '27.8'},
  {label: 'Sólidos totais', before: '46%', after: '38%'},
  {label: 'Açúcares', before: '26%', after: '21%'},
  {label: 'POD', before: '11.2', after: '16.5'},
];

const ProcessingPanel: React.FC<{delay: number}> = ({delay}) => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const local = frame - delay;

  const enter = spring({
    frame: local,
    fps,
    config: {damping: 200, stiffness: 100},
  });

  const rotation = (local / 96) * 360;
  const pulseOpacity = 0.65 + 0.35 * Math.sin((local / 72) * Math.PI * 2);
  const percent = Math.round(
    interpolate(local, [0, 110], [0, 100], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  const ring = 340;
  const ringR = 144;

  return (
    <div
      style={{
        opacity: enter,
        transform: `scale(${0.94 + enter * 0.06})`,
        display: 'flex',
        alignItems: 'center',
        gap: 88,
      }}
    >
      <div style={{position: 'relative', width: ring, height: ring}}>
        <svg
          width={ring}
          height={ring}
          style={{
            position: 'absolute',
            inset: 0,
            transform: `rotate(${rotation}deg)`,
            opacity: pulseOpacity,
          }}
        >
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={ringR}
            fill="none"
            stroke={colors.primarySoft}
            strokeWidth={18}
          />
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={ringR}
            fill="none"
            stroke={colors.primary}
            strokeWidth={18}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * ringR * 0.28} ${2 * Math.PI * ringR}`}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <Wand2 size={72} color={colors.primary} strokeWidth={1.8} />
          <span
            style={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: 64,
              color: colors.textPrimary,
            }}
          >
            {percent}%
          </span>
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
        {STEPS.map((step, i) => {
          const stepStart = 12 + i * 32;
          const stepDone = stepStart + 32;
          const isActive = local >= stepStart && local < stepDone;
          const isDone = local >= stepDone;
          const stepIn = interpolate(local - stepStart + 10, [0, 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const checkPop = spring({
            frame: local - stepDone,
            fps,
            durationInFrames: 12,
            config: {damping: 10, stiffness: 220, mass: 0.5},
          });
          const spinnerAngle = (local / 24) * 360;

          return (
            <div
              key={step}
              style={{
                opacity: stepIn,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '22px 32px',
                borderRadius: radius.md,
                backgroundColor: isDone
                  ? 'rgba(47, 133, 90, 0.10)'
                  : isActive
                    ? 'rgba(122, 106, 90, 0.10)'
                    : colors.surfaceMuted,
                border: `1px solid ${isDone ? colors.successSoft : colors.borderSoft}`,
                width: 780,
              }}
            >
              {isDone ? (
                <div style={{transform: `scale(${checkPop})`}}>
                  <CheckCircle2 size={40} color={colors.success} strokeWidth={2.2} />
                </div>
              ) : (
                <svg width={40} height={40} style={{transform: `rotate(${spinnerAngle}deg)`}}>
                  <circle
                    cx={20}
                    cy={20}
                    r={15}
                    fill="none"
                    stroke={isActive ? colors.primary : colors.border}
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeDasharray="72 92"
                  />
                </svg>
              )}
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: isActive || isDone ? 600 : 500,
                  fontSize: 32,
                  color: isDone
                    ? colors.success
                    : isActive
                      ? colors.textPrimary
                      : colors.textMuted,
                }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const BeforeAfter: React.FC<{delay: number}> = ({delay}) => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const local = frame - delay;

  const enter = spring({frame: local, fps, config: {damping: 200, stiffness: 90}});
  const metricPop = spring({
    frame: local - 60,
    fps,
    config: {damping: 12, stiffness: 140, mass: 0.7},
  });
  const arrowIn = spring({
    frame: local - 30,
    fps,
    config: {damping: 12, stiffness: 160, mass: 0.6},
  });

  const renderCard = (kind: 'before' | 'after') => {
    const isAfter = kind === 'after';
    return (
      <div
        style={{
          width: 620,
          borderRadius: radius.lg,
          border: `1.5px solid ${isAfter ? 'rgba(122,106,90,0.25)' : colors.border}`,
          backgroundColor: isAfter ? 'rgba(122,106,90,0.05)' : colors.surfaceMuted,
          boxShadow: shadows.md,
          padding: 40,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 26,
          }}
        >
          <span
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 40,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: isAfter ? colors.primary : colors.textMuted,
            }}
          >
            {isAfter ? 'Depois' : 'Antes'}
          </span>
          <Pill
            bg={isAfter ? 'rgba(16,185,129,0.15)' : 'rgba(220,38,38,0.12)'}
            color={isAfter ? colors.success : colors.gaugeRed}
            fontSize={24}
            style={{padding: '10px 20px'}}
          >
            {isAfter ? 'Perfect' : 'Out'}
          </Pill>
        </div>
        {PARAMS.map((param, i) => {
          const rowIn = interpolate(local - 14 - i * 6, [0, 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <div
              key={param.label}
              style={{
                opacity: rowIn,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '18px 22px',
                borderRadius: radius.sm,
                backgroundColor: colors.surface,
                border: `1px solid ${colors.borderSoft}`,
                marginBottom: 14,
                fontFamily: fontBody,
                fontSize: 32,
              }}
            >
              <span style={{fontWeight: 500, color: colors.textSecondary}}>{param.label}</span>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 34,
                  color: isAfter ? colors.success : colors.gaugeRed,
                }}
              >
                {isAfter ? param.after : param.before}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 50}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
      }}
    >
      <div
        style={{
          transform: `scale(${metricPop})`,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <TrendingUp size={64} color={colors.success} strokeWidth={2.2} />
        <span
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 68,
            color: colors.success,
          }}
        >
          +38% de melhora
        </span>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
        {renderCard('before')}
        <div
          style={{
            transform: `scale(${arrowIn})`,
            width: 104,
            height: 104,
            borderRadius: '50%',
            backgroundColor: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: shadows.md,
          }}
        >
          <ArrowRight size={52} color={colors.textInverse} strokeWidth={2.4} />
        </div>
        {renderCard('after')}
      </div>
    </div>
  );
};

export const Scene06: React.FC = () => {
  const frame = useAuthoredFrame();

  const introOpacity = interpolate(frame, [PROCESS_IN - 20, PROCESS_IN], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const processOpacity = interpolate(
    frame,
    [RESULT_IN - 20, RESULT_IN],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 32}}>
        <Eyebrow delay={2} fontSize={40}>
          Correção automática
        </Eyebrow>
      </AbsoluteFill>

      {frame < PROCESS_IN ? (
        <AbsoluteFill
          style={{alignItems: 'center', justifyContent: 'center', opacity: introOpacity}}
        >
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36}}>
            <AnimatedText
              text="Receita desequilibrada."
              delay={10}
              stagger={5}
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 118,
                color: colors.gaugeRed,
              }}
            />
            <div style={{display: 'flex', gap: 22}}>
              {['PAC 32.4', 'Sólidos 46%', 'Açúcares 26%'].map((tag, i) => (
                <Pill
                  key={tag}
                  bg="rgba(220,38,38,0.12)"
                  color={colors.gaugeRed}
                  border={colors.gaugeRed}
                  fontSize={34}
                  style={{
                    padding: '14px 30px',
                    opacity: interpolate(frame - 40 - i * 10, [0, 8], [0, 1], {
                      extrapolateLeft: 'clamp',
                      extrapolateRight: 'clamp',
                    }),
                  }}
                >
                  {tag}
                </Pill>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {frame >= PROCESS_IN && frame < RESULT_IN ? (
        <AbsoluteFill
          style={{alignItems: 'center', justifyContent: 'center', opacity: processOpacity}}
        >
          <ProcessingPanel delay={PROCESS_IN + 6} />
        </AbsoluteFill>
      ) : null}

      {frame >= RESULT_IN ? (
        <AbsoluteFill
          style={{alignItems: 'center', justifyContent: 'center', paddingTop: 16}}
        >
          <BeforeAfter delay={RESULT_IN} />
          <div style={{marginTop: 32, maxWidth: 1700, textAlign: 'center'}}>
            <AnimatedText
              text="ICone não apenas identifica o problema. Ele propõe uma solução."
              delay={RESULT_IN + 80}
              stagger={3}
              style={{
                fontFamily: fontDisplay,
                fontWeight: 600,
                fontSize: 48,
                color: colors.textPrimary,
              }}
            />
          </div>
        </AbsoluteFill>
      ) : null}
    </SceneBackground>
  );
};
