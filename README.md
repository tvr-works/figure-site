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

`support.html` and `privacy.html` retain the existing public policies and contact information. They share `src/legal.css`. Update the privacy policy if app, website or support data practices change.

The public contact is `support@figure.tvr.works`. Cloudflare Email Routing was verified on October 21, 2026, including receipt of a test message. Outbound sending as that address remains unconfigured. Private forwarding destinations do not belong in published files.

Public email links retain Cloudflare's documented `email_off` comments so contact details remain readable without JavaScript. No zone-wide email setting was changed.

## Verification

```sh
npm test
npm run build
npx playwright install chromium webkit
npm run test:browser
```

Browser tests use a separate production preview on port 4174. They cover desktop Chromium and mobile-width WebKit, manual keyboard tab activation, native mode/result order, playback pauses, reduced motion, enlarged text, screenshot failure, no JavaScript, policy routes and automated accessibility checks. The in-app browser is used for visual review. These checks do not establish a complete WCAG conformance audit.

## Launch content

Price is intentionally omitted. Both Get Figure links lead to the availability section until the public App Store URL is verified. At launch, update those links and the availability copy in `index.html`, add the approved price, remove `noindex` from the content pages when indexing is wanted, and update Cloudflare's build settings described above. No store settings, hosting settings, pushes or deployments were performed for this implementation.

The hero is a generated product render based on the supplied app screen. The three guided demos use actual app captures, with tap cues placed from simulator action coordinates. They are edited demonstrations, not a browser calculator. Image sources and native capture evidence live in `docs/design/`.
