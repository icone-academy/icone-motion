import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
} from 'remotion';
import {AUTHOR_FPS, useAuthoredFrame} from '../timeline';
import {
  ArrowRight,
  BookOpen,
  Database,
  FlaskConical,
  Scale,
  ShoppingCart,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {SceneFade} from '../components/SceneFade';
import {AnimatedText} from '../components/AnimatedText';
import {colors, radius, shadows, tracking, type} from '../theme';
import {fontBody, fontDisplay} from '../fonts';
import {useCopy} from '../i18n/LocaleContext';
import type {Copy} from '../i18n/copy';

/**
 * Cena 2 — Impacto da marca ICone + convergência das capacidades
 * (formulação, balanceamento, conhecimento, ingredientes) em
 * uma única plataforma para gelato artesanal e industrial.
 */

const IMPACT_PEAK = 40;
const PILLARS_IN = 55;
const CONVERGE_START = 115;
const CONVERGE_END = 185;
const LOCKUP_HOLD = 205;
const PLATFORM_IN = 220;

const PILLAR_META = [
  {
    icon: FlaskConical,
    angle: -0.9,
    radius: 380,
    bg: colors.primarySoft,
    color: colors.primary,
  },
  {
    icon: Scale,
    angle: 0.55,
    radius: 400,
    bg: colors.infoSoft,
    color: colors.info,
  },
  {
    icon: BookOpen,
    angle: 2.4,
    radius: 390,
    bg: colors.successSoft,
    color: colors.success,
  },
  {
    icon: Database,
    angle: 3.9,
    radius: 410,
    bg: '#F5F3FF',
    color: colors.pacViolet,
  },
] as const;

type PillarItem = (typeof PILLAR_META)[number] & {label: string};

const getPillars = (c: Copy): PillarItem[] =>
  PILLAR_META.map((meta, i) => ({
    ...meta,
    label: c.scene02.orbitingPillars[i],
  }));

const CENTER = {x: 960, y: 460};

const ImpactRings: React.FC = () => {
  const frame = useAuthoredFrame();

  return (
    <>
      {[0, 1, 2].map((i) => {
        const delay = 4 + i * 10;
        const progress = interpolate(frame - delay, [0, 50], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const size = 180 + progress * (420 + i * 160);
        const opacity = interpolate(progress, [0, 0.2, 1], [0, 0.55, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: CENTER.x,
              top: CENTER.y,
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              borderRadius: '50%',
              border: `2px solid ${colors.primary}`,
              opacity,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </>
  );
};

const BrandCore: React.FC<{scaleBoost?: number; compact?: boolean}> = ({
  scaleBoost = 1,
  compact = false,
}) => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const c = useCopy();

  const slam = spring({
    frame: frame - 10,
    fps,
    config: {damping: 12, stiffness: 140, mass: 0.85},
  });

  const glowPulse = 0.4 + 0.6 * Math.sin(frame / 14);
  const logoSize = compact ? 120 : 260;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: compact ? 6 : 12,
        transform: `scale(${(0.7 + slam * 0.3) * scaleBoost})`,
        opacity: slam,
      }}
    >
      <div style={{position: 'relative', width: logoSize, height: logoSize}}>
        <div
          style={{
            position: 'absolute',
            inset: -logoSize * 0.4,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${colors.primarySoft} 0%, transparent 70%)`,
            opacity: 0.35 + glowPulse * 0.35,
          }}
        />
        <Img
          src={staticFile('brand/logo-light-transparent.png')}
          style={{
            width: logoSize,
            height: logoSize,
            objectFit: 'contain',
            position: 'relative',
            zIndex: 1,
          }}
        />
      </div>
      {!compact ? (
        <>
          <div
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 130,
              letterSpacing: '0.2em',
              color: colors.textPrimary,
              marginTop: 4,
            }}
          >
            {c.brand.name}
          </div>
          <div
            style={{
              fontFamily: fontDisplay,
              fontWeight: 500,
              fontSize: 48,
              letterSpacing: tracking.industrial,
              textTransform: 'uppercase',
              color: colors.primary,
            }}
          >
            {c.brand.tagline}
          </div>
        </>
      ) : null}
    </div>
  );
};

const ConvergingPillar: React.FC<PillarItem & {index: number}> = ({
  icon: Icon,
  label,
  angle,
  radius: orbitR,
  bg,
  color,
  index,
}) => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const enter = spring({
    frame: frame - PILLARS_IN - index * 10,
    fps,
    config: {damping: 14, stiffness: 120, mass: 0.75},
  });

  // Órbita lenta antes da convergência
  const orbitAngle = angle + (frame - PILLARS_IN) / 110;

  const converge = interpolate(
    frame,
    [CONVERGE_START + index * 6, CONVERGE_END],
    [0, 1],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const eased = 1 - Math.pow(1 - converge, 3);
  const r = orbitR * (1 - eased);

  const x = CENTER.x + Math.cos(orbitAngle) * r;
  const y = CENTER.y + Math.sin(orbitAngle) * r * 0.72;

  // Some ao entrar no núcleo
  const fadeAtCenter = interpolate(eased, [0.75, 1], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${enter * (0.85 + 0.15 * fadeAtCenter)})`,
        opacity: enter * fadeAtCenter,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        zIndex: 6,
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          border: `2px solid ${color}`,
          boxShadow: shadows.shell,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: radius.md,
            backgroundColor: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={44} color={color} strokeWidth={1.9} />
        </div>
      </div>
      <span
        style={{
          fontFamily: fontBody,
          fontWeight: 700,
          fontSize: 30,
          color: colors.textPrimary,
          backgroundColor: 'rgba(248,246,242,0.92)',
          padding: '8px 18px',
          borderRadius: 22,
          border: `1px solid ${colors.border}`,
          whiteSpace: 'nowrap',
          boxShadow: shadows.sm,
        }}
      >
        {label}
      </span>
    </div>
  );
};

const MODULE_META = [
  {icon: FlaskConical, bg: colors.primarySoft, color: colors.primary},
  {icon: Scale, bg: colors.infoSoft, color: colors.info},
  {icon: BookOpen, bg: colors.successSoft, color: colors.success},
  {icon: Database, bg: '#F5F3FF', color: colors.pacViolet},
  {icon: ShoppingCart, bg: colors.warningSoft, color: colors.warning},
] as const;

const UnifiedPlatform: React.FC<{delay: number}> = ({delay}) => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const c = useCopy();

  const modules = MODULE_META.map((meta, i) => ({
    ...meta,
    label: c.scene02.modules[i],
  }));

  const rise = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, stiffness: 85},
  });

  return (
    <div
      style={{
        opacity: rise,
        transform: `translateY(${(1 - rise) * 80}px) scale(${0.96 + rise * 0.04})`,
        width: 1840,
        borderRadius: radius.shell,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.shell,
        overflow: 'hidden',
      }}
    >
      {/* Topbar com marca */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 28px',
          borderBottom: `1px solid ${colors.borderSoft}`,
          backgroundColor: colors.surfaceMuted,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <Img
            src={staticFile('brand/logo-light-transparent.png')}
            style={{width: 56, height: 56, objectFit: 'contain'}}
          />
          <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <span
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: 36,
                letterSpacing: '0.14em',
                color: colors.textPrimary,
              }}
            >
              {c.brand.name}
            </span>
            <span
              style={{
                fontFamily: fontBody,
                fontSize: 20,
                color: colors.primary,
                fontWeight: 500,
              }}
            >
              {c.brand.tagline}
            </span>
          </div>
        </div>
        <div
          style={{
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 22,
            color: colors.textMuted,
            padding: '12px 22px',
            borderRadius: 24,
            backgroundColor: colors.primarySoft,
            border: `1px solid ${colors.borderSoft}`,
          }}
        >
          {c.scene02.singlePlatform}
        </div>
      </div>

      {/* Hero da plataforma */}
      <div
        style={{
          margin: '20px 20px 24px',
          borderRadius: radius.lg,
          background: `linear-gradient(125deg, ${colors.primary} 0%, ${colors.primaryHover} 55%, #5C4E42 100%)`,
          padding: '44px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 40,
          boxShadow: shadows.md,
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 1180, flex: 1}}>
          <span
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 26,
              letterSpacing: tracking.industrial,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.75)',
            }}
          >
            {c.scene02.platformHeroEyebrow}
          </span>
          <span
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 68,
              color: colors.textInverse,
              lineHeight: 1.12,
            }}
          >
            {c.scene02.platformHeroTitle}
          </span>
          <span
            style={{
              fontFamily: fontBody,
              fontSize: 36,
              color: 'rgba(255,255,255,0.82)',
            }}
          >
            {c.scene02.platformHeroSubtitle}
          </span>
        </div>
        <Img
          src={staticFile('brand/logo-dark-transparent.png')}
          style={{width: 140, height: 140, objectFit: 'contain', opacity: 0.95, flexShrink: 0}}
        />
      </div>

      {/* Módulos unificados */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 18,
          padding: '0 20px 28px',
        }}
      >
        {modules.map((mod, i) => {
          const cardIn = spring({
            frame: frame - delay - 20 - i * 6,
            fps,
            config: {damping: 14, stiffness: 140, mass: 0.65},
          });
          return (
            <div
              key={mod.label}
              style={{
                opacity: cardIn,
                transform: `translateY(${(1 - cardIn) * 28}px)`,
                borderRadius: radius.lg,
                border: `1px solid ${colors.border}`,
                backgroundColor: colors.surface,
                boxShadow: shadows.sm,
                padding: '30px 22px',
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: radius.md,
                  backgroundColor: mod.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <mod.icon size={40} color={mod.color} strokeWidth={2} />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: fontBody,
                    fontWeight: 600,
                    fontSize: 30,
                    color: colors.textPrimary,
                  }}
                >
                  {mod.label}
                </span>
                <ArrowRight size={24} color={colors.primaryMuted} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Scene02: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const c = useCopy();
  const pillars = getPillars(c);

  // Flash taupe no impacto inicial
  const flash = interpolate(frame, [0, 8, 28], [0.35, 0.12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Burst quando os pilares convergem
  const mergeBurst = interpolate(
    frame,
    [CONVERGE_END - 8, CONVERGE_END + 6, CONVERGE_END + 30],
    [0, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const brandPhaseOpacity = interpolate(
    frame,
    [PLATFORM_IN - 22, PLATFORM_IN],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const brandScale = interpolate(
    frame,
    [LOCKUP_HOLD, PLATFORM_IN],
    [1, 0.85],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const taglineIn = spring({
    frame: frame - 40,
    fps,
    config: {damping: 200, stiffness: 100},
  });

  const convergeLabel = interpolate(
    frame,
    [CONVERGE_START - 10, CONVERGE_START + 10, CONVERGE_END, CONVERGE_END + 16],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const afterMergeCopy = interpolate(
    frame,
    [CONVERGE_END + 8, CONVERGE_END + 14, PLATFORM_IN - 10, PLATFORM_IN],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <SceneFade fadeOut={20} exitToScale={0.985}>
      <SceneBackground>
      {/* Flash de impacto */}
      <AbsoluteFill
        style={{
          backgroundColor: colors.primary,
          opacity: flash,
          pointerEvents: 'none',
          zIndex: 30,
        }}
      />

      {/* Fase marca + convergência */}
      {frame < PLATFORM_IN + 5 ? (
        <AbsoluteFill style={{opacity: brandPhaseOpacity}}>
          <ImpactRings />

          {/* Pilares orbitando → convergindo */}
          {frame >= PILLARS_IN - 5
            ? pillars.map((pillar, i) => (
                <ConvergingPillar key={pillar.label} {...pillar} index={i} />
              ))
            : null}

          {/* Núcleo da marca */}
          <div
            style={{
              position: 'absolute',
              left: CENTER.x,
              top: CENTER.y,
              transform: `translate(-50%, -50%) scale(${brandScale * (1 + mergeBurst * 0.12)})`,
              zIndex: 10,
            }}
          >
            {/* Halo de fusão */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: 260 + mergeBurst * 180,
                height: 260 + mergeBurst * 180,
                marginLeft: -(130 + mergeBurst * 90),
                marginTop: -(130 + mergeBurst * 90),
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(122,106,90,${0.2 + mergeBurst * 0.35}) 0%, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />
            <BrandCore />
          </div>

          {/* Copy durante a convergência */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 120,
              textAlign: 'center',
              opacity: convergeLabel,
            }}
          >
            <span
              style={{
                fontFamily: fontBody,
                fontWeight: 500,
                fontSize: 48,
                color: colors.textSecondary,
                backgroundColor: 'rgba(248,246,242,0.9)',
                padding: '16px 32px',
                borderRadius: radius.md,
                border: `1px solid ${colors.border}`,
              }}
            >
              {c.scene02.convergingCaption}
            </span>
          </div>

          {/* Lockup pós-fusão */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 100,
              textAlign: 'center',
              opacity: afterMergeCopy,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <AnimatedText
              text={c.scene02.singlePlatform}
              delay={CONVERGE_END + 10}
              stagger={3}
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: type.title,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: colors.primary,
              }}
            />
            <div
              style={{
                fontFamily: fontBody,
                fontSize: type.body,
                color: colors.textMuted,
                opacity: taglineIn,
              }}
            >
              {c.scene02.developedFor}
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Fase plataforma unificada */}
      {frame >= PLATFORM_IN - 8 ? (
        <AbsoluteFill
          style={{alignItems: 'center', justifyContent: 'center', paddingTop: 20}}
        >
          <UnifiedPlatform delay={PLATFORM_IN} />
        </AbsoluteFill>
      ) : null}
      </SceneBackground>
    </SceneFade>
  );
};
