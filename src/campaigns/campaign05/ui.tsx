import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ArrowRight, Check, Sparkles} from 'lucide-react';
import {fontBody, fontDisplay} from '../../fonts';
import {tracking} from '../../theme';
import type {
  Campaign05CaptionCue,
  Campaign05Format,
} from './types';
import {campaign05Frame} from './timeline';

export const campaign05Palette = {
  ink: '#211914',
  inkLift: '#34271F',
  paper: '#F7F2EA',
  paperLift: '#FFFDF9',
  taupe: '#7A6A5A',
  taupeSoft: '#E9DED1',
  coral: '#EC6A5D',
  coralSoft: '#F9D8D2',
  saffron: '#E5A43A',
  saffronSoft: '#F8E6BC',
  teal: '#15977B',
  tealSoft: '#D4F0E8',
  blue: '#3C78C4',
  blueSoft: '#DCE9F8',
  violet: '#7558C7',
  violetSoft: '#E9E1FA',
  green: '#2F855A',
  greenSoft: '#E8F5EE',
  danger: '#C2410C',
  dangerSoft: '#FCEEE8',
  white: '#FFFFFF',
  muted: '#75685F',
  line: 'rgba(73,55,45,.14)',
} as const;

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

export type Campaign05Layout = {
  horizontal: boolean;
  vertical: boolean;
  square: boolean;
  paddingX: number;
  safeTop: number;
  safeBottom: number;
  contentWidth: number;
  hero: number;
  title: number;
  lead: number;
  body: number;
  label: number;
  caption: number;
};

export const useCampaign05Layout = (format: Campaign05Format): Campaign05Layout => {
  if (format === 'horizontal') {
    return {
      horizontal: true,
      vertical: false,
      square: false,
      paddingX: 104,
      safeTop: 68,
      safeBottom: 68,
      contentWidth: 1710,
      hero: 106,
      title: 68,
      lead: 32,
      body: 25,
      label: 18,
      caption: 25,
    };
  }

  if (format === 'square') {
    return {
      horizontal: false,
      vertical: false,
      square: true,
      paddingX: 56,
      safeTop: 56,
      safeBottom: 64,
      contentWidth: 968,
      hero: 76,
      title: 53,
      lead: 27,
      body: 21,
      label: 15,
      caption: 22,
    };
  }

  return {
    horizontal: false,
    vertical: true,
    square: false,
    paddingX: 58,
    safeTop: 176,
    safeBottom: 250,
    contentWidth: 964,
    hero: 101,
    title: 69,
    lead: 33,
    body: 26,
    label: 18,
    caption: 30,
  };
};

export const useCampaign05Enter = (delay = 0, stiffness = 98) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness, mass: 0.8},
  });
};

export const Campaign05Ambient: React.FC<{
  mode?: 'paper' | 'ink' | 'teal';
  accent?: string;
}> = ({mode = 'paper', accent = campaign05Palette.coral}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const dark = mode !== 'paper';
  const driftX = Math.sin(frame * 0.012) * width * 0.035;
  const driftY = Math.cos(frame * 0.009) * height * 0.03;
  const scan = interpolate(frame % 150, [0, 150], [-12, 112]);

  const background =
    mode === 'paper'
      ? `radial-gradient(circle at 16% 10%, ${accent}24, transparent 29%), radial-gradient(circle at 84% 88%, ${campaign05Palette.teal}18, transparent 31%), linear-gradient(145deg, ${campaign05Palette.paperLift}, ${campaign05Palette.paper})`
      : mode === 'teal'
        ? `radial-gradient(circle at 72% 18%, ${campaign05Palette.saffron}25, transparent 25%), linear-gradient(145deg, #0E6A5B, #073E37)`
        : `radial-gradient(circle at 18% 16%, ${accent}26, transparent 28%), radial-gradient(circle at 84% 84%, ${campaign05Palette.violet}21, transparent 30%), linear-gradient(145deg, ${campaign05Palette.inkLift}, ${campaign05Palette.ink})`;

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{background}} />
      <div
        style={{
          position: 'absolute',
          width: width * 0.54,
          height: width * 0.54,
          borderRadius: '50%',
          border: `1px solid ${dark ? 'rgba(255,255,255,.10)' : 'rgba(73,55,45,.08)'}`,
          left: -width * 0.2 + driftX,
          top: -width * 0.17 + driftY,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: width * 0.25,
          height: width * 0.25,
          borderRadius: '50%',
          border: `1px solid ${dark ? 'rgba(255,255,255,.08)' : 'rgba(73,55,45,.07)'}`,
          right: -width * 0.07 - driftX,
          bottom: -width * 0.06 - driftY,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: dark ? 0.14 : 0.09,
          backgroundImage: `linear-gradient(${dark ? 'rgba(255,255,255,.08)' : 'rgba(73,55,45,.08)'} 1px, transparent 1px), linear-gradient(90deg, ${dark ? 'rgba(255,255,255,.08)' : 'rgba(73,55,45,.08)'} 1px, transparent 1px)`,
          backgroundSize: `${Math.max(54, width / 20)}px ${Math.max(54, width / 20)}px`,
          maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${scan}%`,
          height: 2,
          opacity: dark ? 0.15 : 0.07,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 24px ${accent}`,
        }}
      />
    </AbsoluteFill>
  );
};

export const Campaign05Scene: React.FC<{
  children: React.ReactNode;
  format: Campaign05Format;
  duration: number;
  mode?: 'paper' | 'ink' | 'teal';
  accent?: string;
  fade?: number;
}> = ({children, format, duration, mode = 'paper', accent, fade = 12}) => {
  const frame = useCurrentFrame();
  const layout = useCampaign05Layout(format);
  const opacity = interpolate(
    frame,
    [0, fade, Math.max(fade + 1, duration - fade), duration],
    [0, 1, 1, 0],
    clamp,
  );

  return (
    <AbsoluteFill style={{opacity, color: mode === 'paper' ? campaign05Palette.ink : campaign05Palette.white}}>
      <Campaign05Ambient mode={mode} accent={accent} />
      <div
        style={{
          position: 'absolute',
          left: layout.paddingX,
          right: layout.paddingX,
          top: layout.safeTop,
          bottom: layout.safeBottom,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{width: '100%', maxWidth: layout.contentWidth, height: '100%'}}>{children}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Campaign05Eyebrow: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
  accent?: string;
}> = ({children, dark = false, accent = campaign05Palette.coral}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 11,
      fontFamily: fontBody,
      fontSize: 15,
      fontWeight: 800,
      letterSpacing: tracking.industrial,
      textTransform: 'uppercase',
      color: dark ? 'rgba(255,255,255,.72)' : campaign05Palette.muted,
    }}
  >
    <span style={{width: 25, height: 3, borderRadius: 2, background: accent}} />
    {children}
  </div>
);

export const Campaign05BrandMark: React.FC<{dark?: boolean; compact?: boolean}> = ({
  dark = false,
  compact = false,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: compact ? 10 : 14,
      padding: compact ? '8px 12px' : '10px 15px',
      borderRadius: compact ? 15 : 19,
      background: dark ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.84)',
      border: `1px solid ${dark ? 'rgba(255,255,255,.16)' : campaign05Palette.line}`,
      boxShadow: dark ? 'none' : '0 12px 35px rgba(73,55,45,.10)',
    }}
  >
    <Img
      src={staticFile(dark ? 'brand/logo-dark-transparent.png' : 'brand/logo-light-transparent.png')}
      style={{width: compact ? 34 : 42, height: compact ? 34 : 42, objectFit: 'contain'}}
    />
    <div>
      <div
        style={{
          fontFamily: fontDisplay,
          fontSize: compact ? 19 : 23,
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: tracking.wide,
          color: dark ? campaign05Palette.white : campaign05Palette.ink,
        }}
      >
        ICONE
      </div>
      <div
        style={{
          marginTop: 3,
          fontFamily: fontBody,
          fontSize: compact ? 8 : 10,
          fontWeight: 700,
          letterSpacing: tracking.industrial,
          textTransform: 'uppercase',
          color: dark ? 'rgba(255,255,255,.62)' : campaign05Palette.muted,
        }}
      >
        Inteligência para Gelato
      </div>
    </div>
  </div>
);

export const Campaign05Window: React.FC<{
  children: React.ReactNode;
  title: string;
  badge?: string;
  accent?: string;
  style?: React.CSSProperties;
}> = ({children, title, badge, accent = campaign05Palette.teal, style}) => (
  <div
    style={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 27,
      border: `1px solid ${campaign05Palette.line}`,
      background: 'rgba(255,255,255,.96)',
      boxShadow: '0 30px 80px rgba(73,55,45,.17)',
      ...style,
    }}
  >
    <div
      style={{
        height: 57,
        padding: '0 21px',
        borderBottom: `1px solid ${campaign05Palette.line}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: campaign05Palette.paperLift,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 11}}>
        <div style={{display: 'flex', gap: 6}}>
          {[campaign05Palette.coral, campaign05Palette.saffron, campaign05Palette.teal].map((color) => (
            <span key={color} style={{width: 8, height: 8, borderRadius: '50%', background: color}} />
          ))}
        </div>
        <span
          style={{
            fontFamily: fontBody,
            fontSize: 13,
            fontWeight: 800,
            color: campaign05Palette.ink,
            letterSpacing: tracking.wide,
          }}
        >
          {title}
        </span>
      </div>
      {badge ? (
        <span
          style={{
            padding: '7px 11px',
            borderRadius: 12,
            background: `${accent}18`,
            color: accent,
            fontFamily: fontBody,
            fontSize: 11,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: tracking.wide,
          }}
        >
          {badge}
        </span>
      ) : null}
    </div>
    {children}
  </div>
);

const HighlightedText: React.FC<{
  text: string;
  emphasis?: string;
  accent?: string;
}> = ({text, emphasis, accent = campaign05Palette.saffron}) => {
  if (!emphasis) return <>{text}</>;
  const index = text.toLocaleLowerCase('pt-BR').indexOf(emphasis.toLocaleLowerCase('pt-BR'));
  if (index < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <span style={{color: accent}}>{text.slice(index, index + emphasis.length)}</span>
      {text.slice(index + emphasis.length)}
    </>
  );
};

export const Campaign05CaptionTrack: React.FC<{
  cues: Campaign05CaptionCue[];
  format: Campaign05Format;
  dark?: boolean;
}> = ({cues, format, dark = true}) => {
  const frame = useCurrentFrame();
  const layout = useCampaign05Layout(format);
  const seconds = frame / useVideoConfig().fps;
  const cue = cues.find((item) => seconds >= item.from && seconds < item.to);
  if (!cue) return null;

  const localFrame = frame - campaign05Frame(cue.from);
  const cueDuration = campaign05Frame(cue.to - cue.from);
  const opacity = Math.min(
    interpolate(localFrame, [0, 6], [0, 1], clamp),
    interpolate(localFrame, [Math.max(7, cueDuration - 6), cueDuration], [1, 0], clamp),
  );

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 50,
        left: format === 'horizontal' ? '14%' : layout.paddingX + 12,
        right: format === 'horizontal' ? '14%' : layout.paddingX + 12,
        bottom: format === 'vertical' ? 118 : format === 'square' ? 38 : 34,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          maxWidth: format === 'horizontal' ? 1230 : 920,
          padding: format === 'vertical' ? '17px 22px' : '12px 20px',
          borderRadius: format === 'vertical' ? 19 : 17,
          background: dark ? 'rgba(20,15,12,.84)' : 'rgba(255,253,249,.92)',
          border: `1px solid ${dark ? 'rgba(255,255,255,.13)' : campaign05Palette.line}`,
          boxShadow: '0 14px 38px rgba(22,16,13,.16)',
          backdropFilter: 'blur(10px)',
          color: dark ? campaign05Palette.white : campaign05Palette.ink,
          fontFamily: fontBody,
          fontSize: layout.caption,
          fontWeight: 700,
          lineHeight: 1.25,
          textAlign: 'center',
        }}
      >
        <HighlightedText text={cue.text} emphasis={cue.emphasis} accent={campaign05Palette.saffron} />
      </div>
    </div>
  );
};

export const Campaign05CtaButton: React.FC<{compact?: boolean}> = ({compact = false}) => {
  const enter = useCampaign05Enter(10, 112);
  const frame = useCurrentFrame();
  const pulse = 0.96 + Math.sin(frame * 0.08) * 0.025;
  return (
    <div
      style={{
        height: compact ? 56 : 66,
        padding: compact ? '0 24px' : '0 31px',
        borderRadius: compact ? 18 : 21,
        background: campaign05Palette.saffron,
        color: campaign05Palette.ink,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? 9 : 13,
        fontFamily: fontBody,
        fontSize: compact ? 18 : 22,
        fontWeight: 850,
        boxShadow: `0 18px 48px ${campaign05Palette.saffron}42`,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 16}px) scale(${pulse * (0.92 + enter * 0.08)})`,
      }}
    >
      Comece grátis <ArrowRight size={compact ? 20 : 24} strokeWidth={2.7} />
    </div>
  );
};

export const Campaign05VerifiedPill: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '9px 13px',
      borderRadius: 14,
      background: campaign05Palette.greenSoft,
      color: campaign05Palette.green,
      fontFamily: fontBody,
      fontSize: 13,
      fontWeight: 800,
    }}
  >
    <Check size={16} strokeWidth={2.6} /> {children}
  </div>
);

export const Campaign05Audio: React.FC<{
  voiceoverFile?: string;
  musicFile?: string;
  muted?: boolean;
}> = ({voiceoverFile, musicFile, muted = false}) => {
  if (muted) return null;

  return (
    <>
      {musicFile ? <Audio src={staticFile(musicFile)} volume={0.16} /> : null}
      {voiceoverFile ? <Audio src={staticFile(voiceoverFile)} volume={1} /> : null}
    </>
  );
};

export const Campaign05SparkBadge: React.FC<{label: string}> = ({label}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 9,
      padding: '10px 15px',
      borderRadius: 16,
      background: campaign05Palette.violetSoft,
      color: campaign05Palette.violet,
      fontFamily: fontBody,
      fontSize: 14,
      fontWeight: 800,
    }}
  >
    <Sparkles size={17} /> {label}
  </div>
);
