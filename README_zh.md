# nuxt-toc

[![npm version](https://img.shields.io/npm/v/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/nuxt-toc)
[![npm downloads](https://img.shields.io/npm/dm/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://www.npmjs.com/package/nuxt-toc)
[![License](https://img.shields.io/npm/l/nuxt-toc?style=flat&colorA=18181B&colorB=28CF8D)](https://github.com/thaikolja/nuxt-toc/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/thaikolja/nuxt-toc/ci.yml?branch=main&style=flat&colorA=18181B&label=ci)](https://github.com/thaikolja/nuxt-toc/actions/workflows/ci.yml)

为使用 [@nuxt/content](https://content.nuxt.com/) 创建的文件提供目录（Table of Contents）。此版本兼容 @nuxt/content v2 与 v3。

**完整文档：** [https://docs.kolja-nolte.com/nuxt-toc/](https://docs.kolja-nolte.com/nuxt-toc/)

[English](./README.md) · [中文](./README_zh.md) · [Deutsch](./README_de.md) · [Español](./README_es.md) · [Français](./README_fr.md) · [فارسی](./README_fa.md)

## 功能

- 支持 Content **v2**（`queryContent`）与 **v3**（`queryCollection`）
- 推荐传入 `:toc`，也可选择自动拉取
- 嵌套链接深度控制
- 当前章节高亮（scroll-spy）
- 可选平滑滚动与粘性页眉偏移
- 稳定的 CSS 类名 / id 钩子，便于主题定制
- 无障碍友好的列表结构

## 安装

### 步骤 1：安装

```bash
# 添加到现有站点
npx nuxi module add nuxt-toc

# 或手动安装
npm install nuxt-toc
```

### 步骤 2：在 Nuxt 中注册模块

若已通过 `nuxi module` 安装 `nuxt-toc`，可跳过此步。

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-toc', '@nuxt/content'],
})
```

## 用法

推荐从页面查询结果传入 TOC。请确保查询方式与你的 @nuxt/content 主版本一致。

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

或按路径自动拉取：

```vue
<TableOfContents path="/docs/intro" />
```

## Props

| Prop                        | 类型          | 默认值                | 说明                                                            |
| --------------------------- | ------------- | --------------------- | --------------------------------------------------------------- |
| `toc`                       | `Toc \| null` | `null`                | 预取的 TOC（`page.body.toc`）。设置后跳过请求。                 |
| `path`                      | `string`      | `''`                  | 自动拉取路径（默认：当前路由）。                                |
| `collection`                | `string`      | `''`                  | Content **v3** 集合（默认：`nuxtToc.collection` / `content`）。 |
| `depth`                     | `number`      | `2`                   | 链接树最大嵌套深度（`1` 表示仅顶层）。                          |
| `isSublistShown`            | `boolean`     | `true`                | 为 `false` 时强制深度为 `1`。                                   |
| `isTitleShownWithNoContent` | `boolean`     | `false`               | 没有链接时仍显示标题。                                          |
| `title`                     | `string`      | `'Table of Contents'` | 标题文本。                                                      |
| `scrollSpy`                 | `boolean`     | `true`                | 当前章节高亮。                                                  |
| `rootMargin`                | `string`      | `'0px 0px -80% 0px'`  | IntersectionObserver 的 `rootMargin`。                          |
| `smooth`                    | `boolean`     | `false`               | 点击链接时平滑滚动。                                            |
| `scrollOffset`              | `number`      | `0`                   | 滚动偏移（像素，用于粘性页眉）。                                |

## 模块选项

通过以下配置自定义 `nuxt-toc`（下列为默认值）。

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

## 文档

想进一步了解 `nuxt-toc` 的用法与样式定制，请查看[完整文档](https://docs.kolja-nolte.com/nuxt-toc)。其中包含指南、示例等。

## 作者

- [hanyujie2002](https://github.com/hanyujie2002)
- [thaikolja](https://github.com/thaikolja)

## 许可证

本项目基于 [MIT 许可证](/LICENSE) 开源。
