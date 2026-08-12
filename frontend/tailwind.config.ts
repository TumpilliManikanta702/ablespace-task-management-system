import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './providers/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--color-brand-50, #eff6ff)',
          100: 'var(--color-brand-100, #dbeafe)',
          200: 'var(--color-brand-200, #bfdbfe)',
          500: 'var(--color-brand-500, #3b82f6)',
          600: 'var(--color-brand-600, #2563eb)',
          700: 'var(--color-brand-700, #1d4ed8)',
        },
        surface: {
          light: '#ffffff',
          dark: '#0f172a',
          cardLight: '#ffffff',
          cardDark: '#1e293b',
          borderLight: '#e2e8f0',
          borderDark: '#334155',
        },
      },
      borderRadius: {
        theme: '0.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
