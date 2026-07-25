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
  ClipboardList,
  FileSpreadsheet,
  FileText,
  NotebookPen,
  StickyNote,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {AnimatedText} from '../components/AnimatedText';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 1 (0:00–0:15) — Desafios da gelateria profissional.
 * Elementos caóticos (planilhas, calculadora, fichas soltas) +
 * texto cinético "Formular. Balancear. ..." → pergunta final.
 */

const CHAOS_ITEMS = [
  {icon: FileSpreadsheet, x: 220, y: 200, delay: 4, phase: 0.2, rot: -9, tint: colors.success},
  {icon: Calculator, x: 1580, y: 240, delay: 10, phase: 1.4, rot: 8, tint: colors.info},
  {icon: FileText, x: 300, y: 760, delay: 16, phase: 2.6, rot: 6, tint: colors.warning},
  {icon: StickyNote, x: 1500, y: 780, delay: 22, phase: 3.8, rot: -12, tint: colors.danger},
  {icon: ClipboardList, x: 130, y: 480, delay: 28, phase: 5.0, rot: 10, tint: colors.primaryMuted},
  {icon: NotebookPen, x: 1720, y: 520, delay: 34, phase: 0.9, rot: -6, tint: colors.pacViolet},
];

const WORDS = ['Formular.', 'Balancear.', 'Corrigir.', 'Documentar.', 'Comprar.'];
const WORD_START = 40;
const WORD_BEAT = 48; // uma palavra a cada ~1.6s
const WORDS_OUT = 300;
const QUESTION_IN = 330;

const ChaosItem: React.FC<(typeof CHAOS_ITEMS)[number] & {dim: number}> = ({
  icon: Icon,
  x,
  y,
  delay,
  phase,
  rot,
  tint,
  dim,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: {damping: 13, stiffness: 120, mass: 0.8},
  });

  // Deriva caótica: flutuação orgânica em x/y + rotação oscilante
  const driftX = Math.sin(frame / 31 + phase) * 22;
  const driftY = Math.cos(frame / 26 + phase * 1.7) * 26;
  const wobble = Math.sin(frame / 40 + phase) * 6;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: enter * (1 - dim * 0.75),
        transform: `translate(${driftX}px, ${driftY}px) rotate(${rot + wobble}deg) scale(${0.6 + enter * 0.4})`,
      }}
    >
      <div
        style={{
          width: 118,
          height: 118,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={54} color={tint} strokeWidth={1.8} />
      </div>
    </div>
  );
};

export const Scene01: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const wordsOpacity = interpolate(frame, [WORDS_OUT, WORDS_OUT + 22], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Depois da pergunta, o caos "esfria" (dim)
  const dim = interpolate(frame, [QUESTION_IN - 20, QUESTION_IN + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const questionScale = spring({
    frame: frame - QUESTION_IN,
    fps,
    config: {damping: 200, stiffness: 100},
  });

  return (
    <SceneBackground>
      {CHAOS_ITEMS.map((item, i) => (
        <ChaosItem key={i} {...item} dim={dim} />
      ))}

      {/* Palavras cinéticas empilhadas */}
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          opacity: wordsOpacity,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          {WORDS.map((word, i) => {
            const delay = WORD_START + i * WORD_BEAT;
            const pop = spring({
              frame: frame - delay,
              fps,
              config: {damping: 14, stiffness: 170, mass: 0.6},
            });
            const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <div
                key={word}
                style={{
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: 92,
                  lineHeight: 1.12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: colors.textPrimary,
                  opacity,
                  transform: `translateY(${(1 - pop) * 40}px) scale(${0.92 + pop * 0.08})`,
                }}
              >
                {word}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Pergunta final */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            opacity: questionScale,
            transform: `scale(${0.94 + questionScale * 0.06})`,
            maxWidth: 1300,
            textAlign: 'center',
          }}
        >
          <AnimatedText
            text="Por que tudo isso precisa estar separado?"
            delay={QUESTION_IN}
            stagger={4}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 84,
              lineHeight: 1.2,
              color: colors.primary,
            }}
          />
          <div
            style={{
              marginTop: 28,
              fontFamily: fontBody,
              fontWeight: 400,
              fontSize: 30,
              color: colors.textMuted,
              opacity: interpolate(frame, [QUESTION_IN + 30, QUESTION_IN + 50], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            Planilhas, fichas técnicas, anotações e sistemas diferentes.
          </div>
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
