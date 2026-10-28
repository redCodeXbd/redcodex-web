/** Same brand as the ERP app: Red Codex red on white, ink text. */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: '#c8102e', dark: '#a30d25', deep: '#8b1a2b', tint: '#fdf2f3' }, ink: '#111113', soft: '#faf9f9' },
      fontFamily: { sans: ['"Inter var"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
