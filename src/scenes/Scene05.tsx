import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {AlertTriangle, Calculator, Save, Snowflake} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {Pill} from '../components/Pill';
import {GaugeArc, GaugeZone} from '../components/GaugeArc';
import {colors, radius, shadows} from '../theme';
import {fontBody} from '../fonts';

/**
 * Cena 5 (1:05–1:25) — Receita com indicadores técnicos:
 * gauges animados (alguns em alerta vermelho) no estilo do
 * workbench 60/40 do produto.
 */

const ZONES_BALANCED: GaugeZone[] = [
  {from: 0, to: 0.2, color: colors.gaugeRed},
  {from: 0.2, to: 0.35, color: colors.gaugeOrange},
  {from: 0.35, to: 0.7, color: colors.gaugeGreen},
  {from: 0.7, to: 0.85, color: colors.gaugeOrange},
  {from: 0.85, to: 1, color: colors.gaugeRed},
];

type GaugeSpec = {
  label: string;
  value: string;
  fraction: number;
  status: 'perfect' | 'technical' | 'out';
};

const GAUGES: GaugeSpec[] = [
  {label: 'Açúcares', value: '26%', fraction: 0.76, status: 'technical'},
  {label: 'Água', value: '62%', fraction: 0.48, status: 'perfect'},
  {label: 'Gordura', value: '4%', fraction: 0.24, status: 'technical'},
  {label: 'PAC', value: '32.4', fraction: 0.93, status: 'out'},
  {label: 'POD', value: '11.2', fraction: 0.28, status: 'technical'},
  {label: 'Sólidos totais', value: '46%', fraction: 0.9, status: 'out'},
];

const STATUS_STYLE = {
  perfect: {label: 'Perfect', bg: colors.successSoft, color: colors.success},
  technical: {label: 'Technical', bg: colors.warningSoft, color: colors.warning},
  out: {label: 'Out', bg: colors.dangerSoft, color: colors.gaugeRed},
} as const;

const COMPOSITION_ROWS = [
  {name: 'Leite integral', qty: '520 g'},
  {name: 'Creme de leite 35%', qty: '180 g'},
  {name: 'Sacarose', qty: '190 g'},
  {name: 'Pistache puro', qty: '80 g'},
  {name: 'Leite em pó desnatado', qty: '25 g'},
  {name: 'Neutro base branca', qty: '5 g'},
];

export const Scene05: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const panelIn = spring({
    frame: frame - 8,
    fps,
    config: {damping: 200, stiffness: 90},
  });

  const alertIn = spring({
    frame: frame - 300,
    fps,
    config: {damping: 14, stiffness: 130, mass: 0.7},
  });

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 46, gap: 24}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
          <Eyebrow delay={2}>Balanceamento de receita</Eyebrow>
        </div>

        {/* Workbench 60/40 */}
        <div
          style={{
            opacity: panelIn,
            transform: `translateY(${(1 - panelIn) * 60}px)`,
            width: 1660,
            borderRadius: radius.shell,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.shell,
            overflow: 'hidden',
          }}
        >
          {/* Header da receita */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '22px 36px',
              borderBottom: `1px solid ${colors.borderSoft}`,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: 32,
                  color: colors.textPrimary,
                }}
              >
                Gelato de Pistache
              </span>
              <Pill bg={colors.warningSoft} color="#92400E" fontSize={18}>
                Em desenvolvimento
              </Pill>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 22, color: colors.textMuted}}>
              <Snowflake size={26} color={colors.info} />
              <span style={{fontFamily: fontBody, fontSize: 20}}>-12,5 °C</span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: colors.primary,
                  color: colors.textInverse,
                  fontFamily: fontBody,
                  fontWeight: 600,
                  fontSize: 19,
                  padding: '10px 20px',
                  borderRadius: radius.md,
                }}
              >
                <Save size={19} color={colors.textInverse} />
                Salvar
              </div>
            </div>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: '6fr 4fr'}}>
            {/* Esquerda — tabela de composição */}
            <div style={{padding: '28px 36px', borderRight: `1px solid ${colors.borderSoft}`}}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 18,
                  fontFamily: fontBody,
                  fontWeight: 600,
                  fontSize: 21,
                  color: colors.textSecondary,
                }}
              >
                <Calculator size={22} color={colors.primary} />
                Composição
              </div>
              {COMPOSITION_ROWS.map((row, i) => {
                const enter = spring({
                  frame: frame - 26 - i * 8,
                  fps,
                  config: {damping: 200, stiffness: 130},
                });
                return (
                  <div
                    key={row.name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '14px 18px',
                      borderRadius: radius.md,
                      backgroundColor: i % 2 === 0 ? colors.surfaceMuted : colors.surface,
                      marginBottom: 6,
                      opacity: enter,
                      transform: `translateX(${(1 - enter) * -30}px)`,
                      fontFamily: fontBody,
                      fontSize: 21,
                    }}
                  >
                    <span style={{color: colors.textPrimary, fontWeight: 500}}>{row.name}</span>
                    <span style={{color: colors.textMuted, fontWeight: 600}}>{row.qty}</span>
                  </div>
                );
              })}

              {/* Alerta de desequilíbrio */}
              <div
                style={{
                  marginTop: 20,
                  opacity: alertIn,
                  transform: `translateY(${(1 - alertIn) * 20}px)`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  backgroundColor: colors.dangerSoft,
                  border: `1.5px solid ${colors.danger}`,
                  borderRadius: radius.md,
                  padding: '16px 22px',
                }}
              >
                <AlertTriangle size={28} color={colors.danger} strokeWidth={2} />
                <span
                  style={{
                    fontFamily: fontBody,
                    fontWeight: 600,
                    fontSize: 21,
                    color: colors.danger,
                  }}
                >
                  2 parâmetros fora da faixa ideal
                </span>
              </div>
            </div>

            {/* Direita — grid de gauges */}
            <div
              style={{
                padding: '28px 32px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 18,
                justifyItems: 'center',
                alignContent: 'start',
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
                    zones={ZONES_BALANCED}
                    delay={70 + i * 16}
                    size={168}
                    statusLabel={st.label}
                    statusBg={st.bg}
                    statusColor={st.color}
                    alert={gauge.status === 'out'}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Caption */}
        <div
          style={{
            fontFamily: fontBody,
            fontSize: 27,
            color: colors.textMuted,
            opacity: interpolate(frame, [340, 365], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          Parâmetros técnicos calculados automaticamente — antes de iniciar a produção.
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
