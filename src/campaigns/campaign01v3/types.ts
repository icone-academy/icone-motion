export const CAMPAIGN_01_V3_FPS = 30;
// 923 frames preserve the complete 30.746 s voice-over, including the spoken URL.
export const CAMPAIGN_01_V3_DURATION = 923;

export type Campaign01V3Format = 'vertical' | 'square' | 'horizontal';

export type Campaign01V3Props = {
  format: Campaign01V3Format;
  voiceoverFile?: string | null;
  musicFile?: string | null;
};

export const CAMPAIGN_01_V3_BEATS = {
  // Cuts follow the natural sentence pauses in the approved voice-over.
  hero: {from: 0, duration: 152},
  promise: {from: 152, duration: 201},
  journey: {from: 353, duration: 113},
  breadth: {from: 466, duration: 205},
  cta: {from: 671, duration: 252},
} as const;
