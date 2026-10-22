# Adaptive keys: framed input loop

October 22, 2026.

The owner wants the iPhone frame retained and a repeating demonstration across every mode: select the mode, enter a number and unit, assign the value. This replaces the previous detached calculator treatment and longer worked-example sequence. The hero remains approved; the other proof states remain under development.

## Current concept

[Framed adaptive-input concept](adaptive-input-loop.png)

Generated with the built-in image tool, using the earlier proof as the edit target, the approved page for the iPhone-frame treatment, and actual launcher/triangle screenshots for app grounding. This is a static review frame for the proposed animation, not recorded app footage. The one-input 12-inch state is a generated illustration and needs an actual native capture before production.

## Copy

Headline:

> Build your calculation.

Description:

> Choose a mode, enter a measurement, and tap what it represents.

Timeline:

**Select mode → Enter measurement → Assign**

The three labels are stable. The active step and its short contextual value change with the demonstrated taps. For the frame shown: Right Triangle / 12 in / Run.

Calculation describes assigning known inputs more directly than formula, which can suggest writing an algebraic expression. The sequence demonstrates an understandable interaction without relying on the word intuitively as an unsupported performance claim.

## One repeated pattern

1. Show the native launcher and tap a mode.
2. Hold briefly as the mode-specific keys appear.
3. Tap 1, 2 and Inch.
4. Tap the relevant input key.
5. Hold the assigned value and its matching diagram/legend.
6. Tap Close to return to the launcher, then continue with the next mode.
7. Repeat the complete mode sequence while this proof is active and visible.

Keep the numeric input simple and consistent. Use 12 inches across the dimensional inputs below rather than introducing fractions or a different unit in every pass.

Do not include a full worked problem, another required input, Equals or a result tour in this proof. Those belong in Visual results and Trade calculations. The cause and effect here is mode selection, adapted controls and assigning a known measurement.

## Mode plan

The source declares nine CalculatorMode cases. The launcher has eight primary choices; Cone uses the existing secondary action on Cylinder.

| Mode | Native selection | Example entry | Assignment |
| --- | --- | --- | --- |
| Right Triangle | Right | 12 Inch | Run |
| Oblique Triangle | Oblique | 12 Inch | a |
| Circle | Circle | 12 Inch | Diameter |
| Cylinder | Cylinder | 12 Inch | Diameter |
| Cone | 2nd, then Cylinder / Cone | 12 Inch | Diameter |
| Ratios | Ratios | 12 Inch | A |
| Offset | Offset | 12 Inch | Length |
| Roof | Roof | 12 Inch | Run |
| Stairs | Stairs | 12 Inch | Rise |

Ratio inputs accept quantities, so a dimensional A value is supported. No angle is used as the first assignment in this sequence. Show Cone's real secondary-action selection rather than inventing a ninth primary launcher button.

During capture, start each pass from a controlled state and preserve the native visible transition through Close and the launcher. Handle any retained input state before recording the pass; do not fake cleared values or a completed solution. The exact resulting diagrams and readouts come from the app, including partially specified geometry where applicable.

## Framing and motion

- Retain one large upright iPhone with the same frame treatment as the approved hero.
- Keep phone scale, position, screen aspect ratio and all five keypad columns anchored across the sequence.
- Keep the diagram, readout, mode keys, unit keys and numbers visible together.
- Use restrained tap cues tied to actual recorded events.
- Highlight Select mode, Enter measurement and Assign as each stage happens. Reset the timeline at the next mode.
- Display the current mode and position, for example Right Triangle · 1 of 9 modes.
- Include Pause and Next mode. Next mode advances the guided demonstration through the real selection path; it is not an added native app button.
- As an initial pacing proposal, allow roughly 4–6 seconds per mode, with readable holds. The complete nine-mode loop could take about 45–60 seconds, but each pass explains itself and visitors need not watch them all. Confirm timing from actual footage.
- Loop only inside the active Adaptive keys proof. Do not cycle the other proof tabs automatically.
- Pause when offscreen, the document is hidden, the visitor requests it, or focus/hover requires stopping to inspect. Manual pause persists.
- Reduced motion starts on a useful still with manual stage navigation; no automatic repeating motion.
- Do not expand the page into nine sections or nine comparison cards.

The owner's request to repeat this mode sequence supersedes the earlier specification that all proof replays stop after one pass. It does not change the broader page's static hero or the other proofs' playback rules.

## Evidence

- CalculatorMode.swift declares the nine modes.
- KeypadDefinition.swift defines the actual launcher, secondary Cone action and fixed keypad allocations.
- ModeKeyDefinitions.swift supplies the mode-specific assignment controls.
- RatioWorkspace.swift accepts a Quantity for each ratio slot.
- WorkspaceInput.swift validates dimensional workspace inputs.
- Existing guide/UI-test sequences establish selection, dimensional entry and assignment patterns.

No production animation or website code is built by this revision.

## Exact generation prompt

Use case: ui-mockup. Scoped refinement of ONE Figure marketing proof component.
Create realistic, production-quality UI with clear hierarchy, strong readable typography, intentional product imagery and purposeful spacing.

TARGET DIMENSIONS: 1440px wide x 1200px tall. One desktop proof section. This is a STATIC REVIEW FRAME representing an animated looping demonstration, not a recording. Do not show the hero, navigation header, purchase area, price or footer.

INPUT ROLES:
Image 1 is the EDIT TARGET, the current contextual Adaptive keys component. Preserve its mineral-white surface, blue accent, dark type, four-tab architecture, left copy / right calculator composition. Make only the requested structural/copy changes below.
Image 2 is the APPROVED iPhone frame/style reference from the full page. Keep this type of premium slim upright black iPhone frame around the calculator, now straight-on with authentic portrait proportions. The user explicitly wants the phone frame retained in the proof.
Image 3 is the REAL Right Triangle app screenshot, product-UI grounding: preserve the native FIVE-COLUMN, EIGHT-ROW keypad and its exact layout, white rounded keys, green mode labels, blue functions, orange 2nd and fixed numeric positions.
Image 4 is the REAL launcher app screenshot, grounding for the mode-selection step that occurs earlier in the animation.

REVISED COMPONENT:
At top retain the section heading 'Built around the calculation.' with a readable disciplined scale, not a giant banner.
One quiet horizontal row of four tabs: 'Adaptive keys' selected blue underline, 'Visual results', 'Trade calculations', 'Help & recall'.

Left half:
Replace the old 'The right keys for the calculation' headline with EXACT copy 'Build your calculation.'
Replace old subtitle with EXACT copy 'Choose a mode, enter a measurement, and tap what it represents.'
Below, a legible THREE-STEP HORIZONTAL TIMELINE with numbered circles, fine connectors and the exact step labels:
'Select mode' -> 'Enter measurement' -> 'Assign'.
The first two steps are completed quietly; the third 'Assign' is currently selected blue. This timeline explains the repeating interaction, rather than telling a long story.
Under the step labels, small action-specific values:
'Right Triangle' under Select mode; '12 in' under Enter measurement; 'Run' under Assign.
Quiet current caption below: 'Right Triangle · 1 of 9 modes'.
Small accessible controls at lower left 'Pause' and 'Next mode →'. No separate secondary mode-tab rail, three card states or list of every mode.

Right half:
ONE large, premium, straight-on black IPHONE FRAME and Dynamic Island, using Image 2 as frame reference. Keep the genuine phone portrait proportions and app aspect ratio; do not squash the app wider to fill space. Show the WHOLE PHONE, including all its keypad and the result area, about 400px wide x 870px tall. The phone is anchored in one position throughout the intended loop.
The phone screen is based on authentic Image 3 but depicts a SINGLE ASSIGNED INPUT, not a solved triangle. Mode is Right Triangle. The user has selected the mode, typed 1 then 2, tapped Inch, and assigned it by tapping Run.
Represent the current frame coherently:
- Green mode keys remain Run, Rise, Diagonal, Pitch and an unused dash, with the source's other fixed keys preserved.
- Current native caption 'Right Triangle · Run'; prominent value '12 in', with no 5 ft diagonal answer or 3–4–5 solved values.
- Setup legend has x = 12 in; unknown y, r and angles use dashes. Show an honest dashed schematic placeholder triangle because one side alone does not determine a solved shape. Do not show a fabricated fully solved triangle.
- A restrained blue translucent tap ring centered on the Run key indicates the assignment action; no big floating tooltip, hand, finger or cursor that blocks labels.
- Keep unit and numeric keys in view so visitors understand the number/unit entry.
- Retain white app screen, dark numbers, colored real function keys. Do not restyle the iPhone app to match the website.
No extra device screens or detached key strips.

INTENDED MOTION (convey in the still through the timeline):
Each loop pass shows native launcher -> choose mode -> digit(s) -> unit key -> assignment key -> brief hold -> native Close -> launcher before the next mode. The actual sequence repeats through Right, Oblique, Circle, Cylinder, Cone, Ratios, Offset, Roof and Stairs, then loops. When choosing Cone, the recorded app uses 2nd then Cylinder; do not draw a separate fictitious Cone launcher button. This screenshot shows only the Right Triangle assignment frame; do not crowd all nine modes into one image.
No Equals or full worked problem in this adaptive-key proof; it demonstrates the same simple input pattern across changing modes. Solving belongs in the other proof tabs.
Avoid decorative cards, bento grids, feature inventory, extra slogans, coffee comparisons, subtitles that repeat the timeline, stretched screenshots, clipped copy and unknown UI. Preserve the approved aesthetic while making the framed calculator and three-step loop unmistakable.
