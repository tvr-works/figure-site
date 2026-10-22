# Adaptive keys: contextual demo revision

October 22, 2026.

The owner approved the current above-the-fold design. The proof area still needs development. This revision changes Adaptive keys only; it does not approve the other proof states or alter the hero.

## Review visual

[Contextual proof concept](adaptive-keys-context.png)

Generated with the built-in image generation tool using the current page plus actual launcher, Right Triangle and Offset screenshots as references. This is a static design concept for a guided mini demo, not a recording or interactive calculator.

## The proof

A visitor needs to see choosing a calculation change the calculator in place, then understand how those new keys are used. Preserve the diagram, readout, close control, mode/input keys, unit keys and enough of the fixed numeric keypad together to establish context. Stop using isolated key strips.

One large, anchored calculator stage occupies the demonstration area. A caption and visible tap cue explain the current action. In the production recording the app retains its native proportions and all five columns; do not reshape the app to fit the frame. The concept image illustrates composition rather than pixel-exact app layout.

Keep the four proof tabs. The approved hero remains the separate static product introduction.

## Proposed sequence

Timing is a planning estimate until real footage is recorded.

| Beat | Visible action | What it establishes |
| --- | --- | --- |
| Choose | Show the real launcher. Tap Right. | The mode choice exists in the calculator itself. |
| Adapt | The same key allocations now show Run, Rise, Diagonal and Pitch. Keep the number keys anchored. | Mode-specific controls replace the launcher keys in place. |
| Use | Enter 3 Feet and assign Run, then 4 Feet and assign Rise. Show the actual taps and updating readout. | The new keys have a useful role in the workflow. |
| Solve | Press equals and hold the 5 ft diagonal with the matching diagram. | The controls connect to a real measurement and result. |
| Return | Tap the native Close control. Show the launcher again. | The actual way to choose a different calculation. |
| Adapt again | Tap Offset. Length, Offset and Height appear in the same area. | The first change was not a one-off special screen. |
| Broaden | After closing Offset, optionally choose Stairs and show Riser, Tread, Headroom and Floor. | A more involved job receives its own controls. |

Aim for a readable short sequence, initially about 15–20 seconds. Measure the actual capture before fixing its duration. Do not require visitors to watch it through; let them pause or jump between the three broad stages Choose a mode, Use its inputs and Choose another.

Do not solve a full offset and stair job in this proof. Those longer examples belong in Trade calculations. Right Triangle is enough to connect the adaptive keys to an actual result.

Switching modes changes the keys. Repeated equals changes the displayed result within a mode. Do not imply that cycling results changes the mode keys.

## Presentation

- Start with a brief contextual view of the calculator, then settle into one readable frame.
- Keep its diagram, readout and keypad visibly connected.
- Emphasise the actual tapped control with a restrained cue; do not detach or float the keys.
- Avoid camera motion that makes fixed keys appear to move.
- Keep any zoom gentle and anchored to the same app geometry.
- Preserve five-column key allocations and native aspect ratio.
- Keep captions short and action-specific, such as Choose Right, Assign Run, or Choose Offset.
- Pause and Replay remain visible. Next mode advances the guided recording through the actual Close/launcher path; it is not an invented native app control.
- Native screen captures and recordings are the production evidence. Generated stills are composition studies.
- Use trustworthy recorded timing for production tap overlays. Do not invent exact tap times from still images.

## Existing copy

The right keys for the calculation.

Choose a mode to bring its inputs and functions onto the keypad.

The copy is retained while the visual explanation is developed. The central change is the demonstrated cause and effect, not an added marketing claim.

## Evidence inspected

- App/Calculator/Keypad/KeypadDefinition.swift: launcher controls and fixed allocations.
- App/Calculator/Keypad/ModeKeyDefinitions.swift: Right Triangle, Offset and Stairs replacements.
- App/Calculator/Keypad/KeypadPresentation.swift: mode and unit-specific presentation.
- UITests/CalculatorUITests.swift: Close precedes choosing another mode.
- UITests/ReleaseScreenshotsUITests.swift: actual 3–4–5 sequence and existing capture scenarios.
- docs/release/screenshots: actual initial, Right Triangle, Offset and Stairs screens.

## Exact generation prompt

Use case: ui-mockup.
Create ONE refined, high-fidelity website COMPONENT concept for Figure's "Adaptive keys" proof. The user approved the hero above the fold and wants ONLY the proof area developed. Do NOT include, redesign or reproduce the hero, header or purchase footer. This is a scoped refinement, not a new visual direction.

TARGET DIMENSIONS: 1440px wide x 1200px tall. A single desktop light demonstration area with four proof tabs and ONE large contextual calculator demo stage. Refined mineral-white surface, near-black bold readable neo-grotesk typography, electric-blue selection, generous whitespace, subtle rules, the same premium precise tone as Image 1.

REFERENCES:
Image 1 is the approved full-page marketing style, with an OLD isolated-key-strip proof that must be REPLACED.
Image 2 is the real Figure initial calculator with the mode chooser keys (Right, Oblique, Circle, Cylinder, Ratios, Offset, Roof, Stairs).
Image 3 is the real solved Right Triangle calculator.
Image 4 is the real solved Offset calculator.
Use genuine app-screen composition from Images 2–4, keeping the complete FIVE-COLUMN keypad, stable numeric and arithmetic locations, white rounded keys, green mode labels, blue functions, orange 2nd, diagram, inputs and readout together. Never rearrange or simplify the real app UI. The proof requires the CALCULATOR CONTEXT, not a cropped row of detached keys.

LAYOUT:
Top full-width heading exactly "Built around the calculation."
Beneath a restrained single row of four text tabs: "Adaptive keys" selected blue and underlined, "Visual results", "Trade calculations", "Help & recall".
Below, left 40% width: headline exactly "The right keys for the calculation." and sentence exactly "Choose a mode to bring its inputs and functions onto the keypad."
Then a small contextual current-action caption in blue "Right Triangle · Enter run and rise".
An understated three-step text sequence below the caption: "Choose a mode" → "Use its inputs" → "Choose another". Mark the middle step selected with blue text, no pill cards.
At bottom left small controls "Pause" and "Replay", indicating this is a short guided demo. Do not add a generic video-platform chrome, timestamps, a fake native mode menu, or a full browser calculator.
Right 60%: ONE LARGE, STRAIGHT-ON contextual view of the actual Right Triangle app from Image 3, occupying roughly 400px width x 865px height within this landscape composition. It should have NO hardware phone bezel; it is enlarged real app content. Show the full diagram and 5 ft 0 in readout above the entire five-column keypad down through the equals and plus keys, so the visitor sees where the mode-specific controls sit relative to number and unit keys. Preserve the source image proportions, let the stage occupy the necessary height rather than squash the app.
A very subtle blue tap ring over Run with a tiny local caption "Assign run" may illustrate a recorded tap, without obscuring the key. Very gentle blue emphasis around the mode-specific two-row region is acceptable, but don't extract, detach or duplicate it. All numeric keys stay clear.
Below the large app image, a restrained local caption "Guided example · Right Triangle" and simple sequence position indicator "2 / 3". A quiet "Next mode →" link may advance the GUIDED DEMO, which explicitly uses Close before returning to the launcher; this is not an invented in-app mode-switch button.

NARRATIVE TO IMPLY IN THIS ONE CURRENT FRAME:
The mini demo first shows the original launcher and a tap on Right, then the native mode keys become Run/Rise/Diagonal/Pitch in their actual positions, then numbers and units are entered and the result is read, then Close returns to the launcher and a tap on Offset brings its Length/Offset/Height keys. The web demo can pause on any stage. Do not place multiple calculator screens side-by-side in this component; a single anchored calculator changes state in the same position. No isolated strips, comparison cards, fake app controls or decorative diagrams outside the app.
Use readable type and keep all copy fully visible. No pricing, new slogans, feature inventories or unrelated additions. This is a visual concept of a video-like guided sequence, not a claim that the image itself is animated.
