import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, autoStaticPathsDiscovery: false, autoSubfolderIndex: false, crawlLinks: false, failOnError: true },
      pages: [{ path: '/' }, { path: '/support' }, { path: '/privacy' }, { path: '/404', sitemap: { exclude: true }, prerender: { outputPath: '/404.html' } }],
    }),
    react(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { host: '127.0.0.1' },
});
