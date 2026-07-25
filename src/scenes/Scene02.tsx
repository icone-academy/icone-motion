import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  ArrowRight,
  Database,
  LayoutGrid,
  Scale,
  ShoppingCart,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {LogoReveal} from '../components/LogoReveal';
import {AnimatedText} from '../components/AnimatedText';
import {colors, radius, shadows, tracking} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 2 (0:15–0:28) — Reveal do logotipo ICone + transição
 * para representação estilizada do dashboard (home).
 */

const BRAND_OUT = 205; // início da transição para o dashboard
const DASH_IN = 225;

const MODULES = [
  {icon: Scale, label: 'Balanceamento', bg: colors.primarySoft, color: colors.primary},
  {icon: Database, label: 'Ingredientes', bg: '#F5F3FF', color: colors.pacViolet},
  {icon: ShoppingCart, label: 'Compras', bg: colors.warningSoft, color: colors.warning},
];

const MiniDashboard: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const rise = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, stiffness: 90},
  });

  return (
    <div
      style={{
        opacity: rise,
        transform: `translateY(${(1 - rise) * 90}px) scale(${0.96 + rise * 0.04})`,
        width: 1360,
        height: 640,
        borderRadius: radius.shell,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.shell,
        display: 'grid',
        gridTemplateColumns: '220px 1fr',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar estilizada */}
      <div
        style={{
          backgroundColor: colors.surfaceMuted,
          borderRight: `1px solid ${colors.borderSoft}`,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
          }}
        >
          <LayoutGrid size={22} color={colors.primary} />
          <span
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 20,
              letterSpacing: tracking.wide,
              color: colors.textPrimary,
            }}
          >
            ICONE
          </span>
        </div>
        {[0.9, 0.7, 0.8, 0.6, 0.75].map((w, i) => {
          const barIn = spring({
            frame: frame - delay - 8 - i * 4,
            fps,
            config: {damping: 200, stiffness: 120},
          });
          return (
            <div
              key={i}
              style={{
                height: 16,
                width: `${w * 100 * barIn}%`,
                borderRadius: 8,
                backgroundColor: i === 0 ? colors.primarySoft : colors.borderSoft,
                border: i === 0 ? `1px solid ${colors.primaryMuted}` : 'none',
              }}
            />
          );
        })}
      </div>

      {/* Conteúdo */}
      <div style={{padding: 32, display: 'flex', flexDirection: 'column', gap: 24}}>
        {/* Hero */}
        <div
          style={{
            height: 200,
            borderRadius: radius.lg,
            background: `linear-gradient(120deg, #DCE3EA 0%, #C9D4DE 55%, ${colors.primarySoft} 100%)`,
            padding: '32px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 18,
              letterSpacing: tracking.industrial,
              textTransform: 'uppercase',
              color: colors.primary,
            }}
          >
            Inteligência para Gelato
          </span>
          <span
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 44,
              color: colors.textPrimary,
            }}
          >
            Bem-vindo à ICone
          </span>
        </div>

        {/* Cards de módulos */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20}}>
          {MODULES.map((mod, i) => {
            const cardIn = spring({
              frame: frame - delay - 18 - i * 7,
              fps,
              config: {damping: 15, stiffness: 130, mass: 0.7},
            });
            return (
              <div
                key={mod.label}
                style={{
                  opacity: cardIn,
                  transform: `translateY(${(1 - cardIn) * 34}px)`,
                  borderRadius: radius.lg,
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.surface,
                  boxShadow: shadows.sm,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: radius.md,
                    backgroundColor: mod.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <mod.icon size={28} color={mod.color} strokeWidth={2} />
                </div>
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
                      fontWeight: 600,
                      fontSize: 24,
                      color: colors.textPrimary,
                    }}
                  >
                    {mod.label}
                  </span>
                  <ArrowRight size={22} color={colors.primaryMuted} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Scene02: React.FC = () => {
  const frame = useCurrentFrame();

  const brandOpacity = interpolate(frame, [BRAND_OUT, BRAND_OUT + 18], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const brandLift = interpolate(frame, [BRAND_OUT, BRAND_OUT + 18], [0, -60], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneBackground>
      {/* Fase A — marca */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: brandOpacity,
          transform: `translateY(${brandLift}px)`,
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
          <LogoReveal delay={8} size={260} variant="light" />
          <AnimatedText
            text="ICONE"
            delay={34}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 110,
              letterSpacing: '0.18em',
              color: colors.textPrimary,
              marginTop: 12,
            }}
          />
          <AnimatedText
            text="Inteligência para Gelato"
            delay={56}
            stagger={3}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 400,
              fontSize: 36,
              letterSpacing: tracking.industrial,
              textTransform: 'uppercase',
              color: colors.primary,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Fase B — dashboard estilizado */}
      {frame >= DASH_IN - 10 ? (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <MiniDashboard delay={DASH_IN} />
        </AbsoluteFill>
      ) : null}
    </SceneBackground>
  );
};
