import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {DUR} from './timeline';
import {colors} from './theme';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
import {Scene07} from './scenes/Scene07';
import {Scene08} from './scenes/Scene08';
import {Scene09} from './scenes/Scene09';
import {Scene10} from './scenes/Scene10';
import {Scene11} from './scenes/Scene11';
import {SceneReverseEngineering} from './scenes/SceneReverseEngineering';
import {SceneNutritionalTable} from './scenes/SceneNutritionalTable';

const SCENES: {component: React.FC; duration: number; name: string}[] = [
  {component: Scene01, duration: DUR.scene01, name: 'Cena 1 — Desafios'},
  {component: Scene02, duration: DUR.scene02, name: 'Cena 2 — Marca + Dashboard'},
  {component: Scene03, duration: DUR.scene03, name: 'Cena 3 — Ingredientes'},
  {component: Scene04, duration: DUR.scene04, name: 'Cena 4 — Fontes'},
  {component: Scene05, duration: DUR.scene05, name: 'Cena 5 — Indicadores'},
  {component: Scene06, duration: DUR.scene06, name: 'Cena 6 — Correção automática'},
  {component: Scene07, duration: DUR.scene07, name: 'Cena 7 — Neutros'},
  {
    component: SceneNutritionalTable,
    duration: DUR.sceneNutritionalTable,
    name: 'Cena extra — Tabela nutricional',
  },
  {component: Scene08, duration: DUR.scene08, name: 'Cena 8 — Fluxo de documentos'},
  {
    component: SceneReverseEngineering,
    duration: DUR.sceneReverseEngineering,
    name: 'Cena extra — Engenharia reversa',
  },
  {component: Scene09, duration: DUR.scene09, name: 'Cena 9 — Compras'},
  {component: Scene10, duration: DUR.scene10, name: 'Cena 10 — Montagem'},
  {component: Scene11, duration: DUR.scene11, name: 'Cena 11 — CTA'},
];

/**
 * Composição principal: concatena as 13 cenas na timeline
 * (total 7350 frames = 4:05 a 30fps).
 */
export const Main: React.FC = () => {
  let from = 0;

  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      {SCENES.map(({component: SceneComponent, duration, name}) => {
        const sequence = (
          <Sequence key={name} from={from} durationInFrames={duration} name={name}>
            <SceneComponent />
          </Sequence>
        );
        from += duration;
        return sequence;
      })}
    </AbsoluteFill>
  );
};
