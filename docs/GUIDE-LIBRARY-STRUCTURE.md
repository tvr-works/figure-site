# Figure guide library structure

Implemented library structure, October 24, 2026.

Each web guide has an enduring subject, an explicit URL slug, and a title that can improve over time. Worked examples belong to that subject. A brace, pipe, waste allowance, or set of sample dimensions gives readers a practical way to understand the relationship.

The library has 50 subjects across six browsing categories. It accounts for all 53 current native Help topics and 147 recipes, including worked examples and reference entries. The article boundaries follow subject matter and reader tasks. The landing page keeps its existing calculation and Help demonstrations, with a Guides link into the library.

The complete source mapping is [guide-subject-map.json](design/guide-subject-map.json). It references the native catalog at Figure commit `c15f25e5ae168df4b1275a9fd2ba75f896f325f6`. All 50 subject routes are implemented and prerendered. `content/native-help.json` records the current exported source revision; `content/published-guides.json` is the explicit publication list.

## Guide identity

A guide keeps these fields separate:

| Field | Purpose | Inverse cosine example |
| --- | --- | --- |
| `id` | Stable identity for relationships and content mappings; retained when a title or slug changes | `guide-inverse-cosine` |
| `slug` | Explicit public path segment | `inverse-cosine` |
| `title` | Reader-facing subject heading | Inverse cosine |
| `summary` | Explain the subject's scope in familiar language | Find an angle from a cosine ratio or from horizontal reach and sloping length. |
| `categoryId` | Browsing location; excluded from the public route | `math` |
| `searchAliases` | Alternative names and applications for the site's search | Arccosine, acos, brace angle, angle from two sides |
| `featuredSectionId` | Select an existing native example or reference to introduce the subject | `math-brace-angle` |
| `sourceRecipes` | Exact native topic and recipe references, with explicit article section IDs | `math-brace-angle/math-brace-angle` and `angles-trig/trig-inverse-cosine` |
| `relatedGuideIds` | Relationships between stable guide identities | Sine and cosine, inverse sine, inverse tangent |

Routes use `/guides/<slug>`. Categories are navigation facets, so moving a guide between categories does not change its URL. Slugs are authored values and are never regenerated from the title. If a published slug changes, preserve its old URL with a redirect. Ordinary fragment anchors can link to examples within the same article; the article path identifies the subject.

The first `featuredSectionId` values select native recipes for review. They do not dictate the article title, opening explanation, or final order of every example. Recipes with multiple stages retain their internal sections and instructions.

## Article boundaries

The native Help structure serves calculator use. Its topic boundaries can combine several subjects or put the same operation in both an explanatory example and a key reference. Web articles group that material around what the reader is learning.

| Native grouping | Proposed treatment | Reason |
| --- | --- | --- |
| Add a waste allowance and Calculate a percentage | Percentages | Allowances, portions, markup, discounts, and percentage divisors share the same underlying relationship. |
| Combine lengths before multiplying and Control calculation order | Calculation order and parentheses | Grouping, precedence, and left-to-right calculation need a common explanation. |
| Square example, square-area recipe, and square/root key references | Squares and square roots | Keep the mathematical relationship and its measured-unit behavior together. Link to it from the area overview. |
| Pipe circumference example, Circle mode, and pi key reference | Circle measurements | The existing Circle recipes also cover radius, diameter, and area. `/guides/circles` accommodates their actual scope. Circumference remains an explicit section and search term. |
| Use angles and trigonometry | Sine and cosine, tangent, inverse sine, inverse cosine, inverse tangent, angle formats, and right triangles | The native umbrella contains distinct functions, conversion references, and a triangle-mode workflow. Each recipe goes to its relevant subject. |
| Scale a value with a ratio | Ratios and proportions plus Fan laws | A scale drawing teaches proportional setup; fan examples use direct, squared, and cubed relationships with domain-specific conditions. |
| Find common-rafter length and cuts | Common rafters plus Roof sheathing | The sheathing recipe solves a separate task and should remain discoverable independently. |
| Find cylinder or cone volume | Cylinders plus Cones | Each shape has a distinct volume and surface relationship. |
| Wrapper, changed OGEE, and elbow-angle topics | Duct offsets | These recipes share the offset setup and related results. Measured single, double, and right-angle arrangements keep their separate workflows. |
| Plan material length and spacing | Equal spacing | The current recipe explains baluster counts, occupied width, and clear gaps. The article scope should match that material. |

The square-area and square-key recipes currently use the same measured square and result. They are recorded as a duplicate-example candidate in the map. Confirm their actions and display settings match before rendering one shared example. Both native source associations remain represented.

Each native recipe has one primary article assignment. Related articles link to the corresponding section. This keeps variants together and makes cross-topic relationships explicit. The grouping does not rewrite native titles, IDs, instructions, results, or categories.

## Guide index and articles

The guide index offers category browsing, subject names with short summaries, and search across formal names and practical applications. A search for a brace angle can lead to Inverse cosine; a pipe wrap can lead to Circle measurements. The category lists use ordinary links and remain available without JavaScript. Client-side search enhances those lists.

An article introduces the subject in plain language, explains the relationship or workflow, and presents the relevant diagram when available. The worked example supplies inputs, units, a result, and the Figure steps. Further examples, practical applications, limits, and related guides follow when they help the reader. A reference article can instead organize controls or messages around the task it supports.

The existing catalog supplies much of the content, but some recipes are primarily key sequences. Their web articles need a standalone introduction and enough explanation to make the task understandable before following the keys. The verified example values and native instructions remain authoritative. A conceptual title does not imply coverage of every application of that concept.

Fan-law and velocity-pressure articles need their applicable conditions and units stated with the relationships. Geometry examples retain their sketch orientation and domain limits. Project-specific settings, such as stair targets and permitted baluster gaps, remain explicit inputs. These details belong with the relevant examples.

## Subjects

The featured recipe column shows the current native title. It is an example or reference within the proposed article. The recipe count includes all mapped variants, not a target number of sections to render unchanged.

### Math and relationships

| Subject | Route | Featured native recipe | Recipes |
| --- | --- | --- | ---: |
| Percentages | `/guides/percentages` | Add a waste allowance | 5 |
| Calculation order and parentheses | `/guides/calculation-order` | Combine lengths before multiplying | 4 |
| Positive and negative values | `/guides/signed-values` | Work above and below a reference | 2 |
| Squares and square roots | `/guides/squares-and-square-roots` | Find a square’s area or side | 4 |
| Cubes and cube roots | `/guides/cubes-and-cube-roots` | Find a cube’s volume or side | 5 |
| Sine and cosine | `/guides/sine-and-cosine` | Find rise and run from a slant | 3 |
| Tangent | `/guides/tangent` | Find rise from run and angle | 2 |
| Inverse sine | `/guides/inverse-sine` | Find an angle from rise and slant | 3 |
| Inverse cosine | `/guides/inverse-cosine` | Find a brace’s angle | 2 |
| Inverse tangent | `/guides/inverse-tangent` | Find a slope’s angle | 2 |
| Reciprocals | `/guides/reciprocals` | Turn a rate into spacing | 2 |
| Scientific notation | `/guides/scientific-notation` | Read scientific notation | 4 |
| Angle formats | `/guides/angle-formats` | DMS to decimal degrees | 3 |

### Measurements and units

| Subject | Route | Featured native recipe | Recipes |
| --- | --- | --- | ---: |
| Feet and inches | `/guides/feet-and-inches` | Enter a length | 2 |
| Metric measurements | `/guides/metric-measurements` | Enter meters | 3 |
| Length conversions | `/guides/length-conversions` | Feet and inches to decimal feet | 5 |
| Area and volume units | `/guides/area-and-volume-units` | Enter and convert an area | 4 |
| Arithmetic with measurements | `/guides/measurement-arithmetic` | Add lengths | 6 |
| Areas and volumes | `/guides/areas-and-volumes` | Rectangle area | 4 |
| Ratios and proportions | `/guides/ratios-and-proportions` | Scale a drawing measurement | 1 |

### Shapes and geometry

| Subject | Route | Featured native recipe | Recipes |
| --- | --- | --- | ---: |
| Right triangles | `/guides/right-triangles` | Find the diagonal | 4 |
| Oblique triangles | `/guides/oblique-triangles` | Angles A, B and C | 1 |
| Circle measurements | `/guides/circles` | Find the distance around a pipe | 4 |
| Arcs | `/guides/arcs` | Angle and diameter known | 4 |
| Circular segments | `/guides/circular-segments` | From chord and rise | 4 |
| Arched walls | `/guides/arched-walls` | Read the arched-wall cycle | 1 |
| Cylinders | `/guides/cylinders` | Closed cylinder | 1 |
| Cones | `/guides/cones` | Cone volume and lateral area | 1 |

### Roof and stairs

| Subject | Route | Featured native recipe | Recipes |
| --- | --- | --- | ---: |
| Roof pitch | `/guides/roof-pitch` | Pitch in inches per foot | 5 |
| Common rafters | `/guides/common-rafters` | From pitch and full span | 2 |
| Roof sheathing | `/guides/roof-sheathing` | Find the sheathing run | 1 |
| Hip, valley and jack rafters | `/guides/hip-valley-and-jack-rafters` | Regular hip and jacks | 1 |
| Irregular roofs | `/guides/irregular-roofs` | Irregular hip/valley cuts | 4 |
| Stair layout | `/guides/stairs` | Only floor-to-floor rise known | 4 |
| Equal spacing | `/guides/equal-spacing` | Find gaps between balusters | 1 |

### HVAC

| Subject | Route | Featured native recipe | Recipes |
| --- | --- | --- | ---: |
| Duct offsets | `/guides/duct-offsets` | Find offset dimensions | 5 |
| Single duct offsets | `/guides/single-duct-offsets` | Inline single offset | 2 |
| Double duct offsets | `/guides/double-duct-offsets` | Plan, elevation and true length | 1 |
| Right angle duct offsets | `/guides/right-angle-duct-offsets` | Three stages to the plan dimensions | 1 |
| Airflow from area and speed | `/guides/airflow` | Find duct airflow | 1 |
| Airflow conversions | `/guides/airflow-conversions` | Convert airflow | 1 |
| Air speed conversions | `/guides/air-speed-conversions` | Convert air speed | 1 |
| Pressure conversions | `/guides/pressure-conversions` | Convert pressure | 1 |
| Velocity pressure | `/guides/velocity-pressure` | Velocity pressure to FPM | 2 |
| Fan laws | `/guides/fan-laws` | Find new fan speed | 6 |

### Using Figure

| Subject | Route | Featured native recipe | Recipes |
| --- | --- | --- | ---: |
| Correcting and clearing | `/guides/correcting-and-clearing` | Correct the last digit | 4 |
| Second functions | `/guides/second-functions` | Use a second function | 2 |
| Fraction precision | `/guides/fraction-precision` | Round to the nearest 1/32 inch | 2 |
| Display settings | `/guides/display-settings` | Show area answers in square meters | 4 |
| Calculator messages and results | `/guides/calculator-messages` | Cannot divide by zero | 10 |

## Content ownership and rendering

The native structured Help catalog remains the source for recipe text, sections, ordered actions, example results, settings, diagrams, and native related-guide references. The web map owns public guide identity, grouping, summaries, search aliases, and related subjects. Native titles can stay useful in the app while the web provides broader subject headings.

The native `Tools/HelpExport/export.sh` evaluates the typed catalog and action labels into a versioned public format. It should preserve instruction grouping, spoken labels, diagram identities, result captions, optional sections, and example preferences. Export public content fields explicitly. Internal source records, test identifiers, and the flattened `searchText` field are not article body content. The original declaration inventory was used for grouping; ordinary builds consume the committed typed export.

The web build resolves the source references in this map against that export. Missing or renamed source IDs must fail validation. Web-specific concept introductions can live alongside the mapping without copying all native recipe bodies into a second manually maintained collection. Any verified correction to a shared recipe belongs in its authoritative source first.

For this expanded library, TanStack Start is the rendering foundation. Its documented [static prerendering](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering) gives the guide index and articles complete HTML at build time. React, Tailwind, Base UI, and shadcn remain the UI stack. The landing page keeps its compact structure, and the native guide export remains independent of the routing framework.

Each article supplies its subject title, description, canonical URL, and sharing metadata. Sitemap entries come from the same public route list. Search and category filters select existing subjects; they do not create additional canonical articles. The current prelaunch indexing policy remains in place until launch is requested.

## Implementation sequence

1. Validate a native export and this mapping together. Preserve all source recipes, including reference entries, and confirm the duplicate-example candidate.
2. Implement static guide index and article routes with the existing design tokens and components. Prove the content template with Inverse cosine, Circle measurements, Ratios and proportions, Fan laws, Common rafters, and Calculator messages and results. These cover concept/example naming, merged and split topics, domain conditions, and reference content.
3. Verify complete HTML, links, metadata, diagrams, native key labels, and example values before expanding the template across the mapped library. Keep the marketing page and demo behavior under their existing browser checks.
4. Add search as an enhancement to the linked index. Verify practical application terms resolve to the intended subjects and that keyboard and browser navigation remain predictable.

The export checks should reject missing source references, duplicate primary assignments, duplicate slugs, unknown categories, broken related-guide links, missing featured sections, and duplicate section anchors. Route checks should verify canonical paths, old-slug redirects when introduced, article and index content without JavaScript, and direct example links. Browser checks should cover hydration, keyboard navigation, responsive layout, and the existing reduced-motion behavior.

## Search guidance

The library follows Google's guidance on [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) and [readable URL structure](https://developers.google.com/search/docs/crawling-indexing/url-structure). Subjects, descriptions, and examples explain the actual tasks. Search aliases help readers find those tasks inside the library. They are not rendered as keyword lists in articles.

These are editorial subject choices grounded in the existing Help content. Search demand and conversion performance will be evaluated after public launch; no traffic estimates are attached to the proposed routes.

## Review checks

The declaration inventory at the referenced native commit contains 53 active topics and 147 recipes. Every recipe resolves to one primary article in the map. The 50 route rows above match the JSON slugs exactly. Guide identities, slugs, and per-article section IDs are unique; category references, related-guide references, featured sections, and the duplicate-example candidate resolve. The implementation validates the current export against those assignments. The public articles render 146 distinct recipe sections, preserving the declared duplicate’s second source association and anchor. Static-content browser checks cover every article in Chromium and WebKit with JavaScript disabled.
