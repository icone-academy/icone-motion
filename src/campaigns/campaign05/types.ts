export const CAMPAIGN_05_FPS = 30;
export const CAMPAIGN_05_MASTER_DURATION = CAMPAIGN_05_FPS * 75;
export const CAMPAIGN_05_CUT_DURATION = CAMPAIGN_05_FPS * 24;

export type Campaign05Format = 'horizontal' | 'vertical' | 'square';
export type Campaign05Audience =
  | 'master'
  | 'gelateria'
  | 'especialista'
  | 'industria';
export type Campaign05HookVariant = 'a' | 'b';

export type Campaign05Props = {
  format: Campaign05Format;
  audience: Campaign05Audience;
  hookVariant: Campaign05HookVariant;
  /** Legendas editoriais incorporadas ao master. */
  withCaptions?: boolean;
  /** Arquivo opcional dentro de public/ (ex.: audio/campaign-05-master-vo.mp3). */
  voiceoverFile?: string;
  /** Trilha licenciada opcional dentro de public/. */
  musicFile?: string;
  /** Desliga a locução e a trilha. A campanha não inclui efeitos sonoros. */
  muted?: boolean;
};

export type Campaign05CaptionCue = {
  from: number;
  to: number;
  text: string;
  emphasis?: string;
};

export type Campaign05AudienceCopy = {
  eyebrow: string;
  hook: Record<Campaign05HookVariant, string>;
  hookAccent: Record<Campaign05HookVariant, string>;
  problem: string;
  proof: string;
  payoff: string;
  visual: {
    hook: Record<Campaign05HookVariant, string>;
    signals: readonly [string, string];
    problem: string;
    proof: string;
    payoff: string;
    payoffDetail: string;
  };
  captionCues: Record<Campaign05HookVariant, Campaign05CaptionCue[]>;
};
