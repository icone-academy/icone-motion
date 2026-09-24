import {
  BookOpen,
  Calculator,
  FileCheck2,
  FlaskConical,
  Layers3,
  Save,
  SlidersHorizontal,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export const CAMPAIGN_01_V3_VOICEOVER =
  'Quer melhorar a qualidade do seu gelato sem depender só de tentativa e erro? Com a ICone, você cria a receita, entende como ela tende a se comportar e testa ajustes antes de produzir. Depois, salva seu padrão para repetir com mais consistência. Ingredientes, neutros, custos, ficha técnica e etiqueta ficam conectados no mesmo fluxo. ICone: mais clareza para criar, mais controle para produzir. Comece grátis, sem cartão de crédito, em icone.academy.';

export type JourneyStep = {
  title: string;
  description: string;
  meta: string;
  Icon: LucideIcon;
};

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    title: 'Crie a receita',
    description: 'Escolha os ingredientes e construa a sua formulação.',
    meta: 'Sua ideia ganha estrutura',
    Icon: FlaskConical,
  },
  {
    title: 'Entenda o resultado',
    description: 'Veja como a receita tende a se comportar no produto final.',
    meta: 'Textura, doçura e estabilidade',
    Icon: Sparkles,
  },
  {
    title: 'Teste os ajustes',
    description: 'Compare alternativas antes de mexer no lote.',
    meta: 'Decida antes de produzir',
    Icon: SlidersHorizontal,
  },
  {
    title: 'Salve o seu padrão',
    description: 'Guarde a versão que você quer repetir na produção.',
    meta: 'Mais consistência entre lotes',
    Icon: Save,
  },
];

export type ProductModule = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

export const PRODUCT_MODULES: ProductModule[] = [
  {
    title: 'Ingredientes',
    description: 'Base global e ingredientes próprios.',
    Icon: BookOpen,
  },
  {
    title: 'Neutros e bases',
    description: 'Crie, organize e reutilize.',
    Icon: Layers3,
  },
  {
    title: 'Receita e custo',
    description: 'Formule e acompanhe o valor.',
    Icon: Calculator,
  },
  {
    title: 'Ficha e etiqueta',
    description: 'Da receita ao documento.',
    Icon: FileCheck2,
  },
];
