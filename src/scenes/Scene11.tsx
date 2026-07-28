import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
} from 'remotion';
import {AUTHOR_FPS, useAuthoredFrame} from '../timeline';
import {Globe, Sparkles} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {LogoReveal} from '../components/LogoReveal';
import {AnimatedText} from '../components/AnimatedText';
import {Pill} from '../components/Pill';
import {colors, radius, shadows, tracking, type} from '../theme';
import {fontBody, fontDisplay} from '../fonts';
import {useCopy} from '../i18n/LocaleContext';

/**
 * Cena 11 — Encerramento: logo, marca, CTA de lançamento e QR.
 */

export const Scene11: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const c = useCopy();

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
        <LogoReveal delay={6} size={220} variant="light" />

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
          <AnimatedText
            text={c.brand.name}
            delay={22}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: type.display,
              letterSpacing: '0.18em',
              color: colors.textPrimary,
            }}
          />
          <AnimatedText
            text={c.brand.tagline}
            delay={36}
            stagger={3}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 400,
              fontSize: type.displaySub,
              letterSpacing: tracking.industrial,
              textTransform: 'uppercase',
              color: colors.primary,
            }}
          />
          <AnimatedText
            text={c.scene11.headline}
            delay={52}
            stagger={2}
            style={{
              fontFamily: fontBody,
              fontWeight: 400,
              fontSize: type.lead,
              color: colors.textMuted,
              maxWidth: 1100,
              marginTop: 6,
            }}
          />
        </div>

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
            fontSize: type.cta,
            padding: '24px 58px',
            borderRadius: radius.md,
            boxShadow: `0 8px 24px rgba(63,48,40,${0.15 + ctaGlow * 0.1}), 0 0 ${30 + ctaGlow * 24}px rgba(122,106,90,${0.2 + ctaGlow * 0.15})`,
          }}
        >
          <Sparkles size={30} color={colors.textInverse} />
          {c.scene11.cta}
        </div>

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
              fontSize: type.body,
              color: colors.textSecondary,
            }}
          >
            <Globe size={28} color={colors.primary} />
            {c.scene11.site}
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
              style={{width: 150, height: 150, borderRadius: radius.sm}}
            />
            <span style={{fontFamily: fontBody, fontSize: type.caption, color: colors.textMuted}}>
              {c.scene11.qrHint}
            </span>
          </div>
        </div>

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
            {c.scene11.launch}
          </Pill>
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
