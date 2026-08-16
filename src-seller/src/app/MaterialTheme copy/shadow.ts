/** Named shadows used by MNShop cards, glass surfaces and blue highlights. */
const shadow = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.18)',
  sm: '0 4px 14px rgba(0, 0, 0, 0.22)',
  md: '0 10px 36px rgba(0, 0, 0, 0.35)',
  lg: '0 22px 60px rgba(0, 0, 0, 0.42)',
  card: '0 16px 44px rgba(0, 0, 0, 0.28)',
  glass: '0 10px 36px var(--glass-shadow)',
  glow: '0 0 40px rgba(59, 130, 246, 0.22)',
  glowStrong: '0 0 56px rgba(59, 130, 246, 0.34)',
} as const;

export type MnshopShadow = typeof shadow;
export default shadow;
