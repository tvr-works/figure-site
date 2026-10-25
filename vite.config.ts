import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { publicPages } from './src/site-pages.ts';
import { resolveSiteIndexing } from './src/indexing.ts';
import { site } from './src/site.ts';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), 'VITE_SITE_');
  const indexing = resolveSiteIndexing(environment.VITE_SITE_INDEXING, process.env.CF_PAGES_BRANCH);
  return {
  define: { 'import.meta.env.VITE_SITE_INDEXING': JSON.stringify(indexing) },
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, autoStaticPathsDiscovery: false, autoSubfolderIndex: false, crawlLinks: false, failOnError: true },
      sitemap: { enabled: true, host: site.origin },
      pages: [...publicPages.map(({ path, lastModified }) => ({ path, sitemap: { lastmod: lastModified } })), { path: '/404', sitemap: { exclude: true }, prerender: { outputPath: '/404.html' } }],
    }),
    react(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { host: '127.0.0.1' },
  };
});
