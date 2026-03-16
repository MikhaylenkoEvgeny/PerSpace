import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'hsl(var(--bg))',
        fg: 'hsl(var(--fg))',
        panel: 'hsl(var(--panel))',
        accent: 'hsl(var(--accent))',
        muted: 'hsl(var(--muted))'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        glow: '0 20px 40px rgba(13, 18, 33, 0.28)'
      }
    }
  },
  plugins: []
};

export default config;
