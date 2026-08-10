import { defineBuildConfig } from 'unbuild'

// Keep the published module readable (no minify) for easier debugging in host apps.
export default defineBuildConfig({
  entries: ['./src/module.ts'],
  clean: true,
  declaration: true,
  sourcemap: true,
  rollup: {
    esbuild: {
      minify: false,
    },
  },
})
