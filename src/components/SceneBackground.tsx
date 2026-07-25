import React from 'react';
import {AbsoluteFill} from 'remotion';
import {colors} from '../theme';

/**
 * Fundo cream quente com radiais suaves, replicando o degradê
 * da página do app (globals.css).
 */
export const SceneBackground: React.FC<{
  children?: React.ReactNode;
  tone?: 'cream' | 'taupe';
}> = ({children, tone = 'cream'}) => {
  const background =
    tone === 'taupe'
      ? `radial-gradient(1200px 800px at 20% 10%, rgba(255,255,255,0.06), transparent 60%),
         radial-gradient(1000px 700px at 85% 90%, rgba(0,0,0,0.10), transparent 55%),
         linear-gradient(150deg, #7A6A5A 0%, #6B5C4E 100%)`
      : `radial-gradient(1200px 800px at 15% 8%, rgba(239,232,223,0.9), transparent 55%),
         radial-gradient(1000px 700px at 88% 92%, rgba(238,232,223,0.8), transparent 50%),
         radial-gradient(800px 600px at 70% 20%, rgba(255,255,255,0.7), transparent 60%),
         linear-gradient(160deg, ${colors.background} 0%, #F4F0E9 100%)`;

  return <AbsoluteFill style={{background}}>{children}</AbsoluteFill>;
};
