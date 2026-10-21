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

## Support email

The owner selected `support@figure.tvr.works` as the public contact. On October 21, 2026, Cloudflare Email Routing was enabled for `figure.tvr.works` and a forwarding rule was created for `support` to the owner's verified Gmail destination tagged `+figure`. The dashboard reports the destination Verified, the rule Active and the subdomain Enabled with locked DNS records. Existing apex-domain routes were kept unchanged.

Public DNS returns the three Cloudflare MX hosts. The website still returned HTTP 200 after setup. End-to-end message delivery remains to be tested before publishing the address. Forwarding does not configure outgoing messages as the support address; outbound sending remains unconfigured.

Only the public support address belongs in deployed pages. Keep the private forwarding destination out of `public/`.
