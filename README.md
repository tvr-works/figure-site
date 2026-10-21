# Figure site

Prelaunch site for Figure at https://figure.tvr.works. The app lives in the separate private `tvanreenen/figure` repository.

## Files

- `public/index.html`: short app introduction and testing status.
- `public/support.html`: Help instructions, problem-report guidance and public contact at `/support`.
- `public/privacy.html`: privacy policy at `/privacy`.
- `public/404.html`: missing-page response.
- `public/styles.css`: minimal shared styles.

The site provides working marketing, support and privacy URLs for release preparation. It deliberately omits the full marketing design, screenshots and an App Store download link while the app is in testing. Add the download link when available. Each page keeps `noindex` until launch; `robots.txt` permits crawling so search engines can read that directive. Remove `noindex` from the three content pages when launch indexing is wanted.

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

Connected to Cloudflare Pages on October 21, 2026. Pushes to `main` deploy automatically. The private GitHub repository contains the source; the deployed pages are public.

The custom domain was added through the Pages dashboard, which created a proxied CNAME `figure` → `figure-site.pages.dev` in the `tvr.works` zone, TTL Auto. Cloudflare reports Active with SSL enabled. HTTPS checks passed for the home, `/support`, `/privacy` and stylesheet routes, with the missing-page route returning 404.

To change hosting later, update the Pages custom-domain association and DNS together. A CNAME alone does not attach a domain to a Pages project.

No packages, framework, analytics or build dependencies are needed.

## Support email

The owner selected `support@figure.tvr.works` as the public contact. On October 21, 2026, Cloudflare Email Routing was enabled for `figure.tvr.works` and a forwarding rule was created for `support` to the owner's verified Gmail destination tagged `+figure`. The dashboard reports the destination Verified, the rule Active and the subdomain Enabled with locked DNS records. Existing apex-domain routes were kept unchanged.

Public DNS returns the three Cloudflare MX hosts. The website still returned HTTP 200 after setup. The owner confirmed a test email arrived on October 21, 2026. Forwarding does not configure outgoing messages as the support address; outbound sending remains unconfigured.

Only the public support address belongs in deployed pages. Keep the private forwarding destination out of `public/`.

## Content and verification

Published content lives in `public/`; app-repository release notes link here rather than maintain a second policy copy. The privacy policy distinguishes app-local storage, Apple diagnostics, support correspondence and website hosting. Update it when those practices change. Support correspondence must be handled according to its stated retention and deletion policy.

The October 21, 2026 checks covered all three pages in WebKit at 390 × 844 and 1280 × 900, in light and dark appearances. Navigation, contact links and doubled text size passed, with no horizontal overflow or browser console errors. Browser plugin was not available; the checks used installed Playwright with the existing WebKit runtime. Temporary preview/test files stay outside the repository.
