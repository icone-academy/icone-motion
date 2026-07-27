export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/**
 * Durações alinhadas ao VO (timestamps do áudio):
 * 0:00–0:29  S01+S02   desafio + plataforma ICone
 * 0:29–0:46  S03       banco de ingredientes
 * 0:46–1:10  S04       fontes (USDA/TBCA/TACO/fabricantes)
 * 1:10–2:08  S05       receita (composição → gauges → … → nutrição)
 * 2:08–2:35  S08+S06   etiqueta/ficha + correção automática
 * 2:35–2:50  S07       neutros
 * 2:50–3:30  Reversa   problema → composição (ciência ICone)
 * 3:30–3:57  S09+S10   compras + montagem / fechamento
 * 3:57–4:15  S11       lançamento 15/08/2026
 * → total 4:15 (7650 frames)
 *
 * SceneNutritionalTable fica fora do Main (export isolado) —
 * o VO cobre nutrição/IG dentro da S05.
 */
export const DUR = {
  scene01: 420, // 0:00–0:14
  scene02: 450, // 0:14–0:29
  scene03: 510, // 0:29–0:46
  scene04: 720, // 0:46–1:10
  scene05: 1740, // 1:10–2:08
  scene08: 360, // 2:08–2:20 etiquetas/ficha
  scene06: 450, // 2:20–2:35 correção
  scene07: 450, // 2:35–2:50 neutros
  sceneReverseEngineering: 1200, // 2:50–3:30
  scene09: 390, // 3:30–3:43
  scene10: 420, // 3:43–3:57
  scene11: 540, // 3:57–4:15
  /** Export isolado — não entra no Main sincronizado ao VO */
  sceneNutritionalTable: 600,
} as const;

/** Soma só das cenas do Main (sem tabela nutricional isolada). */
export const MAIN_SCENE_KEYS = [
  'scene01',
  'scene02',
  'scene03',
  'scene04',
  'scene05',
  'scene08',
  'scene06',
  'scene07',
  'sceneReverseEngineering',
  'scene09',
  'scene10',
  'scene11',
] as const;

export const TOTAL_DURATION = MAIN_SCENE_KEYS.reduce(
  (sum, key) => sum + DUR[key],
  0,
);
