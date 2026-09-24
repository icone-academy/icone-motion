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
import {fontBody, fontDisplay} from '../../fonts';
import {colors, shadows, tracking} from '../../theme';
import type {Campaign01V3Format} from './types';

export const motionClamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export type Campaign01V3Layout = {
  compact: boolean;
  horizontal: boolean;
  safeTop: number;
  safeBottom: number;
  paddingX: number;
  contentWidth: number;
  hero: number;
  title: number;
  lead: number;
  body: number;
  cardPadding: number;
};

export const useCampaign01V3Layout = (
  format: Campaign01V3Format,
): Campaign01V3Layout => {
  if (format === 'horizontal') {
    return {
      compact: false,
      horizontal: true,
      safeTop: 66,
      safeBottom: 66,
      paddingX: 120,
      contentWidth: 1480,
      hero: 84,
      title: 62,
      lead: 30,
      body: 23,
      cardPadding: 32,
    };
  }

  if (format === 'square') {
    return {
      compact: true,
      horizontal: false,
      safeTop: 62,
      safeBottom: 64,
      paddingX: 62,
      contentWidth: 930,
      hero: 70,
      title: 54,
      lead: 26,
      body: 20,
      cardPadding: 24,
    };
  }

  return {
    compact: false,
    horizontal: false,
    safeTop: 176,
    safeBottom: 252,
    paddingX: 62,
    contentWidth: 880,
    hero: 96,
    title: 64,
    lead: 31,
    body: 24,
    cardPadding: 30,
  };
};

export const useCampaign01V3Entrance = (delay = 0, stiffness = 105) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return spring({
    frame: frame - delay,
    fps,
    config: {damping: 19, stiffness, mass: 0.82},
  });
};

export const Campaign01V3Background: React.FC<{
  dark?: boolean;
  accent?: boolean;
}> = ({dark = false, accent = false}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const driftX = Math.sin(frame * 0.012) * 24;
  const driftY = Math.cos(frame * 0.01) * 27;

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: dark
          ? 'linear-gradient(158deg, #2E241F 0%, #4B3B32 52%, #766354 100%)'
          : accent
            ? 'linear-gradient(158deg, #F0E8DE 0%, #FBF9F5 52%, #E9DED1 100%)'
            : `linear-gradient(158deg, ${colors.background} 0%, #F1EAE1 56%, #FCFBF8 100%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: Math.max(width, height) * 0.74,
          height: Math.max(width, height) * 0.74,
          left: -width * 0.32 + driftX,
          top: -height * 0.22 + driftY,
          borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(255,255,255,.12), rgba(255,255,255,0) 68%)'
            : 'radial-gradient(circle, rgba(163,144,125,.22), rgba(163,144,125,0) 69%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: Math.max(width, height) * 0.58,
          height: Math.max(width, height) * 0.58,
          right: -width * 0.27 - driftX,
          bottom: -height * 0.2 - driftY,
          borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(239,232,223,.12), rgba(239,232,223,0) 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,.98), rgba(255,255,255,0) 70%)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: dark ? 0.04 : 0.022,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(63,48,40,.75) 0, rgba(63,48,40,.75) 1px, transparent 1px, transparent 5px)',
          mixBlendMode: 'soft-light',
        }}
      />
    </AbsoluteFill>
  );
};

export const Campaign01V3Stage: React.FC<{
  children: React.ReactNode;
  format: Campaign01V3Format;
  dark?: boolean;
  accent?: boolean;
}> = ({children, format, dark = false, accent = false}) => {
  const layout = useCampaign01V3Layout(format);

  return (
    <AbsoluteFill>
      <Campaign01V3Background dark={dark} accent={accent} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: `${layout.safeTop}px ${layout.paddingX}px ${layout.safeBottom}px`,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: layout.contentWidth,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            margin: '0 auto',
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Campaign01V3TopLogo: React.FC<{
  format: Campaign01V3Format;
  dark: boolean;
}> = ({format, dark}) => {
  const layout = useCampaign01V3Layout(format);
  const enter = useCampaign01V3Entrance(5, 118);
  const size = layout.horizontal ? 72 : layout.compact ? 70 : 84;
  const top = layout.horizontal ? 34 : layout.compact ? 34 : 98;

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 30,
        top,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        opacity: enter,
        transform: `translateY(${(1 - enter) * -12}px)`,
      }}
    >
      <Img
        src={staticFile(
          dark ? 'brand/logo-dark-transparent.png' : 'brand/logo-light-transparent.png',
        )}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          filter: dark
            ? 'drop-shadow(0 8px 18px rgba(0,0,0,.20))'
            : 'drop-shadow(0 7px 14px rgba(63,48,40,.10))',
        }}
      />
    </div>
  );
};

export const Campaign01V3Eyebrow: React.FC<{
  children: React.ReactNode;
  compact: boolean;
  dark?: boolean;
}> = ({children, compact, dark = false}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: compact ? 10 : 14,
      color: dark ? 'rgba(255,255,255,.74)' : colors.primary,
      fontFamily: fontBody,
      fontSize: compact ? 12 : 15,
      fontWeight: 760,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
    }}
  >
    <span
      style={{
        display: 'block',
        width: compact ? 25 : 38,
        height: 1,
        backgroundColor: dark ? 'rgba(255,255,255,.32)' : 'rgba(122,106,90,.42)',
      }}
    />
    {children}
    <span
      style={{
        display: 'block',
        width: compact ? 25 : 38,
        height: 1,
        backgroundColor: dark ? 'rgba(255,255,255,.32)' : 'rgba(122,106,90,.42)',
      }}
    />
  </div>
);

export const Campaign01V3Headline: React.FC<{
  children: React.ReactNode;
  size: number;
  dark?: boolean;
  maxWidth?: number;
}> = ({children, size, dark = false, maxWidth}) => (
  <div
    style={{
      maxWidth,
      fontFamily: fontDisplay,
      fontSize: size,
      fontWeight: 700,
      lineHeight: 0.94,
      letterSpacing: '-0.028em',
      color: dark ? colors.textInverse : colors.textPrimary,
      textAlign: 'center',
    }}
  >
    {children}
  </div>
);

export const Campaign01V3Body: React.FC<{
  children: React.ReactNode;
  size: number;
  dark?: boolean;
  maxWidth?: number;
}> = ({children, size, dark = false, maxWidth = 760}) => (
  <div
    style={{
      maxWidth,
      fontFamily: fontBody,
      fontSize: size,
      fontWeight: 500,
      lineHeight: 1.42,
      color: dark ? 'rgba(255,255,255,.72)' : '#4C566A',
      textAlign: 'center',
    }}
  >
    {children}
  </div>
);

export const Campaign01V3Card: React.FC<{
  children: React.ReactNode;
  compact: boolean;
  padding?: number;
}> = ({children, compact, padding}) => (
  <div
    style={{
      width: '100%',
      padding: padding ?? (compact ? 22 : 30),
      borderRadius: compact ? 24 : 30,
      border: `1px solid ${colors.border}`,
      backgroundColor: 'rgba(255,255,255,.95)',
      boxShadow: '0 30px 86px rgba(63,48,40,.14)',
      boxSizing: 'border-box',
    }}
  >
    {children}
  </div>
);

export const fontStyles = {fontBody, fontDisplay};
