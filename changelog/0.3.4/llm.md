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
