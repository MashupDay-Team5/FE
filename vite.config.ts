import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // `@/`로 시작하는 import는 항상 `src` 폴더를 기준으로 한다.
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
