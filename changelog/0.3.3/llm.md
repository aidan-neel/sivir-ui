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
