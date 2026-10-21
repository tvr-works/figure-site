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
- Planned Pages project: `figure-site`.
- Custom domain: `figure.tvr.works`.

Add the custom domain in the Pages project before creating its DNS record. For a zone already on Cloudflare, Pages can create the CNAME automatically. Keep the project's actual Pages hostname as the record target. Once connected, pushes to `main` deploy automatically.

No packages, framework, analytics or build dependencies are needed.
