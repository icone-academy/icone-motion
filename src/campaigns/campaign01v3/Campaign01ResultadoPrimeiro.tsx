import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  interpolateColors,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {
  Check,
  ChevronsDown,
  CircleCheck,
  Sparkles,
} from 'lucide-react';
import {colors, shadows, tracking} from '../../theme';
import {JOURNEY_STEPS, PRODUCT_MODULES} from './copy';
import {
  CAMPAIGN_01_V3_BEATS,
  type Campaign01V3Format,
  type Campaign01V3Props,
} from './types';
import {
  Campaign01V3Body,
  Campaign01V3Card,
  Campaign01V3Eyebrow,
  Campaign01V3Headline,
  Campaign01V3Stage,
  Campaign01V3TopLogo,
  fontStyles,
  motionClamp,
  useCampaign01V3Entrance,
  useCampaign01V3Layout,
} from './ui';

const AnimatedBlock: React.FC<{
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  style?: React.CSSProperties;
}> = ({children, delay = 0, distance = 18, style}) => {
  const enter = useCampaign01V3Entrance(delay);

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * distance}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const HeroScene: React.FC<{format: Campaign01V3Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useCampaign01V3Layout(format);
  const imageEnter = useCampaign01V3Entrance(22, 78);
  const imageSize = layout.horizontal ? 330 : layout.compact ? 278 : 560;
  const imageFloat = Math.sin(frame * 0.045) * (layout.compact ? 3 : 6);

  return (
    <Campaign01V3Stage format={format} dark>
      <AnimatedBlock delay={5} style={{marginTop: layout.compact ? 15 : 22}}>
        <Campaign01V3Eyebrow compact={layout.compact} dark>
          Para quem produz gelato
        </Campaign01V3Eyebrow>
      </AnimatedBlock>
      <AnimatedBlock
        delay={9}
        style={{
          marginTop: layout.compact ? 17 : 24,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Campaign01V3Headline
          size={layout.horizontal ? 80 : layout.compact ? 62 : 88}
          dark
          maxWidth={layout.horizontal ? 1180 : 840}
        >
          QUER MELHORAR A{' '}
          <span style={{color: '#E7C7A7'}}>QUALIDADE</span> DO SEU GELATO?
        </Campaign01V3Headline>
      </AnimatedBlock>
      <AnimatedBlock
        delay={14}
        style={{
          marginTop: layout.compact ? 14 : 18,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Campaign01V3Body
          size={layout.horizontal ? 28 : layout.compact ? 23 : 30}
          dark
          maxWidth={720}
        >
          Sem depender só de tentativa e erro.
        </Campaign01V3Body>
      </AnimatedBlock>

      <div
        style={{
          width: imageSize,
          height: layout.horizontal ? 302 : layout.compact ? 262 : 528,
          marginTop: layout.horizontal ? 12 : layout.compact ? 12 : 18,
          position: 'relative',
          opacity: imageEnter,
          transform: `translateY(${(1 - imageEnter) * 30 + imageFloat}px) scale(${0.93 + imageEnter * 0.07})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '12%',
            right: '12%',
            bottom: layout.compact ? 6 : 10,
            height: layout.compact ? 34 : 54,
            borderRadius: '50%',
            background: 'rgba(15,10,7,.33)',
            filter: `blur(${layout.compact ? 18 : 26}px)`,
          }}
        />
        <Img
          src={staticFile('media/campaign-01-v3-artisan-gelato.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 28px 34px rgba(20,13,9,.23))',
          }}
        />
      </div>
    </Campaign01V3Stage>
  );
};

type ResultItem = {
  label: string;
  before: string;
  after: string;
};

const RESULT_ITEMS: ResultItem[] = [
  {label: 'Textura', before: 'Muito firme', after: 'Mais cremosa'},
  {label: 'Doçura', before: 'Acima do ponto', after: 'Mais equilibrada'},
  {label: 'Estabilidade', before: 'Baixa', after: 'Mais estável'},
];

const ResultComparison: React.FC<{
  item: ResultItem;
  progress: number;
  compact: boolean;
}> = ({item, progress, compact}) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      padding: compact ? '15px 16px' : '20px 22px',
      borderRadius: compact ? 17 : 21,
      border: `1px solid ${interpolateColors(progress, [0, 1], [colors.borderSoft, 'rgba(47,133,90,.34)'])}`,
      background: interpolateColors(progress, [0, 1], [colors.surfaceMuted, colors.successSoft]),
      boxSizing: 'border-box',
    }}
  >
    <div
      style={{
        fontFamily: fontStyles.fontBody,
        fontSize: compact ? 13 : 16,
        fontWeight: 780,
        color: colors.textMuted,
        letterSpacing: tracking.wide,
        textTransform: 'uppercase',
      }}
    >
      {item.label}
    </div>
    <div
      style={{
        marginTop: compact ? 8 : 12,
        minHeight: compact ? 48 : 58,
        position: 'relative',
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          fontFamily: fontStyles.fontBody,
          fontSize: compact ? 16 : 20,
          lineHeight: 1.18,
          fontWeight: 650,
          color: colors.textSecondary,
          opacity: interpolate(progress, [0, 0.44], [1, 0], motionClamp),
          transform: `translateY(${-12 * progress}px)`,
        }}
      >
        {item.before}
      </span>
      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: compact ? 8 : 12,
          fontFamily: fontStyles.fontBody,
          fontSize: compact ? 16 : 20,
          lineHeight: 1.18,
          fontWeight: 760,
          color: colors.success,
          opacity: interpolate(progress, [0.56, 1], [0, 1], motionClamp),
          transform: `translateY(${12 * (1 - progress)}px)`,
        }}
      >
        {item.after}
        <CircleCheck size={compact ? 21 : 26} strokeWidth={2.3} color={colors.success} />
      </span>
    </div>
  </div>
);

const PromiseScene: React.FC<{format: Campaign01V3Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useCampaign01V3Layout(format);
  const isAdjusted = frame >= 114;
  const verticalCards = format === 'vertical';

  return (
    <Campaign01V3Stage format={format}>
      <AnimatedBlock delay={5} style={{marginTop: layout.compact ? 18 : 24}}>
        <Campaign01V3Headline size={layout.title} maxWidth={1050}>
          CRIE. ENTENDA. <span style={{color: colors.primary}}>AJUSTE.</span>
        </Campaign01V3Headline>
      </AnimatedBlock>
      <AnimatedBlock
        delay={10}
        style={{
          marginTop: layout.compact ? 12 : 16,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Campaign01V3Body size={layout.lead} maxWidth={820}>
          Veja como a receita tende a se comportar antes do lote.
        </Campaign01V3Body>
      </AnimatedBlock>

      <AnimatedBlock
        delay={17}
        distance={24}
        style={{width: '100%', marginTop: layout.compact ? 24 : 34}}
      >
        <Campaign01V3Card compact={layout.compact} padding={layout.cardPadding}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 18,
              paddingBottom: layout.compact ? 16 : 22,
              borderBottom: `1px solid ${colors.borderSoft}`,
            }}
          >
            <div style={{textAlign: 'left', minWidth: 0}}>
              <div
                style={{
                  fontFamily: fontStyles.fontBody,
                  fontSize: layout.compact ? 13 : 15,
                  fontWeight: 800,
                  color: colors.textMuted,
                  letterSpacing: tracking.wide,
                  textTransform: 'uppercase',
                }}
              >
                Receita em análise
              </div>
              <div
                style={{
                  marginTop: 5,
                  fontFamily: fontStyles.fontBody,
                  fontSize: layout.compact ? 22 : 28,
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: colors.textPrimary,
                }}
              >
                Gelato artesanal · Pistache
              </div>
            </div>
            <div
              style={{
                flex: '0 0 auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: 0,
                color: isAdjusted ? colors.success : colors.primary,
                fontFamily: fontStyles.fontBody,
                fontSize: layout.compact ? 12 : 15,
                fontWeight: 780,
              }}
            >
              <Sparkles size={layout.compact ? 16 : 19} strokeWidth={2.3} />
              {isAdjusted ? 'Ajuste simulado' : 'Tendência atual'}
            </div>
          </div>

          <div
            style={{
              marginTop: layout.compact ? 16 : 22,
              display: 'flex',
              flexDirection: verticalCards ? 'column' : 'row',
              gap: layout.compact ? 10 : 14,
            }}
          >
            {RESULT_ITEMS.map((item, index) => (
              <ResultComparison
                key={item.label}
                item={item}
                progress={interpolate(
                  frame,
                  [70 + index * 6, 98 + index * 6],
                  [0, 1],
                  motionClamp,
                )}
                compact={layout.compact}
              />
            ))}
          </div>

          <div
            style={{
              marginTop: layout.compact ? 14 : 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              minHeight: layout.compact ? 32 : 38,
              fontFamily: fontStyles.fontBody,
              fontSize: layout.compact ? 15 : 18,
              fontWeight: 720,
              color: isAdjusted ? colors.success : colors.textSecondary,
            }}
          >
            {isAdjusted ? <Check size={layout.compact ? 19 : 23} strokeWidth={2.7} /> : null}
            {isAdjusted
              ? 'Compare o ajuste antes de produzir'
              : 'Entenda o que a receita indica'}
          </div>
        </Campaign01V3Card>
      </AnimatedBlock>
    </Campaign01V3Stage>
  );
};

const JourneyScene: React.FC<{format: Campaign01V3Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useCampaign01V3Layout(format);
  // The first three steps establish the flow quickly; the saved pattern remains
  // on screen for the spoken promise about repeating with consistency.
  const stepStarts = [0, 12, 24, 36] as const;
  const activeIndex = frame < stepStarts[1]
    ? 0
    : frame < stepStarts[2]
      ? 1
      : frame < stepStarts[3]
        ? 2
        : 3;
  const activeStep = JOURNEY_STEPS[activeIndex];
  const ActiveIcon = activeStep.Icon;
  const stepFrame = frame - stepStarts[activeIndex];
  const stepEntrance = interpolate(stepFrame, [0, 8], [0, 1], motionClamp);

  return (
    <Campaign01V3Stage format={format} accent>
      <AnimatedBlock delay={5} style={{marginTop: layout.compact ? 18 : 24}}>
        <Campaign01V3Headline size={layout.title} maxWidth={980}>
          DO INGREDIENTE <span style={{color: colors.primary}}>AO PADRÃO.</span>
        </Campaign01V3Headline>
      </AnimatedBlock>
      <AnimatedBlock
        delay={9}
        style={{
          marginTop: layout.compact ? 11 : 14,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Campaign01V3Body size={layout.body} maxWidth={760}>
          Um fluxo claro para criar, decidir e repetir.
        </Campaign01V3Body>
      </AnimatedBlock>

      <AnimatedBlock
        delay={15}
        style={{width: '100%', marginTop: layout.compact ? 24 : 34}}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: layout.compact ? 8 : 12,
            width: '100%',
          }}
        >
          {JOURNEY_STEPS.map((step, index) => {
            const done = index < activeIndex;
            const active = index === activeIndex;
            const StepIcon = step.Icon;
            return (
              <div
                key={step.title}
                style={{
                  minWidth: 0,
                  minHeight: layout.compact ? 72 : 88,
                  padding: layout.compact ? '10px 6px' : '13px 9px',
                  borderRadius: layout.compact ? 16 : 19,
                  border: `1px solid ${active || done ? 'rgba(122,106,90,.38)' : colors.border}`,
                  background: active
                    ? colors.primary
                    : done
                      ? 'rgba(255,255,255,.88)'
                      : 'rgba(255,255,255,.54)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: layout.compact ? 6 : 8,
                  boxSizing: 'border-box',
                }}
              >
                {done ? (
                  <Check
                    size={layout.compact ? 18 : 22}
                    strokeWidth={2.8}
                    color={colors.success}
                  />
                ) : (
                  <StepIcon
                    size={layout.compact ? 18 : 23}
                    strokeWidth={2.25}
                    color={active ? colors.textInverse : colors.primary}
                  />
                )}
                <div
                  style={{
                    fontFamily: fontStyles.fontBody,
                    fontSize: layout.compact ? 11 : 14,
                    fontWeight: 760,
                    lineHeight: 1.12,
                    color: active ? colors.textInverse : colors.textPrimary,
                    textAlign: 'center',
                  }}
                >
                  {index + 1}. {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </AnimatedBlock>

      <div style={{width: '100%', marginTop: layout.compact ? 16 : 22}}>
        <Campaign01V3Card compact={layout.compact} padding={layout.cardPadding}>
          <div
            key={activeStep.title}
            style={{
              minHeight: format === 'vertical' ? 252 : layout.compact ? 180 : 178,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              opacity: stepEntrance,
              transform: `translateY(${12 * (1 - stepEntrance)}px)`,
            }}
          >
            <div
              style={{
                width: layout.compact ? 52 : 64,
                height: layout.compact ? 52 : 64,
                borderRadius: layout.compact ? 16 : 19,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.primarySoft,
                color: colors.primary,
              }}
            >
              <ActiveIcon size={layout.compact ? 27 : 34} strokeWidth={2.1} />
            </div>
            <div
              style={{
                marginTop: layout.compact ? 13 : 17,
                fontFamily: fontStyles.fontDisplay,
                fontSize: layout.compact ? 31 : 39,
                lineHeight: 1,
                fontWeight: 700,
                color: colors.textPrimary,
              }}
            >
              {activeStep.title}
            </div>
            <div
              style={{
                maxWidth: 720,
                marginTop: layout.compact ? 9 : 12,
                fontFamily: fontStyles.fontBody,
                fontSize: layout.compact ? 17 : 22,
                lineHeight: 1.3,
                fontWeight: 560,
                color: colors.textSecondary,
              }}
            >
              {activeStep.description}
            </div>
            <div
              style={{
                marginTop: layout.compact ? 10 : 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: layout.compact ? 6 : 8,
                color: colors.success,
                fontFamily: fontStyles.fontBody,
                fontSize: layout.compact ? 13 : 16,
                fontWeight: 760,
              }}
            >
              <CircleCheck size={layout.compact ? 16 : 19} strokeWidth={2.35} />
              {activeStep.meta}
            </div>
          </div>
        </Campaign01V3Card>
      </div>
    </Campaign01V3Stage>
  );
};

const ProductModuleCard: React.FC<{
  module: (typeof PRODUCT_MODULES)[number];
  index: number;
  format: Campaign01V3Format;
  compact: boolean;
}> = ({module, index, format, compact}) => {
  const enter = useCampaign01V3Entrance(16 + index * 5, 94);
  const ModuleIcon = module.Icon;

  return (
    <div
      style={{
        minHeight: format === 'vertical' ? 210 : compact ? 174 : 178,
        padding: compact ? 18 : 24,
        borderRadius: compact ? 21 : 26,
        border: `1px solid ${colors.border}`,
        backgroundColor: 'rgba(255,255,255,.94)',
        boxShadow: shadows.md,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        textAlign: 'center',
        opacity: enter,
        transform: `translateY(${18 * (1 - enter)}px) scale(${0.985 + enter * 0.015})`,
      }}
    >
      <div
        style={{
          width: compact ? 45 : 55,
          height: compact ? 45 : 55,
          borderRadius: compact ? 14 : 17,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.primarySoft,
          color: colors.primary,
        }}
      >
        <ModuleIcon size={compact ? 24 : 29} strokeWidth={2.1} />
      </div>
      <div
        style={{
          marginTop: compact ? 11 : 15,
          fontFamily: fontStyles.fontBody,
          fontSize: compact ? 19 : 24,
          fontWeight: 800,
          lineHeight: 1.08,
          color: colors.textPrimary,
        }}
      >
        {module.title}
      </div>
      <div
        style={{
          marginTop: compact ? 7 : 9,
          maxWidth: 310,
          fontFamily: fontStyles.fontBody,
          fontSize: compact ? 14 : 17,
          fontWeight: 540,
          lineHeight: 1.28,
          color: colors.textSecondary,
        }}
      >
        {module.description}
      </div>
    </div>
  );
};

const BreadthScene: React.FC<{format: Campaign01V3Format}> = ({format}) => {
  const layout = useCampaign01V3Layout(format);

  return (
    <Campaign01V3Stage format={format}>
      <AnimatedBlock delay={5} style={{marginTop: layout.compact ? 18 : 24}}>
        <Campaign01V3Headline size={layout.title} maxWidth={1080}>
          MUITO ALÉM DO{' '}
          <span style={{color: colors.primary}}>BALANCEAMENTO.</span>
        </Campaign01V3Headline>
      </AnimatedBlock>
      <AnimatedBlock
        delay={10}
        style={{
          marginTop: layout.compact ? 11 : 15,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Campaign01V3Body size={layout.lead} maxWidth={760}>
          Tudo conectado, do ingrediente ao rótulo.
        </Campaign01V3Body>
      </AnimatedBlock>

      <div
        style={{
          width: '100%',
          marginTop: layout.compact ? 24 : 34,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: layout.compact ? 12 : 18,
        }}
      >
        {PRODUCT_MODULES.map((module, index) => (
          <ProductModuleCard
            key={module.title}
            module={module}
            index={index}
            format={format}
            compact={layout.compact}
          />
        ))}
      </div>
    </Campaign01V3Stage>
  );
};

const CtaScene: React.FC<{format: Campaign01V3Format}> = ({format}) => {
  const frame = useCurrentFrame();
  const layout = useCampaign01V3Layout(format);
  // The offer enters with the spoken “Comece grátis”, after the brand promise.
  const ctaEnter = useCampaign01V3Entrance(108, 92);
  const arrowEnter = useCampaign01V3Entrance(118, 98);
  const arrowOffset = interpolate(
    Math.sin(frame * 0.19),
    [-1, 1],
    [0, layout.compact ? 6 : 9],
  );

  return (
    <Campaign01V3Stage format={format} dark>
      <AnimatedBlock
        delay={5}
        style={{
          marginTop: layout.compact ? 25 : 34,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Campaign01V3Headline
          size={layout.horizontal ? 72 : layout.compact ? 56 : 76}
          dark
          maxWidth={layout.horizontal ? 1280 : 860}
        >
          MAIS QUALIDADE.{' '}
          <span style={{color: '#E7C7A7'}}>MAIS CONSISTÊNCIA.</span> MAIS CONTROLE.
        </Campaign01V3Headline>
      </AnimatedBlock>
      <AnimatedBlock
        delay={10}
        style={{
          marginTop: layout.compact ? 16 : 22,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Campaign01V3Body
          size={layout.horizontal ? 28 : layout.compact ? 23 : 29}
          dark
          maxWidth={820}
        >
          Uma plataforma para criar, organizar e evoluir suas receitas.
        </Campaign01V3Body>
      </AnimatedBlock>

      <div
        style={{
          marginTop: layout.compact ? 24 : 34,
          opacity: ctaEnter,
          transform: `translateY(${16 * (1 - ctaEnter)}px)`,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: fontStyles.fontDisplay,
            fontSize: layout.compact ? 38 : 48,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: '0.01em',
            color: colors.textInverse,
          }}
        >
          COMECE GRÁTIS
        </div>
        <div
          style={{
            marginTop: layout.compact ? 10 : 13,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: layout.compact ? 7 : 9,
            fontFamily: fontStyles.fontBody,
            fontSize: layout.compact ? 14 : 18,
            lineHeight: 1.3,
            fontWeight: 620,
            color: 'rgba(255,255,255,.76)',
          }}
        >
          <CircleCheck size={layout.compact ? 17 : 21} strokeWidth={2.3} />
          Não precisa de cartão de crédito
        </div>

        <div
          style={{
            marginTop: layout.compact ? 12 : 16,
            height: layout.compact ? 34 : 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: arrowEnter,
            transform: `translateY(${arrowOffset}px)`,
          }}
        >
          <ChevronsDown
            size={layout.compact ? 31 : 40}
            strokeWidth={2}
            color="rgba(255,255,255,.88)"
          />
        </div>

        <div
          style={{
            marginTop: layout.compact ? 10 : 13,
            display: 'inline-block',
            paddingBottom: layout.compact ? 5 : 7,
            borderBottom: '1px solid rgba(255,255,255,.45)',
            fontFamily: fontStyles.fontBody,
            fontSize: layout.compact ? 19 : 25,
            fontWeight: 820,
            lineHeight: 1.1,
            letterSpacing: '0.01em',
            color: colors.textInverse,
          }}
        >
          https://icone.academy
        </div>
      </div>
    </Campaign01V3Stage>
  );
};

export const Campaign01ResultadoPrimeiro: React.FC<Campaign01V3Props> = ({
  format,
  voiceoverFile = null,
  musicFile = null,
}) => {
  const frame = useCurrentFrame();
  const darkScene =
    frame < CAMPAIGN_01_V3_BEATS.promise.from ||
    frame >= CAMPAIGN_01_V3_BEATS.cta.from;

  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
    {voiceoverFile ? <Audio src={staticFile(voiceoverFile)} /> : null}
    {musicFile ? <Audio src={staticFile(musicFile)} volume={0.14} loop /> : null}

    <Sequence
      from={CAMPAIGN_01_V3_BEATS.hero.from}
      durationInFrames={CAMPAIGN_01_V3_BEATS.hero.duration}
    >
      <HeroScene format={format} />
    </Sequence>
    <Sequence
      from={CAMPAIGN_01_V3_BEATS.promise.from}
      durationInFrames={CAMPAIGN_01_V3_BEATS.promise.duration}
    >
      <PromiseScene format={format} />
    </Sequence>
    <Sequence
      from={CAMPAIGN_01_V3_BEATS.journey.from}
      durationInFrames={CAMPAIGN_01_V3_BEATS.journey.duration}
    >
      <JourneyScene format={format} />
    </Sequence>
    <Sequence
      from={CAMPAIGN_01_V3_BEATS.breadth.from}
      durationInFrames={CAMPAIGN_01_V3_BEATS.breadth.duration}
    >
      <BreadthScene format={format} />
    </Sequence>
    <Sequence
      from={CAMPAIGN_01_V3_BEATS.cta.from}
      durationInFrames={CAMPAIGN_01_V3_BEATS.cta.duration}
    >
      <CtaScene format={format} />
    </Sequence>
    <Campaign01V3TopLogo format={format} dark={darkScene} />
    </AbsoluteFill>
  );
};
