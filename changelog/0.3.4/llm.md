## Removed theme presets

The Bitsy, OpenAI, Functional, Figma, Apple, Claude, Google, shadcn, and
Linear presets are gone. `@sivir-ui/svelte/themes/builtin-presets` no longer
exports `bitsyTheme`, `openaiTheme`, `functionalTheme`, `figmaTheme`,
`appleTheme`, `claudeTheme`, `googleTheme`, `shadcnTheme`, or `linearTheme`,
and `builtInThemePresets` now lists only Default, Magic, Profitable, Raven,
Clawd, and Inspiration (exported as `magicTheme`, `profitableTheme`,
`ravenTheme`, `clawdTheme`, and `inspirationTheme`).

Code that imports a removed export fails to compile after upgrading. Code
that looks a preset up by slug in `builtInThemePresets` (for example
`find((theme) => theme.slug === 'linear')`) still compiles but now gets
`undefined`. To keep a removed look, copy its `Theme` object from the 0.3.3
source into your project and pass it wherever you passed the export. Do not
map removed slugs onto the new presets; they set different colors, type, and
motion.

## Command: Footer part and paneling-off chrome

`Command.Footer` is a new composable part. Declare it inside `Command.Content`
(anywhere, like `Command.Header`); it renders into the modal frame below
`Command.Results`, outside the scroll surface, so it stays pinned. Use it for
key hints (`<Shortcut shortcut="enter" /> open`) or a status line. Put
`ml-auto` on a child to push it to the trailing edge. It does not bind keys;
a `Shortcut` inside it is display-only because it has no button owner.

When a theme sets `chrome.surfacePaneling: false`, the palette's header gets a
bottom hairline and the footer a top hairline, both with the search row's
inline padding, and `kbd` elements inside items render as plain muted text.
Do not restyle these per call site to fake the flat look; toggle paneling in
the theme instead.

## Info color follows the mode's primary

For non-default brands, `--sivir-blue-500` and `--sivir-blue-50` (and
therefore `--color-info` and `--color-info-soft`) now resolve from
`var(--color-primary)` instead of the raw brand hex. A per-mode
`--color-primary` override in `tokens.dark` or `tokens.light` now carries into
info badges, alerts, and toasts. Code that read the generated CSS expecting
the brand hex in `--sivir-blue-500` should read `--color-primary` instead.

## Swap motion is a shared token contract

Any component that replaces one icon or label with another in place (copy to
check, spinner to check, "Thinking" to "Thought", submit label to spinner)
must read the swap tokens instead of hard-coding blur, scale,
rotation, or offset values. Stack both faces in one grid cell and transition
`opacity`, `filter`, `scale`, `rotate`, and `translate` over
`--motion-duration-swap` with `--ease-out`. The hidden face uses
`opacity-0 blur-[var(--motion-swap-blur)]` plus whichever of
`scale-[var(--motion-swap-scale)]`, `rotate-[var(--motion-swap-rotate)]`
(negated on the outgoing face), and `translate-y-[var(--motion-swap-y)]` fits
the swap; the shown face resets to `blur-[0]`, `scale-100`, `rotate-0`, or
`translate-y-0`. List `scale` and `rotate` in the transition explicitly:
Tailwind v4 sets them as their own properties, so `transition-transform` does
not animate them.

`--motion-duration-swap` aliases `--motion-duration-panel` and
`--motion-swap-blur` aliases `--motion-menu-blur`, so do not set them from a
motion preset; the preset sets the panel speed, scale, rotation, and offset.
`chrome.fancySwap: false` (only `false` is accepted) zeroes the blur, scale,
rotation, and offset, which leaves a plain opacity crossfade. Reduced motion
already zeroes the duration through the panel alias.

## Switch motion tokens and the none radius scale

Switch reads two tokens from its own computed style when it animates:
`--motion-duration-switch` (default `280ms`) and `--motion-switch-stretch`
(default `1`). The duration scales the spring speed; `0ms` makes the thumb jump
with no stretch. The stretch multiplies the press-and-hold elongation; `0`
keeps the thumb round. Set these tokens in a theme or on an ancestor
to change Switch motion. Do not restyle the thumb's transition or wrap Switch
in your own animation. Reduced motion and the `none` motion preset already set
the duration to `0ms`. Dragging the thumb still follows the pointer directly.

`RadiusScale` now includes `'none'`, which sets every `--radius-*` token to
`0px`. Code that switches over the radius scales exhaustively (for example a
`Record<RadiusScale, …>` map or a label lookup) must add a `none` case.

## Command: flat palette layout when surface paneling is off

Command now has two looks driven by the theme's `chrome.surfacePaneling` flag. With paneling on (the Sivir default) nothing changes: a centered inset frame, and group headings hidden while searching. With paneling off, the theme stylesheet anchors `[data-ui='command-content']` near the top of the viewport (`translate: -50% 0`, max width 41.25rem), enlarges the search row, pads the results, makes items at least 9.5 spacing units tall, keeps group headings visible while searching, and hides groups that have no matching items.

Those rules target new hooks: `data-ui="command-search"` on the search row, `data-ui="command-results"` on the listbox, and `data-ui="command-group"` on each group. The group heading `<p class="sivir-menu-label">` is now always rendered and hidden with CSS while the group carries `data-searching`, so do not rely on it being absent from the DOM during a search. If you restyle the palette per paneling mode, target these hooks instead of copying the flat rules into component classes. The paneling-off rules are unlayered, so they beat utility classes passed through `class`.


## Attachments inside a Composer render as inline chips

Put `Attachment.List` as a direct child of `Composer.Root`, immediately before `Composer.Input`, and wrap the whole composer in `Attachment.Root`:

```svelte
<Attachment.Root bind:files>
    <Composer.Root bind:value {onSubmit}>
        <Attachment.List />
        <Composer.Input />
        <Composer.Toolbar>…</Composer.Toolbar>
    </Composer.Root>
</Attachment.Root>
```

Inside a composer form the attachment parts restyle themselves, with no prop involved. Items become `h-7` chips with a small preview, the name, and the remove button. `Attachment.Status` is hidden while an item is `ready` and stays visible for `uploading`, `complete`, and `error`. While the list has items, the form switches to a wrapping row, so the input sits beside the chips on their first line. The input marks itself `data-stacked` and drops to a full-width line once its text wraps, and it returns inline when the value is cleared. The toolbar is always full width.

Stop doing these things:

- Don't pad the list yourself. `class="px-3 pt-3"` from older examples now doubles the inset.
- Don't put a wrapper element between the list and the input. The inline layout uses the adjacent-sibling selector and `>` children of the form.
- Don't expect the card layout inside a composer. Card rendering is not available there. If you need cards with progress bars next to a prompt, render the list outside `Composer.Root`.
