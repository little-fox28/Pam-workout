/** @type {import('tailwindcss').Config} */
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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        border: 'var(--border)',
        // Pam brand palette
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          50:  '#eef4ff',
          100: '#dae6fe',
          200: '#bcd3fd',
          300: '#90b7fb',
          400: '#5d90f7',
          500: '#3a6ef2', // main
          600: '#2350e6',
          700: '#1c3fd2',
          800: '#1d35ab',
          900: '#1d3187',
          950: '#152055',
        },
        accent: {
          400: '#fb923c',
          500: '#f97316', // main
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
      fontFamily: {
        sans:   ['Inter_400Regular', 'sans-serif'],
        medium: ['Inter_500Medium', 'sans-serif'],
        semibold:['Inter_600SemiBold', 'sans-serif'],
        bold:   ['Inter_700Bold', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.5rem',
      },
    },
  },
  plugins: [],
};
