# Release process

1. Ensure tests and `prepack` pass
2. Update `CHANGELOG.md` under the target version
3. `npm run release` (lint, test, build, changelogen, npm publish)

v3.0.0 is the dual Content + Nuxt 4 major. Patch/minor bumps should stay within that compatibility story unless intentionally breaking.
