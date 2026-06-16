# @silk/cli

Install [Silk UI](https://silk-ui.dev) components into your Svelte project. Like shadcn:
the CLI copies component source into your repo — you own the code, there is no runtime
library dependency.

```bash
npx @silk/cli init
npx @silk/cli add button
```

> Prefer a runtime dependency instead of owning the code? Install the
> [`@silk/ui`](../silk) library and `import { Button, Tabs } from '@silk/ui'`.

## Commands

### `silk init`

Bootstraps silk in the current project:

- writes `silk.json` (install directory, import alias, theme registry URL)
- installs the theme tokens (`ui.css`), `utils.ts`, and `internals/*`
- reports any missing peer dependencies

```bash
silk init          # interactive prompts
silk init --yes    # accept defaults (src/lib/silk, $lib/silk)
```

Import the installed `ui.css` in your root layout or app stylesheet to activate the
token system.

### `silk add <component...>`

Installs one or more components plus their transitive dependencies. Imports are
rewritten from `@silk/ui` to the alias configured in `silk.json`, installed versions
are recorded in `silk.json`, and missing npm peer dependencies are detected (and
installed for you if you confirm, or automatically with `--yes`).

```bash
silk add command            # pulls popover and button too
silk add dialog sheet -y    # multiple at once, no prompts
silk add button --overwrite # replace files that already exist
```

Existing files are never touched unless you pass `--overwrite`.

### `silk add theme <slug>`

Installs a theme as `theme.css` next to `ui.css`. Built-in presets resolve offline;
anything else is fetched from the theme registry (`registry` in `silk.json`) and
rendered to CSS. Import it after `ui.css` so its tokens win.

```bash
silk add theme default
```

Browse community themes at [silk-ui.dev/themes](https://silk-ui.dev/themes).

### `silk theme install <source>`

The same install as `add theme`, but `source` may also be an `https` URL. The CLI
fetches it and writes `theme.css`. A URL may serve either a `ThemeDraft` JSON document
(rendered to CSS) or ready-made CSS — the format is detected from the response.

```bash
silk theme install default                       # built-in preset (offline)
silk theme install midnight                      # registry slug
silk theme install https://themes.example.com/x  # JSON or CSS at a URL
```

### `silk list`

Prints every installable component (name, version, description) and the built-in
themes.

## `silk.json`

```json
{
	"dir": "src/lib/silk",
	"alias": "$lib/silk",
	"registry": "https://silk-ui.dev/api",
	"components": {
		"button": "3.0.0"
	}
}
```

| Field        | Purpose                                                  |
| ------------ | -------------------------------------------------------- |
| `dir`        | Directory component source is copied into                |
| `alias`      | Import alias that replaces `@silk/ui` in installed files |
| `registry`   | Theme registry API base URL used by `silk add theme`     |
| `components` | Installed components and versions, maintained by the CLI |

## How it works

Every component in `packages/silk` declares a `manifest.ts` (files, transitive
component deps, shared utilities, npm peers). `bun run build:registry` snapshots all
manifests into `registry/index.json` and copies the referenced sources into
`registry/files/`. That snapshot ships inside the npm package, so `silk add` resolves
and installs entirely offline — only `silk add theme <slug>` for non-built-in slugs
goes to the network.

## Development

```bash
bun run build:registry   # rebuild the registry snapshot from packages/silk
bun run build            # snapshot + bundle dist/index.js
bun run test             # bun test (resolver, rewriting, snapshot integrity)
bun run check            # tsc --noEmit
```

### Sandbox

`bun run sandbox` builds the CLI and runs it against a throwaway, SvelteKit-shaped
project under the gitignored `.sandbox/` directory — the fastest way to dogfood
`init`/`add` against a fresh install without touching a real repo.

```bash
bun run sandbox                # build, scaffold an app, drop into a shell where
                               # `silk` is the local build (type `exit` to leave)
bun run sandbox add button     # run any silk command against the sandbox app
bun run sandbox init -y        # the app accumulates across runs
bun run sandbox scenario       # scripted init → add → theme → re-add, with
                               # pass/fail assertions (exits non-zero on failure)
bun run sandbox reset --bare   # recreate the app without component peer deps,
                               # to exercise the missing-peer warnings
bun run sandbox clean          # delete .sandbox entirely
```

Prepend `--no-build` to any command to skip rebuilding the CLI first
(`bun run sandbox --no-build add card`).
