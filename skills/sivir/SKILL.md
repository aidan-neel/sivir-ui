---
name: sivir
description: Builds and refines Svelte 5 interfaces with Sivir UI using its live llms.txt catalog, version-aware component APIs, installation workflow, AI primitives, and design language. Use when asked to "use Sivir", "build with Sivir", "add a Sivir component", "make this look like Sivir", create an AI chat or coding-agent interface with Sivir, or review existing @sivir-ui/svelte code.
---

# Sivir

Build Svelte interfaces from Sivir's current APIs and design system. Do not guess from generic component-library patterns.

## Step 1: Establish the Project State

Inspect the project before changing code:

1. Confirm Svelte 5 and Tailwind CSS v4 are present.
2. Read the package manifest, lockfile, global CSS entry, and nearby Svelte components.
3. Detect the integration mode:
   - Package mode: `@sivir-ui/svelte` is a dependency and components import from it.
   - Source-copy mode: `sivir.json` exists and components import from its `alias` (default `$lib/sivir`).
   - Not installed: neither mode is present.
4. Identify the installed Sivir package version or the component versions recorded in `sivir.json`.
5. Preserve the project's package manager, import style, aliases, theme, and local component conventions.

Do not silently switch an existing project between package and source-copy modes.

## Step 2: Load the Current Sivir Sources

Fetch `https://sivir.dev/llms.txt` at the start of each Sivir task. Treat it as the index for the current catalog, installation guide, theming guide, changelog, and generated component references.

Load documentation progressively:

| Task | Read from the `llms.txt` index |
| --- | --- |
| First Sivir integration | Introduction, Installation, and Theming |
| Choosing components | Components index, then candidate component pages |
| Implementing a component | That component's Markdown page and every Sivir dependency needed for custom composition |
| AI or coding-agent UI | Candidate AI component pages plus `references/component-selection.md` from this skill |
| Upgrading or resolving an API mismatch | Installed version, the compiled changelog, the LLM changelog page when linked, and component pages |
| Visual design or review | `references/design-language.md` from this skill |

Each generated component page contains its current version, dependencies, install command, public `index.ts` API, and runnable examples. Read the exact page before using a component that is new to the project. Never invent a part, prop, event, variant, slot/snippet contract, or import path.

Use this authority order when sources disagree:

1. Local source-copied components define source-copy behavior.
2. The installed package and its declarations define package behavior at the locked version.
3. The live Sivir Markdown defines the latest released API and examples.
4. The rendered documentation is visual context, not a substitute for the typed API.

If the project is behind the live release, adapt to the installed API or ask before upgrading. Do not paste latest-only syntax into an older installation.

If web access is unavailable, inspect local Sivir source or installed declarations, and say that the live reference could not be checked.

## Step 3: Model the Interface

Name the user's job, the dominant content or action, and the empty, loading, error, and success states before choosing components.

Read `references/design-language.md` relative to this skill before creating or substantially reshaping an interface. Where the host application has its own visual system, follow it over Sivir's defaults.

## Step 4: Select and Verify Components

Read `references/component-selection.md` relative to this skill when selecting new primitives or composing an AI interface.

Prefer the highest-level Sivir component that matches the interaction semantics. Use plain Svelte and semantic HTML for layout and content where Sivir adds no behavior; do not wrap every region in a component. Do not recreate focus management, keyboard navigation, overlays, live regions, loading behavior, or controlled state that a component already provides.

Before implementation:

1. List the selected component slugs.
2. Fetch each selected component page from the links in `llms.txt`.
3. Confirm exports, required props, bindable state, event signatures, dependencies, and examples.
4. Do not use removed components. The components index lists them with replacements, for example Panel became `Card.Root variant="panel"` and Separator became a semantic `<hr>`.
5. Keep compound components in their documented namespace shape, such as `Modal.Root` and `Modal.Content`.

Examples are API evidence, not page templates. Adapt their state model and composition to the user's real content.

## Step 5: Install Consistently

When Sivir is absent, choose with the user unless the requested mode is already clear:

| Mode | Choose when |
| --- | --- |
| Package | The project wants dependency-managed updates and imports from `@sivir-ui/svelte`. |
| Source copy | The project wants to own and modify component source. |

Use the project's package manager. Translate the documentation's Bun examples when needed.

For package mode:

```sh
bun add @sivir-ui/svelte
```

Import the token sheet once in the application's global CSS:

```css
@import '@sivir-ui/svelte/ui.css';
```

Do not add `@import 'tailwindcss';` as well; `ui.css` imports Tailwind and registers Sivir's components as a Tailwind source. In package mode, skip the `sivir add` command shown on component pages. It copies source and only applies to source-copy projects.

For source-copy mode:

```sh
bunx --package @sivir-ui/svelte sivir init -y
bunx --package @sivir-ui/svelte sivir add <component-slug>
```

`init -y` copies `ui.css` and shared utilities into `src/lib/sivir`, writes `sivir.json`, installs missing base dependencies, and replaces `@import 'tailwindcss';` with an import of `ui.css` in the stylesheet `sv add tailwindcss` created (`src/routes/layout.css` or `src/app.css`). For any other stylesheet, make that replacement yourself. Without `-y`, `init` prompts for the directory and alias and confirms the dependency install and stylesheet edit. If `sivir.json` already exists, use its `dir` and `alias` instead of the defaults. Let the CLI resolve transitive Sivir dependencies, and add only the components the design needs.

`sivir list` prints installable component slugs and built-in theme slugs. `sivir add theme <slug>` writes `theme.css` into the Sivir directory; import it after `ui.css`.

`sivir add` installs missing source; it is not a safe update command. It leaves existing files that differ from the registry untouched unless `--overwrite` is passed, but it still records the new component version in `sivir.json`. Before updating copied components, inspect local modifications and the upstream change, then ask before using `--overwrite`, because it replaces owned source.

## Step 6: Implement in Sivir's Language

Use Svelte 5 state and binding patterns that match the project's code. Use each component's typed callbacks and bindable props as documented.

Use Sivir's semantic color utilities (`bg-background`, `bg-card`, `bg-secondary`, `text-foreground`, `text-foreground-muted`, `border-border`, `text-primary`) and existing Tailwind utilities before custom values. Dark mode applies under a `.dark` class on `<html>`, where some components also read it; Sivir does not toggle it.

For AI interfaces, treat the transcript, message roles, response content, reasoning, tools, questions, progress, attachments, and the composer as separate stateful parts. Do not render every assistant event as a chat bubble, and do not animate text that is already arriving live.

Build the empty, loading, error, and success states, and make long content wrap or scroll in its own region.

## Step 7: Verify the Result

Run the project's normal format and lint checks. Run broader checks only when the user or host repository requires them.

Inspect the rendered interface at desktop and narrow widths, in light and dark mode. Exercise keyboard focus, overlays (Escape and outside click), form submission, disabled and pending states, transcript following, and long content where they apply. Check the browser console for errors.

Before finishing, confirm:

- Every Sivir API used matches the installed version.
- `ui.css` (package or local copy) is imported exactly once, with no separate Tailwind import.
- The result passes the review steps in `references/design-language.md` from this skill.
- The interface uses real product content, not placeholder copy.

Report the Sivir components added, the integration mode, the verification performed, and any version or documentation limitation.
