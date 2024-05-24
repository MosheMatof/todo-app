interface ImportMetaEnv {
  VITE_API_BASE_URL?: string;
  VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

declare module '*.png' {
  const value: any;
  export = value;
}