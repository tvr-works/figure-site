# Figure site

Marketing, support and privacy site for Figure. The iPhone app lives in the separate private `tvanreenen/figure` repository.

## Local development

Requires Node 22.12+ and npm. Use the versions locked in `package-lock.json`.

```sh
npm ci
npm run dev -- --port 4173 --strictPort
npm run build
npm run preview -- --port 4173 --strictPort
```

Vite builds the static home, `/support`, `/privacy` and 404 pages to `dist`. React owns the interactive product demonstration. Tailwind uses its Vite plugin; shadcn components use Base UI. No client router, backend or analytics is included.

The agreed copy and interaction plan lives in [the storyboard](docs/MARKETING-STORYBOARD.md). Price and the public App Store URL still require the owner's launch decision. Keep `noindex` until public launch is requested.

## Deployment

The existing Cloudflare Pages project is `figure-site`, domain `figure.tvr.works`, production branch `main`. The previous configuration used build command `exit 0` and output `public`.

Before deploying this implementation, change the Pages build command to `npm run build` and output directory to `dist`. These dashboard settings have not been changed here. Pushes to `main` deploy automatically; local worktree commits do not publish the site.

## Content and support

`support/index.html` and `privacy/index.html` retain the existing public policies and contact information. They share `src/legal.css`. Update the privacy policy if app, website or support data practices change.

The public contact is `support@figure.tvr.works`. Cloudflare Email Routing was verified on October 21, 2026, including receipt of a test message. Outbound sending as that address remains unconfigured. Private forwarding destinations do not belong in published files.

Public email links retain Cloudflare's documented `email_off` comments so contact details remain readable without JavaScript. No zone-wide email setting was changed.
