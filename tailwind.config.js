/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: '#f6f3ec', 2: '#efeadc', cream: '#fbf8f1' },
        ink: { DEFAULT: '#11130f', 2: '#3a3f34' },
        muted: '#6a7063',
        rule: '#c9c2ab',
        accent: { DEFAULT: '#0b5d3b', 2: '#c58b3d' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        instrument: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
