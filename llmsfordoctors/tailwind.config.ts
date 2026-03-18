// NOTE: Tailwind v4 uses CSS-first configuration via src/styles/global.css (@theme block).
// This file is kept for reference only — theme values live in global.css.
// See: https://tailwindcss.com/docs/v4-upgrade

import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        heading: ['Newsreader', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        clinical: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        callout: {
          hipaa: { bg: '#fef2f2', border: '#ef4444', text: '#991b1b' },
          pitfall: { bg: '#fffbeb', border: '#f59e0b', text: '#92400e' },
          tip: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af' },
          evidence: { bg: '#f0fdf4', border: '#22c55e', text: '#166534' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '72ch',
            lineHeight: '1.7',
            fontFamily: 'Inter, system-ui, sans-serif',
            h1: { fontFamily: 'Newsreader, Georgia, serif' },
            h2: { fontFamily: 'Newsreader, Georgia, serif' },
            h3: { fontFamily: 'Newsreader, Georgia, serif' },
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
