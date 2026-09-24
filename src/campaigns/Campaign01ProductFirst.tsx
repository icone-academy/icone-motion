import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Check,
  FlaskConical,
  SlidersHorizontal,
  Store,
} from 'lucide-react';
import {fontBody, fontDisplay} from '../fonts';
import {colors, shadows, tracking} from '../theme';

export const CAMPAIGN_01_PRODUCT_FIRST_FPS = 30;
export const CAMPAIGN_01_PRODUCT_FIRST_DURATION =
  CAMPAIGN_01_PRODUCT_FIRST_FPS * 15;

export type Campaign01ProductFirstFormat =
  | 'vertical'
  | 'square'
  | 'horizontal';

export type Campaign01ProductFirstProps = {
  format: Campaign01ProductFirstFormat;
  voiceoverFile?: string | null;
  withSfx?: boolean;
};

const BEATS = {
  hook: {from: 0, duration: 120},
  diagnosis: {from: 120, duration: 150},
  adjust: {from: 270, duration: 105},
  cta: {from: 375, duration: 75},
} as const;

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

type Layout = {
  compact: boolean;
  horizontal: boolean;
  paddingX: number;
  safeTop: number;
  safeBottom: number;
  contentWidth: number;
  hero: number;
  title: number;
  lead: number;
  body: number;
};

const useLayout = (format: Campaign01ProductFirstFormat): Layout => {
  if (format === 'horizontal') {
    return {
      compact: false,
      horizontal: true,
      paddingX: 108,
      safeTop: 70,
      safeBottom: 70,
      contentWidth: 1660,
      hero: 98,
      title: 68,
      lead: 30,
      body: 24,
    };
  }

  if (format === 'square') {
    return {
      compact: true,
      horizontal: false,
      paddingX: 58,
      safeTop: 62,
      safeBottom: 64,
      contentWidth: 964,
      hero: 76,
      title: 55,
      lead: 27,
      body: 21,
    };
  }

  return {
    compact: false,
    horizontal: false,
    paddingX: 58,
    safeTop: 178,
    safeBottom: 258,
    contentWidth: 964,
    hero: 104,
    title: 66,
    lead: 32,
    body: 25,
  };
};

const useEntrance = (delay = 0, stiffness = 105) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness, mass: 0.78},
  });
};

const Background: React.FC<{dark?: boolean}> = ({dark = false}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const driftX = Math.sin(frame * 0.018) * 28;
  const driftY = Math.cos(frame * 0.014) * 34;

  return (
    <AbsoluteFill
      style={{
        overflow: 'hidden',
        background: dark
          ? `linear-gradient(150deg, ${colors.textPrimary} 0%, #625044 54%, ${colors.primary} 100%)`
          : `linear-gradient(155deg, ${colors.background} 0%, #F0E8DE 58%, #FBF9F5 100%)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: Math.max(width, height) * 0.78,
          height: Math.max(width, height) * 0.78,
          borderRadius: '50%',
          left: -width * 0.35 + driftX,
          top: -height * 0.18 + driftY,
          background: dark
            ? 'radial-gradient(circle, rgba(255,255,255,.14), rgba(255,255,255,0) 68%)'
            : 'radial-gradient(circle, rgba(163,144,125,.30), rgba(163,144,125,0) 68%)',
          filter: 'blur(4px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: Math.max(width, height) * 0.64,
          height: Math.max(width, height) * 0.64,
          borderRadius: '50%',
          right: -width * 0.32 - driftX,
          bottom: -height * 0.18 - driftY,
          background: dark
            ? 'radial-gradient(circle, rgba(239,232,223,.12), rgba(239,232,223,0) 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,.96), rgba(255,255,255,0) 70%)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: dark ? 0.045 : 0.026,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(63,48,40,.8) 0, rgba(63,48,40,.8) 1px, transparent 1px, transparent 5px)',
          mixBlendMode: 'soft-light',
        }}
      />
    </AbsoluteFill>
  );
};

const Scene: React.FC<{
  children: React.ReactNode;
  format: Campaign01ProductFirstFormat;
  duration: number;
  dark?: boolean;
  fadeIn?: number;
  fadeOut?: number;
}> = ({children, format, duration, dark = false, fadeIn = 0, fadeOut = 0}) => {
  const frame = useCurrentFrame();
  const layout = useLayout(format);
  const opacityIn =
    fadeIn > 0 ? interpolate(frame, [0, fadeIn], [0, 1], clamp) : 1;
  const opacityOut =
    fadeOut > 0
      ? interpolate(
          frame,
          [Math.max(fadeIn + 1, duration - fadeOut), duration],
          [1, 0],
          clamp,
        )
      : 1;

  return (
    <AbsoluteFill style={{opacity: Math.min(opacityIn, opacityOut)}}>
      <Background dark={dark} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: `${layout.safeTop}px ${layout.paddingX}px ${layout.safeBottom}px`,
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: layout.contentWidth,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ProductSignature: React.FC<{
  format: Campaign01ProductFirstFormat;
  dark?: boolean;
}> = ({format, dark = false}) => {
  const layout = useLayout(format);
  const enter = useEntrance(0, 120);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: layout.compact ? 12 : 15,
        padding: layout.compact ? '10px 14px' : '12px 17px',
        borderRadius: 18,
        border: `1px solid ${dark ? 'rgba(255,255,255,.20)' : colors.border}`,
        backgroundColor: dark ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.82)',
        boxShadow: dark ? 'none' : shadows.sm,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -14}px)`,
      }}
    >
      <Img
        src={staticFile(
          dark ? 'brand/logo-dark-transparent.png' : 'brand/logo-light-transparent.png',
        )}
        style={{
          width: layout.compact ? 38 : 46,
          height: layout.compact ? 38 : 46,
          objectFit: 'contain',
        }}
      />
      <div style={{fontFamily: fontBody, lineHeight: 1.1}}>
        <div
          style={{
            fontWeight: 850,
            fontSize: layout.compact ? 18 : 21,
            color: dark ? colors.textInverse : colors.textPrimary,
          }}
        >
          ICone
        </div>
        <div
          style={{
            marginTop: 3,
            fontWeight: 650,
            fontSize: layout.compact ? 11 : 13,
            color: dark ? 'rgba(255,255,255,.70)' : colors.textMuted,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Software de balanceamento para gelato
        </div>
      </div>
    </div>
  );
};

const AudienceChip: React.FC<{compact: boolean}> = ({compact}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: compact ? '10px 15px' : '12px 19px',
      borderRadius: 18,
      backgroundColor: colors.primary,
      color: colors.textInverse,
      fontFamily: fontBody,
      fontWeight: 800,
      fontSize: compact ? 15 : 18,
      letterSpacing: tracking.wide,
      textTransform: 'uppercase',
      boxShadow: '0 14px 36px rgba(63,48,40,.18)',
    }}
  >
    <Store size={compact ? 18 : 21} strokeWidth={2.4} />
    Para gelaterias e sorveterias
  </div>
);

const RecipePreview: React.FC<{
  format: Campaign01ProductFirstFormat;
  compact?: boolean;
}> = ({format, compact = false}) => {
  const layout = useLayout(format);
  const enter = useEntrance(14, 92);
  const frame = useCurrentFrame();
  const float = Math.sin(frame * 0.045) * (layout.compact ? 2 : 5);
  const rows = [
    ['Morango fresco', '450 g'],
    ['Sacarose', '150 g'],
    ['Xarope de glicose', '25 g'],
  ] as const;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: layout.horizontal ? 780 : 870,
        padding: layout.compact || compact ? '22px 24px' : '29px 32px',
        borderRadius: layout.compact ? 25 : 31,
        border: `1px solid ${colors.border}`,
        backgroundColor: 'rgba(255,255,255,.94)',
        boxShadow: '0 30px 80px rgba(63,48,40,.16)',
        boxSizing: 'border-box',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 34 + float}px) scale(${0.97 + enter * 0.03})`,
        fontFamily: fontBody,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          marginBottom: layout.compact ? 15 : 20,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: layout.compact ? 29 : 38,
              color: colors.textPrimary,
            }}
          >
            Gelato de morango
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: layout.compact ? 14 : 17,
              color: colors.textMuted,
            }}
          >
            Receita em desenvolvimento
          </div>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: layout.compact ? '8px 10px' : '9px 13px',
            borderRadius: 14,
            backgroundColor: colors.warningSoft,
            color: colors.warning,
            fontWeight: 750,
            fontSize: layout.compact ? 13 : 16,
          }}
        >
          <AlertTriangle size={layout.compact ? 15 : 18} />
          Revisar equilíbrio
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.18fr .82fr',
          gap: layout.compact ? 18 : 25,
        }}
      >
        <div>
          {rows.map(([name, value], index) => (
            <div
              key={name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 12,
                padding: layout.compact ? '9px 0' : '12px 0',
                borderTop: `1px solid ${colors.borderSoft}`,
                fontSize: layout.compact ? 15 : 19,
              }}
            >
              <span style={{color: colors.textSecondary, fontWeight: 580}}>{name}</span>
              <span style={{color: colors.textPrimary, fontWeight: 760}}>{value}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            padding: layout.compact ? '13px 15px' : '17px 20px',
            borderRadius: 19,
            backgroundColor: colors.dangerSoft,
            border: '1px solid rgba(194,65,12,.18)',
          }}
        >
          <div
            style={{
              color: colors.danger,
              fontWeight: 800,
              fontSize: layout.compact ? 12 : 14,
              letterSpacing: tracking.wide,
              textTransform: 'uppercase',
            }}
          >
            Parâmetros
          </div>
          <div
            style={{
              marginTop: 9,
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: layout.compact ? 26 : 34,
              color: colors.textPrimary,
              lineHeight: 1,
            }}
          >
            Fora da faixa
          </div>
          <div
            style={{
              marginTop: 9,
              fontSize: layout.compact ? 13 : 16,
              color: colors.textSecondary,
              lineHeight: 1.35,
            }}
          >
            Veja o que precisa de atenção antes do lote.
          </div>
        </div>
      </div>
    </div>
  );
};

const HookScene: React.FC<{format: Campaign01ProductFirstFormat}> = ({format}) => {
  const layout = useLayout(format);
  const headlineIn = useEntrance(6, 112);
  const questionIn = useEntrance(19, 138);
  const supportIn = useEntrance(31, 105);

  return (
    <Scene format={format} duration={BEATS.hook.duration}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: layout.horizontal ? 'center' : 'stretch',
          justifyContent: 'center',
          gap: layout.horizontal ? 70 : layout.compact ? 22 : 34,
        }}
      >
        <div
          style={{
            flex: layout.horizontal ? '0 0 47%' : undefined,
            display: 'flex',
            flexDirection: 'column',
            alignItems: layout.horizontal ? 'flex-start' : 'center',
            textAlign: layout.horizontal ? 'left' : 'center',
            gap: layout.compact ? 15 : 20,
          }}
        >
          <ProductSignature format={format} />
          <div style={{opacity: headlineIn}}>
            <AudienceChip compact={layout.compact} />
          </div>
          <div
            style={{
              opacity: questionIn,
              transform: `translateY(${(1 - questionIn) * 24}px)`,
              fontFamily: fontDisplay,
              fontSize: layout.hero,
              lineHeight: 0.94,
              fontWeight: 700,
              letterSpacing: '-0.035em',
              color: colors.textPrimary,
              maxWidth: layout.horizontal ? 760 : 940,
            }}
          >
            SUA RECEITA ESTÁ
            <br />
            <span style={{color: colors.primary}}>EQUILIBRADA?</span>
          </div>
          <div
            style={{
              opacity: supportIn,
              transform: `translateY(${(1 - supportIn) * 16}px)`,
              fontFamily: fontBody,
              fontSize: layout.lead,
              lineHeight: 1.25,
              fontWeight: 650,
              color: colors.textSecondary,
            }}
          >
            Descubra antes do lote.
          </div>
        </div>
        <div
          style={{
            flex: layout.horizontal ? 1 : undefined,
            width: '100%',
          }}
        >
          <RecipePreview format={format} compact={layout.horizontal} />
        </div>
      </div>
    </Scene>
  );
};

const parameterLabels = ['Água', 'Açúcares', 'PAC', 'POD', 'Sólidos'] as const;

const ParametersStrip: React.FC<{compact: boolean}> = ({compact}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: compact ? 7 : 10,
      }}
    >
      {parameterLabels.map((label, index) => {
        const enter = spring({
          frame: frame - 23 - index * 3,
          fps,
          config: {damping: 17, stiffness: 120, mass: 0.7},
        });
        return (
          <div
            key={label}
            style={{
              padding: compact ? '9px 5px' : '12px 7px',
              borderRadius: compact ? 12 : 15,
              border: `1px solid ${colors.border}`,
              backgroundColor: 'rgba(255,255,255,.86)',
              boxShadow: shadows.xs,
              opacity: enter,
              transform: `translateY(${(1 - enter) * 14}px)`,
              fontFamily: fontBody,
              fontSize: compact ? 12 : 15,
              fontWeight: 760,
              color: colors.textPrimary,
              textAlign: 'center',
            }}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

type MetricRowProps = {
  label: string;
  value: string;
  status: string;
  fill: number;
  delay: number;
  compact: boolean;
};

const MetricRow: React.FC<MetricRowProps> = ({
  label,
  value,
  status,
  fill,
  delay,
  compact,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 17, stiffness: 105, mass: 0.75},
  });
  const animatedFill = interpolate(enter, [0, 1], [0, fill], clamp);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: compact ? '1fr auto' : '1.05fr .95fr auto',
        alignItems: 'center',
        gap: compact ? 10 : 17,
        padding: compact ? '11px 0' : '15px 0',
        borderTop: `1px solid ${colors.borderSoft}`,
        fontFamily: fontBody,
        opacity: enter,
        transform: `translateX(${(1 - enter) * 18}px)`,
      }}
    >
      <div>
        <div
          style={{
            fontSize: compact ? 15 : 19,
            fontWeight: 700,
            color: colors.textPrimary,
          }}
        >
          {label}
        </div>
        {compact ? (
          <div
            style={{
              marginTop: 4,
              fontSize: 11,
              fontWeight: 730,
              color: colors.danger,
            }}
          >
            {status}
          </div>
        ) : null}
      </div>
      {!compact ? (
        <div
          style={{
            position: 'relative',
            height: 11,
            borderRadius: 7,
            backgroundColor: colors.borderSoft,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: `${animatedFill * 100}%`,
              borderRadius: 7,
              background: `linear-gradient(90deg, ${colors.danger}, ${colors.gaugeOrange})`,
            }}
          />
        </div>
      ) : null}
      <div style={{textAlign: 'right'}}>
        <div
          style={{
            fontSize: compact ? 16 : 20,
            fontWeight: 800,
            color: colors.danger,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </div>
        {!compact ? (
          <div
            style={{
              marginTop: 3,
              fontSize: 12,
              fontWeight: 730,
              color: colors.danger,
            }}
          >
            {status}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const DiagnosisPanel: React.FC<{format: Campaign01ProductFirstFormat}> = ({format}) => {
  const layout = useLayout(format);
  const enter = useEntrance(15, 95);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: layout.horizontal ? 890 : 900,
        padding: layout.compact ? '20px 23px' : '28px 31px',
        borderRadius: layout.compact ? 24 : 31,
        backgroundColor: 'rgba(255,255,255,.95)',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 30px 82px rgba(63,48,40,.15)',
        boxSizing: 'border-box',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 28}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          marginBottom: layout.compact ? 12 : 17,
          fontFamily: fontBody,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div
            style={{
              width: layout.compact ? 39 : 47,
              height: layout.compact ? 39 : 47,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primarySoft,
              color: colors.primary,
            }}
          >
            <BarChart3 size={layout.compact ? 21 : 25} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 820,
                fontSize: layout.compact ? 17 : 21,
                color: colors.textPrimary,
              }}
            >
              Gelato de morango
            </div>
            <div
              style={{
                marginTop: 3,
                fontSize: layout.compact ? 12 : 14,
                color: colors.textMuted,
              }}
            >
              Visão de balanceamento
            </div>
          </div>
        </div>
        <div
          style={{
            padding: layout.compact ? '7px 9px' : '8px 11px',
            borderRadius: 12,
            backgroundColor: colors.dangerSoft,
            color: colors.danger,
            fontSize: layout.compact ? 11 : 13,
            fontWeight: 800,
            textTransform: 'uppercase',
          }}
        >
          Atenção
        </div>
      </div>
      <MetricRow
        label="Água"
        value="76,6%"
        status="Fora da faixa"
        fill={0.91}
        delay={24}
        compact={layout.compact}
      />
      <MetricRow
        label="PAC"
        value="200,8"
        status="Baixo"
        fill={0.27}
        delay={30}
        compact={layout.compact}
      />
      <MetricRow
        label="Sólidos totais"
        value="22,8%"
        status="Baixo"
        fill={0.24}
        delay={36}
        compact={layout.compact}
      />
    </div>
  );
};

const DiagnosisScene: React.FC<{format: Campaign01ProductFirstFormat}> = ({
  format,
}) => {
  const layout = useLayout(format);
  const titleIn = useEntrance(4, 118);

  return (
    <Scene format={format} duration={BEATS.diagnosis.duration}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 68 : layout.compact ? 20 : 31,
        }}
      >
        <div
          style={{
            flex: layout.horizontal ? '0 0 43%' : undefined,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: layout.horizontal ? 'flex-start' : 'center',
            textAlign: layout.horizontal ? 'left' : 'center',
            gap: layout.compact ? 13 : 17,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 20}px)`,
          }}
        >
          <ProductSignature format={format} />
          <div
            style={{
              fontFamily: fontDisplay,
              fontSize: layout.title,
              lineHeight: 0.98,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: colors.textPrimary,
            }}
          >
            VEJA O
            <br />
            <span style={{color: colors.danger}}>DESEQUILÍBRIO.</span>
          </div>
          <div
            style={{
              fontFamily: fontBody,
              fontSize: layout.body,
              color: colors.textSecondary,
              lineHeight: 1.35,
              maxWidth: 730,
            }}
          >
            Os parâmetros que mudam textura, doçura e comportamento do gelato.
          </div>
          <ParametersStrip compact={layout.compact} />
        </div>
        <div style={{flex: layout.horizontal ? 1 : undefined, width: '100%'}}>
          <DiagnosisPanel format={format} />
        </div>
      </div>
    </Scene>
  );
};

const comparisonMetrics = [
  {label: 'Água', before: '76,6%', after: '67%'},
  {label: 'PAC', before: '200,8', after: '299,6'},
  {label: 'Sólidos', before: '22,8%', after: '32,9%'},
] as const;

const ComparisonPanel: React.FC<{format: Campaign01ProductFirstFormat}> = ({format}) => {
  const layout = useLayout(format);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = useEntrance(13, 100);
  const adjusted = spring({
    frame: frame - 33,
    fps,
    config: {damping: 16, stiffness: 96, mass: 0.84},
  });

  return (
    <div
      style={{
        width: '100%',
        maxWidth: layout.horizontal ? 940 : 900,
        padding: layout.compact ? '20px 22px' : '27px 30px',
        borderRadius: layout.compact ? 24 : 31,
        backgroundColor: 'rgba(255,255,255,.95)',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 30px 82px rgba(63,48,40,.15)',
        boxSizing: 'border-box',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 28}px)`,
        fontFamily: fontBody,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          paddingBottom: layout.compact ? 13 : 18,
          borderBottom: `1px solid ${colors.borderSoft}`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div
            style={{
              width: layout.compact ? 39 : 47,
              height: layout.compact ? 39 : 47,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.primarySoft,
              color: colors.primary,
            }}
          >
            <SlidersHorizontal size={layout.compact ? 21 : 25} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 820,
                fontSize: layout.compact ? 17 : 21,
                color: colors.textPrimary,
              }}
            >
              Simulação de ajuste
            </div>
            <div
              style={{
                marginTop: 3,
                fontSize: layout.compact ? 12 : 14,
                color: colors.textMuted,
              }}
            >
              Compare antes de alterar o lote
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: layout.compact ? '7px 9px' : '8px 11px',
            borderRadius: 12,
            backgroundColor: colors.successSoft,
            color: colors.success,
            fontSize: layout.compact ? 11 : 13,
            fontWeight: 800,
          }}
        >
          <Check size={layout.compact ? 14 : 16} strokeWidth={3} />
          Ajuste simulado
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: layout.compact ? 9 : 16,
          padding: layout.compact ? '12px 0 4px' : '17px 0 5px',
          fontSize: layout.compact ? 11 : 13,
          fontWeight: 800,
          letterSpacing: tracking.wide,
          textTransform: 'uppercase',
        }}
      >
        <span style={{color: colors.danger, textAlign: 'right'}}>Receita atual</span>
        <span style={{width: layout.compact ? 27 : 35}} />
        <span style={{color: colors.success}}>Simulação</span>
      </div>

      {comparisonMetrics.map((metric, index) => {
        const rowIn = spring({
          frame: frame - 20 - index * 5,
          fps,
          config: {damping: 17, stiffness: 108, mass: 0.72},
        });
        return (
          <div
            key={metric.label}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: layout.compact ? 9 : 16,
              padding: layout.compact ? '12px 0' : '16px 0',
              borderTop: `1px solid ${colors.borderSoft}`,
              opacity: rowIn,
              transform: `translateX(${(1 - rowIn) * 15}px)`,
            }}
          >
            <div style={{textAlign: 'right'}}>
              <div
                style={{
                  fontSize: layout.compact ? 15 : 19,
                  fontWeight: 800,
                  color: colors.danger,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {metric.before}
              </div>
              <div
                style={{
                  marginTop: 3,
                  fontSize: layout.compact ? 11 : 13,
                  fontWeight: 650,
                  color: colors.textMuted,
                }}
              >
                {metric.label}
              </div>
            </div>
            <div
              style={{
                width: layout.compact ? 27 : 35,
                height: layout.compact ? 27 : 35,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: colors.primary,
                backgroundColor: colors.primarySoft,
                transform: `scale(${0.88 + adjusted * 0.12})`,
              }}
            >
              <ArrowRight size={layout.compact ? 15 : 19} />
            </div>
            <div>
              <div
                style={{
                  fontSize: layout.compact ? 15 : 19,
                  fontWeight: 800,
                  color: colors.success,
                  fontVariantNumeric: 'tabular-nums',
                  opacity: adjusted,
                  transform: `translateX(${(1 - adjusted) * 10}px)`,
                }}
              >
                {metric.after}
              </div>
              <div
                style={{
                  marginTop: 3,
                  fontSize: layout.compact ? 11 : 13,
                  fontWeight: 650,
                  color: colors.textMuted,
                }}
              >
                {metric.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const AdjustScene: React.FC<{format: Campaign01ProductFirstFormat}> = ({format}) => {
  const layout = useLayout(format);
  const titleIn = useEntrance(2, 120);

  return (
    <Scene format={format} duration={BEATS.adjust.duration}>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 70 : layout.compact ? 22 : 34,
        }}
      >
        <div
          style={{
            flex: layout.horizontal ? '0 0 40%' : undefined,
            width: '100%',
            textAlign: layout.horizontal ? 'left' : 'center',
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 20}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              padding: layout.compact ? '9px 13px' : '11px 16px',
              borderRadius: 17,
              backgroundColor: colors.primary,
              color: colors.textInverse,
              fontFamily: fontBody,
              fontSize: layout.compact ? 14 : 17,
              fontWeight: 800,
              letterSpacing: tracking.wide,
              textTransform: 'uppercase',
            }}
          >
            <FlaskConical size={layout.compact ? 17 : 20} />
            Antes de produzir
          </div>
          <div
            style={{
              marginTop: layout.compact ? 13 : 18,
              fontFamily: fontDisplay,
              fontSize: layout.title,
              lineHeight: 0.98,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: colors.textPrimary,
            }}
          >
            TESTE O
            <br />
            <span style={{color: colors.primary}}>AJUSTE.</span>
          </div>
          <div
            style={{
              marginTop: layout.compact ? 10 : 15,
              fontFamily: fontBody,
              fontSize: layout.body,
              lineHeight: 1.35,
              fontWeight: 620,
              color: colors.textSecondary,
            }}
          >
            Compare os parâmetros antes de mexer no lote.
          </div>
        </div>
        <div style={{flex: layout.horizontal ? 1 : undefined, width: '100%'}}>
          <ComparisonPanel format={format} />
        </div>
      </div>
    </Scene>
  );
};

const CtaScene: React.FC<{format: Campaign01ProductFirstFormat}> = ({format}) => {
  const layout = useLayout(format);
  const logoIn = useEntrance(1, 108);
  const titleIn = useEntrance(7, 118);
  const ctaIn = useEntrance(18, 142);

  return (
    <Scene
      format={format}
      duration={BEATS.cta.duration}
      dark
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 64 : layout.compact ? 18 : 27,
          textAlign: layout.horizontal ? 'left' : 'center',
        }}
      >
        <div
          style={{
            width: layout.horizontal ? 190 : layout.compact ? 104 : 138,
            height: layout.horizontal ? 190 : layout.compact ? 104 : 138,
            flex: `0 0 ${layout.horizontal ? 190 : layout.compact ? 104 : 138}px`,
            borderRadius: layout.horizontal ? 52 : 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,.10)',
            border: '1px solid rgba(255,255,255,.18)',
            boxShadow: '0 28px 80px rgba(0,0,0,.18)',
            opacity: logoIn,
            transform: `scale(${0.74 + logoIn * 0.26}) rotate(${(1 - logoIn) * -4}deg)`,
          }}
        >
          <Img
            src={staticFile('brand/logo-dark-transparent.png')}
            style={{
              width: layout.horizontal ? 134 : layout.compact ? 74 : 98,
              height: layout.horizontal ? 134 : layout.compact ? 74 : 98,
              objectFit: 'contain',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: layout.horizontal ? 'flex-start' : 'center',
            gap: layout.compact ? 12 : 17,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 20}px)`,
          }}
        >
          <div
            style={{
              fontFamily: fontBody,
              fontSize: layout.compact ? 13 : 16,
              fontWeight: 800,
              letterSpacing: tracking.industrial,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.72)',
            }}
          >
            ICone · Inteligência para Gelato
          </div>
          <div
            style={{
              maxWidth: layout.horizontal ? 780 : 900,
              fontFamily: fontDisplay,
              fontSize: layout.horizontal ? 82 : layout.compact ? 60 : 80,
              lineHeight: 0.96,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: colors.textInverse,
            }}
          >
            BALANCEIE COM
            <br />
            MAIS CONTROLE.
          </div>
          <div
            style={{
              maxWidth: 760,
              fontFamily: fontBody,
              fontSize: layout.compact ? 18 : 23,
              lineHeight: 1.3,
              color: 'rgba(255,255,255,.74)',
            }}
          >
            Software para formulação e balanceamento de gelato.
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: layout.compact ? 11 : 14,
              marginTop: layout.compact ? 1 : 5,
              opacity: ctaIn,
              transform: `translateY(${(1 - ctaIn) * 15}px) scale(${0.94 + ctaIn * 0.06})`,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 13,
                padding: layout.compact ? '14px 20px' : '17px 25px',
                borderRadius: 18,
                backgroundColor: colors.surface,
                color: colors.primary,
                boxShadow: '0 18px 45px rgba(0,0,0,.22)',
                fontFamily: fontBody,
                fontSize: layout.compact ? 19 : 23,
                fontWeight: 850,
              }}
            >
              COMEÇAR GRÁTIS
              <ArrowRight size={layout.compact ? 20 : 24} strokeWidth={2.6} />
            </div>
            <div
              style={{
                fontFamily: fontBody,
                fontSize: layout.compact ? 12 : 14,
                lineHeight: 1.15,
                fontWeight: 650,
                color: 'rgba(255,255,255,.66)',
                textAlign: 'left',
              }}
            >
              Plano Free
              <br />
              disponível
            </div>
          </div>
          <div
            style={{
              opacity: ctaIn,
              fontFamily: fontDisplay,
              fontSize: layout.compact ? 18 : 22,
              fontWeight: 650,
              letterSpacing: tracking.industrial,
              color: 'rgba(255,255,255,.90)',
              textTransform: 'uppercase',
            }}
          >
            icone.academy
          </div>
        </div>
      </div>
    </Scene>
  );
};

export const Campaign01ProductFirst: React.FC<Campaign01ProductFirstProps> = ({
  format,
  voiceoverFile = null,
  withSfx = false,
}) => {
  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      {voiceoverFile ? <Audio src={staticFile(voiceoverFile)} volume={1} /> : null}

      {withSfx ? (
        <>
          <Sequence from={0} durationInFrames={45}>
            <Audio src={staticFile('sfx/impact.wav')} volume={0.16} />
          </Sequence>
          <Sequence from={BEATS.diagnosis.from} durationInFrames={60}>
            <Audio src={staticFile('sfx/ui-slide.wav')} volume={0.13} />
          </Sequence>
          <Sequence from={BEATS.adjust.from} durationInFrames={60}>
            <Audio src={staticFile('sfx/tick.wav')} volume={0.18} />
          </Sequence>
          <Sequence from={BEATS.cta.from} durationInFrames={70}>
            <Audio src={staticFile('sfx/success.wav')} volume={0.15} />
          </Sequence>
        </>
      ) : null}

      <Sequence from={BEATS.hook.from} durationInFrames={BEATS.hook.duration}>
        <HookScene format={format} />
      </Sequence>
      <Sequence
        from={BEATS.diagnosis.from}
        durationInFrames={BEATS.diagnosis.duration}
      >
        <DiagnosisScene format={format} />
      </Sequence>
      <Sequence from={BEATS.adjust.from} durationInFrames={BEATS.adjust.duration}>
        <AdjustScene format={format} />
      </Sequence>
      <Sequence from={BEATS.cta.from} durationInFrames={BEATS.cta.duration}>
        <CtaScene format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
