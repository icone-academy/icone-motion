import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
} from 'remotion';
import {AUTHOR_FPS, DUR, VO_CUTS, sec, useAuthoredFrame} from '../timeline';
import {
  BadgeDollarSign,
  Building2,
  Calculator,
  ClipboardList,
  Globe,
  Package,
  Printer,
  Save,
  Scale,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Tag,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {Pill} from '../components/Pill';
import {GaugeArc, GaugeZone} from '../components/GaugeArc';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 5 — Workbench de receita em beats fullscreen, sync VO:
 * 65.88 config → 87.88 gauges → 104.88 interpretação → 110.48 explicação
 * → 119.08 nutrição (aba) → 128.88 destaque etiqueta/ficha → 139.28
 */

const S5_START = VO_CUTS.scene05[0];
const S5_MARK = {
  compositionEnd: 87.88,
  gaugesEnd: 104.88, // “interpretação / faixa ideal”
  resumoEnd: 110.48, // “aba explicação”
  explanationEnd: 119.08, // “Valores Nutricionais”
  /** “E direto dessa mesma tela…” — destaque nos CTAs */
  ctaHighlight: 128.88,
  nutritionEnd: VO_CUTS.scene05[1],
} as const;

/** Durações em frames reais (60fps), alinhadas ao VO. */
export const BEAT = {
  composition: sec(S5_MARK.compositionEnd) - sec(S5_START),
  gauges: sec(S5_MARK.gaugesEnd) - sec(S5_MARK.compositionEnd),
  resumo: sec(S5_MARK.resumoEnd) - sec(S5_MARK.gaugesEnd),
  explanation: sec(S5_MARK.explanationEnd) - sec(S5_MARK.resumoEnd),
  nutrition: sec(S5_MARK.nutritionEnd) - sec(S5_MARK.explanationEnd),
} as const;

/** Frame real (60fps) dentro do beat Nutrição em que os CTAs ganham destaque. */
const CTA_HIGHLIGHT_AT =
  sec(S5_MARK.ctaHighlight) - sec(S5_MARK.explanationEnd);

export const SCENE05_TOTAL =
  BEAT.composition +
  BEAT.gauges +
  BEAT.resumo +
  BEAT.explanation +
  BEAT.nutrition;

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
  {label: 'Cristalização', value: '88%', fraction: 0.46, status: 'perfect'},
  {label: 'Cremosidade', value: '74%', fraction: 0.5, status: 'perfect'},
  {label: 'Lactose', value: '5%', fraction: 0.4, status: 'perfect'},
  {label: 'Índice glicêmico', value: '42%', fraction: 0.38, status: 'technical'},
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

const EXPLANATION_BLOCKS: {
  text: string;
  /** palavra/trecho em destaque */
  emphasis: string;
  /** início relativo (frames 30fps) no beat Explicação */
  at: number;
}[] = [
  {
    text: 'Esta receita está bem equilibrada para um gelato de pistache.',
    emphasis: 'equilibrada',
    at: 18,
  },
  {
    text: 'A água e os açúcares estão na faixa ideal — o gelato congela de forma limpa e cremosa.',
    emphasis: 'faixa ideal',
    at: 55,
  },
  {
    text: 'O PAC indica ponto de congelamento adequado para vitrine; o POD traz doçura equilibrada sem mascarar o pistache.',
    emphasis: 'PAC',
    at: 100,
  },
  {
    text: 'Overrun e cremosidade sugerem boa estrutura na mantecação e estabilidade na exposição.',
    emphasis: 'cremosidade',
    at: 155,
  },
];

/** Tabela ANVISA (porção + 100g + %VD) — beat Nutrição */
type NutrientRow = {
  name: string;
  portion: string;
  per100: string;
  vd: string;
  indent?: boolean;
};

const ANVISA_ROWS: NutrientRow[] = [
  {name: 'Valor energético (kcal)', portion: '129', per100: '215', vd: '6%'},
  {name: 'Carboidratos (g)', portion: '14', per100: '24', vd: '5%'},
  {name: 'Açúcares totais (g)', portion: '13', per100: '21', vd: '—', indent: true},
  {name: 'Açúcares adicionados (g)', portion: '11', per100: '18', vd: '22%', indent: true},
  {name: 'Proteínas (g)', portion: '2,3', per100: '3,8', vd: '5%'},
  {name: 'Gorduras totais (g)', portion: '6,6', per100: '11', vd: '10%'},
  {name: 'Gorduras saturadas (g)', portion: '3,4', per100: '5,6', vd: '17%', indent: true},
  {name: 'Gorduras trans (g)', portion: '0', per100: '0', vd: '0%', indent: true},
  {name: 'Fibra alimentar (g)', portion: '0,5', per100: '0,8', vd: '2%'},
  {name: 'Sódio (mg)', portion: '27', per100: '45', vd: '1%'},
];

const cellBorder = '1.5px solid #1a1a1a';

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
      {label: 'Mantecação (−6 °C)', value: '82', status: 'perfect'},
      {label: 'Vitrine (−10 °C)', value: '78', status: 'perfect'},
      {label: 'Freezer (−18 °C)', value: '85', status: 'perfect'},
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
  // duration e frame em frames reais (60fps) — sync com Sequence/VO
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

/* ─── Beat 1: Composição (VO: configurar → certificados → cadastrados → custo → alvo → cálculo) ─── */

/** Fases em frames de autoria (30fps), sync com o VO deste beat (~22s). */
const COMP = {
  certified: 120, // ingredientes certificados ICone
  custom: 210, // ingredientes do workspace
  supplier: 290, // fornecedores + custo
  target: 420, // alvo de produção
  calc: 480, // cálculo automático
} as const;

const CompCallout: React.FC<{
  label: string;
  sub: string;
  icon: React.ComponentType<{size?: number; color?: string; strokeWidth?: number}>;
  tint: string;
  soft: string;
  delay: number;
  x: number;
  y: number;
}> = ({label, sub, icon: Icon, tint, soft, delay, x, y}) => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const pop = spring({
    frame: frame - delay,
    fps,
    config: {damping: 12, stiffness: 150, mass: 0.65},
  });
  const hold = interpolate(frame, [delay, delay + 8, delay + 70, delay + 90], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: hold * pop,
        transform: `translate(-50%, -50%) scale(${0.85 + pop * 0.15})`,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        backgroundColor: colors.surface,
        border: `2px solid ${tint}`,
        borderRadius: radius.lg,
        boxShadow: shadows.shell,
        padding: '14px 20px',
        minWidth: 260,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: radius.md,
          backgroundColor: soft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={26} color={tint} strokeWidth={2} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 2}}>
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 18,
            color: tint,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 600,
            fontSize: 22,
            color: colors.textPrimary,
          }}
        >
          {sub}
        </span>
      </div>
    </div>
  );
};

const BeatComposition: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const panelIn = spring({
    frame: frame - 2,
    fps,
    config: {damping: 18, stiffness: 100, mass: 0.85},
  });

  const phaseCertified = interpolate(frame, [COMP.certified, COMP.certified + 12, COMP.custom - 8, COMP.custom], [0, 1, 1, 0.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phaseCustom = interpolate(frame, [COMP.custom, COMP.custom + 12, COMP.supplier - 8, COMP.supplier], [0, 1, 1, 0.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phaseSupplier = interpolate(frame, [COMP.supplier, COMP.supplier + 12, COMP.target - 8, COMP.target], [0, 1, 1, 0.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phaseTarget = interpolate(frame, [COMP.target, COMP.target + 12, COMP.calc - 6, COMP.calc], [0, 1, 1, 0.45], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const phaseCalc = interpolate(frame, [COMP.calc, COMP.calc + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const calcPulse = 0.5 + 0.5 * Math.sin((frame - COMP.calc) * 0.35);
  const scanY = interpolate(frame, [COMP.calc, COMP.calc + 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          opacity: panelIn,
          transform: `translateY(${(1 - panelIn) * 22}px) scale(${0.97 + panelIn * 0.03})`,
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
            position: 'relative',
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
            <span
              style={{
                textAlign: 'center',
                color: phaseSupplier > 0.5 ? colors.primary : colors.textMuted,
                transform: `scale(${1 + phaseSupplier * 0.06})`,
              }}
            >
              Fornecedor
            </span>
            <span
              style={{
                textAlign: 'center',
                color: phaseSupplier > 0.5 ? colors.primary : colors.textMuted,
              }}
            >
              Preço/kg
            </span>
            <span
              style={{
                textAlign: 'center',
                color: phaseSupplier > 0.5 ? colors.primary : colors.textMuted,
              }}
            >
              Preço na receita
            </span>
            <span style={{textAlign: 'center'}}>Peso</span>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: 10, position: 'relative'}}>
            {COMPOSITION_ROWS.map((row, i) => {
              const enter = spring({
                frame: frame - 10 - i * 7,
                fps,
                config: {damping: 14, stiffness: 130, mass: 0.7},
              });
              const isGlobal = row.scope === 'global';
              const ScopeIcon = isGlobal ? Globe : Building2;
              const scopeGlow = isGlobal ? phaseCertified : phaseCustom;
              const dimOther =
                (phaseCertified > 0.4 && !isGlobal) || (phaseCustom > 0.4 && isGlobal)
                  ? 0.35
                  : 0;
              const supplierGlow = phaseSupplier;
              const rowScale = 1 + scopeGlow * 0.025 + (i === 3 && phaseCustom > 0.5 ? 0.02 : 0);

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
                    backgroundColor:
                      scopeGlow > 0.45
                        ? isGlobal
                          ? 'rgba(220, 252, 231, 0.85)'
                          : 'rgba(239, 232, 223, 0.95)'
                        : i % 2 === 0
                          ? colors.surfaceMuted
                          : colors.surface,
                    border: `1.5px solid ${
                      scopeGlow > 0.45
                        ? isGlobal
                          ? colors.success
                          : colors.primary
                        : 'transparent'
                    }`,
                    boxShadow:
                      scopeGlow > 0.45
                        ? `0 0 ${16 + scopeGlow * 20}px ${
                            isGlobal
                              ? 'rgba(22,163,74,0.28)'
                              : 'rgba(122,106,90,0.28)'
                          }`
                        : 'none',
                    opacity: enter * (1 - dimOther),
                    transform: `translateX(${(1 - enter) * -28}px) scale(${rowScale})`,
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
                    <span
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: radius.md,
                        backgroundColor: isGlobal ? colors.successSoft : colors.primarySoft,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: `scale(${1 + scopeGlow * 0.15})`,
                      }}
                    >
                      <ScopeIcon
                        size={26}
                        color={isGlobal ? colors.success : colors.primary}
                        strokeWidth={2.25}
                      />
                    </span>
                    {row.name}
                    {scopeGlow > 0.55 ? (
                      <Pill
                        bg={isGlobal ? colors.successSoft : colors.primarySoft}
                        color={isGlobal ? colors.success : colors.primary}
                        fontSize={14}
                        style={{padding: '4px 10px'}}
                      >
                        {isGlobal ? 'Certificado ICone' : 'Seu cadastro'}
                      </Pill>
                    ) : null}
                  </span>
                  <span
                    style={{
                      textAlign: 'center',
                      color: supplierGlow > 0.5 ? colors.primary : colors.textSecondary,
                      fontSize: 24,
                      fontWeight: supplierGlow > 0.5 ? 700 : 500,
                      transform: `scale(${1 + supplierGlow * 0.05})`,
                    }}
                  >
                    {row.supplier}
                  </span>
                  <span
                    style={{
                      textAlign: 'center',
                      color: supplierGlow > 0.5 ? colors.textPrimary : colors.textMuted,
                      fontSize: 24,
                      fontWeight: supplierGlow > 0.5 ? 700 : 500,
                    }}
                  >
                    {row.pricePerKg}
                  </span>
                  <span
                    style={{
                      textAlign: 'center',
                      fontWeight: 700,
                      color: colors.textPrimary,
                      fontSize: 26,
                      transform: `scale(${1 + supplierGlow * 0.06})`,
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

            {phaseCalc > 0.05 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${scanY * 100}%`,
                  height: 3,
                  background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)`,
                  opacity: 0.55 + calcPulse * 0.35,
                  pointerEvents: 'none',
                  boxShadow: `0 0 18px ${colors.primary}`,
                }}
              />
            ) : null}
          </div>

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
                frame: frame - 48 - i * 5,
                fps,
                config: {damping: 12, stiffness: 140, mass: 0.65},
              });
              const Icon = card.icon;
              const isTarget = i === 3;
              const isCost = i === 1 || i === 2;
              const emphasis =
                (isTarget ? phaseTarget : 0) + (isCost ? phaseSupplier * 0.7 : 0) + phaseCalc * 0.35;
              const counted =
                i === 1 || i === 2
                  ? interpolate(
                      frame,
                      [COMP.supplier + 10, COMP.supplier + 45],
                      [0, 23.06],
                      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
                    )
                  : null;
              const displayValue =
                counted !== null
                  ? `R$ ${counted.toFixed(2).replace('.', ',')}${i === 2 ? '/Kg' : ''}`
                  : card.value;

              return (
                <div
                  key={card.label}
                  style={{
                    opacity: pop,
                    transform: `translateY(${(1 - pop) * 18}px) scale(${0.94 + pop * 0.06 + emphasis * 0.05})`,
                    borderRadius: radius.lg,
                    border: `2px solid ${
                      emphasis > 0.45
                        ? isTarget
                          ? colors.success
                          : colors.primary
                        : colors.border
                    }`,
                    backgroundColor:
                      emphasis > 0.45
                        ? isTarget
                          ? colors.successSoft
                          : colors.primarySoft
                        : colors.surfaceMuted,
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    minHeight: 140,
                    justifyContent: 'center',
                    boxShadow:
                      emphasis > 0.45
                        ? `0 0 ${14 + emphasis * 22}px rgba(122,106,90,0.25)`
                        : 'none',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <Icon
                      size={30}
                      color={emphasis > 0.45 ? (isTarget ? colors.success : colors.primary) : colors.primary}
                      strokeWidth={2}
                    />
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
                    {displayValue}
                  </span>
                </div>
              );
            })}
          </div>

          {phaseCalc > 0.2 ? (
            <div
              style={{
                position: 'absolute',
                right: 36,
                bottom: 36,
                opacity: phaseCalc,
                transform: `translateY(${(1 - phaseCalc) * 16}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                backgroundColor: colors.surface,
                border: `2px solid ${colors.primary}`,
                borderRadius: radius.lg,
                padding: '14px 22px',
                boxShadow: shadows.md,
                zIndex: 25,
              }}
            >
              <Sparkles size={28} color={colors.primary} strokeWidth={2} />
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: 24,
                  color: colors.textPrimary,
                }}
              >
                Calculando parâmetros técnicos…
              </span>
            </div>
          ) : null}
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

      <CompCallout
        label="Certificados"
        sub="Ingredientes ICone"
        icon={Globe}
        tint={colors.success}
        soft={colors.successSoft}
        delay={COMP.certified}
        x={420}
        y={210}
      />
      <CompCallout
        label="Workspace"
        sub="Seus ingredientes"
        icon={Building2}
        tint={colors.primary}
        soft={colors.primarySoft}
        delay={COMP.custom}
        x={1500}
        y={240}
      />
      <CompCallout
        label="Custo"
        sub="Fornecedores vinculados"
        icon={BadgeDollarSign}
        tint={colors.warning}
        soft={colors.warningSoft}
        delay={COMP.supplier}
        x={960}
        y={180}
      />
      <CompCallout
        label="Produção"
        sub="Alvo · 5.000 g"
        icon={Package}
        tint={colors.success}
        soft={colors.successSoft}
        delay={COMP.target}
        x={1580}
        y={820}
      />
    </AbsoluteFill>
  );
};

/* ─── Beat 2: Gauges ─────────────────────────────────────────────── */

const BeatGauges: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const panelIn = spring({
    frame: frame - 2,
    fps,
    config: {damping: 22, stiffness: 90, mass: 0.9},
  });

  // Temperatura entra depois da última linha assentar
  const tempDelay = 8 + 11 * 7 + 36;
  const tempIn = spring({
    frame: frame - tempDelay,
    fps,
    config: {damping: 18, stiffness: 100, mass: 0.85},
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
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: 6,
              justifyItems: 'center',
              alignItems: 'center',
              minHeight: 0,
              overflow: 'hidden',
              paddingTop: 2,
              paddingBottom: 4,
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
                  delay={8 + i * 7}
                  size={148}
                  statusLabel={st.label}
                  statusBg={st.bg}
                  statusColor={st.color}
                  alert={gauge.status === 'out' || gauge.status === 'technical'}
                />
              );
            })}
          </div>

          <div
            style={{
              opacity: tempIn,
              transform: `translateY(${(1 - tempIn) * 20}px)`,
              marginTop: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              padding: '12px 22px',
              borderRadius: radius.lg,
              border: `2px solid rgba(37, 99, 235, 0.35)`,
              backgroundColor: colors.infoSoft,
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.1)',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: radius.md,
                backgroundColor: 'rgba(37, 99, 235, 0.14)',
                border: '1px solid rgba(37, 99, 235, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transform: `scale(${0.9 + tempIn * 0.1})`,
              }}
            >
              <Snowflake size={28} color={colors.info} strokeWidth={2.25} />
            </div>
            <div style={{flex: 1, minWidth: 0}}>
              <div
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: colors.info,
                  marginBottom: 2,
                }}
              >
                Temperatura ideal da vitrine
              </div>
              <div
                style={{
                  fontFamily: fontBody,
                  fontSize: 16,
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
                gap: 14,
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: 40,
                  lineHeight: 1,
                  color: colors.textPrimary,
                  letterSpacing: '-0.02em',
                }}
              >
                −12,5
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: colors.info,
                    marginLeft: 6,
                  }}
                >
                  °C
                </span>
              </span>
              <div
                style={{
                  opacity: interpolate(frame - tempDelay - 12, [0, 10], [0, 1], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  }),
                }}
              >
                <StatusPill status="perfect" fontSize={16} />
              </div>
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
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

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

const renderEmphasized = (text: string, emphasis: string, active: number) => {
  const idx = text.toLowerCase().indexOf(emphasis.toLowerCase());
  if (idx < 0) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + emphasis.length);
  const after = text.slice(idx + emphasis.length);
  return (
    <>
      {before}
      <span
        style={{
          fontWeight: 700,
          color: colors.textPrimary,
          backgroundColor:
            active > 0.55 ? 'rgba(239,232,223,0.9)' : 'transparent',
          borderRadius: 4,
          padding: active > 0.55 ? '0 4px' : 0,
          boxDecorationBreak: 'clone',
        }}
      >
        {match}
      </span>
      {after}
    </>
  );
};

const BeatExplanation: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const panelIn = spring({
    frame: frame - 2,
    fps,
    config: {damping: 22, stiffness: 90, mass: 0.9},
  });

  const headerIn = spring({
    frame: frame - 8,
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.8},
  });

  const iconPulse = spring({
    frame: frame - 10,
    fps,
    config: {damping: 12, stiffness: 160, mass: 0.65},
  });
  // um único “pop” — depois estabiliza
  const iconSettle = interpolate(frame, [10, 22, 36], [0, 1.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const activeIndex = EXPLANATION_BLOCKS.reduce((acc, block, i) => {
    return frame >= block.at ? i : acc;
  }, -1);

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
              gap: 22,
              justifyContent: 'flex-start',
            }}
          >
            <div
              style={{
                opacity: headerIn,
                transform: `translateY(${(1 - headerIn) * 10}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
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
                  transform: `scale(${iconPulse * iconSettle})`,
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

            {EXPLANATION_BLOCKS.map((block, i) => {
              const lineIn = spring({
                frame: frame - block.at,
                fps,
                config: {damping: 18, stiffness: 120, mass: 0.75},
              });
              const barIn = interpolate(frame - block.at, [0, 14], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const isActive = i === activeIndex && lineIn > 0.4;
              const caretBlink =
                isActive && i < EXPLANATION_BLOCKS.length - 1
                  ? 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame * 0.35))
                  : isActive
                    ? interpolate(frame - block.at, [40, 55], [1, 0], {
                        extrapolateLeft: 'clamp',
                        extrapolateRight: 'clamp',
                      })
                    : 0;

              return (
                <div
                  key={block.text}
                  style={{
                    opacity: lineIn,
                    transform: `translateY(${(1 - lineIn) * 14}px)`,
                    display: 'flex',
                    gap: 16,
                    alignItems: 'stretch',
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      borderRadius: 2,
                      backgroundColor: colors.primary,
                      opacity: 0.35 + barIn * 0.65,
                      transform: `scaleY(${barIn})`,
                      transformOrigin: 'top',
                      flexShrink: 0,
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontFamily: fontBody,
                      fontSize: 28,
                      lineHeight: 1.45,
                      color: isActive ? colors.textPrimary : colors.textSecondary,
                      fontWeight: isActive ? 500 : 400,
                      flex: 1,
                    }}
                  >
                    {renderEmphasized(block.text, block.emphasis, lineIn)}
                    <span
                      style={{
                        display: 'inline-block',
                        width: 2,
                        height: '0.9em',
                        marginLeft: 3,
                        verticalAlign: '-0.05em',
                        backgroundColor: colors.primary,
                        opacity: caretBlink,
                        borderRadius: 1,
                      }}
                    />
                  </p>
                </div>
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

/* ─── Beat 5: Aba Valores Nutricionais (tabela ANVISA + CTAs) ─────── */

const AnvisaNutritionTable: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;

  const enter = spring({
    frame: frame - 4,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 14}px)`,
        width: 920,
        backgroundColor: '#ffffff',
        border: '3px solid #1a1a1a',
        color: '#1a1a1a',
        fontFamily: fontBody,
        boxShadow: shadows.shell,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontWeight: 800,
          fontSize: 28,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          padding: '14px 20px',
          borderBottom: cellBorder,
          lineHeight: 1.1,
        }}
      >
        Informação nutricional
      </div>

      <div
        style={{
          padding: '12px 20px',
          borderBottom: cellBorder,
          fontSize: 18,
          lineHeight: 1.4,
        }}
      >
        <div>
          <strong>Porções por embalagem:</strong> 8
        </div>
        <div>
          <strong>Porção:</strong> 60 g (1 bola)
        </div>
      </div>

      <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 20}}>
        <thead>
          <tr>
            <th
              style={{
                borderBottom: cellBorder,
                borderRight: cellBorder,
                padding: '10px 18px',
                textAlign: 'left',
                width: '52%',
              }}
            />
            <th
              style={{
                borderBottom: cellBorder,
                borderRight: cellBorder,
                padding: '10px 10px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              60 g
            </th>
            <th
              style={{
                borderBottom: cellBorder,
                borderRight: cellBorder,
                padding: '10px 10px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              100 g
            </th>
            <th
              style={{
                borderBottom: cellBorder,
                padding: '10px 10px',
                textAlign: 'center',
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              %VD*
            </th>
          </tr>
        </thead>
        <tbody>
          {ANVISA_ROWS.map((row, i) => {
            const rowIn = interpolate(frame - 8 - i * 3, [0, 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const isLast = i === ANVISA_ROWS.length - 1;
            return (
              <tr key={row.name} style={{opacity: rowIn}}>
                <td
                  style={{
                    borderBottom: isLast ? 'none' : cellBorder,
                    borderRight: cellBorder,
                    padding: '9px 18px',
                    paddingLeft: row.indent ? 34 : 18,
                    fontWeight: row.indent ? 500 : 700,
                  }}
                >
                  {row.name}
                </td>
                <td
                  style={{
                    borderBottom: isLast ? 'none' : cellBorder,
                    borderRight: cellBorder,
                    padding: '9px 10px',
                    textAlign: 'center',
                    fontWeight: 700,
                  }}
                >
                  {row.portion}
                </td>
                <td
                  style={{
                    borderBottom: isLast ? 'none' : cellBorder,
                    borderRight: cellBorder,
                    padding: '9px 10px',
                    textAlign: 'center',
                    fontWeight: 700,
                  }}
                >
                  {row.per100}
                </td>
                <td
                  style={{
                    borderBottom: isLast ? 'none' : cellBorder,
                    padding: '9px 10px',
                    textAlign: 'center',
                    fontWeight: 700,
                  }}
                >
                  {row.vd}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          borderTop: cellBorder,
          padding: '10px 18px',
          fontSize: 13,
          lineHeight: 1.35,
          color: '#333',
        }}
      >
        *Percentual de valores diários com base em uma dieta de 2.000 kcal ou 8.400 kJ.
        Seus valores diários podem ser maiores ou menores dependendo de suas necessidades
        energéticas.
      </div>
    </div>
  );
};

const NutritionCtaButton: React.FC<{
  primary?: boolean;
  icon: React.ComponentType<{size?: number; color?: string; strokeWidth?: number}>;
  label: string;
  /** 0–1: quanto este botão está em foco agora */
  focus: number;
  /** 0–1: estamos no trecho do VO dos CTAs */
  ctaMode: number;
}> = ({primary, icon: Icon, label, focus, ctaMode}) => {
  const lift = focus * 4;
  const scale = 1 + focus * 0.03;
  const dim = ctaMode * (1 - focus) * 0.38;
  const isHot = focus > 0.4;

  const bg = primary
    ? colors.primary
    : isHot
      ? colors.primarySoft
      : colors.surface;
  const fg = primary ? colors.textInverse : colors.primary;

  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '14px 22px',
        borderRadius: radius.md,
        backgroundColor: bg,
        border: `1.5px solid ${
          isHot ? colors.primary : primary ? colors.primary : colors.border
        }`,
        color: fg,
        fontFamily: fontBody,
        fontWeight: 600,
        fontSize: 22,
        opacity: 1 - dim,
        boxShadow: isHot
          ? `0 10px 28px rgba(63, 48, 40, ${0.12 + focus * 0.1})`
          : shadows.sm,
        transform: `translateY(${-lift}px) scale(${scale})`,
        zIndex: isHot ? 2 : 1,
      }}
    >
      {/* acento minimalista à esquerda */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 10,
          bottom: 10,
          width: 3,
          borderRadius: '0 2px 2px 0',
          backgroundColor: primary ? 'rgba(255,255,255,0.9)' : colors.primary,
          opacity: focus,
          transform: `scaleY(${0.4 + focus * 0.6})`,
        }}
      />
      <Icon size={22} color={fg} strokeWidth={2.2} />
      {label}
    </div>
  );
};

const BeatNutrition: React.FC<{duration: number}> = ({duration}) => {
  const frame = useAuthoredFrame();
  const realFrame = useCurrentFrame();
  const fps = AUTHOR_FPS;

  const panelIn = spring({
    frame: frame - 2,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  const ctaIn = spring({
    frame: frame - 10,
    fps,
    config: {damping: 14, stiffness: 130, mass: 0.7},
  });

  // Sync VO “E direto dessa mesma tela…” (~128.88s)
  const ctaMode = interpolate(
    realFrame,
    [CTA_HIGHLIGHT_AT - 4, CTA_HIGHLIGHT_AT + 12, duration - 20, duration - 2],
    [0, 1, 1, 0.7],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  /**
   * Uma passagem só (sem loop):
   * 1) Etiqueta sobe e segura
   * 2) Cruza para Ficha Técnica e permanece
   */
  const local = Math.max(0, realFrame - CTA_HIGHLIGHT_AT);
  const etiquetaFocus =
    ctaMode *
    interpolate(
      local,
      [0, sec(0.45), sec(2.6), sec(3.4)],
      [0, 1, 1, 0],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
    );
  const fichaFocus =
    ctaMode *
    interpolate(
      local,
      [sec(2.8), sec(3.6), sec(8.5), duration],
      [0, 1, 1, 1],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
    );

  const tableDim = interpolate(ctaMode, [0, 1], [1, 0.92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
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
            padding: '12px 48px 20px',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            gap: 10,
          }}
        >
          <TabsBar
            active="Valores Nutricionais"
            tabIndex={3}
            duration={duration}
          />

          <div
            style={{
              opacity: ctaIn,
              transform: `translateY(${(1 - ctaIn) * 10}px)`,
              display: 'flex',
              gap: 18,
              flexShrink: 0,
              zIndex: 5,
              maxWidth: 920,
              width: '100%',
              alignSelf: 'center',
              paddingTop: 4,
              paddingBottom: 8,
            }}
          >
            <NutritionCtaButton
              primary
              ctaMode={ctaMode}
              focus={etiquetaFocus}
              icon={Tag}
              label="Gerar Etiqueta"
            />
            <NutritionCtaButton
              ctaMode={ctaMode}
              focus={fichaFocus}
              icon={ClipboardList}
              label="Gerar Ficha Técnica"
            />
          </div>

          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              opacity: tableDim,
            }}
          >
            <AnvisaNutritionTable />
            <div
              style={{
                opacity: interpolate(frame - 36, [0, 10], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: 920,
                padding: '10px 16px',
                borderRadius: radius.md,
                backgroundColor: colors.surfaceMuted,
                border: `1px solid ${colors.borderSoft}`,
                flexShrink: 0,
              }}
            >
              <ShieldCheck size={22} color={colors.success} strokeWidth={2.2} />
              <span
                style={{
                  fontFamily: fontBody,
                  fontSize: 16,
                  color: colors.textSecondary,
                  fontWeight: 500,
                }}
              >
                Calculada automaticamente a partir dos ingredientes · normas{' '}
                <span style={{fontWeight: 700, color: colors.textPrimary}}>ANVISA</span>
                {' '}(RDC 429/2020)
              </span>
            </div>
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
  const nutritionDur = Math.max(BEAT.nutrition, DUR.scene05 - fromNutrition);

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
        durationInFrames={nutritionDur}
        name="Valores Nutricionais"
      >
        <BeatNutrition duration={nutritionDur} />
      </Sequence>
    </SceneBackground>
  );
};
