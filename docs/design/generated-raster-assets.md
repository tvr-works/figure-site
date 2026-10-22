# Figure generated raster assets

Generated with the built-in image_gen tool on 2026-10-22.

## phone-frame.png

- Native dimensions: 862 × 1825, RGBA, 256,776 bytes.
- Outside and display aperture have real alpha transparency. Center aperture pixel (420,900) has alpha 0. Exterior (0,0) has alpha 0.
- Nonzero-alpha device bounds: x16–845, y19–1800.
- Display aperture approximate bounding rectangle: x69–792, y55–1762, rounded corners. At horizontal center, island occupies approximately y72–141. Main straight aperture sides are x69–791.
- Approximate CSS percentage inset relative to image: left 8.00%, right 8.00%, top 3.01%, bottom 3.45%; use rounded clipping on screenshot beneath overlay.
- Limitation: generated aperture ratio ≈0.424, versus native app screenshot ≈0.460. Use contain and matching screen background; do not distort screenshots.
- No screenshot or fake screen content included.

### Exact generation prompt

Use case: product-mockup
Asset type: transparent phone frame overlay for an interactive website
Primary request: A single modern premium black iPhone device frame viewed exactly straight on, perpendicular camera, no perspective, centered upright portrait, intended to frame a real iOS screenshot underneath in HTML. Only the black metal outer body, very thin black bezel, small real side button details, and a compact black dynamic island pill should exist in this asset.
Composition/framing: canvas approximately 520x1100 or proportionally larger with a portrait ratio near 0.475; device fills the canvas with a tiny even transparent margin. Outer rounded rectangle with accurate modern iPhone proportions. Interior display aperture ratio exactly 1320:2868 (width:height). Bezel approximately 2.5% of device width on each side.
Style/medium: photoreal premium studio product render, subtle brushed graphite edges and controlled silver edge glints, restrained and realistic.
Constraints: TRANSPARENT BACKGROUND AND TRANSPARENT DISPLAY APERTURE. The large entire inner rounded rectangular screen is a literal alpha-transparent hole to composite real app footage behind it, NOT white, NOT gray, NOT black, NOT a checkerboard texture. Only the dynamic island pill floats in the transparent screen aperture. No screen content whatsoever. No screen reflection, no opaque glass, no screen fill. No words, brand logos, status icons, shadow or surrounding surface. Render just frame/bezel/body and island. The outside of the phone must also be alpha transparent. Upright exact front orthographic orientation, no tilt, no perspective.

## hero-atmosphere.png

- Native dimensions: 1586 × 992, RGB, 1,891,922 bytes.
- Near-black studio floor, right-biased large graphite circle and single blue arc; quiet left side for HTML copy.
- No text, device, logo or interface included.
- Decorative background: use empty alt or CSS background, hide from accessibility tree.
- Native output was slightly below requested 1920×1200, but retains requested ≈16:10 aspect ratio.

### Exact generation prompt

Use case: ads-marketing
Asset type: background-only atmosphere for a premium iPhone trade calculator landing page, 1920x1200 wide
Primary request: restrained near-black studio environment with oversized geometric construction markings. NO PHONE, NO PRODUCT, NO TEXT. Background image only, ready for HTML copy on the left and real product on right.
Scene/backdrop: dark graphite gently textured horizontal studio floor along bottom quarter blending seamlessly into a near-black charcoal backdrop. Subtle cool studio illumination at bottom right, faint realistic surface texture, sophisticated quiet atmosphere.
Composition/framing: landscape 16:10. Left 52% stays almost uniformly near black with generous quiet negative space for HTML headline. Right half includes one enormous very fine graphite-gray circle outline about 85% canvas height, centered at x77% y48%, partly extending beyond right edge. Across its upper edge a single small vivid electric-blue circular arc from approximately 10 o'clock to 2 o'clock. A few very fine gray radial construction lines and a horizontal chord connect its geometry. Keep these secondary; precise technical geometry, no labels, no measurements, no ticks or numerals.
Lighting/mood: subtle premium cinematic controlled soft studio highlights, physically realistic floor falloff. Minimal contrast so white copy remains legible.
Color palette: near-black #0c0f11 and cool charcoal, extremely restrained muted graphite lines, blue #009dff arc.
Constraints: Absolutely no iPhone, screen, device, logo, words, letters, numbers, buttons, UI, app icon, badge, watermark, people, tools or floating objects. No bright abstract smoke, no neon glow. No vignette rings except specified diagram.


## Web exports

Optimized WebP versions are used from `public/assets/`. Original generated PNGs are retained in `docs/design/source-assets/` and are not copied into the production build. `cwebp` 90-quality exports preserve alpha. Native app captures use lossless WebP at 720px wide, preserving screenshot content and aspect ratio.
