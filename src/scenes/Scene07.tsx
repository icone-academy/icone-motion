import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {CheckCircle2, FlaskConical, Leaf, Milk, Snowflake, Wheat} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {AnimatedText} from '../components/AnimatedText';
import {Pill} from '../components/Pill';
import {GaugeBar} from '../components/GaugeBar';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 7 (1:48–2:08) — Módulo de neutros: partículas
 * (estabilizantes/emulsionantes) orbitam e convergem em um
 * blend central; depois, composição com doses e compatibilidade.
 */

const CONVERGE_START = 120;
const CONVERGE_END = 210;
const BLEND_POP = 200;
const DETAILS_IN = 260;

const CENTER = {x: 960, y: 470};

const PARTICLES = [
  {icon: Leaf, angle: 0.1, r: 380, tint: colors.success, label: 'LBG'},
  {icon: Wheat, angle: 1.0, r: 420, tint: colors.warning, label: 'Guar'},
  {icon: Snowflake, angle: 1.9, r: 360, tint: colors.info, label: 'Carragena'},
  {icon: Milk, angle: 2.8, r: 430, tint: colors.primaryMuted, label: 'Emulsificante'},
  {icon: Leaf, angle: 3.7, r: 390, tint: colors.pacViolet, label: 'Tara'},
  {icon: Wheat, angle: 4.6, r: 350, tint: colors.sugarPink, label: 'Xantana'},
  {icon: Snowflake, angle: 5.4, r: 410, tint: colors.gaugeBlue, label: 'CMC'},
];

const Particle: React.FC<(typeof PARTICLES)[number] & {index: number}> = ({
  icon: Icon,
  angle,
  r,
  tint,
  label,
  index,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - 8 - index * 6,
    fps,
    config: {damping: 14, stiffness: 120, mass: 0.8},
  });

  // Órbita lenta antes da convergência
  const orbitAngle = angle + frame / 90;

  // Convergência: raio → 0
  const converge = interpolate(frame, [CONVERGE_START + index * 6, CONVERGE_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const eased = 1 - Math.pow(1 - converge, 3);
  const radius_ = r * (1 - eased);

  const x = CENTER.x + Math.cos(orbitAngle) * radius_;
  const y = CENTER.y + Math.sin(orbitAngle) * radius_ * 0.62;

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
        gap: 8,
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: '50%',
          backgroundColor: colors.surface,
          border: `2px solid ${tint}`,
          boxShadow: shadows.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={42} color={tint} strokeWidth={1.9} />
      </div>
      <span
        style={{
          fontFamily: fontBody,
          fontWeight: 600,
          fontSize: 19,
          color: colors.textSecondary,
        }}
      >
        {label}
      </span>
    </div>
  );
};

export const Scene07: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

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

  // O blend desliza para a esquerda quando os detalhes entram
  const blendShift = interpolate(detailsIn, [0, 1], [0, -330]);

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 50, gap: 10}}>
        <Eyebrow delay={2}>Módulo de Neutros</Eyebrow>
        <AnimatedText
          text="Combinações personalizadas de estabilizantes e emulsionantes"
          delay={14}
          stagger={2}
          style={{
            fontFamily: fontBody,
            fontWeight: 500,
            fontSize: 30,
            color: colors.textMuted,
            maxWidth: 1200,
          }}
        />
      </AbsoluteFill>

      {/* Partículas orbitando e convergindo */}
      {PARTICLES.map((particle, i) => (
        <Particle key={i} {...particle} index={i} />
      ))}

      {/* Blend central */}
      <div
        style={{
          position: 'absolute',
          left: CENTER.x + blendShift,
          top: CENTER.y,
          transform: `translate(-50%, -50%) scale(${blendPop})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 190,
            height: 190,
            borderRadius: '50%',
            background: `linear-gradient(145deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
            boxShadow: `0 20px 60px rgba(63,48,40,0.25), 0 0 ${40 + blendGlow * 30}px rgba(122,106,90,${0.25 + blendGlow * 0.2})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FlaskConical size={86} color={colors.textInverse} strokeWidth={1.6} />
        </div>
        <Pill bg={colors.primarySoft} color={colors.primary} fontSize={22}>
          Neutro personalizado
        </Pill>
      </div>

      {/* Painel de composição do blend */}
      <div
        style={{
          position: 'absolute',
          left: 1010,
          top: 300,
          opacity: detailsIn,
          transform: `translateX(${(1 - detailsIn) * 60}px)`,
          width: 620,
          borderRadius: radius.shell,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.shell,
          padding: 36,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        <span
          style={{
            fontFamily: fontDisplay,
            fontWeight: 600,
            fontSize: 30,
            color: colors.textPrimary,
          }}
        >
          Neutro Base Branca v2
        </span>
        <GaugeBar label="LBG (alfarroba)" valueLabel="40%" fraction={0.4} color={colors.success} delay={DETAILS_IN + 12} width={548} />
        <GaugeBar label="Guar" valueLabel="30%" fraction={0.3} color={colors.warning} delay={DETAILS_IN + 20} width={548} />
        <GaugeBar label="Carragena" valueLabel="20%" fraction={0.2} color={colors.info} delay={DETAILS_IN + 28} width={548} />
        <GaugeBar label="Mono e diglicerídeos" valueLabel="10%" fraction={0.1} color={colors.primaryMuted} delay={DETAILS_IN + 36} width={548} />

        <div style={{display: 'flex', gap: 14, marginTop: 6}}>
          <Pill
            bg={colors.successSoft}
            color={colors.success}
            fontSize={19}
            style={{
              opacity: interpolate(frame - DETAILS_IN - 48, [0, 10], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            <CheckCircle2 size={19} color={colors.success} />
            Compatibilidade alta
          </Pill>
          <Pill
            bg={colors.primarySoft}
            color={colors.primary}
            fontSize={19}
            style={{
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
