import React, {createContext, useContext, useMemo} from 'react';
import type {Locale} from './types';
import {
  DUR,
  VO_CUTS,
  getAudioFile,
  getDur,
  getTotalDuration,
  getVoCuts,
  scaleVoTime,
  type DurMap,
} from '../timeline';

type TimelineContextValue = {
  locale: Locale;
  voCuts: typeof VO_CUTS;
  dur: DurMap;
  totalDuration: number;
  audioFile: string;
  /** Converte segundo do roteiro PT → segundo do locale */
  t: (secondsPt: number) => number;
};

const TimelineContext = createContext<TimelineContextValue>({
  locale: 'pt',
  voCuts: VO_CUTS,
  dur: DUR,
  totalDuration: getTotalDuration('pt'),
  audioFile: getAudioFile('pt'),
  t: (s) => s,
});

export const TimelineProvider: React.FC<{
  locale: Locale;
  children: React.ReactNode;
}> = ({locale, children}) => {
  const value = useMemo(() => {
    const voCuts = getVoCuts(locale);
    return {
      locale,
      voCuts,
      dur: getDur(locale),
      totalDuration: getTotalDuration(locale),
      audioFile: getAudioFile(locale),
      t: (secondsPt: number) => scaleVoTime(locale, secondsPt),
    };
  }, [locale]);

  return (
    <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
  );
};

export const useTimeline = (): TimelineContextValue =>
  useContext(TimelineContext);
