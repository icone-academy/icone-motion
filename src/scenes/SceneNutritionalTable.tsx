import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {ArrowRight, ClipboardList, Leaf, Tag} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {AnimatedText} from '../components/AnimatedText';
import {Pill} from '../components/Pill';
import {GaugeArc, GaugeZone} from '../components/GaugeArc';
import {colors, radius, shadows} from '../theme';
import {fontBody} from '../fonts';

/**
 * Cena extra (2:08–2:28) — Tabela nutricional completa calculada
 * automaticamente a partir dos ingredientes + índice glicêmico
 * para receitas diet.
 */

const TABLE_IN = 34;
const IG_IN = 240;
const FLOW_IN = 430;

type NutrientRow = {
  name: string;
  target: number;
  decimals: number;
  unit: string;
  fraction: number;
  color: string;
};

const NUTRIENTS: NutrientRow[] = [
  {name: 'Valor energético', target: 215, decimals: 0, unit: 'kcal', fraction: 0.55, color: colors.primary},
  {name: 'Carboidratos', target: 24, decimals: 0, unit: 'g', fraction: 0.4, color: colors.sugarPinkBar},
  {name: 'Açúcares', target: 21, decimals: 0, unit: 'g', fraction: 0.35, color: colors.sugarPink},
  {name: 'Gorduras totais', target: 11, decimals: 0, unit: 'g', fraction: 0.3, color: colors.fatAmberBar},
  {name: 'Proteínas', target: 3.8, decimals: 1, unit: 'g', fraction: 0.15, color: colors.pacViolet},
  {name: 'Sódio', target: 45, decimals: 0, unit: 'mg', fraction: 0.1, color: colors.gaugeSlate},
  {name: 'Fibras', target: 0.8, decimals: 1, unit: 'g', fraction: 0.08, color: colors.success},
];

/** Zonas do índice glicêmico: baixo ≤55 · médio 56–69 · alto ≥70 */
const IG_ZONES: GaugeZone[] = [
  {from: 0, to: 0.55, color: colors.gaugeGreen},
  {from: 0.55, to: 0.7, color: colors.gaugeOrange},
  {from: 0.7, to: 1, color: colors.gaugeRed},
];

const formatValue = (value: number, decimals: number) =>
  decimals > 0
    ? value.toFixed(decimals).replace('.', ',')
    : String(Math.round(value));

const NutritionTable: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 60}px)`,
        width: 760,
        borderRadius: radius.shell,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.shell,
        padding: '34px 42px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 29,
            color: colors.textPrimary,
          }}
        >
          Tabela nutricional
        </span>
        <span style={{fontFamily: fontBody, fontSize: 20, color: colors.textMuted}}>
          Gelato de Pistache · porção 60 g
        </span>
      </div>

      {NUTRIENTS.map((row, i) => {
        const rowDelay = delay + 14 + i * 12;
        const rowIn = interpolate(frame - rowDelay, [0, 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        // Contagem do valor: 0 → alvo em ~25 frames
        const counted = interpolate(frame - rowDelay, [0, 25], [0, row.target], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const barFill = spring({
          frame: frame - rowDelay - 4,
          fps,
          config: {damping: 200, stiffness: 90},
        });

        return (
          <div
            key={row.name}
            style={{
              opacity: rowIn,
              transform: `translateX(${(1 - rowIn) * -24}px)`,
              padding: '13px 0',
              borderBottom:
                i < NUTRIENTS.length - 1 ? `1px solid ${colors.borderSoft}` : 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
                fontFamily: fontBody,
                fontSize: 22,
              }}
            >
              <span style={{fontWeight: 600, color: colors.textSecondary}}>{row.name}</span>
              <span style={{fontWeight: 700, color: colors.textPrimary}}>
                {formatValue(counted, row.decimals)} {row.unit}
              </span>
            </div>
            <div
              style={{
                height: 10,
                borderRadius: 5,
                backgroundColor: colors.borderSoft,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${row.fraction * barFill * 100}%`,
                  borderRadius: 5,
                  backgroundColor: row.color,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const GlycemicCard: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateX(${(1 - enter) * 60}px)`,
        width: 480,
        borderRadius: radius.shell,
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.shell,
        padding: '34px 38px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          alignSelf: 'flex-start',
        }}
      >
        <span
          style={{
            fontFamily: fontBody,
            fontWeight: 700,
            fontSize: 27,
            color: colors.textPrimary,
          }}
        >
          Índice glicêmico
        </span>
        <Pill bg={colors.successSoft} color={colors.success} fontSize={17}>
          <Leaf size={17} color={colors.success} />
          Receita diet
        </Pill>
      </div>

      <GaugeArc
        label="Índice glicêmico"
        value="32"
        fraction={0.32}
        zones={IG_ZONES}
        delay={delay + 14}
        size={250}
        statusLabel="Baixo"
        statusBg={colors.successSoft}
        statusColor={colors.success}
        bare
      />

      <span
        style={{
          fontFamily: fontBody,
          fontSize: 20,
          color: colors.textMuted,
          textAlign: 'center',
          opacity: interpolate(frame - delay - 40, [0, 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        Mais uma camada de precisão para produtos
        <br />
        com restrição de açúcar.
      </span>
    </div>
  );
};

export const SceneNutritionalTable: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const flowIn = spring({
    frame: frame - FLOW_IN,
    fps,
    config: {damping: 200, stiffness: 100},
  });

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 50, gap: 10}}>
        <Eyebrow delay={2}>Nutrição da receita</Eyebrow>
        <AnimatedText
          text="Todos os valores calculados automaticamente a partir dos ingredientes"
          delay={12}
          stagger={2}
          style={{
            fontFamily: fontBody,
            fontWeight: 500,
            fontSize: 29,
            color: colors.textMuted,
            maxWidth: 1300,
          }}
        />
      </AbsoluteFill>

      {/* Tabela + índice glicêmico */}
      <AbsoluteFill
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 50,
          paddingTop: 60,
        }}
      >
        <NutritionTable delay={TABLE_IN} />
        <GlycemicCard delay={IG_IN} />
      </AbsoluteFill>

      {/* Fluxo para ficha técnica e rotulagem */}
      <AbsoluteFill
        style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 62}}
      >
        <div
          style={{
            opacity: flowIn,
            transform: `translateY(${(1 - flowIn) * 26}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: radius.lg,
            boxShadow: shadows.md,
            padding: '16px 30px',
          }}
        >
          <span
            style={{
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: 23,
              color: colors.textSecondary,
            }}
          >
            Alimenta automaticamente
          </span>
          <ArrowRight size={24} color={colors.primaryMuted} />
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: 23,
              color: colors.info,
            }}
          >
            <ClipboardList size={24} color={colors.info} />
            Ficha técnica
          </span>
          <ArrowRight size={24} color={colors.primaryMuted} />
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: fontBody,
              fontWeight: 600,
              fontSize: 23,
              color: colors.warning,
            }}
          >
            <Tag size={24} color={colors.warning} />
            Rotulagem
          </span>
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
