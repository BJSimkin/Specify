import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sp: {
          DEFAULT: '#1E1B4B',
          2: '#2D2A6E',
          3: '#4338CA',
        },
        am: {
          DEFAULT: '#F59E0B',
          2: '#D97706',
          3: '#FEF3C7',
          4: '#78350F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
