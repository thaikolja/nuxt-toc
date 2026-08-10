# nuxt-toc

[![npm version](https://img.shields.io/npm/v/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/nuxt-toc)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/nuxt-toc)
[![License](https://img.shields.io/npm/l/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://github.com/thaikolja/nuxt-toc/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/thaikolja/nuxt-toc/ci.yml?branch=main&style=flat&colorA=18181B&label=ci)](https://github.com/thaikolja/nuxt-toc/actions/workflows/ci.yml)

فهرست مطالب (Table of Contents) برای فایل‌هایی که با [@nuxt/content](https://content.nuxt.com/) ساخته شده‌اند. این نسخه با @nuxt/content v2 و v3 سازگار است.

**مستندات کامل:** [https://thaikolja.github.io/nuxt-toc/](https://thaikolja.github.io/nuxt-toc/)

[English](./README.md) · [中文](./README_zh.md) · [Deutsch](./README_de.md) · [Español](./README_es.md) · [Français](./README_fr.md) · [فارسی](./README_fa.md)

## ویژگی‌ها

- Content **v2** (`queryContent`) و **v3** (`queryCollection`)
- پاس دادن `:toc` (پیشنهادی) یا واکشی خودکار اختیاری
- کنترل عمق لینک‌های تو در تو
- هایلایت بخش فعال (scroll-spy)
- اسکرول نرم اختیاری و آفست برای هدر چسبان
- کلاس‌ها و idهای CSS پایدار برای تم‌بندی
- ساختار لیست دسترس‌پذیر

## نصب

### مرحله ۱: راه‌اندازی

```bash
# افزودن به سایت موجود
npx nuxi module add nuxt-toc

# یا نصب دستی
npm install nuxt-toc
```

### مرحله ۲: افزودن ماژول به Nuxt

اگر `nuxt-toc` را با `nuxi module` نصب کرده‌اید، می‌توانید این مرحله را رد کنید.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
})
```

## استفاده

ترجیح دهید TOC را از کوئری صفحه پاس دهید. API را با نسخه @nuxt/content خود هماهنگ کنید.

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

یا واکشی خودکار بر اساس مسیر:

```vue
<TableOfContents path="/docs/intro" />
```

## Props

| Prop                        | نوع           | پیش‌فرض               | توضیح                                                                       |
| --------------------------- | ------------- | --------------------- | --------------------------------------------------------------------------- |
| `toc`                       | `Toc \| null` | `null`                | TOC از پیش‌واکشی‌شده (`page.body.toc`). در صورت تنظیم، fetch انجام نمی‌شود. |
| `path`                      | `string`      | `''`                  | مسیر واکشی خودکار (پیش‌فرض: مسیر فعلی).                                     |
| `collection`                | `string`      | `''`                  | کالکشن Content **v3** (پیش‌فرض: `nuxtToc.collection` / `content`).          |
| `depth`                     | `number`      | `2`                   | حداکثر عمق درخت لینک‌ها (`1` = فقط سطح بالا).                               |
| `isSublistShown`            | `boolean`     | `true`                | در صورت `false`، عمق را به `1` محدود می‌کند.                                |
| `isTitleShownWithNoContent` | `boolean`     | `false`               | نمایش عنوان حتی وقتی لینکی وجود ندارد.                                      |
| `title`                     | `string`      | `'Table of Contents'` | متن عنوان.                                                                  |
| `scrollSpy`                 | `boolean`     | `true`                | هایلایت بخش فعال.                                                           |
| `rootMargin`                | `string`      | `'0px 0px -80% 0px'`  | مقدار `rootMargin` برای IntersectionObserver.                               |
| `smooth`                    | `boolean`     | `false`               | اسکرول نرم هنگام کلیک روی لینک.                                             |
| `scrollOffset`              | `number`      | `0`                   | آفست اسکرول به پیکسل (هدر چسبان).                                           |

## گزینه‌های ماژول

`nuxt-toc` را با تنظیمات زیر سفارشی کنید (مقادیر زیر پیش‌فرض هستند).

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

## مستندات

برای یادگیری بیشتر درباره `nuxt-toc`، نحوه استفاده و استایل‌دهی، [مستندات کامل](https://thaikolja.github.io/nuxt-toc) را ببینید. راهنماها، دستورالعمل‌ها و موارد بیشتر آنجا هستند.

## نویسندگان

- [hanyujie2002](https://github.com/hanyujie2002)
- [thaikolja](https://github.com/thaikolja)

## مجوز

این پروژه تحت [مجوز MIT](/LICENSE) منتشر شده است.
