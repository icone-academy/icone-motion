import type {
  Campaign05Audience,
  Campaign05AudienceCopy,
  Campaign05CaptionCue,
  Campaign05HookVariant,
} from './types';

export const CAMPAIGN_05_CLAIMS = {
  ingredientCount: '+500',
  ingredientClaim: 'ingredientes validados',
  cta: 'Comece grátis',
  site: 'icone.academy',
  tagline: 'Inteligência para Gelato',
} as const;

export const MASTER_VOICEOVER =
  'Você formula numa gelateria, desenvolve receitas para clientes ou precisa padronizar uma produção industrial? ' +
  'Então, a ICone foi feita para o seu trabalho. ' +
  'Porque receita, custo, fornecedores, ficha técnica e etiqueta não deveriam viver separados. ' +
  'A ICone conecta todo esse fluxo, do ingrediente ao rótulo. ' +
  'Você começa com uma base de mais de quinhentos ingredientes validados, cadastra os seus, constrói neutros e usa engenharia reversa. ' +
  'Enquanto formula, acompanha água, açúcares, sólidos e outros parâmetros em tempo real. Identifica desequilíbrios e testa ajustes antes de produzir. ' +
  'Com os fornecedores conectados à receita, o custo deixa de ser uma surpresa. ' +
  'E da mesma fórmula você gera tabela nutricional, etiqueta e ficha técnica personalizada com a marca da sua empresa, sem recomeçar o trabalho em outra ferramenta. ' +
  'Mais consistência para a gelateria. Mais produtividade para quem atende clientes. Mais controle para quem produz em escala. ' +
  'ICone. Inteligência para Gelato. Comece grátis em icone.academy.';

export const MASTER_CAPTIONS: Campaign05CaptionCue[] = [
  {
    from: 0,
    to: 7.56,
    text: 'Você formula numa gelateria, desenvolve receitas para clientes ou precisa padronizar uma produção industrial?',
    emphasis: 'gelateria',
  },
  {
    from: 7.56,
    to: 10.68,
    text: 'Então, a ICone foi feita para o seu trabalho.',
    emphasis: 'seu trabalho',
  },
  {
    from: 10.68,
    to: 17.54,
    text: 'Porque receita, custo, fornecedores, ficha técnica e etiqueta não deveriam viver separados.',
    emphasis: 'não deveriam viver separados',
  },
  {
    from: 17.54,
    to: 22.12,
    text: 'A ICone conecta todo esse fluxo, do ingrediente ao rótulo.',
    emphasis: 'do ingrediente ao rótulo',
  },
  {
    from: 22.12,
    to: 26.38,
    text: 'Você começa com uma base de mais de quinhentos ingredientes validados,',
    emphasis: 'mais de quinhentos ingredientes validados',
  },
  {
    from: 26.38,
    to: 31.06,
    text: 'cadastra os seus, constrói neutros e usa engenharia reversa.',
    emphasis: 'engenharia reversa',
  },
  {
    from: 31.06,
    to: 37.65,
    text: 'Enquanto formula, acompanha água, açúcares, sólidos e outros parâmetros em tempo real.',
    emphasis: 'em tempo real',
  },
  {
    from: 37.65,
    to: 41.81,
    text: 'Identifica desequilíbrios e testa ajustes antes de produzir.',
    emphasis: 'antes de produzir',
  },
  {
    from: 41.81,
    to: 46.43,
    text: 'Com os fornecedores conectados à receita, o custo deixa de ser uma surpresa.',
    emphasis: 'custo',
  },
  {
    from: 46.43,
    to: 54.47,
    text: 'E da mesma fórmula você gera tabela nutricional, etiqueta e ficha técnica personalizada com a marca da sua empresa,',
    emphasis: 'da mesma fórmula',
  },
  {
    from: 54.47,
    to: 57.41,
    text: 'sem recomeçar o trabalho em outra ferramenta.',
    emphasis: 'sem recomeçar',
  },
  {
    from: 57.41,
    to: 59.66,
    text: 'Mais consistência para a gelateria.',
    emphasis: 'Mais consistência',
  },
  {
    from: 59.66,
    to: 62.52,
    text: 'Mais produtividade para quem atende clientes.',
    emphasis: 'Mais produtividade',
  },
  {
    from: 62.52,
    to: 65.51,
    text: 'Mais controle para quem produz em escala.',
    emphasis: 'Mais controle',
  },
  {
    from: 65.51,
    to: 68.33,
    text: 'ICone. Inteligência para Gelato.',
    emphasis: 'ICone',
  },
  {
    from: 68.33,
    to: 70.74,
    text: 'Comece grátis em icone.academy.',
    emphasis: 'Comece grátis',
  },
];

const makeCutCues = (
  hook: string,
  hookAccent: string,
  problem: string,
  proof: string,
  payoff: string,
  ends: readonly [number, number, number, number, number],
): Campaign05CaptionCue[] => [
  {from: 0, to: ends[0], text: hook, emphasis: hookAccent},
  {from: ends[0], to: ends[1], text: problem},
  {from: ends[1], to: ends[2], text: proof, emphasis: 'mesmo fluxo'},
  {from: ends[2], to: ends[3], text: payoff, emphasis: payoff.split('.')[0]},
  {from: ends[3], to: ends[4], text: 'Comece grátis em icone.academy.', emphasis: 'Comece grátis'},
];

const CUT_CAPTION_ENDS = {
  gelateria: {
    a: [4.64, 9.42, 15.44, 18.27, 20.76],
    b: [4.44, 9.52, 15.3, 18.28, 21.1],
  },
  especialista: {
    a: [4.76, 8.33, 14.18, 17.63, 20.3],
    b: [5.85, 9.48, 15.54, 18.95, 21.44],
  },
  industria: {
    a: [5.09, 10.41, 16.03, 19.1, 21.85],
    b: [4.76, 9.71, 15.42, 18.23, 20.82],
  },
} as const;

const audienceBase: Record<Exclude<Campaign05Audience, 'master'>, Omit<Campaign05AudienceCopy, 'captionCues'>> = {
  gelateria: {
    eyebrow: 'PARA GELATERIAS E SORVETERIAS',
    hook: {
      a: 'Sua gelateria ainda depende de planilhas para padronizar receitas?',
      b: 'O custo da sua receita só aparece depois que você produz?',
    },
    hookAccent: {a: 'padronizar receitas', b: 'depois que você produz'},
    problem: 'Formulação, parâmetros e fornecedores precisam trabalhar juntos.',
    proof: 'Identifique desequilíbrios, acompanhe custos e gere ficha e etiqueta no mesmo fluxo.',
    payoff: 'Menos retrabalho. Mais consistência.',
    visual: {
      hook: {
        a: 'Padrão não cabe numa planilha.',
        b: 'O custo precisa vir antes do lote.',
      },
      signals: ['Receita padronizada', 'Custo previsto'],
      problem: 'Três pontos de falha. Uma só operação.',
      proof: 'Veja antes. Ajuste antes.',
      payoff: 'Repita o resultado, não o trabalho.',
      payoffDetail: 'Receita padronizada · custo visível',
    },
  },
  especialista: {
    eyebrow: 'PARA QUEM DESENVOLVE RECEITAS',
    hook: {
      a: 'Quantas horas você perde refazendo cálculos e documentos para cada cliente?',
      b: 'Nutricionista, formulador ou consultor: a ICone foi feita para o seu trabalho.',
    },
    hookAccent: {a: 'para cada cliente', b: 'seu trabalho'},
    problem: 'Seu conhecimento merece um fluxo à altura do seu trabalho.',
    proof: 'Use ingredientes validados, formule e entregue ficha e etiqueta no mesmo fluxo.',
    payoff: 'Menos tarefa repetida. Mais produtividade.',
    visual: {
      hook: {
        a: 'Seu tempo vale mais que refazer planilhas.',
        b: 'Conhecimento técnico. Entrega profissional.',
      },
      signals: ['Base técnica', 'Entrega pronta'],
      problem: 'O cliente muda. O processo não precisa recomeçar.',
      proof: 'Da formulação ao entregável.',
      payoff: 'Mais projetos. O mesmo rigor.',
      payoffDetail: 'Base técnica · documentos do cliente',
    },
  },
  industria: {
    eyebrow: 'PARA PRODUÇÃO EM ESCALA',
    hook: {
      a: 'Produção em escala não pode depender de decisões técnicas espalhadas.',
      b: 'Sua indústria enxerga fórmula, custo e documentação no mesmo fluxo?',
    },
    hookAccent: {a: 'decisões técnicas espalhadas', b: 'mesmo fluxo'},
    problem: 'Parâmetros, fornecedores e documentação precisam falar a mesma língua.',
    proof: 'Centralize critérios técnicos, custos, ficha e etiqueta no mesmo fluxo.',
    payoff: 'Mais previsibilidade. Mais controle.',
    visual: {
      hook: {
        a: 'Escala exige um critério único.',
        b: 'Fórmula, custo e documento precisam concordar.',
      },
      signals: ['Critério centralizado', 'Escala previsível'],
      problem: 'Decisão espalhada vira variação.',
      proof: 'Um fluxo para decidir e padronizar.',
      payoff: 'Controle que chega ao lote.',
      payoffDetail: 'Critérios · fornecedores · documentação',
    },
  },
};

const buildAudienceCopy = (
  audience: Exclude<Campaign05Audience, 'master'>,
): Campaign05AudienceCopy => {
  const base = audienceBase[audience];
  const captionCues = (['a', 'b'] as Campaign05HookVariant[]).reduce(
    (result, variant) => {
      result[variant] = makeCutCues(
        base.hook[variant],
        base.hookAccent[variant],
        base.problem,
        base.proof,
        base.payoff,
        CUT_CAPTION_ENDS[audience][variant],
      );
      return result;
    },
    {} as Record<Campaign05HookVariant, Campaign05CaptionCue[]>,
  );
  return {...base, captionCues};
};

export const AUDIENCE_COPY = {
  gelateria: buildAudienceCopy('gelateria'),
  especialista: buildAudienceCopy('especialista'),
  industria: buildAudienceCopy('industria'),
} as const;
