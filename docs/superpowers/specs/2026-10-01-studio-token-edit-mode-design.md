# Studio token edit mode

## Intent

Let a theme author point at the thing that looks wrong in the Studio preview and
tune exactly the tokens it uses, instead of hunting through the Tokens tab.

Decisions made with the maintainer:

- Scope is the Studio preview only. No `@sivir-ui/svelte` changes, no new
  package API, no Theme schema change.
- Edits change the global token, the same edit the Tokens tab makes. The
  panel makes the blast radius visible ("Used by N elements in this
  preview") instead of offering per-component overrides.
- Token discovery reads the live CSSOM at right-click time (no hand-maintained
  per-component lists, no build-time index).

## Interaction

- An **Edit tokens** toggle button (`aria-pressed`) floats in the bottom-right
  corner of the `#theme-preview` frame, outside the preview's scroll area, so
  it never covers the dashboard toolbar.
  It renders only at the desktop breakpoint (`min-[1100px]`), matching the
  inspector sidebar.
- While edit mode is on:
  - The preview frame shows a crosshair cursor.
  - The element under the pointer gets a 1px `--color-ring` outline drawn by a
    single absolutely positioned, `pointer-events-none` overlay (no mutation of
    preview elements' styles).
  - A `contextmenu` listener on the preview root in the capture phase calls
    `preventDefault` and `stopPropagation`, so the browser menu and the
    preview's own ContextMenu demo do not open. It opens the token panel.
    Right-button `pointerdown` and `mousedown` are swallowed in the capture
    phase too, so a right-click never focuses an input or opens a combobox,
    menu, or tab underneath.
- The token panel is a non-modal floating sidebar docked inside the right edge
  of the preview frame (`aside`, 22rem wide, full frame height). It reuses the
  Popover frame and inset surface classes so surface paneling applies. Because
  it is non-modal, right-clicking another preview element while it is open
  re-targets it. It contains:
  - **Header:** the target's tag name as the title, an "N editable tokens"
    count, a close button, and a path of the target and up to four ancestors
    inside the preview, labelled by tag name (`button`, `div`, `span`).
    Choosing an ancestor re-targets the panel.
  - **Body:** editable tokens the target uses, grouped and ordered like the
    Tokens tab sections (Colors, Layout, Motion, then any remaining buckets),
    each rendered through the existing `tokenRow` snippet so controls, changed
    dots and reset behaviour are identical and edits stay in sync. Sections are
    separated by a larger interval than rows.
  - **Per row:** "<token group>, used by N elements". The group disambiguates
    rows that share a label, such as Body font size and Body tracking.
    Hovering or focusing the row outlines those elements with the same overlay
    mechanism.
  - **Empty state:** "No editable tokens on this element." The path stays
    available so the author can step up.
- Closing: the close button or Escape, unless focus is inside a nested
  dialog, listbox, or menu. Escape while the panel is closed turns edit mode
  off. Turning edit mode off closes the panel and clears outlines.

## Token discovery (`apps/docs/src/lib/studio/token-usage.ts`)

Pure, DOM-light module with these internal functions (not part of any package
API):

- `extractVarNames(text)`: every `--name` inside `var(--name ...)`.
- `stripStateSelector(selector)`: removes pseudo-elements and pseudo-classes
  (including functional ones like `:where(...)`, `:not(...)`, `:is(...)`,
  `:has(...)`) and removes attribute selectors only from compounds that carry
  a Tailwind variant class (an escaped `\:` in the class name, such as
  `data-[state=open]:bg-x`). Hand-written rules like `.face[data-active]` keep
  their attribute and only count while that state is active. Returns `null`
  when nothing anchoring remains (`*`, empty). This lets hover, focus,
  open-state, and dark variants count as "used".
- `buildTokenIndex(sheets, editable)`: walks every readable stylesheet
  (skipping cross-origin sheets whose `cssRules` throws), recursing into
  grouping rules (`@media`, `@supports`, `@layer`, `@container`). It collects:
  - **definitions:** custom-property declarations only from rules that apply to
    the root element: the stripped selector is `null`, as for `:root, :host`,
    or `document.documentElement` matches it. Element-level custom properties
    such as Tailwind's `--tw-shadow` are excluded on purpose. Hundreds of
    utilities set them, so a global alias graph would attribute every shadow
    or ring color in the app to every element. An element's own `--tw-*`
    values still count because they appear in the cssText of its matched
    rules.
  - **usage rules:** every style rule whose declarations reference at least one
    variable, as `{ selector (stripped), tokens: Set<editable name> }`.
  Each referenced variable resolves to editable tokens: an editable name maps
  to itself; otherwise its definitions are followed recursively (visited set,
  depth cap 8) to the editable tokens they reference.
- `tokensForElement(index, element)`: union of `tokens` over usage rules whose
  stripped selector the element matches, plus variables in the element's inline
  `style` attribute. Invalid selectors are skipped (`matches` throwing).
- `elementsUsingToken(index, token, root)`: union of
  `root.querySelectorAll(selector)` over usage rules containing the token, plus
  inline-style matches under `root`, limited to `root`.

The index depends only on stylesheet structure, not token values, so slider
edits reuse it. It is rebuilt lazily when the stylesheet count, the live theme
sheet's rule count, or the live theme sheet's `var(` count changes. Root
detection is mode-independent: `:root`, `:host`, `html`, and `.dark` compounds
count as root rules whichever color mode is active.

The editable set is every `name` in `colorTokenDefinitions`,
`spacingTokenDefinitions`, `animationTokenDefinitions`, and
`detailTokenDefinitions`. The page maps names back to its existing `TokenRow`s.

## Placement in code

- `token-usage.ts`: discovery, unit-tested with plain strings and a jsdom
  stylesheet.
- `apps/docs/src/lib/components/studio/element-outline.svelte`: private overlay
  that outlines a list of elements relative to a container (one rect per
  element, recomputed on scroll, window resize, and element or container resize
  while visible).
- `+page.svelte`: edit-mode state, the toggle, capture-phase listeners, and the
  token panel. The panel lives in the page because it renders the page-local
  `tokenRow` snippet.

## Out of scope

- Touch and long-press, keyboard element picking, per-component overrides,
  component names in the DOM, and edit mode outside Studio.

## Verification

- Unit tests for `extractVarNames`, `stripStateSelector`, alias resolution and
  `tokensForElement` against a jsdom stylesheet.
- Repository gates: `bun run format:check` and `bun run lint`. Full test,
  check, and build are manual and run only on request.
