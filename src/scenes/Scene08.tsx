import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  Calculator,
  CheckCircle2,
  ClipboardList,
  Database,
  Tag,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {AnimatedText} from '../components/AnimatedText';
import {colors, radius, shadows} from '../theme';
import {fontBody} from '../fonts';

/**
 * Cena 8 (2:08–2:25) — Fluxo automático: ingrediente → cálculo
 * nutricional → ficha técnica → rótulo, com conectores animados
 * e um "pulso" de dados percorrendo o caminho.
 */

const NODES = [
  {icon: Database, label: 'Ingrediente', sub: 'dados de origem', bg: colors.primarySoft, color: colors.primary},
  {icon: Calculator, label: 'Cálculo nutricional', sub: 'automático', bg: colors.successSoft, color: colors.success},
  {icon: ClipboardList, label: 'Ficha técnica', sub: 'documento vivo', bg: colors.infoSoft, color: colors.info},
  {icon: Tag, label: 'Rótulo', sub: 'pronto p/ rotulagem', bg: colors.warningSoft, color: colors.warning},
];

const NODE_W = 300;
const GAP = 120;
const TOTAL_W = NODES.length * NODE_W + (NODES.length - 1) * GAP;
const START_X = (1920 - TOTAL_W) / 2;
const NODE_Y = 470;

const nodeDelay = (i: number) => 20 + i * 55;

export const Scene08: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Pulso de dados: percorre todo o fluxo em loop após a construção
  const flowStart = nodeDelay(NODES.length - 1) + 30;
  const pulseProgress =
    frame > flowStart ? ((frame - flowStart) % 110) / 110 : -1;
  const pulseX =
    pulseProgress >= 0
      ? START_X + NODE_W / 2 + pulseProgress * (TOTAL_W - NODE_W)
      : -100;
  const pulseVisible = pulseProgress >= 0;

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 60, gap: 12}}>
        <Eyebrow delay={2}>Do ingrediente ao rótulo</Eyebrow>
        <AnimatedText
          text="Os dados fluem automaticamente entre receita e documentos"
          delay={12}
          stagger={2}
          style={{
            fontFamily: fontBody,
            fontWeight: 500,
            fontSize: 30,
            color: colors.textMuted,
          }}
        />
      </AbsoluteFill>

      {/* Conectores */}
      {NODES.slice(0, -1).map((_, i) => {
        const x0 = START_X + (i + 1) * NODE_W + i * GAP;
        const draw = spring({
          frame: frame - nodeDelay(i) - 26,
          fps,
          config: {damping: 200, stiffness: 80},
        });
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x0 + 10,
              top: NODE_Y + 60,
              width: GAP - 20,
              height: 5,
              borderRadius: 2.5,
              background: `linear-gradient(90deg, ${colors.primaryMuted}, ${colors.primary})`,
              transform: `scaleX(${draw})`,
              transformOrigin: 'left center',
              opacity: draw,
            }}
          />
        );
      })}

      {/* Pulso de dados */}
      {pulseVisible ? (
        <div
          style={{
            position: 'absolute',
            left: pulseX,
            top: NODE_Y + 62,
            width: 22,
            height: 22,
            borderRadius: '50%',
            backgroundColor: colors.primary,
            boxShadow: `0 0 24px rgba(122,106,90,0.65)`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ) : null}

      {/* Nós do fluxo */}
      {NODES.map((node, i) => {
        const delay = nodeDelay(i);
        const pop = spring({
          frame: frame - delay,
          fps,
          config: {damping: 13, stiffness: 140, mass: 0.7},
        });
        const checkPop = spring({
          frame: frame - delay - 30,
          fps,
          config: {damping: 10, stiffness: 220, mass: 0.5},
        });
        // Nó "acende" quando o pulso passa por ele
        const nodeCenter = START_X + i * (NODE_W + GAP) + NODE_W / 2;
        const lit =
          pulseVisible && Math.abs(pulseX - nodeCenter) < 70 ? 1 : 0;

        return (
          <div
            key={node.label}
            style={{
              position: 'absolute',
              left: START_X + i * (NODE_W + GAP),
              top: NODE_Y - 60,
              width: NODE_W,
              opacity: pop,
              transform: `translateY(${(1 - pop) * 44}px) scale(${1 + lit * 0.03})`,
            }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: radius.lg,
                border: `1.5px solid ${lit ? colors.primary : colors.border}`,
                backgroundColor: colors.surface,
                boxShadow: lit ? shadows.shell : shadows.md,
                padding: '30px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -15,
                  right: -15,
                  transform: `scale(${checkPop})`,
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: colors.success,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: shadows.md,
                }}
              >
                <CheckCircle2 size={24} color={colors.textInverse} strokeWidth={2.2} />
              </div>
              <div
                style={{
                  width: 84,
                  height: 84,
                  borderRadius: radius.md,
                  backgroundColor: node.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <node.icon size={42} color={node.color} strokeWidth={1.9} />
              </div>
              <span
                style={{
                  fontFamily: fontBody,
                  fontWeight: 700,
                  fontSize: 25,
                  color: colors.textPrimary,
                  textAlign: 'center',
                }}
              >
                {node.label}
              </span>
              <span style={{fontFamily: fontBody, fontSize: 19, color: colors.textMuted}}>
                {node.sub}
              </span>
            </div>
          </div>
        );
      })}

      {/* Caption */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110}}>
        <div
          style={{
            fontFamily: fontBody,
            fontSize: 28,
            color: colors.textSecondary,
            fontWeight: 500,
            opacity: interpolate(frame, [280, 305], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          Menos trabalho manual. Coerência entre a receita e seus documentos.
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
