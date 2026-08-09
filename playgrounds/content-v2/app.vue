<script setup lang="ts">
import logo from '~/assets/logo.png'
</script>

<template>
  <div class="layout">
    <header class="header">
      <NuxtLink to="/" class="brand">
        <img :src="logo" alt="nuxt-toc" class="logo" width="36" height="36" />
        <strong>nuxt-toc</strong>
      </NuxtLink>
      <span class="muted">Nuxt 4 · @nuxt/content <b>v2</b></span>
      <nav class="nav">
        <NuxtLink to="/"> :toc prop </NuxtLink>
        <NuxtLink to="/auto-fetch"> auto-fetch </NuxtLink>
        <NuxtLink to="/props"> props </NuxtLink>
        <NuxtLink to="/settings"> settings </NuxtLink>
      </nav>
    </header>
    <NuxtPage />
  </div>
</template>

<style>
:root {
  color-scheme: dark;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    Segoe UI,
    sans-serif;
  line-height: 1.6;
  background: #0f172a;
  color: #e2e8f0;
}

body {
  margin: 0;
}

.layout {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
}

.header {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #334155;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: inherit;
  text-decoration: none;
}

.logo {
  border-radius: 0.4rem;
  display: block;
}

.muted {
  color: #94a3b8;
  font-size: 0.9rem;
}

.nav {
  margin-left: auto;
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
}

a {
  color: #86efac;
}

.nav a.router-link-active {
  color: #fde047;
  font-weight: 600;
}

.active-toc-item {
  color: #fde047 !important;
  font-weight: 600;
}
</style>
