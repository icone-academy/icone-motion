import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {AUDIO_FILE, DUR, T} from './timeline';
import {colors} from './theme';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
import {Scene07} from './scenes/Scene07';
import {Scene09} from './scenes/Scene09';
import {Scene10} from './scenes/Scene10';
import {Scene11} from './scenes/Scene11';
import {SceneReverseEngineering} from './scenes/SceneReverseEngineering';

/** Crossfade 2→3: Scene02 se estende e sobrepõe o início da 3 (~0,7s). */
const CROSSFADE_02_03 = T(20);

/**
 * Ordem alinhada ao VO:
 * receita (inclui nutrição + etiqueta/ficha na mesma tela) → correção → neutros → …
 * Scene08 fica só como export isolado (Root).
 */
const SCENES: {
  component: React.FC;
  duration: number;
  name: string;
  /** extensão visual além da duração VO (para crossfade) */
  extend?: number;
}[] = [
  {component: Scene01, duration: DUR.scene01, name: 'Cena 1 — Desafios'},
  {
    component: Scene02,
    duration: DUR.scene02,
    name: 'Cena 2 — Marca + Dashboard',
    extend: CROSSFADE_02_03,
  },
  {component: Scene03, duration: DUR.scene03, name: 'Cena 3 — Ingredientes'},
  {component: Scene04, duration: DUR.scene04, name: 'Cena 4 — Fontes'},
  {component: Scene05, duration: DUR.scene05, name: 'Cena 5 — Receita'},
  {component: Scene06, duration: DUR.scene06, name: 'Cena 6 — Correção automática'},
  {component: Scene07, duration: DUR.scene07, name: 'Cena 7 — Neutros'},
  {
    component: SceneReverseEngineering,
    duration: DUR.sceneReverseEngineering,
    name: 'Cena — Engenharia reversa',
  },
  {component: Scene09, duration: DUR.scene09, name: 'Cena 9 — Compras'},
  {component: Scene10, duration: DUR.scene10, name: 'Cena 10 — Montagem'},
  {component: Scene11, duration: DUR.scene11, name: 'Cena 11 — CTA lançamento'},
];

/** Composição principal sincronizada ao VO (~4:02.7 a 60fps). */
export const Main: React.FC = () => {
  let from = 0;

  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      <Audio src={staticFile(AUDIO_FILE)} />
      {SCENES.map(({component: SceneComponent, duration, name, extend = 0}) => {
        const sequence = (
          <Sequence
            key={name}
            from={from}
            durationInFrames={duration + extend}
            name={name}
          >
            <SceneComponent />
          </Sequence>
        );
        from += duration;
        return sequence;
      })}
    </AbsoluteFill>
  );
};
