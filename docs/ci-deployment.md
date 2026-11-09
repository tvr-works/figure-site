# CI and static publication

## Current state and ownership

`tvr-works/figure-site` is public. Main publishes production and other repository branches publish previews through the existing Cloudflare GitHub App. Production indexing was enabled on November 9, 2026: keep production `VITE_SITE_INDEXING=public`, with preview unset or `preview`. The native Figure application is a separate private repository.

This implementation branch prepares CI and the publication gate. The live Pages command was `npm run build` at assessment time; the coordinator owns main integration and all hosting changes. Do not describe the gate as live until its cutover and negative publication test have been verified.

During this transition, every pushed implementation commit must start with `[CF-Pages-Skip]`. Pages recognizes this marker, while the push workflow still runs. Do not merge this branch, create a PR, change app installations or alter Cloudflare settings as part of branch validation.

## Validation

`.github/workflows/ci.yml` runs on pushes to every repository branch, pull requests and manual dispatch. Only successful **push** runs for the exact SHA and branch can authorize publication. PR checks validate merge integration; dispatch results are diagnostic and cannot satisfy the gate.

The workflow uses `blacksmith-4vcpu-ubuntu-2404` with Microsoft's Playwright 1.64.1 Noble image pinned by digest. The image version matches locked `@playwright/test` and is checked before installation. Browser binaries and Linux dependencies come from the image: no apt/browser-install step or browser cache is needed. Node follows `.node-version` (26.5.0), npm follows `packageManager` (11.17.0), and CI checks both. `npm ci` uses the committed lockfile. Existing application versions are retained; ranged declarations were pinned to their already-locked versions. Oxfmt is the only new development tool.

Actions are pinned to immutable commits. Repository permissions are explicitly read-only and checkout credentials are not persisted. Superseded runs are canceled per ref; the validation job has a 12-minute timeout. No Cloudflare token, deploy hook or other deployment secret is stored in GitHub.

Checks include:

- Formatting of maintained scripts, tests and build/CI configuration; the product's React source, prose, native Help snapshot and design files are outside this formatting pass.
- Existing Oxlint/shadcn rules, generated guide/route validation, TypeScript and unit tests, plus CI-gate, delivery-policy and deployment-verifier contracts. Focused Vitest/Playwright tests are rejected in CI.
- `npm audit --audit-level=high`, including development dependencies. The initial audit found zero high/critical findings, two low and four moderate development-tool/transitive findings. No major downgrade or broad upgrade was applied to silence those findings.
- The complete preview browser suite in Chromium and WebKit, followed by a public build's `@artifact` checks. The original 60 configured cases remain; six delivery/budget cases bring the full suite to 66. The public artifact selection runs eight cases.

The full suite covers all 50 guides, native recipe content, navigation/history/search, demo modes/results/animation, keyboard behavior, reduced motion, missing media, no JavaScript, automated accessibility and responsive/enlarged-text layouts. The spacing test uses element styles so it can still exercise user text-spacing changes without injecting a CSP-blocked stylesheet.

Failure reports, screenshots and traces are retained for seven days. Non-PR runs retain the tested public `dist/client` artifact for seven days. Uploads exclude source/design history and the server bundle. Cloudflare rebuilds the validated source; it does **not** deploy this retained artifact byte-for-byte.

## Delivery policy and budgets

Builds publish only `dist/client`. The finalizer rejects Functions/Worker/server entries and the native Help source snapshot in that artifact. Existing route discovery, page dates, contact links, copy and design remain unchanged.

Every known HTML route gets its own CSP hashes for inline bootstrap/structured-data scripts. Generated `_headers` rules fail the build beyond 100 rules or a 2,000-character line. The initial artifact uses 57 rules with a longest line of 631 characters. A global hash union would exceed Pages' line limit for the guide library.

Scripts require same-origin files or exact inline hashes; inline scripts and eval are not generally enabled. Stylesheets remain same-origin. `style-src-attr 'unsafe-inline'` preserves the demo's measured touch-coordinate CSS properties. Common headers set `nosniff`, referrer/permissions policy and `X-Frame-Options: DENY`. Unknown URLs use the static 404 body with an early meta CSP because their request paths cannot have individual header rules; the framing restriction remains in the common response header. The local static preview applies the same generated rules, and the real browser tests run under them.

Preview artifacts additionally send `X-Robots-Tag: noindex`; production artifacts omit this block. HTML keeps the existing mode-aware robots tags, with 404 always excluded. Both variants retain the production-canonical sitemap and existing crawler file; preview exclusion is enforced independently by HTML and response headers. Public indexing must not be moved into a global environment setting.

`build-budgets.json` bounds total JS/CSS/fonts, code linked by each prerendered page, actual browser-delivered code after hydration/first interaction, total demo media and the largest demo image. Initial measurements were approximately:

| Category | Measured | Limit |
| --- | --- | --- |
| All JS | 850 KiB raw / 240 KiB gzip | 1,050 / 300 KiB |
| CSS | 72 KiB raw / 13 KiB gzip | 90 / 18 KiB |
| Fonts | 29 KiB raw | 40 KiB |
| Homepage/browser code | 496 KiB raw / 149 KiB gzip | 640 / 200 KiB |
| Stair guide/browser code | 501 KiB raw / 153 KiB gzip | 640 / 200 KiB |
| All 147 demo images | 12.67 MiB | 16 MiB |
| Largest demo image | 179 KiB | 220 KiB |

These are source/delivery regression limits, not field Core Web Vitals guarantees. Investigate growth before increasing them; the per-route limits intentionally differ from a small company site's total-bundle budget.

## Publication gate and coordinator cutover

After integrating and validating the workflow/gate on main, the coordinator should change only the existing Pages build command to:

```sh
npm run ci:gate && npm run build
```

Keep project `figure-site`, its Git source `tvr-works/figure-site`, production branch `main`, output `dist/client`, domains `figure-site.pages.dev` / `figure.tvr.works`, automatic main production and all repository-branch previews. Preserve production `VITE_SITE_INDEXING=public` and preview unset or `preview`. No ownership, DNS, app-installation or credential changes are required.

`scripts/wait-for-ci.ts` queries this public repository's Actions API without credentials. It validates responses and selects the greatest run number, then rerun attempt, among exact SHA + branch + push matches. Only completed/success passes. Failed, canceled, skipped, neutral or unreadable CI fails closed; stale main success, PR checks and dispatches cannot substitute.

The protocol is adapted from the hardened company-site baseline and has 33 contract cases. It bounds each request to 15 seconds, backs off at 15/30/60 seconds and stops after 16 minutes. The 12-minute CI job budget leaves queue allowance and Pages build headroom; a long queue can still require retry. Public GitHub requests share the unauthenticated 60-per-hour/IP limit. Denial, rate limiting, malformed data, network errors and timeout block publication with diagnostics; no credential fallback is attempted.

Keep the gate/workflow reviewed: repository branches contain executable build configuration, so this is an operational publication gate rather than protection against a collaborator deliberately rewriting the gate. Branch protection is a separate coordinator decision. Older branches/worktrees, including `codex/figure-site-marketing`, must incorporate this infrastructure before their next publication; a missing `ci:gate` script must fail closed.

The coordinator should verify an intentionally failing **disposable preview** stops before the application build/deploy stage, then remove the failing test and verify a successful preview. Verify a successful main push and production identity as well. Do not merge the failure test into main. Skip-marked migration commits will not trigger these publications; use the coordinator's controlled post-cutover verification commits or Pages retries.

## Deployment verification and recovery

Every build emits a non-secret `build-info.json` containing the full source SHA and indexing mode, with `Cache-Control: no-store`. Source identity uses Cloudflare's SHA, GitHub's SHA, then the local checkout SHA, in that order.

Check the **supplied** origin and expected commit explicitly:

```sh
DEPLOYMENT_URL=https://DEPLOYMENT_ID.figure-site.pages.dev \
DEPLOYMENT_MODE=preview \
EXPECTED_COMMIT_SHA=FULL_40_CHARACTER_SHA \
npm run verify:deployment
```

For production, run with `DEPLOYMENT_MODE=production` against the immutable production deployment and then separately against `https://figure.tvr.works`. Public HTML and build identity are expected on both, but Pages' immutable hash hostname must have edge `noindex`; the custom production alias must not. The checker never substitutes or automatically visits another origin. It rejects redirects, wrong identity/mode, incorrect HTML/edge indexing, bad canonicals, missing script hashes/security headers, incorrect sitemap/crawler/social-image responses and a homepage fallback for unknown URLs. Requests are bounded and page concurrency is six; three CLI attempts allow short edge-propagation delays.

A failed Actions run leaves current production in place once the gate is live. A later successful CI rerun does not automatically retry a failed Pages build: retry that build after correcting the cause. Recover normal content with a revert through the same checks. An emergency Pages rollback is coordinator-owned and must be recorded and reconciled with main afterward.

The first [Blacksmith push validation](https://github.com/tvr-works/figure-site/actions/runs/42659644207) passed 102 unit/contract cases, all 66 preview browser cases and eight public artifact cases on commit `58184b2162d4e51ef1fa24118111d820c751f156`. Later contract coverage adds the immutable-hostname edge-indexing distinction. Actual final-tip validation is recorded in the task's final result. Live gated publication, the disposable failing-preview test and production smoke verification remain coordinator cutover work.

## References

- [Playwright Docker images and matching versions](https://playwright.dev/docs/docker)
- [Playwright CI and browser cache guidance](https://playwright.dev/docs/ci)
- [GitHub public API rate limits](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [Cloudflare Pages header rules and limits](https://developers.cloudflare.com/pages/configuration/headers/)
- [Cloudflare Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare skip build markers](https://developers.cloudflare.com/pages/configuration/git-integration/#skip-builds)

## Coordinator cutover record

Main integration `95b4874243e476fa777891039026bba3023bdd9f` passed [push CI](https://github.com/tvr-works/figure-site/actions/runs/42661427845) before the existing Pages build command changed to `npm run ci:gate && npm run build`. A fresh API readback preserved project `25b3fcdc-3929-4532-9338-5d41c838fb32`, organization source/repository identity, `main` production, enabled production automation, all branch previews, `dist/client`, domains, public production indexing and the existing preview policy.

The negative preview acceptance used commit `64f7538880043b3f90829580918f6961cd01ffcb` on `codex/ci-publication-verification`. [CI run 42662245430](https://github.com/tvr-works/figure-site/actions/runs/42662245430) failed only at the intentional probe test. Pages deployment `2286f35f-780c-4fb2-871e-04dd0e0a1111` rejected that failed run at the gate, before application build/publication; its deploy stage remained idle. Canonical production stayed `4a137ede-b353-4932-9d8e-a0294bd95e75` at `f17c8f7`. The intentional test never entered main. Positive preview and production checks use their own exact commit identities and mode-aware hosted verification.
