import React from 'react';
import {
  AbsoluteFill,
  interpolate,
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
 * Cena 3 — Banco de ingredientes: lista → chips saltando → ficha
 * do Pistache puro percorrendo as abas (Geral → Composição →
 * Tabela nutricional → Dosagem → Fonte) com conteúdo completo.
 */

const HIGHLIGHT_AT = 150;
const CHIPS_FLY = 195;
const LIST_OUT = 260;
const SHEET_IN = 275;

/** Início relativo (após SHEET_IN) de cada aba — ~3,7s cada. */
const TAB_HOLD = 112;
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

const CHIP_ORIGIN = {x: 960, y: 470};

const FLYING_CHIPS = [
  {label: 'Quanto usar', value: '8–11%', icon: Scale, bg: colors.warningSoft, color: colors.warning, to: {x: 280, y: 220}},
  {label: 'Temperatura', value: '65–70 °C', icon: Thermometer, bg: colors.infoSoft, color: colors.info, to: {x: 1640, y: 240}},
  {label: 'Inserção', value: 'Pós-pasteurização', icon: Snowflake, bg: colors.primarySoft, color: colors.primary, to: {x: 260, y: 780}},
  {label: 'Gordura', value: '45%', icon: FlaskConical, bg: '#FEF3C7', color: colors.fatAmber, to: {x: 1660, y: 760}},
  {label: 'Dose máx.', value: '12%', icon: ClipboardList, bg: colors.dangerSoft, color: colors.danger, to: {x: 420, y: 160}},
  {label: 'PAC · POD', value: '0,50 · 0,42', icon: Link2, bg: '#F5F3FF', color: colors.pacViolet, to: {x: 1500, y: 160}},
];

const MiniMetric: React.FC<{fraction: number; color: string; grow: number}> = ({
  fraction,
  color,
  grow,
}) => (
  <div
    style={{
      width: 74,
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.borderSoft,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        height: '100%',
        width: `${Math.min(1, fraction) * grow * 100}%`,
        backgroundColor: color,
        borderRadius: 5,
      }}
    />
  </div>
);

const IngredientList: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const highlight = spring({
    frame: frame - HIGHLIGHT_AT,
    fps,
    config: {damping: 200, stiffness: 120},
  });

  return (
    <div
      style={{
        width: 1480,
        borderRadius: radius.shell,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.shell,
        padding: 36,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
          <span
            style={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: 34,
              color: colors.textPrimary,
            }}
          >
            Banco de Ingredientes
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.md,
              padding: '8px 16px',
              color: colors.textMuted,
              fontFamily: fontBody,
              fontSize: 20,
            }}
          >
            <Search size={20} color={colors.textMuted} />
            Buscar ingrediente...
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: colors.primary,
            color: colors.textInverse,
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 20,
            padding: '12px 22px',
            borderRadius: radius.md,
          }}
        >
          <Plus size={20} color={colors.textInverse} />
          Novo Ingrediente
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2.2fr 1.2fr repeat(5, 1fr)',
          gap: 12,
          padding: '0 20px 12px',
          fontFamily: fontBody,
          fontWeight: 600,
          fontSize: 17,
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
        const delay = 22 + i * 12;
        const enter = spring({
          frame: frame - delay,
          fps,
          config: {damping: 200, stiffness: 120},
        });
        const isHighlighted = i === 1;
        const hl = isHighlighted ? highlight : 0;
        const dimOthers = !isHighlighted ? highlight * 0.55 : 0;
        const extractPulse =
          isHighlighted && frame >= CHIPS_FLY
            ? interpolate(frame, [CHIPS_FLY, CHIPS_FLY + 12, CHIPS_FLY + 28], [0, 1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            : 0;

        return (
          <div
            key={row.name}
            style={{
              display: 'grid',
              gridTemplateColumns: '2.2fr 1.2fr repeat(5, 1fr)',
              gap: 12,
              alignItems: 'center',
              padding: '16px 20px',
              borderRadius: radius.md,
              border: `1.5px solid ${
                isHighlighted && hl > 0.1 ? colors.primary : colors.borderSoft
              }`,
              backgroundColor:
                isHighlighted && hl > 0.1 ? colors.primarySoft : colors.surface,
              marginBottom: 10,
              opacity: enter * (1 - dimOthers),
              transform: `translateX(${(1 - enter) * -40}px) scale(${1 + hl * 0.02 + extractPulse * 0.03})`,
              boxShadow:
                isHighlighted && (hl > 0.1 || extractPulse > 0)
                  ? `0 8px 28px rgba(122,106,90,${0.12 + extractPulse * 0.2})`
                  : 'none',
            }}
          >
            <span
              style={{
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: 22,
                color: colors.textPrimary,
              }}
            >
              {row.name}
            </span>
            <span style={{fontFamily: fontBody, fontSize: 19, color: colors.textMuted}}>
              {row.family}
            </span>
            <MiniMetric fraction={row.agua} color={colors.primary} grow={enter} />
            <MiniMetric fraction={row.gordura} color={colors.fatAmberBar} grow={enter} />
            <MiniMetric fraction={row.acucar} color={colors.sugarPinkBar} grow={enter} />
            <MiniMetric fraction={row.pac / 2} color={colors.pacViolet} grow={enter} />
            <MiniMetric fraction={row.pod} color={colors.primaryMuted} grow={enter} />
          </div>
        );
      })}
    </div>
  );
};

const FlyingChip: React.FC<(typeof FLYING_CHIPS)[number] & {index: number}> = ({
  label,
  value,
  icon: Icon,
  bg,
  color,
  to,
  index,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const delay = CHIPS_FLY + index * 6;
  const fly = spring({
    frame: frame - delay,
    fps,
    config: {damping: 14, stiffness: 90, mass: 0.85},
  });

  const jump = Math.sin(Math.min(1, Math.max(0, fly)) * Math.PI) * 90;
  const x = CHIP_ORIGIN.x + (to.x - CHIP_ORIGIN.x) * fly;
  const y = CHIP_ORIGIN.y + (to.y - CHIP_ORIGIN.y) * fly - jump;
  const opacity = interpolate(
    frame,
    [delay, delay + 8, LIST_OUT - 8, LIST_OUT + 12],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.55 + fly * 0.55}) rotate(${(1 - fly) * (index % 2 === 0 ? -8 : 8)}deg)`,
        opacity,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        backgroundColor: colors.surface,
        border: `1.5px solid ${color}`,
        borderRadius: radius.lg,
        boxShadow: shadows.shell,
        padding: '14px 22px',
        minWidth: 220,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: radius.md,
          backgroundColor: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={26} color={color} strokeWidth={2} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 500,
            fontSize: 16,
            color: colors.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 26,
            color: colors.textPrimary,
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

/** Card auxiliar genérico para conteúdo das abas. */
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
        padding: 22,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        backgroundColor: colors.surface,
        boxShadow: highlight ? shadows.md : shadows.sm,
        ...style,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: radius.md,
            backgroundColor: bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={26} color={color} strokeWidth={2} />
        </div>
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 22,
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
              fontSize: 18,
              color: colors.textSecondary,
              opacity: lineIn,
              lineHeight: 1.4,
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
  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, height: '100%'}}>
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
    <div style={{display: 'flex', flexDirection: 'column', gap: 22}}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
        {metrics.map((m, i) => (
          <div
            key={m.label}
            style={{
              padding: '16px 20px',
              borderRadius: radius.lg,
              border: `1px solid ${colors.borderSoft}`,
              backgroundColor: colors.surfaceMuted,
            }}
          >
            <GaugeBar
              label={m.label}
              valueLabel={m.value}
              fraction={m.fraction}
              color={m.color}
              delay={delay + 6 + i * 8}
              width={520}
            />
          </div>
        ))}
      </div>
      <div style={{display: 'flex', gap: 16}}>
        <Pill bg="#F5F3FF" color={colors.pacViolet} fontSize={20}>
          PAC · 0,50
        </Pill>
        <Pill bg={colors.primarySoft} color={colors.primary} fontSize={20}>
          POD · 0,42
        </Pill>
        <Pill bg={colors.successSoft} color={colors.success} fontSize={20}>
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
        padding: '22px 28px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 14,
          fontFamily: fontBody,
        }}
      >
        <span style={{fontWeight: 700, fontSize: 24, color: colors.textPrimary}}>
          Tabela nutricional
        </span>
        <span style={{fontSize: 18, color: colors.textMuted}}>por 100 g</span>
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
              padding: '11px 4px',
              borderBottom:
                i < rows.length - 1 ? `1px solid ${colors.borderSoft}` : 'none',
              fontFamily: fontBody,
              fontSize: 20,
            }}
          >
            <span style={{color: colors.textSecondary}}>{row.name}</span>
            <span style={{fontWeight: 700, color: colors.textPrimary}}>
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
    <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16}}>
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
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                textAlign: 'center',
                boxShadow: shadows.md,
              }}
            >
              <item.icon size={36} color={item.tint} strokeWidth={1.9} />
              <span
                style={{
                  fontFamily: fontBody,
                  fontSize: 15,
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
                  fontSize: 32,
                  color: colors.textPrimary,
                  lineHeight: 1.1,
                }}
              >
                {item.value}
              </span>
              <span style={{fontFamily: fontBody, fontSize: 17, color: colors.textSecondary}}>
                {item.sub}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
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
    <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
      <div
        style={{
          opacity: bannerIn,
          transform: `translateY(${(1 - bannerIn) * 20}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '18px 24px',
          borderRadius: radius.lg,
          border: `1.5px solid ${colors.success}`,
          backgroundColor: colors.successSoft,
        }}
      >
        <ShieldCheck size={36} color={colors.success} strokeWidth={2} />
        <div style={{flex: 1}}>
          <span
            style={{
              fontFamily: fontBody,
              fontWeight: 700,
              fontSize: 24,
              color: colors.textPrimary,
            }}
          >
            Dados documentados e rastreáveis
          </span>
          <div style={{fontFamily: fontBody, fontSize: 18, color: colors.textMuted, marginTop: 4}}>
            Última validação · 12/07/2026 · Confiança alta
          </div>
        </div>
        <Pill bg={colors.surface} color="#166534" border={colors.success} fontSize={18}>
          <BadgeCheck size={18} color="#166534" />
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
              gap: 16,
              padding: '18px 22px',
              borderRadius: radius.lg,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surface,
              boxShadow: shadows.sm,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: radius.md,
                backgroundColor: colors.primarySoft,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={26} color={colors.primary} strokeWidth={1.9} />
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: 22,
                  color: colors.textPrimary,
                }}
              >
                {source.name}
              </span>
              <span style={{fontFamily: fontBody, fontSize: 18, color: colors.textMuted}}>
                {source.detail}
              </span>
            </div>
            <ExternalLink size={22} color={colors.textMuted} />
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

const IngredientSheet: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const open = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, stiffness: 90},
  });

  // Tour pelas abas começa ~20 frames após a ficha abrir
  const tourStart = delay + 20;
  const local = Math.max(0, frame - tourStart);
  const activeTab = Math.min(TABS.length - 1, Math.floor(local / TAB_HOLD));
  const tabLocal = local - activeTab * TAB_HOLD;

  // Crossfade entre conteúdos de aba
  const contentOpacity = interpolate(
    tabLocal,
    [0, 8, TAB_HOLD - 10, TAB_HOLD],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  // Na última aba, não fade-out
  const finalOpacity =
    activeTab === TABS.length - 1
      ? interpolate(tabLocal, [0, 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : contentOpacity;

  const contentSlide = interpolate(tabLocal, [0, 10], [18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity: open,
        transform: `translateY(${(1 - open) * 80}px) scale(${0.96 + open * 0.04})`,
        width: 1640,
        height: 900,
        borderRadius: radius.shell,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.shell,
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar fixa */}
      <div
        style={{
          backgroundColor: colors.surfaceMuted,
          borderRight: `1px solid ${colors.borderSoft}`,
          padding: 26,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: '50%',
            background: `linear-gradient(145deg, #D1FAE5 0%, #A7F3D0 55%, ${colors.warningSoft} 100%)`,
            border: `2px solid ${colors.success}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: shadows.md,
          }}
        >
          <Nut size={44} color={colors.success} strokeWidth={1.7} />
        </div>
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 26,
            color: colors.textPrimary,
            textAlign: 'center',
          }}
        >
          Pistache puro
        </span>
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center'}}>
          <Pill bg={colors.primarySoft} color={colors.primary} fontSize={15}>
            Ingrediente simples
          </Pill>
          <Pill bg={colors.successSoft} color={colors.success} fontSize={15}>
            Oleaginosa
          </Pill>
        </div>

        <div
          style={{
            width: '100%',
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 11,
          }}
        >
          <GaugeBar label="Água" valueLabel="5%" fraction={0.05} color={colors.primary} delay={delay + 12} width={248} />
          <GaugeBar label="Gordura" valueLabel="45%" fraction={0.45} color={colors.fatAmberBar} delay={delay + 18} width={248} />
          <GaugeBar label="Açúcares" valueLabel="8%" fraction={0.08} color={colors.sugarPinkBar} delay={delay + 24} width={248} />
          <GaugeBar label="Sólidos" valueLabel="95%" fraction={0.95} color={colors.pacViolet} delay={delay + 30} width={248} />
        </div>

        <div
          style={{
            width: '100%',
            marginTop: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {[
            {icon: Scale, label: 'Quanto usar', value: '8–11%', tint: colors.warning, soft: colors.warningSoft},
            {icon: Thermometer, label: 'Temperatura', value: '65–70 °C', tint: colors.info, soft: colors.infoSoft},
            {icon: Snowflake, label: 'Inserção', value: 'Pós-pasteurização', tint: colors.primary, soft: colors.primarySoft},
          ].map((item, i) => {
            // Destaca o card da sidebar quando a aba Dosagem está ativa
            const isDoseTab = activeTab === 3;
            const pop = spring({
              frame: frame - delay - 36 - i * 6,
              fps,
              config: {damping: 12, stiffness: 160, mass: 0.6},
            });
            return (
              <div
                key={item.label}
                style={{
                  opacity: pop,
                  transform: `translateY(${(1 - pop) * 14}px) scale(${isDoseTab ? 1.02 : 1})`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: radius.md,
                  backgroundColor: item.soft,
                  border: `1.5px solid ${isDoseTab ? item.tint : colors.borderSoft}`,
                  boxShadow: isDoseTab ? shadows.sm : 'none',
                }}
              >
                <item.icon size={20} color={item.tint} strokeWidth={2} />
                <div style={{display: 'flex', flexDirection: 'column', gap: 1}}>
                  <span
                    style={{
                      fontFamily: fontBody,
                      fontSize: 12,
                      fontWeight: 500,
                      color: colors.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontFamily: fontBody,
                      fontWeight: 700,
                      fontSize: 17,
                      color: colors.textPrimary,
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conteúdo com abas animadas */}
      <div
        style={{
          padding: '24px 30px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}
      >
        <div style={{display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap'}}>
          {TABS.map((tab, i) => {
            const isActive = i === activeTab;
            // Indicador de “já visitada”
            const visited = i < activeTab;
            return (
              <span
                key={tab}
                style={{
                  fontFamily: fontBody,
                  fontWeight: 600,
                  fontSize: 18,
                  padding: '10px 18px',
                  borderRadius: radius.md,
                  border: `1.5px solid ${
                    isActive ? 'rgba(122,106,90,0.45)' : colors.borderSoft
                  }`,
                  backgroundColor: isActive
                    ? 'rgba(239,232,223,0.65)'
                    : visited
                      ? colors.surfaceMuted
                      : 'transparent',
                  color: isActive
                    ? colors.primary
                    : visited
                      ? colors.textSecondary
                      : colors.textMuted,
                  boxShadow: isActive ? shadows.sm : 'none',
                  transform: isActive ? 'translateY(-2px)' : 'none',
                  transition: 'none',
                }}
              >
                {tab}
              </span>
            );
          })}
        </div>

        {/* Barra de progresso do tour nas abas */}
        <div
          style={{
            height: 4,
            borderRadius: 2,
            backgroundColor: colors.borderSoft,
            marginBottom: 22,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${((activeTab + Math.min(1, tabLocal / TAB_HOLD)) / TABS.length) * 100}%`,
              backgroundColor: colors.primary,
              borderRadius: 2,
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            opacity: finalOpacity,
            transform: `translateX(${contentSlide}px)`,
            minHeight: 0,
          }}
        >
          <TabContent
            tab={TABS[activeTab]}
            delay={tourStart + activeTab * TAB_HOLD + 4}
          />
        </div>
      </div>
    </div>
  );
};

export const Scene03: React.FC = () => {
  const frame = useCurrentFrame();

  const listOpacity = interpolate(frame, [LIST_OUT, LIST_OUT + 16], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const listScale = interpolate(frame, [LIST_OUT, LIST_OUT + 16], [1, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <SceneBackground>
      <AbsoluteFill
        style={{alignItems: 'center', justifyContent: 'flex-start', paddingTop: 40}}
      >
        <Eyebrow delay={4}>Banco de Ingredientes</Eyebrow>
      </AbsoluteFill>

      {frame < LIST_OUT + 18 ? (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 36,
            opacity: listOpacity,
            transform: `scale(${listScale})`,
          }}
        >
          <IngredientList />
        </AbsoluteFill>
      ) : null}

      {frame >= CHIPS_FLY && frame < SHEET_IN + 20
        ? FLYING_CHIPS.map((chip, i) => (
            <FlyingChip key={chip.label} {...chip} index={i} />
          ))
        : null}

      {frame >= SHEET_IN - 10 ? (
        <AbsoluteFill
          style={{alignItems: 'center', justifyContent: 'center', paddingTop: 10}}
        >
          <IngredientSheet delay={SHEET_IN} />
        </AbsoluteFill>
      ) : null}
    </SceneBackground>
  );
};
