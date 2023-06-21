/// <reference types="astro/client" />

declare global {
  var myString: string
  function myFunction(): boolean
}

// https://docs.astro.build/en/guides/environment-variables/#intellisense-for-typescript
interface ImportMetaEnv {
  readonly SITE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}
