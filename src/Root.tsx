import React from 'react';
import {Composition} from 'remotion';
import {
  DUR,
  FPS,
  HEIGHT,
  WIDTH,
  getDur,
  getTotalDuration,
} from './timeline';
import {Main, MainIT} from './Main';
import {LocaleProvider} from './i18n/LocaleContext';
import {TimelineProvider} from './i18n/TimelineContext';
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
import {
  TEASER_DURATION,
  TEASER_FPS,
  TEASER_HEIGHT,
  TEASER_WIDTH,
  TeaserVertical15s,
} from './scenes/TeaserVertical15s';

const base = {
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
} as const;

const teaserBase = {
  fps: TEASER_FPS,
  width: TEASER_WIDTH,
  height: TEASER_HEIGHT,
} as const;

const TOTAL_PT = getTotalDuration('pt');
const TOTAL_IT = getTotalDuration('it');
const DUR_IT = getDur('it');

/** Wrapper para preview isolado de cena no locale desejado. */
const withLocale = (
  locale: 'pt' | 'it',
  Scene: React.FC,
): React.FC => {
  const Wrapped: React.FC = () => (
    <LocaleProvider locale={locale}>
      <TimelineProvider locale={locale}>
        <Scene />
      </TimelineProvider>
    </LocaleProvider>
  );
  Wrapped.displayName = `WithLocale(${locale})`;
  return Wrapped;
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Main"
        component={Main}
        durationInFrames={TOTAL_PT}
        {...base}
      />
      <Composition
        id="MainIT"
        component={MainIT}
        durationInFrames={TOTAL_IT}
        {...base}
      />

      {/* Cenas individuais PT */}
      <Composition id="Scene01" component={withLocale('pt', Scene01)} durationInFrames={DUR.scene01} {...base} />
      <Composition id="Scene02" component={withLocale('pt', Scene02)} durationInFrames={DUR.scene02} {...base} />
      <Composition id="Scene03" component={withLocale('pt', Scene03)} durationInFrames={DUR.scene03} {...base} />
      <Composition id="Scene04" component={withLocale('pt', Scene04)} durationInFrames={DUR.scene04} {...base} />
      <Composition id="Scene05" component={withLocale('pt', Scene05)} durationInFrames={DUR.scene05} {...base} />
      <Composition id="Scene06" component={withLocale('pt', Scene06)} durationInFrames={DUR.scene06} {...base} />
      <Composition id="Scene07" component={withLocale('pt', Scene07)} durationInFrames={DUR.scene07} {...base} />
      <Composition
        id="SceneNutritionalTable"
        component={withLocale('pt', SceneNutritionalTable)}
        durationInFrames={DUR.sceneNutritionalTable}
        {...base}
      />
      <Composition id="Scene08" component={withLocale('pt', Scene08)} durationInFrames={DUR.scene08} {...base} />
      <Composition
        id="SceneReverseEngineering"
        component={withLocale('pt', SceneReverseEngineering)}
        durationInFrames={DUR.sceneReverseEngineering}
        {...base}
      />
      <Composition id="Scene09" component={withLocale('pt', Scene09)} durationInFrames={DUR.scene09} {...base} />
      <Composition id="Scene10" component={withLocale('pt', Scene10)} durationInFrames={DUR.scene10} {...base} />
      <Composition id="Scene11" component={withLocale('pt', Scene11)} durationInFrames={DUR.scene11} {...base} />

      {/* Preview IT das cenas-chave */}
      <Composition id="Scene05IT" component={withLocale('it', Scene05)} durationInFrames={DUR_IT.scene05} {...base} />
      <Composition id="Scene11IT" component={withLocale('it', Scene11)} durationInFrames={DUR_IT.scene11} {...base} />

      {/* Teaser vertical Instagram Reels/Stories */}
      <Composition
        id="TeaserVertical15s"
        component={TeaserVertical15s}
        durationInFrames={TEASER_DURATION}
        {...teaserBase}
      />
    </>
  );
};
