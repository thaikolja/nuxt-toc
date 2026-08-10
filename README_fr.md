# nuxt-toc

[![npm version](https://img.shields.io/npm/v/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/nuxt-toc)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/nuxt-toc)
[![License](https://img.shields.io/npm/l/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://github.com/thaikolja/nuxt-toc/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/thaikolja/nuxt-toc/ci.yml?branch=main&style=flat&colorA=18181B&label=ci)](https://github.com/thaikolja/nuxt-toc/actions/workflows/ci.yml)

Table des matières (Table of Contents) pour les fichiers créés avec [@nuxt/content](https://content.nuxt.com/). Cette version est compatible avec @nuxt/content v2 et v3.

**Documentation complète :** [https://docs.kolja-nolte.com/nuxt-toc/](https://docs.kolja-nolte.com/nuxt-toc/)

[English](./README.md) · [中文](./README_zh.md) · [Deutsch](./README_de.md) · [Español](./README_es.md) · [Français](./README_fr.md) · [فارسی](./README_fa.md)

## Fonctionnalités

- Content **v2** (`queryContent`) et **v3** (`queryCollection`)
- Passage de `:toc` (recommandé) ou auto-fetch optionnel
- Contrôle de la profondeur des liens imbriqués
- Mise en surbrillance de la section active (scroll-spy)
- Défilement fluide optionnel et décalage pour en-tête sticky
- Classes CSS / ids stables pour le theming
- Markup de liste accessible

## Installation

### Étape 1 : Mise en place

```bash
# Ajouter à un site existant
npx nuxi module add nuxt-toc

# Ou installer manuellement
npm install nuxt-toc
```

### Étape 2 : Ajouter le module à Nuxt

Si vous avez installé `nuxt-toc` via `nuxi module`, vous pouvez ignorer cette étape.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
})
```

## Utilisation

Préférez passer le TOC depuis la requête de page. Utilisez l’API adaptée à votre version de @nuxt/content.

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

Ou auto-fetch par chemin :

```vue
<TableOfContents path="/docs/intro" />
```

## Props

| Prop                        | Type          | Défaut                | Description                                                            |
| --------------------------- | ------------- | --------------------- | ---------------------------------------------------------------------- |
| `toc`                       | `Toc \| null` | `null`                | TOC préchargé (`page.body.toc`). Ignore le fetch s’il est défini.      |
| `path`                      | `string`      | `''`                  | Chemin pour l’auto-fetch (défaut : route courante).                    |
| `collection`                | `string`      | `''`                  | Collection Content **v3** (défaut : `nuxtToc.collection` / `content`). |
| `depth`                     | `number`      | `2`                   | Profondeur max de l’arbre de liens (`1` = niveau racine uniquement).   |
| `isSublistShown`            | `boolean`     | `true`                | Si `false`, force la profondeur à `1`.                                 |
| `isTitleShownWithNoContent` | `boolean`     | `false`               | Afficher le titre même sans liens.                                     |
| `title`                     | `string`      | `'Table of Contents'` | Texte du titre.                                                        |
| `scrollSpy`                 | `boolean`     | `true`                | Surbrillance de la section active.                                     |
| `rootMargin`                | `string`      | `'0px 0px -80% 0px'`  | `rootMargin` de l’IntersectionObserver.                                |
| `smooth`                    | `boolean`     | `false`               | Défilement fluide au clic.                                             |
| `scrollOffset`              | `number`      | `0`                   | Décalage de scroll en px (en-tête sticky).                             |

## Options du module

Personnalisez `nuxt-toc` avec les réglages suivants (valeurs par défaut).

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

## Documentation

Pour en savoir plus sur `nuxt-toc`, son usage et son style, consultez [la documentation complète](https://docs.kolja-nolte.com/nuxt-toc). Guides, recettes et plus encore.

## Auteurs

- [hanyujie2002](https://github.com/hanyujie2002)
- [thaikolja](https://github.com/thaikolja)

## Licence

Ce projet est sous [licence MIT](/LICENSE).
