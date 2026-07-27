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
  BadgeDollarSign,
  Building2,
  Calculator,
  ClipboardList,
  FileText,
  Globe,
  Package,
  Printer,
  Save,
  Scale,
  Snowflake,
  Sparkles,
  Tag,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {Pill} from '../components/Pill';
import {GaugeArc, GaugeZone} from '../components/GaugeArc';
import {colors, radius} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 5 — Workbench de receita em beats fullscreen:
 * 1) Composição
 * 2–5) Tour de abas: Gauges → Resumo → Explicação → Valores Nutricionais
 */

export const BEAT = {
  composition: 420, // ~14s — configurar receita / ingredientes
  gauges: 480, // ~16s — painel de parâmetros
  resumo: 150, // ~5s
  explanation: 330, // ~11s — texto simples
  nutrition: 360, // ~12s — tabela nutricional
} as const;

export const SCENE05_TOTAL =
  BEAT.composition +
  BEAT.gauges +
  BEAT.resumo +
  BEAT.explanation +
  BEAT.nutrition; // 1740

const ZONES: GaugeZone[] = [
  {from: 0, to: 0.2, color: colors.gaugeRed},
  {from: 0.2, to: 0.35, color: colors.gaugeOrange},
  {from: 0.35, to: 0.7, color: colors.gaugeGreen},
  {from: 0.7, to: 0.85, color: colors.gaugeOrange},
  {from: 0.85, to: 1, color: colors.gaugeRed},
];

type GaugeStatus = 'perfect' | 'technical' | 'out';

const STATUS_STYLE = {
  perfect: {label: 'Ótimo', bg: colors.successSoft, color: colors.success},
  technical: {label: 'Bom', bg: colors.warningSoft, color: colors.warning},
  out: {label: 'Atenção', bg: colors.dangerSoft, color: colors.gaugeRed},
} as const;

const GAUGES: {
  label: string;
  value: string;
  fraction: number;
  status: GaugeStatus;
}[] = [
  {label: 'Água', value: '64%', fraction: 0.48, status: 'perfect'},
  {label: 'Açúcares Totais', value: '22%', fraction: 0.52, status: 'perfect'},
  {label: 'Gordura Totais', value: '8%', fraction: 0.42, status: 'perfect'},
  {label: 'Proteínas', value: '4,2%', fraction: 0.45, status: 'perfect'},
  {label: 'Sólidos Totais', value: '38%', fraction: 0.5, status: 'perfect'},
  {label: 'PAC', value: '28', fraction: 0.55, status: 'perfect'},
  {label: 'POD', value: '18', fraction: 0.5, status: 'perfect'},
  {label: 'Overrun final', value: '28%', fraction: 0.48, status: 'perfect'},
  {label: 'Cristalização', value: 'Boa', fraction: 0.46, status: 'perfect'},
  {label: 'Cremosidade', value: 'Alta', fraction: 0.5, status: 'perfect'},
  {label: 'Lactose', value: '5%', fraction: 0.4, status: 'perfect'},
  {label: 'Índice glicêmico', value: '42', fraction: 0.38, status: 'technical'},
];

const COMPOSITION_ROWS = [
  {
    name: 'Leite integral',
    scope: 'global' as const,
    supplier: 'Laticínios Serra',
    pricePerKg: 'R$ 4,80',
    priceInRecipe: 'R$ 2,50',
    qty: '520 g',
  },
  {
    name: 'Creme de leite 35%',
    scope: 'global' as const,
    supplier: 'Laticínios Serra',
    pricePerKg: 'R$ 18,90',
    priceInRecipe: 'R$ 3,40',
    qty: '180 g',
  },
  {
    name: 'Sacarose',
    scope: 'workspace' as const,
    supplier: 'Doce Brasil',
    pricePerKg: 'R$ 5,20',
    priceInRecipe: 'R$ 0,99',
    qty: '190 g',
  },
  {
    name: 'Pistache puro',
    scope: 'workspace' as const,
    supplier: 'Nuts & Co',
    pricePerKg: 'R$ 186,00',
    priceInRecipe: 'R$ 14,88',
    qty: '80 g',
  },
  {
    name: 'Leite em pó desnatado',
    scope: 'global' as const,
    supplier: 'Laticínios Serra',
    pricePerKg: 'R$ 32,00',
    priceInRecipe: 'R$ 0,80',
    qty: '25 g',
  },
  {
    name: 'Neutro base branca',
    scope: 'global' as const,
    supplier: 'ICone Neutros',
    pricePerKg: 'R$ 98,00',
    priceInRecipe: 'R$ 0,49',
    qty: '5 g',
  },
];

const FOOTER_CARDS = [
  {icon: Scale, label: 'Peso Total', value: '1.000 g'},
  {icon: Calculator, label: 'Custo Total na Receita', value: 'R$ 23,06'},
  {icon: BadgeDollarSign, label: 'Custo/kg', value: 'R$ 23,06/Kg'},
  {icon: Package, label: 'Alvo de produção', value: '5.000 g'},
];

const EXPLANATION_PARAS = [
  'Esta receita está bem equilibrada para um gelato de pistache.',
  'A água e os açúcares estão na faixa ideal — o gelato congela de forma limpa e cremosa.',
  'O PAC indica ponto de congelamento adequado para vitrine; o POD traz doçura equilibrada sem mascarar o pistache.',
  'Overrun e cremosidade sugerem boa estrutura na mantecação e estabilidade na exposição.',
];

const NUTRITION_ROWS = [
  {name: 'Valor energético', value: '186 kcal'},
  {name: 'Carboidratos', value: '22 g'},
  {name: 'Açúcares totais', value: '20 g'},
  {name: 'Gorduras totais', value: '8,5 g'},
  {name: 'Gorduras saturadas', value: '4,2 g'},
  {name: 'Proteínas', value: '4,1 g'},
  {name: 'Fibras', value: '0,8 g'},
  {name: 'Sódio', value: '52 mg'},
];

const RESUMO_SECTIONS: {
  title: string;
  rows: {label: string; value: string; status: GaugeStatus}[];
}[] = [
  {
    title: 'Composição complementar',
    rows: [
      {label: 'Lactose', value: '5%', status: 'perfect'},
      {label: 'Fibras', value: '0,8%', status: 'perfect'},
      {label: 'Frutas', value: '0%', status: 'perfect'},
      {label: 'SLNG', value: '9%', status: 'perfect'},
      {label: 'Outros sólidos', value: '3%', status: 'technical'},
      {label: 'Neutro / Estabilizante', value: '0,5%', status: 'technical'},
    ],
  },
  {
    title: 'Água Livre & Cristalização',
    rows: [
      {label: 'Água livre', value: '12%', status: 'perfect'},
      {label: 'Índice de cristalização', value: '42', status: 'perfect'},
      {label: 'Qualidade da cristalização', value: '88%', status: 'perfect'},
    ],
  },
  {
    title: 'Viscosidade & Cremosidade',
    rows: [
      {label: 'Índice de viscosidade', value: '68', status: 'perfect'},
      {label: 'Cremosidade real', value: '74', status: 'perfect'},
      {label: 'Índice de derretimento', value: '55', status: 'perfect'},
      {label: 'Índice de paladar', value: '72', status: 'perfect'},
    ],
  },
  {
    title: 'Comportamento por Temperatura',
    rows: [
      {label: 'Temp. ideal da vitrine', value: '−12,5 °C', status: 'perfect'},
      {label: 'Mantecação (−6 °C)', value: 'Equilibrado', status: 'perfect'},
      {label: 'Vitrine (−10 °C)', value: 'Equilibrado', status: 'perfect'},
      {label: 'Freezer (−18 °C)', value: 'Estável', status: 'perfect'},
    ],
  },
  {
    title: 'Simulação de Qualidade',
    rows: [
      {label: 'Maciez do gelato na vitrine', value: '78', status: 'perfect'},
      {label: 'Cremosidade na vitrine', value: '81', status: 'perfect'},
      {label: 'Estabilidade na vitrine', value: '76', status: 'perfect'},
    ],
  },
  {
    title: 'Índices do Gelato',
    rows: [
      {label: 'Espátulabilidade', value: '82', status: 'perfect'},
      {label: 'Corpo', value: '79', status: 'perfect'},
      {label: 'Estabilidade da estrutura', value: '84', status: 'perfect'},
      {label: 'Índice global do gelato', value: '80', status: 'perfect'},
    ],
  },
];

const ANALYSIS_TABS = [
  'Gauges',
  'Resumo',
  'Explicação',
  'Valores Nutricionais',
] as const;
type AnalysisTab = (typeof ANALYSIS_TABS)[number];

const StatusPill: React.FC<{status: GaugeStatus; fontSize?: number}> = ({
  status,
  fontSize = 14,
}) => {
  const st = STATUS_STYLE[status];
  return (
    <Pill
      bg={st.bg}
      color={st.color}
      fontSize={fontSize}
      style={{padding: `${Math.round(fontSize * 0.35)}px ${Math.round(fontSize * 0.85)}px`}}
    >
      {st.label}
    </Pill>
  );
};

const ShellHeader: React.FC<{showActions?: boolean; titleSize?: number}> = ({
  showActions = true,
  titleSize = 24,
}) => (
  <div
    style={{
      height: titleSize >= 32 ? 80 : 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      borderBottom: `1px solid ${colors.borderSoft}`,
      flexShrink: 0,
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <span
        style={{
          fontFamily: fontBody,
          fontWeight: 700,
          fontSize: titleSize,
          color: colors.textPrimary,
        }}
      >
        Gelato de Pistache
      </span>
      <span
        style={{
          fontFamily: fontBody,
          fontSize: Math.round(titleSize * 0.55),
          color: colors.textMuted,
        }}
      >
        v1.2
      </span>
    </div>
    {showActions ? (
      <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: colors.primary,
            color: colors.textInverse,
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 16,
            padding: '12px 18px',
            borderRadius: radius.md,
          }}
        >
          <Save size={18} color={colors.textInverse} />
          Salvar
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            color: colors.textPrimary,
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 16,
            padding: '12px 18px',
            borderRadius: radius.md,
          }}
        >
          <Printer size={18} color={colors.primary} />
          Imprimir
        </div>
      </div>
    ) : null}
  </div>
);

const TabsBar: React.FC<{
  active: AnalysisTab;
  tabIndex: number;
  duration: number;
}> = ({active, tabIndex, duration}) => {
  const frame = useCurrentFrame();
  const local = Math.min(1, Math.max(0, frame / Math.max(1, duration - 1)));
  const progressPct = ((tabIndex + local) / ANALYSIS_TABS.length) * 100;

  return (
    <div style={{marginBottom: 14}}>
      <div style={{display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap'}}>
        {ANALYSIS_TABS.map((tab, i) => {
          const isActive = tab === active;
          const visited = i < tabIndex;
          return (
            <span
              key={tab}
              style={{
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: 17,
                padding: '10px 16px',
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
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.borderSoft,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progressPct}%`,
            backgroundColor: colors.primary,
            borderRadius: 2,
          }}
        />
      </div>
    </div>
  );
};

/* ─── Beat 1: Composição ─────────────────────────────────────────── */

const BeatComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const panelIn = spring({
    frame: frame - 4,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          opacity: panelIn,
          transform: `translateY(${(1 - panelIn) * 18}px)`,
          position: 'absolute',
          inset: 0,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ShellHeader titleSize={42} />
        <div
          style={{
            flex: 1,
            padding: '16px 28px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            minHeight: 0,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2.4fr 1.4fr 1fr 1.15fr 0.9fr',
              gap: 12,
              padding: '0 16px 14px',
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: 18,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: colors.textMuted,
              borderBottom: `1px solid ${colors.borderSoft}`,
            }}
          >
            <span>Ingrediente</span>
            <span style={{textAlign: 'center'}}>Fornecedor</span>
            <span style={{textAlign: 'center'}}>Preço/kg</span>
            <span style={{textAlign: 'center'}}>Preço na receita</span>
            <span style={{textAlign: 'center'}}>Peso</span>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            {COMPOSITION_ROWS.map((row, i) => {
              const enter = spring({
                frame: frame - 14 - i * 5,
                fps,
                config: {damping: 200, stiffness: 130},
              });
              const isGlobal = row.scope === 'global';
              const ScopeIcon = isGlobal ? Globe : Building2;
              return (
                <div
                  key={row.name}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2.4fr 1.4fr 1fr 1.15fr 0.9fr',
                    gap: 12,
                    alignItems: 'center',
                    padding: '20px 16px',
                    borderRadius: radius.md,
                    backgroundColor: i % 2 === 0 ? colors.surfaceMuted : colors.surface,
                    opacity: enter,
                    transform: `translateX(${(1 - enter) * -18}px)`,
                    fontFamily: fontBody,
                    fontSize: 26,
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 14,
                      fontWeight: 600,
                      color: colors.textPrimary,
                    }}
                  >
                    <ScopeIcon
                      size={28}
                      color={isGlobal ? colors.success : colors.primary}
                      strokeWidth={2.25}
                    />
                    {row.name}
                  </span>
                  <span style={{textAlign: 'center', color: colors.textSecondary, fontSize: 24}}>
                    {row.supplier}
                  </span>
                  <span style={{textAlign: 'center', color: colors.textMuted, fontSize: 24}}>
                    {row.pricePerKg}
                  </span>
                  <span
                    style={{
                      textAlign: 'center',
                      fontWeight: 700,
                      color: colors.textPrimary,
                      fontSize: 26,
                    }}
                  >
                    {row.priceInRecipe}
                  </span>
                  <span
                    style={{
                      textAlign: 'center',
                      fontWeight: 700,
                      fontSize: 26,
                    }}
                  >
                    {row.qty}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Cards logo abaixo da tabela de ingredientes */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 18,
              marginTop: 10,
              flexShrink: 0,
            }}
          >
            {FOOTER_CARDS.map((card, i) => {
              const pop = spring({
                frame: frame - 40 - i * 4,
                fps,
                config: {damping: 14, stiffness: 140, mass: 0.65},
              });
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  style={{
                    opacity: pop,
                    transform: `translateY(${(1 - pop) * 12}px)`,
                    borderRadius: radius.lg,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.surfaceMuted,
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    minHeight: 140,
                    justifyContent: 'center',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <Icon size={30} color={colors.primary} strokeWidth={2} />
                    <span
                      style={{
                        fontFamily: fontBody,
                        fontSize: 17,
                        fontWeight: 600,
                        color: colors.textMuted,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        lineHeight: 1.25,
                      }}
                    >
                      {card.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: fontBody,
                      fontWeight: 700,
                      fontSize: 36,
                      color: colors.textPrimary,
                    }}
                  >
                    {card.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 22,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <Eyebrow delay={2} fontSize={30}>
          Criação de receita
        </Eyebrow>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Beat 2: Gauges ─────────────────────────────────────────────── */

const BeatGauges: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const panelIn = spring({
    frame: frame - 2,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          opacity: panelIn,
          transform: `translateY(${(1 - panelIn) * 14}px)`,
          position: 'absolute',
          inset: 0,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ShellHeader showActions={false} />
        <div
          style={{
            flex: 1,
            padding: '16px 28px 28px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <TabsBar active="Gauges" tabIndex={0} duration={BEAT.gauges} />

          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 10,
              justifyItems: 'center',
              alignContent: 'start',
              minHeight: 0,
              overflow: 'hidden',
              paddingTop: 4,
            }}
          >
            {GAUGES.map((gauge, i) => {
              const st = STATUS_STYLE[gauge.status];
              return (
                <GaugeArc
                  key={gauge.label}
                  label={gauge.label}
                  value={gauge.value}
                  fraction={gauge.fraction}
                  zones={ZONES}
                  delay={8 + i * 4}
                  size={168}
                  statusLabel={st.label}
                  statusBg={st.bg}
                  statusColor={st.color}
                />
              );
            })}
          </div>

          {/* Temperatura em destaque — faixa própria abaixo do grid */}
          <div
            style={{
              opacity: interpolate(frame, [8, 22], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '18px 28px',
              borderRadius: radius.lg,
              border: `2px solid rgba(37, 99, 235, 0.35)`,
              backgroundColor: colors.infoSoft,
              boxShadow: '0 10px 28px rgba(37, 99, 235, 0.12)',
              flexShrink: 0,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: radius.md,
                backgroundColor: 'rgba(37, 99, 235, 0.14)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Snowflake size={32} color={colors.info} strokeWidth={2.25} />
            </div>
            <div style={{flex: 1, minWidth: 0}}>
              <div
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: colors.info,
                  marginBottom: 4,
                }}
              >
                Temperatura ideal da vitrine
              </div>
              <div
                style={{
                  fontFamily: fontBody,
                  fontSize: 18,
                  color: colors.textSecondary,
                }}
              >
                Comportamento estável para exposição e serviço
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: 48,
                  lineHeight: 1,
                  color: colors.textPrimary,
                  letterSpacing: '-0.02em',
                }}
              >
                −12,5
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: colors.info,
                    marginLeft: 6,
                  }}
                >
                  °C
                </span>
              </span>
              <StatusPill status="perfect" fontSize={18} />
            </div>
          </div>
        </div>
      </div>

      <div style={{position: 'absolute', top: 18, right: 28, zIndex: 20}}>
        <Eyebrow delay={2} fontSize={24}>
          Parâmetros técnicos
        </Eyebrow>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Beat 3: Resumo ─────────────────────────────────────────────── */

const BeatResumo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const panelIn = spring({
    frame: frame - 2,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          opacity: panelIn,
          transform: `translateY(${(1 - panelIn) * 14}px)`,
          position: 'absolute',
          inset: 0,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ShellHeader showActions={false} />
        <div
          style={{
            flex: 1,
            padding: '14px 28px 24px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <TabsBar active="Resumo" tabIndex={1} duration={BEAT.resumo} />
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 14,
              minHeight: 0,
              alignContent: 'start',
            }}
          >
            {RESUMO_SECTIONS.map((section, s) => {
              const secIn = spring({
                frame: frame - 6 - s * 8,
                fps,
                config: {damping: 200, stiffness: 110},
              });
              return (
                <div
                  key={section.title}
                  style={{
                    opacity: secIn,
                    transform: `translateY(${(1 - secIn) * 12}px)`,
                    borderRadius: radius.md,
                    border: `1px solid ${colors.border}`,
                    backgroundColor: colors.surfaceMuted,
                    padding: '14px 18px',
                    minHeight: 0,
                  }}
                >
                  <div
                    style={{
                      fontFamily: fontDisplay,
                      fontWeight: 600,
                      fontSize: 18,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: colors.primary,
                      marginBottom: 6,
                    }}
                  >
                    {section.title}
                  </div>
                  {section.rows.map((row) => (
                    <div
                      key={row.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 10,
                        padding: '9px 0',
                        borderBottom: `1px solid ${colors.borderSoft}`,
                        fontFamily: fontBody,
                        fontSize: 22,
                      }}
                    >
                      <span style={{color: colors.textSecondary, fontWeight: 500}}>
                        {row.label}
                      </span>
                      <div style={{display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0}}>
                        <span style={{fontWeight: 700, color: colors.textPrimary, fontSize: 24}}>
                          {row.value}
                        </span>
                        <StatusPill status={row.status} fontSize={15} />
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{position: 'absolute', top: 18, right: 28, zIndex: 20}}>
        <Eyebrow delay={2} fontSize={24}>
          Aba Resumo
        </Eyebrow>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Beat 4: Explicação ─────────────────────────────────────────── */

const BeatExplanation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const panelIn = spring({
    frame: frame - 2,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  const headerIn = spring({
    frame: frame - 10,
    fps,
    config: {damping: 200, stiffness: 100},
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          opacity: panelIn,
          transform: `translateY(${(1 - panelIn) * 14}px)`,
          position: 'absolute',
          inset: 0,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ShellHeader showActions={false} />
        <div
          style={{
            flex: 1,
            padding: '16px 48px 28px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <TabsBar active="Explicação" tabIndex={2} duration={BEAT.explanation} />
          <div
            style={{
              flex: 1,
              borderRadius: radius.lg,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surfaceMuted,
              padding: '28px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              justifyContent: 'flex-start',
              alignContent: 'flex-start',
            }}
          >
            <div style={{opacity: headerIn, display: 'flex', alignItems: 'center', gap: 16}}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: radius.md,
                  backgroundColor: colors.primarySoft,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={28} color={colors.primary} strokeWidth={2} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: fontDisplay,
                    fontWeight: 600,
                    fontSize: 30,
                    color: colors.textPrimary,
                  }}
                >
                  Inteligência ICone
                </div>
                <div style={{fontFamily: fontBody, fontSize: 20, color: colors.textMuted}}>
                  Tradução simples dos parâmetros técnicos
                </div>
              </div>
            </div>

            {EXPLANATION_PARAS.map((para, i) => {
              const lineIn = interpolate(frame - 22 - i * 16, [0, 12], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <p
                  key={para}
                  style={{
                    opacity: lineIn,
                    transform: `translateY(${(1 - lineIn) * 12}px)`,
                    margin: 0,
                    fontFamily: fontBody,
                    fontSize: 28,
                    lineHeight: 1.45,
                    color: colors.textSecondary,
                  }}
                >
                  {para}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{position: 'absolute', top: 18, right: 28, zIndex: 20}}>
        <Eyebrow delay={2} fontSize={24}>
          Aba Explicação
        </Eyebrow>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Beat 5: Valores Nutricionais ───────────────────────────────── */

const BeatNutrition: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const panelIn = spring({
    frame: frame - 2,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  const ctaIn = spring({
    frame: frame - 28,
    fps,
    config: {damping: 14, stiffness: 130, mass: 0.7},
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          opacity: panelIn,
          transform: `translateY(${(1 - panelIn) * 14}px)`,
          position: 'absolute',
          inset: 0,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ShellHeader showActions={false} />
        <div
          style={{
            flex: 1,
            padding: '16px 48px 28px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            gap: 16,
          }}
        >
          <TabsBar
            active="Valores Nutricionais"
            tabIndex={3}
            duration={BEAT.nutrition}
          />

          <div style={{opacity: ctaIn, display: 'flex', gap: 14}}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '18px 22px',
                borderRadius: radius.md,
                backgroundColor: colors.primary,
                color: colors.textInverse,
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: 24,
              }}
            >
              <Tag size={24} color={colors.textInverse} />
              Gerar Etiqueta
            </div>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                padding: '18px 22px',
                borderRadius: radius.md,
                backgroundColor: colors.surface,
                border: `2px solid ${colors.primary}`,
                color: colors.primary,
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: 24,
              }}
            >
              <ClipboardList size={24} color={colors.primary} />
              Gerar Ficha Técnica
            </div>
          </div>

          <div
            style={{
              flex: 1,
              borderRadius: radius.lg,
              border: `1px solid ${colors.border}`,
              backgroundColor: colors.surfaceMuted,
              padding: '28px 36px',
              display: 'flex',
              flexDirection: 'column',
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
              <span style={{fontWeight: 700, fontSize: 28, color: colors.textPrimary}}>
                Informação nutricional
              </span>
              <span style={{fontSize: 20, color: colors.textMuted}}>
                por 100 g · calculada automaticamente
              </span>
            </div>
            {NUTRITION_ROWS.map((row, i) => {
              const rowIn = interpolate(frame - 12 - i * 5, [0, 8], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <div
                  key={row.name}
                  style={{
                    opacity: rowIn,
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '14px 4px',
                    borderBottom:
                      i < NUTRITION_ROWS.length - 1
                        ? `1px solid ${colors.borderSoft}`
                        : 'none',
                    fontFamily: fontBody,
                    fontSize: 24,
                  }}
                >
                  <span style={{color: colors.textSecondary}}>{row.name}</span>
                  <span style={{fontWeight: 700, color: colors.textPrimary}}>{row.value}</span>
                </div>
              );
            })}
          </div>

          <div
            style={{
              opacity: interpolate(frame, [70, 90], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: fontBody,
              fontSize: 18,
              color: colors.textMuted,
            }}
          >
            <FileText size={20} color={colors.primary} />
            Sem retrabalho — etiqueta e ficha sempre coerentes com a formulação.
          </div>
        </div>
      </div>

      <div style={{position: 'absolute', top: 18, right: 28, zIndex: 20}}>
        <Eyebrow delay={2} fontSize={24}>
          Valores nutricionais
        </Eyebrow>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene ──────────────────────────────────────────────────────── */

export const Scene05: React.FC = () => {
  const fromGauges = BEAT.composition;
  const fromResumo = fromGauges + BEAT.gauges;
  const fromExplanation = fromResumo + BEAT.resumo;
  const fromNutrition = fromExplanation + BEAT.explanation;

  return (
    <SceneBackground>
      <Sequence from={0} durationInFrames={BEAT.composition} name="Composição">
        <BeatComposition />
      </Sequence>
      <Sequence from={fromGauges} durationInFrames={BEAT.gauges} name="Gauges">
        <BeatGauges />
      </Sequence>
      <Sequence from={fromResumo} durationInFrames={BEAT.resumo} name="Resumo">
        <BeatResumo />
      </Sequence>
      <Sequence
        from={fromExplanation}
        durationInFrames={BEAT.explanation}
        name="Explicação"
      >
        <BeatExplanation />
      </Sequence>
      <Sequence
        from={fromNutrition}
        durationInFrames={BEAT.nutrition}
        name="Valores Nutricionais"
      >
        <BeatNutrition />
      </Sequence>
    </SceneBackground>
  );
};
