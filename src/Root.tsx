import React from 'react';
import {Composition} from 'remotion';
import {DUR, FPS, HEIGHT, TOTAL_DURATION, WIDTH} from './timeline';
import {Main} from './Main';
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

const base = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
} as const;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Vídeo completo (4:15 — sync VO) */}
      <Composition
        id="Main"
        component={Main}
        durationInFrames={TOTAL_DURATION}
        {...base}
      />

      {/* Cenas individuais (para exportação separada) */}
      <Composition id="Scene01" component={Scene01} durationInFrames={DUR.scene01} {...base} />
      <Composition id="Scene02" component={Scene02} durationInFrames={DUR.scene02} {...base} />
      <Composition id="Scene03" component={Scene03} durationInFrames={DUR.scene03} {...base} />
      <Composition id="Scene04" component={Scene04} durationInFrames={DUR.scene04} {...base} />
      <Composition id="Scene05" component={Scene05} durationInFrames={DUR.scene05} {...base} />
      <Composition id="Scene06" component={Scene06} durationInFrames={DUR.scene06} {...base} />
      <Composition id="Scene07" component={Scene07} durationInFrames={DUR.scene07} {...base} />
      <Composition
        id="SceneNutritionalTable"
        component={SceneNutritionalTable}
        durationInFrames={DUR.sceneNutritionalTable}
        {...base}
      />
      <Composition id="Scene08" component={Scene08} durationInFrames={DUR.scene08} {...base} />
      <Composition
        id="SceneReverseEngineering"
        component={SceneReverseEngineering}
        durationInFrames={DUR.sceneReverseEngineering}
        {...base}
      />
      <Composition id="Scene09" component={Scene09} durationInFrames={DUR.scene09} {...base} />
      <Composition id="Scene10" component={Scene10} durationInFrames={DUR.scene10} {...base} />
      <Composition id="Scene11" component={Scene11} durationInFrames={DUR.scene11} {...base} />
    </>
  );
};
