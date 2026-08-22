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
  Check,
  CheckCircle2,
  FlaskConical,
  ScanLine,
  Sparkles,
} from 'lucide-react';
import {GaugeArc, type GaugeZone} from '../components/GaugeArc';
import {SceneBackground} from '../components/SceneBackground';
import {fontBody, fontDisplay} from '../fonts';
import {colors, shadows, tracking} from '../theme';

export const CAMPAIGN_01_FPS = 30;
const CAMPAIGN_01_TIMELINE_SCALE = 0.7;
export const CAMPAIGN_01_DURATION = Math.round(CAMPAIGN_01_FPS * 15 * CAMPAIGN_01_TIMELINE_SCALE);

export type Campaign01Format = 'vertical' | 'square' | 'horizontal';

export type Campaign01Props = {
  format: Campaign01Format;
};

const F = (seconds: number) =>
  Math.round(seconds * CAMPAIGN_01_FPS * CAMPAIGN_01_TIMELINE_SCALE);

const BEATS = {
  hook: {from: 0, duration: F(2.5)},
  problem: {from: F(2.25), duration: F(3.05)},
  analysis: {from: F(4.85), duration: F(4.85)},
  result: {from: F(9.3), duration: F(3.05)},
  cta: {from: F(11.95), duration: CAMPAIGN_01_DURATION - F(11.95)},
} as const;

type Layout = {
  width: number;
  height: number;
  compact: boolean;
  horizontal: boolean;
  paddingX: number;
  safeTop: number;
  safeBottom: number;
  headline: number;
  title: number;
  lead: number;
  body: number;
  caption: number;
  gaugeSize: number;
  contentWidth: number;
};

const useCampaignLayout = (format: Campaign01Format): Layout => {
  const {width, height} = useVideoConfig();

  if (format === 'horizontal') {
    return {
      width,
      height,
      compact: false,
      horizontal: true,
      paddingX: 110,
      safeTop: 72,
      safeBottom: 72,
      headline: 112,
      title: 66,
      lead: 32,
      body: 25,
      caption: 18,
      gaugeSize: 226,
      contentWidth: 1640,
    };
  }

  if (format === 'square') {
    return {
      width,
      height,
      compact: true,
      horizontal: false,
      paddingX: 62,
      safeTop: 70,
      safeBottom: 76,
      headline: 86,
      title: 58,
      lead: 28,
      body: 23,
      caption: 17,
      gaugeSize: 182,
      contentWidth: 956,
    };
  }

  return {
    width,
    height,
    compact: false,
    horizontal: false,
    paddingX: 58,
    safeTop: 190,
    safeBottom: 270,
    headline: 112,
    title: 68,
    lead: 34,
    body: 26,
    caption: 19,
    gaugeSize: 228,
    contentWidth: 964,
  };
};

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

const useEnter = (delay = 0, stiffness = 105) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness, mass: 0.78},
  });
};

const SceneShell: React.FC<{
  children: React.ReactNode;
  duration: number;
  format: Campaign01Format;
  dark?: boolean;
  fadeIn?: number;
  fadeOut?: number;
}> = ({children, duration, format, dark = false, fadeIn = 8, fadeOut = 10}) => {
  const frame = useCurrentFrame();
  const layout = useCampaignLayout(format);
  const opacityIn = interpolate(frame, [0, fadeIn], [0, 1], clamp);
  const opacityOut = interpolate(
    frame,
    [Math.max(fadeIn + 1, duration - fadeOut), duration],
    [1, 0],
    clamp,
  );

  return (
    <AbsoluteFill style={{opacity: Math.min(opacityIn, opacityOut)}}>
      <SceneBackground tone={dark ? 'taupe' : 'cream'}>
        <AmbientField dark={dark} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: `${layout.safeTop}px ${layout.paddingX}px ${layout.safeBottom}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
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
      </SceneBackground>
    </AbsoluteFill>
  );
};

const AmbientField: React.FC<{dark?: boolean}> = ({dark = false}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const driftA = Math.sin(frame * 0.025) * 36;
  const driftB = Math.cos(frame * 0.019) * 42;

  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          width: Math.max(width, height) * 0.72,
          height: Math.max(width, height) * 0.72,
          left: -width * 0.2 + driftA,
          top: -height * 0.12 + driftB,
          borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(255,255,255,0.13), transparent 68%)'
            : 'radial-gradient(circle, rgba(163,144,125,0.25), transparent 68%)',
          filter: 'blur(8px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: Math.max(width, height) * 0.62,
          height: Math.max(width, height) * 0.62,
          right: -width * 0.23 - driftB,
          bottom: -height * 0.14 - driftA,
          borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(239,232,223,0.10), transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.95), transparent 70%)',
          filter: 'blur(6px)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: dark ? 0.055 : 0.035,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(63,48,40,.7) 0, rgba(63,48,40,.7) 1px, transparent 1px, transparent 4px)',
          mixBlendMode: 'soft-light',
        }}
      />
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{
  children: React.ReactNode;
  dark?: boolean;
  icon?: React.ReactNode;
}> = ({children, dark = false, icon}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '11px 18px',
      borderRadius: 22,
      border: `1px solid ${dark ? 'rgba(255,255,255,.2)' : colors.border}`,
      backgroundColor: dark ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.74)',
      boxShadow: dark ? 'none' : shadows.sm,
      fontFamily: fontBody,
      fontWeight: 700,
      fontSize: 19,
      lineHeight: 1,
      letterSpacing: tracking.wide,
      textTransform: 'uppercase',
      color: dark ? 'rgba(255,255,255,.88)' : colors.primary,
    }}
  >
    {icon}
    {children}
  </div>
);

const RecipeDraft: React.FC<{
  format: Campaign01Format;
  muted?: boolean;
}> = ({format, muted = false}) => {
  const frame = useCurrentFrame();
  const layout = useCampaignLayout(format);
  const enter = useEnter(0, 88);
  const float = Math.sin(frame * 0.055) * (layout.horizontal ? 4 : 7);
  const rows = [
    ['Morango fresco', '450 g', 'ok'],
    ['Água', '≈ 350 g?', 'guess'],
    ['Sacarose', 'a olho', 'bad'],
    ['Xarope de glicose', '25 g', 'ok'],
    ['Neutro', 'uma pitada', 'bad'],
  ] as const;
  const cardWidth = layout.horizontal ? 760 : layout.compact ? 640 : 820;

  return (
    <div
      style={{
        width: cardWidth,
        padding: layout.compact ? '28px 32px' : '38px 42px',
        borderRadius: layout.compact ? 28 : 34,
        backgroundColor: 'rgba(255,255,255,.92)',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 32px 90px rgba(63,48,40,.17)',
        opacity: enter * (muted ? 0.64 : 1),
        transform: `translateY(${(1 - enter) * 42 + float}px) rotate(${-2.2 + Math.sin(frame * 0.04) * 0.25}deg) scale(${0.96 + enter * 0.04})`,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: fontDisplay,
              fontSize: layout.compact ? 34 : 42,
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: '-0.02em',
            }}
          >
            Sorvete de morango
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: fontBody,
              fontSize: layout.compact ? 17 : 20,
              color: colors.textMuted,
            }}
          >
            Receita em desenvolvimento
          </div>
        </div>
        <div
          style={{
            padding: '9px 13px',
            borderRadius: 18,
            backgroundColor: colors.warningSoft,
            color: colors.warning,
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: layout.compact ? 15 : 17,
          }}
        >
          Rascunho
        </div>
      </div>
      {rows.map(([name, value, tone], index) => {
        const rowIn = spring({
          frame: frame - 5 - index * 3,
          fps: CAMPAIGN_01_FPS,
          config: {damping: 18, stiffness: 115, mass: 0.7},
        });
        const color =
          tone === 'bad'
            ? colors.danger
            : tone === 'guess'
              ? colors.warning
              : colors.textSecondary;
        return (
          <div
            key={name}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 20,
              padding: layout.compact ? '11px 0' : '14px 0',
              borderTop: `1px solid ${colors.borderSoft}`,
              opacity: rowIn,
              transform: `translateX(${(1 - rowIn) * 18}px)`,
              fontFamily: fontBody,
            }}
          >
            <span
              style={{
                fontWeight: 550,
                fontSize: layout.compact ? 20 : 24,
                color: colors.textSecondary,
              }}
            >
              {name}
            </span>
            <span
              style={{
                fontWeight: 750,
                fontSize: layout.compact ? 21 : 25,
                color,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const HookScene: React.FC<{format: Campaign01Format}> = ({format}) => {
  const layout = useCampaignLayout(format);
  const titleIn = useEnter(5, 120);
  const accentIn = useEnter(23, 150);
  const content = (
    <>
      <RecipeDraft format={format} muted />
      <div
        style={{
          position: layout.horizontal ? 'relative' : 'absolute',
          inset: layout.horizontal ? undefined : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: layout.horizontal ? 0 : `0 ${layout.paddingX}px`,
          background: layout.horizontal
            ? undefined
            : 'linear-gradient(180deg, rgba(248,246,242,.06), rgba(248,246,242,.78) 45%, rgba(248,246,242,.20))',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: layout.horizontal ? 'flex-start' : 'center',
            gap: layout.horizontal ? 24 : 18,
            maxWidth: layout.horizontal ? 710 : 940,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 28}px)`,
          }}
        >
          <Kicker icon={<AlertTriangle size={20} strokeWidth={2.3} />}>
            Formulação profissional
          </Kicker>
          <div
            style={{
              fontFamily: fontDisplay,
              fontSize: layout.headline,
              lineHeight: 0.98,
              fontWeight: 700,
              color: colors.textPrimary,
              textAlign: layout.horizontal ? 'left' : 'center',
              letterSpacing: '-0.035em',
              textShadow: '0 2px 0 rgba(255,255,255,.8)',
            }}
          >
            Ainda formula
            <br />
            <span
              style={{
                color: colors.danger,
                display: 'inline-block',
                opacity: accentIn,
                transform: `scale(${0.92 + accentIn * 0.08})`,
              }}
            >
              no olho?
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <SceneShell duration={BEATS.hook.duration} format={format} fadeOut={12}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: layout.horizontal ? 'space-between' : 'center',
          gap: 90,
        }}
      >
        {content}
      </div>
    </SceneShell>
  );
};

const gaugeZones: GaugeZone[] = [
  {from: 0, to: 0.32, color: colors.gaugeRed},
  {from: 0.32, to: 0.48, color: colors.gaugeOrange},
  {from: 0.48, to: 0.68, color: colors.gaugeGreen},
  {from: 0.68, to: 0.84, color: colors.gaugeOrange},
  {from: 0.84, to: 1, color: colors.gaugeRed},
];

const ProblemScene: React.FC<{format: Campaign01Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useCampaignLayout(format);
  const enter = useEnter(0, 110);
  const shake = frame > 22 && frame < 68 ? Math.sin(frame * 1.7) * 2.1 : 0;
  const gaugeSize = layout.gaugeSize;
  const metrics = [
    {label: 'Água', value: '76,6%', fraction: 0.9},
    {label: 'PAC', value: '200,8', fraction: 0.2},
    {label: 'Sólidos totais', value: '22,8%', fraction: 0.2},
  ] as const;

  return (
    <SceneShell duration={BEATS.problem.duration} format={format} fadeIn={10} fadeOut={13}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 42 : layout.compact ? 24 : 44,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 28 + shake}px)`,
        }}
      >
        <div style={{textAlign: 'center'}}>
          <Kicker icon={<AlertTriangle size={20} />}>
            O problema aparece nos números
          </Kicker>
          <h2
            style={{
              margin: `${layout.compact ? 17 : 25}px 0 0`,
              fontFamily: fontDisplay,
              fontSize: layout.title,
              lineHeight: 1.02,
              letterSpacing: '-0.025em',
              color: colors.textPrimary,
            }}
          >
            Três sinais. Nenhuma segurança.
          </h2>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: layout.horizontal ? 28 : layout.compact ? 13 : 18,
            width: '100%',
            maxWidth: layout.horizontal ? 1180 : 940,
          }}
        >
          {metrics.map((metric, index) => (
            <GaugeArc
              key={metric.label}
              label={metric.label}
              value={metric.value}
              fraction={metric.fraction}
              zones={gaugeZones}
              delay={5 + index * 5}
              size={gaugeSize}
              statusLabel="Desbalanceado"
              statusBg={colors.dangerSoft}
              statusColor={colors.danger}
              alert
            />
          ))}
        </div>
      </div>
    </SceneShell>
  );
};

const AnalysisScene: React.FC<{format: Campaign01Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const layout = useCampaignLayout(format);
  const enter = useEnter(0, 105);
  const scan = interpolate(frame, [10, BEATS.analysis.duration - 25], [0, 1], clamp);
  const resolved = spring({
    frame: frame - 63,
    fps,
    config: {damping: 17, stiffness: 100, mass: 0.85},
  });
  const progress = Math.round(interpolate(frame, [5, 92], [8, 100], clamp));
  const metrics = [
    {label: 'Água', before: '76,6%', after: '67%', fillBefore: 0.91, fillAfter: 0.58},
    {label: 'PAC', before: '200,8', after: '299,6', fillBefore: 0.27, fillAfter: 0.61},
    {label: 'Sólidos totais', before: '22,8%', after: '32,9%', fillBefore: 0.24, fillAfter: 0.58},
  ] as const;

  return (
    <SceneShell duration={BEATS.analysis.duration} format={format} fadeIn={10} fadeOut={12}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: layout.horizontal ? 30 : 34,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 25}px)`,
        }}
      >
        <div style={{textAlign: 'center'}}>
          <Kicker icon={<ScanLine size={20} />}>
            Inteligência ICone
          </Kicker>
          <div
            style={{
              marginTop: 19,
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: layout.title,
              lineHeight: 1,
              letterSpacing: '-0.025em',
              color: colors.textPrimary,
            }}
          >
            Analisando sua formulação
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: layout.horizontal ? 1320 : 920,
            padding: layout.compact ? '22px 24px 24px' : '30px 34px 34px',
            borderRadius: layout.compact ? 26 : 32,
            backgroundColor: 'rgba(255,255,255,.94)',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 28px 76px rgba(63,48,40,.14)',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${scan * 100}%`,
              height: 4,
              background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.success}, transparent)`,
              boxShadow: '0 0 26px rgba(47,133,90,.48)',
              opacity: resolved > 0.95 ? 0 : 0.8,
              zIndex: 5,
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 24,
              paddingBottom: layout.compact ? 17 : 22,
              borderBottom: `1px solid ${colors.borderSoft}`,
              fontFamily: fontBody,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <div
                style={{
                  width: layout.compact ? 42 : 50,
                  height: layout.compact ? 42 : 50,
                  borderRadius: 15,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: resolved > 0.8 ? colors.successSoft : colors.primarySoft,
                }}
              >
                {resolved > 0.8 ? (
                  <CheckCircle2 size={27} color={colors.success} />
                ) : (
                  <Sparkles size={27} color={colors.primary} />
                )}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 750,
                    fontSize: layout.compact ? 21 : 25,
                    color: colors.textPrimary,
                  }}
                >
                  {resolved > 0.8 ? 'Ajuste validado' : 'Buscando um ajuste seguro'}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: layout.compact ? 15 : 18,
                    color: colors.textMuted,
                  }}
                >
                  Preservando a identidade da receita
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: fontDisplay,
                fontWeight: 700,
                fontSize: layout.compact ? 28 : 34,
                color: resolved > 0.8 ? colors.success : colors.primary,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {progress}%
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column'}}>
            {metrics.map((metric, index) => {
              const rowIn = spring({
                frame: frame - 13 - index * 6,
                fps,
                config: {damping: 18, stiffness: 110, mass: 0.72},
              });
              const fill = interpolate(
                resolved,
                [0, 1],
                [metric.fillBefore, metric.fillAfter],
              );
              return (
                <div
                  key={metric.label}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: layout.compact
                      ? 'minmax(150px, 1.2fr) 1fr auto'
                      : 'minmax(210px, 1.2fr) 1.5fr auto',
                    alignItems: 'center',
                    gap: layout.compact ? 14 : 24,
                    padding: layout.compact ? '17px 0' : '22px 0',
                    borderBottom:
                      index < metrics.length - 1
                        ? `1px solid ${colors.borderSoft}`
                        : undefined,
                    opacity: rowIn,
                    transform: `translateX(${(1 - rowIn) * 16}px)`,
                    fontFamily: fontBody,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 650,
                      fontSize: layout.compact ? 18 : 22,
                      color: colors.textSecondary,
                    }}
                  >
                    {metric.label}
                  </span>
                  <div
                    style={{
                      position: 'relative',
                      height: layout.compact ? 11 : 14,
                      borderRadius: 8,
                      backgroundColor: colors.borderSoft,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: `${fill * 100}%`,
                        borderRadius: 8,
                        background: `linear-gradient(90deg, ${resolved > 0.55 ? colors.success : colors.danger}, ${resolved > 0.55 ? colors.gaugeGreen : colors.gaugeOrange})`,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      minWidth: layout.compact ? 70 : 92,
                      textAlign: 'right',
                      fontWeight: 750,
                      fontSize: layout.compact ? 19 : 23,
                      color: resolved > 0.55 ? colors.success : colors.danger,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {resolved > 0.55 ? metric.after : metric.before}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const StatusCard: React.FC<{
  title: string;
  tone: 'before' | 'after';
  rows: Array<[string, string]>;
  compact: boolean;
}> = ({title, tone, rows, compact}) => {
  const enter = useEnter(tone === 'after' ? 18 : 3, tone === 'after' ? 135 : 105);
  const good = tone === 'after';
  return (
    <div
      style={{
        flex: 1,
        padding: compact ? '22px 23px' : '29px 30px',
        borderRadius: compact ? 24 : 30,
        border: `1px solid ${good ? 'rgba(47,133,90,.3)' : 'rgba(194,65,12,.24)'}`,
        backgroundColor: good ? 'rgba(232,245,238,.88)' : 'rgba(252,238,232,.78)',
        boxShadow: good ? '0 22px 58px rgba(47,133,90,.12)' : shadows.md,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 26}px) scale(${0.97 + enter * 0.03})`,
        fontFamily: fontBody,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          marginBottom: compact ? 15 : 20,
        }}
      >
        <span
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: compact ? 29 : 36,
            color: colors.textPrimary,
          }}
        >
          {title}
        </span>
        <div
          style={{
            width: compact ? 36 : 43,
            height: compact ? 36 : 43,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: good ? colors.success : colors.danger,
          }}
        >
          {good ? (
            <Check size={compact ? 21 : 25} color="white" strokeWidth={3} />
          ) : (
            <AlertTriangle size={compact ? 20 : 24} color="white" />
          )}
        </div>
      </div>
      {rows.map(([label, value], index) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            padding: compact ? '10px 0' : '13px 0',
            borderTop: `1px solid ${good ? 'rgba(47,133,90,.16)' : 'rgba(194,65,12,.13)'}`,
          }}
        >
          <span
            style={{
              fontSize: compact ? 17 : 20,
              color: colors.textSecondary,
              fontWeight: 550,
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: compact ? 18 : 21,
              color: good ? colors.success : colors.danger,
              fontWeight: 750,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  );
};

const ResultScene: React.FC<{format: Campaign01Format}> = ({format}) => {
  const layout = useCampaignLayout(format);
  const titleIn = useEnter(2, 115);
  const rowsBefore: Array<[string, string]> = [
    ['Água', '76,6%'],
    ['PAC', '200,8'],
    ['Sólidos', '22,8%'],
  ];
  const rowsAfter: Array<[string, string]> = [
    ['Água', '67%'],
    ['PAC', '299,6'],
    ['Sólidos', '32,9%'],
  ];

  return (
    <SceneShell duration={BEATS.result.duration} format={format} fadeIn={9} fadeOut={12}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: layout.compact ? 23 : 34,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 20}px)`,
          }}
        >
          <Kicker icon={<CheckCircle2 size={20} color={colors.success} />}>
            Ajuste tecnicamente validado
          </Kicker>
          <div
            style={{
              marginTop: layout.compact ? 15 : 21,
              fontFamily: fontDisplay,
              fontSize: layout.title,
              lineHeight: 1,
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: '-0.025em',
            }}
          >
            Mais controle antes de produzir.
          </div>
        </div>
        <div
          style={{
            width: '100%',
            maxWidth: layout.horizontal ? 1270 : 920,
            display: 'flex',
            alignItems: 'stretch',
            gap: layout.compact ? 12 : 18,
          }}
        >
          <StatusCard
            title="Antes"
            tone="before"
            rows={rowsBefore}
            compact={layout.compact}
          />
          <div
            style={{
              alignSelf: 'center',
              width: layout.compact ? 40 : 52,
              height: layout.compact ? 40 : 52,
              flex: `0 0 ${layout.compact ? 40 : 52}px`,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.primary,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              boxShadow: shadows.sm,
            }}
          >
            <ArrowRight size={layout.compact ? 21 : 27} />
          </div>
          <StatusCard
            title="Depois"
            tone="after"
            rows={rowsAfter}
            compact={layout.compact}
          />
        </div>
      </div>
    </SceneShell>
  );
};

const CtaScene: React.FC<{format: Campaign01Format}> = ({format}) => {
  const layout = useCampaignLayout(format);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoIn = spring({
    frame: frame - 1,
    fps,
    config: {damping: 17, stiffness: 105, mass: 0.85},
  });
  const copyIn = spring({
    frame: frame - 10,
    fps,
    config: {damping: 17, stiffness: 110, mass: 0.8},
  });
  const ctaIn = spring({
    frame: frame - 25,
    fps,
    config: {damping: 14, stiffness: 135, mass: 0.68},
  });

  return (
    <SceneShell
      duration={BEATS.cta.duration}
      format={format}
      dark
      fadeIn={10}
      fadeOut={1}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 76 : layout.compact ? 24 : 38,
          textAlign: layout.horizontal ? 'left' : 'center',
        }}
      >
        <div
          style={{
            width: layout.horizontal ? 220 : layout.compact ? 116 : 156,
            height: layout.horizontal ? 220 : layout.compact ? 116 : 156,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: layout.horizontal ? 58 : 42,
            backgroundColor: 'rgba(255,255,255,.10)',
            border: '1px solid rgba(255,255,255,.18)',
            boxShadow: '0 28px 80px rgba(0,0,0,.18)',
            opacity: logoIn,
            transform: `scale(${0.72 + logoIn * 0.28}) rotate(${(1 - logoIn) * -5}deg)`,
          }}
        >
          <Img
            src={staticFile('brand/logo-dark-transparent.png')}
            style={{
              width: layout.horizontal ? 156 : layout.compact ? 82 : 112,
              height: layout.horizontal ? 156 : layout.compact ? 82 : 112,
              objectFit: 'contain',
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: layout.horizontal ? 'flex-start' : 'center',
            gap: layout.compact ? 17 : 22,
            opacity: copyIn,
            transform: `translateY(${(1 - copyIn) * 24}px)`,
          }}
        >
          <Kicker dark icon={<FlaskConical size={20} />}>
            Inteligência para Gelato
          </Kicker>
          <div
            style={{
              fontFamily: fontDisplay,
              fontSize: layout.horizontal ? 90 : layout.compact ? 67 : 88,
              lineHeight: 0.98,
              fontWeight: 700,
              color: colors.textInverse,
              letterSpacing: '-0.03em',
              maxWidth: layout.horizontal ? 760 : 910,
            }}
          >
            Formule com ciência.
          </div>
          <div
            style={{
              fontFamily: fontBody,
              fontSize: layout.compact ? 22 : 28,
              color: 'rgba(255,255,255,.72)',
              lineHeight: 1.35,
            }}
          >
            Do primeiro ingrediente ao ajuste final.
          </div>
          <div
            style={{
              marginTop: layout.compact ? 2 : 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 18,
              padding: layout.compact ? '15px 23px' : '18px 28px',
              borderRadius: 18,
              backgroundColor: colors.surface,
              color: colors.primary,
              boxShadow: '0 18px 44px rgba(0,0,0,.20)',
              opacity: ctaIn,
              transform: `translateY(${(1 - ctaIn) * 18}px) scale(${0.93 + ctaIn * 0.07})`,
              fontFamily: fontBody,
              fontSize: layout.compact ? 21 : 25,
              fontWeight: 800,
            }}
          >
            Começar grátis
            <ArrowRight size={layout.compact ? 22 : 26} strokeWidth={2.5} />
          </div>
          <div
            style={{
              opacity: ctaIn,
              fontFamily: fontDisplay,
              fontSize: layout.compact ? 20 : 24,
              fontWeight: 600,
              letterSpacing: tracking.industrial,
              color: 'rgba(255,255,255,.86)',
              textTransform: 'uppercase',
            }}
          >
            icone.academy
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

export const Campaign01FormulaNoOlho: React.FC<Campaign01Props> = ({format}) => {
  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      <Audio src={staticFile('audio/campaign-01-voiceover-ptbr.wav')} volume={1} />

      <Sequence from={BEATS.hook.from} durationInFrames={BEATS.hook.duration}>
        <HookScene format={format} />
      </Sequence>
      <Sequence from={BEATS.problem.from} durationInFrames={BEATS.problem.duration}>
        <ProblemScene format={format} />
      </Sequence>
      <Sequence from={BEATS.analysis.from} durationInFrames={BEATS.analysis.duration}>
        <AnalysisScene format={format} />
      </Sequence>
      <Sequence from={BEATS.result.from} durationInFrames={BEATS.result.duration}>
        <ResultScene format={format} />
      </Sequence>
      <Sequence from={BEATS.cta.from} durationInFrames={BEATS.cta.duration}>
        <CtaScene format={format} />
      </Sequence>
    </AbsoluteFill>
  );
};
