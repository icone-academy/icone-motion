import React from 'react';
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {colors} from '../theme';

/**
 * Reveal do logotipo Ícone: halo suave + scale spring.
 * variant "light" = traço escuro (fundos claros/cream);
 * variant "dark" = traço claro (fundos taupe/escuros).
 */
export const LogoReveal: React.FC<{
  delay?: number;
  size?: number;
  variant?: 'light' | 'dark';
  glow?: boolean;
}> = ({delay = 0, size = 220, variant = 'light', glow = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: {damping: 14, stiffness: 110, mass: 0.9},
  });

  const opacity = interpolate(frame - delay, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const haloOpacity =
    glow &&
    interpolate(frame - delay, [6, 30, 60], [0, 0.55, 0.3], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const src = staticFile(
    variant === 'light'
      ? 'brand/logo-light-transparent.png'
      : 'brand/logo-dark-transparent.png',
  );

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {glow ? (
        <div
          style={{
            position: 'absolute',
            inset: -size * 0.35,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${
              variant === 'light' ? colors.primarySoft : 'rgba(255,255,255,0.22)'
            } 0%, transparent 70%)`,
            opacity: haloOpacity || 0,
          }}
        />
      ) : null}
      <Img
        src={src}
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          opacity,
          transform: `scale(${0.7 + scale * 0.3})`,
        }}
      />
    </div>
  );
};
