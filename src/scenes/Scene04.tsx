import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
} from 'remotion';
import {AUTHOR_FPS, useAuthoredFrame} from '../timeline';
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
import {useCopy} from '../i18n/LocaleContext';

/**
 * Cena 4 (0:50–1:05) — Campo "Fonte": selos USDA, TBCA, TACO e
 * Fabricantes + status de validação. "Dados documentados e rastreáveis".
 */

const SourceSeal: React.FC<{
  name: string;
  full: string;
  delay: number;
  compact?: boolean;
}> = ({name, full, delay, compact = false}) => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

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

  const width = compact ? 280 : 340;
  const nameSize = compact ? 40 : 52;
  const iconBox = compact ? 80 : 96;
  const iconSize = compact ? 40 : 46;

  return (
    <div
      style={{
        opacity: Math.min(1, pop * 1.4),
        transform: `scale(${0.7 + pop * 0.3}) translateY(${(1 - pop) * 20}px)`,
        width,
        borderRadius: radius.lg,
        border: `1.5px solid ${colors.border}`,
        backgroundColor: colors.surface,
        boxShadow: shadows.md,
        padding: compact ? '32px 22px' : '40px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -18,
          right: -18,
          transform: `scale(${checkPop})`,
          width: compact ? 48 : 56,
          height: compact ? 48 : 56,
          borderRadius: '50%',
          backgroundColor: colors.success,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: shadows.md,
        }}
      >
        <BadgeCheck
          size={compact ? 28 : 32}
          color={colors.textInverse}
          strokeWidth={2.2}
        />
      </div>
      <div
        style={{
          width: iconBox,
          height: iconBox,
          borderRadius: '50%',
          backgroundColor: colors.primarySoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FileText size={iconSize} color={colors.primary} strokeWidth={1.9} />
      </div>
      <span
        style={{
          fontFamily: fontDisplay,
          fontWeight: 700,
          fontSize: nameSize,
          letterSpacing: '0.06em',
          color: colors.textPrimary,
          textAlign: 'center',
        }}
      >
        {name}
      </span>
      <span
        style={{
          fontFamily: fontBody,
          fontSize: compact ? 22 : 26,
          color: colors.textMuted,
          textAlign: 'center',
        }}
      >
        {full}
      </span>
    </div>
  );
};

export const Scene04: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const c = useCopy();

  const panelIn = spring({
    frame: frame - 10,
    fps,
    config: {damping: 200, stiffness: 90},
  });

  return (
    <SceneBackground>
      {/* Header no topo */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 48,
          pointerEvents: 'none',
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14}}>
          <Eyebrow delay={4} fontSize={36}>
            {c.scene04.eyebrow}
          </Eyebrow>

          <div
            style={{
              opacity: panelIn,
              transform: `translateY(${(1 - panelIn) * 30}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              backgroundColor: colors.surface,
              border: `1.5px solid ${colors.success}`,
              borderRadius: radius.lg,
              boxShadow: shadows.md,
              padding: '22px 36px',
            }}
          >
            <ShieldCheck size={46} color={colors.success} strokeWidth={2} />
            <span
              style={{
                fontFamily: fontBody,
                fontWeight: 700,
                fontSize: 40,
                color: colors.textPrimary,
              }}
            >
              {c.scene04.fieldSource}
            </span>
            <Pill bg={colors.successSoft} color="#166534" border={colors.success} fontSize={24}>
              <BadgeCheck size={24} color="#166534" />
              {c.scene04.validated}
            </Pill>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: fontBody,
                fontSize: 24,
                color: colors.textMuted,
              }}
            >
              <Link2 size={24} color={colors.textMuted} />
              {c.scene04.referencesCount}
              <ExternalLink size={22} color={colors.textMuted} />
            </span>
          </div>
        </div>
      </AbsoluteFill>

      {/* Cards centralizados */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{display: 'flex', gap: c.scene04.seals.length > 4 ? 20 : 32}}>
          {c.scene04.seals.map((source, i) => (
            <SourceSeal
              key={source.name}
              {...source}
              delay={60 + i * 18}
              compact={c.scene04.seals.length > 4}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* Texto de fechamento embaixo */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingBottom: 56,
        }}
      >
        <div style={{textAlign: 'center', maxWidth: 1400}}>
          <AnimatedText
            text={c.scene04.closingTitle}
            delay={190}
            stagger={5}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 88,
              color: colors.primary,
            }}
          />
          <div
            style={{
              marginTop: 22,
              fontFamily: fontBody,
              fontSize: 40,
              color: colors.textMuted,
              opacity: interpolate(frame, [230, 252], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            {c.scene04.closingSubtitle}
          </div>
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
