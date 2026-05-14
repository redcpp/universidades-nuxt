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
        paper:        'rgb(var(--paper-rgb) / <alpha-value>)',
        surface:      'rgb(var(--surface-rgb) / <alpha-value>)',
        ink:          'rgb(var(--ink-rgb) / <alpha-value>)',
        'ink-2':      'rgb(var(--ink-2-rgb) / <alpha-value>)',
        'ink-3':      'rgb(var(--ink-3-rgb) / <alpha-value>)',
        'ink-4':      'rgb(var(--ink-4-rgb) / <alpha-value>)',
        hairline:     'rgb(var(--hairline-rgb) / <alpha-value>)',
        'hairline-2': 'rgb(var(--hairline-2-rgb) / <alpha-value>)',
        accent:       'rgb(var(--accent-rgb) / <alpha-value>)',
        'accent-soft':'rgb(var(--accent-soft-rgb) / <alpha-value>)',
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
