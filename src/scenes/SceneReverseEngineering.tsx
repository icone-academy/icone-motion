import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';
import {AUTHOR_FPS, T, useAuthoredFrame} from '../timeline';
import {
  Barcode,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  Package,
  ScanSearch,
  Tag,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {AnimatedText} from '../components/AnimatedText';
import {Pill} from '../components/Pill';
import {GaugeBar} from '../components/GaugeBar';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Engenharia reversa — roteiro:
 * problema (sem formulação) → leitura do rótulo → reconstrução
 * científica → composição estimada + balancear/etiquetar (não é IA).
 */

const SCAN_IN = 450; // problema (VO 2:50–3:05)
const PROCESS_IN = 600; // rótulo
const RESULT_IN = 750; // composição + “não é IA”

const LABEL_INGREDIENTS = [
  'Leite integral, açúcar, xarope de glicose,',
  'gordura vegetal, soro de leite em pó,',
  'pasta de pistache, emulsificantes (mono e',
  'diglicerídeos), estabilizantes (LBG, guar).',
];

const LABEL_NUTRITION = [
  {name: 'Valor energético', value: '215 kcal'},
  {name: 'Carboidratos', value: '24 g'},
  {name: 'Açúcares totais', value: '21 g'},
  {name: 'Gorduras totais', value: '11 g'},
  {name: 'Proteínas', value: '3,8 g'},
];

const STEPS = [
  'Lendo as informações do rótulo',
  'Cruzando com o banco técnico da ICone',
  'Reconstruindo uma composição coerente',
];

const ESTIMATED = [
  {label: 'Leite integral', value: '~46%', fraction: 0.46, color: colors.primary},
  {label: 'Açúcares (sacarose + glicose)', value: '~22%', fraction: 0.22, color: colors.sugarPinkBar},
  {label: 'Gordura vegetal', value: '~12%', fraction: 0.12, color: colors.fatAmberBar},
  {label: 'Soro de leite em pó', value: '~9%', fraction: 0.09, color: colors.info},
  {label: 'Pasta de pistache', value: '~6%', fraction: 0.06, color: colors.success},
  {label: 'Neutros e emulsificantes', value: '~1%', fraction: 0.04, color: colors.pacViolet},
];

const OUTCOMES = [
  {icon: FlaskConical, label: 'Balancear a receita com segurança'},
  {icon: Tag, label: 'Gerar etiqueta confiável'},
];

/** Embalagem genérica estilizada (pote sem marca). */
const GenericProduct: React.FC<{delay: number; scale?: number}> = ({
  delay,
  scale = 1,
}) => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const pop = spring({
    frame: frame - delay,
    fps,
    config: {damping: 13, stiffness: 120, mass: 0.8},
  });
  const float = Math.sin(frame / 26) * 6;

  return (
    <div
      style={{
        opacity: pop,
        transform: `translateY(${(1 - pop) * 50 + float}px) scale(${scale * (0.85 + pop * 0.15)})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Tampa */}
      <div
        style={{
          width: 420,
          height: 56,
          borderRadius: '50% / 100%',
          borderTopLeftRadius: 64,
          borderTopRightRadius: 64,
          backgroundColor: colors.primaryMuted,
          border: `2.5px solid ${colors.primary}`,
          zIndex: 2,
        }}
      />
      {/* Corpo do pote */}
      <div
        style={{
          width: 390,
          height: 440,
          marginTop: -14,
          borderBottomLeftRadius: 52,
          borderBottomRightRadius: 52,
          backgroundColor: colors.surface,
          border: `2.5px solid ${colors.border}`,
          boxShadow: shadows.shell,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 36,
          gap: 18,
        }}
      >
        {/* Rótulo genérico */}
        <div
          style={{
            width: 300,
            borderRadius: radius.md,
            backgroundColor: colors.primarySoft,
            border: `1.5px solid ${colors.borderSoft}`,
            padding: '28px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <Package size={58} color={colors.primary} strokeWidth={1.8} />
          <span
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 28,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.primary,
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            Produto do mercado
          </span>
          {[0.9, 0.65, 0.8].map((w, i) => (
            <div
              key={i}
              style={{
                height: 12,
                width: `${w * 100}%`,
                borderRadius: 6,
                backgroundColor: colors.primaryMuted,
                opacity: 0.5,
              }}
            />
          ))}
        </div>
        <Barcode size={72} color={colors.textMuted} strokeWidth={1.4} />
      </div>
    </div>
  );
};

/** Painel da ICone recebendo os dados do rótulo. */
const LabelPanel: React.FC<{delay: number}> = ({delay}) => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateX(${(1 - enter) * 60}px)`,
        width: 920,
        borderRadius: radius.shell,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.shell,
        padding: 42,
        display: 'flex',
        flexDirection: 'column',
        gap: 26,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <ClipboardList size={40} color={colors.primary} />
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 36,
            color: colors.textPrimary,
          }}
        >
          Informações declaradas no rótulo
        </span>
      </div>

      {/* Ingredientes declarados */}
      <div
        style={{
          borderRadius: radius.md,
          backgroundColor: colors.surfaceMuted,
          border: `1px solid ${colors.borderSoft}`,
          padding: '24px 28px',
        }}
      >
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 22,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: colors.textMuted,
          }}
        >
          Ingredientes
        </span>
        <div style={{marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8}}>
          {LABEL_INGREDIENTS.map((line, i) => {
            const lineIn = interpolate(frame - delay - 14 - i * 7, [0, 9], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={i}
                style={{
                  fontFamily: fontBody,
                  fontSize: 26,
                  color: colors.textSecondary,
                  opacity: lineIn,
                }}
              >
                {line}
              </span>
            );
          })}
        </div>
      </div>

      {/* Tabela nutricional do rótulo */}
      <div
        style={{
          borderRadius: radius.md,
          backgroundColor: colors.surfaceMuted,
          border: `1px solid ${colors.borderSoft}`,
          padding: '24px 28px',
        }}
      >
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 22,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: colors.textMuted,
          }}
        >
          Tabela nutricional · porção 60 g
        </span>
        <div style={{marginTop: 14}}>
          {LABEL_NUTRITION.map((row, i) => {
            const rowIn = interpolate(frame - delay - 40 - i * 7, [0, 9], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={row.name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '11px 0',
                  borderBottom:
                    i < LABEL_NUTRITION.length - 1
                      ? `1px solid ${colors.borderSoft}`
                      : 'none',
                  fontFamily: fontBody,
                  fontSize: 28,
                  opacity: rowIn,
                }}
              >
                <span style={{color: colors.textSecondary}}>{row.name}</span>
                <span style={{fontWeight: 700, color: colors.textPrimary}}>{row.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** Processamento — mesmo estilo do anel da cena de correção automática. */
const ReverseProcessing: React.FC<{delay: number}> = ({delay}) => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const local = frame - delay;

  const enter = spring({frame: local, fps, config: {damping: 200, stiffness: 100}});
  const rotation = (local / 96) * 360;
  const pulseOpacity = 0.65 + 0.35 * Math.sin((local / 72) * Math.PI * 2);
  const percent = Math.round(
    interpolate(local, [0, 120], [0, 100], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  return (
    <div
      style={{
        opacity: enter,
        transform: `scale(${0.94 + enter * 0.06})`,
        display: 'flex',
        alignItems: 'center',
        gap: 72,
      }}
    >
      <div style={{position: 'relative', width: 340, height: 340}}>
        <svg
          width={340}
          height={340}
          style={{
            position: 'absolute',
            inset: 0,
            transform: `rotate(${rotation}deg)`,
            opacity: pulseOpacity,
          }}
        >
          <circle cx={170} cy={170} r={144} fill="none" stroke={colors.primarySoft} strokeWidth={18} />
          <circle
            cx={170}
            cy={170}
            r={144}
            fill="none"
            stroke={colors.primary}
            strokeWidth={18}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 144 * 0.28} ${2 * Math.PI * 144}`}
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
            gap: 10,
          }}
        >
          <ScanSearch size={68} color={colors.primary} strokeWidth={1.8} />
          <span
            style={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: 56,
              color: colors.textPrimary,
            }}
          >
            {percent}%
          </span>
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
        {STEPS.map((step, i) => {
          const stepStart = 10 + i * 36;
          const stepDone = stepStart + 36;
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
                width: 900,
              }}
            >
              {isDone ? (
                <div style={{transform: `scale(${checkPop})`}}>
                  <CheckCircle2 size={38} color={colors.success} strokeWidth={2.2} />
                </div>
              ) : (
                <svg width={38} height={38} style={{transform: `rotate(${spinnerAngle}deg)`}}>
                  <circle
                    cx={19}
                    cy={19}
                    r={14.5}
                    fill="none"
                    stroke={isActive ? colors.primary : colors.border}
                    strokeWidth={4}
                    strokeLinecap="round"
                    strokeDasharray="68 90"
                  />
                </svg>
              )}
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: isActive || isDone ? 600 : 400,
                  fontSize: 30,
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

export const SceneReverseEngineering: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const introOpacity = interpolate(frame, [SCAN_IN - 18, SCAN_IN], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scanOpacity = interpolate(frame, [PROCESS_IN - 18, PROCESS_IN], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const processOpacity = interpolate(frame, [RESULT_IN - 18, RESULT_IN], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const resultIn = spring({
    frame: frame - RESULT_IN,
    fps,
    config: {damping: 200, stiffness: 90},
  });

  const scanLocal = frame - SCAN_IN;
  const dots = [0, 1, 2].map((i) => {
    const p = ((scanLocal - i * 16 + 48) % 48) / 48;
    return {p, visible: scanLocal > i * 16};
  });

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 36, zIndex: 5}}>
        <Eyebrow delay={2} fontSize={38}>
          Engenharia reversa
        </Eyebrow>
      </AbsoluteFill>

      {/* Fase 1 — problema: sem formulação completa */}
      {frame < SCAN_IN ? (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            gap: 32,
            opacity: introOpacity,
            paddingTop: 48,
          }}
        >
          <AnimatedText
            text="Sem a formulação completa, balancear e rotular fica difícil."
            delay={8}
            stagger={2}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 64,
              color: colors.textPrimary,
              maxWidth: 1780,
              textAlign: 'center',
              lineHeight: 1.15,
            }}
          />
          <div
            style={{
              opacity: interpolate(frame, [40, 58], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              fontFamily: fontBody,
              fontSize: 34,
              color: colors.textMuted,
              maxWidth: 1500,
              textAlign: 'center',
              lineHeight: 1.35,
            }}
          >
            Ingredientes de empresas especializadas — na maioria das vezes,
            sem acesso à receita completa do produto.
          </div>
          <GenericProduct delay={55} />
        </AbsoluteFill>
      ) : null}

      {/* Fase 2 — rótulo alimentando a plataforma */}
      {frame >= SCAN_IN && frame < PROCESS_IN ? (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: scanOpacity,
            paddingTop: 52,
            flexDirection: 'column',
            gap: 28,
          }}
        >
          <div
            style={{
              fontFamily: fontBody,
              fontSize: 42,
              fontWeight: 500,
              color: colors.textSecondary,
              textAlign: 'center',
              maxWidth: 1680,
              lineHeight: 1.3,
              opacity: interpolate(frame - SCAN_IN, [0, 14], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            A ICone parte das informações do rótulo para reconstruir a composição.
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 48}}>
            <GenericProduct delay={SCAN_IN} scale={0.88} />

            <div style={{position: 'relative', width: 160, height: 12}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 6,
                  background: `linear-gradient(90deg, ${colors.primaryMuted}, ${colors.primary})`,
                  opacity: 0.45,
                }}
              />
              {dots.map((dot, i) =>
                dot.visible ? (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${dot.p * 100}%`,
                      top: '50%',
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: colors.primary,
                      boxShadow: '0 0 22px rgba(122,106,90,0.6)',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ) : null,
              )}
            </div>

            <LabelPanel delay={SCAN_IN + 10} />
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Fase 3 — reconstrução científica */}
      {frame >= PROCESS_IN && frame < RESULT_IN ? (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: processOpacity,
            flexDirection: 'column',
            gap: 36,
            paddingTop: 36,
          }}
        >
          <div
            style={{
              fontFamily: fontBody,
              fontSize: 42,
              fontWeight: 500,
              color: colors.textSecondary,
              textAlign: 'center',
              maxWidth: 1650,
              lineHeight: 1.3,
              opacity: interpolate(frame - PROCESS_IN, [0, 12], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            Ciência e experiência técnica da ICone — não inteligência artificial.
          </div>
          <ReverseProcessing delay={PROCESS_IN + 4} />
        </AbsoluteFill>
      ) : null}

      {/* Fase 4 — composição + benefícios */}
      {frame >= RESULT_IN ? (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 36,
            gap: 18,
          }}
        >
          <AnimatedText
            text="Composição estimada — para entender, balancear e rotular"
            delay={RESULT_IN + 4}
            stagger={2}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 52,
              color: colors.primary,
              maxWidth: 1780,
              textAlign: 'center',
            }}
          />

          <div
            style={{
              opacity: resultIn,
              transform: `translateY(${(1 - resultIn) * 36}px)`,
              width: 1180,
              borderRadius: radius.shell,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              boxShadow: shadows.shell,
              padding: '28px 48px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: 34,
                  color: colors.textPrimary,
                }}
              >
                Reconstrução coerente a partir do rótulo
              </span>
              <Pill bg={colors.primarySoft} color={colors.primary} fontSize={22}>
                Estimativa técnica
              </Pill>
            </div>
            {ESTIMATED.map((item, i) => (
              <GaugeBar
                key={item.label}
                label={item.label}
                valueLabel={item.value}
                fraction={item.fraction}
                color={item.color}
                delay={RESULT_IN + 24 + i * 12}
                width={1080}
                fontSize={28}
                barHeight={18}
              />
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 20,
              opacity: interpolate(frame - RESULT_IN, [90, 115], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            {OUTCOMES.map((item) => {
              const Icon = item.icon;
              return (
                <Pill
                  key={item.label}
                  bg={colors.successSoft}
                  color={colors.success}
                  fontSize={26}
                  style={{padding: '16px 28px'}}
                >
                  <Icon size={28} color={colors.success} />
                  {item.label}
                </Pill>
              );
            })}
          </div>

          <div
            style={{
              fontFamily: fontBody,
              fontSize: 30,
              fontWeight: 600,
              color: colors.textPrimary,
              maxWidth: 1680,
              textAlign: 'center',
              lineHeight: 1.35,
              opacity: interpolate(frame - RESULT_IN, [140, 165], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            Esse trabalho não é feito por inteligência artificial —
            é resultado da ciência e da experiência técnica da ICone.
          </div>

          <div
            style={{
              fontFamily: fontBody,
              fontSize: 22,
              color: colors.textMuted,
              opacity:
                0.9 *
                interpolate(frame - RESULT_IN, [190, 215], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              maxWidth: 1400,
              textAlign: 'center',
            }}
          >
            Estimativa técnica com base no rótulo — não uma fórmula exata do fabricante.
          </div>
        </AbsoluteFill>
      ) : null}
    </SceneBackground>
  );
};
