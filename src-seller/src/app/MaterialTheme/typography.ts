/** MNShop typography tokens (aligned with tailwind.config.js). */
const typography = {
  fontFamily: {
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'Poppins, Inter, ui-sans-serif, system-ui, sans-serif',
  },
  fontWeight: { regular: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 },
  h1: { fontFamily: 'Poppins, Inter, ui-sans-serif, system-ui, sans-serif', fontWeight: 900, fontSize: 'clamp(2.25rem, 6vw, 4.5rem)', lineHeight: 1, letterSpacing: '-0.04em' },
  h2: { fontFamily: 'Poppins, Inter, ui-sans-serif, system-ui, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.035em' },
  h3: { fontFamily: 'Poppins, Inter, ui-sans-serif, system-ui, sans-serif', fontWeight: 800, fontSize: 'clamp(1.35rem, 3vw, 2rem)', lineHeight: 1.2, letterSpacing: '-0.025em' },
  h4: { fontWeight: 700, fontSize: '1.25rem', lineHeight: 1.3 },
  h5: { fontWeight: 700, fontSize: '1rem', lineHeight: 1.4 },
  h6: { fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.4 },
  body: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.6 },
  caption: { fontWeight: 500, fontSize: '0.75rem', lineHeight: 1.5 },
  overline: { fontWeight: 800, fontSize: '0.75rem', lineHeight: 1.5, letterSpacing: '0.14em', textTransform: 'uppercase' as const },
} as const;

export type MnshopTypography = typeof typography;
export default typography;
