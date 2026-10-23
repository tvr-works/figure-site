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

The nine examples use 131 new native screenshots from the installed Figure 1.0 (3) app on the dedicated Figure Store phone simulator. The owner authorized starting that simulator. No iOS source changes were needed. Full-resolution PNG captures were exported as lossless 720px-wide WebP assets. `docs/design/worked-capture-manifest.json` records native action coordinates and readouts; `src/worked-examples.json` supplies playback frames. Older partial-input and separate visual-result assets were removed. The six existing native Help captures remain.

Right Triangle includes a 3 ft run and 4 ft rise, its 5 ft diagonal, conversion to 60 in and 1.524 m, and related side/angle highlights. Oblique Triangle uses 5, 6 and 7 ft sides. Circle, Cylinder, Cone, Ratios, Offset, Roof and Stairs each include their own solved example. The stair example reaches actual riser height, counts and a 12 ft 6 in required run. These are specific captured examples, not a claim of complete competitor parity.

`ProductDemo` owns mode/frame selection; `HelpDemo` owns its independent guide sequence. Shared `useDemoPlayback` synchronizes image readiness, reduced motion, viewport intersection, document visibility and timers. `DemoPhone` shares the native screen, frame, failure message and touch cue. This follows the React guidance on [reusing logic with custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks): the browser behavior is shared while each call retains its own state. Effects follow the documented [setup/cleanup contract](https://react.dev/reference/react/useEffect), including Strict Mode remount checks.

The tour advances to the next mode after the complete result hold. A vertical picker pairs mode names with capability summaries; smaller screens use the generated shadcn native select. Selecting a mode restarts its sequence. The section has a fixed “See how Figure works.” H2 and a smaller mode H3. Its visible Pause/Play control is removed; hovering over the phone holds playback and leaving resumes. Keyboard focus entering the calculation demo still pauses it; automatic progression never moves keyboard focus. Manual selection is announced. The visible explanation is one ordered list of five or six specific actions per mode, with subtle current-step emphasis. Rendered step indexes in `src/worked-examples.json` follow individual input groups, conversions and related results; the capture manifest retains the original broad capture phases. Reduced motion starts each mode at a completed result and exposes Next result for manual inspection. Pausing also exposes that control. Help has independent playback and manual frame controls; it holds the resumed article at the end.

[Motion for React](https://motion.dev/docs/react-animation) was considered, but this touch sequence uses native [CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition) and keyframes. A persistent outer cue interpolates between captured key coordinates; an inner contact compresses and emits a ripple before the corresponding screenshot changes. Stage changes include a 450ms pause. Result holds use longer frame durations, and the final result has no cue. Container-relative units preserve alignment as the phone scales. Selected-mode images are decoded ahead only when visible and normal motion is enabled; image readiness gates advancement. Failure leaves readable guidance.

Mode navigation follows [WAI carousel navigation guidance](https://www.w3.org/WAI/tutorials/carousels/functionality/) with the existing Base UI-backed Button and shadcn Native Select. Mode descriptions were checked against the app's mode definitions, result definitions and Help recipes. The native screenshots provide the result order, values and highlighted components.

WebKit revealed that direct `/#help` navigation could land above Help after React expanded the preceding mobile fallback. Help restores that initial anchor after enhancement; ordinary scrolling and other anchors are unaffected. The regression test verifies its final position and independent playback.

Production-preview checks cover Chromium and mobile-width WebKit, complete mode/result progression, smooth touch movement and contact, conversions, keyboard navigation, independent/offscreen/hidden-document pause, reduced motion, 320–1440px layouts, 200% text, failed images, no JavaScript, public routes and automated accessibility scans. These checks do not replace a manual VoiceOver audit.

Final verification for this revision: TypeScript and production build passed, 18 unit tests passed, and all 32 Chromium/WebKit browser cases passed. Desktop and mobile screenshots were inspected outside the repository. The fresh in-app browser preview reported no warnings or errors.

## Fitted phone frame (October 23)

The generated frame's original display opening was taller than the captures and left visible vertical padding. The shared phone now removes a 134px-high straight section from the rendered frame, below its side buttons. Two clipped copies of the same cached asset preserve the corners and artwork at a uniform scale. The 862 × 1691 fitted canvas has a 724 × 1573 display opening, matching the 440 × 956 native layout within subpixel rounding. Calculation and Help use the same geometry. Native screenshots and touch coordinates are unchanged. The implementation uses documented CSS [clip-path](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/clip-path) and [aspect-ratio](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/aspect-ratio).
