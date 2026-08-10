# Compatibility

| Package         | Supported                               |
| --------------- | --------------------------------------- |
| `nuxt`          | `^3.16.0 \|\| ^4.0.0` (primary: Nuxt 4) |
| `@nuxt/content` | `^2.0.0 \|\| ^3.0.0`                    |
| Vue             | 3.x                                     |

## Dual Content majors

The module detects `@nuxt/content`’s major version from `node_modules` and registers **one** fetch plugin:

| Major | Plugin     | API                                              |
| ----- | ---------- | ------------------------------------------------ |
| 2     | `fetch-v2` | `queryContent(path).findOne()`                   |
| 3     | `fetch-v3` | `queryCollection(collection).path(path).first()` |

v2 and v3 **cannot** share a single `node_modules` tree. This repo keeps separate playground apps under `playgrounds/content-v2` and `playgrounds/content-v3`.

## Runtime dependency note

The published package depends on `@nuxt/kit` `>=3.16.0 <5.0.0` so Nuxt 3.16+ and Nuxt 4 hosts can resolve a matching kit. Nuxt 4 remains the primary supported host for this major; on Nuxt 3, keep `@nuxt/kit` aligned with your Nuxt version in the lockfile.
