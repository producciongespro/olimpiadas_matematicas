import baseConfig from '@olcomep/tailwind-config'

export default {
  presets: [baseConfig],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'rgb(var(--brand-primary) / <alpha-value>)',
          accent: 'rgb(var(--brand-accent) / <alpha-value>)',
          highlight: 'rgb(var(--brand-highlight) / <alpha-value>)',
          soft: 'rgb(var(--brand-soft) / <alpha-value>)',
        },
      },
    },
  },
  content: {
    relative: true,
    files: [
      './index.html',
      './src/**/*.{js,jsx}',
      '../../packages/ui/src/**/*.{js,jsx}',
    ],
  },
}
