import {useCurrentFrame, useVideoConfig} from 'remotion';
import type {Locale} from './i18n/types';

/**
 * Timeline + helpers de tempo.
 *
 * Animações internas foram escritas assumindo 30fps (AUTHOR_FPS).
 * O vídeo roda a 60fps para motion mais suave: useAuthoredFrame()
 * mantém o timing de parede das animações e dobra as amostras da curva.
 */

export const FPS = 60;
export const AUTHOR_FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** Converte frames escritos a 30fps → frames reais a 60fps. */
export const T = (framesAt30: number) =>
  Math.round(framesAt30 * (FPS / AUTHOR_FPS));

/** Segundos → frames reais. */
export const sec = (seconds: number) => Math.round(seconds * FPS);

/**
 * Frame “de autoria” (escala 30fps). Use no lugar de useCurrentFrame()
 * dentro das cenas/componentes cujos delays foram escritos a 30fps.
 */
export const useAuthoredFrame = (): number => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame * (AUTHOR_FPS / fps);
};

export type AudioProfile = {
  file: string;
  durationSec: number;
};

export const AUDIO_BY_LOCALE: Record<Locale, AudioProfile> = {
  pt: {file: 'audio/vo.mp3', durationSec: 242.6775},
  it: {file: 'audio/vo-it.mp3', durationSec: 249.652188},
};

/** @deprecated use AUDIO_BY_LOCALE.pt — kept for PT Root defaults */
export const AUDIO_DURATION_SEC = AUDIO_BY_LOCALE.pt.durationSec;
/** @deprecated use AUDIO_BY_LOCALE.pt */
export const AUDIO_FILE = AUDIO_BY_LOCALE.pt.file;

type CutMap = {
  scene01: readonly [number, number];
  scene02: readonly [number, number];
  scene03: readonly [number, number];
  scene04: readonly [number, number];
  scene05: readonly [number, number];
  scene08: readonly [number, number];
  scene06: readonly [number, number];
  scene07: readonly [number, number];
  sceneReverseEngineering: readonly [number, number];
  scene09: readonly [number, number];
  scene10: readonly [number, number];
  scene11: readonly [number, number];
};

/**
 * Cortes sincronizados ao VO PT (Whisper + revisão manual).
 * Intervalos em segundos [start, end).
 */
export const VO_CUTS_PT: CutMap = {
  scene01: [0.0, 17.44],
  scene02: [17.44, 29.48],
  scene03: [29.48, 46.68],
  scene04: [46.68, 65.88],
  scene05: [65.88, 139.28],
  scene08: [128.88, 139.28],
  scene06: [139.28, 155.48],
  scene07: [155.48, 167.48],
  sceneReverseEngineering: [167.48, 210.48],
  scene09: [210.48, 221.48],
  scene10: [221.48, 232.48],
  scene11: [232.48, AUDIO_BY_LOCALE.pt.durationSec],
};

/**
 * Cortes sincronizados ao VO IT (Whisper + revisão manual sobre vo-it-transcript.json).
 * NÃO usar escala linear do PT — o ritmo do italiano é diferente.
 */
export const VO_CUTS_IT: CutMap = {
  scene01: [0.0, 16.66],
  scene02: [16.66, 28.1],
  scene03: [28.1, 44.6],
  scene04: [44.6, 64.4],
  scene05: [64.4, 143.4],
  scene08: [131.4, 143.4], // export isolado (VO coberto pela scene05)
  scene06: [143.4, 158.4],
  scene07: [158.4, 170.4],
  sceneReverseEngineering: [170.4, 216.4],
  scene09: [216.4, 226.4],
  scene10: [226.4, 238.4],
  scene11: [238.4, AUDIO_BY_LOCALE.it.durationSec],
};

/** Alias PT — default das cenas standalone. */
export const VO_CUTS = VO_CUTS_PT;

export type MainSceneKey = keyof CutMap;

/** Marks internos da Scene05 (segundos absolutos no VO). */
export type Scene05MarksAbs = {
  compositionEnd: number;
  gaugesEnd: number;
  resumoEnd: number;
  explanationEnd: number;
  ctaHighlight: number;
};

export const S5_MARKS_PT: Scene05MarksAbs = {
  compositionEnd: 87.88,
  gaugesEnd: 104.88,
  resumoEnd: 110.48,
  explanationEnd: 119.08,
  ctaHighlight: 128.88,
};

/** Marks IT alinhados ao transcript italiano. */
export const S5_MARKS_IT: Scene05MarksAbs = {
  compositionEnd: 88.4, // fim “prima dell'inizio della produzione”
  gaugesEnd: 104.4, // início interpretação
  resumoEnd: 110.4, // início sezione spiegazione
  explanationEnd: 120.4, // início Valori nutrizionali
  ctaHighlight: 131.4, // “direttamente dalla stessa schermata”
};

export const getScene05MarksAbs = (locale: Locale): Scene05MarksAbs =>
  locale === 'it' ? S5_MARKS_IT : S5_MARKS_PT;

const durationFromCut = ([start, end]: readonly [number, number]) =>
  Math.max(1, sec(end) - sec(start));

const buildDur = (cuts: CutMap) =>
  ({
    scene01: durationFromCut(cuts.scene01),
    scene02: durationFromCut(cuts.scene02),
    scene03: durationFromCut(cuts.scene03),
    scene04: durationFromCut(cuts.scene04),
    scene05: durationFromCut(cuts.scene05),
    scene08: durationFromCut(cuts.scene08),
    scene06: durationFromCut(cuts.scene06),
    scene07: durationFromCut(cuts.scene07),
    sceneReverseEngineering: durationFromCut(cuts.sceneReverseEngineering),
    scene09: durationFromCut(cuts.scene09),
    scene10: durationFromCut(cuts.scene10),
    scene11: durationFromCut(cuts.scene11),
    sceneNutritionalTable: sec(20),
  }) as const;

export type DurMap = ReturnType<typeof buildDur>;

export const DUR = buildDur(VO_CUTS_PT);

export const MAIN_SCENE_KEYS = [
  'scene01',
  'scene02',
  'scene03',
  'scene04',
  'scene05',
  'scene06',
  'scene07',
  'sceneReverseEngineering',
  'scene09',
  'scene10',
  'scene11',
] as const satisfies readonly MainSceneKey[];

export const TOTAL_DURATION = MAIN_SCENE_KEYS.reduce(
  (sum, key) => sum + DUR[key],
  0,
);

export const getVoCuts = (locale: Locale): CutMap =>
  locale === 'it' ? VO_CUTS_IT : VO_CUTS_PT;

export const getDur = (locale: Locale): DurMap => buildDur(getVoCuts(locale));

export const getTotalDuration = (locale: Locale): number => {
  const dur = getDur(locale);
  return MAIN_SCENE_KEYS.reduce((sum, key) => sum + dur[key], 0);
};

export const getAudioFile = (locale: Locale): string =>
  AUDIO_BY_LOCALE[locale].file;

/**
 * @deprecated Prefer getScene05MarksAbs / VO_CUTS_IT.
 * Mantido só para usos legados — IT agora tem cortes próprios, não escala.
 */
export const scaleVoTime = (locale: Locale, secondsPt: number): number => {
  if (locale === 'pt') return secondsPt;
  // Mapeia instante PT → IT pela posição relativa no áudio (fallback fraco).
  return (
    secondsPt *
    (AUDIO_BY_LOCALE.it.durationSec / AUDIO_BY_LOCALE.pt.durationSec)
  );
};
