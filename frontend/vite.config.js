import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@context': path.resolve(__dirname, 'src/context'),
    },
  },
  server: {
    ...(process.env.NODE_ENV === 'development' && {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, '../certs/frontend/frontend-key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, '../certs/frontend/frontend-cert.pem')),
      },
    }),
    port: 5173,
    host: 'localhost',
    proxy: {
      '/auth': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false, // Ignorer les erreurs de certificat SSL
      },
      '/csrf-token': {
        target: 'https://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});