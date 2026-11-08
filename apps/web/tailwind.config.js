const { join } = require('path');

// tailwind.config.js
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, '../../libs/**/!(*.stories|*.spec).{ts,html}'),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        bg: '#f3f4f8',
        surface: '#ffffff',
        ink: '#12162b',
        muted: '#5a6177',
        line: '#e3e6ef',
        accent: { DEFAULT: '#4a33e0', soft: '#eeebff' },
        good: { DEFAULT: '#127a55', soft: '#e6f6ef' },
        warn: { DEFAULT: '#9a5b00', soft: '#fff3d9' },
        bad: { DEFAULT: '#b42318', soft: '#fdeceb' },
      }
    },
  },
  plugins: [],
};
