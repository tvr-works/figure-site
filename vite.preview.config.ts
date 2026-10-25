import { existsSync, readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

// Preview only the static artifact that will be published to Cloudflare Pages.
export default defineConfig({
  appType: 'mpa',
  build: { outDir: 'dist/client' },
  preview: { host: '127.0.0.1' },
  plugins: [{
    name: 'static-pages-404',
    configurePreviewServer(server) {
      const directory = fileURLToPath(new URL('./dist/client/', import.meta.url));
      return () => {
        server.middlewares.use((request, response, next) => {
          // Vite has rewritten clean URLs, but serves their HTML after this hook.
          const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
          const file = resolve(directory, `.${decodeURIComponent(pathname)}`);
          if (file.startsWith(directory) && existsSync(file)) return next();
          response.statusCode = 404;
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(request.method === 'HEAD' ? undefined : readFileSync(new URL('./dist/client/404.html', import.meta.url)));
        });
      };
    },
  }],
});
