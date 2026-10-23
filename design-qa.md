# Figure visual verification

Historical comparison report for the October 22 three-tab design. The October 23 complete-mode and separate Help implementation supersedes the layout, controls, asset references and test counts below. Current behavior and verification scope are recorded in [Implementation notes](docs/IMPLEMENTATION-NOTES.md).

Current result: passed after the second visual comparison.

## Sources and capture normalization

- Hero truth: `docs/design/concept-v2/full-page.png`, 1024 × 1536 pixels. Compare its first 800px to the browser capture at a 1024px CSS viewport and device scale 1.
- Adaptive truth: `docs/design/adaptive-input-loop/adaptive-input-loop.png`, 1374 × 1145 pixels. Compare to the same assigned Right Triangle state at 1374px CSS width, device scale 1.
- Browser captures: `docs/design/qa/desktop-1024.png`, `desktop-1440.png`, `adaptive-1374.png`, `visual-1374.png`, `help-1374.png`, `mobile-390.png`.
- Combined inputs inspected: `hero-comparison.jpg` and `adaptive-comparison.jpg` under `docs/design/qa/`. These put reference and implementation together at equal pixel widths, without browser chrome.

## First comparison

- [P2] The 1024px hero headline and description were noticeably smaller than the selected hero. Increase the tablet/desktop typography while retaining mobile reflow.
- [P2] The demonstration uses too much space for small explanatory metadata and its separate capture credit. Consolidate that footer and strengthen the proof headline/description hierarchy.
- [P3] Generated hero screen typography has small variations from the supplied native screenshot. The guided demos use exact app captures; the hero remains an illustrative product render.

## Intentional differences

The latest storyboard has three proof tabs rather than the four shown in the earlier image. Pricing remains unapproved and is omitted. Purchase buttons lead to an honest availability section. The real Figure brand replaces the generated concept's invented icon. Static native captures retain their exact interface text and disabled-key treatment, rather than the concept's fabricated active key labels. Responsive proportions are compacted to avoid a long reading page; the demo adds manual steps, text transcripts, and an optional larger view.

## Required surfaces

- Typography: self-hosted Geist variable font; responsive hierarchy, wrapping and fallback inspected. The first comparison's small 1024px hero text needs correction.
- Layout: dark hero, upright phone and right-biased blue arc, followed by one mineral-white proof region and compact footer. The shared phone remains in the same position across desktop tabs. Reduce metadata spacing before final comparison.
- Color: charcoal, white, mineral background and semantic accessible blue. Automated contrast checks passed all proofs and policy pages.
- Images: generated raster hero/background/frame, actual brand vectors, real native screenshots. No fabricated calculator diagram or keypad in the guided demos. Alpha and screenshot aspect ratios preserved. Larger view makes details inspectable.
- Copy: approved hero and revised three-proof copy. No unapproved price, feature-parity claim, account/signup flow or fake purchase link.

## Browser checks

The production build is tested in Chromium and WebKit. Tests include 320–1440px layouts, 200% computed text, keyboard tab activation, all nine modes, result order, Help stages, explicit/offscreen/focus/visibility pause, reduced motion, no JavaScript and failed screenshot loading. Visibility-event testing simulates the browser API boundary; offscreen behavior uses actual scrolling. Automated scans do not replace a full assistive-technology audit.

## Second comparison and resolution

Inspected `docs/design/qa/hero-comparison-final.jpg` and `adaptive-comparison-final.jpg` with reference and final browser render together. Focused checks: `hero-focused-final.jpg` for typography and `adaptive-focused-final.jpg` for native image quality and framing.

The 1024px hero now uses a 60px headline and 21px description, with the secondary action below the primary button. The proof headline is stronger, the separate capture credit is removed, and the controls retain their labels and generous targets. The final 1440px page measures 1983px tall, slightly above the original approximate 1900px budget to retain a legible full phone and manual controls. This is accepted: the page contains one compact proof area rather than three stacked demos or a long prose read.

The native screenshot's geometry, disabled keys and status bar differ from the generated concept because the production demonstration retains the actual app state. Its aspect ratio is preserved; the larger view exposes the same screen at readable size. The supplied real brand and three-tab structure are intentional changes. No actionable P0/P1/P2 visual findings remain.

Final captures use device scale 1 at 1440 × 900, 1024 × 900, 1374 × 1000, and mobile WebKit 390 × 844. Screenshots: `desktop-1440-final.png`, `desktop-1024-final.png`, `adaptive-1374-final.png`, `help-1374-final.png`, and `mobile-390-final.png` under `docs/design/qa/`. The implementation was also opened and operated in the in-app browser. No application console errors were observed on the final fresh load. Earlier development hot reloads logged transient errors while dependencies and components were changing; the final fresh load and production tests are clean.

All 7 unit tests and 22 Chromium/WebKit browser cases pass. The native screenshot viewer closes with Escape, returns focus, permits keyboard scrolling, and passes the same automated accessibility rules. Remaining P3: the generated hero's tiny app typography can be replaced with a photographed or composited product render later. A complete manual VoiceOver audit remains outside these checks.

final result: passed
