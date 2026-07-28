import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useVideoConfig,
} from 'remotion';
import {AUTHOR_FPS, T, useAuthoredFrame} from '../timeline';
import {ArrowRight, ClipboardList, ShieldCheck, Tag} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {AnimatedText} from '../components/AnimatedText';
import {GaugeArc, GaugeZone} from '../components/GaugeArc';
import {colors, radius, shadows} from '../theme';
import {fontBody} from '../fonts';
import {useCopy} from '../i18n/LocaleContext';

/**
 * Cena extra — Tabela nutricional ANVISA (fullscreen) →
 * Índice glicêmico (fullscreen) → fluxo ficha/rótulo.
 */

const TABLE_DUR = 240;
const IG_DUR = 190;
const FLOW_AT = 430;

const IG_ZONES: GaugeZone[] = [
  {from: 0, to: 0.55, color: colors.gaugeGreen},
  {from: 0.55, to: 0.7, color: colors.gaugeOrange},
  {from: 0.7, to: 1, color: colors.gaugeRed},
];

const cellBorder = '1.5px solid #1a1a1a';

const AnvisaNutritionTable: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const c = useCopy();
  const anvisa = c.nutritional.anvisa;
  const rows = anvisa.rows;

  const enter = spring({
    frame: frame - 8,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 36}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <div
        style={{
          width: 860,
          backgroundColor: '#ffffff',
          border: '3px solid #1a1a1a',
          color: '#1a1a1a',
          fontFamily: fontBody,
          boxShadow: shadows.shell,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            padding: '13px 16px',
            borderBottom: cellBorder,
            lineHeight: 1.15,
          }}
        >
          {anvisa.title}
        </div>

        <div
          style={{
            padding: '11px 18px',
            borderBottom: cellBorder,
            fontSize: 20,
            lineHeight: 1.35,
          }}
        >
          <div>
            <strong>{anvisa.servingsLabel}</strong> {anvisa.servingsValue}
          </div>
          <div>
            <strong>{anvisa.portionLabel}</strong> {anvisa.portionValue}
          </div>
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 20,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  borderBottom: cellBorder,
                  borderRight: cellBorder,
                  padding: '9px 14px',
                  textAlign: 'left',
                  fontWeight: 700,
                  width: '48%',
                }}
              />
              <th
                style={{
                  borderBottom: cellBorder,
                  borderRight: cellBorder,
                  padding: '9px 8px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {anvisa.colPortion}
              </th>
              <th
                style={{
                  borderBottom: cellBorder,
                  borderRight: cellBorder,
                  padding: '9px 8px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {anvisa.col100}
              </th>
              <th
                style={{
                  borderBottom: cellBorder,
                  padding: '9px 8px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                {anvisa.colVd}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const rowIn = interpolate(frame - 16 - i * 5, [0, 8], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const isLast = i === rows.length - 1;
              const indent = Boolean(row.indent);
              return (
                <tr key={row.name} style={{opacity: rowIn}}>
                  <td
                    style={{
                      borderBottom: isLast ? 'none' : cellBorder,
                      borderRight: cellBorder,
                      padding: '8px 14px',
                      paddingLeft: indent ? 30 : 14,
                      fontWeight: indent ? 500 : 700,
                    }}
                  >
                    {row.name}
                  </td>
                  <td
                    style={{
                      borderBottom: isLast ? 'none' : cellBorder,
                      borderRight: cellBorder,
                      padding: '8px 8px',
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
                      padding: '8px 8px',
                      textAlign: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {row.per100}
                  </td>
                  <td
                    style={{
                      borderBottom: isLast ? 'none' : cellBorder,
                      padding: '8px 8px',
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
            padding: '11px 16px',
            fontSize: 14,
            lineHeight: 1.35,
            color: '#333',
          }}
        >
          {anvisa.footer}
        </div>
      </div>

      <div
        style={{
          opacity: interpolate(frame - 55, [0, 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          maxWidth: 860,
          padding: '12px 18px',
          borderRadius: radius.md,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.md,
        }}
      >
        <ShieldCheck size={26} color={colors.success} strokeWidth={2.2} />
        <span
          style={{
            fontFamily: fontBody,
            fontSize: 18,
            lineHeight: 1.35,
            color: colors.textSecondary,
            fontWeight: 500,
          }}
        >
          {anvisa.badge}{' '}
          <span style={{fontWeight: 700, color: colors.textPrimary}}>
            {anvisa.badgeNorm}
          </span>
        </span>
      </div>
    </div>
  );
};

const GlycemicFocus: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const c = useCopy();

  const enter = spring({
    frame: frame - 4,
    fps,
    config: {damping: 200, stiffness: 95},
  });

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 28}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28,
      }}
    >
      <GaugeArc
        label={c.nutritional.glycemicLabel}
        value="32"
        fraction={0.32}
        zones={IG_ZONES}
        delay={10}
        size={420}
        statusLabel={c.nutritional.glycemicStatus}
        statusBg={colors.successSoft}
        statusColor={colors.success}
        bare
      />

      <span
        style={{
          fontFamily: fontBody,
          fontSize: 32,
          lineHeight: 1.4,
          color: colors.textSecondary,
          textAlign: 'center',
          maxWidth: 900,
          opacity: interpolate(frame - 36, [0, 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {c.nutritional.glycemicCaption}
      </span>
    </div>
  );
};

export const SceneNutritionalTable: React.FC = () => {
  const frame = useAuthoredFrame();
  const fps = AUTHOR_FPS;
  const c = useCopy();

  const flowIn = spring({
    frame: frame - FLOW_AT,
    fps,
    config: {damping: 200, stiffness: 100},
  });

  const showTable = frame < TABLE_DUR;
  const showIg = frame >= TABLE_DUR;

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 28, gap: 6, zIndex: 5}}>
        <Eyebrow delay={2} fontSize={32}>
          {c.nutritional.eyebrow}
        </Eyebrow>
        <AnimatedText
          text={
            showIg
              ? c.nutritional.subtitleGlycemic
              : c.nutritional.subtitleTable
          }
          delay={showIg ? TABLE_DUR + 6 : 12}
          stagger={2}
          style={{
            fontFamily: fontBody,
            fontWeight: 500,
            fontSize: 24,
            color: colors.textMuted,
            maxWidth: 1000,
            textAlign: 'center',
          }}
        />
      </AbsoluteFill>

      <Sequence from={0} durationInFrames={T(TABLE_DUR)} name="Tabela ANVISA">
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 175,
          }}
        >
          <AnvisaNutritionTable />
        </AbsoluteFill>
      </Sequence>

      <Sequence from={T(TABLE_DUR)} durationInFrames={T(IG_DUR + 200)} name="Índice glicêmico">
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 20,
            paddingBottom: 80,
          }}
        >
          <GlycemicFocus />
        </AbsoluteFill>
      </Sequence>

      {frame >= FLOW_AT ? (
        <AbsoluteFill
          style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 72}}
        >
          <div
            style={{
              opacity: flowIn,
              transform: `translateY(${(1 - flowIn) * 26}px)`,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: radius.lg,
              boxShadow: shadows.md,
              padding: '22px 40px',
            }}
          >
            <span
              style={{
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: 30,
                color: colors.textSecondary,
              }}
            >
              {c.nutritional.feedsAutomatically}
            </span>
            <ArrowRight size={30} color={colors.primaryMuted} />
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: 30,
                color: colors.info,
              }}
            >
              <ClipboardList size={30} color={colors.info} />
              {c.nutritional.techSheet}
            </span>
            <ArrowRight size={30} color={colors.primaryMuted} />
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: fontBody,
                fontWeight: 600,
                fontSize: 30,
                color: colors.warning,
              }}
            >
              <Tag size={30} color={colors.warning} />
              {c.nutritional.labeling}
            </span>
          </div>
        </AbsoluteFill>
      ) : null}
    </SceneBackground>
  );
};
