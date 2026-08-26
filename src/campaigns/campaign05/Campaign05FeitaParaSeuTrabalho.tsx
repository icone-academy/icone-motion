import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {AUDIENCE_COPY, MASTER_CAPTIONS} from './copy';
import {
  Campaign05CtaScene,
  CutHookScene,
  CutPayoffScene,
  CutProblemScene,
  CutProofScene,
  MasterDecisionScene,
  MasterDocumentsScene,
  MasterFragmentationScene,
  MasterIdentityScene,
  MasterOutcomesScene,
  MasterPromiseScene,
  MasterTechnicalBaseScene,
} from './scenes';
import {getCutBeats, MASTER_BEATS} from './timeline';
import type {Campaign05Audience, Campaign05Props} from './types';
import {Campaign05Audio, Campaign05CaptionTrack, campaign05Palette} from './ui';

const isAudienceCut = (
  audience: Campaign05Audience,
): audience is Exclude<Campaign05Audience, 'master'> => audience !== 'master';

const MasterCampaign: React.FC<Campaign05Props> = ({
  format,
  audience,
  withCaptions = true,
  voiceoverFile,
  musicFile,
  muted,
}) => (
  <AbsoluteFill style={{backgroundColor: campaign05Palette.ink}}>
    <Sequence from={MASTER_BEATS.identity.from} durationInFrames={MASTER_BEATS.identity.duration}>
      <MasterIdentityScene format={format} />
    </Sequence>
    <Sequence from={MASTER_BEATS.fragmentation.from} durationInFrames={MASTER_BEATS.fragmentation.duration}>
      <MasterFragmentationScene format={format} />
    </Sequence>
    <Sequence from={MASTER_BEATS.promise.from} durationInFrames={MASTER_BEATS.promise.duration}>
      <MasterPromiseScene format={format} />
    </Sequence>
    <Sequence from={MASTER_BEATS.technicalBase.from} durationInFrames={MASTER_BEATS.technicalBase.duration}>
      <MasterTechnicalBaseScene format={format} />
    </Sequence>
    <Sequence from={MASTER_BEATS.decision.from} durationInFrames={MASTER_BEATS.decision.duration}>
      <MasterDecisionScene format={format} />
    </Sequence>
    <Sequence from={MASTER_BEATS.documents.from} durationInFrames={MASTER_BEATS.documents.duration}>
      <MasterDocumentsScene format={format} />
    </Sequence>
    <Sequence from={MASTER_BEATS.outcomes.from} durationInFrames={MASTER_BEATS.outcomes.duration}>
      <MasterOutcomesScene format={format} />
    </Sequence>
    <Sequence from={MASTER_BEATS.cta.from} durationInFrames={MASTER_BEATS.cta.duration}>
      <Campaign05CtaScene format={format} duration={MASTER_BEATS.cta.duration} />
    </Sequence>

    {withCaptions ? <Campaign05CaptionTrack cues={MASTER_CAPTIONS} format={format} /> : null}
    <Campaign05Audio voiceoverFile={voiceoverFile} musicFile={musicFile} muted={muted} />
  </AbsoluteFill>
);

const AudienceCutCampaign: React.FC<Campaign05Props & {audience: Exclude<Campaign05Audience, 'master'>}> = ({
  format,
  audience,
  hookVariant,
  withCaptions = true,
  voiceoverFile,
  musicFile,
  muted,
}) => {
  const beats = getCutBeats(audience, hookVariant);

  return (
  <AbsoluteFill style={{backgroundColor: campaign05Palette.ink}}>
    <Sequence from={beats.hook.from} durationInFrames={beats.hook.duration}>
      <CutHookScene format={format} audience={audience} hookVariant={hookVariant} duration={beats.hook.duration} />
    </Sequence>
    <Sequence from={beats.problem.from} durationInFrames={beats.problem.duration}>
      <CutProblemScene format={format} audience={audience} duration={beats.problem.duration} />
    </Sequence>
    <Sequence from={beats.proof.from} durationInFrames={beats.proof.duration}>
      <CutProofScene format={format} audience={audience} duration={beats.proof.duration} />
    </Sequence>
    <Sequence from={beats.payoff.from} durationInFrames={beats.payoff.duration}>
      <CutPayoffScene format={format} audience={audience} duration={beats.payoff.duration} />
    </Sequence>
    <Sequence from={beats.cta.from} durationInFrames={beats.cta.duration}>
      <Campaign05CtaScene format={format} duration={beats.cta.duration} compact />
    </Sequence>

    {withCaptions ? (
      <Campaign05CaptionTrack cues={AUDIENCE_COPY[audience].captionCues[hookVariant]} format={format} />
    ) : null}
    <Campaign05Audio voiceoverFile={voiceoverFile} musicFile={musicFile} muted={muted} />
  </AbsoluteFill>
  );
};

export const Campaign05FeitaParaSeuTrabalho: React.FC<Campaign05Props> = (props) => {
  if (isAudienceCut(props.audience)) {
    return <AudienceCutCampaign {...props} audience={props.audience} />;
  }
  return <MasterCampaign {...props} />;
};
