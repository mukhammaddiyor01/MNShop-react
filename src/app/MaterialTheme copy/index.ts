import shadow from './shadow';
import typography from './typography';

const shared = {
  brand: { name: 'MNShop', blue: '#3b82f6', blueHover: '#2563eb', ember: '#f43f5e' },
  radius: { sm: '0.35rem', md: '0.5rem', lg: '1rem', xl: '1.5rem', full: '9999px' },
  container: { maxWidth: '1300px', padding: 'clamp(1rem, 3vw, 2rem)' },
  transition: { fast: '160ms ease', normal: '240ms ease' },
  shadow,
  typography,
} as const;

export const darkTheme = {
  mode: 'dark',
  ...shared,
  colors: {
    background: '#0a0a0a',
    backgroundSecondary: '#111111',
    surface: 'rgba(17, 17, 17, 0.68)',
    text: '#f8fafc',
    textMuted: 'rgba(248, 250, 252, 0.6)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
} as const;

export const lightTheme = {
  mode: 'light',
  ...shared,
  colors: {
    background: '#f7f6f2',
    backgroundSecondary: '#eeece6',
    surface: 'rgba(255, 255, 255, 0.78)',
    text: '#141414',
    textMuted: 'rgba(20, 20, 20, 0.6)',
    border: 'rgba(20, 20, 20, 0.12)',
  },
} as const;

export type MnshopTheme = typeof darkTheme | typeof lightTheme;
export type ThemeMode = MnshopTheme['mode'];

export { shadow, typography };

/** Returns tokens for the same data-theme modes used by SitePreferencesProvider. */
export function getTheme(mode: ThemeMode = 'dark'): MnshopTheme {
  return mode === 'light' ? lightTheme : darkTheme;
}

export default darkTheme;
