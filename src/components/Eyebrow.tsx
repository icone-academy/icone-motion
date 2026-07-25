import React from 'react';
import {colors, tracking} from '../theme';
import {fontDisplay} from '../fonts';
import {FadeIn} from './FadeIn';

/** Eyebrow Oswald uppercase com tracking industrial (padrão do app). */
export const Eyebrow: React.FC<{
  children: React.ReactNode;
  delay?: number;
  color?: string;
  fontSize?: number;
}> = ({children, delay = 0, color = colors.primary, fontSize = 26}) => {
  return (
    <FadeIn delay={delay} distance={16}>
      <div
        style={{
          fontFamily: fontDisplay,
          fontWeight: 600,
          fontSize,
          letterSpacing: tracking.industrial,
          textTransform: 'uppercase',
          color,
        }}
      >
        {children}
      </div>
    </FadeIn>
  );
};
