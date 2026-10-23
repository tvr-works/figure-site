# Implementation evidence

Checked October 22, 2026. Installed versions are pinned by the lockfile. Current stable packages at implementation: Vite 8.3.5, React 19.3.1, TypeScript 7.0.2, Tailwind 4.3.3, Base UI 1.9.0, shadcn CLI 4.22.1.

## Official documentation used

- [Vite multi-page builds](https://vite.dev/guide/build.html#multi-page-app): separate HTML entry points; Vite 8 uses `build.rolldownOptions`.
- [Tailwind with Vite](https://tailwindcss.com/docs/installation/using-vite): dedicated Vite plugin and CSS import.
- [Tailwind browser compatibility](https://tailwindcss.com/docs/compatibility): modern browser baseline; app iOS requirements do not define website compatibility.
- [shadcn Vite installation](https://ui.shadcn.com/docs/installation/vite) and [CLI](https://ui.shadcn.com/docs/cli): CLI-generated Base components, semantic tokens, source owned by this repository. Current CLI accepts `--base base --preset nova`, although the skill examples still spell the preset `base-nova`.
- [Button](https://ui.shadcn.com/docs/components/base/button), [Tabs](https://ui.shadcn.com/docs/components/base/tabs), [Collapsible](https://ui.shadcn.com/docs/components/base/collapsible): use generated compositions and Base UI APIs.
- [Base UI Tabs](https://base-ui.com/react/components/tabs): manual activation separates arrow-key focus from selection.
- [Base UI accessibility](https://base-ui.com/react/overview/accessibility): primitives handle interaction mechanics; labels, focus visibility, contrast and behavior still need verification in this site.
- [React createRoot](https://react.dev/reference/react-dom/client/createRoot): mount React in the demonstration region of an otherwise static page.
- [WCAG Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html): provide persistent playback controls for repeating demonstrations.

TypeScript 7 reports that `baseUrl` has been removed. The `@/*` alias uses explicitly relative `./src/*` paths instead. The Vite alias matches that path.

## App evidence

Native media is captured from the Figure app on a dedicated iOS 26.5 simulator, built without changing app code. Simulator screenshots from the MCP tool are optimized to 368px wide; `simctl io screenshot` is used for full-resolution source captures. Media is evidence of the captured examples, not a second calculator implementation or a claim of complete competitor parity.

## Verification-driven choices

Official docs were consulted again for [React effect cleanup](https://react.dev/reference/react/useEffect), [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), [Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [Playwright emulation](https://playwright.dev/docs/emulation), [accessibility testing](https://playwright.dev/docs/accessibility-testing), and [Tailwind overflow wrapping](https://tailwindcss.com/docs/overflow-wrap).

The enlarged screenshot viewer initially used shadcn's Base UI Dialog. Our installed Base UI 1.9.0 exposes unnamed focus-guard buttons to WebKit's accessibility tree, reproducing [the upstream issue](https://github.com/mui/base-ui/issues/5237). Rather than suppress that accessibility rule or patch library-owned DOM, this small viewer uses native `dialog.showModal()` following [W3C H102](https://www.w3.org/WAI/WCAG22/Techniques/html/H102) and [MDN's dialog reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog). The scrollable screenshot region is labeled and keyboard focusable. Tabs and buttons remain the generated Base UI components. The unused Dialog and Collapsible source files were removed.

The static support/privacy files remain at root-level HTML entry points so Vite and Cloudflare's extensionless route handling both resolve `/support` and `/privacy`. A directory-index migration failed the actual production-preview browser test and was corrected.

Pause responds to pointer clicks independently from keyboard focus. Only keyboard focus entering the running proof pauses through the focus handler; a pointer focusing Pause must not toggle it back to Play before the click arrives.

Static navigation/disclosure icons are exports from the installed Lucide library. Figure’s brand layers are copied directly from its app icon source; neither is an invented drawing.

## Adaptive demo playback (October 23)

The selected mode repeats its own input sequence. Selecting a different mode or returning to the adaptive tab restarts playback; reduced motion retains an assigned still. The visible explanation is one static ordered list, without a timeline, rotating caption, or duplicate transcript.

[Motion for React](https://motion.dev/docs/react-animation) was considered, but the small touch sequence uses native [CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/transition) and keyframes. A persistent outer cue interpolates its transform between captured key coordinates; an inner contact compresses and emits a ripple near the end of each frame, before the corresponding screenshot changes. The result holds without a cue before the loop restarts. Container-relative units keep targets aligned as the phone scales. Captures for the selected mode are decoded ahead of playback, with the existing image-load gate and readable failure state retained. Browser tests sample actual cue positions and contact scale in Chromium and WebKit, alongside repeat, selection, pause, visibility, keyboard, and reduced-motion checks.
