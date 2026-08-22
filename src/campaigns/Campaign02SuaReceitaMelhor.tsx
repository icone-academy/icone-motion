import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  FlaskConical,
  Gauge,
  ScanLine,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingUp,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {fontBody, fontDisplay} from '../fonts';
import {colors, shadows, tracking} from '../theme';

export const CAMPAIGN_02_FPS = 30;
export const CAMPAIGN_02_DURATION = CAMPAIGN_02_FPS * 20;

export type Campaign02Format = 'vertical' | 'square' | 'horizontal';

export type Campaign02Props = {
  format: Campaign02Format;
};

const F = (seconds: number) => Math.round(seconds * CAMPAIGN_02_FPS);

const BEATS = {
  hook: {from: 0, duration: F(3.6)},
  diagnosis: {from: F(3.1), duration: F(4.6)},
  optimization: {from: F(7.2), duration: F(5.5)},
  comparison: {from: F(12.2), duration: F(4.2)},
  safety: {from: F(15.9), duration: F(2.5)},
  cta: {from: F(18), duration: F(2)},
} as const;

type Layout = {
  width: number;
  height: number;
  horizontal: boolean;
  compact: boolean;
  paddingX: number;
  safeTop: number;
  safeBottom: number;
  contentWidth: number;
  hero: number;
  title: number;
  lead: number;
  body: number;
  caption: number;
};

const useLayout = (format: Campaign02Format): Layout => {
  const {width, height} = useVideoConfig();

  if (format === 'horizontal') {
    return {
      width,
      height,
      horizontal: true,
      compact: false,
      paddingX: 108,
      safeTop: 68,
      safeBottom: 68,
      contentWidth: 1640,
      hero: 108,
      title: 68,
      lead: 32,
      body: 25,
      caption: 18,
    };
  }

  if (format === 'square') {
    return {
      width,
      height,
      horizontal: false,
      compact: true,
      paddingX: 60,
      safeTop: 64,
      safeBottom: 64,
      contentWidth: 960,
      hero: 82,
      title: 56,
      lead: 27,
      body: 22,
      caption: 16,
    };
  }

  return {
    width,
    height,
    horizontal: false,
    compact: false,
    paddingX: 58,
    safeTop: 174,
    safeBottom: 246,
    contentWidth: 964,
    hero: 108,
    title: 68,
    lead: 33,
    body: 26,
    caption: 18,
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

const AmbientField: React.FC<{dark?: boolean}> = ({dark = false}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const driftX = Math.sin(frame * 0.021) * 38;
  const driftY = Math.cos(frame * 0.017) * 34;
  const diameter = Math.max(width, height);

  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          width: diameter * 0.72,
          height: diameter * 0.72,
          left: -width * 0.22 + driftX,
          top: -height * 0.16 + driftY,
          borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(255,255,255,.12), transparent 68%)'
            : 'radial-gradient(circle, rgba(163,144,125,.25), transparent 68%)',
          filter: 'blur(10px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: diameter * 0.58,
          height: diameter * 0.58,
          right: -width * 0.18 - driftY,
          bottom: -height * 0.18 - driftX,
          borderRadius: '50%',
          background: dark
            ? 'radial-gradient(circle, rgba(239,232,223,.10), transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,.94), transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
      <AbsoluteFill
        style={{
          opacity: dark ? 0.05 : 0.028,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(63,48,40,.75) 0, rgba(63,48,40,.75) 1px, transparent 1px, transparent 4px)',
          mixBlendMode: 'soft-light',
        }}
      />
    </AbsoluteFill>
  );
};

const SceneShell: React.FC<{
  children: React.ReactNode;
  format: Campaign02Format;
  duration: number;
  dark?: boolean;
  fadeOut?: number;
}> = ({children, format, duration, dark = false, fadeOut = 10}) => {
  const frame = useCurrentFrame();
  const layout = useLayout(format);
  const opacity = Math.min(
    interpolate(frame, [0, 9], [0, 1], clamp),
    interpolate(frame, [Math.max(10, duration - fadeOut), duration], [1, 0], clamp),
  );

  return (
    <AbsoluteFill style={{opacity}}>
      <SceneBackground tone={dark ? 'taupe' : 'cream'}>
        <AmbientField dark={dark} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            boxSizing: 'border-box',
            padding: `${layout.safeTop}px ${layout.paddingX}px ${layout.safeBottom}px`,
            display: 'flex',
            alignItems: 'center',
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
      </SceneBackground>
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{
  children: React.ReactNode;
  icon?: React.ReactNode;
  dark?: boolean;
}> = ({children, icon, dark = false}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 17px',
      borderRadius: 22,
      border: `1px solid ${dark ? 'rgba(255,255,255,.2)' : colors.border}`,
      background: dark ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.76)',
      color: dark ? 'rgba(255,255,255,.88)' : colors.primary,
      boxShadow: dark ? 'none' : shadows.sm,
      fontFamily: fontBody,
      fontSize: 18,
      fontWeight: 700,
      letterSpacing: tracking.wide,
      lineHeight: 1,
      textTransform: 'uppercase',
    }}
  >
    {icon}
    {children}
  </div>
);

const RecipeCard: React.FC<{format: Campaign02Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useLayout(format);
  const enter = useEnter(12);
  const scan = interpolate(frame, [28, 78], [-12, 112], clamp);
  const rows = [
    ['Morango', '450 g'],
    ['Água', '350 g'],
    ['Açúcar (sacarose)', '150 g'],
    ['Xarope de glicose', '25 g'],
  ];

  return (
    <div
      style={{
        width: layout.horizontal ? 640 : layout.compact ? 620 : 780,
        maxWidth: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: layout.compact ? 26 : 32,
        background: 'rgba(255,255,255,.94)',
        border: `1px solid ${colors.border}`,
        boxShadow: '0 34px 90px rgba(63,48,40,.14)',
        opacity: enter,
        transform: `perspective(1200px) rotateY(${layout.horizontal ? -3.5 : 0}deg) translateY(${(1 - enter) * 30}px) scale(${0.96 + enter * 0.04})`,
      }}
    >
      <div
        style={{
          padding: layout.compact ? '22px 25px' : '26px 30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${colors.borderSoft}`,
        }}
      >
        <div>
          <div style={{fontFamily: fontBody, fontSize: layout.body, fontWeight: 800, color: colors.textPrimary}}>
            Sorvete de morango
          </div>
          <div style={{fontFamily: fontBody, fontSize: layout.caption, color: colors.textMuted, marginTop: 5}}>
            Base água · 1.000 g
          </div>
        </div>
        <div
          style={{
            padding: '8px 13px',
            borderRadius: 16,
            color: colors.warning,
            background: colors.warningSoft,
            fontFamily: fontBody,
            fontSize: layout.caption,
            fontWeight: 800,
          }}
        >
          Pode melhorar
        </div>
      </div>
      <div style={{padding: layout.compact ? '10px 24px 18px' : '12px 30px 22px'}}>
        {rows.map(([name, value], index) => {
          const rowIn = spring({
            frame: frame - 18 - index * 5,
            fps: CAMPAIGN_02_FPS,
            config: {damping: 18, stiffness: 115, mass: 0.75},
          });
          return (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: layout.compact ? '13px 0' : '16px 0',
                borderBottom: index === rows.length - 1 ? 'none' : `1px solid ${colors.borderSoft}`,
                opacity: rowIn,
                transform: `translateX(${(1 - rowIn) * 22}px)`,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 13}}>
                <div style={{width: 8, height: 8, borderRadius: '50%', background: index === 0 ? colors.success : colors.primaryMuted}} />
                <span style={{fontFamily: fontBody, fontSize: layout.compact ? 19 : 22, fontWeight: 600, color: colors.textPrimary}}>
                  {name}
                </span>
              </div>
              <span style={{fontFamily: fontBody, fontSize: layout.compact ? 19 : 22, fontWeight: 800, color: colors.textPrimary}}>
                {value}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          zIndex: 2,
          left: 0,
          right: 0,
          top: `${scan}%`,
          height: 3,
          background: 'linear-gradient(90deg, transparent, rgba(122,106,90,.9), transparent)',
          boxShadow: '0 0 24px rgba(122,106,90,.45)',
          opacity: interpolate(frame, [24, 32, 74, 82], [0, 1, 1, 0], clamp),
        }}
      />
    </div>
  );
};

const HookScene: React.FC<{format: Campaign02Format}> = ({format}) => {
  const layout = useLayout(format);
  const titleIn = useEnter(2, 95);
  const leadIn = useEnter(12);

  return (
    <SceneShell format={format} duration={BEATS.hook.duration}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 92 : layout.compact ? 34 : 76,
        }}
      >
        <div style={{flex: layout.horizontal ? '0 1 730px' : undefined, textAlign: layout.horizontal ? 'left' : 'center'}}>
          <div style={{opacity: leadIn, marginBottom: layout.compact ? 17 : 24}}>
            <Kicker icon={<TrendingUp size={19} />}>Evolução técnica</Kicker>
          </div>
          <div
            style={{
              fontFamily: fontDisplay,
              fontSize: layout.hero,
              lineHeight: 0.92,
              fontWeight: 700,
              letterSpacing: '-0.035em',
              color: colors.textPrimary,
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 34}px)`,
            }}
          >
            Sua receita
            <br />
            <span style={{color: colors.primary}}>pode ser melhor.</span>
          </div>
          <div
            style={{
              marginTop: layout.compact ? 18 : 28,
              fontFamily: fontBody,
              fontSize: layout.lead,
              lineHeight: 1.35,
              color: colors.textSecondary,
              opacity: leadIn,
            }}
          >
            Veja onde ajustar antes de produzir.
          </div>
        </div>
        <RecipeCard format={format} />
      </div>
    </SceneShell>
  );
};

type Metric = {
  label: string;
  value: string;
  fraction: number;
  accent: string;
};

const MetricDial: React.FC<{metric: Metric; delay: number; size: number}> = ({metric, delay, size}) => {
  const frame = useCurrentFrame();
  const enter = useEnter(delay);
  const progress = interpolate(frame - delay, [8, 34], [0, metric.fraction], clamp);
  const angle = -130 + progress * 260;

  return (
    <div
      style={{
        padding: `${size * 0.12}px ${size * 0.1}px`,
        borderRadius: size * 0.13,
        background: 'rgba(255,255,255,.94)',
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.md,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 22}px) scale(${0.95 + enter * 0.05})`,
      }}
    >
      <div style={{position: 'relative', width: size, height: size * 0.72}}>
        <svg width={size} height={size * 0.72} viewBox="0 0 220 160">
          <path d="M25 135 A90 90 0 1 1 195 135" fill="none" stroke="#EEE8DF" strokeWidth="18" strokeLinecap="round" />
          <path d="M25 135 A90 90 0 0 1 60 53" fill="none" stroke={colors.gaugeOrange} strokeWidth="18" strokeLinecap="round" />
          <path d="M68 46 A90 90 0 0 1 152 46" fill="none" stroke={colors.gaugeGreen} strokeWidth="18" strokeLinecap="round" />
          <path d="M160 53 A90 90 0 0 1 195 135" fill="none" stroke={colors.gaugeOrange} strokeWidth="18" strokeLinecap="round" />
          <line
            x1="110"
            y1="135"
            x2="110"
            y2="67"
            stroke={colors.textPrimary}
            strokeWidth="5"
            strokeLinecap="round"
            transform={`rotate(${angle} 110 135)`}
          />
          <circle cx="110" cy="135" r="10" fill={colors.textPrimary} />
          <circle cx="110" cy="135" r="4" fill="white" />
        </svg>
      </div>
      <div style={{fontFamily: fontBody, fontSize: size * 0.14, fontWeight: 800, color: colors.textPrimary, marginTop: -size * 0.05}}>
        {metric.value}
      </div>
      <div style={{fontFamily: fontBody, fontSize: size * 0.092, fontWeight: 700, color: colors.textSecondary, marginTop: 8}}>
        {metric.label}
      </div>
      <div
        style={{
          marginTop: 12,
          padding: '7px 12px',
          borderRadius: 15,
          background: colors.dangerSoft,
          color: colors.danger,
          fontFamily: fontBody,
          fontSize: size * 0.075,
          fontWeight: 800,
        }}
      >
        Fora da faixa
      </div>
    </div>
  );
};

const DiagnosisScene: React.FC<{format: Campaign02Format}> = ({format}) => {
  const layout = useLayout(format);
  const titleIn = useEnter(2);
  const frame = useCurrentFrame();
  const metrics: Metric[] = [
    {label: 'Água', value: '76,6%', fraction: 0.82, accent: colors.info},
    {label: 'PAC', value: '200,8', fraction: 0.23, accent: colors.pacViolet},
    {label: 'Sólidos totais', value: '22,8%', fraction: 0.18, accent: colors.warning},
  ];
  const size = layout.horizontal ? 210 : layout.compact ? 178 : 218;

  return (
    <SceneShell format={format} duration={BEATS.diagnosis.duration}>
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: layout.compact ? 28 : 42}}>
        <div style={{textAlign: 'center', opacity: titleIn, transform: `translateY(${(1 - titleIn) * 24}px)`}}>
          <Kicker icon={<ScanLine size={19} />}>Diagnóstico em segundos</Kicker>
          <div style={{fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 1, fontWeight: 700, color: colors.textPrimary, marginTop: 18}}>
            O desequilíbrio fica visível.
          </div>
        </div>
        <div style={{width: '100%', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: layout.compact ? 16 : 24}}>
          {metrics.map((metric, index) => (
            <MetricDial key={metric.label} metric={metric} delay={10 + index * 7} size={size} />
          ))}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 13,
            padding: layout.compact ? '12px 18px' : '15px 22px',
            borderRadius: 18,
            background: colors.warningSoft,
            border: '1px solid rgba(183,121,31,.24)',
            color: colors.warning,
            fontFamily: fontBody,
            fontSize: layout.compact ? 18 : 21,
            fontWeight: 800,
            opacity: interpolate(frame, [42, 56], [0, 1], clamp),
          }}
        >
          <Target size={22} />
          3 ajustes técnicos encontrados
        </div>
      </div>
    </SceneShell>
  );
};

const Safeguard: React.FC<{label: string; delay: number}> = ({label, delay}) => {
  const enter = useEnter(delay);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 17px',
        borderRadius: 17,
        background: 'rgba(255,255,255,.90)',
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.sm,
        opacity: enter,
        transform: `translateX(${(1 - enter) * 20}px)`,
      }}
    >
      <div style={{width: 31, height: 31, borderRadius: 10, display: 'grid', placeItems: 'center', background: colors.successSoft, color: colors.success}}>
        <Check size={18} strokeWidth={3} />
      </div>
      <span style={{fontFamily: fontBody, fontSize: 19, fontWeight: 750, color: colors.textPrimary}}>{label}</span>
    </div>
  );
};

const OptimizationScene: React.FC<{format: Campaign02Format}> = ({format}) => {
  const layout = useLayout(format);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const coreIn = spring({frame: frame - 5, fps, config: {damping: 16, stiffness: 100, mass: 0.9}});
  const rotation = frame * 1.15;
  const completed = interpolate(frame, [45, 115], [0, 1], clamp);
  const safeguards = ['Identidade preservada', 'Dosagens respeitadas', 'Peso final mantido'];

  return (
    <SceneShell format={format} duration={BEATS.optimization.duration}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 100 : layout.compact ? 30 : 58,
        }}
      >
        <div style={{flex: layout.horizontal ? '0 1 700px' : undefined, textAlign: layout.horizontal ? 'left' : 'center'}}>
          <Kicker icon={<SlidersHorizontal size={19} />}>Otimização guiada</Kicker>
          <div
            style={{
              fontFamily: fontDisplay,
              fontSize: layout.title,
              lineHeight: 0.98,
              fontWeight: 700,
              color: colors.textPrimary,
              marginTop: 20,
              maxWidth: 720,
            }}
          >
            Ajustes melhores.
            <br />
            <span style={{color: colors.primary}}>Regras preservadas.</span>
          </div>
          <div style={{marginTop: layout.compact ? 20 : 30, display: 'flex', flexDirection: layout.horizontal ? 'column' : 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 12}}>
            {safeguards.map((label, index) => (
              <Safeguard key={label} label={label} delay={18 + index * 9} />
            ))}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            width: layout.horizontal ? 470 : layout.compact ? 300 : 430,
            height: layout.horizontal ? 470 : layout.compact ? 300 : 430,
            display: 'grid',
            placeItems: 'center',
            opacity: coreIn,
            transform: `scale(${0.86 + coreIn * 0.14})`,
          }}
        >
          {[0, 1, 2].map((ring) => (
            <div
              key={ring}
              style={{
                position: 'absolute',
                inset: ring * (layout.compact ? 37 : 49),
                borderRadius: '50%',
                border: `${ring === 0 ? 2 : 1}px ${ring === 1 ? 'dashed' : 'solid'} rgba(122,106,90,${0.18 + ring * 0.08})`,
                transform: `rotate(${rotation * (ring % 2 === 0 ? 1 : -1)}deg)`,
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              inset: layout.compact ? 65 : 92,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #FFFFFF, #EFE8DF)',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 30px 80px rgba(63,48,40,.18)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Gauge size={layout.compact ? 38 : 52} color={completed > 0.88 ? colors.success : colors.primary} strokeWidth={1.8} />
            <div style={{fontFamily: fontDisplay, fontSize: layout.compact ? 35 : 50, fontWeight: 700, color: colors.textPrimary, marginTop: 9}}>
              {Math.round(completed * 100)}%
            </div>
            <div style={{fontFamily: fontBody, fontSize: layout.compact ? 14 : 18, fontWeight: 750, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: tracking.wide}}>
              analisado
            </div>
          </div>
          {[35, 155, 275].map((baseAngle, index) => {
            const rad = ((baseAngle + rotation * 0.35) * Math.PI) / 180;
            const orbit = layout.compact ? 125 : 182;
            return (
              <div
                key={baseAngle}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: layout.compact ? 30 : 40,
                  height: layout.compact ? 30 : 40,
                  marginLeft: layout.compact ? -15 : -20,
                  marginTop: layout.compact ? -15 : -20,
                  borderRadius: '50%',
                  background: index === 2 ? colors.success : colors.primary,
                  border: '5px solid rgba(255,255,255,.92)',
                  boxShadow: '0 9px 24px rgba(63,48,40,.22)',
                  transform: `translate(${Math.cos(rad) * orbit}px, ${Math.sin(rad) * orbit}px)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};

const comparisonMetrics = [
  {label: 'Água', before: 76.6, after: 67, suffix: '%', decimals: 1},
  {label: 'PAC', before: 200.8, after: 299.6, suffix: '', decimals: 1},
  {label: 'Sólidos totais', before: 22.8, after: 32.9, suffix: '%', decimals: 1},
];

const ComparisonScene: React.FC<{format: Campaign02Format}> = ({format}) => {
  const layout = useLayout(format);
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [18, 78], [0, 1], clamp);
  const titleIn = useEnter(1);

  return (
    <SceneShell format={format} duration={BEATS.comparison.duration}>
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: layout.compact ? 24 : 34}}>
        <div style={{textAlign: 'center', opacity: titleIn}}>
          <Kicker icon={<TrendingUp size={19} />}>Antes e depois</Kicker>
          <div style={{fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 1, fontWeight: 700, color: colors.textPrimary, marginTop: 17}}>
            A melhoria aparece nos números.
          </div>
        </div>
        <div
          style={{
            width: '100%',
            borderRadius: layout.compact ? 25 : 30,
            overflow: 'hidden',
            background: 'rgba(255,255,255,.95)',
            border: `1px solid ${colors.border}`,
            boxShadow: '0 28px 74px rgba(63,48,40,.12)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.25fr .8fr 54px .8fr',
              padding: layout.compact ? '14px 20px' : '17px 27px',
              background: colors.surfaceMuted,
              borderBottom: `1px solid ${colors.borderSoft}`,
              fontFamily: fontBody,
              fontSize: layout.caption,
              fontWeight: 800,
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: tracking.wide,
            }}
          >
            <span>Parâmetro</span><span>Antes</span><span /><span>Depois</span>
          </div>
          {comparisonMetrics.map((metric, index) => {
            const rowIn = spring({frame: frame - 7 - index * 6, fps: CAMPAIGN_02_FPS, config: {damping: 19, stiffness: 110, mass: 0.78}});
            const current = metric.before + (metric.after - metric.before) * progress;
            return (
              <div
                key={metric.label}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.25fr .8fr 54px .8fr',
                  alignItems: 'center',
                  padding: layout.compact ? '17px 20px' : '21px 27px',
                  borderBottom: index === comparisonMetrics.length - 1 ? 'none' : `1px solid ${colors.borderSoft}`,
                  opacity: rowIn,
                  transform: `translateY(${(1 - rowIn) * 16}px)`,
                }}
              >
                <span style={{fontFamily: fontBody, fontSize: layout.compact ? 19 : 24, fontWeight: 750, color: colors.textPrimary}}>{metric.label}</span>
                <span style={{fontFamily: fontBody, fontSize: layout.compact ? 18 : 23, fontWeight: 650, color: colors.textMuted}}>{metric.before.toFixed(metric.decimals).replace('.', ',')}{metric.suffix}</span>
                <div style={{width: 36, height: 36, borderRadius: 12, display: 'grid', placeItems: 'center', background: colors.primarySoft, color: colors.primary}}>
                  <ArrowRight size={20} />
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 9}}>
                  <span style={{fontFamily: fontBody, fontSize: layout.compact ? 20 : 26, fontWeight: 850, color: colors.success}}>{current.toFixed(metric.decimals).replace('.', ',')}{metric.suffix}</span>
                  <CheckCircle2 size={layout.compact ? 18 : 22} color={colors.success} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SceneShell>
  );
};

const SafetyScene: React.FC<{format: Campaign02Format}> = ({format}) => {
  const layout = useLayout(format);
  const iconIn = useEnter(2, 90);
  const copyIn = useEnter(11);

  return (
    <SceneShell format={format} duration={BEATS.safety.duration}>
      <div style={{width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div
          style={{
            width: layout.compact ? 92 : 126,
            height: layout.compact ? 92 : 126,
            borderRadius: layout.compact ? 29 : 38,
            display: 'grid',
            placeItems: 'center',
            background: colors.successSoft,
            border: '1px solid rgba(47,133,90,.20)',
            boxShadow: '0 24px 60px rgba(47,133,90,.14)',
            color: colors.success,
            opacity: iconIn,
            transform: `scale(${0.72 + iconIn * 0.28}) rotate(${(1 - iconIn) * -6}deg)`,
          }}
        >
          <ShieldCheck size={layout.compact ? 48 : 66} strokeWidth={1.8} />
        </div>
        <div style={{opacity: copyIn, transform: `translateY(${(1 - copyIn) * 22}px)`}}>
          <div style={{fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 1, fontWeight: 700, color: colors.textPrimary, marginTop: layout.compact ? 22 : 30}}>
            Você revisa. Você decide.
          </div>
          <div style={{fontFamily: fontBody, fontSize: layout.lead, lineHeight: 1.35, color: colors.textSecondary, marginTop: 15}}>
            Nada muda sem sua confirmação.
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const CtaScene: React.FC<{format: Campaign02Format}> = ({format}) => {
  const layout = useLayout(format);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoIn = spring({frame: frame, fps, config: {damping: 16, stiffness: 105, mass: 0.82}});
  const copyIn = spring({frame: frame - 7, fps, config: {damping: 17, stiffness: 112, mass: 0.76}});
  const ctaIn = spring({frame: frame - 18, fps, config: {damping: 14, stiffness: 135, mass: 0.68}});

  return (
    <SceneShell format={format} duration={BEATS.cta.duration} dark fadeOut={1}>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 72 : layout.compact ? 20 : 32,
          textAlign: layout.horizontal ? 'left' : 'center',
        }}
      >
        <div
          style={{
            width: layout.horizontal ? 200 : layout.compact ? 100 : 136,
            height: layout.horizontal ? 200 : layout.compact ? 100 : 136,
            display: 'grid',
            placeItems: 'center',
            borderRadius: layout.horizontal ? 54 : 38,
            background: 'rgba(255,255,255,.10)',
            border: '1px solid rgba(255,255,255,.18)',
            boxShadow: '0 28px 80px rgba(0,0,0,.18)',
            opacity: logoIn,
            transform: `scale(${0.74 + logoIn * 0.26})`,
          }}
        >
          <Img
            src={staticFile('brand/logo-dark-transparent.png')}
            style={{width: layout.horizontal ? 142 : layout.compact ? 72 : 98, height: layout.horizontal ? 142 : layout.compact ? 72 : 98, objectFit: 'contain'}}
          />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: layout.horizontal ? 'flex-start' : 'center', gap: layout.compact ? 14 : 18, opacity: copyIn}}>
          <Kicker dark icon={<FlaskConical size={19} />}>Inteligência para gelato</Kicker>
          <div style={{fontFamily: fontDisplay, fontSize: layout.horizontal ? 78 : layout.compact ? 56 : 72, lineHeight: 0.98, fontWeight: 700, color: colors.textInverse, letterSpacing: '-0.03em'}}>
            Melhore antes de produzir.
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 15,
              padding: layout.compact ? '13px 20px' : '16px 25px',
              borderRadius: 17,
              background: colors.surface,
              color: colors.primary,
              boxShadow: '0 18px 44px rgba(0,0,0,.2)',
              opacity: ctaIn,
              transform: `translateY(${(1 - ctaIn) * 15}px) scale(${0.94 + ctaIn * 0.06})`,
              fontFamily: fontBody,
              fontSize: layout.compact ? 19 : 23,
              fontWeight: 850,
            }}
          >
            Começar grátis <ArrowRight size={layout.compact ? 20 : 24} strokeWidth={2.6} />
          </div>
          <div style={{opacity: ctaIn, fontFamily: fontDisplay, fontSize: layout.compact ? 18 : 22, fontWeight: 600, letterSpacing: tracking.industrial, color: 'rgba(255,255,255,.86)', textTransform: 'uppercase'}}>
            icone.academy
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

export const Campaign02SuaReceitaMelhor: React.FC<Campaign02Props> = ({format}) => (
  <AbsoluteFill style={{backgroundColor: colors.background}}>
    <Sequence from={BEATS.hook.from} durationInFrames={BEATS.hook.duration}>
      <HookScene format={format} />
    </Sequence>
    <Sequence from={BEATS.diagnosis.from} durationInFrames={BEATS.diagnosis.duration}>
      <DiagnosisScene format={format} />
    </Sequence>
    <Sequence from={BEATS.optimization.from} durationInFrames={BEATS.optimization.duration}>
      <OptimizationScene format={format} />
    </Sequence>
    <Sequence from={BEATS.comparison.from} durationInFrames={BEATS.comparison.duration}>
      <ComparisonScene format={format} />
    </Sequence>
    <Sequence from={BEATS.safety.from} durationInFrames={BEATS.safety.duration}>
      <SafetyScene format={format} />
    </Sequence>
    <Sequence from={BEATS.cta.from} durationInFrames={BEATS.cta.duration}>
      <CtaScene format={format} />
    </Sequence>
  </AbsoluteFill>
);
