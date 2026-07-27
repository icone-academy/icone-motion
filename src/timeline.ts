export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/**
 * Duração de cada cena em frames (30fps), seguindo o roteiro:
 * 1) 0:00–0:20  2) 0:20–0:38  3) 0:38–1:08  4) 1:08–1:23
 * 5) 1:23–1:43  6) 1:43–2:06  7) 2:06–2:26
 * Nutricional) 2:26–2:46  8) 2:46–3:03  Reversa) 3:03–3:23
 * 9) 3:23–3:40  10) 3:40–3:55  11) 3:55–4:05
 * → total 4:05 (7350 frames)
 */
export const DUR = {
  scene01: 600,
  scene02: 540,
  scene03: 900,
  scene04: 450,
  scene05: 600,
  scene06: 690,
  scene07: 600,
  sceneNutritionalTable: 600,
  scene08: 510,
  sceneReverseEngineering: 600,
  scene09: 510,
  scene10: 450,
  scene11: 300,
} as const;

export const TOTAL_DURATION = Object.values(DUR).reduce((a, b) => a + b, 0);
