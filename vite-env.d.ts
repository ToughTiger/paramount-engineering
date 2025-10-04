/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string; // add your custom env vars here
  // e.g. readonly VITE_OTHER_VAR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
