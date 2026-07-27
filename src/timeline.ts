import {useCurrentFrame, useVideoConfig} from 'remotion';

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

/** Duração real do VO (ffprobe). */
export const AUDIO_DURATION_SEC = 242.6775;
export const AUDIO_FILE = 'audio/vo.mp3';

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

/**
 * Cortes sincronizados ao VO (Whisper + revisão manual).
 * Intervalos em segundos [start, end).
 */
export const VO_CUTS = {
  scene01: [0.0, 17.44], // desafio / informações espalhadas
  scene02: [17.44, 29.48], // plataforma ICone
  scene03: [29.48, 46.68], // banco de ingredientes
  scene04: [46.68, 65.88], // fontes (USDA/TBCA/TACO/fabricantes)
  scene05: [65.88, 139.28], // receita → nutrição → etiqueta/ficha (mesma tela)
  scene08: [128.88, 139.28], // export isolado (VO coberto pela scene05)
  scene06: [139.28, 155.48], // correção automática
  scene07: [155.48, 167.48], // neutros
  sceneReverseEngineering: [167.48, 210.48], // engenharia reversa
  scene09: [210.48, 221.48], // compras / fornecedores
  scene10: [221.48, 232.48], // montagem / fechamento
  scene11: [232.48, AUDIO_DURATION_SEC], // CTA lançamento 15/08/2026
} as const;

export type MainSceneKey = keyof typeof VO_CUTS;

const durationFromCut = ([start, end]: readonly [number, number]) =>
  Math.max(1, sec(end) - sec(start));

export const DUR = {
  scene01: durationFromCut(VO_CUTS.scene01),
  scene02: durationFromCut(VO_CUTS.scene02),
  scene03: durationFromCut(VO_CUTS.scene03),
  scene04: durationFromCut(VO_CUTS.scene04),
  scene05: durationFromCut(VO_CUTS.scene05),
  scene08: durationFromCut(VO_CUTS.scene08),
  scene06: durationFromCut(VO_CUTS.scene06),
  scene07: durationFromCut(VO_CUTS.scene07),
  sceneReverseEngineering: durationFromCut(VO_CUTS.sceneReverseEngineering),
  scene09: durationFromCut(VO_CUTS.scene09),
  scene10: durationFromCut(VO_CUTS.scene10),
  scene11: durationFromCut(VO_CUTS.scene11),
  /** Export isolado — não entra no Main */
  sceneNutritionalTable: sec(20),
} as const;

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
