# nuxt-toc

[![npm version](https://img.shields.io/npm/v/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/nuxt-toc)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/nuxt-toc)
[![License](https://img.shields.io/npm/l/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://github.com/thaikolja/nuxt-toc/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/thaikolja/nuxt-toc/ci.yml?branch=main&style=flat&colorA=18181B&label=ci)](https://github.com/thaikolja/nuxt-toc/actions/workflows/ci.yml)

Inhaltsverzeichnis (Table of Contents) für Dateien, die mit [@nuxt/content](https://content.nuxt.com/) erstellt wurden. Diese Version ist mit @nuxt/content v2 und v3 kompatibel.

**Vollständige Dokumentation:** [https://thaikolja.github.io/nuxt-toc/](https://thaikolja.github.io/nuxt-toc/)

[English](./README.md) · [中文](./README_zh.md) · [Deutsch](./README_de.md) · [Español](./README_es.md) · [Français](./README_fr.md) · [فارسی](./README_fa.md)

## Funktionen

- Content **v2** (`queryContent`) und **v3** (`queryCollection`)
- Übergabe von `:toc` (empfohlen) oder optionales Auto-Fetch
- Steuerung der Verschachtelungstiefe
- Hervorhebung des aktiven Abschnitts (Scroll-Spy)
- Optionaler sanfter Scroll und Offset für sticky Header
- Stabile CSS-Klassen/IDs für Theming
- Barrierearme Listenstruktur

## Installation

### Schritt 1: Einrichten

```bash
# Zu einer bestehenden Site hinzufügen
npx nuxi module add nuxt-toc

# Oder manuell installieren
npm install nuxt-toc
```

### Schritt 2: Modul in Nuxt registrieren

Wenn Sie `nuxt-toc` über `nuxi module` installiert haben, können Sie diesen Schritt überspringen.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
})
```

## Verwendung

Bevorzugt: TOC aus Ihrer Seitenabfrage übergeben. Achten Sie darauf, die passende API für Ihre @nuxt/content-Version zu verwenden.

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

Oder per Pfad automatisch laden:

```vue
<TableOfContents path="/docs/intro" />
```

## Props

| Prop                        | Typ           | Standard              | Beschreibung                                                            |
| --------------------------- | ------------- | --------------------- | ----------------------------------------------------------------------- |
| `toc`                       | `Toc \| null` | `null`                | Vorgefertigtes TOC (`page.body.toc`). Überspringt den Fetch.            |
| `path`                      | `string`      | `''`                  | Auto-Fetch-Pfad (Standard: aktuelle Route).                             |
| `collection`                | `string`      | `''`                  | Content-**v3**-Collection (Standard: `nuxtToc.collection` / `content`). |
| `depth`                     | `number`      | `2`                   | Max. Verschachtelungstiefe (`1` = nur oberste Ebene).                   |
| `isSublistShown`            | `boolean`     | `true`                | Bei `false` wird die Tiefe auf `1` erzwungen.                           |
| `isTitleShownWithNoContent` | `boolean`     | `false`               | Titel auch ohne Links anzeigen.                                         |
| `title`                     | `string`      | `'Table of Contents'` | Überschriftstext.                                                       |
| `scrollSpy`                 | `boolean`     | `true`                | Hervorhebung des aktiven Abschnitts.                                    |
| `rootMargin`                | `string`      | `'0px 0px -80% 0px'`  | `rootMargin` des IntersectionObserver.                                  |
| `smooth`                    | `boolean`     | `false`               | Sanftes Scrollen bei Klick.                                             |
| `scrollOffset`              | `number`      | `0`                   | Scroll-Offset in px (sticky Header).                                    |

## Moduloptionen

Passen Sie `nuxt-toc` mit den folgenden Einstellungen an (hier die Standardwerte).

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

## Dokumentation

Mehr zu Nutzung und Styling von `nuxt-toc` finden Sie in der [vollständigen Dokumentation](https://thaikolja.github.io/nuxt-toc) — mit Guides, Rezepten und mehr.

## Autoren

- [hanyujie2002](https://github.com/hanyujie2002)
- [thaikolja](https://github.com/thaikolja)

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](/LICENSE).
