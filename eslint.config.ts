import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

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
      'playgrounds/**/.nuxt/**',
      'playgrounds/**/.output/**',
      'playgrounds/**/node_modules/**',
      '**/.data/**',
    ],
  })
