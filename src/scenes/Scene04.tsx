import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  BadgeCheck,
  ExternalLink,
  FileText,
  Link2,
  ShieldCheck,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {AnimatedText} from '../components/AnimatedText';
import {Pill} from '../components/Pill';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 4 (0:50–1:05) — Campo "Fonte": selos USDA, TBCA, TACO e
 * Fabricantes + status de validação. "Dados documentados e rastreáveis".
 */

const SOURCES = [
  {name: 'USDA', full: 'FoodData Central'},
  {name: 'TBCA', full: 'Tabela Brasileira'},
  {name: 'TACO', full: 'Unicamp'},
  {name: 'Fabricantes', full: 'Fichas técnicas'},
];

const SourceSeal: React.FC<{name: string; full: string; delay: number}> = ({
  name,
  full,
  delay,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const pop = spring({
    frame: frame - delay,
    fps,
    config: {damping: 11, stiffness: 160, mass: 0.7},
  });
  const checkPop = spring({
    frame: frame - delay - 10,
    fps,
    config: {damping: 10, stiffness: 220, mass: 0.5},
  });

  return (
    <div
      style={{
        opacity: Math.min(1, pop * 1.4),
        transform: `scale(${0.7 + pop * 0.3}) translateY(${(1 - pop) * 20}px)`,
        width: 270,
        borderRadius: radius.lg,
        border: `1.5px solid ${colors.border}`,
        backgroundColor: colors.surface,
        boxShadow: shadows.md,
        padding: '30px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -16,
          right: -16,
          transform: `scale(${checkPop})`,
          width: 44,
          height: 44,
          borderRadius: '50%',
          backgroundColor: colors.success,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: shadows.md,
        }}
      >
        <BadgeCheck size={26} color={colors.textInverse} strokeWidth={2.2} />
      </div>
      <div
        style={{
          width: 74,
          height: 74,
          borderRadius: '50%',
          backgroundColor: colors.primarySoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FileText size={34} color={colors.primary} strokeWidth={1.9} />
      </div>
      <span
        style={{
          fontFamily: fontDisplay,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: '0.06em',
          color: colors.textPrimary,
        }}
      >
        {name}
      </span>
      <span style={{fontFamily: fontBody, fontSize: 19, color: colors.textMuted}}>
        {full}
      </span>
    </div>
  );
};

export const Scene04: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const panelIn = spring({
    frame: frame - 10,
    fps,
    config: {damping: 200, stiffness: 90},
  });

  return (
    <SceneBackground>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          gap: 40,
          paddingTop: 20,
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
          <Eyebrow delay={4}>Origem dos dados</Eyebrow>

          {/* Barra de validação (tab Fonte) */}
          <div
            style={{
              opacity: panelIn,
              transform: `translateY(${(1 - panelIn) * 30}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              backgroundColor: colors.surface,
              border: `1.5px solid ${colors.success}`,
              borderRadius: radius.lg,
              boxShadow: shadows.md,
              padding: '18px 32px',
            }}
          >
            <ShieldCheck size={38} color={colors.success} strokeWidth={2} />
            <span
              style={{
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: 28,
                color: colors.textPrimary,
              }}
            >
              Campo Fonte
            </span>
            <Pill bg={colors.successSoft} color="#166534" border={colors.success} fontSize={20}>
              <BadgeCheck size={20} color="#166534" />
              Validado · 12/07/2026
            </Pill>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: fontBody,
                fontSize: 19,
                color: colors.textMuted,
              }}
            >
              <Link2 size={19} color={colors.textMuted} />
              3 referências
              <ExternalLink size={17} color={colors.textMuted} />
            </span>
          </div>
        </div>

        {/* Selos das fontes */}
        <div style={{display: 'flex', gap: 34}}>
          {SOURCES.map((source, i) => (
            <SourceSeal key={source.name} {...source} delay={60 + i * 22} />
          ))}
        </div>

        {/* Texto de fechamento */}
        <div style={{textAlign: 'center', maxWidth: 1200}}>
          <AnimatedText
            text="Dados documentados e rastreáveis"
            delay={190}
            stagger={5}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 66,
              color: colors.primary,
            }}
          />
          <div
            style={{
              marginTop: 20,
              fontFamily: fontBody,
              fontSize: 27,
              color: colors.textMuted,
              opacity: interpolate(frame, [230, 252], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            Mais confiabilidade, coerência e rastreabilidade aos cálculos.
          </div>
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
