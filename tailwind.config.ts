import type { Config } from 'tailwindcss';
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brandWhite: {
          pure: '#F8F8F8',
          100: '#E0E0E0',
          200: '#C0C0C0',
        },
        brandPurple: {
          100: '#afb9f0',
          300: '#828fe4',
          500: '#6772db',
          700: '#4b53a2',
          900: '#232854',
        },
        brandBlack: {
          deep: '#0D0D0F',
          medium: '#141418',
          light: '#222229',
        },
        brandRed: {
          300: '#FCA5A5',
          500: '#C84F59',
          700: '#EF4444',
        },
        brandGray: '#8D8D90',
      },
      scale: {
        115: '1.15',
      },
      screens: {
        '1100': '1100px',
        '900': '900px',
        '450': '450px',
      },
    },
  },
  plugins: [],
};
export default config;
