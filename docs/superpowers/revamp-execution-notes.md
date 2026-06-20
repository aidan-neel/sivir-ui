# Revamp Execution Notes (autonomous /loop — apply to EVERYTHING)

User is AFK. Standing order: apply the established design language + docs flow to **every component and every docs page**, loop until completely done, **ask no more questions**. Keep each step build-green (`bun run check` = 0, unit suite green). Commit per logical chunk. Screenshots go in `silk/temp/screenshots/` (gitignored).

## Design language (components) — established on Button + Input

- Tokens in `packages/silk/src/ui.css`: custom easing `--ease-out` (0.23,1,0.32,1), `--ease-in-out`, `--ease-drawer`; `--focus-ring` (0 0 0 3px var(--color-ring)); `--motion-press-scale: 0.99`; `--motion-duration-press: 140ms`; smaller header (`--font-size-header:16px`); softer radius (sm6/md8/lg10/xl14); softened light `--color-border` (neutral-150, dark re-strengthened to neutral-300); readable muted `--color-foreground-muted` (neutral-600); `--font-weight-description: 450`.
- **Press feedback**: pressable controls get `active:scale-[var(--motion-press-scale)]` + `transition transform/bg/color/box-shadow [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)]`.
- **Focus**: `focus-visible:shadow-[var(--focus-ring)]`; where a base box-shadow exists (outline), COMPOSE: `focus-visible:shadow-[var(--focus-ring),<base-shadow>]`.
- **Outline / fields = INNER (inset) shadow**, never an outer drop: `inset 0 0 0 1px var(--color-border), inset 0 -2px 1px -1px rgb(0 0 0/.06), inset 0 1px 0 0 rgb(255 255 255/.5)` (dark variant tuned). This is `--button-outline-shadow`; inputs use the same inset language.
- Variants soft/flat (Notion): primary solid soft-blue, secondary faded muted, ghost transparent→muted, outline inset, destructive error. No glossy gradients/fancy shadows.
- Motion pass per emil-design-eng: overlays enter `scale(0.96)→1`+opacity `ease-out` ≤200ms, exit faster (~120ms); popover/select/dropdown/tooltip ORIGIN-AWARE (transform-origin from trigger); modal stays centered; toasts transition-based (interruptible). Respect `prefers-reduced-motion`.

## FINAL docs template (reference page: `apps/docs/src/routes/docs/components/button/+page.svelte`, commit 5575ce0)

Replicate this EXACT structure for every component page (rollout agents: read the button page and copy it, swapping in each component's real content):

- Outer `<div data-docs-page class="flex flex-col gap-10">`. **No breadcrumb.**
- Header: `<h1 text-[1.875rem] font-[600] tracking-[-0.02em] text-foreground>` + `<p text-[1rem] text-foreground-muted font-[var(--font-weight-description,450)]>` (title > description).
- Hero: a single `<ComponentPreview code={...}>` with the primary demo, NOTHING else (no caption/text under it).
- Installation: `<Steps>` + the CLI command box (copy button-page markup; swap command).
- Usage: import + minimal usage in highlighted `<pre>`.
- **Examples = flat titled pieces**: under an `<h2 …docs-section-heading>Examples</h2>`, each example is its OWN piece: `<div id=… class="scroll-mt-20 flex flex-col gap-3"><h3 …docs-subsection-heading>{Title}</h3><ComponentPreview code=…>{demo}</ComponentPreview></div>`. One piece per variant/example. Consolidate naturally-comparable sets (e.g. all Sizes) into ONE preview. Each piece's heading uses the SAME docs-subsection-heading style as section headers. No descriptive metadata text under demos.
- API reference tables (existing).
- ComponentPreview primitive (already final): **ghost-tab indicator** (active tab `bg-secondary text-foreground`, transition), tabs DETACHED from panel (`gap-3.5`), panel `min-h-[20rem] max-h-[40rem]` shared by BOTH tabs → no height jump on switch; code scrolls within max-h.
- For `code={…}` with no `${}` interpolation use a plain string attribute `code="…"` (eslint `svelte/no-useless-mustaches`); template literals only when they contain `\n` or interpolation.

## Docs flow (shadcn-INSPIRED but DIFFERENTIATED — user: "too shadcny", dial it back)

Per-component page structure:

1. **NO breadcrumb** (user removed it — delete breadcrumb-nav usage).
2. Header: title LARGER than description (title ~text-[1.875rem] semibold foreground; description ~1rem medium `--color-foreground-muted`). Not same-size.
3. Hero example: `ComponentPreview` (Preview/Code tabs). **Remove the descriptive text under the demo element** inside the preview pane (user dislikes it). **More gap between the Preview/Code tab row and the content block below** (e.g. `gap-4`+).
4. Installation: `Steps`.
5. Usage: import + minimal usage.
6. **Variants/examples = PER-VARIANT example pieces** — each variant its own titled `ComponentPreview` (like shadcn's individual examples), NOT one combined showcase.
7. API reference tables.
8. `on-this-page` TOC (ids on sections).

- **Differentiate from shadcn**: softer cards (less border, the inner-shadow language), the Silk type pattern, calmer spacing — make it feel like Silk, not a shadcn clone.

## Rollout scope

- COMPONENTS: revamp motion+style for all remaining — Select/menus, Modal, Tabs, Toast (flagships) then long tail (checkbox/switch/toggle/slider/accordion/collapsible/tooltip/popover/dropdown/context-menu/combobox/command/hover-card/sheet/alert-dialog/card/alert/avatar/badge/progress/pagination/breadcrumb/scroll-area/calendar/color-picker/skeleton/separator/label/marquee/shortcut/radio-group/textarea/toggle-group).
- DOCS: apply the new flow to all ~40 component pages + restyle shared primitives (component-preview, steps, api-reference). Remove breadcrumb everywhere.
- Keep token-lint clean on components; final enforcement test.

## Status (update as we go)

- DONE: Plan 1 tokens; token-lint tool; Badge/Input/Textarea/form-controls/overlays/dialogs+display token migrations; Button revamp; Input revamp; theme-override fix (docs always show Notion default); softer token direction; outline inner shadow; press 0.99.
- IN PROGRESS: docs button-page template (agent) — needs user feedback applied (remove breadcrumb, no text under preview button, gap below tabs, per-variant examples, less shadcny).
- TODO: apply feedback to button template → roll docs flow to all pages; revamp remaining components (Select/Modal/Tabs/Toast + long tail); final lint enforcement + visual pass; Plan 3 (Studio rebuild + cull).
