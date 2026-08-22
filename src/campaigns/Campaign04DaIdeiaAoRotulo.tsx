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
  Beaker,
  BookOpenCheck,
  Box,
  Check,
  ChevronRight,
  CircleDollarSign,
  FileCheck2,
  FlaskConical,
  Gauge,
  Leaf,
  PackageCheck,
  ScanLine,
  ShoppingBag,
  Sparkles,
  Tag,
  Truck,
} from 'lucide-react';
import {fontBody, fontDisplay} from '../fonts';
import {tracking} from '../theme';

export const CAMPAIGN_04_FPS = 30;
export const CAMPAIGN_04_DURATION = CAMPAIGN_04_FPS * 30;

export type Campaign04Format = 'vertical' | 'square' | 'horizontal';

export type Campaign04Props = {
  format: Campaign04Format;
};

const F = (seconds: number) => Math.round(seconds * CAMPAIGN_04_FPS);

const BEATS = {
  spark: {from: 0, duration: F(4.8)},
  structure: {from: F(4.1), duration: F(7.2)},
  intelligence: {from: F(10.6), duration: F(6.7)},
  unfold: {from: F(16.6), duration: F(6.5)},
  ecosystem: {from: F(22.4), duration: F(4.4)},
  cta: {from: F(26.1), duration: F(3.9)},
} as const;

const palette = {
  ink: '#241C18',
  inkLift: '#342720',
  paper: '#F6F0E7',
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
  white: '#FFFFFF',
  muted: '#74685F',
  line: 'rgba(73,55,45,.14)',
} as const;

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

type Layout = {
  horizontal: boolean;
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

const useLayout = (format: Campaign04Format): Layout => {
  if (format === 'horizontal') {
    return {
      horizontal: true,
      square: false,
      paddingX: 108,
      safeTop: 68,
      safeBottom: 68,
      contentWidth: 1704,
      hero: 118,
      title: 70,
      lead: 31,
      body: 24,
      label: 18,
      caption: 15,
    };
  }

  if (format === 'square') {
    return {
      horizontal: false,
      square: true,
      paddingX: 58,
      safeTop: 56,
      safeBottom: 56,
      contentWidth: 964,
      hero: 82,
      title: 55,
      lead: 26,
      body: 20,
      label: 16,
      caption: 13,
    };
  }

  return {
    horizontal: false,
    square: false,
    paddingX: 58,
    safeTop: 176,
    safeBottom: 248,
    contentWidth: 964,
    hero: 112,
    title: 72,
    lead: 32,
    body: 24,
    label: 18,
    caption: 15,
  };
};

const useEnter = (delay = 0, stiffness = 96) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: {damping: 18, stiffness, mass: 0.82},
  });
};

const sceneOpacity = (frame: number, duration: number, fade = 14) =>
  interpolate(frame, [0, fade, duration - fade, duration], [0, 1, 1, 0], clamp);

const AmbientCanvas: React.FC<{
  mode?: 'paper' | 'ink' | 'teal';
  accent?: string;
}> = ({mode = 'paper', accent = palette.coral}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const dark = mode !== 'paper';
  const driftX = Math.sin(frame * 0.012) * width * 0.035;
  const driftY = Math.cos(frame * 0.009) * height * 0.03;
  const scan = interpolate(frame % 150, [0, 150], [-12, 112]);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background:
            mode === 'paper'
              ? `radial-gradient(circle at 18% 12%, ${accent}25, transparent 28%), radial-gradient(circle at 82% 86%, ${palette.teal}18, transparent 31%), linear-gradient(145deg, ${palette.paperLift}, ${palette.paper})`
              : mode === 'teal'
                ? `radial-gradient(circle at 74% 22%, ${palette.saffron}24, transparent 25%), linear-gradient(145deg, #0D6658, #073E37)`
                : `radial-gradient(circle at 20% 18%, ${accent}25, transparent 28%), radial-gradient(circle at 82% 82%, ${palette.violet}20, transparent 30%), linear-gradient(145deg, ${palette.inkLift}, ${palette.ink})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: width * 0.54,
          height: width * 0.54,
          borderRadius: '50%',
          border: `1px solid ${dark ? 'rgba(255,255,255,.10)' : 'rgba(73,55,45,.09)'}`,
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
          opacity: dark ? 0.16 : 0.11,
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
          opacity: dark ? 0.16 : 0.08,
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 24px ${accent}`,
        }}
      />
    </AbsoluteFill>
  );
};

const BrandFlag: React.FC<{dark?: boolean; label?: string}> = ({dark = false, label = 'DO PRIMEIRO GRAMA AO RÓTULO'}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: fontBody,
      fontSize: 14,
      fontWeight: 800,
      letterSpacing: tracking.industrial,
      textTransform: 'uppercase',
      color: dark ? 'rgba(255,255,255,.72)' : palette.muted,
    }}
  >
    <span style={{width: 24, height: 3, borderRadius: 2, background: palette.coral}} />
    {label}
  </div>
);

const FlowRibbon: React.FC<{
  progress: number;
  horizontal?: boolean;
  colors?: string[];
  muted?: boolean;
}> = ({progress, horizontal = false, colors = [palette.coral, palette.saffron, palette.teal, palette.blue, palette.violet], muted = false}) => {
  const count = colors.length;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: horizontal ? 8 : 6,
        width: horizontal ? '100%' : 18,
        height: horizontal ? 18 : '100%',
      }}
    >
      {colors.map((color, index) => {
        const local = interpolate(progress, [index / count, (index + 1) / count], [0, 1], clamp);
        return (
          <div
            key={color}
            style={{
              flex: 1,
              alignSelf: 'stretch',
              borderRadius: 9,
              background: muted ? 'rgba(255,255,255,.16)' : color,
              opacity: 0.2 + local * 0.8,
              transform: horizontal ? `scaleX(${0.15 + local * 0.85})` : `scaleY(${0.15 + local * 0.85})`,
              transformOrigin: horizontal ? 'left center' : 'center top',
              boxShadow: local > 0.82 && !muted ? `0 0 22px ${color}60` : 'none',
            }}
          />
        );
      })}
    </div>
  );
};

const IdeaCore: React.FC<{format: Campaign04Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 8, fps, config: {damping: 15, stiffness: 80, mass: 0.9}});
  const orbit = frame * 0.42;
  const size = format === 'horizontal' ? 450 : format === 'square' ? 390 : 520;
  const chips = [
    {label: 'Ingrediente', color: palette.coral, angle: 0},
    {label: 'Técnica', color: palette.teal, angle: 120},
    {label: 'Ideia', color: palette.saffron, angle: 240},
  ];

  return (
    <div style={{position: 'relative', width: size, height: size, transform: `scale(${0.72 + enter * 0.28})`, opacity: enter}}>
      {[1, 0.72, 0.43].map((scale, index) => (
        <div
          key={scale}
          style={{
            position: 'absolute',
            inset: `${(1 - scale) * 50}%`,
            borderRadius: '50%',
            border: `1px solid rgba(255,255,255,${0.11 + index * 0.04})`,
            transform: `rotate(${orbit * (index % 2 === 0 ? 1 : -1)}deg)`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          inset: '29%',
          borderRadius: '46% 54% 58% 42% / 51% 45% 55% 49%',
          background: `linear-gradient(145deg, ${palette.saffron}, ${palette.coral})`,
          boxShadow: `0 30px 90px ${palette.coral}55, inset 0 1px 0 rgba(255,255,255,.55)`,
          transform: `rotate(${frame * 0.18}deg) scale(${0.94 + Math.sin(frame * 0.055) * 0.035})`,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <Sparkles color={palette.white} size={size * 0.14} strokeWidth={1.7} />
      </div>
      {chips.map((chip, index) => {
        const angle = ((chip.angle + orbit * 0.32) * Math.PI) / 180;
        const radius = size * 0.41;
        const x = size / 2 + Math.cos(angle) * radius;
        const y = size / 2 + Math.sin(angle) * radius;
        const chipIn = spring({frame: frame - 18 - index * 7, fps, config: {damping: 16, stiffness: 110}});
        return (
          <div
            key={chip.label}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${0.7 + chipIn * 0.3})`,
              opacity: chipIn,
              padding: '10px 17px',
              borderRadius: 24,
              background: 'rgba(255,255,255,.94)',
              border: `1px solid ${chip.color}55`,
              boxShadow: '0 10px 28px rgba(0,0,0,.18)',
              color: palette.ink,
              fontFamily: fontBody,
              fontSize: format === 'square' ? 14 : 17,
              fontWeight: 800,
              whiteSpace: 'nowrap',
            }}
          >
            {chip.label}
          </div>
        );
      })}
    </div>
  );
};

const SparkScene: React.FC<{format: Campaign04Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useLayout(format);
  const titleIn = useEnter(8, 82);
  const leadIn = useEnter(22, 105);
  const opacity = sceneOpacity(frame, BEATS.spark.duration, 15);

  return (
    <AbsoluteFill style={{opacity, color: palette.white}}>
      <AmbientCanvas mode="ink" accent={palette.coral} />
      <div
        style={{
          position: 'absolute',
          inset: `${layout.safeTop}px ${layout.paddingX}px ${layout.safeBottom}px`,
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 90 : layout.square ? 34 : 86,
        }}
      >
        <div style={{width: layout.horizontal ? '52%' : '100%', maxWidth: layout.horizontal ? 840 : 880}}>
          <BrandFlag dark label="FILME FINAL · DA IDEIA AO RÓTULO" />
          <h1
            style={{
              margin: layout.horizontal ? '28px 0 20px' : '26px 0 18px',
              fontFamily: fontDisplay,
              fontSize: layout.hero,
              lineHeight: 0.94,
              letterSpacing: '-0.035em',
              textTransform: 'uppercase',
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 34}px)`,
            }}
          >
            Toda grande receita
            <span style={{display: 'block', color: palette.saffron}}>começa com uma ideia.</span>
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 720,
              fontFamily: fontBody,
              fontSize: layout.lead,
              lineHeight: 1.38,
              color: 'rgba(255,255,255,.72)',
              opacity: leadIn,
              transform: `translateY(${(1 - leadIn) * 18}px)`,
            }}
          >
            O que acontece depois define tudo.
          </p>
        </div>
        <IdeaCore format={format} />
      </div>
    </AbsoluteFill>
  );
};

type Station = {
  title: string;
  eyebrow: string;
  icon: React.ComponentType<{size?: number; color?: string; strokeWidth?: number}>;
  color: string;
  soft: string;
};

const stations: Station[] = [
  {title: 'Ingredientes', eyebrow: 'Escolha', icon: Leaf, color: palette.coral, soft: palette.coralSoft},
  {title: 'Neutros', eyebrow: 'Estruture', icon: Beaker, color: palette.saffron, soft: palette.saffronSoft},
  {title: 'Receita', eyebrow: 'Formule', icon: FlaskConical, color: palette.teal, soft: palette.tealSoft},
];

const StationCard: React.FC<{
  station: Station;
  index: number;
  active: number;
  compact: boolean;
}> = ({station, index, active, compact}) => {
  const Icon = station.icon;
  const local = interpolate(active, [index - 0.5, index + 0.25], [0, 1], clamp);
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: compact ? '22px 20px' : '30px 28px',
        borderRadius: compact ? 22 : 28,
        background: palette.paperLift,
        border: `1px solid ${local > 0.55 ? station.color : palette.line}`,
        boxShadow: local > 0.55 ? `0 20px 48px ${station.color}24` : '0 12px 32px rgba(73,55,45,.08)',
        transform: `translateY(${(1 - local) * 18}px) scale(${0.96 + local * 0.04})`,
        opacity: 0.45 + local * 0.55,
        display: 'flex',
        flexDirection: compact ? 'row' : 'column',
        alignItems: compact ? 'center' : 'flex-start',
        gap: compact ? 18 : 26,
      }}
    >
      <div
        style={{
          width: compact ? 54 : 72,
          height: compact ? 54 : 72,
          borderRadius: compact ? 17 : 22,
          display: 'grid',
          placeItems: 'center',
          background: station.soft,
          color: station.color,
          flexShrink: 0,
        }}
      >
        <Icon size={compact ? 27 : 34} strokeWidth={1.8} />
      </div>
      <div>
        <div style={{fontFamily: fontBody, fontSize: compact ? 12 : 14, letterSpacing: tracking.industrial, textTransform: 'uppercase', fontWeight: 800, color: station.color}}>
          0{index + 1} · {station.eyebrow}
        </div>
        <div style={{marginTop: 8, fontFamily: fontDisplay, fontSize: compact ? 30 : 38, lineHeight: 1, fontWeight: 600, color: palette.ink}}>
          {station.title}
        </div>
      </div>
      <div style={{marginLeft: compact ? 'auto' : 0, marginTop: compact ? 0 : 'auto', color: station.color}}>
        <ChevronRight size={compact ? 24 : 28} />
      </div>
    </div>
  );
};

const StructureScene: React.FC<{format: Campaign04Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useLayout(format);
  const opacity = sceneOpacity(frame, BEATS.structure.duration, 14);
  const titleIn = useEnter(8);
  const progress = interpolate(frame, [20, 155], [0, 1], clamp);
  const active = progress * 2.6;
  const verticalCards = format === 'vertical';

  return (
    <AbsoluteFill style={{opacity, color: palette.ink}}>
      <AmbientCanvas mode="paper" accent={palette.saffron} />
      <div
        style={{
          position: 'absolute',
          inset: `${layout.safeTop}px ${layout.paddingX}px ${layout.safeBottom}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: layout.square ? 28 : 44,
        }}
      >
        <div style={{display: 'flex', flexDirection: layout.horizontal ? 'row' : 'column', alignItems: layout.horizontal ? 'flex-end' : 'flex-start', justifyContent: 'space-between', gap: 18}}>
          <div>
            <BrandFlag label="UM FLUXO, NÃO FERRAMENTAS SOLTAS" />
            <h2
              style={{
                margin: '20px 0 0',
                fontFamily: fontDisplay,
                fontSize: layout.title,
                lineHeight: 0.98,
                textTransform: 'uppercase',
                letterSpacing: '-0.025em',
                opacity: titleIn,
                transform: `translateY(${(1 - titleIn) * 24}px)`,
              }}
            >
              A ideia ganha
              <span style={{color: palette.teal}}> estrutura.</span>
            </h2>
          </div>
          <p style={{margin: 0, maxWidth: layout.horizontal ? 520 : 790, fontFamily: fontBody, fontSize: layout.body, lineHeight: 1.45, color: palette.muted}}>
            Ingredientes, neutros e formulação trabalham no mesmo caminho.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: verticalCards ? 'column' : 'row',
            alignItems: 'stretch',
            gap: verticalCards ? 14 : 18,
            minHeight: verticalCards ? 520 : layout.square ? 310 : 350,
          }}
        >
          {stations.map((station, index) => (
            <React.Fragment key={station.title}>
              <StationCard station={station} index={index} active={active} compact={verticalCards} />
              {index < stations.length - 1 ? (
                <div style={{width: verticalCards ? '100%' : 50, height: verticalCards ? 26 : 'auto', display: 'grid', placeItems: 'center'}}>
                  <div style={{width: verticalCards ? 4 : '100%', height: verticalCards ? '100%' : 4, borderRadius: 3, background: `linear-gradient(${verticalCards ? '180deg' : '90deg'}, ${station.color}, ${stations[index + 1].color})`, transform: verticalCards ? `scaleY(${progress})` : `scaleX(${progress})`, transformOrigin: verticalCards ? 'top' : 'left'}} />
                </div>
              ) : null}
            </React.Fragment>
          ))}
        </div>
        <div style={{height: layout.square ? 12 : 16}}>
          <FlowRibbon progress={progress} horizontal />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const GaugeArc: React.FC<{label: string; status: string; color: string; delay: number; size: number}> = ({label, status, color, delay, size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - delay, fps, config: {damping: 18, stiffness: 105}});
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: enter, transform: `translateX(${(1 - enter) * 22}px)`}}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          padding: 5,
          background: `conic-gradient(${color} 0deg ${80 + enter * 220}deg, rgba(255,255,255,.12) ${80 + enter * 220}deg 360deg)`,
        }}
      >
        <div style={{width: '100%', height: '100%', borderRadius: '50%', background: palette.inkLift, display: 'grid', placeItems: 'center'}}>
          <Check size={size * 0.35} color={color} strokeWidth={2.4} />
        </div>
      </div>
      <div>
        <div style={{fontFamily: fontBody, fontSize: size * 0.3, fontWeight: 750, color: palette.white}}>{label}</div>
        <div style={{marginTop: 3, fontFamily: fontBody, fontSize: size * 0.23, color}}>{status}</div>
      </div>
    </div>
  );
};

const RecipeWorkbench: React.FC<{format: Campaign04Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 12, fps, config: {damping: 18, stiffness: 86, mass: 0.9}});
  const compact = format === 'square';
  const narrow = format === 'vertical';
  const ingredients = [
    {name: 'Fruta', amount: '450 g', color: palette.coral},
    {name: 'Base', amount: '330 g', color: palette.saffron},
    {name: 'Açúcares', amount: '215 g', color: palette.violet},
    {name: 'Neutro', amount: '5 g', color: palette.teal},
  ];

  return (
    <div
      style={{
        width: '100%',
        borderRadius: compact ? 24 : 30,
        border: '1px solid rgba(255,255,255,.15)',
        background: 'rgba(255,255,255,.055)',
        boxShadow: '0 34px 90px rgba(0,0,0,.28)',
        overflow: 'hidden',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 28}px) scale(${0.97 + enter * 0.03})`,
      }}
    >
      <div style={{padding: compact ? '18px 20px' : '22px 26px', borderBottom: '1px solid rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <div style={{fontFamily: fontBody, fontSize: compact ? 11 : 13, letterSpacing: tracking.industrial, color: palette.saffron, textTransform: 'uppercase', fontWeight: 800}}>Receita em análise</div>
          <div style={{marginTop: 6, fontFamily: fontDisplay, fontSize: compact ? 25 : 32, color: palette.white}}>Gelato autoral</div>
        </div>
        <div style={{padding: '8px 12px', borderRadius: 16, background: 'rgba(21,151,123,.16)', color: palette.teal, fontFamily: fontBody, fontSize: compact ? 11 : 13, fontWeight: 800}}>1.000 g</div>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1.1fr .9fr'}}>
        <div style={{padding: compact ? 18 : 24, borderRight: narrow ? 'none' : '1px solid rgba(255,255,255,.1)'}}>
          {ingredients.map((ingredient, index) => {
            const rowIn = spring({frame: frame - 22 - index * 5, fps, config: {damping: 20, stiffness: 115}});
            return (
              <div key={ingredient.name} style={{height: compact ? 44 : 54, borderBottom: index < ingredients.length - 1 ? '1px solid rgba(255,255,255,.08)' : 'none', display: 'flex', alignItems: 'center', gap: 12, opacity: rowIn, transform: `translateX(${(1 - rowIn) * -18}px)`}}>
                <span style={{width: 8, height: 8, borderRadius: '50%', background: ingredient.color, boxShadow: `0 0 12px ${ingredient.color}`}} />
                <span style={{fontFamily: fontBody, fontSize: compact ? 14 : 17, color: 'rgba(255,255,255,.82)', flex: 1}}>{ingredient.name}</span>
                <span style={{fontFamily: fontBody, fontSize: compact ? 13 : 16, fontWeight: 750, color: palette.white}}>{ingredient.amount}</span>
              </div>
            );
          })}
        </div>
        <div style={{padding: compact ? 18 : 24, display: 'flex', flexDirection: narrow ? 'row' : 'column', justifyContent: 'center', flexWrap: 'wrap', gap: compact ? 13 : 18}}>
          <GaugeArc label="Equilíbrio" status="Controlado" color={palette.teal} delay={32} size={compact ? 50 : 62} />
          <GaugeArc label="Custo/kg" status="Visível" color={palette.saffron} delay={40} size={compact ? 50 : 62} />
          <GaugeArc label="Fornecedores" status="Comparáveis" color={palette.blue} delay={48} size={compact ? 50 : 62} />
        </div>
      </div>
    </div>
  );
};

const IntelligenceScene: React.FC<{format: Campaign04Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useLayout(format);
  const opacity = sceneOpacity(frame, BEATS.intelligence.duration, 14);
  const titleIn = useEnter(7);

  return (
    <AbsoluteFill style={{opacity, color: palette.white}}>
      <AmbientCanvas mode="ink" accent={palette.teal} />
      <div
        style={{
          position: 'absolute',
          inset: `${layout.safeTop}px ${layout.paddingX}px ${layout.safeBottom}px`,
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 72 : layout.square ? 26 : 64,
        }}
      >
        <div style={{width: layout.horizontal ? '41%' : '100%'}}>
          <BrandFlag dark label="DECISÃO ANTES DA PRODUÇÃO" />
          <h2
            style={{
              margin: '20px 0 18px',
              fontFamily: fontDisplay,
              fontSize: layout.title,
              lineHeight: 0.98,
              textTransform: 'uppercase',
              letterSpacing: '-0.025em',
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 25}px)`,
            }}
          >
            A ciência entra
            <span style={{display: 'block', color: palette.teal}}>antes do lote.</span>
          </h2>
          <p style={{margin: 0, maxWidth: 610, fontFamily: fontBody, fontSize: layout.body, lineHeight: 1.45, color: 'rgba(255,255,255,.68)'}}>
            Técnica, custo e fornecedor aparecem juntos — quando ainda dá tempo de decidir.
          </p>
        </div>
        <div style={{width: layout.horizontal ? '55%' : '100%', maxWidth: layout.horizontal ? 970 : 920}}>
          <RecipeWorkbench format={format} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

type OutputCardData = {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{size?: number; color?: string; strokeWidth?: number}>;
  color: string;
  soft: string;
};

const outputs: OutputCardData[] = [
  {title: 'Ficha técnica', subtitle: 'Informação organizada', icon: FileCheck2, color: palette.blue, soft: palette.blueSoft},
  {title: 'Rótulo', subtitle: 'Produto identificado', icon: Tag, color: palette.violet, soft: palette.violetSoft},
  {title: 'Compras', subtitle: 'Ingredientes conectados', icon: ShoppingBag, color: palette.coral, soft: palette.coralSoft},
];

const OutputCard: React.FC<{item: OutputCardData; index: number; compact: boolean}> = ({item, index, compact}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 22 - index * 10, fps, config: {damping: 17, stiffness: 96, mass: 0.84}});
  const Icon = item.icon;
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: compact ? '20px 18px' : '27px 25px',
        borderRadius: compact ? 22 : 28,
        background: palette.paperLift,
        border: `1px solid ${item.color}44`,
        boxShadow: `0 18px 42px ${item.color}18`,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 44}px) rotate(${(1 - enter) * (index - 1) * 3}deg)`,
      }}
    >
      <div style={{width: compact ? 52 : 64, height: compact ? 52 : 64, borderRadius: compact ? 17 : 20, background: item.soft, display: 'grid', placeItems: 'center'}}>
        <Icon size={compact ? 26 : 31} color={item.color} strokeWidth={1.8} />
      </div>
      <div style={{marginTop: compact ? 18 : 24, fontFamily: fontDisplay, fontSize: compact ? 27 : 34, lineHeight: 1, color: palette.ink}}>{item.title}</div>
      <div style={{marginTop: 9, fontFamily: fontBody, fontSize: compact ? 13 : 16, lineHeight: 1.35, color: palette.muted}}>{item.subtitle}</div>
      <div style={{marginTop: compact ? 18 : 26, height: 4, borderRadius: 4, background: item.soft, overflow: 'hidden'}}>
        <div style={{width: `${enter * 100}%`, height: '100%', background: item.color}} />
      </div>
    </div>
  );
};

const ProductSheet: React.FC<{format: Campaign04Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 8, fps, config: {damping: 17, stiffness: 83, mass: 0.9}});
  const compact = format === 'square';
  const narrow = format === 'vertical';
  const width = narrow ? '75%' : compact ? 310 : 360;
  return (
    <div style={{width, minWidth: narrow ? 0 : compact ? 310 : 360, aspectRatio: '0.72', position: 'relative', perspective: 900, opacity: enter, transform: `translateY(${(1 - enter) * 34}px)`}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: compact ? 20 : 24,
          background: palette.white,
          border: '1px solid rgba(73,55,45,.13)',
          boxShadow: '0 30px 75px rgba(73,55,45,.18)',
          transform: `rotateY(${(1 - enter) * -48}deg) rotateZ(${(1 - enter) * -4}deg)`,
          transformOrigin: 'left center',
          padding: compact ? 22 : 28,
          overflow: 'hidden',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{width: compact ? 42 : 50, height: compact ? 42 : 50, borderRadius: 15, background: palette.taupeSoft, display: 'grid', placeItems: 'center'}}>
            <FlaskConical size={compact ? 22 : 26} color={palette.taupe} />
          </div>
          <span style={{fontFamily: fontBody, fontSize: compact ? 10 : 12, color: palette.muted, letterSpacing: tracking.industrial}}>ICONE · FICHA</span>
        </div>
        <div style={{marginTop: compact ? 24 : 31, fontFamily: fontDisplay, fontSize: compact ? 26 : 32, lineHeight: 1.05, color: palette.ink}}>Gelato autoral</div>
        <div style={{marginTop: 10, fontFamily: fontBody, fontSize: compact ? 11 : 13, color: palette.muted}}>Especificação do produto</div>
        <div style={{marginTop: compact ? 26 : 34, borderTop: `2px solid ${palette.ink}`}} />
        {['Composição', 'Informação nutricional', 'Alérgenos', 'Conservação'].map((line, index) => (
          <div key={line} style={{height: narrow ? 78 : compact ? 43 : 52, borderBottom: `1px solid ${palette.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <span style={{fontFamily: fontBody, fontSize: compact ? 10 : 12, color: palette.muted}}>{line}</span>
            <span style={{width: `${38 + index * 8}%`, height: 5, borderRadius: 4, background: index === 1 ? palette.tealSoft : palette.taupeSoft}} />
          </div>
        ))}
        {narrow ? (
          <div style={{marginTop: 34, padding: '20px 22px', borderRadius: 18, background: palette.violetSoft, border: `1px solid ${palette.violet}28`, display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{width: 46, height: 46, borderRadius: 14, background: palette.white, display: 'grid', placeItems: 'center'}}>
              <Tag size={23} color={palette.violet} strokeWidth={1.9} />
            </div>
            <div>
              <div style={{fontFamily: fontBody, fontSize: 13, fontWeight: 850, color: palette.violet}}>Rótulo conectado</div>
              <div style={{marginTop: 4, fontFamily: fontBody, fontSize: 11, color: palette.muted}}>Os dados seguem com o produto.</div>
            </div>
          </div>
        ) : null}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: compact ? 54 : 68, background: palette.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, color: palette.white}}>
          <PackageCheck size={compact ? 18 : 21} />
          <span style={{fontFamily: fontBody, fontSize: compact ? 11 : 13, fontWeight: 800}}>Pronto para seguir</span>
        </div>
      </div>
    </div>
  );
};

const UnfoldScene: React.FC<{format: Campaign04Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useLayout(format);
  const opacity = sceneOpacity(frame, BEATS.unfold.duration, 14);
  const titleIn = useEnter(6);
  const vertical = format === 'vertical';

  return (
    <AbsoluteFill style={{opacity, color: palette.ink}}>
      <AmbientCanvas mode="paper" accent={palette.violet} />
      <div
        style={{
          position: 'absolute',
          inset: `${layout.safeTop}px ${layout.paddingX}px ${layout.safeBottom}px`,
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 66 : layout.square ? 24 : 46,
        }}
      >
        <div style={{width: layout.horizontal ? '34%' : '100%'}}>
          <BrandFlag label="A RECEITA MOVIMENTA O RESTO" />
          <h2 style={{margin: '19px 0 16px', fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 0.98, textTransform: 'uppercase', letterSpacing: '-0.025em', opacity: titleIn, transform: `translateY(${(1 - titleIn) * 24}px)`}}>
            Pronta para
            <span style={{display: 'block', color: palette.violet}}>virar produto.</span>
          </h2>
          <p style={{margin: 0, fontFamily: fontBody, fontSize: layout.body, lineHeight: 1.42, color: palette.muted}}>
            A informação continua. Sem começar tudo de novo.
          </p>
        </div>
        <div style={{width: layout.horizontal ? '64%' : '100%', display: 'flex', flexDirection: vertical ? 'column' : 'row', alignItems: 'center', gap: vertical ? 24 : 20}}>
          <ProductSheet format={format} />
          <div style={{flex: 1, width: vertical ? '100%' : 'auto', display: 'flex', flexDirection: vertical ? 'row' : 'column', gap: vertical ? 12 : 14}}>
            {outputs.map((item, index) => (
              <OutputCard key={item.title} item={item} index={index} compact={vertical || format === 'square'} />
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ecosystemNodes = [
  {label: 'Ingredientes', icon: Leaf, color: palette.coral, angle: -150},
  {label: 'Formulação', icon: FlaskConical, color: palette.saffron, angle: -90},
  {label: 'Análise', icon: Gauge, color: palette.teal, angle: -30},
  {label: 'Fornecedores', icon: Truck, color: palette.blue, angle: 30},
  {label: 'Ficha técnica', icon: BookOpenCheck, color: palette.violet, angle: 90},
  {label: 'Produto', icon: Box, color: palette.coral, angle: 150},
];

const EcosystemOrbit: React.FC<{format: Campaign04Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const compact = format === 'square';
  const size = format === 'horizontal' ? 650 : compact ? 550 : 720;
  return (
    <div style={{position: 'relative', width: size, height: size}}>
      <div style={{position: 'absolute', inset: '17%', border: '1px solid rgba(255,255,255,.16)', borderRadius: '50%', transform: `rotate(${frame * 0.07}deg)`}} />
      <div style={{position: 'absolute', inset: '29%', border: '1px dashed rgba(255,255,255,.18)', borderRadius: '50%', transform: `rotate(${frame * -0.1}deg)`}} />
      <div style={{position: 'absolute', inset: '34%', borderRadius: '50%', background: 'rgba(255,255,255,.96)', boxShadow: '0 28px 80px rgba(0,0,0,.24)', display: 'grid', placeItems: 'center'}}>
        <Img src={staticFile('brand/logo-light-transparent.png')} style={{width: '72%', height: '72%', objectFit: 'contain'}} />
      </div>
      {ecosystemNodes.map((node, index) => {
        const enter = spring({frame: frame - 8 - index * 4, fps, config: {damping: 17, stiffness: 100}});
        const angle = ((node.angle + Math.sin(frame * 0.01) * 2) * Math.PI) / 180;
        const radius = size * 0.42;
        const x = size / 2 + Math.cos(angle) * radius;
        const y = size / 2 + Math.sin(angle) * radius;
        const Icon = node.icon;
        return (
          <div key={node.label} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${0.76 + enter * 0.24})`, opacity: enter, minWidth: compact ? 128 : 150, padding: compact ? '10px 13px' : '12px 16px', borderRadius: 18, background: 'rgba(255,255,255,.94)', border: `1px solid ${node.color}55`, boxShadow: '0 14px 35px rgba(0,0,0,.17)', display: 'flex', alignItems: 'center', gap: 9}}>
            <div style={{width: compact ? 30 : 36, height: compact ? 30 : 36, borderRadius: 11, background: `${node.color}20`, display: 'grid', placeItems: 'center'}}>
              <Icon size={compact ? 16 : 19} color={node.color} strokeWidth={2} />
            </div>
            <span style={{fontFamily: fontBody, fontSize: compact ? 11 : 13, fontWeight: 800, color: palette.ink, whiteSpace: 'nowrap'}}>{node.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const EcosystemScene: React.FC<{format: Campaign04Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useLayout(format);
  const opacity = sceneOpacity(frame, BEATS.ecosystem.duration, 12);
  const titleIn = useEnter(5, 88);

  return (
    <AbsoluteFill style={{opacity, color: palette.white}}>
      <AmbientCanvas mode="teal" accent={palette.saffron} />
      <div style={{position: 'absolute', inset: `${layout.safeTop}px ${layout.paddingX}px ${layout.safeBottom}px`, display: 'flex', flexDirection: layout.horizontal ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: layout.horizontal ? 75 : layout.square ? 18 : 52}}>
        <div style={{width: layout.horizontal ? '45%' : '100%'}}>
          <BrandFlag dark label="O ECOSSISTEMA ICONE" />
          <h2 style={{margin: '20px 0 16px', fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 0.98, textTransform: 'uppercase', letterSpacing: '-0.025em', opacity: titleIn, transform: `translateY(${(1 - titleIn) * 24}px)`}}>
            Uma plataforma.
            <span style={{display: 'block', color: palette.saffron}}>Um fluxo inteiro.</span>
          </h2>
          <p style={{margin: 0, maxWidth: 620, fontFamily: fontBody, fontSize: layout.body, lineHeight: 1.42, color: 'rgba(255,255,255,.72)'}}>
            Da primeira grama à decisão final.
          </p>
        </div>
        <EcosystemOrbit format={format} />
      </div>
    </AbsoluteFill>
  );
};

const CtaScene: React.FC<{format: Campaign04Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const layout = useLayout(format);
  const opacity = sceneOpacity(frame, BEATS.cta.duration, 10);
  const logoIn = spring({frame: frame - 2, fps, config: {damping: 16, stiffness: 96, mass: 0.84}});
  const titleIn = spring({frame: frame - 9, fps, config: {damping: 18, stiffness: 88}});
  const ctaIn = spring({frame: frame - 22, fps, config: {damping: 17, stiffness: 110}});
  const progress = interpolate(frame, [4, 70], [0, 1], clamp);

  return (
    <AbsoluteFill style={{opacity, color: palette.white}}>
      <AmbientCanvas mode="ink" accent={palette.saffron} />
      <div style={{position: 'absolute', left: layout.paddingX, right: layout.paddingX, top: layout.safeTop, bottom: layout.safeBottom, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <div style={{width: layout.square ? 102 : 124, height: layout.square ? 102 : 124, borderRadius: layout.square ? 29 : 35, background: palette.white, boxShadow: `0 24px 70px ${palette.saffron}35`, display: 'grid', placeItems: 'center', opacity: logoIn, transform: `scale(${0.7 + logoIn * 0.3}) rotate(${(1 - logoIn) * -5}deg)`}}>
          <Img src={staticFile('brand/logo-light-transparent.png')} style={{width: '72%', height: '72%', objectFit: 'contain'}} />
        </div>
        <h2 style={{margin: layout.square ? '24px 0 13px' : '32px 0 16px', fontFamily: fontDisplay, fontSize: layout.hero, lineHeight: 0.92, textTransform: 'uppercase', letterSpacing: '-0.035em', opacity: titleIn, transform: `translateY(${(1 - titleIn) * 28}px)`}}>
          Da ideia
          <span style={{display: 'block', color: palette.saffron}}>ao rótulo.</span>
        </h2>
        <div style={{display: 'flex', alignItems: 'center', gap: layout.square ? 8 : 12, marginTop: 4, opacity: titleIn, fontFamily: fontBody, fontSize: layout.square ? 16 : 20, fontWeight: 800, letterSpacing: tracking.industrial, textTransform: 'uppercase', color: 'rgba(255,255,255,.72)'}}>
          <span>Formule</span><span style={{color: palette.coral}}>•</span><span>Decida</span><span style={{color: palette.teal}}>•</span><span>Produza</span>
        </div>
        <div style={{width: Math.min(layout.contentWidth * 0.72, 760), height: 8, margin: layout.square ? '22px 0' : '30px 0', borderRadius: 8, overflow: 'hidden'}}>
          <FlowRibbon progress={progress} horizontal />
        </div>
        <div style={{display: 'flex', flexDirection: format === 'vertical' ? 'column' : 'row', alignItems: 'center', justifyContent: 'center', gap: format === 'vertical' ? 14 : 18, opacity: ctaIn, transform: `translateY(${(1 - ctaIn) * 18}px)`}}>
          <div style={{height: layout.square ? 54 : 62, padding: layout.square ? '0 24px' : '0 30px', borderRadius: layout.square ? 18 : 21, background: palette.saffron, color: palette.ink, display: 'flex', alignItems: 'center', gap: 12, fontFamily: fontBody, fontSize: layout.square ? 18 : 21, fontWeight: 850, boxShadow: `0 18px 44px ${palette.saffron}32`}}>
            Começar grátis <ArrowRight size={layout.square ? 20 : 23} strokeWidth={2.6} />
          </div>
          <div style={{fontFamily: fontDisplay, fontSize: layout.square ? 18 : 22, fontWeight: 600, letterSpacing: tracking.industrial, textTransform: 'uppercase', color: 'rgba(255,255,255,.88)'}}>icone.academy</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Campaign04DaIdeiaAoRotulo: React.FC<Campaign04Props> = ({format}) => (
  <AbsoluteFill style={{backgroundColor: palette.ink}}>
    <Sequence from={BEATS.spark.from} durationInFrames={BEATS.spark.duration}>
      <SparkScene format={format} />
    </Sequence>
    <Sequence from={BEATS.structure.from} durationInFrames={BEATS.structure.duration}>
      <StructureScene format={format} />
    </Sequence>
    <Sequence from={BEATS.intelligence.from} durationInFrames={BEATS.intelligence.duration}>
      <IntelligenceScene format={format} />
    </Sequence>
    <Sequence from={BEATS.unfold.from} durationInFrames={BEATS.unfold.duration}>
      <UnfoldScene format={format} />
    </Sequence>
    <Sequence from={BEATS.ecosystem.from} durationInFrames={BEATS.ecosystem.duration}>
      <EcosystemScene format={format} />
    </Sequence>
    <Sequence from={BEATS.cta.from} durationInFrames={BEATS.cta.duration}>
      <CtaScene format={format} />
    </Sequence>
  </AbsoluteFill>
);
