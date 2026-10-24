import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import publishedGuides from './content/published-guides.json' with { type: 'json' };
import { site } from './src/site.ts';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, autoStaticPathsDiscovery: false, autoSubfolderIndex: false, crawlLinks: false, failOnError: true },
      sitemap: { enabled: true, host: site.origin },
      pages: [{ path: '/guides' }, ...publishedGuides.map(slug => ({ path: `/guides/${slug}` })), { path: '/' }, { path: '/support' }, { path: '/privacy' }, { path: '/404', sitemap: { exclude: true }, prerender: { outputPath: '/404.html' } }],
    }),
    react(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { host: '127.0.0.1' },
});
