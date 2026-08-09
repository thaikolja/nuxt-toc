**语言:** [English](./README.md)

# @nuxt/content 目录组件（nuxt-toc）

为 [@nuxt/content](https://content.nuxt.com/) 提供目录（Table of Contents）组件的 Nuxt 模块。

> 兼容 **`@nuxt/content` v2 与 v3**，目标 **Nuxt 4**（亦支持 Nuxt ≥ 3.16）。

完整说明与 API 请以 [英文 README](./README.md) 为准。

本地开发使用 **Bun**（`bun install` / `bun run dev:v3` / `bun run dev:v2`）。

## 快速开始

```bash
npx nuxi module add nuxt-toc
```

推荐从页面查询结果传入 TOC（v2 / v3 通用）：

```vue
<script setup lang="ts">
const route = useRoute()
// Content v3:
const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('content').path(route.path).first(),
)
// Content v2 则用: queryContent(route.path).findOne()
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <TableOfContents :toc="page?.body?.toc" />
</template>
```

也可省略 `:toc`，由模块按已安装的 Content 主版本自动拉取。

## 模块选项

```ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
  nuxtToc: {
    collection: 'content', // 仅 Content v3 自动拉取时使用
  },
})
```

## 兼容性

| 包              | 支持范围              |
| --------------- | --------------------- |
| `nuxt`          | `^3.16.0 \|\| ^4.0.0` |
| `@nuxt/content` | `^2.0.0 \|\| ^3.0.0`  |

## 许可证

[MIT](./LICENSE)
