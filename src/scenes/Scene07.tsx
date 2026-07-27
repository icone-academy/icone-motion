import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useVideoConfig,
} from 'remotion';
import {AUTHOR_FPS, T, useAuthoredFrame} from '../timeline';
import {CheckCircle2, FlaskConical, Leaf, Milk, Snowflake, Wheat} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {AnimatedText} from '../components/AnimatedText';
import {Pill} from '../components/Pill';
import {GaugeBar} from '../components/GaugeBar';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 7 — Módulo de neutros: partículas orbitam e convergem
 * no centro; depois, composição com doses e compatibilidade.
 */

const CONVERGE_START = 120;
const CONVERGE_END = 210;
const BLEND_POP = 200;
const DETAILS_IN = 260;

const PARTICLES = [
  {icon: Leaf, angle: 0.1, r: 400, tint: colors.success, label: 'LBG'},
  {icon: Wheat, angle: 1.0, r: 440, tint: colors.warning, label: 'Guar'},
  {icon: Snowflake, angle: 1.9, r: 380, tint: colors.info, label: 'Carragena'},
  {icon: Milk, angle: 2.8, r: 450, tint: colors.primaryMuted, label: 'Emulsificante'},
  {icon: Leaf, angle: 3.7, r: 410, tint: colors.pacViolet, label: 'Tara'},
  {icon: Wheat, angle: 4.6, r: 370, tint: colors.sugarPink, label: 'Xantana'},
  {icon: Snowflake, angle: 5.4, r: 430, tint: colors.gaugeBlue, label: 'CMC'},
];

const Particle: React.FC<(typeof PARTICLES)[number] & {index: number}> = ({
  icon: Icon,
  angle,
  r,
  tint,
  label,
  index,
}) => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const enter = spring({
    frame: frame - 8 - index * 6,
    fps,
    config: {damping: 14, stiffness: 120, mass: 0.8},
  });

  const orbitAngle = angle + frame / 90;

  const converge = interpolate(frame, [CONVERGE_START + index * 6, CONVERGE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const eased = 1 - Math.pow(1 - converge, 3);
  const radius_ = r * (1 - eased);

  // Órbita circular em torno da origem (0,0) do stage centralizado
  const x = Math.cos(orbitAngle) * radius_;
  const y = Math.sin(orbitAngle) * radius_;

  const fadeAtCenter = interpolate(eased, [0.82, 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${enter * (0.75 + 0.25 * fadeAtCenter)})`,
        opacity: enter * fadeAtCenter,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div
        style={{
          width: 118,
          height: 118,
          borderRadius: '50%',
          backgroundColor: colors.surface,
          border: `2.5px solid ${tint}`,
          boxShadow: shadows.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={54} color={tint} strokeWidth={1.9} />
      </div>
      <span
        style={{
          fontFamily: fontBody,
          fontWeight: 600,
          fontSize: 22,
          color: colors.textSecondary,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const Scene07: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const blendPop = spring({
    frame: frame - BLEND_POP,
    fps,
    config: {damping: 11, stiffness: 130, mass: 0.9},
  });
  const blendGlow = 0.5 + 0.5 * Math.sin(frame / 18);

  const detailsIn = spring({
    frame: frame - DETAILS_IN,
    fps,
    config: {damping: 200, stiffness: 90},
  });

  // Stage desliza para a esquerda quando o painel de detalhes entra
  const stageShift = interpolate(detailsIn, [0, 1], [0, -340]);

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 40, gap: 12}}>
        <Eyebrow delay={2} fontSize={36}>
          Módulo de Neutros
        </Eyebrow>
        <AnimatedText
          text="Combinações personalizadas de estabilizantes e emulsionantes"
          delay={14}
          stagger={2}
          style={{
            fontFamily: fontBody,
            fontWeight: 500,
            fontSize: 36,
            color: colors.textMuted,
            maxWidth: 1400,
            textAlign: 'center',
          }}
        />
      </AbsoluteFill>

      {/* Origem central da tela — partículas e blend orbitam/convergem aqui */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '54%',
          width: 0,
          height: 0,
          transform: `translateX(${stageShift}px)`,
        }}
      >
        {PARTICLES.map((particle, i) => (
          <Particle key={`${particle.label}-${i}`} {...particle} index={i} />
        ))}

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translate(-50%, -50%) scale(${blendPop})`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: `linear-gradient(145deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
              boxShadow: `0 20px 60px rgba(63,48,40,0.25), 0 0 ${44 + blendGlow * 34}px rgba(122,106,90,${0.25 + blendGlow * 0.2})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FlaskConical size={108} color={colors.textInverse} strokeWidth={1.6} />
          </div>
          <Pill
            bg={colors.primarySoft}
            color={colors.primary}
            fontSize={26}
            style={{padding: '10px 22px'}}
          >
            Neutro personalizado
          </Pill>
        </div>
      </div>

      {/* Painel de composição do blend */}
      <div
        style={{
          position: 'absolute',
          left: 1040,
          top: 250,
          opacity: detailsIn,
          transform: `translateX(${(1 - detailsIn) * 60}px)`,
          width: 720,
          borderRadius: radius.shell,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.shell,
          padding: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <span
          style={{
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: 36,
            color: colors.textPrimary,
          }}
        >
          Neutro Base Branca v2
        </span>
        <GaugeBar
          label="LBG (alfarroba)"
          valueLabel="40%"
          fraction={0.4}
          color={colors.success}
          delay={DETAILS_IN + 12}
          width={640}
        />
        <GaugeBar
          label="Guar"
          valueLabel="30%"
          fraction={0.3}
          color={colors.warning}
          delay={DETAILS_IN + 20}
          width={640}
        />
        <GaugeBar
          label="Carragena"
          valueLabel="20%"
          fraction={0.2}
          color={colors.info}
          delay={DETAILS_IN + 28}
          width={640}
        />
        <GaugeBar
          label="Mono e diglicerídeos"
          valueLabel="10%"
          fraction={0.1}
          color={colors.primaryMuted}
          delay={DETAILS_IN + 36}
          width={640}
        />

        <div style={{display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap'}}>
          <Pill
            bg={colors.successSoft}
            color={colors.success}
            fontSize={22}
            style={{
              padding: '10px 18px',
              opacity: interpolate(frame - DETAILS_IN - 48, [0, 10], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <CheckCircle2 size={22} color={colors.success} />
            Compatibilidade alta
          </Pill>
          <Pill
            bg={colors.primarySoft}
            color={colors.primary}
            fontSize={22}
            style={{
              padding: '10px 18px',
              opacity: interpolate(frame - DETAILS_IN - 56, [0, 10], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            Dose recomendada · 4,5 g/kg
          </Pill>
        </div>
      </div>
    </SceneBackground>
  );
};
