# Implementation evidence

Checked October 22, 2026. Installed versions are pinned by the lockfile. Current stable packages at implementation: Vite 8.3.5, React 19.3.1, TypeScript 7.0.2, Tailwind 4.3.3, Base UI 1.9.0, shadcn CLI 4.22.1.

## Official documentation used

- [Vite multi-page builds](https://vite.dev/guide/build.html#multi-page-app): separate HTML entry points; Vite 8 uses `build.rolldownOptions`.
- [Tailwind with Vite](https://tailwindcss.com/docs/installation/using-vite): dedicated Vite plugin and CSS import.
- [Tailwind browser compatibility](https://tailwindcss.com/docs/compatibility): modern browser baseline; app iOS requirements do not define website compatibility.
- [shadcn Vite installation](https://ui.shadcn.com/docs/installation/vite) and [CLI](https://ui.shadcn.com/docs/cli): CLI-generated Base components, semantic tokens, source owned by this repository. Current CLI accepts `--base base --preset nova`, although the skill examples still spell the preset `base-nova`.
- [Button](https://ui.shadcn.com/docs/components/base/button) and [Native Select](https://ui.shadcn.com/docs/components/base/native-select): use generated compositions and Base UI APIs. The earlier proof tabs have been removed.
- [Base UI accessibility](https://base-ui.com/react/overview/accessibility): primitives handle interaction mechanics; labels, focus visibility, contrast and behavior still need verification in this site.
- [React createRoot](https://react.dev/reference/react-dom/client/createRoot): mount independent calculation and Help demonstrations in an otherwise static page.
- [WCAG Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html): provide persistent playback controls for repeating demonstrations.

TypeScript 7 reports that `baseUrl` has been removed. The `@/*` alias uses explicitly relative `./src/*` paths instead. The Vite alias matches that path.

## App evidence

Native media is captured from the Figure app on a dedicated iOS 26.5 simulator, built without changing app code. Simulator screenshots from the MCP tool are optimized to 368px wide; `simctl io screenshot` is used for full-resolution source captures. Media is evidence of the captured examples, not a second calculator implementation or a claim of complete competitor parity.

## Verification-driven choices

Official docs were consulted again for [React effect cleanup](https://react.dev/reference/react/useEffect), [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [Playwright emulation](https://playwright.dev/docs/emulation), [accessibility testing](https://playwright.dev/docs/accessibility-testing), and [Tailwind overflow wrapping](https://tailwindcss.com/docs/overflow-wrap).

The static support/privacy files remain at root-level HTML entry points so Vite and Cloudflare's extensionless route handling both resolve `/support` and `/privacy`. A directory-index migration failed the actual production-preview browser test and was corrected.

Pause responds to pointer clicks independently from keyboard focus. Only keyboard focus entering the running proof pauses through the focus handler; a pointer focusing Pause must not toggle it back to Play before the click arrives.

Static navigation/disclosure icons are exports from the installed Lucide library. Figure’s brand layers are copied directly from its app icon source; neither is an invented drawing.

## Complete examples and separate Help (October 23)

The hero now reads “Trade math. Made intuitive.” with “Helpful modes. Adaptive keys. Visual results. Easy conversions.” The calculation tour carries each mode through representative inputs, an answer, and related native results. Visual results no longer has a separate tab. Help follows the calculation section in document flow. The All calculations inventory and larger-image viewer were removed in earlier iterations.

The nine examples use 131 new native screenshots from the installed Figure 1.0 (3) app on the dedicated Figure Store phone simulator. The owner authorized starting that simulator. No iOS source changes were needed. Full-resolution PNG captures were exported as lossless 720px-wide WebP assets. `docs/design/worked-capture-manifest.json` records native action coordinates and readouts; `src/worked-examples.json` supplies playback frames. Older partial-input and separate visual-result assets were removed. The earlier abbreviated Help captures were replaced by the complete interaction sequence described below.

Right Triangle includes a 3 ft run and 4 ft rise, its 5 ft diagonal, conversion to 60 in and 1.524 m, and related side/angle highlights. Oblique Triangle uses 5, 6 and 7 ft sides. Circle, Cylinder, Cone, Ratios, Offset, Roof and Stairs each include their own solved example. The stair example reaches actual riser height, counts and a 12 ft 6 in required run. These are specific captured examples, not a claim of complete competitor parity.

`ProductDemo` owns mode/frame selection; `HelpDemo` owns its independent guide sequence. Shared `useDemoPlayback` synchronizes image readiness, reduced motion, viewport intersection, document visibility and timers. `DemoPhone` shares the native screen, frame, failure message and touch cue. This follows the React guidance on [reusing logic with custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks): the browser behavior is shared while each call retains its own state. Effects follow the documented [setup/cleanup contract](https://react.dev/reference/react/useEffect), including Strict Mode remount checks.

The tour advances to the next mode after the complete result hold. A vertical picker pairs mode names with capability summaries; smaller screens use the generated shadcn native select. Selecting a mode restarts its sequence. The section has a fixed “See how Figure works.” H2 and a smaller mode H3. Its visible Pause/Play control is removed; hovering over the phone holds playback and leaving resumes. Keyboard focus entering the calculation demo still pauses it; automatic progression never moves keyboard focus. Manual selection is announced. The visible explanation is one ordered list of five or six specific actions per mode, with subtle current-step emphasis. Rendered step indexes in `src/worked-examples.json` follow individual input groups, conversions and related results; the capture manifest retains the original broad capture phases. Reduced motion starts each mode at a completed result and exposes Next result for manual inspection. Pausing also exposes that control. Help uses the same full-width H2/intro and 24px H3 treatment, with its list and phone top-aligned. It has independent playback and hover suspension, with no visible playback controls, and loops after a four-second ending hold. Reduced motion retains that completed still.

[Motion for React](https://motion.dev/docs/react-animation) was considered, but this touch sequence uses native [CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition) and keyframes. A persistent outer cue interpolates between captured key coordinates; an inner contact compresses and emits a ripple before the corresponding screenshot changes. Stage changes include a 450ms pause. Result holds use longer frame durations, and the final result has no cue. Container-relative units preserve alignment as the phone scales. Selected-mode images are decoded ahead only when visible and normal motion is enabled; image readiness gates advancement. Failure leaves readable guidance.

Mode navigation follows [WAI carousel navigation guidance](https://www.w3.org/WAI/tutorials/carousels/functionality/) with the existing Base UI-backed Button and shadcn Native Select. Mode descriptions were checked against the app's mode definitions, result definitions and Help recipes. The native screenshots provide the result order, values and highlighted components.

WebKit revealed that direct `/#help` navigation could land above Help after React expanded the preceding mobile fallback. Help restores that initial anchor after enhancement; ordinary scrolling and other anchors are unaffected. The regression test verifies its final position and independent playback.

Production-preview checks cover Chromium and mobile-width WebKit, complete mode/result progression, smooth touch movement and contact, conversions, keyboard navigation, independent/offscreen/hidden-document pause, reduced motion, 320–1440px layouts, 200% text, failed images, no JavaScript, public routes and automated accessibility scans. These checks do not replace a manual VoiceOver audit.

Final verification for this revision: TypeScript and production build passed, 18 unit tests passed, and all 32 Chromium/WebKit browser cases passed. Desktop and mobile screenshots were inspected outside the repository. The fresh in-app browser preview reported no warnings or errors.

## Fitted phone frame (October 23)

The generated frame's original display opening was taller than the captures and left visible vertical padding. The shared phone now removes a 134px-high straight section from the rendered frame, below its side buttons. Two clipped copies of the same cached asset preserve the corners and artwork at a uniform scale. The 862 × 1691 fitted canvas has a 724 × 1573 display opening, matching the 440 × 956 native layout within subpixel rounding. Calculation and Help use the same geometry. Native screenshots and touch coordinates are unchanged. The implementation uses documented CSS [clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/clip-path) and [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio).

## Repeating Help with native touch gestures (October 23)

Help now uses sixteen fresh native screenshots and their runtime tap/swipe coordinates from `docs/design/help-capture-manifest.json`. Runtime frames are in `src/help-captures.json`. The source sequence retains a 10 ft diagonal and pending 30° entry, opens the guide from More, scrolls its explanation, closes Help, computes sin(30°) × 10 ft, assigns the resulting 5 ft rise, and reopens the same article at the same reading position. Continuing to the practical applications supplies the final four-second hold before the automatic loop restarts.

The shared phone reuses the existing smooth cursor travel and contact/ripple animation for taps. Swipes add a relative travel path and a held contact; the next frame begins at the previous gesture endpoint to preserve continuity. The final hold hides the cue. Hover and viewport/visibility suspension remain in the shared playback mechanism; reduced motion retains the final still without any touch cue.

## Lint baseline (October 23)

The site now uses pinned development dependencies Oxlint 1.89.0 and `@shadcn/lint` 0.2.3 through one `.oxlintrc.json` configuration. This follows the official [Oxlint configuration](https://oxc.rs/docs/guide/usage/linter/config) and [shadcn React integration](https://github.com/shadcn-ui/lint/blob/main/docs/react.md). Both support the project's existing Node 22.12+ baseline. The shadcn JavaScript-plugin integration is documented as alpha; versions are pinned and the integration was verified locally. No separate ESLint installation is needed.

The native correctness category includes TypeScript, React and JSX accessibility rules. Hooks and effect dependencies are explicitly enforced. The four shadcn rules check component restyling, unknown classes, raw palette colors and inline styling. Only component-owned restyling inside `src/components/ui` is exempt, as the [rule documentation](https://github.com/shadcn-ui/lint/blob/main/docs/rules/no-restyle.md) prescribes. Arbitrary-value bans and type-aware linting are outside this baseline. Existing TypeScript checking and browser accessibility tests remain.

The initial findings were resolved with a semantic fieldset for mode controls, explicit bindings for the playback ref and state, and CSS-owned transforms driven by dynamic custom properties. The React ref rule remains enabled; ref `.current` reads remain in effects. The intended rendered behavior is unchanged. The [inline-style rule](https://github.com/shadcn-ui/lint/blob/main/docs/rules/no-inline-styles.md) explicitly supports dynamic CSS properties.

Temporary probes outside the repository verified that missing effect dependencies, component padding overrides, unknown Tailwind classes, raw palette colors and inline colors fail lint. Valid component variants, layout classes and dynamic CSS custom properties pass. Relative and aliased UI imports both resolve the project's Button variants.

`npm run lint` rejects warnings and unused disable directives; `lint:fix` applies safe fixes. `npm run check` combines lint, TypeScript and unit tests. `npm run build` also runs lint, so the production build and Playwright preview build enforce the same policy.

## Styling cleanup (October 24)

The dependency list now follows shadcn's `cn` package convention: `cn` remains the shared class-merging implementation, `src/lib/utils.ts` keeps the supported re-export, and unused direct `clsx` and `tailwind-merge` declarations were removed. Dependencies that still require `clsx` retain their own transitive dependency. The shadcn package is development tooling; its stylesheet import remains available during the production build. Existing package versions were preserved.

In `src/styles.css`, root tokens and global defaults live in Tailwind's base layer, and page components and responsive rules live in the components layer. The phone geometry and touch animations remain custom CSS in explicitly grouped sections. Dark surfaces, supporting text, Help/native backgrounds, and touch feedback use named color roles. Step and touch tints derive from their base colors using the original alpha values. No additional utilities or component wrappers were introduced.

Responsive rules are grouped together. Redundant wide-screen and mobile phone-size declarations, duplicate compact CTA declarations, and unused fallback heading/caption selectors were removed. Existing breakpoint thresholds and the phone aperture geometry are preserved. A temporary Playwright comparison outside the repository checked eight widths (320, 390, 740, 741, 900, 1050, 1051 and 1440 px); element rectangles were unchanged, and the six desktop/mobile hero, calculation and Help screenshots matched the baseline byte for byte. Browser validation uses the existing Playwright workflow because the Browser plugin is not available in this session.

Validation passed lint, TypeScript, production build, 18 unit tests and 32 Chromium/WebKit browser tests. Additional temporary probes verified page identity, absence of framework overlays and console errors, Cone selection, utility precedence over the component layer, and primary-token changes propagating to the active-step tint in both browser engines.

## Native content and Start rendering October 24

The native repository now exports schema-versioned Help content from the actual Swift catalog and its native label projections. The committed public snapshot identifies source revision `f85dd64` and its content digest. Site validation covers all 147 native recipes across the 50 proposed subjects; only explicit publication choices generate client article data. Contract tests exercise real grouped inverse-cosine keys, source coverage, and invalid mapping/export boundaries.

The site now uses pinned TanStack Start 1.169.4 and Router 1.170.46 with the existing Vite 8.3.5 and React 19.3.1. Installed Intent guidance and the official Start build/prerender documentation were consulted. Start precedes the React Vite plugin. Its generator owns the route tree. The public generator API regenerates route types for a clean-checkout typecheck; the production build prerenders complete HTML to `dist/client`. This static output remains suitable for the existing Cloudflare Pages project; dashboard settings have not been changed.

The marketing and policy HTML now have React route components with the existing content. Policy styles are scoped to their shell, so client navigation does not alter marketing typography. Cloudflare email exemptions remain in the rendered HTML. Unknown routes retain a 404 response and a useful navigation page.

Demo browser preferences and document visibility use `useSyncExternalStore` with a stable server snapshot. The server and first hydration render show completed stills. Browser snapshots start normal playback or retain reduced-motion results. Image mount callbacks also recognize prerendered images that loaded or failed before hydration. Native frame data, animation timing, hover suspension and manual result behavior are retained.

Migration validation passed lint, TypeScript, 29 unit tests and all 32 existing Chromium/WebKit browser tests. The six accepted desktop/mobile hero, calculation and Help screenshots matched byte for byte after migration. The temporary eight-width review recorded no browser console errors.


## First guide slice and static preview (October 24)

`/guides` lists only published subjects. `/guides/inverse-cosine` combines the native brace-angle example and inverse-cosine reference recipe beneath a concept-level title. Recipe titles become H2 headings and stable section anchors. Native settings, grouped key labels and spoken instructions, explanatory text and results remain in the exported data. The brace schematic uses inline SVG with the native textual explanation. The remaining mapped subjects are not linked or published.

The [shadcn Breadcrumb](https://ui.shadcn.com/docs/components/base/breadcrumb) and [Kbd](https://ui.shadcn.com/docs/components/base/kbd) components were added through the official CLI. The current breadcrumb is static text with `aria-current="page"`; its generated disabled-link role was removed. Kbd owns a guide-size variant. A narrow lint exception permits the named inline SVG image role, following [MDN's SVG accessibility guidance](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/img_role#svg_and_roleimg); all other lint rules remain enforced.

Each guide has a canonical URL, title, description, Open Graph metadata and factual TechArticle structured data. The sitemap includes only explicit content routes, excluding 404 and unpublished subjects. The homepage title now identifies the construction calculator and iPhone platform; the visible hero is unchanged. The favicon reuses Figure's native brand vectors. All HTML retains `noindex, follow`.

The separate Vite preview configuration serves only `dist/client`, including the generated 404 page. This checks the artifact intended for Cloudflare Pages instead of allowing a Start server fallback to hide absent prerendered files. Vite rewrites clean URLs before its HTML-serving middleware; the 404 handler allows existing rewritten files through. The static 404 omits hydration scripts so arbitrary missing URLs do not hydrate against a serialized `/404` match. Cloudflare's [documented static routing](https://developers.cloudflare.com/pages/configuration/serving-pages/) remains the deployment target; no hosting settings were changed.

Validation passed lint, TypeScript, content generation, production prerendering, 29 unit tests and all 44 Chromium/WebKit browser cases. New checks exercise JavaScript-disabled reading and navigation, complete native content, canonical and sitemap output, browser history and anchors, unknown-route status, narrow layouts and enlarged text, and automated accessibility scans. Desktop and mobile guide captures were inspected, with no console errors or horizontal overflow. Playwright was used because the Browser plugin was unavailable. The migration's existing marketing/demo regression tests also pass; automated accessibility checks do not establish complete WCAG conformance.


The standalone route-generation command calls the pinned public ESM `Generator`/`getConfig` exports already used by Start. The packaged CLI's CommonJS entry emitted a circular-dependency warning in Router Core; using the same generator through its ESM export avoids that path without patching dependencies or suppressing warnings.


## Scoped Typeset reading styles (October 24)

The official [Typeset stylesheet](https://ui.shadcn.com/typeset.css) was copied unchanged to `src/typeset.css` and imported after Tailwind, following the [integration guidance](https://ui.shadcn.com/docs/typeset). The CLI confirms Typeset is not a registry component; the builder supplies a standalone stylesheet. The copied source has SHA-256 `47e2af83b960d10cfa3196c9527bb0c143a71883f78e7da709cfca8de9576288`. It adds no runtime JavaScript or package dependencies. Figure's presets remain in the main stylesheet, so later source refreshes can preserve the product's reading choices.

Guide prose uses the guide preset for font size, leading and flow, with the existing stronger H2 hierarchy and heading tracking. The responsive preset accounts for Typeset's documented small-screen size adjustment. Section layout resets heading top spacing at explicit content boundaries. General paragraph and heading rules no longer live under `.guide-article`.

Support, privacy and the shared 404 content use the policy preset on their main content. Their navigation stays outside Typeset. The former duplicate policy heading, paragraph and list rules were removed. The legal shell defines its existing light/dark palette through scoped tokens used by Typeset, retaining the prior colors without changing the marketing theme.

Instruction lists, result panels, settings definition lists, result cycles and diagram figures use the documented `data-not-typeset` escape hatch. These blocks retain their own styles; shadcn key groups also have Typeset's automatic `data-slot` exclusion. Page shells, hero, mode navigation and demonstrations retain their existing layout ownership.

Validation: lint, TypeScript, 29 unit tests, static production build and all 44 Chromium/WebKit browser cases passed. Temporary Playwright probes verified policy layouts at 320, 390, 768 and 1440px, 200% text at 320px, keyboard activation of the support-to-privacy link, and dark-mode axe checks in both engines. Browser console captures were clear, and desktop/mobile screenshots were inspected. Calculator key sizing and result styles were preserved, as were the dark policy colors. The desktop hero screenshot matched its baseline pixel for pixel; mobile hero text and geometry were unchanged in the measured layout and visual review. The mobile background raster differed slightly between captures. Browser plugin not available; the existing Playwright workflow provided validation. Automated scans do not replace a manual assistive-technology audit.


## Guide discovery (October 24)

The marketing and guide pages share one header: Guides, Support and Get Figure. The old Explore/Guides conditional and mobile Explore-hiding rule were removed. The hero retains See it work as the direct demo link. Contextual links from the Help introduction and Support's How to calculate paragraph lead to the guide index; footer and article breadcrumb navigation remain available.

Lint, TypeScript, 29 unit tests, production prerendering and 14 relevant Chromium/WebKit cases passed. Temporary browser probes exercised keyboard navigation from home through the guide index to an article, both contextual entry links, consistent visible header links at 320–1440px, and no-JavaScript header navigation. Desktop and mobile captures were inspected; console captures had no errors. Browser plugin not available; verification used the existing Playwright workflow.

## Expanded guide template (October 24)

The six representative subjects now cover concept/reference merging, Circle mode, proportions, fan-law conditions, rafter cycles and calculator messages. Every subject has separate web concept copy in `content/guide-context.json`; native recipe wording, actions and values remain in the exported snapshot. The fan-law introduction cites Beckett Air and ASHRAE for the fixed-size/density and corresponding-operating-point assumptions.

Vite's documented lazy glob imports load one generated article module at a time. Summaries are a separate lightweight index; the full native snapshot and all article bodies are not a shared client import. Generated output is replaced on each content run so an unpublished article cannot leave a stale module behind.

All fourteen native schematic definitions are represented by the shared accessible SVG renderer, with original letter assignments, measurements and exported descriptions. Diagram geometry follows `HelpDiagramView` at the snapshot's native revision. Unknown diagram identities block publication. Native result disclosures use job-summary names where the app does and numeric cycles otherwise. Native related-example links resolve to published article anchors, and the subject map supplies related-guide links.

The declared square-area duplicate has identical execution, display settings and answers. It renders once with both source associations and anchors. Content validation fails if those examples diverge. The complete mapping still accounts for all 147 source recipes.

Validation passed lint, TypeScript, 32 unit tests, prerendering of all eleven current pages and twelve Chromium/WebKit guide cases. All six representative articles were captured and checked on desktop and mobile with no horizontal overflow or console errors. Browser plugin not available; the existing Playwright workflow supplied validation.


## Complete subject publication (October 24)

All fifty subjects are now explicitly published across the six mapped categories. The map is active, with stable concept-level slugs. Native app content remains unchanged. The current public snapshot still accounts for 147 native recipes; the one verified duplicate yields 146 rendered recipe sections while preserving both links.

Every article is prerendered, giving 55 static pages including the marketing, index, policy and 404 routes. The sitemap includes every published subject and excludes 404. The prelaunch noindex policy remains unchanged.

The new full-library browser contract checks all fifty articles without JavaScript in Chromium and WebKit: concept text, native instructions, settings, results, cycle summaries, accessible diagrams, source/alias anchors, canonical/robots metadata and internal example destinations. It also verifies keyboard-operated result disclosures and the retained square-area alias. All four browser cases passed, in addition to the prior template checks; static analysis and 32 unit tests passed.


## Searchable library and final review (October 24)

The index has category jump links and a responsive two-column subject list that becomes one column on phones. Search matches every query word across subject titles, summaries, category names, native recipe titles and authored/native aliases. Examples include brace angle, pipe wrap, fan speed and 1/32. A native output element reports the result count. Search uses the official shadcn Base UI Input, Field, Label and Separator sources; the input owns its 44px minimum height. Label explicitly forwards htmlFor, and the Field layout wrapper has no redundant group role. Genuine field groups retain FieldSet. No accessibility lint rule was disabled.

TanStack Router validates the query and stores it in the URL with replace navigation. Back restores the query after opening an article. Static hosting serves the same index HTML for query URLs, so the published index stays complete for SSR and first hydration. The public useHydrated/ClientOnly APIs then enable search. Without JavaScript the search control is absent and category/article links remain functional. Invalid non-text queries explicitly become undefined so raw router search values cannot reach the text filter. Search URLs retain the base index canonical.

The final visual review covered the desktop/mobile index, application search, article navigation, and all thirteen schematic variants currently used by recipes. SVG labels now use the native Canvas text-centering behavior; the OGEE Offset label sits clear of its dimension line. Browser request inspection confirmed only the selected article chunk is downloaded, with no unrelated guide bodies. Captures and temporary probes remain outside the repository.

Final validation passed lint, TypeScript, production prerendering and 38 unit tests. All original marketing/guide regression cases passed in the expanded run. After the malformed-query fix and SVG alignment adjustment, all eight affected full-library, keyboard disclosure, search/history, responsive and WCAG 2.2 automated-scan cases passed in Chromium and WebKit. The complete-library contract reads every article without JavaScript and checks content and internal links. New guide types were checked at 320px and 200% text. Browser console captures were clear. Browser plugin not available; validation used the existing Playwright workflow. This does not establish complete WCAG conformance or a manual VoiceOver audit.

Local commits only. The app source, public indexing policy and deployment settings remain unchanged.


## Support and Privacy design alignment (October 25)

The temporary standalone information pages now use the established Figure header, footer, page width, title scale, reading layout and breadcrumb. The existing guide breadcrumb became `SiteBreadcrumb`; its Guide index/article output is preserved while Support, Privacy and the shared 404 shell use a direct home/current-page trail. Current navigation links have a persistent underline. The 404 template inherits the same shell and provides an unambiguous Return to Figure link.

Support and Privacy sections now have stable anchors and one authored title/content record per section. The sidebar derives its links from those records. It is sticky on desktop and appears before the text on mobile; DOM order follows the navigation-before-content sequence. Support keeps email prominent in its introduction. Policy prose continues through Typeset with an 18px reading size and stronger section headings. The local dark palette and brighter dark-mode links stay inside the information main element.

This is an alignment with the existing design system rather than a new visual direction. No new imagery or UI library was needed. The page titles intentionally shorten Figure support/privacy to Support/Privacy because the shared brand and breadcrumb provide context. Every original paragraph and list item was compared against a pre-change capture and retained verbatim. Contact details, Cloudflare email exemptions, policy meaning and the October 21 update date are unchanged.

Verification passed lint, TypeScript, 38 unit tests and the static production build. Fourteen relevant Chromium/WebKit regression cases passed, with the 404 cases rerun after disambiguating its new home link. Temporary probes also checked both pages at 320, 390, 768 and 1440px, light/dark automated WCAG 2.2 scans, 200% text, WCAG text-spacing overrides, keyboard section navigation, Support-to-Guides navigation, and section links without JavaScript. All passed with no runtime errors. Before/after desktop, mobile and dark-mode screenshots were inspected for type, hierarchy, palette, reading width, navigation and content preservation. Browser plugin not available; the existing Playwright workflow supplied verification. Manual assistive-technology conformance remains unverified.

Local commit only; indexing and hosting settings are unchanged.

## SEO and release preparation (October 25)

Ten incremental local commits add release preparation without changing hosting, public indexing or native app content. The new static-artifact audit inspects all 55 generated pages for complete and unique metadata, one H1, canonical and Open Graph URL agreement, robots policy, valid JSON-LD, sitemap membership, duplicate IDs, internal destinations/anchors and existing image files. Breadcrumb structured data is checked against the visible trail. The 1200 × 630 social PNG and sharing-card tags are also validated.

Indexing is an explicit Vite build setting. Unset/preview remains `noindex, follow`; public is opt-in and rejected for a Cloudflare branch other than the recorded production branch `main`. Both build modes passed the four metadata/artifact cases before restoring preview output. Unit tests cover default, public and invalid/preview-branch settings. The authored dates in `content/page-updates.json` describe this actual content/metadata update; TanStack's supported per-page `sitemap.lastmod` consumes them instead of the installed generator's build-date fallback. Guide `dateModified` uses the same records. The site continues to prerender into `dist/client`, with 54 sitemap entries and a separately excluded 404.

Homepage `WebSite` data identifies Figure; guide `TechArticle` records have stable identifiers, website relationships, canonical article URLs and modification dates. Index, article, Support and Privacy breadcrumb records match their visible navigation. JSON-LD text escapes HTML opening syntax. The intended future publisher is TVR Works LLC, conditional on Apple's account conversion; no personal author credit or public App Store URL is confirmed. No author credentials, publisher status, app offers, ratings or reviews were fabricated.

Nine guide introductions now explain their measurements, formulas and representative answers before the unchanged native key sequences: feet/inches, length conversions, right triangles, roof pitch, duct offsets, circles, cylinders, airflow and stairs. The other subjects retain their existing concept-specific introductions. Exact length definitions link to NIST; the right-triangle explanation links to OpenStax. New numerical explanations were checked independently (mixed length, decimal feet, the 3–4–5 triangle, pitch ratio/grade/angle, pipe circumference and fraction rounding, cylinder volume, and airflow). The duct radius/wrapper values were compared to the captured native Help example. The library index explains its built-in Help source and reminds readers to check setup, units and display rounding. This is not a claim of formal third-party mathematical or professional review.

`npm run asset:social` renders a committed branded PNG from the existing Figure hero, mark and Geist font using the installed Playwright Chromium. No new runtime dependencies or assets from outside the established design were needed. Normal production builds simply copy the PNG. Open Graph and social-card fields share the existing route title/description; metadata and the card do not imply App Store availability.

Both normal-motion demos have a shared shadcn Button pause/resume control. An explicit user pause is separate from automatic viewport/hover/focus suspension and survives mode selection. Keyboard entry still suspends playback; reduced motion remains a still with manual calculation results. The full Help loop, native touch travel/contact, current-step highlight, manual results, media failures and no-JavaScript fallback remain covered. The controls and screenshots were inspected at 1440px and 390px.

A fixed local mobile probe used three cold Chromium loads per page, 390 × 844, 150ms network latency, 1.6Mbps download and fourfold CPU slowdown. It identified the hero atmosphere background as the LCP resource. Preloading that resource directly from HTML removes its CSS discovery delay; the duplicate explicit phone preload was removed (React retains its automatic hint), and demo screenshot/frame priorities are lower/lazy. Median homepage LCP changed from 3056ms to 2816ms, with zero measured CLS; the roof-pitch guide remained approximately 612ms with zero CLS. These are repeatable local lab observations, not deployed-host or field Core Web Vitals, and the homepage sample remains above 2.5 seconds.

Final verification passed lint, generated content/routes, TypeScript, 41 unit tests, production prerendering and all 58 Chromium/WebKit browser cases. The artifact audit covers every page; the native-content contract still accounts for all 147 recipes in 50 subjects. Additional temporary probes checked both paused demos with WCAG 2.2 automated scans and all nine expanded guides at 320px with doubled computed text sizes plus increased line/letter/word/paragraph spacing. A long word in the circle lede exposed horizontal overflow; the shared introduction now allows emergency word wrapping, with a committed regression case. The probes then passed with no unexpected console/runtime errors. Screenshots and arithmetic/performance probes remain outside the repository under `/private/tmp/figure-seo-release`. Browser plugin unavailable; verification used the existing Playwright workflow. Manual assistive-technology review and field performance remain unverified.

The local static preview now reads the current 404 artifact for each missing request, preventing stale stylesheet hashes after a rebuild; its styled header is checked in the browser contract. `.node-version` pins the tested Node 26.5.0 runtime. README documents reproducible builds, metadata/date maintenance, source and publisher boundaries, and separate Cloudflare preview/public release checkpoints. It also records remaining App Store/Smart App Banner, ownership verification, crawler-policy, sitemap-submission, acquisition-measurement and optional IndexNow work. Price display remains optional. There was no push, deployment, live Cloudflare setting change, public indexing change or analytics addition.

Primary guidance consulted: installed TanStack Start/Router Intent deployment and execution guidance; [Vite environment variables](https://vite.dev/guide/env-and-mode); [shadcn Base UI Button](https://ui.shadcn.com/docs/components/base/button); [Google sitemap dates](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap); [Google AI search guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide); [LCP diagnosis](https://web.dev/articles/optimize-lcp); [Cloudflare build runtime](https://developers.cloudflare.com/pages/configuration/build-image/). The earlier research remains applicable: no Google-specific `llms.txt`, FAQ rich-result markup or keyword-variation routes were added.


## Mode-focused icon controls (October 25)

Calculation playback now repeats the selected mode. Previous/next move between that mode’s completed results and pause playback, retaining the accessible result announcement. The three icon-only buttons are centered in a compact row immediately beneath the phone, outside its hover-suspension area. Help’s shared playback button is also icon-only beneath its phone. The existing Button gains a 44px icon size; fieldset/legend, accessible button names, titles, focus rings and reduced-motion/failure explanations preserve context without visible control text. Reduced-motion playback is disabled while result navigation remains available.

Production prerendering, lint and TypeScript compilation passed. The controls were visually reviewed in the existing in-app browser. No automated tests were added or run, as requested; prior suite results describe the earlier controls and automatic cross-mode tour. Existing test expectations for those behaviors were not changed in this UI-only pass. No deployment or indexing changes.


## Quieter guide preferences (October 25)

Repeated Example display tables no longer interrupt every recipe. A guide-level native details disclosure, Display and rounding settings, follows the worked examples. Identical preference sets render once; differing sets retain their example titles, so a setting is not attributed to an example that did not specify it. All original display values remain available without JavaScript. Input/setup settings and instructional settings stay beside their calculations, with a smaller Settings for this example heading. GuideSettings owns the shared definition-list formatting.

The roof-pitch page now has one optional display note instead of five copies of the same three preferences. The disclosure was opened and closed in the in-app browser to confirm that fraction precision, fraction format and angle decimal places remain available. The normal reading layout was visually reviewed. Production build, lint and TypeScript passed; no automated tests were added or run in this UI refinement. No native content, URL, indexing or deployment changes.


## Display-assumption footnotes (October 25)

Numbered footnotes replace the optional display disclosure. The current library has 23 guides with one declared display set, nine with two or three, and eighteen with none. A set shared by every example receives one citation beside the guide description. Mixed or partially declared sets receive citations beside the applicable recipe introductions. Settings are grouped by their complete declared values independent of their order; no undeclared preferences are assigned to an example. Each distinct set renders once in a small Display assumptions section after the worked examples. Calculation-dependent setup remains inline.

References and return links are ordinary anchors with descriptive accessible names. Footnote destinations receive fragment focus, and return links restore focus to their citations. Native HTML preserves reading and navigation without JavaScript. Roof pitch's single note and its round-trip navigation were visually inspected in the in-app browser; area/volume units confirmed two distinct notes with the correct per-example references and return destinations. Build, lint and TypeScript passed. No automated tests were added or run in this refinement. The underlying native content, example anchors, indexing and deployment remain unchanged.


## Unified visible result sequences (October 25)

The primary result callout and expandable Other results list are now one shared GuideResults presentation. Cycles render as a numbered sequence with a single Press = to continue cue; the initial output, subsequent outputs and explicit return-to-first entry are visible together. Where a numeric cycle explicitly names the repeated initial output, that name labels the first row. Existing authored result labels take precedence. The underlying native order, names, values and rounding are unchanged.

Single outputs use the same restrained row typography without sequence numbering. Longer job-based cycles continue to use the native jobNames and jobNote, matching the app's own rendering contract; numeric reference cycles are not substituted for those stages. The result layout stays next to its calculation step, so changed-input and multi-stage examples retain their context. Notes and selection instructions remain available. The old result-card/cycle-disclosure styling was removed.

The new rows align names and values on desktop, then stack them at narrow widths. Native ordered-list semantics expose sequence order without interactive disclosure state. The existing shadcn Kbd source supplies the compact key cue; its current official documentation was consulted. Production prerendering, lint and TypeScript passed. The complete roof-pitch sequence was visually inspected in the in-app browser at desktop size and at 390px; all five outputs were visible, with page width equal to viewport width. The temporary viewport was restored. No automated tests were added or run in this visual refinement; earlier disclosure-oriented test expectations describe the previous UI. No native content, route, indexing or deployment changes.


## Refreshed regression baseline (October 25)

The regression suite now reflects selected-mode playback, mode-named icon controls beneath the phones, linked display-assumption footnotes, and always-visible result sequences. State checks exercise every mode through its full loop and completed results in both directions, including wraparound and navigation from input frames. Browser checks verify keyboard activation, result announcements, explicit pause persistence, disabled reduced-motion playback, image failures and the independent Help loop.

The no-JavaScript guide audit now checks each section's complete result rows against native content in order, including the initial output, return entry and job-summary names/notes. It also verifies each example's exact declared display assumptions, deduplicated note count and return destination across all 50 guides. Focused keyboard cases cover both the shared roof-pitch note and distinct area/volume notes. Existing responsive and automated accessibility checks now include these representative layouts.

Verification passed `npm run check` (lint, content/route generation, TypeScript and 56 unit cases) and the full production-build Playwright run (60 Chromium/WebKit cases). The first targeted run caught two new test-fixture assumptions: the native pitch unit is written “inches”, and default WebKit Tab navigation skips links. Fixtures now use the native wording; cross-browser footnote checks explicitly focus links before Enter activation, then assert fragment destination and restored citation focus. No application changes were required.

Additional local desktop Chromium (1440 × 900) and mobile WebKit (390 × 844) probes confirmed page identity, HTTP 200, meaningful rendered content, no framework overlay or unexpected console/runtime errors, successful next-result interaction and no horizontal overflow. Controls and guide result screenshots were inspected; artifacts remain outside the repository under `/private/tmp/figure-regression-*`. Browser plugin unavailable; the existing Playwright workflow was used. This is local regression coverage, not deployed-host or manual assistive-technology verification. No deployment, public indexing or App Store integration changes.


## Cloudflare preview deployment (October 25)

With explicit approval, Pages build settings were saved as `npm run build` and `dist/client`, and `codex/figure-site-marketing` was pushed to the existing `tvanreenen/figure-site` repository. The initial successful preview deployment is `2fe84f47-1144-4eb6-923c-1273071c0c78`, built from `3077bcd`, at https://2fe84f47.figure-site.pages.dev. The stable branch alias is https://codex-figure-site-marketing.figure-site.pages.dev. The production deployment remains `8f5b07ed-51ad-4ae9-95fe-38999ac4d4e3` from main commit `e9f8627`.

Cloudflare's v3 builder detected the pinned Node 26.5.0 and npm 11.17.0, installed the lockfile, passed lint and TypeScript, and prerendered 55 pages. It uploaded only the client artifact; no Functions directory was deployed. All 54 content URLs returned 200 with preview `noindex, follow` metadata, Cloudflare's `X-Robots-Tag: noindex`, and production-domain canonicals. The 54-entry sitemap, robots file, 1200 × 630 sharing image and 19 directly referenced assets returned 200. HTML-extension and trailing-slash guide requests resolved to the clean URL. A missing route returned the styled custom 404 with `noindex, nofollow`. HTTP evidence is saved outside the repository in `/private/tmp/figure-cloudflare-http-checks.json`. Python urllib was rejected with Cloudflare error 1010; standard curl and the in-app browser worked without changing any bot/security settings.

Hosted browser checks exercised Cylinder's volume/surface-area previous/next controls, the guide footnote/return focus, and mobile Roof selection/result navigation at 390 × 844. These checks showed the expected native outputs, no mobile horizontal overflow and no unexpected browser console/runtime errors. No production deployment, public indexing, account permissions or crawler policies were changed. VoiceOver remains deliberately unverified at the owner's choice.
