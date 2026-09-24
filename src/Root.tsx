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
import {
  CAMPAIGN_01_DURATION,
  CAMPAIGN_01_FPS,
  Campaign01FormulaNoOlho,
} from './campaigns/Campaign01FormulaNoOlho';
import {
  CAMPAIGN_01_PRODUCT_FIRST_DURATION,
  CAMPAIGN_01_PRODUCT_FIRST_FPS,
  Campaign01ProductFirst,
} from './campaigns/Campaign01ProductFirst';
import {Campaign01ResultadoPrimeiro} from './campaigns/campaign01v3/Campaign01ResultadoPrimeiro';
import {
  CAMPAIGN_01_V3_DURATION,
  CAMPAIGN_01_V3_FPS,
} from './campaigns/campaign01v3/types';
import {
  CAMPAIGN_02_DURATION,
  CAMPAIGN_02_FPS,
  Campaign02SuaReceitaMelhor,
} from './campaigns/Campaign02SuaReceitaMelhor';
import {
  CAMPAIGN_03_DURATION,
  CAMPAIGN_03_FPS,
  Campaign03ErroCustaCaro,
} from './campaigns/Campaign03ErroCustaCaro';
import {
  CAMPAIGN_04_DURATION,
  CAMPAIGN_04_FPS,
  Campaign04DaIdeiaAoRotulo,
} from './campaigns/Campaign04DaIdeiaAoRotulo';
import {Campaign05FeitaParaSeuTrabalho} from './campaigns/campaign05/Campaign05FeitaParaSeuTrabalho';
import {
  CAMPAIGN_05_CUT_DURATION,
  CAMPAIGN_05_FPS,
  CAMPAIGN_05_MASTER_DURATION,
} from './campaigns/campaign05/types';

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

      {/* Campanha pós-lançamento — Filme 01: “Ainda formula no olho?” */}
      <Composition
        id="Campaign01Vertical15s"
        component={Campaign01FormulaNoOlho}
        durationInFrames={CAMPAIGN_01_DURATION}
        fps={CAMPAIGN_01_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical'}}
      />
      <Composition
        id="Campaign01Square15s"
        component={Campaign01FormulaNoOlho}
        durationInFrames={CAMPAIGN_01_DURATION}
        fps={CAMPAIGN_01_FPS}
        width={1080}
        height={1080}
        defaultProps={{format: 'square'}}
      />
      <Composition
        id="Campaign01Horizontal15s"
        component={Campaign01FormulaNoOlho}
        durationInFrames={CAMPAIGN_01_DURATION}
        fps={CAMPAIGN_01_FPS}
        width={1920}
        height={1080}
        defaultProps={{format: 'horizontal'}}
      />

      {/* Campanha 01 V2 — produto primeiro para tráfego frio */}
      <Composition
        id="Campaign01ProductFirstVertical15s"
        component={Campaign01ProductFirst}
        durationInFrames={CAMPAIGN_01_PRODUCT_FIRST_DURATION}
        fps={CAMPAIGN_01_PRODUCT_FIRST_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical', voiceoverFile: null, withSfx: false}}
      />
      <Composition
        id="Campaign01ProductFirstSquare15s"
        component={Campaign01ProductFirst}
        durationInFrames={CAMPAIGN_01_PRODUCT_FIRST_DURATION}
        fps={CAMPAIGN_01_PRODUCT_FIRST_FPS}
        width={1080}
        height={1080}
        defaultProps={{format: 'square', voiceoverFile: null, withSfx: false}}
      />
      <Composition
        id="Campaign01ProductFirstHorizontal15s"
        component={Campaign01ProductFirst}
        durationInFrames={CAMPAIGN_01_PRODUCT_FIRST_DURATION}
        fps={CAMPAIGN_01_PRODUCT_FIRST_FPS}
        width={1920}
        height={1080}
        defaultProps={{format: 'horizontal', voiceoverFile: null, withSfx: false}}
      />

      {/* Campanha 01 V3 — resultado primeiro, sem efeitos sonoros */}
      <Composition
        id="Campaign01ResultFirstVertical30s"
        component={Campaign01ResultadoPrimeiro}
        durationInFrames={CAMPAIGN_01_V3_DURATION}
        fps={CAMPAIGN_01_V3_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical', voiceoverFile: 'audio/campaign-01-v3-voiceover-ptbr.wav', musicFile: null}}
      />
      <Composition
        id="Campaign01ResultFirstSquare30s"
        component={Campaign01ResultadoPrimeiro}
        durationInFrames={CAMPAIGN_01_V3_DURATION}
        fps={CAMPAIGN_01_V3_FPS}
        width={1080}
        height={1080}
        defaultProps={{format: 'square', voiceoverFile: 'audio/campaign-01-v3-voiceover-ptbr.wav', musicFile: null}}
      />
      <Composition
        id="Campaign01ResultFirstHorizontal30s"
        component={Campaign01ResultadoPrimeiro}
        durationInFrames={CAMPAIGN_01_V3_DURATION}
        fps={CAMPAIGN_01_V3_FPS}
        width={1920}
        height={1080}
        defaultProps={{format: 'horizontal', voiceoverFile: 'audio/campaign-01-v3-voiceover-ptbr.wav', musicFile: null}}
      />

      {/* Campanha pós-lançamento — Filme 02: “Sua receita pode ser melhor” */}
      <Composition
        id="Campaign02Vertical20s"
        component={Campaign02SuaReceitaMelhor}
        durationInFrames={CAMPAIGN_02_DURATION}
        fps={CAMPAIGN_02_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical'}}
      />
      <Composition
        id="Campaign02Square20s"
        component={Campaign02SuaReceitaMelhor}
        durationInFrames={CAMPAIGN_02_DURATION}
        fps={CAMPAIGN_02_FPS}
        width={1080}
        height={1080}
        defaultProps={{format: 'square'}}
      />
      <Composition
        id="Campaign02Horizontal20s"
        component={Campaign02SuaReceitaMelhor}
        durationInFrames={CAMPAIGN_02_DURATION}
        fps={CAMPAIGN_02_FPS}
        width={1920}
        height={1080}
        defaultProps={{format: 'horizontal'}}
      />

      {/* Campanha pós-lançamento — Filme 03: “O erro que custa caro” */}
      <Composition
        id="Campaign03Vertical24s"
        component={Campaign03ErroCustaCaro}
        durationInFrames={CAMPAIGN_03_DURATION}
        fps={CAMPAIGN_03_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical'}}
      />
      <Composition
        id="Campaign03Square24s"
        component={Campaign03ErroCustaCaro}
        durationInFrames={CAMPAIGN_03_DURATION}
        fps={CAMPAIGN_03_FPS}
        width={1080}
        height={1080}
        defaultProps={{format: 'square'}}
      />
      <Composition
        id="Campaign03Horizontal24s"
        component={Campaign03ErroCustaCaro}
        durationInFrames={CAMPAIGN_03_DURATION}
        fps={CAMPAIGN_03_FPS}
        width={1920}
        height={1080}
        defaultProps={{format: 'horizontal'}}
      />

      {/* Campanha pós-lançamento — Filme 04: “Da ideia ao rótulo” */}
      <Composition
        id="Campaign04Vertical30s"
        component={Campaign04DaIdeiaAoRotulo}
        durationInFrames={CAMPAIGN_04_DURATION}
        fps={CAMPAIGN_04_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical'}}
      />
      <Composition
        id="Campaign04Square30s"
        component={Campaign04DaIdeiaAoRotulo}
        durationInFrames={CAMPAIGN_04_DURATION}
        fps={CAMPAIGN_04_FPS}
        width={1080}
        height={1080}
        defaultProps={{format: 'square'}}
      />
      <Composition
        id="Campaign04Horizontal30s"
        component={Campaign04DaIdeiaAoRotulo}
        durationInFrames={CAMPAIGN_04_DURATION}
        fps={CAMPAIGN_04_FPS}
        width={1920}
        height={1080}
        defaultProps={{format: 'horizontal'}}
      />

      {/* Campanha 05 — “Feita para o seu trabalho” · filme principal */}
      <Composition
        id="Campaign05MasterHorizontal75s"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_MASTER_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1920}
        height={1080}
        defaultProps={{format: 'horizontal', audience: 'master', hookVariant: 'a', withCaptions: true, voiceoverFile: 'audio/campaign-05-master-vo.mp3'}}
      />
      <Composition
        id="Campaign05MasterVertical75s"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_MASTER_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical', audience: 'master', hookVariant: 'a', withCaptions: true, voiceoverFile: 'audio/campaign-05-master-vo.mp3'}}
      />
      <Composition
        id="Campaign05MasterSquare75s"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_MASTER_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1080}
        height={1080}
        defaultProps={{format: 'square', audience: 'master', hookVariant: 'a', withCaptions: true, voiceoverFile: 'audio/campaign-05-master-vo.mp3'}}
      />

      {/* Campanha 05 — cortes de gelateria/sorveteria */}
      <Composition
        id="Campaign05GelateriaHorizontal24s"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_CUT_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1920}
        height={1080}
        defaultProps={{format: 'horizontal', audience: 'gelateria', hookVariant: 'a', withCaptions: true, voiceoverFile: 'audio/campaign-05-gelateria-a-vo.mp3'}}
      />
      <Composition
        id="Campaign05GelateriaVertical24s"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_CUT_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical', audience: 'gelateria', hookVariant: 'a', withCaptions: true, voiceoverFile: 'audio/campaign-05-gelateria-a-vo.mp3'}}
      />
      <Composition
        id="Campaign05GelateriaVertical24sHookB"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_CUT_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical', audience: 'gelateria', hookVariant: 'b', withCaptions: true, voiceoverFile: 'audio/campaign-05-gelateria-b-vo.mp3'}}
      />
      <Composition
        id="Campaign05GelateriaSquare24s"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_CUT_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1080}
        height={1080}
        defaultProps={{format: 'square', audience: 'gelateria', hookVariant: 'a', withCaptions: true, voiceoverFile: 'audio/campaign-05-gelateria-a-vo.mp3'}}
      />

      {/* Campanha 05 — cortes de especialista técnico */}
      <Composition
        id="Campaign05EspecialistaHorizontal24s"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_CUT_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1920}
        height={1080}
        defaultProps={{format: 'horizontal', audience: 'especialista', hookVariant: 'a', withCaptions: true, voiceoverFile: 'audio/campaign-05-especialista-a-vo.mp3'}}
      />
      <Composition
        id="Campaign05EspecialistaVertical24s"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_CUT_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical', audience: 'especialista', hookVariant: 'a', withCaptions: true, voiceoverFile: 'audio/campaign-05-especialista-a-vo.mp3'}}
      />
      <Composition
        id="Campaign05EspecialistaVertical24sHookB"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_CUT_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical', audience: 'especialista', hookVariant: 'b', withCaptions: true, voiceoverFile: 'audio/campaign-05-especialista-b-vo.mp3'}}
      />
      <Composition
        id="Campaign05EspecialistaSquare24s"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_CUT_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1080}
        height={1080}
        defaultProps={{format: 'square', audience: 'especialista', hookVariant: 'a', withCaptions: true, voiceoverFile: 'audio/campaign-05-especialista-a-vo.mp3'}}
      />

      {/* Campanha 05 — cortes de indústria */}
      <Composition
        id="Campaign05IndustriaHorizontal24s"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_CUT_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1920}
        height={1080}
        defaultProps={{format: 'horizontal', audience: 'industria', hookVariant: 'a', withCaptions: true, voiceoverFile: 'audio/campaign-05-industria-a-vo.mp3'}}
      />
      <Composition
        id="Campaign05IndustriaVertical24s"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_CUT_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical', audience: 'industria', hookVariant: 'a', withCaptions: true, voiceoverFile: 'audio/campaign-05-industria-a-vo.mp3'}}
      />
      <Composition
        id="Campaign05IndustriaVertical24sHookB"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_CUT_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1080}
        height={1920}
        defaultProps={{format: 'vertical', audience: 'industria', hookVariant: 'b', withCaptions: true, voiceoverFile: 'audio/campaign-05-industria-b-vo.mp3'}}
      />
      <Composition
        id="Campaign05IndustriaSquare24s"
        component={Campaign05FeitaParaSeuTrabalho}
        durationInFrames={CAMPAIGN_05_CUT_DURATION}
        fps={CAMPAIGN_05_FPS}
        width={1080}
        height={1080}
        defaultProps={{format: 'square', audience: 'industria', hookVariant: 'a', withCaptions: true, voiceoverFile: 'audio/campaign-05-industria-a-vo.mp3'}}
      />
    </>
  );
};
