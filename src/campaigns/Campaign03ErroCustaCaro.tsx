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
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  Check,
  CircleDollarSign,
  Factory,
  FlaskConical,
  GitCompareArrows,
  Layers3,
  Link2,
  Radar,
  ReceiptText,
  ScanSearch,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import {fontBody, fontDisplay} from '../fonts';
import {colors, tracking} from '../theme';

export const CAMPAIGN_03_FPS = 30;
export const CAMPAIGN_03_DURATION = CAMPAIGN_03_FPS * 24;

export type Campaign03Format = 'vertical' | 'square' | 'horizontal';

export type Campaign03Props = {
  format: Campaign03Format;
};

const F = (seconds: number) => Math.round(seconds * CAMPAIGN_03_FPS);

const BEATS = {
  hook: {from: 0, duration: F(3.9)},
  leaks: {from: F(3.4), duration: F(6.2)},
  connect: {from: F(9), duration: F(5.9)},
  decision: {from: F(14.3), duration: F(5.1)},
  proof: {from: F(18.8), duration: F(3)},
  cta: {from: F(21.4), duration: F(2.6)},
} as const;

const palette = {
  ink: '#0B0E12',
  inkLift: '#10161D',
  panel: '#151C24',
  panelStrong: '#1A232D',
  line: 'rgba(220,231,239,.15)',
  lineBright: 'rgba(220,231,239,.28)',
  text: '#F5F1EA',
  textSoft: '#D0D7DE',
  muted: '#8E9AA9',
  cyan: '#71C9E8',
  cyanSoft: 'rgba(113,201,232,.13)',
  red: '#FF7465',
  redSoft: 'rgba(255,116,101,.13)',
  amber: '#F4B860',
  amberSoft: 'rgba(244,184,96,.13)',
  green: '#62D2A2',
  greenSoft: 'rgba(98,210,162,.13)',
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

const useLayout = (format: Campaign03Format): Layout => {
  if (format === 'horizontal') {
    return {
      horizontal: true,
      square: false,
      paddingX: 108,
      safeTop: 72,
      safeBottom: 72,
      contentWidth: 1660,
      hero: 112,
      title: 70,
      lead: 31,
      body: 25,
      label: 19,
      caption: 16,
    };
  }

  if (format === 'square') {
    return {
      horizontal: false,
      square: true,
      paddingX: 58,
      safeTop: 58,
      safeBottom: 58,
      contentWidth: 964,
      hero: 80,
      title: 56,
      lead: 27,
      body: 21,
      label: 17,
      caption: 14,
    };
  }

  return {
    horizontal: false,
    square: false,
    paddingX: 58,
    safeTop: 176,
    safeBottom: 248,
    contentWidth: 964,
    hero: 108,
    title: 70,
    lead: 33,
    body: 25,
    label: 19,
    caption: 16,
  };
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

const IntelligenceField: React.FC<{accent?: 'red' | 'cyan' | 'green' | 'amber'}> = ({accent = 'cyan'}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const glow = accent === 'red' ? palette.red : accent === 'green' ? palette.green : accent === 'amber' ? palette.amber : palette.cyan;
  const x = 50 + Math.sin(frame * 0.013) * 8;
  const y = 42 + Math.cos(frame * 0.017) * 7;
  const scan = interpolate(frame % 120, [0, 120], [-8, 108]);

  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${x}% ${y}%, ${glow}1f 0%, transparent 34%), radial-gradient(circle at 12% 88%, rgba(244,184,96,.08), transparent 31%), linear-gradient(145deg, ${palette.inkLift}, ${palette.ink})`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.2,
          backgroundImage:
            'linear-gradient(rgba(113,201,232,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(113,201,232,.12) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          transform: `perspective(900px) rotateX(63deg) scale(1.45) translateY(${height * 0.16}px)`,
          transformOrigin: '50% 80%',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${scan}%`,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${glow}99, transparent)`,
          boxShadow: `0 0 30px ${glow}66`,
          opacity: 0.55,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.055,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,.65) 0, rgba(255,255,255,.65) 1px, transparent 1px, transparent 4px)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 22,
          border: `1px solid ${palette.line}`,
          pointerEvents: 'none',
        }}
      >
        {[
          {left: -1, top: -1, borderTop: true, borderLeft: true},
          {right: -1, top: -1, borderTop: true, borderRight: true},
          {left: -1, bottom: -1, borderBottom: true, borderLeft: true},
          {right: -1, bottom: -1, borderBottom: true, borderRight: true},
        ].map((corner, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              width: 32,
              height: 32,
              borderTop: corner.borderTop ? `2px solid ${glow}` : undefined,
              borderBottom: corner.borderBottom ? `2px solid ${glow}` : undefined,
              borderLeft: corner.borderLeft ? `2px solid ${glow}` : undefined,
              borderRight: corner.borderRight ? `2px solid ${glow}` : undefined,
              left: corner.left,
              right: corner.right,
              top: corner.top,
              bottom: corner.bottom,
              opacity: 0.48,
            }}
          />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 38,
          top: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: palette.muted,
          fontFamily: fontBody,
          fontSize: Math.max(12, width * 0.009),
          fontWeight: 700,
          letterSpacing: tracking.widest,
          textTransform: 'uppercase',
        }}
      >
        <span style={{width: 7, height: 7, borderRadius: '50%', background: glow, boxShadow: `0 0 14px ${glow}`}} />
        ICONE // COST INTELLIGENCE
      </div>
      <div
        style={{
          position: 'absolute',
          right: 38,
          top: 36,
          color: palette.muted,
          fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
          fontSize: Math.max(12, width * 0.0085),
          letterSpacing: tracking.wide,
        }}
      >
        FRAME {String(frame).padStart(4, '0')}
      </div>
    </AbsoluteFill>
  );
};

const SceneShell: React.FC<{
  children: React.ReactNode;
  format: Campaign03Format;
  duration: number;
  accent?: 'red' | 'cyan' | 'green' | 'amber';
  fadeOut?: number;
}> = ({children, format, duration, accent = 'cyan', fadeOut = 10}) => {
  const frame = useCurrentFrame();
  const layout = useLayout(format);
  const opacity = Math.min(
    interpolate(frame, [0, 9], [0, 1], clamp),
    interpolate(frame, [Math.max(10, duration - fadeOut), duration], [1, 0], clamp),
  );

  return (
    <AbsoluteFill style={{opacity, background: palette.ink}}>
      <IntelligenceField accent={accent} />
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
    </AbsoluteFill>
  );
};

const SignalLabel: React.FC<{
  children: React.ReactNode;
  tone?: 'red' | 'cyan' | 'green' | 'amber';
  icon?: React.ReactNode;
}> = ({children, tone = 'cyan', icon}) => {
  const color = tone === 'red' ? palette.red : tone === 'green' ? palette.green : tone === 'amber' ? palette.amber : palette.cyan;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 14px',
        border: `1px solid ${color}55`,
        background: `${color}12`,
        color,
        fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: tracking.wide,
        textTransform: 'uppercase',
      }}
    >
      {icon}
      {children}
    </div>
  );
};

const BatchScope: React.FC<{format: Campaign03Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useLayout(format);
  const enter = useEnter(9, 92);
  const size = layout.horizontal ? 430 : layout.square ? 300 : 410;
  const rotation = frame * 1.2;
  const pulse = 1 + Math.sin(frame * 0.12) * 0.025;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
        opacity: enter,
        transform: `scale(${(0.82 + enter * 0.18) * pulse})`,
      }}
    >
      {[1, 0.76, 0.5].map((scale, index) => (
        <div
          key={scale}
          style={{
            position: 'absolute',
            width: size * scale,
            height: size * scale,
            borderRadius: '50%',
            border: `${index === 0 ? 1 : 1.5}px ${index === 1 ? 'dashed' : 'solid'} ${index === 2 ? palette.red + '88' : palette.lineBright}`,
            transform: `rotate(${index === 1 ? rotation : -rotation * 0.28}deg)`,
            boxShadow: index === 2 ? `0 0 60px ${palette.redSoft}` : undefined,
          }}
        />
      ))}
      <div
        style={{
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 38% 30%, rgba(255,255,255,.09), rgba(255,255,255,.02))',
          border: `1px solid ${palette.red}66`,
          boxShadow: `inset 0 0 40px ${palette.redSoft}, 0 0 55px rgba(255,116,101,.10)`,
          color: palette.red,
        }}
      >
        <AlertTriangle size={layout.square ? 38 : 50} strokeWidth={1.7} />
        <span
          style={{
            marginTop: 12,
            fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
            fontSize: layout.square ? 13 : 16,
            fontWeight: 800,
            letterSpacing: tracking.wide,
          }}
        >
          CUSTO OCULTO
        </span>
      </div>
      {[30, 148, 266].map((angle, index) => {
        const radius = size * 0.39;
        const x = Math.cos(((angle + rotation * 0.34) * Math.PI) / 180) * radius;
        const y = Math.sin(((angle + rotation * 0.34) * Math.PI) / 180) * radius;
        return (
          <div
            key={angle}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: index === 1 ? 14 : 10,
              height: index === 1 ? 14 : 10,
              borderRadius: '50%',
              background: index === 1 ? palette.amber : palette.red,
              boxShadow: `0 0 20px ${index === 1 ? palette.amber : palette.red}`,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
            }}
          />
        );
      })}
    </div>
  );
};

const HookScene: React.FC<{format: Campaign03Format}> = ({format}) => {
  const layout = useLayout(format);
  const titleIn = useEnter(2, 92);
  const leadIn = useEnter(17);
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [35, 75], [0, 1], clamp);

  return (
    <SceneShell format={format} duration={BEATS.hook.duration} accent="red">
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 110 : layout.square ? 30 : 68,
        }}
      >
        <div style={{flex: layout.horizontal ? '0 1 840px' : undefined, textAlign: layout.horizontal ? 'left' : 'center'}}>
          <div style={{opacity: leadIn, marginBottom: 20}}>
            <SignalLabel tone="red" icon={<ScanSearch size={17} />}>Análise de perda</SignalLabel>
          </div>
          <div
            style={{
              fontFamily: fontDisplay,
              fontSize: layout.hero,
              lineHeight: 0.91,
              fontWeight: 700,
              letterSpacing: '-0.035em',
              color: palette.text,
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 34}px)`,
            }}
          >
            O erro mais caro
            <br />
            <span style={{color: palette.red}}>não faz barulho.</span>
          </div>
          <div
            style={{
              marginTop: layout.square ? 17 : 27,
              display: 'flex',
              alignItems: 'center',
              justifyContent: layout.horizontal ? 'flex-start' : 'center',
              gap: 14,
              fontFamily: fontBody,
              fontSize: layout.lead,
              color: palette.textSoft,
              opacity: leadIn * reveal,
            }}
          >
            <span style={{width: 44, height: 1, background: palette.red}} />
            Ele entra no lote.
          </div>
        </div>
        <BatchScope format={format} />
      </div>
    </SceneShell>
  );
};

type Leak = {
  index: string;
  title: string;
  detail: string;
  icon: React.ReactNode;
  tone: 'red' | 'amber';
};

const LeakCard: React.FC<{leak: Leak; delay: number; compact: boolean}> = ({leak, delay, compact}) => {
  const enter = useEnter(delay, 118);
  const color = leak.tone === 'red' ? palette.red : palette.amber;
  return (
    <div
      style={{
        minHeight: compact ? 134 : 170,
        padding: compact ? 18 : 24,
        border: `1px solid ${color}55`,
        background: `linear-gradient(145deg, ${color}18, rgba(21,28,36,.92) 58%)`,
        boxShadow: `0 24px 70px rgba(0,0,0,.24), inset 0 1px 0 rgba(255,255,255,.05)`,
        position: 'relative',
        overflow: 'hidden',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 28}px) scale(${0.94 + enter * 0.06})`,
      }}
    >
      <div style={{position: 'absolute', top: 0, left: 0, width: `${enter * 100}%`, height: 2, background: color, boxShadow: `0 0 15px ${color}`}} />
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14}}>
        <span style={{fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', fontSize: compact ? 13 : 15, color, fontWeight: 800, letterSpacing: tracking.wide}}>
          SINAL {leak.index}
        </span>
        <div style={{width: compact ? 34 : 42, height: compact ? 34 : 42, display: 'grid', placeItems: 'center', border: `1px solid ${color}55`, background: `${color}12`, color}}>
          {leak.icon}
        </div>
      </div>
      <div style={{marginTop: compact ? 13 : 20, fontFamily: fontBody, fontSize: compact ? 19 : 24, lineHeight: 1.15, fontWeight: 800, color: palette.text}}>
        {leak.title}
      </div>
      <div style={{marginTop: 8, fontFamily: fontBody, fontSize: compact ? 14 : 17, lineHeight: 1.35, color: palette.muted}}>
        {leak.detail}
      </div>
    </div>
  );
};

const LeakMapScene: React.FC<{format: Campaign03Format}> = ({format}) => {
  const layout = useLayout(format);
  const titleIn = useEnter(2);
  const leaks: Leak[] = [
    {index: '01', title: 'Fórmula fora da faixa', detail: 'O retrabalho começa antes da máquina.', icon: <FlaskConical size={21} />, tone: 'red'},
    {index: '02', title: 'Compra sem comparar', detail: 'Preço isolado não mostra o custo real.', icon: <Truck size={21} />, tone: 'amber'},
    {index: '03', title: 'Decisão sem impacto', detail: 'Uma troca barata pode custar estabilidade.', icon: <GitCompareArrows size={21} />, tone: 'red'},
  ];

  return (
    <SceneShell format={format} duration={BEATS.leaks.duration} accent="red">
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: layout.square ? 24 : 38}}>
        <div style={{textAlign: 'center', opacity: titleIn, transform: `translateY(${(1 - titleIn) * 22}px)`}}>
          <SignalLabel tone="red" icon={<Radar size={17} />}>Raio-X do custo</SignalLabel>
          <div style={{fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 0.98, fontWeight: 700, color: palette.text, marginTop: 18}}>
            Três vazamentos. Um único lote.
          </div>
        </div>
        <div
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: layout.horizontal || layout.square ? 'repeat(3, minmax(0, 1fr))' : '1fr',
            gap: layout.square ? 14 : layout.horizontal ? 20 : 16,
          }}
        >
          {leaks.map((leak, index) => (
            <LeakCard key={leak.index} leak={leak} delay={12 + index * 10} compact={layout.square} />
          ))}
        </div>
      </div>
    </SceneShell>
  );
};

type IntelligenceNodeProps = {
  label: string;
  detail: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
};

const IntelligenceNode: React.FC<IntelligenceNodeProps> = ({label, detail, icon, color, delay}) => {
  const enter = useEnter(delay, 120);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        padding: '14px 17px',
        border: `1px solid ${color}55`,
        background: `linear-gradient(135deg, ${color}18, rgba(21,28,36,.94))`,
        boxShadow: '0 20px 55px rgba(0,0,0,.25)',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 20}px)`,
      }}
    >
      <div style={{width: 40, height: 40, display: 'grid', placeItems: 'center', color, background: `${color}14`, border: `1px solid ${color}44`}}>
        {icon}
      </div>
      <div>
        <div style={{fontFamily: fontBody, fontSize: 18, fontWeight: 800, color: palette.text}}>{label}</div>
        <div style={{fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', fontSize: 12, color: palette.muted, letterSpacing: tracking.wide, marginTop: 4}}>{detail}</div>
      </div>
    </div>
  );
};

const IntelligenceCore: React.FC<{format: Campaign03Format}> = ({format}) => {
  const layout = useLayout(format);
  const frame = useCurrentFrame();
  const enter = useEnter(8, 90);
  const size = layout.horizontal ? 410 : layout.square ? 300 : 390;
  const dash = interpolate(frame, [12, 82], [430, 0], clamp);

  return (
    <div style={{width: size, height: size, position: 'relative', display: 'grid', placeItems: 'center', opacity: enter}}>
      <svg width={size} height={size} viewBox="0 0 400 400" style={{position: 'absolute', inset: 0}}>
        <circle cx="200" cy="200" r="166" fill="none" stroke={palette.line} strokeWidth="1" />
        <circle cx="200" cy="200" r="124" fill="none" stroke={palette.cyan} strokeOpacity=".35" strokeDasharray="8 12" strokeWidth="1.5" transform={`rotate(${frame * 0.7} 200 200)`} />
        {[
          [200, 36],
          [58, 275],
          [342, 275],
        ].map(([x, y], index) => (
          <line
            key={`${x}-${y}`}
            x1="200"
            y1="200"
            x2={x}
            y2={y}
            stroke={index === 0 ? palette.cyan : index === 1 ? palette.amber : palette.green}
            strokeOpacity=".72"
            strokeWidth="2"
            strokeDasharray="430"
            strokeDashoffset={dash}
          />
        ))}
      </svg>
      <div
        style={{
          width: size * 0.38,
          height: size * 0.38,
          display: 'grid',
          placeItems: 'center',
          background: 'linear-gradient(145deg, rgba(113,201,232,.18), rgba(21,28,36,.98))',
          border: `1px solid ${palette.cyan}77`,
          boxShadow: `0 0 70px ${palette.cyanSoft}`,
          transform: `rotate(${Math.sin(frame * 0.035) * 2}deg) scale(${0.92 + enter * 0.08})`,
        }}
      >
        <Img
          src={staticFile('brand/logo-dark-transparent.png')}
          style={{width: size * 0.22, height: size * 0.22, objectFit: 'contain'}}
        />
      </div>
      {[
        {label: 'TÉCNICA', color: palette.cyan, left: '50%', top: 4},
        {label: 'CUSTO', color: palette.amber, left: 12, bottom: 36},
        {label: 'OFERTA', color: palette.green, right: 8, bottom: 36},
      ].map((node) => (
        <div
          key={node.label}
          style={{
            position: 'absolute',
            left: node.left,
            right: node.right,
            top: node.top,
            bottom: node.bottom,
            transform: node.left === '50%' ? 'translateX(-50%)' : undefined,
            padding: '7px 10px',
            border: `1px solid ${node.color}66`,
            background: palette.ink,
            color: node.color,
            fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace',
            fontSize: layout.square ? 11 : 13,
            fontWeight: 800,
            letterSpacing: tracking.wide,
          }}
        >
          {node.label}
        </div>
      ))}
    </div>
  );
};

const ConnectScene: React.FC<{format: Campaign03Format}> = ({format}) => {
  const layout = useLayout(format);
  const titleIn = useEnter(2);
  const nodes = [
    {label: 'Receita', detail: 'PARÂMETROS + DOSAGENS', icon: <FlaskConical size={20} />, color: palette.cyan},
    {label: 'Custo por kg', detail: 'PREÇO DA LINHA', icon: <CircleDollarSign size={20} />, color: palette.amber},
    {label: 'Fornecedor', detail: 'OFERTAS VÁLIDAS', icon: <Truck size={20} />, color: palette.green},
  ];

  return (
    <SceneShell format={format} duration={BEATS.connect.duration} accent="cyan">
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 104 : layout.square ? 24 : 48,
        }}
      >
        <div style={{flex: layout.horizontal ? '0 1 660px' : undefined, textAlign: layout.horizontal ? 'left' : 'center'}}>
          <div style={{opacity: titleIn}}>
            <SignalLabel icon={<Link2 size={17} />}>Inteligência conectada</SignalLabel>
          </div>
          <div style={{fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 0.96, fontWeight: 700, color: palette.text, marginTop: 20}}>
            Uma decisão.
            <br />
            <span style={{color: palette.cyan}}>Três leituras.</span>
          </div>
          <div style={{marginTop: layout.square ? 17 : 25, fontFamily: fontBody, fontSize: layout.lead, lineHeight: 1.35, color: palette.textSoft}}>
            Técnica, custo e fornecedor no mesmo cenário.
          </div>
          <div style={{marginTop: layout.square ? 18 : 28, display: 'grid', gap: 10}}>
            {nodes.map((node, index) => (
              <IntelligenceNode key={node.label} {...node} delay={12 + index * 8} />
            ))}
          </div>
        </div>
        <IntelligenceCore format={format} />
      </div>
    </SceneShell>
  );
};

const DecisionRow: React.FC<{
  label: string;
  icon: React.ReactNode;
  delay: number;
}> = ({label, icon, delay}) => {
  const enter = useEnter(delay, 125);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        padding: '14px 0',
        borderBottom: `1px solid ${palette.line}`,
        opacity: enter,
        transform: `translateX(${(1 - enter) * 22}px)`,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 12, color: palette.textSoft}}>
        <span style={{color: palette.cyan}}>{icon}</span>
        <span style={{fontFamily: fontBody, fontSize: 18, fontWeight: 700}}>{label}</span>
      </div>
      <div style={{width: 28, height: 28, display: 'grid', placeItems: 'center', color: palette.green, background: palette.greenSoft, border: `1px solid ${palette.green}44`}}>
        <Check size={17} strokeWidth={3} />
      </div>
    </div>
  );
};

const DecisionScene: React.FC<{format: Campaign03Format}> = ({format}) => {
  const layout = useLayout(format);
  const frame = useCurrentFrame();
  const panelIn = useEnter(8, 100);
  const titleIn = useEnter(2);
  const meter = interpolate(frame, [20, 82], [0.88, 0.56], clamp);
  const rows = [
    {label: 'Parâmetros preservados', icon: <FlaskConical size={19} />},
    {label: 'Trocas rastreáveis', icon: <GitCompareArrows size={19} />},
    {label: 'Peso final mantido', icon: <Layers3 size={19} />},
  ];

  return (
    <SceneShell format={format} duration={BEATS.decision.duration} accent="green">
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: layout.horizontal ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.horizontal ? 88 : layout.square ? 28 : 46,
        }}
      >
        <div style={{flex: layout.horizontal ? '0 1 710px' : undefined, textAlign: layout.horizontal ? 'left' : 'center', opacity: titleIn}}>
          <SignalLabel tone="green" icon={<ShieldCheck size={17} />}>Decisão protegida</SignalLabel>
          <div style={{fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 0.96, fontWeight: 700, color: palette.text, marginTop: 20}}>
            Reduza custo.
            <br />
            <span style={{color: palette.green}}>Sem desmontar a receita.</span>
          </div>
          <div style={{marginTop: 20, fontFamily: fontBody, fontSize: layout.lead, lineHeight: 1.35, color: palette.textSoft}}>
            Você vê o impacto antes de aplicar.
          </div>
        </div>
        <div
          style={{
            width: layout.horizontal ? 700 : '100%',
            maxWidth: 760,
            padding: layout.square ? 22 : 28,
            border: `1px solid ${palette.green}55`,
            background: 'linear-gradient(145deg, rgba(98,210,162,.11), rgba(21,28,36,.96) 60%)',
            boxShadow: '0 32px 90px rgba(0,0,0,.30)',
            opacity: panelIn,
            transform: `perspective(1100px) rotateY(${layout.horizontal ? -3 * (1 - panelIn) : 0}deg) translateY(${(1 - panelIn) * 26}px)`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16}}>
            <div>
              <div style={{fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', fontSize: 13, fontWeight: 800, color: palette.green, letterSpacing: tracking.wide}}>CENÁRIO ANALISADO</div>
              <div style={{fontFamily: fontBody, fontSize: layout.square ? 23 : 28, fontWeight: 850, color: palette.text, marginTop: 7}}>Custo relativo da receita</div>
            </div>
            <BadgeDollarSign size={layout.square ? 34 : 42} color={palette.green} strokeWidth={1.7} />
          </div>
          <div style={{marginTop: 22, height: 12, background: 'rgba(255,255,255,.07)', border: `1px solid ${palette.line}`, position: 'relative', overflow: 'hidden'}}>
            <div style={{width: `${meter * 100}%`, height: '100%', background: `linear-gradient(90deg, ${palette.amber}, ${palette.green})`, boxShadow: `0 0 24px ${palette.green}55`}} />
          </div>
          <div style={{marginTop: 8, display: 'flex', justifyContent: 'space-between', fontFamily: 'ui-monospace, SFMono-Regular, Consolas, monospace', fontSize: 12, color: palette.muted, letterSpacing: tracking.wide}}>
            <span>ANTES</span><span>CENÁRIO OTIMIZADO</span>
          </div>
          <div style={{marginTop: 14}}>
            {rows.map((row, index) => (
              <DecisionRow key={row.label} {...row} delay={18 + index * 7} />
            ))}
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const ProofScene: React.FC<{format: Campaign03Format}> = ({format}) => {
  const layout = useLayout(format);
  const iconIn = useEnter(1, 92);
  const copyIn = useEnter(10);
  return (
    <SceneShell format={format} duration={BEATS.proof.duration} accent="amber">
      <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <div
          style={{
            width: layout.square ? 88 : 118,
            height: layout.square ? 88 : 118,
            display: 'grid',
            placeItems: 'center',
            border: `1px solid ${palette.amber}66`,
            background: palette.amberSoft,
            boxShadow: `0 0 75px ${palette.amberSoft}`,
            color: palette.amber,
            opacity: iconIn,
            transform: `rotate(${(1 - iconIn) * -8}deg) scale(${0.72 + iconIn * 0.28})`,
          }}
        >
          <ReceiptText size={layout.square ? 43 : 58} strokeWidth={1.6} />
        </div>
        <div style={{opacity: copyIn, transform: `translateY(${(1 - copyIn) * 22}px)`}}>
          <div style={{fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 0.96, fontWeight: 700, color: palette.text, marginTop: layout.square ? 22 : 30}}>
            O mesmo erro não precisa
            <br />
            <span style={{color: palette.amber}}>custar duas vezes.</span>
          </div>
          <div style={{fontFamily: fontBody, fontSize: layout.lead, lineHeight: 1.35, color: palette.textSoft, marginTop: 15}}>
            Na compra. E no retrabalho.
          </div>
        </div>
      </div>
    </SceneShell>
  );
};

const CtaScene: React.FC<{format: Campaign03Format}> = ({format}) => {
  const layout = useLayout(format);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoIn = spring({frame, fps, config: {damping: 16, stiffness: 100, mass: 0.82}});
  const copyIn = spring({frame: frame - 7, fps, config: {damping: 17, stiffness: 110, mass: 0.76}});
  const ctaIn = spring({frame: frame - 18, fps, config: {damping: 14, stiffness: 132, mass: 0.68}});

  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #A3907D 0%, #7A6A5A 46%, #5E5044 100%)'}}>
      <AbsoluteFill style={{opacity: 0.08, backgroundImage: 'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '64px 64px'}} />
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
            display: 'flex',
            flexDirection: layout.horizontal ? 'row' : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: layout.horizontal ? 76 : layout.square ? 22 : 34,
            textAlign: layout.horizontal ? 'left' : 'center',
          }}
        >
          <div
            style={{
              width: layout.horizontal ? 198 : layout.square ? 102 : 138,
              height: layout.horizontal ? 198 : layout.square ? 102 : 138,
              display: 'grid',
              placeItems: 'center',
              border: '1px solid rgba(255,255,255,.22)',
              background: 'rgba(255,255,255,.10)',
              boxShadow: '0 28px 80px rgba(0,0,0,.20)',
              opacity: logoIn,
              transform: `scale(${0.72 + logoIn * 0.28})`,
            }}
          >
            <Img src={staticFile('brand/logo-dark-transparent.png')} style={{width: '70%', height: '70%', objectFit: 'contain'}} />
          </div>
          <div style={{display: 'flex', flexDirection: 'column', alignItems: layout.horizontal ? 'flex-start' : 'center', gap: layout.square ? 14 : 18, opacity: copyIn}}>
            <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, padding: '9px 14px', border: '1px solid rgba(255,255,255,.24)', background: 'rgba(255,255,255,.10)', color: 'rgba(255,255,255,.88)', fontFamily: fontBody, fontSize: layout.caption, fontWeight: 800, letterSpacing: tracking.wide, textTransform: 'uppercase'}}>
              <Factory size={18} /> Controle antes do lote
            </div>
            <div style={{fontFamily: fontDisplay, fontSize: layout.horizontal ? 82 : layout.square ? 58 : 76, lineHeight: 0.96, fontWeight: 700, color: colors.textInverse, letterSpacing: '-0.03em'}}>
              Produza com controle.
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 15,
                padding: layout.square ? '13px 20px' : '16px 25px',
                background: colors.surface,
                color: colors.primary,
                boxShadow: '0 18px 44px rgba(0,0,0,.22)',
                opacity: ctaIn,
                transform: `translateY(${(1 - ctaIn) * 15}px) scale(${0.94 + ctaIn * 0.06})`,
                fontFamily: fontBody,
                fontSize: layout.square ? 19 : 23,
                fontWeight: 850,
              }}
            >
              Começar grátis <ArrowRight size={layout.square ? 20 : 24} strokeWidth={2.6} />
            </div>
            <div style={{opacity: ctaIn, fontFamily: fontDisplay, fontSize: layout.square ? 18 : 22, fontWeight: 600, letterSpacing: tracking.industrial, color: 'rgba(255,255,255,.88)', textTransform: 'uppercase'}}>
              icone.academy
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Campaign03ErroCustaCaro: React.FC<Campaign03Props> = ({format}) => (
  <AbsoluteFill style={{backgroundColor: palette.ink}}>
    <Sequence from={BEATS.hook.from} durationInFrames={BEATS.hook.duration}>
      <HookScene format={format} />
    </Sequence>
    <Sequence from={BEATS.leaks.from} durationInFrames={BEATS.leaks.duration}>
      <LeakMapScene format={format} />
    </Sequence>
    <Sequence from={BEATS.connect.from} durationInFrames={BEATS.connect.duration}>
      <ConnectScene format={format} />
    </Sequence>
    <Sequence from={BEATS.decision.from} durationInFrames={BEATS.decision.duration}>
      <DecisionScene format={format} />
    </Sequence>
    <Sequence from={BEATS.proof.from} durationInFrames={BEATS.proof.duration}>
      <ProofScene format={format} />
    </Sequence>
    <Sequence from={BEATS.cta.from} durationInFrames={BEATS.cta.duration}>
      <CtaScene format={format} />
    </Sequence>
  </AbsoluteFill>
);
