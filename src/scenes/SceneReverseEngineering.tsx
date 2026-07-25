import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  Barcode,
  CheckCircle2,
  ClipboardList,
  Package,
  ScanSearch,
  Sparkles,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {AnimatedText} from '../components/AnimatedText';
import {Pill} from '../components/Pill';
import {GaugeBar} from '../components/GaugeBar';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena extra (2:25–2:45) — Engenharia reversa de produtos do
 * mercado: embalagem genérica → leitura do rótulo → processamento
 * → composição estimada com proporções aproximadas.
 */

const SCAN_IN = 115; // produto vai para a esquerda, painel do rótulo entra
const PROCESS_IN = 255;
const RESULT_IN = 385;

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
  'Lendo informações do rótulo',
  'Cruzando com o banco de ingredientes',
  'Estimando proporções prováveis',
];

const ESTIMATED = [
  {label: 'Leite integral', value: '~46%', fraction: 0.46, color: colors.primary},
  {label: 'Açúcares (sacarose + glicose)', value: '~22%', fraction: 0.22, color: colors.sugarPinkBar},
  {label: 'Gordura vegetal', value: '~12%', fraction: 0.12, color: colors.fatAmberBar},
  {label: 'Soro de leite em pó', value: '~9%', fraction: 0.09, color: colors.info},
  {label: 'Pasta de pistache', value: '~6%', fraction: 0.06, color: colors.success},
  {label: 'Neutros e emulsificantes', value: '~1%', fraction: 0.04, color: colors.pacViolet},
];

/** Embalagem genérica estilizada (pote sem marca). */
const GenericProduct: React.FC<{delay: number; scale?: number}> = ({
  delay,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

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
          width: 250,
          height: 34,
          borderRadius: '50% / 100%',
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
          backgroundColor: colors.primaryMuted,
          border: `2px solid ${colors.primary}`,
          zIndex: 2,
        }}
      />
      {/* Corpo do pote */}
      <div
        style={{
          width: 230,
          height: 260,
          marginTop: -8,
          borderBottomLeftRadius: 34,
          borderBottomRightRadius: 34,
          backgroundColor: colors.surface,
          border: `2px solid ${colors.border}`,
          boxShadow: shadows.shell,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 22,
          gap: 10,
        }}
      >
        {/* Rótulo genérico */}
        <div
          style={{
            width: 176,
            borderRadius: radius.sm,
            backgroundColor: colors.primarySoft,
            border: `1px solid ${colors.borderSoft}`,
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Package size={30} color={colors.primary} strokeWidth={1.8} />
          <span
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 15,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.primary,
            }}
          >
            Produto do mercado
          </span>
          {/* Linhas de texto fake */}
          {[0.9, 0.65, 0.8].map((w, i) => (
            <div
              key={i}
              style={{
                height: 7,
                width: `${w * 100}%`,
                borderRadius: 3.5,
                backgroundColor: colors.primaryMuted,
                opacity: 0.5,
              }}
            />
          ))}
        </div>
        <Barcode size={44} color={colors.textMuted} strokeWidth={1.4} />
      </div>
    </div>
  );
};

/** Painel da ICone recebendo os dados do rótulo. */
const LabelPanel: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

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
        width: 680,
        borderRadius: radius.shell,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.shell,
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <ClipboardList size={28} color={colors.primary} />
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 27,
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
          padding: '18px 22px',
        }}
      >
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 17,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: colors.textMuted,
          }}
        >
          Ingredientes
        </span>
        <div style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5}}>
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
                  fontSize: 19,
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
          padding: '18px 22px',
        }}
      >
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 17,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: colors.textMuted,
          }}
        >
          Tabela nutricional · porção 60 g
        </span>
        <div style={{marginTop: 10}}>
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
                  padding: '7px 0',
                  borderBottom:
                    i < LABEL_NUTRITION.length - 1
                      ? `1px solid ${colors.borderSoft}`
                      : 'none',
                  fontFamily: fontBody,
                  fontSize: 20,
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
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - delay;

  const enter = spring({frame: local, fps, config: {damping: 200, stiffness: 100}});
  const rotation = (local / 96) * 360;
  const pulseOpacity = 0.65 + 0.35 * Math.sin((local / 72) * Math.PI * 2);
  const percent = Math.round(
    interpolate(local, [0, 105], [0, 100], {
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
        gap: 64,
      }}
    >
      <div style={{position: 'relative', width: 240, height: 240}}>
        <svg
          width={240}
          height={240}
          style={{
            position: 'absolute',
            inset: 0,
            transform: `rotate(${rotation}deg)`,
            opacity: pulseOpacity,
          }}
        >
          <circle cx={120} cy={120} r={102} fill="none" stroke={colors.primarySoft} strokeWidth={13} />
          <circle
            cx={120}
            cy={120}
            r={102}
            fill="none"
            stroke={colors.primary}
            strokeWidth={13}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 102 * 0.28} ${2 * Math.PI * 102}`}
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
            gap: 8,
          }}
        >
          <ScanSearch size={50} color={colors.primary} strokeWidth={1.8} />
          <span
            style={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: 36,
              color: colors.textPrimary,
            }}
          >
            {percent}%
          </span>
        </div>
      </div>

      <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
        {STEPS.map((step, i) => {
          const stepStart = 12 + i * 34;
          const stepDone = stepStart + 34;
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
                gap: 16,
                padding: '14px 24px',
                borderRadius: radius.md,
                backgroundColor: isDone
                  ? 'rgba(47, 133, 90, 0.10)'
                  : isActive
                    ? 'rgba(122, 106, 90, 0.10)'
                    : colors.surfaceMuted,
                border: `1px solid ${isDone ? colors.successSoft : colors.borderSoft}`,
                width: 640,
              }}
            >
              {isDone ? (
                <div style={{transform: `scale(${checkPop})`}}>
                  <CheckCircle2 size={28} color={colors.success} strokeWidth={2.2} />
                </div>
              ) : (
                <svg width={28} height={28} style={{transform: `rotate(${spinnerAngle}deg)`}}>
                  <circle
                    cx={14}
                    cy={14}
                    r={11}
                    fill="none"
                    stroke={isActive ? colors.primary : colors.border}
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray="52 70"
                  />
                </svg>
              )}
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: isActive || isDone ? 600 : 400,
                  fontSize: 24,
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
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

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

  // Pulsos de dados fluindo da embalagem para o painel (fase de leitura)
  const scanLocal = frame - SCAN_IN;
  const dots = [0, 1, 2].map((i) => {
    const p = ((scanLocal - i * 16 + 48) % 48) / 48;
    return {p, visible: scanLocal > i * 16};
  });

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 52}}>
        <Eyebrow delay={2}>Engenharia reversa</Eyebrow>
      </AbsoluteFill>

      {/* Fase 1 — pergunta + produto genérico */}
      {frame < SCAN_IN ? (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            gap: 44,
            opacity: introOpacity,
            paddingTop: 30,
          }}
        >
          <AnimatedText
            text="Não sabe como um produto do mercado é feito?"
            delay={10}
            stagger={4}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 66,
              color: colors.textPrimary,
              maxWidth: 1300,
            }}
          />
          <GenericProduct delay={42} />
        </AbsoluteFill>
      ) : null}

      {/* Fase 2 — rótulo alimentando a plataforma */}
      {frame >= SCAN_IN && frame < PROCESS_IN ? (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: scanOpacity,
            paddingTop: 30,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 90}}>
            <GenericProduct delay={SCAN_IN} scale={0.94} />

            {/* Conector com pulsos */}
            <div style={{position: 'relative', width: 150, height: 8}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 4,
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
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      backgroundColor: colors.primary,
                      boxShadow: '0 0 18px rgba(122,106,90,0.6)',
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

      {/* Fase 3 — processamento */}
      {frame >= PROCESS_IN && frame < RESULT_IN ? (
        <AbsoluteFill
          style={{alignItems: 'center', justifyContent: 'center', opacity: processOpacity}}
        >
          <ReverseProcessing delay={PROCESS_IN + 4} />
        </AbsoluteFill>
      ) : null}

      {/* Fase 4 — composição estimada */}
      {frame >= RESULT_IN ? (
        <AbsoluteFill
          style={{alignItems: 'center', justifyContent: 'center', paddingTop: 36, gap: 30}}
        >
          <AnimatedText
            text="Engenharia reversa de fórmulas"
            delay={RESULT_IN + 4}
            stagger={4}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 64,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: colors.primary,
            }}
          />

          <div
            style={{
              opacity: resultIn,
              transform: `translateY(${(1 - resultIn) * 44}px)`,
              width: 900,
              borderRadius: radius.shell,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              boxShadow: shadows.shell,
              padding: '34px 44px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: 28,
                  color: colors.textPrimary,
                }}
              >
                Composição estimada
              </span>
              <Pill bg={colors.primarySoft} color={colors.primary} fontSize={19}>
                <Sparkles size={19} color={colors.primary} />
                Reconstrução coerente
              </Pill>
            </div>
            {ESTIMATED.map((item, i) => (
              <GaugeBar
                key={item.label}
                label={item.label}
                valueLabel={item.value}
                fraction={item.fraction}
                color={item.color}
                delay={RESULT_IN + 22 + i * 9}
                width={810}
              />
            ))}
          </div>

          {/* Disclaimer discreto */}
          <div
            style={{
              fontFamily: fontBody,
              fontSize: 19,
              color: colors.textMuted,
              opacity:
                0.85 *
                interpolate(frame - RESULT_IN, [90, 110], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              maxWidth: 1200,
              textAlign: 'center',
            }}
          >
            O resultado é uma estimativa técnica baseada nas informações declaradas no
            rótulo, não uma fórmula exata do fabricante.
          </div>
        </AbsoluteFill>
      ) : null}
    </SceneBackground>
  );
};
