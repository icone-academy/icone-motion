import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {Globe, Sparkles} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {LogoReveal} from '../components/LogoReveal';
import {AnimatedText} from '../components/AnimatedText';
import {Pill} from '../components/Pill';
import {colors, radius, shadows, tracking} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 11 — Encerramento: logo centralizado, marca
 * "ICone — Inteligência para Gelato", CTA de lançamento e
 * QR code real apontando para https://icone.academy.
 */

export const Scene11: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const ctaPop = spring({
    frame: frame - 96,
    fps,
    config: {damping: 12, stiffness: 130, mass: 0.8},
  });
  const ctaGlow = 0.5 + 0.5 * Math.sin(frame / 16);

  const contactsIn = spring({
    frame: frame - 130,
    fps,
    config: {damping: 200, stiffness: 100},
  });

  const launchIn = interpolate(frame, [160, 180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 22}}>
        <LogoReveal delay={6} size={190} variant="light" />

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
          <AnimatedText
            text="ICONE"
            delay={22}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 84,
              letterSpacing: '0.18em',
              color: colors.textPrimary,
            }}
          />
          <AnimatedText
            text="Inteligência para Gelato"
            delay={36}
            stagger={3}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 400,
              fontSize: 32,
              letterSpacing: tracking.industrial,
              textTransform: 'uppercase',
              color: colors.primary,
            }}
          />
          <AnimatedText
            text="Uma nova forma de formular, corrigir e criar gelato profissional"
            delay={52}
            stagger={2}
            style={{
              fontFamily: fontBody,
              fontWeight: 400,
              fontSize: 28,
              color: colors.textMuted,
              maxWidth: 1100,
              marginTop: 6,
            }}
          />
        </div>

        {/* CTA */}
        <div
          style={{
            transform: `scale(${ctaPop})`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            backgroundColor: colors.primary,
            color: colors.textInverse,
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 31,
            padding: '20px 52px',
            borderRadius: radius.md,
            boxShadow: `0 8px 24px rgba(63,48,40,${0.15 + ctaGlow * 0.1}), 0 0 ${30 + ctaGlow * 24}px rgba(122,106,90,${0.2 + ctaGlow * 0.15})`,
          }}
        >
          <Sparkles size={30} color={colors.textInverse} />
          Garanta seu acesso antecipado
        </div>

        {/* Site + QR code */}
        <div
          style={{
            opacity: contactsIn,
            transform: `translateY(${(1 - contactsIn) * 30}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 40,
            marginTop: 4,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: 28,
              color: colors.textSecondary,
            }}
          >
            <Globe size={28} color={colors.primary} />
            icone.academy
          </div>
          <div
            style={{
              borderRadius: radius.md,
              border: `1.5px solid ${colors.border}`,
              backgroundColor: colors.surface,
              boxShadow: shadows.sm,
              padding: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Img
              src={staticFile('brand/qr-icone-academy.png')}
              style={{width: 118, height: 118, borderRadius: radius.sm}}
            />
            <span style={{fontFamily: fontBody, fontSize: 14, color: colors.textMuted}}>
              Aponte a câmera
            </span>
          </div>
        </div>

        {/* Lançamento */}
        <div style={{opacity: launchIn}}>
          <Pill
            bg={colors.primarySoft}
            color={colors.primary}
            border={colors.primaryMuted}
            fontSize={24}
            style={{
              fontFamily: fontDisplay,
              letterSpacing: tracking.wide,
              textTransform: 'uppercase',
              padding: '12px 32px',
            }}
          >
            Lançamento · 15 de agosto de 2026
          </Pill>
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
