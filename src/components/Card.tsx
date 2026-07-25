import React from 'react';
import {colors, radius, shadows} from '../theme';

/** Card branco com borda e sombra warm-brown, padrão do produto. */
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  radiusSize?: number;
}> = ({children, style, radiusSize = radius.md}) => {
  return (
    <div
      style={{
        backgroundColor: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: radiusSize,
        boxShadow: shadows.md,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
