# nuxt-toc

[![npm version](https://img.shields.io/npm/v/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/nuxt-toc)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/nuxt-toc)
[![License](https://img.shields.io/npm/l/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://github.com/thaikolja/nuxt-toc/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/thaikolja/nuxt-toc/ci.yml?branch=main&style=flat&colorA=18181B&label=ci)](https://github.com/thaikolja/nuxt-toc/actions/workflows/ci.yml)

Tabla de contenidos (Table of Contents) para archivos creados con [@nuxt/content](https://content.nuxt.com/). Esta versión es compatible con @nuxt/content v2 y v3.

**Documentación completa:** [https://thaikolja.github.io/nuxt-toc/](https://thaikolja.github.io/nuxt-toc/)

[English](./README.md) · [中文](./README_zh.md) · [Deutsch](./README_de.md) · [Español](./README_es.md) · [Français](./README_fr.md) · [فارسی](./README_fa.md)

## Características

- Content **v2** (`queryContent`) y **v3** (`queryCollection`)
- Pasar `:toc` (recomendado) o auto-fetch opcional
- Control de profundidad de enlaces anidados
- Resaltado de la sección activa (scroll-spy)
- Desplazamiento suave opcional y offset para cabecera fija
- Clases CSS / ids estables para temas
- Marcado de lista accesible

## Instalación

### Paso 1: Configuración

```bash
# Añadir a un sitio existente
npx nuxi module add nuxt-toc

# O instalar manualmente
npm install nuxt-toc
```

### Paso 2: Añadir el módulo a Nuxt

Si instalaste `nuxt-toc` con `nuxi module`, puedes saltarte este paso.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
})
```

## Uso

Preferible pasar el TOC desde la consulta de la página. Usa la API correcta según tu versión de @nuxt/content.

```vue
<script setup lang="ts">
const route = useRoute()
// @nuxt/content v3:
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)

// @nuxt/content v2
// queryContent(route.path).findOne()
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

O auto-fetch por ruta:

```vue
<TableOfContents path="/docs/intro" />
```

## Props

| Prop                        | Tipo          | Por defecto           | Descripción                                                                  |
| --------------------------- | ------------- | --------------------- | ---------------------------------------------------------------------------- |
| `toc`                       | `Toc \| null` | `null`                | TOC precargado (`page.body.toc`). Omite el fetch si se define.               |
| `path`                      | `string`      | `''`                  | Ruta para auto-fetch (por defecto: ruta actual).                             |
| `collection`                | `string`      | `''`                  | Colección de Content **v3** (por defecto: `nuxtToc.collection` / `content`). |
| `depth`                     | `number`      | `2`                   | Profundidad máxima del árbol de enlaces (`1` = solo nivel superior).         |
| `isSublistShown`            | `boolean`     | `true`                | Si es `false`, fuerza profundidad `1`.                                       |
| `isTitleShownWithNoContent` | `boolean`     | `false`               | Mantener el título cuando no hay enlaces.                                    |
| `title`                     | `string`      | `'Table of Contents'` | Texto del encabezado.                                                        |
| `scrollSpy`                 | `boolean`     | `true`                | Resaltado de la sección activa.                                              |
| `rootMargin`                | `string`      | `'0px 0px -80% 0px'`  | `rootMargin` de IntersectionObserver.                                        |
| `smooth`                    | `boolean`     | `false`               | Desplazamiento suave al hacer clic.                                          |
| `scrollOffset`              | `number`      | `0`                   | Offset de scroll en px (cabecera fija).                                      |

## Opciones del módulo

Personaliza `nuxt-toc` con la siguiente configuración (valores por defecto).

```ts
export default defineNuxtConfig({
  nuxtToc: {
    collection: 'content',
    depth: 2,
    scrollSpy: true,
    rootMargin: '0px 0px -80% 0px',
    smooth: false,
    scrollOffset: 0,
  },
})
```

## Documentación

Para saber más sobre `nuxt-toc`, su uso y estilos, consulta [la documentación completa](https://thaikolja.github.io/nuxt-toc). Encontrarás guías, recetas y más.

## Autores

- [hanyujie2002](https://github.com/hanyujie2002)
- [thaikolja](https://github.com/thaikolja)

## Licencia

Este proyecto está licenciado bajo la [Licencia MIT](/LICENSE).
