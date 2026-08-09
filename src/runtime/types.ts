export interface TocLink {
  id: string
  text: string
  depth?: number
  children?: TocLink[]
}

export interface Toc {
  links: TocLink[]
}

export type NuxtTocFetch = (
  path: string,
  collection?: string,
) => Promise<{ body?: { toc?: Toc } | null } | null | undefined>

declare module '#app' {
  interface NuxtApp {
    $nuxtTocFetch?: NuxtTocFetch
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $nuxtTocFetch?: NuxtTocFetch
  }
}

export {}
