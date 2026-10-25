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

TanStack Start and Vite prerender the home, `/support`, `/privacy`, `/guides`, published guide articles and 404 pages to `dist/client`. React hydrates the existing calculation and Help demonstrations. Tailwind uses its Vite plugin; shadcn components use Base UI. The site deploys as static files; no runtime backend or analytics is required.

The agreed copy and interaction plan lives in [the storyboard](docs/MARKETING-STORYBOARD.md). The subject-based web Help library and remaining publication plan are mapped in [the guide structure](docs/GUIDE-LIBRARY-STRUCTURE.md). Price and the public App Store URL still require the owner's launch decision. Keep `noindex` until public launch is requested.

## Deployment

The existing Cloudflare Pages project is `figure-site`, domain `figure.tvr.works`, production branch `main`. The previous configuration used build command `exit 0` and output `public`.

Before deploying this implementation, change the Pages build command to `npm run build` and output directory to `dist/client`. These dashboard settings have not been changed here. Pushes to `main` deploy automatically; local worktree commits do not publish the site.

## Content and support

The support and privacy route components retain the existing public policies and contact information. They use the shared site header/footer and breadcrumb, a readable Typeset layout, and section navigation. Scoped styles in `src/legal.css` retain system dark mode without changing the marketing or guide theme. Update the privacy policy if app, website or support data practices change.

The public contact is `support@figure.tvr.works`. Cloudflare Email Routing was verified on October 21, 2026, including receipt of a test message. Outbound sending as that address remains unconfigured. Private forwarding destinations do not belong in published files.

Public email links retain Cloudflare's documented `email_off` comments so contact details remain readable without JavaScript. No zone-wide email setting was changed.

## Verification

```sh
npm run check
npm run build
npx playwright install chromium webkit
npm run test:browser
```

`npm run check` runs lint, content validation, generated-route types, TypeScript, and unit tests. Production builds validate content and run lint before prerendering and typechecking. Generated routes and public guide slices are recreated from source; do not edit them directly. Use `npm run lint` for the lint pass alone; `npm run lint:fix` applies safe fixes for review.

Oxlint 1.89.0 and `@shadcn/lint` 0.2.3 are pinned development dependencies. Configure them in `.oxlintrc.json`. The baseline enforces native correctness rules, React hooks/effect dependencies, JSX accessibility, and shadcn component ownership, known classes, theme colors, and CSS-owned styles. Warnings and unused disable directives fail the lint command.

`shadcn/no-restyle` is disabled only within `src/components/ui`, where the components define their appearance. The other shadcn rules still check those files. Animation coordinates and timings pass through CSS custom properties; transforms are defined in the stylesheet. Component discovery uses the existing `components.json`, aliases, variants and theme.

The TypeScript compiler remains the type checker; this baseline does not enable Oxlint’s separate type-aware mode. The linters do not check plain CSS declarations or static HTML, so retain the build and browser checks below.

Browser tests use a separate static-only production preview on port 4174, with real 404 responses rather than a server-rendered fallback. They cover desktop Chromium and mobile-width WebKit, keyboard mode navigation, complete native input/result sequences and conversions, playback pauses, reduced motion, enlarged text, screenshot failure, no JavaScript, policy routes and automated accessibility checks. Playwright also captures desktop and mobile visual evidence; the Browser plugin was unavailable for this revision. These checks do not establish a complete WCAG conformance audit.

## Launch content

Price is intentionally omitted. Both Get Figure links lead to the footer availability note until the public App Store URL is verified. At launch, update those links and the footer availability copy in the marketing route components, add the approved price, remove `noindex` from the content pages when indexing is wanted, and update Cloudflare's build settings described above. No store settings, hosting settings, pushes or deployments were performed for this implementation.

The hero is a generated product render based on the supplied app screen. The nine complete mode examples and separate Help sequence use actual app captures, with tap cues placed from simulator action coordinates. They are edited demonstrations, not a browser calculator. Image sources and native capture evidence live in `docs/design/`.

## Reading typography

Guide prose and support, privacy and 404 content use [shadcn Typeset](https://ui.shadcn.com/docs/typeset). `src/typeset.css` is the official stylesheet copied from the builder's [export](https://ui.shadcn.com/typeset.css). Figure's guide and policy presets live in `src/styles.css`; tune those rather than adding duplicate paragraph, heading and list rules. Page layouts continue to own their reading width.

Calculator instruction lists, key groups, result panels, settings rows and diagrams keep their component styles. Their `data-not-typeset` boundaries prevent prose rules from restyling those elements. Navigation stays outside the prose containers. Policy theme tokens are scoped to the legal shell so system dark mode preserves readable text and borders.

## Native guide content

`content/native-help.json` is a committed snapshot generated by the private app repository’s `Tools/HelpExport/export.sh`. Ordinary web builds need no Swift toolchain or app checkout. `npm run content` validates every source recipe against `docs/design/guide-subject-map.json`, then generates only the explicitly published subjects listed in `content/published-guides.json`. The entire native snapshot is excluded from the client application; generated article data is its publication boundary.

The library publishes all 50 mapped subjects under `/guides`. Guides is visible in the shared desktop/mobile header and footer, with contextual links from the homepage Help section and Support’s calculation guidance. The articles account for all 147 native recipes, including complete key sequences, settings, results and accessible native schematics. One verified duplicate renders once while retaining both source anchors. A subject URL describes the underlying concept; examples retain their own headings and stable section anchors.

To refresh the source snapshot from an adjacent app checkout:

```sh
../figure/Tools/HelpExport/export.sh > content/native-help.json
npm run content
npm run check
npm run test:browser
```

Review the snapshot diff and its source revision before committing. For future catalog additions, add subject context in `content/guide-context.json`, update the subject map, add the slug to `content/published-guides.json`, implement any required diagram renderer, and verify the generated article and static route. Builds regenerate the sitemap from explicit page choices and retain `noindex, follow` until launch. Search uses the published subject summaries, application aliases and native recipe titles. The query stays in the URL for sharing and Back navigation. Category links and all article links work without JavaScript; the search control appears after hydration. Each article loads from its own generated module, so opening one guide does not download the full library.
