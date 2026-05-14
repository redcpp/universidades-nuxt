module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        'ink-4': 'var(--ink-4)',
        hairline: 'var(--hairline)',
        'hairline-2': 'var(--hairline-2)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        'data-0': 'var(--data-0)',
        'data-1': 'var(--data-1)',
        'data-2': 'var(--data-2)',
        'data-3': 'var(--data-3)',
        'data-4': 'var(--data-4)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
        serif: ['Source Serif 4', 'Georgia', 'serif']
      },
      borderRadius: {
        sm: 'var(--r-sm)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)'
      },
      maxWidth: {
        prose: '720px',
        console: '1280px'
      }
    }
  },
  plugins: []
}
