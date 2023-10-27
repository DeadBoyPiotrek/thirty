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
        brandWhite: '#F8F8F8',
        brandPurple: '#6772DB',
        brandRed: '#C84F59',
        brandBlack: '#0D0D0F',
        brandLightBlack: '#141418',
        brandGray: '#8D8D90',
      },
      scale: {
        115: '1.15',
      },
    },
  },
  plugins: [],
};
export default config;
