import type {Campaign05Audience, Campaign05HookVariant} from './types';
import {CAMPAIGN_05_FPS} from './types';

export const campaign05Frame = (seconds: number) =>
  Math.round(seconds * CAMPAIGN_05_FPS);

export const MASTER_BEATS = {
  // Alinhado à locução master ElevenLabs de 71,08s. As sobreposições mantêm
  // as transições fluidas sem antecipar a próxima prova antes da respectiva fala.
  identity: {from: campaign05Frame(0), duration: campaign05Frame(11.4)},
  fragmentation: {from: campaign05Frame(10.33), duration: campaign05Frame(7.6)},
  promise: {from: campaign05Frame(17.27), duration: campaign05Frame(5.1)},
  technicalBase: {from: campaign05Frame(21.71), duration: campaign05Frame(10)},
  decision: {from: campaign05Frame(30.8), duration: campaign05Frame(15.8)},
  documents: {from: campaign05Frame(46.09), duration: campaign05Frame(11.6)},
  outcomes: {from: campaign05Frame(57.04), duration: campaign05Frame(8.4)},
  cta: {from: campaign05Frame(65.01), duration: campaign05Frame(9.99)},
} as const;

const CUT_BEATS = {
  gelateria: {
    a: {
      hook: {from: campaign05Frame(0), duration: campaign05Frame(4.9)},
      problem: {from: campaign05Frame(4.2), duration: campaign05Frame(5.65)},
      proof: {from: campaign05Frame(9.14), duration: campaign05Frame(6.55)},
      payoff: {from: campaign05Frame(15.05), duration: campaign05Frame(3.5)},
      cta: {from: campaign05Frame(17.99), duration: campaign05Frame(6.01)},
    },
    b: {
      hook: {from: campaign05Frame(0), duration: campaign05Frame(4.7)},
      problem: {from: campaign05Frame(3.99), duration: campaign05Frame(5.8)},
      proof: {from: campaign05Frame(9.07), duration: campaign05Frame(6.5)},
      payoff: {from: campaign05Frame(15.1), duration: campaign05Frame(3.5)},
      cta: {from: campaign05Frame(17.91), duration: campaign05Frame(6.09)},
    },
  },
  especialista: {
    a: {
      hook: {from: campaign05Frame(0), duration: campaign05Frame(5)},
      problem: {from: campaign05Frame(4.38), duration: campaign05Frame(4.25)},
      proof: {from: campaign05Frame(7.99), duration: campaign05Frame(6.5)},
      payoff: {from: campaign05Frame(13.77), duration: campaign05Frame(4.1)},
      cta: {from: campaign05Frame(17.29), duration: campaign05Frame(6.71)},
    },
    b: {
      hook: {from: campaign05Frame(0), duration: campaign05Frame(6)},
      problem: {from: campaign05Frame(5.5), duration: campaign05Frame(4.3)},
      proof: {from: campaign05Frame(9.23), duration: campaign05Frame(6.6)},
      payoff: {from: campaign05Frame(15.17), duration: campaign05Frame(4)},
      cta: {from: campaign05Frame(18.6), duration: campaign05Frame(5.4)},
    },
  },
  industria: {
    a: {
      hook: {from: campaign05Frame(0), duration: campaign05Frame(5.4)},
      problem: {from: campaign05Frame(4.74), duration: campaign05Frame(6.06)},
      proof: {from: campaign05Frame(10.01), duration: campaign05Frame(6.29)},
      payoff: {from: campaign05Frame(15.66), duration: campaign05Frame(3.74)},
      cta: {from: campaign05Frame(18.74), duration: campaign05Frame(5.26)},
    },
    b: {
      hook: {from: campaign05Frame(0), duration: campaign05Frame(5.05)},
      problem: {from: campaign05Frame(4.34), duration: campaign05Frame(5.71)},
      proof: {from: campaign05Frame(9.5), duration: campaign05Frame(6.2)},
      payoff: {from: campaign05Frame(15.06), duration: campaign05Frame(3.44)},
      cta: {from: campaign05Frame(17.86), duration: campaign05Frame(6.14)},
    },
  },
} as const;

/** Retorna os beats já sincronizados quando a locução definitiva está disponível. */
export const getCutBeats = (
  audience: Exclude<Campaign05Audience, 'master'>,
  hookVariant: Campaign05HookVariant,
) => CUT_BEATS[audience][hookVariant];
