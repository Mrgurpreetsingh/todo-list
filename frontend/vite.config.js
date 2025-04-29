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
    proxy: {
      '/auth': {
        target: process.env.VITE_API_URL || 'https://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, '/auth'),
      },
      // '/csrf-token': {
      //   target: process.env.VITE_API_URL || 'https://localhost:3000',
      //   changeOrigin: true,
      //   secure: false,
      //   rewrite: (path) => path.replace(/^\/csrf-token/, '/csrf-token'),
      // },
      '/tasks': {
        target: process.env.VITE_API_URL || 'https://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/tasks/, '/tasks'),
      },
    },
  },
});