import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#080808',
        charcoal: '#101010',
        card: '#14090B',
        crimson: {
          950: '#430A12',
          900: '#650B18',
          800: '#850F22',
          700: '#A31930',
        },
        bone: '#F4F2F2',
        ash: '#989292',
        line: '#292022',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        // Brand rule: every word on the site renders in our two fonts —
        // even mono-styled labels use Space Grotesk, never a system mono stack.
        mono: ['var(--font-display)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(133,15,34,0.35)',
        card: '0 8px 40px rgba(0,0,0,0.55)',
      },
    },
  },
  plugins: [],
};
export default config;
