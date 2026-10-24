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
