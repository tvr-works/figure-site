import { existsSync, readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { responseHeaders } from './scripts/lib/static-delivery.ts';

// Preview only the static artifact that will be published to Cloudflare Pages.
export default defineConfig({
  appType: 'mpa',
  build: { outDir: 'dist/client' },
  preview: { host: '127.0.0.1', cors: false },
  plugins: [
    {
      name: 'static-pages-404',
      configurePreviewServer(server) {
        const directory = fileURLToPath(new URL('./dist/client/', import.meta.url));
        server.middlewares.use((request, response, next) => {
          const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
          for (const [name, value] of Object.entries(
            responseHeaders(
              readFileSync(new URL('./dist/client/_headers', import.meta.url), 'utf8'),
              pathname,
            ),
          ))
            response.setHeader(name, value);
          next();
        });
        return () => {
          server.middlewares.use((request, response, next) => {
            // Vite has rewritten clean URLs, but serves their HTML after this hook.
            const pathname = new URL(request.url ?? '/', 'http://localhost').pathname;
            let decoded: string;
            try {
              decoded = decodeURIComponent(pathname);
            } catch {
              response.statusCode = 400;
              response.end('Invalid URL');
              return;
            }
            const file = resolve(directory, `.${decoded}`);
            if (file.startsWith(directory) && existsSync(file)) return next();
            response.statusCode = 404;
            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.end(
              request.method === 'HEAD'
                ? undefined
                : readFileSync(new URL('./dist/client/404.html', import.meta.url)),
            );
          });
        };
      },
    },
  ],
});
