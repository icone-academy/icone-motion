/**
 * Design tokens extraídos do design system real da Ícone Academy
 * (src/shared/design-system/tokens/brand-tokens.json + semantic.css)
 */

export const colors = {
  // Brand
  primary: '#7A6A5A',
  primaryHover: '#6B5C4E',
  primarySoft: '#EFE8DF',
  primaryMuted: '#A3907D',

  // Superfícies
  background: '#F8F6F2',
  surface: '#FFFFFF',
  surfaceMuted: '#FBFAF7',
  border: '#DDD6CC',
  borderSoft: '#EEE8DF',

  // Texto (marrom quente taupe — não cinza frio)
  textPrimary: '#3F3028',
  textSecondary: '#344054',
  textMuted: '#667085',
  textInverse: '#FFFFFF',

  // Semânticas
  success: '#2F855A',
  successSoft: '#E8F5EE',
  warning: '#B7791F',
  warningSoft: '#FBF3E0',
  danger: '#C2410C',
  dangerSoft: '#FCEEE8',
  info: '#2563EB',
  infoSoft: '#EFF6FF',

  // Zonas dos gauges (gaugeConfig.ts)
  gaugeRed: '#DC2626',
  gaugeOrange: '#F97316',
  gaugeYellow: '#EAB308',
  gaugeGreen: '#10B981',
  gaugeBlue: '#3B82F6',
  gaugeSlate: '#64748B',

  // Accents de métricas de ingredientes
  fatAmber: '#D97706',
  fatAmberBar: '#FBBF24',
  sugarPink: '#DB2777',
  sugarPinkBar: '#F472B6',
  pacViolet: '#7C3AED',
  pacVioletSoft: 'rgba(139, 92, 246, 0.1)',
} as const;

/**
 * Nota: não usar raios gigantes (999px) para formato "pill" —
 * versões recentes do Chrome achatam o shape em elipse quando o
 * raio excede as dimensões do elemento. Usar metade da altura real.
 */
export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  shell: 24,
} as const;

/** Sombras com tint marrom quente rgb(63,48,40) — nunca cinza frio */
export const shadows = {
  xs: '0 1px 2px 0 rgba(63, 48, 40, 0.04)',
  sm: '0 1px 2px 0 rgba(63, 48, 40, 0.06)',
  md: '0 8px 24px 0 rgba(63, 48, 40, 0.08)',
  shell: '0 20px 60px 0 rgba(63, 48, 40, 0.12)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const tracking = {
  industrial: '0.15em',
  wide: '0.05em',
  widest: '0.25em',
} as const;
