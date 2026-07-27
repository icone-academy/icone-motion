import React from 'react';
import {colors, type} from '../theme';
import {fontBody} from '../fonts';

/** Badge pill de status (Perfect/Technical/Out, Validado, etc.). */
export const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  border?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  bg = colors.primarySoft,
  color = colors.primary,
  border,
  fontSize = type.pill,
  style,
}) => {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: bg,
        color,
        border: border ? `1.5px solid ${border}` : undefined,
        // ~metade da altura (fontSize*1.2 + padding); raio seguro p/ pill
        borderRadius: Math.round(fontSize),
        padding: '8px 22px',
        fontFamily: fontBody,
        fontWeight: 600,
        fontSize,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
