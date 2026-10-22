# Third proof: Help without losing your place

October 22, 2026. Storyboard refinement based on the owner's description of integrated Help.

## Purpose

Show that practical guidance and approachable mathematical explanations are part of the calculator workflow. Help can appear over the current calculation and return to its previous article and reading position when reopened in the same calculator session.

A clear interface can make the controls understandable while a guide helps someone approach an unfamiliar concept or application. Do not claim Help is unnecessary, that visitors should already know the math, or that Figure makes every calculation immediately obvious.

## Recommended copy

Proof navigation: **Built-in Help**

Headline:

> Help without losing your place.

Description:

> Bring up worked examples, explanations, and practical uses alongside your calculation. Return to your guide where you left off.

The words right alongside and where you left off need visible evidence. Do not add the slogan No manual required while demonstrating a substantial guide library.

## Demonstration

Keep the same framed iPhone and stable position used in the first two proofs.

| Beat | Actual app action | Visible proof |
| --- | --- | --- |
| Find guidance | Open Help from the current calculation and find a relevant topic. | Native Help sheet appears over the calculator. Do not suggest an external website or automatic topic detection. |
| Understand | Show a plain-language explanation and its diagram, followed by a short worked example. | The guide explains a relationship and how to apply it. |
| Connect to work | Briefly reveal the guide's Also useful for section. | The same concept has recognisable applications to trade work. |
| Try it | Dismiss Help and use the retained calculation. | No re-entry of the existing setup is required simply to read Help. |
| Resume | Reopen Help. Hold on the same article, reading position and expanded content where applicable. | The visitor visibly picks up reading where they left off. |

These five beats can sit under a three-stage website timeline: **Find guidance → Try it → Resume reading**. Explanation and practical applications happen inside the first stage, rather than creating additional top-level proof tabs.

Use the actual More → Help access path. Do not invent an in-app persistent Help tab or a drag gesture to reopen Help unless the current app has it. The phrase bring it back up refers to reopening its native sheet, not a new control.

## Example to capture

Use Find rise and run from a slant:

- The guide's Which function? section explains how cosine gives horizontal run and sine gives vertical rise for an angle measured from horizontal.
- A 10 ft slant at 30° supplies worked steps.
- Also useful for names diagonal framing braces, sloping pipe or duct, ramps and projecting an angled support.
- The diagram and instructions connect the concept to the practical task.

Capture a calculation state compatible with the selected example. Do not use a completed 3–4–5 screen and imply that an unrelated 10 ft/30° example is the user's same input.

An alternative is Find a brace's angle, which includes a Why cosine? explanation and practical uses. Choose the clearest readable captured guide, not the one with the longest feature list.

## Presentation

- Keep the calculator visibly behind the medium Help sheet at the opening moment.
- Expand or scroll the sheet when needed for readable content.
- Use a few readable holds; do not scroll rapidly through a catalogue of articles.
- Give the return-to-reading moment a clear hold. The retained scroll position is part of the product value, not an incidental transition.
- Keep the proof usable without audio.
- Avoid language about being bad at math. Present guidance as useful both for learning and for a quick refresher.
- Keep the established pause, reduced-motion and offscreen handling.

## Scope and evidence

CalculatorHelpState is owned by CalculatorScreen. It stores query, navigation path, per-article offsets, expanded details and the sheet detent. CalculatorHelpSheet uses the shared state when presented again. HelpArticle restores the saved offset after layout.

UITests/HelpReadingUITests.swift contains a close-and-reopen reading-position check. This revision inspects that source; it does not claim a fresh runtime test.

The retained Help state is within the current calculator session. Do not promise that the article and scroll position survive force-quitting or restarting the app without separate evidence.

App/Help/Content/MathAnglesGuides.swift contains the worked slant example, concept explanation, diagram and practical uses. MathBasicsGuides.swift contains further explanations, including Why cosine?, square/root relationships and pi/circumference.

## Three-proof page structure

1. Adaptive calculations: mode-specific keys and diagrams respond as values are assigned.
2. Visual results: one solved setup, related outputs and matching component highlights.
3. Built-in Help: explanations and practical guidance stay close to the calculation and retain the reader's place.

The separate Trade calculations proof is retired; its range appears through the mode loop, specialist result examples and All calculations inventory. Recent Values remains in that inventory or a small supporting capability item. It does not compete with Help for the third demonstration.

No app behaviour or website implementation is changed by this document.
