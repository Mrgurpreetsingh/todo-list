// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@component': path.resolve(__dirname, './src/component'),
      '@context': path.resolve(__dirname, './src/context'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@root': path.resolve(__dirname, './src/root'),
    },
  },
  server: {
    port: 5173,
    host: 'localhost',
    proxy: {
      '/auth': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/csrf-token': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});