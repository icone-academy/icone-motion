import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  Building2,
  Calculator,
  ClipboardList,
  Database,
  FlaskConical,
  Scale,
  ShieldCheck,
  ShoppingCart,
  Tag,
  Wand2,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {Eyebrow} from '../components/Eyebrow';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 10 (2:42–2:57) — Montagem: grid dinâmico reunindo todas as
 * funcionalidades em movimento sincronizado + texto cinético.
 */

const FEATURES = [
  {icon: Scale, label: 'Balanceamento', bg: colors.primarySoft, color: colors.primary},
  {icon: Database, label: 'Ingredientes', bg: '#F5F3FF', color: colors.pacViolet},
  {icon: ShieldCheck, label: 'Fontes validadas', bg: colors.successSoft, color: colors.success},
  {icon: Wand2, label: 'Correção automática', bg: colors.primarySoft, color: colors.primary},
  {icon: FlaskConical, label: 'Neutros', bg: colors.infoSoft, color: colors.info},
  {icon: Calculator, label: 'Cálculo nutricional', bg: colors.successSoft, color: colors.success},
  {icon: ClipboardList, label: 'Fichas técnicas', bg: colors.infoSoft, color: colors.info},
  {icon: Tag, label: 'Rotulagem', bg: colors.warningSoft, color: colors.warning},
  {icon: Building2, label: 'Fornecedores', bg: colors.primarySoft, color: colors.primary},
  {icon: ShoppingCart, label: 'Compras', bg: colors.warningSoft, color: colors.warning},
];

const WORDS = [
  'Conhecimento técnico.',
  'Formulação.',
  'Correção.',
  'Documentação.',
  'Ingredientes.',
];

export const Scene10: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <SceneBackground>
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 60}}>
        <Eyebrow delay={2}>Tudo em uma única plataforma</Eyebrow>
      </AbsoluteFill>

      {/* Grid de funcionalidades */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', paddingTop: -40}}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 250px)',
            gap: 26,
            marginTop: -120,
          }}
        >
          {FEATURES.map((feature, i) => {
            const delay = 16 + i * 7;
            const pop = spring({
              frame: frame - delay,
              fps,
              config: {damping: 13, stiffness: 150, mass: 0.7},
            });
            // Flutuação sincronizada em onda (fase pela coluna)
            const col = i % 5;
            const row = Math.floor(i / 5);
            const float = Math.sin(frame / 22 - col * 0.7 - row * 0.5) * 8;

            return (
              <div
                key={feature.label}
                style={{
                  opacity: pop,
                  transform: `translateY(${(1 - pop) * 46 + float}px) scale(${0.9 + pop * 0.1})`,
                  borderRadius: radius.lg,
                  border: `1px solid ${colors.border}`,
                  backgroundColor: colors.surface,
                  boxShadow: shadows.md,
                  padding: '26px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: radius.md,
                    backgroundColor: feature.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <feature.icon size={36} color={feature.color} strokeWidth={1.9} />
                </div>
                <span
                  style={{
                    fontFamily: fontBody,
                    fontWeight: 600,
                    fontSize: 21,
                    color: colors.textPrimary,
                    textAlign: 'center',
                  }}
                >
                  {feature.label}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Texto cinético inferior */}
      <AbsoluteFill
        style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 100}}
      >
        <div style={{display: 'flex', gap: 22, flexWrap: 'wrap', justifyContent: 'center'}}>
          {WORDS.map((word, i) => {
            const delay = 130 + i * 26;
            const pop = spring({
              frame: frame - delay,
              fps,
              config: {damping: 14, stiffness: 160, mass: 0.6},
            });
            return (
              <span
                key={word}
                style={{
                  opacity: pop,
                  transform: `translateY(${(1 - pop) * 30}px)`,
                  fontFamily: fontDisplay,
                  fontWeight: 600,
                  fontSize: 46,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: i % 2 === 0 ? colors.textPrimary : colors.primary,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 26,
            fontFamily: fontBody,
            fontSize: 27,
            color: colors.textMuted,
            opacity: interpolate(frame, [280, 305], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          Mais organização, mais controle e mais segurança para padronizar resultados.
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
