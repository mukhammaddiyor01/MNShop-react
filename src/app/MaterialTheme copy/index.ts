import { createTheme } from '@mui/material/styles';
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

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#0a0a0a', paper: '#111111' },
    text: { primary: '#f8fafc', secondary: 'rgba(248, 250, 252, 0.6)' },
    primary: { main: shared.brand.blue },
  },
  typography: { fontFamily: typography.fontFamily.sans },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f7f6f2', paper: '#ffffff' },
    text: { primary: '#141414', secondary: 'rgba(20, 20, 20, 0.6)' },
    primary: { main: shared.brand.blue },
  },
  typography: { fontFamily: typography.fontFamily.sans },
});

export type MnshopTheme = typeof darkTheme | typeof lightTheme;
export type ThemeMode = 'dark' | 'light';

export { shadow, typography };

/** Returns tokens for the same data-theme modes used by SitePreferencesProvider. */
export function getTheme(mode: ThemeMode = 'dark'): MnshopTheme {
  return mode === 'light' ? lightTheme : darkTheme;
}

export default darkTheme;
