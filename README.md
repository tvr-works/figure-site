# Figure site

Marketing, support and privacy site for Figure. The iPhone app lives in the separate private `tvanreenen/figure` repository.

## Local development

Requires Node 22.12+ and npm. `.node-version` pins the tested build runtime; use the dependencies locked in `package-lock.json`.

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

Price is intentionally omitted. Both Get Figure links lead to the footer availability note until the public App Store URL is verified. At launch, update those links and the footer availability copy in the marketing route components, optionally add a confirmed price, remove `noindex` from the content pages when indexing is wanted, and update Cloudflare's build settings described above. No store settings, hosting settings, pushes or deployments were performed for this implementation.

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

## SEO and release preparation

The static-artifact browser audit reads every generated HTML page, checks unique titles/descriptions, one H1, canonical/robots/sharing metadata, structured data, sitemap membership, internal pages/anchors and image files. It also checks that breadcrumb markup matches the visible navigation. This supplements the native-content and interaction checks rather than replacing them.

`VITE_SITE_INDEXING` is an explicit public build setting: omit it or use `preview` to keep `noindex, follow`; use `public` only for an authorized indexable release. Vite production mode alone does not enable indexing. A Cloudflare build with `CF_PAGES_BRANCH` other than `main` rejects public indexing. Set the public value only in the production environment, never globally across preview builds. These values contain no secrets. A static artifact cannot change its indexing policy without rebuilding; inspect the final HTML and any edge `X-Robots-Tag` before release. The 404 page always remains `noindex, nofollow`.

`content/page-updates.json` records the last significant content, links or metadata update for each public route. The current October 25 dates include the structured-data and social-metadata release pass. Update only affected entries when meaningful changes land; an ordinary rebuild must leave dates alone. These records drive both the sitemap and guide `dateModified`. Unrecognized routes and invalid date records fail the build.

The homepage identifies the site as Figure using `WebSite` data. Guides use factual `TechArticle` data and visible breadcrumb trails. The intended future App Store publisher is TVR Works LLC, pending Apple's conversion of the owner's personal developer account to an organization account. No personal author name or credentials have been approved; publisher/author metadata and public review claims remain absent. Add confirmed credit consistently to visible content and metadata after that decision. There is no fabricated app rating, offer or store destination.

The nine expanded introductions cover feet/inches, length conversion, right triangles, roof pitch, duct offsets, circles, cylinders, airflow and stairs. They explain measurements and worked answers before the unchanged native instructions. Length and triangle explanations link to primary references. The library index explains the built-in Help source, setup and display rounding. Other subject introductions retain their established concept-specific explanations; expansion is editorial, not a required word count. Repeated display preferences are consolidated into one closed Display and rounding settings disclosure after each guide’s examples, grouped by the examples they apply to. Calculation-dependent setup stays beside its example with a quieter heading.

The committed 1200 × 630 `public/social-card.png` uses the existing Figure artwork and typography. Regenerate it with `npm run asset:social` when the design changes; that optional authoring command uses the existing Playwright Chromium installation. Ordinary production builds only copy the PNG and require no browser. The social metadata remains app-neutral while the listing is pending.

Each calculation mode has a compact icon-only previous-result, play/pause and next-result row directly beneath its phone; playback repeats the selected mode. Help has its icon-only play/pause control in the same position. Buttons retain accessible names, focus indicators and 44px targets. An explicit user pause survives mode selection and scrolling. Reduced motion remains still and retains manual calculation results; hover, keyboard-entry, offscreen and hidden-page suspension remain supported.

### Preview deployment checkpoint

1. Run `npm ci`, `npm run check`, and the complete `npm run test:browser` suite against the intended commit. Browser tests build and serve only `dist/client`.
2. Confirm the Pages project/repository/production branch in the live dashboard. The recorded project is `figure-site`, domain `figure.tvr.works`, production branch `main`; inspect before modifying settings or pushing a deploying branch.
3. Use build command `npm run build`, output `dist/client`, and the runtime in `.node-version`. Deploy a preview with preview indexing. Publish no server bundle, Functions or Worker; this site is prerendered.
4. Inspect the deployed homepage, a guide, `/support`, `/privacy`, assets, sitemap and a nonexistent route. Check direct loads, browser navigation, 404 status, clean-URL redirects, canonical URLs and sharing-image dimensions. Preview should remain excluded from indexing.
5. Inspect actual edge `robots.txt`, `X-Robots-Tag`, managed robot directives and bot/challenge policies. Search crawler access and model-training permission are separate decisions. Confirm policy preferences before changing crawler controls; do not change unrelated zone settings.
6. Record the existing production deployment for rollback. A preview does not replace the public site. Recheck mobile loading on the deployed host; local lab timing is not field Core Web Vitals. Manual VoiceOver review remains a separate release check.

### Public launch checkpoint

- Obtain and verify the public App Store URL/ID, replace both purchase destinations and update availability copy. Price display is optional. Consider a Safari Smart App Banner once the app ID is real.
- Confirm the public creator/publisher credit and account-conversion status. Add only the factual app/publisher schema supported by visible information. Software-app rich-result eligibility requires real supporting offer/review data; do not invent it.
- Verify Google Search Console and Bing Webmaster Tools ownership. Submit the sitemap after production indexing is authorized. Use conventional and generative-AI performance reports when data is available; Bing's topic reporting needs sufficient activity.
- Consider App Store campaign links once Apple's analytics prerequisites are met. Keep website analytics absent unless separately chosen; review Privacy if actual data practices change.
- Build the production artifact with `VITE_SITE_INDEXING=public`, verify emitted metadata and edge headers, deploy only when requested, and inspect representative live URLs. Keep preview environments excluded.
- Use real indexing, query, citation and acquisition results to choose future guide work. IndexNow is optional for significant URL additions/updates/removals after launch. No `llms.txt`, FAQ rich-result markup or keyword-variation routes are required for this release.

The local release-preparation commits do not authorize or perform a push, Pages settings change, public deployment, account verification, sitemap submission, bot-policy change or public indexing change.
