# Figure site

Placeholder site for Figure at https://figure.tvr.works. The app lives in the separate private `tvanreenen/figure` repository.

## Files

- `public/index.html`: placeholder home page.
- `public/support.html`: placeholder at `/support`.
- `public/privacy.html`: placeholder at `/privacy`.
- `public/404.html`: missing-page response.
- `public/styles.css`: minimal shared styles.

These pages verify hosting and DNS. The support and privacy placeholders are not ready for App Store submission. Replace their text with approved content and real contact details before release, then remove the temporary search-indexing restrictions in the HTML and `robots.txt`.

## Preview

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

Cloudflare Pages serves the HTML pages at extensionless paths. A plain Python server requires `/support.html` and `/privacy.html` during preview.

## Deployment

Connect `tvanreenen/figure-site` to Cloudflare Pages:

- Production branch: `main`.
- Framework preset: None.
- Build command: `exit 0`.
- Build output directory: `public`.
- Pages project: `figure-site` (`https://figure-site.pages.dev`).
- Custom domain: `figure.tvr.works`.

Connected to Cloudflare Pages on October 21, 2026. Pushes to `main` deploy automatically. The private GitHub repository contains the source; the deployed placeholder pages are public.

The custom domain was added through the Pages dashboard, which created a proxied CNAME `figure` → `figure-site.pages.dev` in the `tvr.works` zone, TTL Auto. Cloudflare reports Active with SSL enabled. HTTPS checks passed for the home, `/support`, `/privacy` and stylesheet routes, with the missing-page route returning 404.

To change hosting later, update the Pages custom-domain association and DNS together. A CNAME alone does not attach a domain to a Pages project.

No packages, framework, analytics or build dependencies are needed.
