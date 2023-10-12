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
        brandRed: '#ef233c',
        brandBlue: '#3a86ff',
      },
      scale: {
        115: '1.15',
      },
    },
  },
  plugins: [],
};
export default config;
