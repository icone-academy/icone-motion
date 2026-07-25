export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/**
 * Duração de cada cena em frames (30fps), seguindo o roteiro:
 * 1) 0:00–0:15  2) 0:15–0:28  3) 0:28–0:58  4) 0:58–1:13
 * 5) 1:13–1:33  6) 1:33–1:56  7) 1:56–2:16
 * Nutricional) 2:16–2:36  8) 2:36–2:53  Reversa) 2:53–3:13
 * 9) 3:13–3:30  10) 3:30–3:45  11) 3:45–3:55
 * → total 3:55 (7050 frames)
 */
export const DUR = {
  scene01: 450,
  scene02: 390,
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
