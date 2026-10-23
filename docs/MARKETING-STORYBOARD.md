# Figure marketing storyboard

Current implementation, October 23, 2026. The owner selected concept 3 and an App Store launch audience. The page now combines mode-specific inputs and visual results, with Help in its own section below.

## Working context

- Repository: `/Users/tim.vanreenen/Code/figure-site`
- Linked worktree: `/Users/tim.vanreenen/Code/figure-site-marketing`
- Branch: `codex/figure-site-marketing`
- Approved visual direction: [Concept 3](design/option-3-reference.png)
- Earlier review images: [Hero and page study](design/concept-v2/full-page.png), [proof-state study](design/concept-v2/four-proof-states.png)
- Native capture evidence: [Complete worked examples](design/worked-capture-manifest.json)

The earlier generated studies show superseded copy and proof tabs. They remain visual references; the specification below describes the implemented page.

## Positioning

Figure is a trade calculator for construction, fabrication and DIY on iPhone. Its modes adapt the keys to the calculation, its diagrams respond to entered dimensions and selected results, and its guides explain mathematical relationships and practical uses alongside the calculator.

Show that behavior through authentic examples. Experienced calculator users need evidence of capability; apprentices and newcomers need a clear workflow. Do not claim complete competitor parity or measured usability superiority. The owner wants an accessible one-time purchase without a subscription. Price and the public App Store URL remain unresolved.

## Page sequence and copy

| Region | Content | Purpose |
| --- | --- | --- |
| Hero eyebrow | Construction · Fabrication · DIY | Identify the intended work and audience. |
| Hero headline | Trade math. Made intuitive. | State the category and product proposition. |
| Hero description | Helpful modes. Adaptive keys. Visual results. Easy conversions. | Give the visitor a compact account of the value demonstrated below. |
| Hero actions | Get Figure / See it work | Link to availability and the mode demonstration. |
| Reassurance | No subscription. No account. No ads. | State the purchase model and absence of signup/advertising. |
| Compatibility | For iPhone · iOS 26 or later | State the current app requirement. |
| Calculation demonstration | See how Figure works. / Nine-mode navigation, active mode H3, five or six specific steps per mode and a framed native sequence | Combine breadth, adaptive keys, solved results, diagram highlights and conversions in one area. |
| Help | Built-in Help / Help without losing your place. | Show approachable guidance and continuity without leaving the calculation. |
| Help description | Worked examples, plain-language explanations, and practical uses, right alongside your calculation. | Explain what the guide provides. |
| Availability/footer | Figure for iPhone. / No subscription. Works offline. / Preparing for the App Store. | Give honest availability, support and privacy destinations. |

The calculation section has a fixed H2, “See how Figure works.”, above the active mode H3. There is no proof-tab navigation, separate Visual results section, All calculations inventory, clickable timeline, rotating explanatory sentence, duplicate transcript or larger-image viewer. Each active mode has one static ordered list with five or six specific actions. Help follows in normal document flow. The hero image remains stable.

## Complete mode examples

The native sequences include selection, required inputs, the answer and representative related results. Screenshots preserve the real keypad and diagram rather than implementing a second calculator in the browser.

| Mode | Inputs | Result evidence |
| --- | --- | --- |
| Right Triangle | 3 ft run, 4 ft rise | 5 ft diagonal, 60 in, 1.524 m, side and angle highlights |
| Oblique Triangle | 5 ft, 6 ft and 7 ft sides | Three angles and area; a non-right triangle |
| Circle | 5 ft diameter, 85° arc | Arc length, chord and segment rise |
| Cylinder | 4 ft diameter, 6 ft height | Volume and surface area |
| Cone | 6 ft diameter, 4 ft height | Volume and lateral area; real 2nd → Cone access |
| Ratios | 1 in : 4 ft, then 3 in | 12 ft; change the drawing measurement to 6 in for 24 ft |
| Offset | 10 ft length, 5 ft offset, 7 ft height | Centerline radius, wrapper length, heel and throat radii |
| Roof | 6 ft run, 9-in-12 pitch, 16 in spacing | Common rafter, hip/valley and jack results |
| Stairs | 7½ in target riser, 10 in tread, 9 ft 11 in rise | Actual riser height, riser/tread counts and 12 ft 6 in required run |

The stair capture uses the verified 80 in headroom and 10 in floor-thickness settings. Values, native readouts, frame order and tap positions are recorded in the capture manifest. These examples were captured from Figure 1.0 (3) on iOS 26.5.

## Interaction

The desktop mode panel lists all nine modes with short capability summaries. Small screens use a labelled native select. Visitors can choose a mode directly; normal-motion selection starts its complete demonstration. The automatic tour holds its results before moving to the next mode, then repeats after Stairs.

Each mode’s list follows the captured input order, separates measurements, and groups related results. Its highlight follows the active input, conversion or result. A smooth touch cue travels between real input coordinates, compresses and ripples on contact. Brief pauses separate the selection, entry and result stages. Result frames remain longer for inspection.

The calculation demo has no visible Pause/Play button. Hovering over its phone temporarily holds playback; leaving resumes it. Keyboard focus entering the demo pauses playback, and selecting a mode starts its sequence again. While paused, Next result advances within the selected mode. Reduced motion begins at a solved result, suppresses automatic movement and touch effects, and retains manual result navigation. Keyboard focus is not moved by the tour; entering it by keyboard pauses playback. Scrolling offscreen or hiding the document suspends timers without resetting the selected mode. Explicit pause persists when returning.

Calculation and Help playback are independent. Each waits for its image to load, decodes relevant upcoming images when visible, and retains readable instructions on media failure. No-JavaScript HTML retains the proposition, a completed triangle example, Help, purchase availability and public navigation.

## Help demonstration

The separate section uses the existing Find rise and run from a slant captures. A 10 ft slant and 30° example connect the mathematical explanation to a 5 ft rise. The guide includes practical applications to framing, sloping pipe/duct and ramps.

Its visible ordered list explains:

1. Open Help without leaving your calculation.
2. Close Help and try the steps. Your calculation stays in place.
3. Reopen the same guide at your saved reading position.

The sequence plays when visible and holds the reopened guide at the end. Pause/Play, Back, Next step and Replay remain local to Help. Reduced motion shows its useful ending and keeps manual controls. The retained article and reading position are within the current calculator session; no cross-restart persistence is promised. See [Help evidence](HELP-PROOF.md).

## Implementation and verification

Use the existing Vite, React, TypeScript, Tailwind and shadcn/Base UI stack. The hero, availability, footer and policy/support routes remain static HTML. Independent React islands own the calculation and Help demonstrations. Shared playback logic handles browser synchronization and image readiness; a shared phone component renders native media and touch cues. No animation dependency was added.

Responsive layouts and enlarged text use normal document flow. The extra Help section intentionally adds some scrolling, as requested. No scroll hijacking, mandatory tour or sound is required. Direct Help anchors are restored after enhancement of the taller mobile calculation section.

Verify complete native result order, unit conversions, mode selection, contact motion, pause boundaries, keyboard focus, reduced motion, failure/static fallbacks, responsive layout, enlarged text and public routes. Automated accessibility checks supplement browser inspection; they do not establish full assistive-technology conformance. Implementation details and primary documentation are in [Implementation notes](IMPLEMENTATION-NOTES.md).

## Launch and local commits

Price remains the owner's decision. The owner considered $4.99 once; the earlier $9.99 proposal was never approved. No price or fabricated discount appears on the page. Both Get Figure links lead to an honest availability section until the public App Store destination is verified.

Keep `noindex` until public launch is requested. Preserve `/support`, `/privacy` and 404 behavior. Hosting build settings must be updated for Vite before deployment, as described in the repository README. Work proceeds through checked local commits; this task does not authorize pushing or deploying.

Earlier discussions of named competitors and their observed October 22 prices are preserved in Git history. Any future public comparison needs a fresh, capability-specific check against primary sources.
