import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {T, getDur} from './timeline';
import {colors} from './theme';
import type {Locale} from './i18n/types';
import {LocaleProvider} from './i18n/LocaleContext';
import {TimelineProvider, useTimeline} from './i18n/TimelineContext';
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

const SCENE_COMPONENTS = [
  {component: Scene01, key: 'scene01' as const, namePt: 'Cena 1 — Desafios', nameIt: 'Scena 1 — Sfide'},
  {
    component: Scene02,
    key: 'scene02' as const,
    namePt: 'Cena 2 — Marca + Dashboard',
    nameIt: 'Scena 2 — Brand + Dashboard',
    extend: CROSSFADE_02_03,
  },
  {component: Scene03, key: 'scene03' as const, namePt: 'Cena 3 — Ingredientes', nameIt: 'Scena 3 — Ingredienti'},
  {component: Scene04, key: 'scene04' as const, namePt: 'Cena 4 — Fontes', nameIt: 'Scena 4 — Fonti'},
  {component: Scene05, key: 'scene05' as const, namePt: 'Cena 5 — Receita', nameIt: 'Scena 5 — Ricetta'},
  {component: Scene06, key: 'scene06' as const, namePt: 'Cena 6 — Correção automática', nameIt: 'Scena 6 — Correzione automatica'},
  {component: Scene07, key: 'scene07' as const, namePt: 'Cena 7 — Neutros', nameIt: 'Scena 7 — Neutri'},
  {
    component: SceneReverseEngineering,
    key: 'sceneReverseEngineering' as const,
    namePt: 'Cena — Engenharia reversa',
    nameIt: 'Scena — Reverse engineering',
  },
  {component: Scene09, key: 'scene09' as const, namePt: 'Cena 9 — Compras', nameIt: 'Scena 9 — Acquisti'},
  {component: Scene10, key: 'scene10' as const, namePt: 'Cena 10 — Montagem', nameIt: 'Scena 10 — Montaggio'},
  {component: Scene11, key: 'scene11' as const, namePt: 'Cena 11 — CTA lançamento', nameIt: 'Scena 11 — CTA lancio'},
];

const MainInner: React.FC<{locale: Locale}> = ({locale}) => {
  const {audioFile, dur} = useTimeline();
  let from = 0;

  return (
    <AbsoluteFill style={{backgroundColor: colors.background}}>
      <Audio src={staticFile(audioFile)} />
      {SCENE_COMPONENTS.map(({component: SceneComponent, key, namePt, nameIt, extend = 0}) => {
        const duration = dur[key];
        const sequence = (
          <Sequence
            key={`${locale}-${key}`}
            from={from}
            durationInFrames={duration + extend}
            name={locale === 'it' ? nameIt : namePt}
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

const MainShell: React.FC<{locale: Locale}> = ({locale}) => (
  <LocaleProvider locale={locale}>
    <TimelineProvider locale={locale}>
      <MainInner locale={locale} />
    </TimelineProvider>
  </LocaleProvider>
);

/** Composição principal PT (~4:02.7 a 60fps). */
export const Main: React.FC = () => <MainShell locale="pt" />;

/** Composição principal IT (~4:11 a 60fps) — VO italiano + copy IT. */
export const MainIT: React.FC = () => <MainShell locale="it" />;

/** Duração estática para Root (PT). */
export const MAIN_DURATION_PT = getDur('pt');
/** Duração estática para Root (IT). */
export const MAIN_DURATION_IT = getDur('it');
