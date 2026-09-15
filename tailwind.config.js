/** @type {import('tailwindcss').Config} */
const { platformSelect, platformColor, hairlineWidth } = require('nativewind/theme');

module.exports = {
  darkMode: 'class',
  // NativeWind v4: point to all files that use className
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
    './store/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ─── Apple System Backgrounds ──────────────────────────────────────────
        systemBackground: 'var(--system-background)',
        secondarySystemBackground: 'var(--secondary-system-background)',
        tertiarySystemBackground: 'var(--tertiary-system-background)',

        // ─── Apple Inset Grouped Backgrounds (Forms & Settings) ────────────────
        systemGroupedBackground: 'var(--system-grouped-background)',
        secondarySystemGroupedBackground: 'var(--secondary-system-grouped-background)',
        tertiarySystemGroupedBackground: 'var(--tertiary-system-grouped-background)',

        // ─── Apple Label Colors ────────────────────────────────────────────────
        label: 'var(--label)',
        secondaryLabel: 'var(--secondary-label)',
        tertiaryLabel: 'var(--tertiary-label)',
        quaternaryLabel: 'var(--quaternary-label)',

        // ─── Apple System Fills & Separators ───────────────────────────────────
        systemFill: 'var(--system-fill)',
        secondarySystemFill: 'var(--secondary-system-fill)',
        separator: 'var(--separator)',
        opaqueSeparator: 'var(--opaque-separator)',

        // ─── Apple System Tints & Interactive Accents ──────────────────────────
        systemBlue: 'var(--system-blue)',
        systemGreen: 'var(--system-green)',
        systemRed: 'var(--system-red)',
        systemOrange: 'var(--system-orange)',
        systemYellow: 'var(--system-yellow)',
        systemPurple: 'var(--system-purple)',
        systemGray: 'var(--system-gray)',
        systemGray2: 'var(--system-gray2)',
        systemGray3: 'var(--system-gray3)',
        systemGray4: 'var(--system-gray4)',
        systemGray5: 'var(--system-gray5)',
        systemGray6: 'var(--system-gray6)',

        // Legacy / CSS variable bindings for backward compatibility
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        border: 'var(--border)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          50:  '#eef4ff',
          100: '#dae6fe',
          200: '#bcd3fd',
          300: '#90b7fb',
          400: '#5d90f7',
          500: '#3a6ef2',
          600: '#2350e6',
          700: '#1c3fd2',
          800: '#1d35ab',
          900: '#1d3187',
          950: '#152055',
        },
        accent: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6c0c',
        },
        surface: {
          DEFAULT: '#0f1117',
          card:    '#1a1d27',
          border:  '#2a2d3e',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      borderRadius: {
        'ios-cell': '10px',
        'ios-card': '12px',
        'ios-sheet': '16px',
        'ios-bubble': '20px',
        xl2: '1.25rem',
        xl3: '1.5rem',
      },
      fontSize: {
        'ios-largeTitle': ['34px', { lineHeight: '41px', fontWeight: '700', letterSpacing: '0.37px' }],
        'ios-title1':     ['28px', { lineHeight: '34px', fontWeight: '700', letterSpacing: '0.36px' }],
        'ios-title2':     ['22px', { lineHeight: '28px', fontWeight: '700', letterSpacing: '0.35px' }],
        'ios-title3':     ['20px', { lineHeight: '25px', fontWeight: '600', letterSpacing: '0.38px' }],
        'ios-headline':   ['17px', { lineHeight: '22px', fontWeight: '600', letterSpacing: '-0.41px' }],
        'ios-body':       ['17px', { lineHeight: '22px', fontWeight: '400', letterSpacing: '-0.41px' }],
        'ios-callout':    ['16px', { lineHeight: '21px', fontWeight: '400', letterSpacing: '-0.32px' }],
        'ios-subhead':    ['15px', { lineHeight: '20px', fontWeight: '400', letterSpacing: '-0.24px' }],
        'ios-footnote':   ['13px', { lineHeight: '18px', fontWeight: '400', letterSpacing: '-0.08px' }],
        'ios-caption1':   ['12px', { lineHeight: '16px', fontWeight: '400', letterSpacing: '0px' }],
        'ios-caption2':   ['11px', { lineHeight: '13px', fontWeight: '400', letterSpacing: '0.07px' }],
      },
      fontFamily: {
        sans:   ['Inter_400Regular', 'sans-serif'],
        medium: ['Inter_500Medium', 'sans-serif'],
        semibold:['Inter_600SemiBold', 'sans-serif'],
        bold:   ['Inter_700Bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
