import { createConfigForNuxt } from '@nuxt/eslint-config/flat'
import prettierConfig from 'eslint-config-prettier'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
  dirs: {
    src: ['./playgrounds'],
  },
})
  .prepend({
    ignores: [
      'dist/**',
      'coverage/**',
      'playgrounds/**/.nuxt/**',
      'playgrounds/**/.output/**',
      'playgrounds/**/node_modules/**',
      'docs/.vitepress/cache/**',
      'docs/.vitepress/dist/**',
      '**/.data/**',
      '**/*.md',
    ],
  })
  .append(prettierConfig)
  .append({
    files: ['playgrounds/**/*.{vue,ts,js}'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  })
