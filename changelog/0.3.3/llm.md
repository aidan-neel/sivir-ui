## Reasoning: collapsed by default, content stays mounted

`Reasoning.Root` now defaults `open` to `false`. A call site that relied on the
old `true` default still type-checks but renders collapsed. Pass `open` (or
`bind:open`) when the trace should be visible on first render, such as a live
stream the user is watching.

`Reasoning.Content` mounts its children on the first open and keeps them
mounted when closed; the panel stays in the DOM, is `inert` while closed, and
animates with a CSS grid-rows transition. Do not wrap it in `{#if open}` or
re-key it on toggle; that brings back the remount and loses streamed state. A
streaming child (Markdown, ResponseStream) can keep updating while collapsed.
`class` and other attributes on `Reasoning.Content` apply to the indented body,
not the animated panel. `onOpenChangeComplete` fires when the height transition
ends, or on the next microtask when motion is reduced.

`Reasoning.Trigger` shows `duration` while `streaming` too. Tick it from the
consumer (for example every 100 ms) for a live "Thinking 3.2s" timer that
freezes into "Thought for 3.2s" when `streaming` flips to `false`. Keep the
same Root mounted across that flip so the label can crossfade. `title` no
longer defaults to "Draft"; omit it for a label-only trigger.

## Question: step transitions live in Question.Content

`Question.Content` accepts `step?: number`. Pass the current step index and the
component animates the change itself: the outgoing step stays mounted briefly
with its old content, is made `inert` and `aria-hidden`, and blurs out while the
next step slides in; the content frame tweens its height between the two. A
higher `step` travels forward, a lower one travels back. Without `step`, content
changes in place as before.

Stop wrapping Question parts in your own `{#key}` or `in:`/`out:` transitions to
fake step motion, and stop setting a fixed `min-h-*` on `Question.Content` to
hide height jumps. Keep one `Question.Root` mounted across steps and drive it
with `step` plus the per-step bound answer, as in the docs hero. Motion reads
`--motion-duration-step-in`, `--motion-duration-step-out`, `--motion-step-x`,
and `--motion-step-blur`; override those tokens rather than restyling the
transition.

`Question.Submit` now renders both its label face and a hidden submitting face
in one grid cell, so the button is as wide as the wider of `label` and
`loadingLabel`. Keep the two labels similar in length.

## Attachment items are composed from parts

`Attachment.Item` is now a grid container that provides item context. Its
parts read that context, so they must be direct children of an `Item`:

```svelte
<Attachment.Item {file} status="uploading" progress={40}>
    <Attachment.Preview />
    <Attachment.Name />
    <Attachment.Status />
    <Attachment.Remove />
</Attachment.Item>
```

`Preview` spans both rows on the left, `Name` sits on the first row and
`Status` on the second, and every other direct child (including `Remove` and
any button you add, such as a retry control) gets its own trailing column
spanning both rows. Omit a part to drop that region; do not wrap `Name` and
`Status` in your own container, or the grid placement breaks. An item without
children renders all four parts, so existing `<Attachment.Item {file} />`
calls are unchanged.

To show upload state in the high-level form, pass `Attachment.List` a
`children` snippet. It receives the file and renders inside each animated
`<li>`; keep upload state keyed by the `File` object:

```svelte
<Attachment.List>
    {#snippet children(file)}
        <Attachment.Item {file} status={uploads.get(file)?.status} progress={uploads.get(file)?.progress} />
    {/snippet}
</Attachment.List>
```

Do not render your own `{#each}` of items inside `Attachment.List`; the list
owns the keyed loop, enter/exit transitions, and reflow animation.

## Removal inside a root is automatic

Inside `Attachment.Root`, an item without `onRemove` now removes itself from
the bound `files` through the root, and `Attachment.Remove` renders unless
`removable={false}` or the root is disabled. Standalone status items rendered
inside a root therefore gain a remove button; pass `removable={false}` when an
item must not be removable. Outside a root, removal still requires `onRemove`.

## Paste is on by default

`Attachment.Root` attaches pasted files (`clipboardData.files`) from any
focused descendant, such as a composer textarea, and calls `preventDefault`
only when files are present. Text pastes are untouched. If the app already
handles file pastes, either call `event.preventDefault()` in the root's
`onpaste` or set `addOnPaste={false}`.

## List layout override

`Attachment.List` is a CSS grid that fills columns of at least 14rem
(`grid-cols-[repeat(auto-fill,minmax(min(100%,14rem),1fr))]`) and collapses to
one column on narrow screens. Override the columns on the list, for example
`class="grid-cols-1"` for full-width rows. The older flex overrides
(`sm:flex-col sm:[&>li]:w-full`) still type-check but no longer produce rows;
replace them with a `grid-cols-*` class. The empty list
stays mounted with the `hidden` attribute so the last item can animate out;
query it by role, not by presence in the DOM.

## Composer: one card surface, icon-only submit

`Composer.Root` is now one card: a single bordered, rounded `bg-card` surface
with no framed tray around a separate input well. `Composer.Input` is
transparent and starts at `min-h-16`. Do not add a background, border, or
radius to the input to rebuild the old well; restyle the Root instead. Drop
`class="min-h-16"` overrides because that is now the default.

`Composer.Submit` without children renders a round icon-only button (`size="icon"`):
an up arrow for send, a list-plus for queue, and a filled square for stop. It
no longer renders the "Send" text or an Enter `Shortcut`, and the Composer
manifest no longer depends on `shortcut`. Accessible names still come from
`label`, `queueLabel`, `stopLabel`, and `loadingLabel`, so tests that query
`getByRole('button', { name: 'Send' })` keep passing. If you pass `children`,
the button keeps the `md` size so a text label fits. It is still rounded, so
pass `class` if you need a different shape.

The submit button now shows that work is in progress on its own. It sets
`data-busy` and draws a spinning ring on its edge whenever the action is
`stop`, `queue`, or (for the default icon button) `pending`. For `stop` it
switches to the secondary variant. In icon-only mode a pending send keeps the
arrow, dims it, and shows the ring instead of Button's text loading face. The
button stays focusable, with `aria-busy` and `aria-disabled` set. Do not add a
Spinner or your own ring inside the default submit. To show the ring while a
reply streams, pass `generating` to `Composer.Root`. Custom `children` still
get Button's loading face for `pending`.

`Composer.Toolbar` variants swapped roles. `chrome` (the default) sits on the
card surface beneath the text, and `inset` places the toolbar in a recessed
`bg-secondary` tray inside the card's bottom edge. Keep toolbar controls
compact (`h-8`, ghost, `rounded-full`) so they line up with the 32px submit
button.

## Tool: composed parts, collapsed by default

Tool no longer renders its own trigger from Root props. The old call site
`<Tool.Root name="…" state="complete" duration="6s" variant="quiet">` with
`<Tool.Item name="Bash" detail="…" kind="read" />` children no longer
type-checks. Compose it like Reasoning:

```svelte
<Tool.Root state="running">
    <Tool.Trigger title="Reading 2 files" duration={elapsed} />
    <Tool.Content>
        <Tool.Call action="Reading file" target="src/app.ts" state="running" />
        <Tool.Call action="Read file" target="src/lib/db.ts" duration="12ms">
            <Tool.Output>…</Tool.Output>
            <Tool.Input>{JSON.stringify(input, null, 2)}</Tool.Input>
        </Tool.Call>
    </Tool.Content>
</Tool.Root>
```

`state` lives on Root and drives the trigger glyph (spinner, check, alert) and
the title shimmer. Write `title` as a sentence about what the group did, and
switch it from what is still going ("Reading 2 files") to a summary once the
group completes ("Read 3 files, searched once"). `Tool.Trigger` takes either
`title` or a `children` snippet, not both. There is no `variant` any more; the
trigger is always the quiet style. Root defaults `open` to `false`, so pass
`open` or `bind:open` when the calls should be visible on first render.

`Tool.Content` works like `Reasoning.Content`: it mounts children on the first
open, keeps them mounted and `inert` while closed, and animates with a
grid-rows transition. Do not wrap it in `{#if open}` or key it on toggle, and
keep one Root mounted while calls stream in. Content is a five-column grid
(action, target, status, duration, chevron), and each `Tool.Call` joins it
with `subgrid`, which is how actions, targets, and durations line up across
rows. Render Calls as direct children of Content; anything else you put there
spans the full width.

`Tool.Call` is one row. `action` is the verb, so change it as the call
finishes ("Reading file" to "Read file"). `target` renders in mono and
truncates. `state` defaults to `complete`; `running` adds a spinner and
`error` adds visible "Failed" text. A Call without children is a static row;
with children it becomes a toggle button with its own bindable `open`, and the
children (usually `Tool.Output`, then `Tool.Input`) show behind a nested
rail. `Tool.Input` renders its children inside `<pre><code>`, so pass
preformatted text.

## Slider is now the labeled scrub field

The plain range-track `Slider` is gone. `Slider` is now the field that puts
its label and formatted value inside the control. The old call site
`<Slider bind:value label="Volume" />` still type-checks, but `label` used to
be only an `aria-label` and is now visible text inside the field. Remove any
label and value row you rendered above the old slider, and move units into
`format` instead:

```svelte
<Slider bind:value={timeout} min={5} max={120} step={5} label="Idle sign-out" format={(v) => `${v} min`} />
```

For composition, import the module as a namespace. Its parts are `Root`,
`Range`, `Thumb`, `Label`, and `Value`, and `Slider` is the same component as
`Slider.Root`. A root without children renders all four parts, with `Label`
only when `label` is set:

```svelte
<script lang="ts">
    import * as Slider from '@sivir-ui/svelte/components/slider';
</script>

<Slider.Root bind:value={exposure} {format}>
    <Slider.Range />
    <Slider.Value />
    <Slider.Label>Exposure</Slider.Label>
</Slider.Root>
```

The package root (`@sivir-ui/svelte`) exports only the `Slider` component,
like `CodeBlock`; import the parts from the component path. There is no
`SliderField` export. Part hooks are `data-ui="slider"`, `slider-range`,
`slider-thumb`, `slider-label`, and `slider-value`, and the hover group is
`group-hover/slider`.

`Root` renders a `<label>` around a visually hidden native range input, so
keyboard, form (`name`), and screen reader behavior come from the input. The
accessible name is the `Label` part's text. When composing without `Label`,
pass `label` to `Root` or the slider is unnamed. `Value` is `aria-hidden`;
`format` also sets `aria-valuetext`, so put units in `format`, not in
surrounding markup. Parts read context and must sit inside `Root`; `Range` and
`Thumb` are absolutely positioned, while `Label` and `Value` are flex items
laid out with `justify-between`, so their order decides which side each sits
on.

Use `onValueChange` for live previews and `onValueCommit` for expensive work:
it fires once when a pointer gesture ends with a changed value, and on each
keyboard change. Do not debounce `onValueChange` to fake a commit.

Motion is internal: the fill and edge stretch use a JS spring driven from
`value`, and reduced motion makes both instant. Do not add CSS transitions to
`Range` width or `Thumb` position, or set `transform`/`scale` on `Root`; the
edge stretch owns `scale` and `transform-origin`. Restyle parts with `class`,
for example a tinted `Range`.

## Scroll Area: edge cue blur is opt-in

`ScrollArea` now defaults `blur` to `false`. The edge cues keep their fade and
chevrons but no longer apply `backdrop-filter`. A call site that relied on the
old `true` default still type-checks and renders without the blur. Pass `blur`
when the frosted cue is wanted. Remove any `blur={false}` props; they are now
redundant. Components that render a Scroll Area internally (Dropdown Menu,
Combobox, Conversation) inherit the new default.

## `sivir init -y` finishes the setup

`sivir init -y` is no longer limited to writing files. It also:

- Runs the package manager for any missing shared dependencies (`cnfast`,
  `@floating-ui/dom`, and the `@fontsource` faces) at their declared ranges.
  Without `-y` it asks in a TTY and prints the command otherwise.
- Replaces a bare `@import 'tailwindcss';` line in `src/routes/layout.css` or
  `src/app.css` with `@import '<relative>/lib/sivir/ui.css';`. `ui.css` imports
  Tailwind itself, so do not add `@import 'tailwindcss'` back next to it. When
  both files import Tailwind, or the import is customized (for example
  `source(...)`), `init` changes nothing and prints the replacement to make.

After `init -y`, do not repeat the install or the stylesheet edit. Read
`sivir.json` for the directory and alias.

When installing peers yourself, use the ranges the CLI prints, for example
`bun add 'cnfast@^0.0.8'`. A bare `cnfast` resolves to `0.2.x`, which is
outside the supported range.

`sivir add` now reports files that already match the registry as unchanged
(`=`) and only counts files that differ as conflicts (`!`). The
`--overwrite` warning therefore means local changes would be lost.
