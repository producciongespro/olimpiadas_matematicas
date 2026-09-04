import baseConfig from '@olcomep/tailwind-config'

export default {
  presets: [baseConfig],
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
    '../../packages/ui/src/**/*.{js,jsx}',
  ],
}
