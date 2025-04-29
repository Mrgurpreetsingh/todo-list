// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@context': path.resolve(__dirname, 'src/context'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@component': path.resolve(__dirname, 'src/component'),
    },
  },
  server: {
    port: 5173,
  },
});