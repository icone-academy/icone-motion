import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  BadgeCheck,
  ClipboardList,
  ExternalLink,
  FileText,
  FlaskConical,
  Link2,
  Nut,
  Plus,
  Scale,
  Search,
  ShieldCheck,
  Snowflake,
  Thermometer,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {Pill} from '../components/Pill';
import {GaugeBar} from '../components/GaugeBar';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 3 — Banco de ingredientes em beats fullscreen (como a receita):
 * 1) Lista  2–6) Tour de abas: Geral → Composição → Nutrição → Dosagem → Fonte
 */

export const BEAT = {
  list: 150,
  geral: 72,
  composicao: 72,
  nutricao: 72,
  dosagem: 72,
  fonte: 72,
} as const;

export const SCENE03_TOTAL =
  BEAT.list +
  BEAT.geral +
  BEAT.composicao +
  BEAT.nutricao +
  BEAT.dosagem +
  BEAT.fonte; // 510

const TABS = ['Geral', 'Composição', 'Tabela nutricional', 'Dosagem', 'Fonte'] as const;
type TabName = (typeof TABS)[number];

const ROWS = [
  {name: 'Leite em pó desnatado', family: 'Lácteos', agua: 0.04, gordura: 0.1, acucar: 0.52, pac: 0.5, pod: 0.42},
  {name: 'Pistache puro', family: 'Oleaginosas', agua: 0.05, gordura: 0.45, acucar: 0.08, pac: 0.3, pod: 0.1},
  {name: 'Sacarose', family: 'Açúcares', agua: 0.0, gordura: 0.0, acucar: 1.0, pac: 1.0, pod: 1.0},
  {name: 'Dextrose', family: 'Açúcares', agua: 0.08, gordura: 0.0, acucar: 0.92, pac: 1.9, pod: 0.74},
  {name: 'Creme de leite 35%', family: 'Lácteos', agua: 0.59, gordura: 0.35, acucar: 0.03, pac: 0.06, pod: 0.03},
  {name: 'Polpa de morango', family: 'Frutas', agua: 0.9, gordura: 0.0, acucar: 0.07, pac: 0.08, pod: 0.06},
];

const MiniMetric: React.FC<{fraction: number; color: string; grow: number}> = ({
  fraction,
  color,
  grow,
}) => (
  <div
    style={{
      width: 96,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.borderSoft,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        height: '100%',
        width: `${Math.min(1, fraction) * grow * 100}%`,
        backgroundColor: color,
        borderRadius: 7,
      }}
    />
  </div>
);

const TabsBar: React.FC<{
  active: TabName;
  tabIndex: number;
  duration: number;
}> = ({active, tabIndex, duration}) => {
  const frame = useCurrentFrame();
  const local = Math.min(1, Math.max(0, frame / Math.max(1, duration - 1)));
  const progressPct = ((tabIndex + local) / TABS.length) * 100;

  return (
    <div style={{marginBottom: 8}}>
      <div style={{display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap'}}>
        {TABS.map((tab, i) => {
          const isActive = tab === active;
          const visited = i < tabIndex;
          return (
            <span
              key={tab}
              style={{
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: 22,
                padding: '12px 20px',
                borderRadius: radius.md,
                border: `1px solid ${
                  isActive ? 'rgba(122,106,90,0.45)' : colors.borderSoft
                }`,
                backgroundColor: isActive
                  ? 'rgba(239,232,223,0.75)'
                  : visited
                    ? colors.surfaceMuted
                    : 'transparent',
                color: isActive
                  ? colors.primary
                  : visited
                    ? colors.textSecondary
                    : colors.textMuted,
              }}
            >
              {tab}
            </span>
          );
        })}
      </div>
      <div
        style={{
          height: 5,
          borderRadius: 3,
          backgroundColor: colors.borderSoft,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPct}%`,
            backgroundColor: colors.primary,
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
};

const BeatList: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const highlight = spring({
    frame: frame - 70,
    fps,
    config: {damping: 200, stiffness: 120},
  });

  return (
    <SceneBackground>
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 28,
          paddingBottom: 36,
        }}
      >
        <div
          style={{
            width: 1760,
            borderRadius: radius.shell,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.shell,
            padding: '36px 40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 28,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: 52,
                  color: colors.textPrimary,
                }}
              >
                Banco de Ingredientes
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  border: `1px solid ${colors.border}`,
                  borderRadius: radius.md,
                  padding: '12px 20px',
                  color: colors.textMuted,
                  fontFamily: fontBody,
                  fontSize: 26,
                }}
              >
                <Search size={26} color={colors.textMuted} />
                Buscar ingrediente...
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: colors.primary,
                color: colors.textInverse,
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: 26,
                padding: '14px 26px',
                borderRadius: radius.md,
              }}
            >
              <Plus size={26} color={colors.textInverse} />
              Novo Ingrediente
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2.2fr 1.2fr repeat(5, 1fr)',
              gap: 14,
              padding: '0 22px 14px',
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: 22,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: colors.textMuted,
            }}
          >
            <span>Nome</span>
            <span>Família</span>
            <span>Água</span>
            <span>Gordura</span>
            <span>Açúcares</span>
            <span>PAC</span>
            <span>POD</span>
          </div>

          {ROWS.map((row, i) => {
            const delay = 18 + i * 12;
            const enter = spring({
              frame: frame - delay,
              fps,
              config: {damping: 200, stiffness: 120},
            });
            const isHighlighted = i === 1;
            const hl = isHighlighted ? highlight : 0;
            const dimOthers = !isHighlighted ? highlight * 0.55 : 0;

            return (
              <div
                key={row.name}
                style={{
                  opacity: enter * (1 - dimOthers),
                  transform: `translateY(${(1 - enter) * 24}px) scale(${1 + hl * 0.015})`,
                  display: 'grid',
                  gridTemplateColumns: '2.2fr 1.2fr repeat(5, 1fr)',
                  gap: 14,
                  alignItems: 'center',
                  padding: '18px 22px',
                  marginBottom: 10,
                  borderRadius: radius.md,
                  backgroundColor: isHighlighted
                    ? 'rgba(239,232,223,0.9)'
                    : colors.surfaceMuted,
                  border: `1.5px solid ${
                    isHighlighted ? colors.primary : colors.borderSoft
                  }`,
                  boxShadow: isHighlighted ? shadows.md : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: fontBody,
                    fontWeight: 700,
                    fontSize: 30,
                    color: colors.textPrimary,
                  }}
                >
                  {row.name}
                </span>
                <span style={{fontFamily: fontBody, fontSize: 24, color: colors.textMuted}}>
                  {row.family}
                </span>
                <MiniMetric fraction={row.agua} color={colors.primary} grow={enter} />
                <MiniMetric fraction={row.gordura} color={colors.fatAmberBar} grow={enter} />
                <MiniMetric fraction={row.acucar} color={colors.sugarPinkBar} grow={enter} />
                <MiniMetric fraction={Math.min(1, row.pac / 2)} color={colors.pacViolet} grow={enter} />
                <MiniMetric fraction={row.pod} color={colors.success} grow={enter} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};

const InfoCard: React.FC<{
  icon: React.ComponentType<{size?: number; color?: string; strokeWidth?: number}>;
  title: string;
  lines: string[];
  bg: string;
  color: string;
  delay: number;
  highlight?: boolean;
  style?: React.CSSProperties;
}> = ({icon: Icon, title, lines, bg, color, delay, highlight, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 14, stiffness: 140, mass: 0.65},
  });

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 28}px)`,
        border: `1.5px solid ${highlight ? color : colors.borderSoft}`,
        borderRadius: radius.lg,
        padding: '30px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        backgroundColor: colors.surface,
        boxShadow: highlight ? shadows.md : shadows.sm,
        ...style,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: radius.md,
            backgroundColor: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={38} color={color} strokeWidth={2} />
        </div>
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 38,
            color: colors.textPrimary,
          }}
        >
          {title}
        </span>
      </div>
      {lines.map((line, j) => {
        const lineIn = interpolate(frame - delay - 6 - j * 4, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return (
          <span
            key={line}
            style={{
              fontFamily: fontBody,
              fontSize: 32,
              fontWeight: 500,
              color: colors.textSecondary,
              opacity: lineIn,
              lineHeight: 1.35,
            }}
          >
            {line}
          </span>
        );
      })}
    </div>
  );
};

const TabGeral: React.FC<{delay: number}> = ({delay}) => (
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, height: '100%'}}>
    <InfoCard
      icon={Nut}
      title="Identidade"
      bg={colors.successSoft}
      color={colors.success}
      delay={delay}
      lines={[
        'Nome · Pistache puro (pasta 100%)',
        'Família · Oleaginosas',
        'Tipo · Ingrediente simples',
        'Origem · Pasta de pistache verde',
        'Status · Ativo no workspace',
      ]}
    />
    <InfoCard
      icon={Snowflake}
      title="Aplicações práticas"
      bg={colors.primarySoft}
      color={colors.primary}
      delay={delay + 10}
      lines={[
        'Gelato premium de pistache',
        'Base branca e mantecados',
        'Overrun sugerido · 25–35%',
        'Conservar pasta refrigerada',
        'Sabor intenso · dose controlada',
      ]}
    />
    <InfoCard
      icon={Link2}
      title="Compatibilidades"
      bg="#ECFDF5"
      color={colors.success}
      delay={delay + 20}
      highlight
      lines={[
        'Combina · dextrose e leite em pó',
        'Sinergia · creme 35%',
        'Substitui · pasta de avelã (com ajuste)',
        'Evitar · excesso de água livre',
      ]}
      style={{gridColumn: '1 / -1'}}
    />
  </div>
);

const TabComposicao: React.FC<{delay: number}> = ({delay}) => {
  const metrics = [
    {label: 'Água', value: '5%', fraction: 0.05, color: colors.primary},
    {label: 'Gordura', value: '45%', fraction: 0.45, color: colors.fatAmberBar},
    {label: 'Açúcares', value: '8%', fraction: 0.08, color: colors.sugarPinkBar},
    {label: 'Proteína', value: '20%', fraction: 0.2, color: colors.pacViolet},
    {label: 'Sólidos totais', value: '95%', fraction: 0.95, color: colors.success},
    {label: 'Fibras', value: '10%', fraction: 0.1, color: colors.gaugeSlate},
  ];

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 28, height: '100%'}}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, flex: 1}}>
        {metrics.map((m, i) => (
          <div
            key={m.label}
            style={{
              padding: '22px 28px',
              borderRadius: radius.lg,
              border: `1px solid ${colors.borderSoft}`,
              backgroundColor: colors.surfaceMuted,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <GaugeBar
              label={m.label}
              valueLabel={m.value}
              fraction={m.fraction}
              color={m.color}
              delay={delay + 6 + i * 8}
              width={740}
              fontSize={30}
              barHeight={20}
            />
          </div>
        ))}
      </div>
      <div style={{display: 'flex', gap: 18}}>
        <Pill bg="#F5F3FF" color={colors.pacViolet} fontSize={28} style={{padding: '14px 22px'}}>
          PAC · 0,50
        </Pill>
        <Pill bg={colors.primarySoft} color={colors.primary} fontSize={28} style={{padding: '14px 22px'}}>
          POD · 0,42
        </Pill>
        <Pill bg={colors.successSoft} color={colors.success} fontSize={28} style={{padding: '14px 22px'}}>
          SLNG · 50%
        </Pill>
      </div>
    </div>
  );
};

const TabNutricao: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const rows = [
    {name: 'Valor energético', target: 562, unit: 'kcal', decimals: 0},
    {name: 'Carboidratos', target: 28, unit: 'g', decimals: 0},
    {name: 'Açúcares totais', target: 8, unit: 'g', decimals: 0},
    {name: 'Gorduras totais', target: 45, unit: 'g', decimals: 0},
    {name: 'Gorduras saturadas', target: 5.5, unit: 'g', decimals: 1},
    {name: 'Proteínas', target: 20, unit: 'g', decimals: 0},
    {name: 'Fibras alimentares', target: 10, unit: 'g', decimals: 0},
    {name: 'Sódio', target: 5, unit: 'mg', decimals: 0},
  ];

  return (
    <div
      style={{
        borderRadius: radius.lg,
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.surfaceMuted,
        padding: '28px 44px',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 16,
          fontFamily: fontBody,
        }}
      >
        <span style={{fontWeight: 700, fontSize: 40, color: colors.textPrimary}}>
          Tabela nutricional
        </span>
        <span style={{fontSize: 30, color: colors.textMuted, fontWeight: 500}}>
          por 100 g
        </span>
      </div>
      {rows.map((row, i) => {
        const rowDelay = delay + 4 + i * 7;
        const rowIn = interpolate(frame - rowDelay, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const counted = interpolate(frame - rowDelay, [0, 20], [0, row.target], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const display =
          row.decimals > 0
            ? counted.toFixed(row.decimals).replace('.', ',')
            : String(Math.round(counted));

        return (
          <div
            key={row.name}
            style={{
              opacity: rowIn,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 6px',
              borderBottom:
                i < rows.length - 1 ? `1px solid ${colors.borderSoft}` : 'none',
              fontFamily: fontBody,
              fontSize: 32,
            }}
          >
            <span style={{color: colors.textSecondary, fontWeight: 500}}>{row.name}</span>
            <span style={{fontWeight: 700, color: colors.textPrimary, fontSize: 34}}>
              {display} {row.unit}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const TabDosagem: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const heroItems = [
    {
      icon: Scale,
      label: 'Quanto usar',
      value: '8–11%',
      sub: 'da mistura final',
      tint: colors.warning,
      soft: colors.warningSoft,
    },
    {
      icon: Thermometer,
      label: 'Temperatura',
      value: '65–70 °C',
      sub: 'na inserção',
      tint: colors.info,
      soft: colors.infoSoft,
    },
    {
      icon: Snowflake,
      label: 'Momento',
      value: 'Pós-pasteurização',
      sub: 'antes do aging',
      tint: colors.primary,
      soft: colors.primarySoft,
    },
  ];

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 22, height: '100%'}}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20}}>
        {heroItems.map((item, i) => {
          const pop = spring({
            frame: frame - delay - i * 8,
            fps,
            config: {damping: 11, stiffness: 150, mass: 0.65},
          });
          return (
            <div
              key={item.label}
              style={{
                opacity: pop,
                transform: `translateY(${(1 - pop) * 30}px) scale(${0.94 + pop * 0.06})`,
                borderRadius: radius.lg,
                border: `2px solid ${item.tint}`,
                backgroundColor: item.soft,
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                textAlign: 'center',
                boxShadow: shadows.md,
              }}
            >
              <item.icon size={42} color={item.tint} strokeWidth={1.9} />
              <span
                style={{
                  fontFamily: fontBody,
                  fontSize: 22,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: colors.textMuted,
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: 52,
                  color: colors.textPrimary,
                  lineHeight: 1.1,
                }}
              >
                {item.value}
              </span>
              <span style={{fontFamily: fontBody, fontSize: 24, color: colors.textSecondary}}>
                {item.sub}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1}}>
        <InfoCard
          icon={ClipboardList}
          title="Limites e protocolo"
          bg={colors.dangerSoft}
          color={colors.danger}
          delay={delay + 28}
          highlight
          lines={[
            'Dose máxima · 12% da mistura',
            'Homogeneizar 2–3 min após inserção',
            'Não aquecer acima de 75 °C',
            'Incorporar com mixer ou turbo',
          ]}
        />
        <InfoCard
          icon={FlaskConical}
          title="Efeito na receita"
          bg="#F5F3FF"
          color={colors.pacViolet}
          delay={delay + 36}
          lines={[
            'Eleva gordura e sólidos totais',
            'Contribui pouco para PAC/POD',
            'Cor e sabor característicos',
            'Ajustar açúcares se dose > 10%',
          ]}
        />
      </div>
    </div>
  );
};

const TabFonte: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const sources = [
    {name: 'Ficha do fabricante', detail: 'Pasta 100% pistache · lote 2026'},
    {name: 'TBCA', detail: 'Tabela Brasileira de Composição'},
    {name: 'USDA', detail: 'FoodData Central · referência cruzada'},
  ];

  const bannerIn = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, stiffness: 100},
  });

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 22, height: '100%'}}>
      <div
        style={{
          opacity: bannerIn,
          transform: `translateY(${(1 - bannerIn) * 20}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '28px 34px',
          borderRadius: radius.lg,
          border: `1.5px solid ${colors.success}`,
          backgroundColor: colors.successSoft,
        }}
      >
        <ShieldCheck size={54} color={colors.success} strokeWidth={2} />
        <div style={{flex: 1}}>
          <span
            style={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: 38,
              color: colors.textPrimary,
            }}
          >
            Dados documentados e rastreáveis
          </span>
          <div style={{fontFamily: fontBody, fontSize: 28, color: colors.textMuted, marginTop: 6}}>
            Última validação · 12/07/2026 · Confiança alta
          </div>
        </div>
        <Pill bg={colors.surface} color="#166534" border={colors.success} fontSize={26}>
          <BadgeCheck size={26} color="#166534" />
          Validado
        </Pill>
      </div>

      {sources.map((source, i) => {
        const enter = spring({
          frame: frame - delay - 14 - i * 10,
          fps,
          config: {damping: 14, stiffness: 140, mass: 0.65},
        });
        return (
          <div
            key={source.name}
            style={{
              opacity: enter,
              transform: `translateX(${(1 - enter) * 30}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '28px 32px',
              borderRadius: radius.lg,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surface,
              boxShadow: shadows.sm,
              flex: 1,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: radius.md,
                backgroundColor: colors.primarySoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={40} color={colors.primary} strokeWidth={1.9} />
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 6}}>
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: 36,
                  color: colors.textPrimary,
                }}
              >
                {source.name}
              </span>
              <span style={{fontFamily: fontBody, fontSize: 30, color: colors.textMuted}}>
                {source.detail}
              </span>
            </div>
            <ExternalLink size={34} color={colors.textMuted} />
          </div>
        );
      })}
    </div>
  );
};

const TabContent: React.FC<{tab: TabName; delay: number}> = ({tab, delay}) => {
  switch (tab) {
    case 'Geral':
      return <TabGeral delay={delay} />;
    case 'Composição':
      return <TabComposicao delay={delay} />;
    case 'Tabela nutricional':
      return <TabNutricao delay={delay} />;
    case 'Dosagem':
      return <TabDosagem delay={delay} />;
    case 'Fonte':
      return <TabFonte delay={delay} />;
  }
};

const BeatTab: React.FC<{
  active: TabName;
  tabIndex: number;
  duration: number;
}> = ({active, tabIndex, duration}) => (
  <SceneBackground>
    <AbsoluteFill
      style={{
        padding: '32px 56px 36px',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <Eyebrow delay={2} fontSize={34}>
            Banco de Ingredientes
          </Eyebrow>
          <div
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: 52,
              color: colors.primary,
              marginTop: 8,
            }}
          >
            Pistache puro
          </div>
          <div style={{display: 'flex', gap: 12, marginTop: 12}}>
            <Pill bg={colors.primarySoft} color={colors.primary} fontSize={20}>
              Ingrediente simples
            </Pill>
            <Pill bg={colors.successSoft} color={colors.success} fontSize={20}>
              Oleaginosa
            </Pill>
          </div>
        </div>
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: `linear-gradient(145deg, #D1FAE5 0%, #A7F3D0 55%, ${colors.warningSoft} 100%)`,
            border: `2.5px solid ${colors.success}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: shadows.md,
          }}
        >
          <Nut size={48} color={colors.success} strokeWidth={1.7} />
        </div>
      </div>

      <TabsBar active={active} tabIndex={tabIndex} duration={duration} />

      <div style={{flex: 1, minHeight: 0}}>
        <TabContent tab={active} delay={6} />
      </div>
    </AbsoluteFill>
  </SceneBackground>
);

export const Scene03: React.FC = () => {
  const fromGeral = BEAT.list;
  const fromComposicao = fromGeral + BEAT.geral;
  const fromNutricao = fromComposicao + BEAT.composicao;
  const fromDosagem = fromNutricao + BEAT.nutricao;
  const fromFonte = fromDosagem + BEAT.dosagem;

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={BEAT.list} name="Lista">
        <BeatList />
      </Sequence>
      <Sequence from={fromGeral} durationInFrames={BEAT.geral} name="Geral">
        <BeatTab active="Geral" tabIndex={0} duration={BEAT.geral} />
      </Sequence>
      <Sequence from={fromComposicao} durationInFrames={BEAT.composicao} name="Composição">
        <BeatTab active="Composição" tabIndex={1} duration={BEAT.composicao} />
      </Sequence>
      <Sequence from={fromNutricao} durationInFrames={BEAT.nutricao} name="Tabela nutricional">
        <BeatTab active="Tabela nutricional" tabIndex={2} duration={BEAT.nutricao} />
      </Sequence>
      <Sequence from={fromDosagem} durationInFrames={BEAT.dosagem} name="Dosagem">
        <BeatTab active="Dosagem" tabIndex={3} duration={BEAT.dosagem} />
      </Sequence>
      <Sequence from={fromFonte} durationInFrames={BEAT.fonte} name="Fonte">
        <BeatTab active="Fonte" tabIndex={4} duration={BEAT.fonte} />
      </Sequence>
    </AbsoluteFill>
  );
};
