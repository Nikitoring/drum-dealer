import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        poster: {
          red: '#D52B1E',
          ink: '#171717',
          paper: '#F3EBDD',
          gray: '#77736D',
        },
      },
      fontFamily: {
        sans: [
          'var(--font-manrope)',
          'var(--font-inter)',
          'Arial',
          'sans-serif',
        ],
        heading: [
          'var(--font-buran)',
          'var(--font-oswald)',
          'Impact',
          'sans-serif',
        ],
        accent: [
          'var(--font-buran)',
          'var(--font-oswald)',
          'Impact',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
