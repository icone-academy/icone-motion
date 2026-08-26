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
import {
  AlertTriangle,
  ArrowRight,
  Beaker,
  BookOpenCheck,
  BriefcaseBusiness,
  Calculator,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Factory,
  FileCheck2,
  FileText,
  FlaskConical,
  Gauge,
  IceCreamCone,
  Leaf,
  PackageCheck,
  ScanSearch,
  Search,
  Store,
  TableProperties,
  Tag,
  Tags,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react';
import {GaugeArc, type GaugeZone} from '../../components/GaugeArc';
import {fontBody, fontDisplay} from '../../fonts';
import {tracking} from '../../theme';
import {AUDIENCE_COPY, CAMPAIGN_05_CLAIMS} from './copy';
import {MASTER_BEATS} from './timeline';
import type {
  Campaign05Audience,
  Campaign05Format,
  Campaign05HookVariant,
} from './types';
import {
  Campaign05BrandMark,
  Campaign05CtaButton,
  Campaign05Eyebrow,
  Campaign05Scene,
  Campaign05SparkBadge,
  Campaign05VerifiedPill,
  Campaign05Window,
  campaign05Palette,
  useCampaign05Enter,
  useCampaign05Layout,
} from './ui';

const clamp = {
  extrapolateLeft: 'clamp' as const,
  extrapolateRight: 'clamp' as const,
};

type RoleCard = {
  label: string;
  detail: string;
  icon: LucideIcon;
  accent: string;
  soft: string;
};

const roleCards: RoleCard[] = [
  {
    label: 'Gelateria & sorveteria',
    detail: 'Padronizar, custear e produzir com confiança.',
    icon: Store,
    accent: campaign05Palette.coral,
    soft: campaign05Palette.coralSoft,
  },
  {
    label: 'Especialista técnico',
    detail: 'Formular e entregar mais para cada cliente.',
    icon: BriefcaseBusiness,
    accent: campaign05Palette.violet,
    soft: campaign05Palette.violetSoft,
  },
  {
    label: 'Indústria',
    detail: 'Centralizar critérios, custos e documentação.',
    icon: Factory,
    accent: campaign05Palette.teal,
    soft: campaign05Palette.tealSoft,
  },
];

const RoleCardView: React.FC<{
  role: RoleCard;
  index: number;
  format: Campaign05Format;
}> = ({role, index, format}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - 8 - index * 18,
    fps,
    config: {damping: 17, stiffness: 105, mass: 0.78},
  });
  const Icon = role.icon;
  const compact = format === 'square';
  const vertical = format === 'vertical';

  return (
    <div
      style={{
        flex: 1,
        minHeight: vertical ? 190 : compact ? 220 : 300,
        padding: vertical ? '25px 27px' : compact ? '25px 23px' : '35px 31px',
        borderRadius: vertical ? 26 : 31,
        background: 'rgba(255,255,255,.94)',
        border: `1px solid ${role.accent}38`,
        boxShadow: '0 27px 70px rgba(73,55,45,.15)',
        display: 'flex',
        flexDirection: vertical ? 'row' : 'column',
        alignItems: vertical ? 'center' : 'flex-start',
        gap: vertical ? 22 : 28,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 42}px) rotate(${(1 - enter) * (index - 1) * 2}deg)`,
      }}
    >
      <div
        style={{
          width: vertical ? 70 : compact ? 68 : 82,
          height: vertical ? 70 : compact ? 68 : 82,
          flex: '0 0 auto',
          borderRadius: vertical ? 22 : 25,
          background: role.soft,
          display: 'grid',
          placeItems: 'center',
          color: role.accent,
        }}
      >
        <Icon size={vertical ? 35 : compact ? 34 : 42} strokeWidth={1.8} />
      </div>
      <div>
        <div
          style={{
            fontFamily: fontDisplay,
            fontSize: vertical ? 34 : compact ? 31 : 42,
            fontWeight: 700,
            lineHeight: 1,
            textTransform: 'uppercase',
            color: campaign05Palette.ink,
          }}
        >
          {role.label}
        </div>
        <div
          style={{
            marginTop: 13,
            fontFamily: fontBody,
            fontSize: vertical ? 20 : compact ? 17 : 21,
            lineHeight: 1.36,
            color: campaign05Palette.muted,
          }}
        >
          {role.detail}
        </div>
      </div>
    </div>
  );
};

export const MasterIdentityScene: React.FC<{format: Campaign05Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useCampaign05Layout(format);
  const conclusion = interpolate(frame, [150, 188], [0, 1], clamp);
  const cardsOpacity = interpolate(frame, [145, 185], [1, 0.12], clamp);

  return (
    <Campaign05Scene
      format={format}
      duration={MASTER_BEATS.identity.duration}
      mode="paper"
      accent={campaign05Palette.coral}
      fade={8}
    >
      <AbsoluteFill style={{justifyContent: 'center'}}>
        <div style={{opacity: 1 - conclusion, transform: `translateY(${-conclusion * 34}px)`}}>
          <Campaign05Eyebrow>UM SISTEMA PARA QUEM CRIA GELATO</Campaign05Eyebrow>
          <div
            style={{
              display: 'flex',
              flexDirection: layout.vertical ? 'column' : 'row',
              gap: layout.vertical ? 18 : layout.square ? 15 : 23,
              marginTop: layout.vertical ? 34 : 43,
              opacity: cardsOpacity,
            }}
          >
            {roleCards.map((role, index) => (
              <RoleCardView key={role.label} role={role} index={index} format={format} />
            ))}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            opacity: conclusion,
            transform: `translateY(${(1 - conclusion) * 38}px) scale(${0.96 + conclusion * 0.04})`,
          }}
        >
          <Campaign05BrandMark />
          <h1
            style={{
              maxWidth: layout.horizontal ? 1350 : 930,
              margin: layout.vertical ? '38px 0 0' : '31px 0 0',
              fontFamily: fontDisplay,
              fontSize: layout.hero,
              lineHeight: 0.94,
              textTransform: 'uppercase',
              letterSpacing: '-0.035em',
            }}
          >
            Três rotinas.
            <span style={{display: 'block', color: campaign05Palette.coral}}>Um mesmo fluxo.</span>
          </h1>
        </div>
      </AbsoluteFill>
    </Campaign05Scene>
  );
};

const fragments = [
  {label: 'receita_v7.xlsx', icon: TableProperties, color: campaign05Palette.green, x: 8, y: 12, rotate: -5},
  {label: 'Cálculos manuais', icon: Calculator, color: campaign05Palette.saffron, x: 64, y: 8, rotate: 4},
  {label: 'Cotação no chat', icon: Truck, color: campaign05Palette.blue, x: 72, y: 63, rotate: -3},
  {label: 'Ficha desatualizada', icon: FileText, color: campaign05Palette.violet, x: 4, y: 66, rotate: 5},
  {label: 'Etiqueta em outra ferramenta', icon: Tags, color: campaign05Palette.coral, x: 38, y: 73, rotate: -2},
];

export const MasterFragmentationScene: React.FC<{format: Campaign05Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const layout = useCampaign05Layout(format);
  const vertical = layout.vertical;
  const compact = !layout.horizontal;

  return (
    <Campaign05Scene
      format={format}
      duration={MASTER_BEATS.fragmentation.duration}
      mode="ink"
      accent={campaign05Palette.coral}
    >
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{position: 'absolute', inset: vertical ? '7% 0' : compact ? '3%' : '0'}}>
          {fragments.map((item, index) => {
            const enter = spring({
              frame: frame - index * 7,
              fps,
              config: {damping: 16, stiffness: 110},
            });
            const Icon = item.icon;
            const x = vertical ? (index % 2 === 0 ? 1 : 52) : item.x;
            const y = vertical ? 4 + index * 17 : item.y;
            return (
              <div
                key={item.label}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  width: vertical ? '47%' : compact ? 330 : 390,
                  padding: compact ? '17px 18px' : '20px 23px',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,.10)',
                  border: '1px solid rgba(255,255,255,.15)',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  opacity: enter * 0.82,
                  transform: `translateY(${(1 - enter) * 35}px) rotate(${item.rotate}deg)`,
                }}
              >
                <div style={{width: 44, height: 44, flex: '0 0 auto', borderRadius: 14, background: `${item.color}26`, display: 'grid', placeItems: 'center'}}>
                  <Icon size={23} color={item.color} />
                </div>
                <span style={{fontFamily: fontBody, fontSize: compact ? 16 : 19, fontWeight: 750, color: campaign05Palette.white}}>{item.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{position: 'relative', zIndex: 3, maxWidth: vertical ? 850 : 1080, textAlign: 'center'}}>
          <Campaign05Eyebrow dark accent={campaign05Palette.coral}>O PROBLEMA NÃO É O SEU CONHECIMENTO</Campaign05Eyebrow>
          <h2 style={{margin: '22px 0 15px', fontFamily: fontDisplay, fontSize: layout.hero, lineHeight: 0.94, textTransform: 'uppercase', letterSpacing: '-0.035em'}}>
            O trabalho fica
            <span style={{display: 'block', color: campaign05Palette.coral}}>espalhado.</span>
          </h2>
          <p style={{margin: '0 auto', maxWidth: 810, fontFamily: fontBody, fontSize: layout.lead, lineHeight: 1.35, color: 'rgba(255,255,255,.72)'}}>
            Cinco tarefas. Cinco lugares. O mesmo retrabalho.
          </p>
        </div>
      </AbsoluteFill>
    </Campaign05Scene>
  );
};

const flowNodes = [
  {label: 'Ingrediente', icon: Leaf, color: campaign05Palette.coral},
  {label: 'Formulação', icon: FlaskConical, color: campaign05Palette.saffron},
  {label: 'Custo', icon: CircleDollarSign, color: campaign05Palette.teal},
  {label: 'Ficha', icon: FileCheck2, color: campaign05Palette.blue},
  {label: 'Rótulo', icon: Tag, color: campaign05Palette.violet},
];

export const MasterPromiseScene: React.FC<{format: Campaign05Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useCampaign05Layout(format);
  const {fps} = useVideoConfig();
  const ribbonProgress = interpolate(frame, [12, 150], [0, 1], clamp);

  return (
    <Campaign05Scene format={format} duration={MASTER_BEATS.promise.duration} mode="teal" accent={campaign05Palette.saffron}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <Campaign05BrandMark dark compact={layout.square} />
        <h2 style={{margin: layout.vertical ? '32px 0 44px' : '28px 0 36px', fontFamily: fontDisplay, fontSize: layout.hero, lineHeight: 0.94, textTransform: 'uppercase', letterSpacing: '-0.035em'}}>
          Um fluxo
          <span style={{display: 'block', color: campaign05Palette.saffron}}>conectado.</span>
        </h2>
        <div
          style={{
            width: '100%',
            maxWidth: layout.horizontal ? 1500 : 900,
            display: 'flex',
            flexDirection: layout.vertical ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: layout.vertical ? 14 : 12,
          }}
        >
          {flowNodes.map((node, index) => {
            const active = interpolate(ribbonProgress, [index / flowNodes.length, (index + 1) / flowNodes.length], [0, 1], clamp);
            const enter = spring({frame: frame - 8 - index * 7, fps, config: {damping: 18, stiffness: 100}});
            const Icon = node.icon;
            return (
              <React.Fragment key={node.label}>
                <div style={{minWidth: layout.vertical ? 360 : layout.square ? 145 : 205, padding: layout.vertical ? '15px 19px' : '17px 18px', borderRadius: 20, background: `rgba(255,255,255,${0.1 + active * 0.12})`, border: `1px solid rgba(255,255,255,${0.15 + active * 0.15})`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: enter, transform: `scale(${0.92 + enter * 0.08})`}}>
                  <Icon size={layout.square ? 20 : 24} color={node.color} />
                  <span style={{fontFamily: fontBody, fontSize: layout.square ? 14 : 17, fontWeight: 800}}>{node.label}</span>
                </div>
                {index < flowNodes.length - 1 ? (
                  <ArrowRight size={layout.vertical ? 20 : 24} style={{transform: layout.vertical ? 'rotate(90deg)' : undefined, opacity: 0.35 + active * 0.65}} />
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
        <p style={{margin: layout.vertical ? '37px 0 0' : '30px 0 0', fontFamily: fontBody, fontSize: layout.lead, fontWeight: 650, color: 'rgba(255,255,255,.76)'}}>
          Cada etapa alimenta a próxima.
        </p>
      </AbsoluteFill>
    </Campaign05Scene>
  );
};

const ingredientRows = [
  ['Leite integral', 'Lácteos', 'Validado'],
  ['Sacarose', 'Açúcares', 'Validado'],
  ['Pistache puro', 'Frutos secos', 'Validado'],
  ['Fibra cítrica', 'Fibras', 'Validado'],
];

const IngredientLibrary: React.FC<{format: Campaign05Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useCampaign05Layout(format);
  const {fps} = useVideoConfig();
  const compact = !layout.horizontal;
  const width = layout.horizontal ? 990 : '100%';

  return (
    <Campaign05Window title="Banco de ingredientes" badge="Base ICone" accent={campaign05Palette.teal} style={{width}}>
      <div style={{padding: compact ? 20 : 27}}>
        <div style={{height: compact ? 47 : 52, border: `1px solid ${campaign05Palette.line}`, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, padding: '0 17px', color: campaign05Palette.muted}}>
          <Search size={20} />
          <span style={{fontFamily: fontBody, fontSize: compact ? 14 : 16}}>Buscar ingrediente, função ou categoria...</span>
        </div>
        <div style={{marginTop: 14}}>
          {ingredientRows.map((row, index) => {
            const enter = spring({frame: frame - 10 - index * 6, fps, config: {damping: 18, stiffness: 105}});
            return (
              <div key={row[0]} style={{height: compact ? 58 : 65, borderBottom: `1px solid ${campaign05Palette.line}`, display: 'grid', gridTemplateColumns: '1.4fr 1fr .7fr', alignItems: 'center', gap: 12, opacity: enter, transform: `translateX(${(1 - enter) * 28}px)`}}>
                <span style={{fontFamily: fontBody, fontSize: compact ? 14 : 17, fontWeight: 750, color: campaign05Palette.ink}}>{row[0]}</span>
                <span style={{fontFamily: fontBody, fontSize: compact ? 12 : 14, color: campaign05Palette.muted}}>{row[1]}</span>
                <span style={{justifySelf: 'end', padding: '6px 9px', borderRadius: 10, background: campaign05Palette.greenSoft, color: campaign05Palette.green, fontFamily: fontBody, fontSize: compact ? 10 : 12, fontWeight: 800}}>{row[2]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Campaign05Window>
  );
};

export const MasterTechnicalBaseScene: React.FC<{format: Campaign05Format}> = ({format}) => {
  const layout = useCampaign05Layout(format);
  const titleIn = useCampaign05Enter(6, 92);
  const vertical = layout.vertical;

  return (
    <Campaign05Scene format={format} duration={MASTER_BEATS.technicalBase.duration} mode="paper" accent={campaign05Palette.teal}>
      <AbsoluteFill style={{flexDirection: layout.horizontal ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: layout.horizontal ? 70 : vertical ? 45 : 25}}>
        <div style={{width: layout.horizontal ? '36%' : '100%', opacity: titleIn, transform: `translateY(${(1 - titleIn) * 26}px)`}}>
          <Campaign05Eyebrow accent={campaign05Palette.teal}>A BASE TÉCNICA JÁ ESTÁ AQUI</Campaign05Eyebrow>
          <h2 style={{margin: '20px 0 17px', fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 0.97, textTransform: 'uppercase', letterSpacing: '-0.025em'}}>
            Base pronta
            <span style={{display: 'block', color: campaign05Palette.teal}}>para formular.</span>
          </h2>
          <p style={{margin: 0, maxWidth: 590, fontFamily: fontBody, fontSize: layout.body, lineHeight: 1.42, color: campaign05Palette.muted}}>
            Comece com informação estruturada e amplie a biblioteca com os seus próprios ingredientes.
          </p>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 25}}>
            <Campaign05VerifiedPill>Base validada</Campaign05VerifiedPill>
            <Campaign05SparkBadge label="Engenharia reversa" />
            <div style={{display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 13px', borderRadius: 14, background: campaign05Palette.saffronSoft, color: '#946515', fontFamily: fontBody, fontSize: 13, fontWeight: 800}}>
              <Beaker size={16} /> Neutros reutilizáveis
            </div>
          </div>
        </div>
        <div style={{width: layout.horizontal ? '60%' : '100%', maxWidth: vertical ? 910 : undefined}}>
          <IngredientLibrary format={format} />
        </div>
      </AbsoluteFill>
    </Campaign05Scene>
  );
};

const gaugeZones: GaugeZone[] = [
  {from: 0, to: 0.28, color: '#F97316'},
  {from: 0.28, to: 0.73, color: '#10B981'},
  {from: 0.73, to: 1, color: '#DC2626'},
];

const recipeRows = [
  {name: 'Leite integral', qty: '520 g', cost: 'R$ 2,81'},
  {name: 'Creme 35%', qty: '120 g', cost: 'R$ 2,46'},
  {name: 'Sacarose', qty: '145 g', cost: 'R$ 0,68'},
  {name: 'Pasta de pistache', qty: '95 g', cost: 'R$ 8,17'},
];

const RecipeWorkbench: React.FC<{format: Campaign05Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useCampaign05Layout(format);
  const {fps} = useVideoConfig();
  const compact = !layout.horizontal;
  const balanced = frame > 260;

  return (
    <Campaign05Window title="Receita · Pistache autoral" badge={balanced ? 'Equilibrada' : 'Analisando'} accent={balanced ? campaign05Palette.green : campaign05Palette.saffron} style={{width: '100%', height: '100%'}}>
      <div style={{height: 'calc(100% - 57px)', padding: compact ? 18 : 25, display: 'flex', flexDirection: layout.vertical ? 'column' : 'row', gap: compact ? 16 : 24}}>
        <div style={{flex: layout.vertical ? '0 0 auto' : 1.12}}>
          <div style={{display: 'grid', gridTemplateColumns: '1.4fr .55fr .65fr', padding: '0 8px 10px', fontFamily: fontBody, fontSize: compact ? 10 : 12, fontWeight: 800, color: campaign05Palette.muted, textTransform: 'uppercase', letterSpacing: tracking.wide}}>
            <span>Ingrediente</span><span>Quantidade</span><span style={{textAlign: 'right'}}>Na receita</span>
          </div>
          {recipeRows.map((row, index) => {
            const enter = spring({frame: frame - 10 - index * 5, fps, config: {damping: 18, stiffness: 105}});
            return (
              <div key={row.name} style={{minHeight: compact ? 49 : 59, display: 'grid', gridTemplateColumns: '1.4fr .55fr .65fr', alignItems: 'center', gap: 7, padding: '0 8px', borderTop: `1px solid ${campaign05Palette.line}`, opacity: enter}}>
                <span style={{fontFamily: fontBody, fontSize: compact ? 12 : 15, fontWeight: 700, color: campaign05Palette.ink}}>{row.name}</span>
                <span style={{fontFamily: fontBody, fontSize: compact ? 11 : 13, color: campaign05Palette.muted}}>{row.qty}</span>
                <span style={{fontFamily: fontBody, fontSize: compact ? 11 : 14, fontWeight: 750, textAlign: 'right', color: campaign05Palette.teal}}>{row.cost}</span>
              </div>
            );
          })}
          <div style={{marginTop: 15, padding: compact ? '13px 15px' : '16px 18px', borderRadius: 16, background: campaign05Palette.tealSoft, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <Truck size={compact ? 18 : 22} color={campaign05Palette.teal} />
              <span style={{fontFamily: fontBody, fontSize: compact ? 12 : 15, fontWeight: 750, color: campaign05Palette.ink}}>Fornecedores conectados</span>
            </div>
            <span style={{fontFamily: fontDisplay, fontSize: compact ? 20 : 25, color: campaign05Palette.teal}}>R$ 14,12</span>
          </div>
        </div>

        <div style={{flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', alignContent: 'center', justifyItems: 'center', gap: compact ? 5 : 12}}>
          <GaugeArc label="Água" value={balanced ? '66,8%' : '72,4%'} fraction={balanced ? 0.52 : 0.82} zones={gaugeZones} size={compact ? 145 : 190} statusLabel={balanced ? 'Na faixa' : 'Atenção'} statusBg={balanced ? campaign05Palette.greenSoft : campaign05Palette.dangerSoft} statusColor={balanced ? campaign05Palette.green : campaign05Palette.danger} alert={!balanced} bare />
          <GaugeArc label="PAC" value={balanced ? '286' : '214'} fraction={balanced ? 0.58 : 0.22} zones={gaugeZones} size={compact ? 145 : 190} statusLabel={balanced ? 'Na faixa' : 'Baixo'} statusBg={balanced ? campaign05Palette.greenSoft : campaign05Palette.dangerSoft} statusColor={balanced ? campaign05Palette.green : campaign05Palette.danger} alert={!balanced} bare delay={4} />
          <GaugeArc label="POD" value="16,7%" fraction={0.5} zones={gaugeZones} size={compact ? 145 : 190} statusLabel="Na faixa" bare delay={8} />
          <GaugeArc label="Sólidos" value={balanced ? '34,1%' : '27,5%'} fraction={balanced ? 0.58 : 0.24} zones={gaugeZones} size={compact ? 145 : 190} statusLabel={balanced ? 'Na faixa' : 'Baixo'} statusBg={balanced ? campaign05Palette.greenSoft : campaign05Palette.dangerSoft} statusColor={balanced ? campaign05Palette.green : campaign05Palette.danger} alert={!balanced} bare delay={12} />
        </div>
      </div>
    </Campaign05Window>
  );
};

export const MasterDecisionScene: React.FC<{format: Campaign05Format}> = ({format}) => {
  const layout = useCampaign05Layout(format);
  const titleIn = useCampaign05Enter(4, 92);

  return (
    <Campaign05Scene format={format} duration={MASTER_BEATS.decision.duration} mode="ink" accent={campaign05Palette.teal}>
      <AbsoluteFill style={{flexDirection: 'column', justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: layout.horizontal ? 'row' : 'column', alignItems: layout.horizontal ? 'flex-end' : 'flex-start', justifyContent: 'space-between', gap: 15, marginBottom: layout.vertical ? 28 : 24, opacity: titleIn}}>
          <div>
            <Campaign05Eyebrow dark accent={campaign05Palette.teal}>SIMULE O IMPACTO</Campaign05Eyebrow>
            <h2 style={{margin: '15px 0 0', fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 0.96, textTransform: 'uppercase'}}>
              Decida antes
              <span style={{color: campaign05Palette.teal}}> do primeiro lote.</span>
            </h2>
          </div>
          <div style={{display: 'flex', gap: 9}}>
            {['Água', 'PAC', 'POD', 'Sólidos'].map((label) => (
              <span key={label} style={{padding: '8px 11px', borderRadius: 13, background: 'rgba(255,255,255,.10)', border: '1px solid rgba(255,255,255,.12)', fontFamily: fontBody, fontSize: layout.square ? 11 : 13, fontWeight: 750, color: 'rgba(255,255,255,.72)'}}>{label}</span>
            ))}
          </div>
        </div>
        <div style={{height: layout.horizontal ? 720 : layout.square ? 690 : 1070}}>
          <RecipeWorkbench format={format} />
        </div>
      </AbsoluteFill>
    </Campaign05Scene>
  );
};

type DocumentCardItem = {
  title: string;
  sub: string;
  icon: LucideIcon;
  color: string;
  soft: string;
};

const documents: DocumentCardItem[] = [
  {title: 'Tabela nutricional', sub: 'Calculada a partir da receita', icon: TableProperties, color: campaign05Palette.teal, soft: campaign05Palette.tealSoft},
  {title: 'Etiqueta', sub: 'Configuração e avisos da RDC 429', icon: Tag, color: campaign05Palette.violet, soft: campaign05Palette.violetSoft},
  {title: 'Ficha técnica', sub: 'Personalizável com a sua marca', icon: FileCheck2, color: campaign05Palette.blue, soft: campaign05Palette.blueSoft},
];

const RecipeSourceCard: React.FC<{compact?: boolean}> = ({compact = false}) => {
  const enter = useCampaign05Enter(7, 100);
  return (
    <div style={{width: compact ? 260 : 330, padding: compact ? 22 : 28, borderRadius: 27, background: campaign05Palette.ink, color: campaign05Palette.white, boxShadow: '0 28px 70px rgba(33,25,20,.24)', opacity: enter, transform: `scale(${0.92 + enter * 0.08})`}}>
      <div style={{width: compact ? 54 : 66, height: compact ? 54 : 66, borderRadius: 19, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,.10)'}}>
        <FlaskConical size={compact ? 28 : 34} color={campaign05Palette.saffron} />
      </div>
      <div style={{marginTop: 22, fontFamily: fontDisplay, fontSize: compact ? 27 : 35, textTransform: 'uppercase'}}>A mesma receita</div>
      <div style={{marginTop: 9, fontFamily: fontBody, fontSize: compact ? 13 : 16, lineHeight: 1.38, color: 'rgba(255,255,255,.62)'}}>Uma única fonte de informação.</div>
      <div style={{marginTop: 24, height: 7, borderRadius: 6, overflow: 'hidden', display: 'flex'}}>
        {[campaign05Palette.coral, campaign05Palette.saffron, campaign05Palette.teal, campaign05Palette.blue, campaign05Palette.violet].map((color) => (
          <span key={color} style={{flex: 1, background: color}} />
        ))}
      </div>
    </div>
  );
};

const DocumentCard: React.FC<{item: DocumentCardItem; index: number; compact?: boolean}> = ({item, index, compact = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 18 - index * 8, fps, config: {damping: 17, stiffness: 105}});
  const Icon = item.icon;
  return (
    <div style={{flex: 1, minWidth: 0, padding: compact ? '20px 18px' : '27px 25px', borderRadius: 25, background: 'rgba(255,255,255,.96)', border: `1px solid ${item.color}35`, boxShadow: '0 23px 55px rgba(73,55,45,.13)', opacity: enter, transform: `translateX(${(1 - enter) * 32}px)`}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{width: compact ? 48 : 59, height: compact ? 48 : 59, borderRadius: 18, background: item.soft, display: 'grid', placeItems: 'center'}}>
          <Icon size={compact ? 25 : 30} color={item.color} />
        </div>
        <CheckCircle2 size={compact ? 20 : 24} color={campaign05Palette.green} />
      </div>
      <div style={{marginTop: compact ? 17 : 23, fontFamily: fontDisplay, fontSize: compact ? 23 : 31, lineHeight: 1, textTransform: 'uppercase', color: campaign05Palette.ink}}>{item.title}</div>
      <div style={{marginTop: 10, fontFamily: fontBody, fontSize: compact ? 12 : 15, lineHeight: 1.38, color: campaign05Palette.muted}}>{item.sub}</div>
      <div style={{marginTop: compact ? 17 : 23, borderTop: `2px solid ${campaign05Palette.ink}`}} />
      {[0.7, 0.5, 0.82].map((width, row) => (
        <div key={width} style={{marginTop: 9, width: `${width * 100}%`, height: 5, borderRadius: 5, background: row === 0 ? item.soft : campaign05Palette.taupeSoft}} />
      ))}
    </div>
  );
};

export const MasterDocumentsScene: React.FC<{format: Campaign05Format}> = ({format}) => {
  const layout = useCampaign05Layout(format);
  const compact = !layout.horizontal;
  return (
    <Campaign05Scene format={format} duration={MASTER_BEATS.documents.duration} mode="paper" accent={campaign05Palette.violet}>
      <AbsoluteFill style={{justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: layout.horizontal ? 'row' : 'column', alignItems: layout.horizontal ? 'flex-end' : 'flex-start', justifyContent: 'space-between', gap: 13, marginBottom: layout.vertical ? 36 : 28}}>
          <div>
            <Campaign05Eyebrow accent={campaign05Palette.violet}>AUTONOMIA DOCUMENTAL</Campaign05Eyebrow>
            <h2 style={{margin: '15px 0 0', fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 0.96, textTransform: 'uppercase'}}>
              A receita já sabe
              <span style={{color: campaign05Palette.violet}}> o que vem depois.</span>
            </h2>
          </div>
          <p style={{margin: 0, maxWidth: layout.horizontal ? 520 : 820, fontFamily: fontBody, fontSize: layout.body, lineHeight: 1.38, color: campaign05Palette.muted}}>
            Gere e personalize sem reconstruir a informação em outra ferramenta.
          </p>
        </div>
        <div style={{display: 'flex', flexDirection: layout.vertical ? 'column' : 'row', alignItems: 'stretch', gap: layout.vertical ? 23 : 19}}>
          <RecipeSourceCard compact={compact} />
          <div style={{alignSelf: 'center', color: campaign05Palette.violet, transform: layout.vertical ? 'rotate(90deg)' : undefined}}>
            <ArrowRight size={compact ? 28 : 38} />
          </div>
          <div style={{flex: 1, display: 'flex', flexDirection: layout.vertical ? 'column' : 'row', gap: layout.vertical ? 13 : 14}}>
            {documents.map((item, index) => <DocumentCard key={item.title} item={item} index={index} compact={compact} />)}
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: layout.vertical ? 28 : 25}}>
          <div style={{display: 'inline-flex', alignItems: 'center', gap: 11, padding: '11px 16px', borderRadius: 16, background: campaign05Palette.greenSoft, color: campaign05Palette.green, fontFamily: fontBody, fontSize: compact ? 14 : 17, fontWeight: 800}}>
            <Check size={20} /> Você faz. A ICone dá o suporte.
          </div>
        </div>
      </AbsoluteFill>
    </Campaign05Scene>
  );
};

const outcomes = [
  {role: 'Gelateria', lead: 'Receita padronizada', detail: 'Custo visível antes do lote.', icon: IceCreamCone, color: campaign05Palette.coral},
  {role: 'Especialista', lead: 'Mais entregas', detail: 'Menos tarefa repetida por cliente.', icon: Users, color: campaign05Palette.violet},
  {role: 'Indústria', lead: 'Critério centralizado', detail: 'Documentação conectada à fórmula.', icon: Factory, color: campaign05Palette.teal},
];

export const MasterOutcomesScene: React.FC<{format: Campaign05Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const layout = useCampaign05Layout(format);
  return (
    <Campaign05Scene format={format} duration={MASTER_BEATS.outcomes.duration} mode="teal" accent={campaign05Palette.saffron}>
      <AbsoluteFill style={{justifyContent: 'center'}}>
        <Campaign05Eyebrow dark accent={campaign05Palette.saffron}>UM FLUXO. RESULTADOS DIFERENTES PARA CADA OPERAÇÃO.</Campaign05Eyebrow>
        <div style={{display: 'flex', flexDirection: layout.vertical ? 'column' : 'row', gap: layout.vertical ? 18 : 20, marginTop: layout.vertical ? 39 : 43}}>
          {outcomes.map((outcome, index) => {
            const enter = spring({frame: frame - 7 - index * 10, fps, config: {damping: 17, stiffness: 105}});
            const Icon = outcome.icon;
            return (
              <div key={outcome.role} style={{flex: 1, padding: layout.vertical ? '24px 27px' : layout.square ? '25px 22px' : '34px 31px', borderRadius: 28, background: 'rgba(255,255,255,.11)', border: '1px solid rgba(255,255,255,.16)', display: 'flex', flexDirection: layout.vertical ? 'row' : 'column', alignItems: layout.vertical ? 'center' : 'flex-start', gap: layout.vertical ? 23 : 25, opacity: enter, transform: `translateY(${(1 - enter) * 35}px)`}}>
                <div style={{width: layout.vertical ? 65 : 72, height: layout.vertical ? 65 : 72, flex: '0 0 auto', borderRadius: 22, background: `${outcome.color}2a`, display: 'grid', placeItems: 'center'}}><Icon size={layout.vertical ? 32 : 37} color={outcome.color} /></div>
                <div>
                  <div style={{fontFamily: fontBody, fontSize: layout.label, fontWeight: 800, textTransform: 'uppercase', letterSpacing: tracking.wide, color: 'rgba(255,255,255,.62)'}}>{outcome.role}</div>
                  <div style={{marginTop: 8, fontFamily: fontDisplay, fontSize: layout.vertical ? 35 : layout.square ? 31 : 43, lineHeight: 1, textTransform: 'uppercase', color: campaign05Palette.white}}>{outcome.lead}</div>
                  <div style={{marginTop: 11, fontFamily: fontBody, fontSize: layout.vertical ? 18 : layout.square ? 15 : 19, lineHeight: 1.38, color: 'rgba(255,255,255,.68)'}}>{outcome.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </Campaign05Scene>
  );
};

export const Campaign05CtaScene: React.FC<{
  format: Campaign05Format;
  duration: number;
  compact?: boolean;
}> = ({format, duration, compact = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const layout = useCampaign05Layout(format);
  const logoIn = spring({frame: frame - 2, fps, config: {damping: 16, stiffness: 98}});
  const titleIn = spring({frame: frame - 8, fps, config: {damping: 18, stiffness: 90}});
  return (
    <Campaign05Scene format={format} duration={duration} mode="ink" accent={campaign05Palette.saffron} fade={7}>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
        <div style={{width: compact ? 82 : layout.square ? 94 : 112, height: compact ? 82 : layout.square ? 94 : 112, borderRadius: compact ? 25 : 32, background: campaign05Palette.white, boxShadow: `0 24px 70px ${campaign05Palette.saffron}35`, display: 'grid', placeItems: 'center', opacity: logoIn, transform: `scale(${0.72 + logoIn * 0.28}) rotate(${(1 - logoIn) * -6}deg)`}}>
          <Img src={staticFile('brand/logo-light-transparent.png')} style={{width: '72%', height: '72%', objectFit: 'contain'}} />
        </div>
        <h2 style={{margin: compact ? '18px 0 14px' : '28px 0 19px', fontFamily: fontDisplay, fontSize: compact ? layout.title : layout.hero, lineHeight: 0.92, textTransform: 'uppercase', letterSpacing: '-0.035em', opacity: titleIn, transform: `translateY(${(1 - titleIn) * 24}px)`}}>
          Formule com
          <span style={{display: 'block', color: campaign05Palette.saffron}}>mais controle.</span>
        </h2>
        <div style={{display: 'flex', flexDirection: format === 'vertical' ? 'column' : 'row', alignItems: 'center', gap: format === 'vertical' ? 13 : 20}}>
          <Campaign05CtaButton compact={compact || layout.square} />
          <span style={{fontFamily: fontDisplay, fontSize: compact ? 18 : 23, fontWeight: 600, letterSpacing: tracking.industrial, textTransform: 'uppercase', color: 'rgba(255,255,255,.88)'}}>{CAMPAIGN_05_CLAIMS.site}</span>
        </div>
      </AbsoluteFill>
    </Campaign05Scene>
  );
};

const audienceVisual: Record<Exclude<Campaign05Audience, 'master'>, {icon: LucideIcon; color: string; soft: string}> = {
  gelateria: {icon: Store, color: campaign05Palette.coral, soft: campaign05Palette.coralSoft},
  especialista: {icon: BriefcaseBusiness, color: campaign05Palette.violet, soft: campaign05Palette.violetSoft},
  industria: {icon: Factory, color: campaign05Palette.teal, soft: campaign05Palette.tealSoft},
};

export const CutHookScene: React.FC<{
  format: Campaign05Format;
  audience: Exclude<Campaign05Audience, 'master'>;
  hookVariant: Campaign05HookVariant;
  duration: number;
}> = ({format, audience, hookVariant, duration}) => {
  const layout = useCampaign05Layout(format);
  const enter = useCampaign05Enter(3, 105);
  const copy = AUDIENCE_COPY[audience];
  const visual = audienceVisual[audience];
  const Icon = visual.icon;
  return (
    <Campaign05Scene format={format} duration={duration} mode="ink" accent={visual.color} fade={6}>
      <AbsoluteFill style={{justifyContent: 'center'}}>
        <div style={{display: 'flex', flexDirection: layout.horizontal ? 'row' : 'column', alignItems: layout.horizontal ? 'center' : 'flex-start', gap: layout.horizontal ? 58 : 27}}>
          <div style={{width: layout.horizontal ? 142 : layout.vertical ? 116 : 104, height: layout.horizontal ? 142 : layout.vertical ? 116 : 104, flex: '0 0 auto', borderRadius: layout.horizontal ? 42 : 34, background: `${visual.color}28`, border: `1px solid ${visual.color}55`, display: 'grid', placeItems: 'center', opacity: enter, transform: `scale(${0.72 + enter * 0.28}) rotate(${(1 - enter) * -7}deg)`}}>
            <Icon size={layout.horizontal ? 70 : layout.vertical ? 57 : 51} color={visual.color} strokeWidth={1.7} />
          </div>
          <div style={{opacity: enter, transform: `translateY(${(1 - enter) * 28}px)`}}>
            <Campaign05Eyebrow dark accent={visual.color}>{copy.eyebrow}</Campaign05Eyebrow>
            <h1 style={{maxWidth: layout.horizontal ? 1360 : 930, margin: '19px 0 0', fontFamily: fontDisplay, fontSize: layout.horizontal ? 82 : layout.hero, lineHeight: 0.96, textTransform: 'uppercase', letterSpacing: '-0.03em'}}>{copy.visual.hook[hookVariant]}</h1>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 11, marginTop: layout.vertical ? 27 : 23}}>
              {copy.visual.signals.map((signal, index) => (
                <div key={signal} style={{display: 'inline-flex', alignItems: 'center', gap: 9, padding: layout.vertical ? '11px 15px' : '9px 13px', borderRadius: 15, background: index === 0 ? `${visual.color}28` : 'rgba(255,255,255,.08)', border: `1px solid ${index === 0 ? `${visual.color}55` : 'rgba(255,255,255,.13)'}`, color: campaign05Palette.white, fontFamily: fontBody, fontSize: layout.vertical ? 20 : layout.label, fontWeight: 800}}>
                  <CheckCircle2 size={layout.vertical ? 21 : 18} color={visual.color} /> {signal}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </Campaign05Scene>
  );
};

export const CutProblemScene: React.FC<{
  format: Campaign05Format;
  audience: Exclude<Campaign05Audience, 'master'>;
  duration: number;
}> = ({format, audience, duration}) => {
  const layout = useCampaign05Layout(format);
  const copy = AUDIENCE_COPY[audience];
  const visual = audienceVisual[audience];
  const cards = audience === 'gelateria'
    ? [['Receita', TableProperties], ['Custo', Calculator], ['Fornecedor', Truck]] as const
    : audience === 'especialista'
      ? [['Cálculos', Calculator], ['Cliente', Users], ['Documentos', FileText]] as const
      : [['Parâmetros', Gauge], ['Fornecedores', Truck], ['Documentação', FileCheck2]] as const;
  return (
    <Campaign05Scene format={format} duration={duration} mode="paper" accent={visual.color}>
      <AbsoluteFill style={{justifyContent: 'center'}}>
        <Campaign05Eyebrow accent={visual.color}>ONDE A OPERAÇÃO PERDE RITMO</Campaign05Eyebrow>
        <h2 style={{maxWidth: 1320, margin: '18px 0 28px', fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 0.98, textTransform: 'uppercase'}}>{copy.visual.problem}</h2>
        <div style={{display: 'flex', flexDirection: layout.vertical ? 'column' : 'row', gap: layout.vertical ? 13 : 17}}>
          {cards.map(([label, Icon], index) => (
            <div key={label} style={{flex: 1, padding: layout.vertical ? '19px 22px' : '24px', borderRadius: 23, background: campaign05Palette.white, border: `1px solid ${visual.color}28`, boxShadow: '0 18px 45px rgba(73,55,45,.11)', display: 'flex', alignItems: 'center', gap: 15, transform: `rotate(${(index - 1) * 1.5}deg)`}}>
              <div style={{width: 49, height: 49, borderRadius: 16, background: visual.soft, display: 'grid', placeItems: 'center'}}><Icon size={25} color={visual.color} /></div>
              <span style={{fontFamily: fontBody, fontSize: layout.body, fontWeight: 800, color: campaign05Palette.ink}}>{label}</span>
              <AlertTriangle size={20} color={campaign05Palette.coral} style={{marginLeft: 'auto'}} />
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Campaign05Scene>
  );
};

const CutProofWorkbench: React.FC<{format: Campaign05Format; audience: Exclude<Campaign05Audience, 'master'>}> = ({format, audience}) => {
  const layout = useCampaign05Layout(format);
  const visual = audienceVisual[audience];
  const proofItems = audience === 'gelateria'
    ? [{label: 'Parâmetros ao vivo', icon: Gauge}, {label: 'Custo da receita', icon: CircleDollarSign}, {label: 'Ficha & etiqueta', icon: FileCheck2}]
    : audience === 'especialista'
      ? [{label: '+500 ingredientes', icon: Leaf}, {label: 'Formulação assistida', icon: FlaskConical}, {label: 'Documentos do cliente', icon: FileCheck2}]
      : [{label: 'Critérios técnicos', icon: ScanSearch}, {label: 'Custos & fornecedores', icon: Truck}, {label: 'Documentação', icon: BookOpenCheck}];
  return (
    <Campaign05Window title="ICone · fluxo conectado" badge="Ao vivo" accent={visual.color} style={{width: '100%'}}>
      <div style={{padding: layout.vertical ? 23 : layout.square ? 20 : 29}}>
        <div style={{display: 'flex', flexDirection: layout.vertical ? 'column' : 'row', alignItems: 'stretch', gap: layout.vertical ? 13 : 14}}>
          {proofItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <React.Fragment key={item.label}>
                <div style={{flex: 1, minHeight: layout.vertical ? 115 : 210, padding: layout.vertical ? '18px 20px' : '24px 22px', borderRadius: 21, background: index === 1 ? visual.soft : campaign05Palette.paper, border: `1px solid ${index === 1 ? visual.color : campaign05Palette.line}30`, display: 'flex', flexDirection: layout.vertical ? 'row' : 'column', alignItems: layout.vertical ? 'center' : 'flex-start', justifyContent: 'center', gap: 15}}>
                  <div style={{width: 52, height: 52, borderRadius: 17, background: campaign05Palette.white, display: 'grid', placeItems: 'center', boxShadow: '0 10px 28px rgba(73,55,45,.09)'}}><Icon size={27} color={visual.color} /></div>
                  <div style={{fontFamily: fontDisplay, fontSize: layout.vertical ? 28 : layout.square ? 24 : 31, lineHeight: 1, textTransform: 'uppercase', color: campaign05Palette.ink}}>{item.label}</div>
                </div>
                {index < proofItems.length - 1 ? <ArrowRight size={24} color={visual.color} style={{alignSelf: 'center', transform: layout.vertical ? 'rotate(90deg)' : undefined}} /> : null}
              </React.Fragment>
            );
          })}
        </div>
        <div style={{marginTop: 17, padding: '13px 16px', borderRadius: 16, background: campaign05Palette.greenSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, color: campaign05Palette.green, fontFamily: fontBody, fontSize: layout.square ? 14 : 17, fontWeight: 800}}>
          <CheckCircle2 size={21} /> Cada decisão atualiza a próxima
        </div>
      </div>
    </Campaign05Window>
  );
};

export const CutProofScene: React.FC<{
  format: Campaign05Format;
  audience: Exclude<Campaign05Audience, 'master'>;
  duration: number;
}> = ({format, audience, duration}) => {
  const layout = useCampaign05Layout(format);
  const copy = AUDIENCE_COPY[audience];
  const visual = audienceVisual[audience];
  return (
    <Campaign05Scene format={format} duration={duration} mode="paper" accent={visual.color}>
      <AbsoluteFill style={{justifyContent: 'center'}}>
        <Campaign05Eyebrow accent={visual.color}>A ICONE CONECTA O TRABALHO</Campaign05Eyebrow>
        <h2 style={{margin: '15px 0 24px', maxWidth: 1440, fontFamily: fontDisplay, fontSize: layout.title, lineHeight: 0.98, textTransform: 'uppercase'}}>{copy.visual.proof}</h2>
        <CutProofWorkbench format={format} audience={audience} />
      </AbsoluteFill>
    </Campaign05Scene>
  );
};

export const CutPayoffScene: React.FC<{
  format: Campaign05Format;
  audience: Exclude<Campaign05Audience, 'master'>;
  duration: number;
}> = ({format, audience, duration}) => {
  const layout = useCampaign05Layout(format);
  const visual = audienceVisual[audience];
  const copy = AUDIENCE_COPY[audience];
  const Icon = visual.icon;
  return (
    <Campaign05Scene format={format} duration={duration} mode="teal" accent={visual.color} fade={7}>
      <AbsoluteFill style={{flexDirection: layout.horizontal ? 'row' : 'column', alignItems: 'center', justifyContent: 'center', gap: layout.horizontal ? 55 : 28, textAlign: layout.horizontal ? 'left' : 'center'}}>
        <div style={{width: 100, height: 100, borderRadius: 31, background: `${visual.color}2c`, border: `1px solid ${visual.color}55`, display: 'grid', placeItems: 'center'}}><Icon size={51} color={visual.color} /></div>
        <div>
          <h2 style={{maxWidth: layout.horizontal ? 1320 : 930, margin: 0, fontFamily: fontDisplay, fontSize: layout.hero, lineHeight: 0.94, textTransform: 'uppercase'}}>
            {copy.visual.payoff}
          </h2>
          <div style={{marginTop: layout.vertical ? 25 : 19, fontFamily: fontBody, fontSize: layout.vertical ? 23 : layout.body, fontWeight: 750, color: campaign05Palette.saffron}}>
            {copy.visual.payoffDetail}
          </div>
        </div>
      </AbsoluteFill>
    </Campaign05Scene>
  );
};
