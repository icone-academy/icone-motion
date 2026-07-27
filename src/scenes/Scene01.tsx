import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  BookOpen,
  Calculator,
  ClipboardList,
  Crosshair,
  FileSpreadsheet,
  FileText,
  Layers,
  NotebookPen,
  StickyNote,
  Target,
} from 'lucide-react';
import {SceneBackground} from '../components/SceneBackground';
import {AnimatedText} from '../components/AnimatedText';
import {colors, radius, shadows} from '../theme';
import {fontBody, fontDisplay} from '../fonts';

/**
 * Cena 1 — O problema do gelato profissional.
 * Narrativa visual: ordem (conhecimento · precisão · controle)
 * → receita no centro → informações se espalhando em caos
 * (planilhas, fichas, anotações, sistemas) → pergunta final.
 */

const IDEAL_OUT = 60;
const RECIPE_IN = 45;
const CHAOS_START = 85;
const WORDS_IN = 240;
const WORDS_OUT = 320;
const QUESTION_IN = 340;

/** Três pilares do craft — aparecem calmos no início. */
const PILLARS = [
  {icon: BookOpen, label: 'Conhecimento', tint: colors.primary, soft: colors.primarySoft},
  {icon: Crosshair, label: 'Precisão', tint: colors.info, soft: colors.infoSoft},
  {icon: Target, label: 'Controle', tint: colors.success, soft: colors.successSoft},
];

/**
 * Documentos que “explodem” do centro — cada um é um tipo
 * de informação espalhada no mundo real.
 */
const DOCS = [
  {
    kind: 'spreadsheet' as const,
    label: 'Planilha',
    x: 180,
    y: 160,
    rot: -11,
    delay: 0,
    phase: 0.4,
  },
  {
    kind: 'techsheet' as const,
    label: 'Ficha técnica',
    x: 1420,
    y: 140,
    rot: 8,
    delay: 10,
    phase: 1.2,
  },
  {
    kind: 'notes' as const,
    label: 'Anotações',
    x: 120,
    y: 620,
    rot: 6,
    delay: 18,
    phase: 2.1,
  },
  {
    kind: 'calculator' as const,
    label: 'Cálculos manuais',
    x: 1520,
    y: 640,
    rot: -7,
    delay: 26,
    phase: 3.0,
  },
  {
    kind: 'system' as const,
    label: 'Sistema A',
    x: 520,
    y: 80,
    rot: -3,
    delay: 34,
    phase: 3.8,
    systemTitle: 'ERP · Estoque',
    systemTint: colors.info,
  },
  {
    kind: 'system' as const,
    label: 'Sistema B',
    x: 1180,
    y: 720,
    rot: 4,
    delay: 42,
    phase: 4.6,
    systemTitle: 'Compras · Excel',
    systemTint: colors.warning,
  },
  {
    kind: 'clipboard' as const,
    label: 'Receita impressa',
    x: 1600,
    y: 380,
    rot: 12,
    delay: 50,
    phase: 5.2,
  },
  {
    kind: 'sticky' as const,
    label: 'Post-it',
    x: 340,
    y: 820,
    rot: -14,
    delay: 58,
    phase: 0.8,
  },
];

const TASK_WORDS = [
  {word: 'Formular.', x: 280, y: 280, docIndex: 0},
  {word: 'Balancear.', x: 1480, y: 260, docIndex: 3},
  {word: 'Corrigir.', x: 260, y: 720, docIndex: 2},
  {word: 'Documentar.', x: 1500, y: 700, docIndex: 1},
  {word: 'Comprar.', x: 960, y: 860, docIndex: 5},
];

const Pillar: React.FC<(typeof PILLARS)[number] & {index: number; fadeOut: number}> = ({
  icon: Icon,
  label,
  tint,
  soft,
  index,
  fadeOut,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - 8 - index * 12,
    fps,
    config: {damping: 14, stiffness: 130, mass: 0.7},
  });

  return (
    <div
      style={{
        opacity: enter * (1 - fadeOut),
        transform: `translateY(${(1 - enter) * 40 + fadeOut * -30}px) scale(${0.9 + enter * 0.1})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
        width: 290,
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          borderRadius: radius.lg,
          backgroundColor: soft,
          border: `1.5px solid ${tint}`,
          boxShadow: shadows.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={60} color={tint} strokeWidth={1.8} />
      </div>
      <span
        style={{
          fontFamily: fontDisplay,
          fontWeight: 600,
          fontSize: 44,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: colors.textPrimary,
        }}
      >
        {label}
      </span>
    </div>
  );
};

/** Mini planilha com células “vivas”. */
const SpreadsheetCard: React.FC = () => {
  const frame = useCurrentFrame();
  const cells = [
    ['Ingrediente', 'g', '%'],
    ['Leite', '520', '52'],
    ['Açúcar', '180', '18'],
    ['???', '??', '??'],
  ];

  return (
    <div
      style={{
        width: 280,
        borderRadius: radius.md,
        backgroundColor: colors.surface,
        border: `1.5px solid ${colors.border}`,
        boxShadow: shadows.shell,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          backgroundColor: colors.successSoft,
          borderBottom: `1px solid ${colors.borderSoft}`,
        }}
      >
        <FileSpreadsheet size={20} color={colors.success} />
        <span style={{fontFamily: fontBody, fontWeight: 700, fontSize: 16, color: colors.textPrimary}}>
          receita_v3.xlsx
        </span>
      </div>
      {cells.map((row, ri) => (
        <div
          key={ri}
          style={{
            display: 'grid',
            gridTemplateColumns: '1.6fr 0.7fr 0.7fr',
            borderBottom: ri < cells.length - 1 ? `1px solid ${colors.borderSoft}` : 'none',
            backgroundColor: ri === 0 ? colors.surfaceMuted : colors.surface,
          }}
        >
          {row.map((cell, ci) => {
            const blink =
              ri === 3
                ? 0.45 + 0.55 * Math.abs(Math.sin(frame / 10 + ci))
                : 1;
            return (
              <span
                key={ci}
                style={{
                  fontFamily: fontBody,
                  fontSize: 14,
                  fontWeight: ri === 0 ? 700 : 500,
                  color: ri === 3 ? colors.danger : colors.textSecondary,
                  padding: '8px 10px',
                  opacity: blink,
                  borderRight: ci < 2 ? `1px solid ${colors.borderSoft}` : 'none',
                }}
              >
                {cell}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Ficha técnica solta. */
const TechSheetCard: React.FC = () => (
  <div
    style={{
      width: 250,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      border: `1.5px solid ${colors.border}`,
      boxShadow: shadows.shell,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
      <FileText size={22} color={colors.warning} />
      <span style={{fontFamily: fontBody, fontWeight: 700, fontSize: 16, color: colors.textPrimary}}>
        Ficha técnica
      </span>
    </div>
    {[0.95, 0.7, 0.85, 0.55, 0.75].map((w, i) => (
      <div
        key={i}
        style={{
          height: 8,
          width: `${w * 100}%`,
          borderRadius: 4,
          backgroundColor: i === 0 ? colors.warningSoft : colors.borderSoft,
        }}
      />
    ))}
    <div
      style={{
        marginTop: 4,
        fontFamily: fontBody,
        fontSize: 13,
        color: colors.textMuted,
        fontStyle: 'italic',
      }}
    >
      versão impressa · desatualizada
    </div>
  </div>
);

/** Bloco de anotações / caderno. */
const NotesCard: React.FC = () => (
  <div
    style={{
      width: 240,
      borderRadius: radius.md,
      backgroundColor: '#FFFBEB',
      border: `1.5px solid ${colors.warning}`,
      boxShadow: shadows.md,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      transform: 'rotate(-2deg)',
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
      <NotebookPen size={20} color={colors.warning} />
      <span style={{fontFamily: fontBody, fontWeight: 700, fontSize: 15, color: colors.textPrimary}}>
        Caderno da produção
      </span>
    </div>
    {['PAC alto — conferir', 'trocar dextrose?', 'temp. ????', 'pedir pistache'].map(
      (line, i) => (
        <div
          key={i}
          style={{
            fontFamily: fontBody,
            fontSize: 15,
            color: i === 2 ? colors.danger : colors.textSecondary,
            borderBottom: `1px dashed ${colors.border}`,
            paddingBottom: 4,
          }}
        >
          {line}
        </div>
      ),
    )}
  </div>
);

/** Calculadora / balanço manual. */
const CalculatorCard: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = 0.5 + 0.5 * Math.sin(frame / 8);

  return (
    <div
      style={{
        width: 200,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        border: `1.5px solid ${colors.border}`,
        boxShadow: shadows.shell,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
        <Calculator size={20} color={colors.info} />
        <span style={{fontFamily: fontBody, fontWeight: 700, fontSize: 15, color: colors.textPrimary}}>
          Balanço manual
        </span>
      </div>
      <div
        style={{
          backgroundColor: colors.surfaceMuted,
          borderRadius: radius.sm,
          padding: '12px 14px',
          fontFamily: fontBody,
          fontWeight: 700,
          fontSize: 28,
          color: colors.danger,
          textAlign: 'right',
          opacity: 0.7 + flash * 0.3,
        }}
      >
        ERR
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6}}>
        {['7', '8', '9', '4', '5', '6', '+', '=', 'C'].map((k) => (
          <div
            key={k}
            style={{
              height: 28,
              borderRadius: 6,
              backgroundColor: colors.borderSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: fontBody,
              fontSize: 14,
              fontWeight: 600,
              color: colors.textMuted,
            }}
          >
            {k}
          </div>
        ))}
      </div>
    </div>
  );
};

/** Janela de “sistema diferente”. */
const SystemWindow: React.FC<{title: string; tint: string}> = ({title, tint}) => (
  <div
    style={{
      width: 260,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      border: `1.5px solid ${colors.border}`,
      boxShadow: shadows.shell,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        backgroundColor: colors.surfaceMuted,
        borderBottom: `1px solid ${colors.borderSoft}`,
      }}
    >
      <div style={{display: 'flex', gap: 5}}>
        {['#EF4444', '#F59E0B', '#22C55E'].map((c) => (
          <div key={c} style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: c}} />
        ))}
      </div>
      <span style={{fontFamily: fontBody, fontWeight: 600, fontSize: 14, color: tint}}>
        {title}
      </span>
    </div>
    <div style={{padding: 14, display: 'flex', flexDirection: 'column', gap: 8}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
        <Layers size={18} color={tint} />
        <span style={{fontFamily: fontBody, fontSize: 14, color: colors.textMuted}}>
          sem integração com a receita
        </span>
      </div>
      {[0.9, 0.6, 0.75].map((w, i) => (
        <div
          key={i}
          style={{
            height: 10,
            width: `${w * 100}%`,
            borderRadius: 5,
            backgroundColor: colors.borderSoft,
          }}
        />
      ))}
    </div>
  </div>
);

const ClipboardCard: React.FC = () => (
  <div
    style={{
      width: 200,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      border: `1.5px solid ${colors.border}`,
      boxShadow: shadows.md,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      alignItems: 'center',
    }}
  >
    <ClipboardList size={36} color={colors.primaryMuted} strokeWidth={1.7} />
    <span style={{fontFamily: fontBody, fontWeight: 700, fontSize: 16, color: colors.textPrimary}}>
      Receita impressa
    </span>
    <span style={{fontFamily: fontBody, fontSize: 13, color: colors.textMuted, textAlign: 'center'}}>
      última atualização desconhecida
    </span>
  </div>
);

const StickyCard: React.FC = () => (
  <div
    style={{
      width: 160,
      height: 150,
      backgroundColor: '#FEF08A',
      boxShadow: shadows.md,
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      transform: 'rotate(-8deg)',
    }}
  >
    <StickyNote size={22} color={colors.warning} />
    <span
      style={{
        fontFamily: fontBody,
        fontWeight: 600,
        fontSize: 16,
        color: colors.textPrimary,
        lineHeight: 1.3,
      }}
    >
      lembrar de conferir POD!!
    </span>
  </div>
);

const DocBody: React.FC<{doc: (typeof DOCS)[number]}> = ({doc}) => {
  switch (doc.kind) {
    case 'spreadsheet':
      return <SpreadsheetCard />;
    case 'techsheet':
      return <TechSheetCard />;
    case 'notes':
      return <NotesCard />;
    case 'calculator':
      return <CalculatorCard />;
    case 'system':
      return <SystemWindow title={doc.systemTitle!} tint={doc.systemTint!} />;
    case 'clipboard':
      return <ClipboardCard />;
    case 'sticky':
      return <StickyCard />;
  }
};

/** Documento voando do centro para a periferia. */
const FlyingDoc: React.FC<{doc: (typeof DOCS)[number]; index: number}> = ({doc, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const delay = CHAOS_START + doc.delay;
  const fly = spring({
    frame: frame - delay,
    fps,
    config: {damping: 16, stiffness: 70, mass: 1.1},
  });

  // Origem = centro da receita
  const fromX = 960;
  const fromY = 520;
  const jump = Math.sin(Math.min(1, fly) * Math.PI) * (70 + index * 8);
  const x = fromX + (doc.x - fromX) * fly;
  const y = fromY + (doc.y - fromY) * fly - jump;

  // Drift contínuo depois de aterrissar
  const driftX = fly > 0.9 ? Math.sin(frame / 28 + doc.phase) * 14 : 0;
  const driftY = fly > 0.9 ? Math.cos(frame / 24 + doc.phase * 1.4) * 12 : 0;
  const wobble = fly > 0.85 ? Math.sin(frame / 36 + doc.phase) * 3 : 0;

  // Dim no final
  const dim = interpolate(frame, [QUESTION_IN - 24, QUESTION_IN + 10], [0, 0.72], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Label do tipo de documento
  const labelIn = interpolate(frame - delay - 20, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: x + driftX,
        top: y + driftY,
        transform: `translate(-50%, -50%) rotate(${doc.rot * fly + wobble}deg) scale(${0.55 + fly * 0.45})`,
        opacity: opacity * (1 - dim),
        zIndex: 5 + index,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <DocBody doc={doc} />
      <span
        style={{
          opacity: labelIn,
          fontFamily: fontDisplay,
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: colors.primary,
          backgroundColor: colors.surface,
          padding: '6px 14px',
          borderRadius: 999,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.sm,
        }}
      >
        {doc.label}
      </span>
    </div>
  );
};

/** Linhas quebradas do centro até cada documento. */
const BrokenLinks: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg
      width={1920}
      height={1080}
      style={{position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2}}
    >
      {DOCS.map((doc, i) => {
        const delay = CHAOS_START + doc.delay + 8;
        const draw = interpolate(frame - delay, [0, 18], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        // Linha “quebra” (some o meio) depois de um tempo
        const breakAt = delay + 50;
        const broken = interpolate(frame, [breakAt, breakAt + 14], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const dim = interpolate(frame, [QUESTION_IN - 24, QUESTION_IN], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        const x1 = 960;
        const y1 = 520;
        const x2 = doc.x;
        const y2 = doc.y;
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - 40;

        return (
          <g key={i} opacity={draw * (1 - broken * 0.85) * dim}>
            <path
              d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
              fill="none"
              stroke={broken > 0.4 ? colors.danger : colors.primaryMuted}
              strokeWidth={2}
              strokeDasharray="8 10"
              strokeDashoffset={-(frame + i * 6)}
              opacity={0.55}
            />
            {broken > 0.35 ? (
              <circle cx={mx} cy={my} r={5 + broken * 4} fill={colors.danger} opacity={0.7} />
            ) : null}
          </g>
        );
      })}
    </svg>
  );
};

/** Receita no centro — começa ordenada e “estilhaça”. */
const RecipeCore: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({
    frame: frame - RECIPE_IN,
    fps,
    config: {damping: 200, stiffness: 100},
  });

  // Pulso de explosão no início do caos
  const blast = interpolate(
    frame,
    [CHAOS_START - 4, CHAOS_START + 8, CHAOS_START + 28],
    [0, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const fade = interpolate(frame, [CHAOS_START + 40, CHAOS_START + 80], [1, 0.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const questionDim = interpolate(frame, [QUESTION_IN - 20, QUESTION_IN + 10], [0, 0.7], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 960,
        top: 520,
        transform: `translate(-50%, -50%) scale(${0.92 + enter * 0.08 + blast * 0.08})`,
        opacity: enter * fade * (1 - questionDim),
        zIndex: 4,
      }}
    >
      {/* Halo de explosão */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 280 + blast * 220,
          height: 280 + blast * 220,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(194,65,12,${blast * 0.25}) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          width: 580,
          borderRadius: radius.shell,
          backgroundColor: colors.surface,
          border: `2px solid ${blast > 0.2 ? colors.danger : colors.border}`,
          boxShadow: blast > 0.2 ? `0 20px 60px rgba(194,65,12,${0.15 + blast * 0.2})` : shadows.shell,
          padding: 44,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <span
          style={{
            fontFamily: fontDisplay,
            fontWeight: 700,
            fontSize: 56,
            color: colors.textPrimary,
            textAlign: 'center',
          }}
        >
          Receita profissional
        </span>
        <span
          style={{
            fontFamily: fontBody,
            fontSize: 30,
            color: colors.textMuted,
            textAlign: 'center',
          }}
        >
          Gelato artesanal & industrial
        </span>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 6}}>
          {['Composição', 'Parâmetros técnicos', 'Documentação'].map((row, i) => {
            const rowIn = interpolate(frame - RECIPE_IN - 14 - i * 8, [0, 10], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            // Depois do caos, as linhas “quebram”
            const cracked = frame > CHAOS_START + 20;
            return (
              <div
                key={row}
                style={{
                  opacity: rowIn,
                  height: 56,
                  borderRadius: radius.sm,
                  backgroundColor: cracked ? colors.dangerSoft : colors.surfaceMuted,
                  border: `1px solid ${cracked ? colors.danger : colors.borderSoft}`,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 22px',
                  fontFamily: fontBody,
                  fontWeight: 600,
                  fontSize: 28,
                  color: cracked ? colors.danger : colors.textSecondary,
                  textDecoration: cracked ? 'line-through' : 'none',
                }}
              >
                {cracked ? `${row} — espalhado` : row}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Scene01: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const idealFade = interpolate(frame, [IDEAL_OUT - 16, IDEAL_OUT + 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const idealOpacity = 1 - idealFade;

  const wordsOpacity = interpolate(frame, [WORDS_OUT, WORDS_OUT + 18], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const questionIn = spring({
    frame: frame - QUESTION_IN,
    fps,
    config: {damping: 200, stiffness: 100},
  });

  return (
    <SceneBackground>
      {/* Fase 1 — pilares do craft */}
      {frame < IDEAL_OUT + 20 ? (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: idealOpacity,
            gap: 36,
          }}
        >
          <div
            style={{
              fontFamily: fontBody,
              fontSize: 40,
              color: colors.textMuted,
              marginBottom: 24,
              opacity: interpolate(frame, [4, 18], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            Desenvolver uma receita profissional exige
          </div>
          <div style={{display: 'flex', gap: 64}}>
            {PILLARS.map((pillar, i) => (
              <Pillar key={pillar.label} {...pillar} index={i} fadeOut={idealFade} />
            ))}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Fase 2 — receita central + explosão de documentos */}
      {frame >= RECIPE_IN - 5 ? <RecipeCore /> : null}
      {frame >= CHAOS_START ? <BrokenLinks /> : null}
      {frame >= CHAOS_START
        ? DOCS.map((doc, i) => <FlyingDoc key={i} doc={doc} index={i} />)
        : null}

      {/* Legenda do caos */}
      {frame >= CHAOS_START + 70 && frame < WORDS_IN ? (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 64,
          }}
        >
          <div
            style={{
              opacity: interpolate(
                frame,
                [CHAOS_START + 70, CHAOS_START + 90, WORDS_IN - 16, WORDS_IN],
                [0, 1, 1, 0],
                {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
              ),
              fontFamily: fontBody,
              fontWeight: 500,
              fontSize: 48,
              color: colors.textSecondary,
              backgroundColor: 'rgba(248,246,242,0.88)',
              padding: '18px 36px',
              borderRadius: radius.md,
              border: `1px solid ${colors.border}`,
              boxShadow: shadows.sm,
              textAlign: 'center',
              maxWidth: 1400,
            }}
          >
            Informações espalhadas entre planilhas, fichas, anotações e sistemas diferentes.
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Fase 3 — tarefas tentando alcançar documentos (texto cinético espacial) */}
      {frame >= WORDS_IN && frame < QUESTION_IN ? (
        <AbsoluteFill style={{opacity: wordsOpacity, zIndex: 15}}>
          {TASK_WORDS.map((item, i) => {
            const delay = WORDS_IN + i * 18;
            const pop = spring({
              frame: frame - delay,
              fps,
              config: {damping: 13, stiffness: 150, mass: 0.65},
            });
            // Tenta ir em direção ao doc, mas “falha” e treme
            const fail = interpolate(frame - delay, [20, 40], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const shake = fail > 0 ? Math.sin(frame * 1.2) * 4 * fail : 0;

            return (
              <div
                key={item.word}
                style={{
                  position: 'absolute',
                  left: item.x + shake,
                  top: item.y,
                  transform: `translate(-50%, -50%) scale(${0.85 + pop * 0.15})`,
                  opacity: pop,
                  fontFamily: fontDisplay,
                  fontWeight: 700,
                  fontSize: 68,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: fail > 0.5 ? colors.danger : colors.textPrimary,
                  textShadow: '0 2px 12px rgba(248,246,242,0.9)',
                }}
              >
                {item.word}
              </div>
            );
          })}
        </AbsoluteFill>
      ) : null}

      {/* Fase 4 — pergunta */}
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', zIndex: 20}}>
        <div
          style={{
            opacity: questionIn,
            transform: `scale(${0.94 + questionIn * 0.06})`,
            maxWidth: 1400,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 26,
          }}
        >
          <AnimatedText
            text="Por que tudo isso precisa estar separado?"
            delay={QUESTION_IN}
            stagger={4}
            style={{
              fontFamily: fontDisplay,
              fontWeight: 600,
              fontSize: 104,
              lineHeight: 1.15,
              color: colors.primary,
            }}
          />
          <div
            style={{
              fontFamily: fontBody,
              fontWeight: 400,
              fontSize: 40,
              color: colors.textMuted,
              opacity: interpolate(frame, [QUESTION_IN + 28, QUESTION_IN + 48], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              }),
            }}
          >
            Conhecimento, precisão e controle — espalhados em pedaços.
          </div>
        </div>
      </AbsoluteFill>
    </SceneBackground>
  );
};
