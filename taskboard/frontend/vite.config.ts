import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const HOST = '127.0.0.1';
const API_PROXY_TARGET = process.env.API_PROXY_TARGET || 'http://127.0.0.1:3000';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: HOST,
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': API_PROXY_TARGET,
    },
  },
  preview: {
    host: HOST,
    port: 4173,
    strictPort: true,
    proxy: {
      '/api': API_PROXY_TARGET,
    },
  },
});
