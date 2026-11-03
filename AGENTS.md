# Verification

Before reporting a change complete, run from the repository root:

```sh
bun repo check
```

It runs, in parallel, only the checks the changed files need: Biome on the
changed files, type checks for each touched workspace and the workspaces that
depend on it, that workspace's tests, the repository script tests, and a
changelog check. It exits non-zero when any check fails. Judge it by its own
exit code, never by piped output.

- `--fix` lets Biome write. Use it only on files you changed.
- `--browser` also runs the docs browser tests. Run it when you changed a
  component or docs source; the check lists them as not run until you do.
- `--all` checks everything, and `--base <ref>` compares with another branch.

Builds and package artifact verification stay manual. Run them only when the
user asks, including before a push or release:

```sh
bun run build
bun --cwd=packages/sivir run verify:artifact
bun --cwd=packages/sivir run verify:cli-artifact
```

For a pre-release, invoke the `release-gate` skill or run:

```sh
bun run release-gate
```

That is the full publish bar: format, lint, audit, typecheck, unit/SSR tests, docs
browser tests, build, and packed artifact verification. Do not skip steps.

# Visual Verification

Format and lint passing does not mean a UI change looks right. Any change to
components, styling, tokens, themes, layout, motion, or docs pages must be seen
in a real browser before you report it done. This is required, not part of the
manual-only test suite above.

1. Use the running docs dev server, usually `http://localhost:5173`. If none is
   running, start one with `bun run dev` from `apps/docs`.
2. Open every page, docs example, and Studio view the change touches.
   Screenshot each one in light and dark mode at 1440px wide, and at 390px wide
   when the page is responsive.
3. Exercise the states the change affects: hover, focus, press, open menus,
   selects, modals and sheets, disabled, loading, and empty. Screenshot each.
4. For motion (enter and exit, the traveling highlight, transitions, layout
   shift), capture 8 to 10 frames across the transition. Do not judge motion
   from code alone.
5. Read every screenshot yourself. Look for clipping and cutoffs at edges,
   layout shift, horizontal overflow, low contrast, and anything inconsistent
   with neighboring components or `DESIGN.md`. Check the console for errors and
   hydration warnings.
6. Fix what you find and capture again. Repeat until the result is clean.
7. In your final summary, list what you captured and what you fixed. If you
   could not verify visually, say so plainly. Never claim a visual change
   looks right without screenshots.

A browser is always available on this machine. Never conclude otherwise:

- Try the Playwright MCP (`browser_*` tools) first. If it fails with
  "Chromium distribution 'chrome' is not found", use the fallbacks below
  instead of stopping.
- For a one-off screenshot:
  `bunx playwright@1.60.0 screenshot --color-scheme=dark --viewport-size=1440,900 --wait-for-timeout=1000 <url> <out.png>`
- For interaction or frame capture, write a script in your scratchpad, outside
  the repo, that imports `chromium` from `'playwright@1.60.0'`, and run it with
  `bun script.mjs`. Bun installs it automatically. Never add these scripts to
  the repo.
- Open the PNGs with the Read tool to view them.

Other agent sessions often edit this checkout at the same time, and the dev
server reloads when they save. If a page reloads or a selector disappears
mid-capture, retry before concluding your change is broken.

# Development Servers

Never stop, terminate, or send signals (including `SIGABRT`) to a development
server started by the user. If the user is already running a development server,
use that server for local verification instead of starting another one.

# Styling

Read and follow [`DESIGN.md`](DESIGN.md) for all UI and visual design work. It
is the repository's authority for composition, typography, rhythm, restraint,
responsive behavior, and visual review.

Use Tailwind CSS exclusively for styling. Never write raw CSS unless it is
absolutely required for the implementation.

# Component Architecture

Before creating or changing a component's exported names, confirm the proposed
public API with the user. This includes component names, exported prop types,
variants, subcomponents, hooks, and utility exports. Do not add or change an
exported component API without that confirmation.

Components must meet a high quality bar:

- Define precise prop types that model the supported API, required and optional
  values, event-handler signatures, ref types, and mutually exclusive states.
  Do not use `any`, overly broad index signatures, or untyped rest props.
- Keep implementation details private. Export only names that form an
  intentional, minimal, composable public API.
- Do not write inline comments in component code. Add a concise docstring only
  when a non-obvious public contract or constraint cannot be expressed through
  naming and types.
- Use semantic HTML, preserve native element behavior, and forward props and
  refs only when the approved API requires them.
- Favor clear, focused components with explicit state and predictable behavior
  over clever abstractions or convenience exports.
- Sketch the composition before building: list the exported subparts and show
  one composed usage with a part omitted, reordered, or restyled. If every
  usage is just Root with props, the API is not composable. Decompose, or
  justify atomicity for genuinely Button-sized components.
- Map every visually distinct region (header row, summary counts, code
  surface, gutters) to an exported subpart or a documented snippet slot.
  Fusing regions into a single part so consumers cannot omit, reorder, or
  restyle them is prohibited.
- Render data-driven (high-level) props through the same public subparts
  consumers compose with, never a parallel private implementation.
- Expose computed summaries (counts, totals) as data (context with prop
  fallbacks) and as a renderable part, so both the high-level form and custom
  compositions read the same values.
- Keep the component's docs page in sync with its API. New, changed, or
  removed subcomponents, props, and behaviors must be reflected in the page's
  usage prose, examples, and code snippets in the same change — never ship the
  API without its docs.

# Changelog

After every completed task, always write a release-note bullet to the docs
changelog:

`changelog/<next-release-version>/<change-type>.md`

The version is the next release to ship. If `0.2.8` is current and the next
release is `0.2.9`, write to `changelog/0.2.9/`. Use a change-type filename that
matches the work: `feature.md`, `fix.md`, `breaking.md`, or `docs.md`.

That file is the human changelog. It compiles into `/docs/changelog` and
`/changelog/<package-version>.md`. Keep bullets concise, factual, and focused on
externally relevant behavior. One concern per bullet. Do not narrate
implementation, file paths, or migration walkthroughs there.

## Docs changelog vs LLM changelog

Always write the docs changelog bullet. Also write
`changelog/<next-release-version>/llm.md` when a coding agent would need more
than that bullet to upgrade, compose, or avoid a footgun.

Write the LLM changelog for:

- Breaking or default-behavior changes (new required structure, inverted
  defaults, removed exports).
- Shared visual or overlay contracts other components must copy, not invent.
- Migrations where the old call site would still type-check but behave wrong.
- Changes an agent would mis-implement from a one-line note.

Do not write `llm.md` for copy tweaks, docs-only navigation, routine visual
polish, or dependency bumps that do not change how agents use Sivir.

`llm.md` is prose for agents, not a second bullet list. Explain the new
contract, what to stop doing, and how to compose the result. Do not paste the
docs changelog into it. The compiled page is `/changelog/<version>/llm.md`.

If `llm.md` already exists for that version, add a section for the new change
instead of creating another file.

# Formatting

Formatting is part of the code quality bar, not a cleanup task to defer. All
supported source, configuration, and documentation files must be formatted with
the repository's Biome configuration before review. Run `bun run format` while
editing and `bun run format:check` before considering formatting work complete.
Do not hand-format around Biome or disable it for individual files.

Write code for people to scan, review, debug, and safely modify. Compact code
is not concise when it hides structure. The following rules are mandatory:

- Put every `import` and `export` declaration on its own logical line. Use
  multi-line import or export specifiers when Biome wraps them.
- Write object, type, interface, tuple, and function parameter definitions
  across multiple lines when they contain several properties, parameters, or
  nested values. Keep one concern per line and use a trailing comma where
  Biome adds one.
- Use one statement per line. Never combine declarations, assignments,
  conditions, loops, or side effects with semicolons on a single line.
- Give every function, method, constructor, callback with non-trivial work, and
  control-flow branch a block body with its contents on separate lines. Do not
  write one-line functions or methods, including seemingly small async methods
  and constructors.
- Put `if`, `else`, `try`, `catch`, `finally`, loops, and `switch` bodies on
  their own indented lines. Always use braces for control flow, even when the
  body has one statement.
- Break long calls into a vertical structure: one argument or meaningful
  options property per line. Extract an intermediate variable when a chained
  expression, callback, or condition remains difficult to read after
  formatting.
- Group related declarations and methods together. Separate imports, types,
  constants, constructors, public methods, private helpers, and unrelated
  logical sections with a blank line. Do not insert blank lines inside a small,
  cohesive sequence of statements.
- Indent nested blocks consistently. Align closing delimiters with the line
  that opened their block; do not manually misalign wrapped expressions.
- Prefer descriptive intermediate names over deeply nested expressions. A
  small amount of vertical space is preferable to duplicated requests, nested
  ternaries, or dense `map`/`filter`/`reduce` chains.
- Preserve intentional surrounding organization, but reformat all touched code
  to these standards. Do not leave compressed code adjacent to expanded code.

The following style is prohibited, even if a formatter could technically keep
it on one line:

```ts
async account() { const user = await this.octokit.request("GET /user"); return { login: user.data.login, type: user.data.type }; }
```

Write it with readable vertical structure instead:

```ts
async account() {
  const user = await this.octokit.request("GET /user");

  return {
    login: user.data.login,
    type: user.data.type,
  };
}
```

# Worktrees

Other sessions often work in the main checkout, and two sessions in one checkout
share one git index. Do branch work in a worktree under `.claude/worktrees/`
(`git worktree add -b <branch> .claude/worktrees/<name> origin/main`), then run
`bun install` in it.

- Commit with paths (`git commit -m "..." -- <files>`) and read
  `git show --stat HEAD` before pushing, so you never commit someone else's
  staged work.
- `bun repo worktrees` lists worktrees and whether each is safe to remove.
  Remove them only with `bun repo worktrees --prune`, which keeps any with
  uncommitted, unpushed, or ignored work, or an unmerged pull request.

# Pull Requests

The repository is `aidan-neel/sivir-ui`. Use `gh`. Open a pull request only
when the user asks. Agents never approve or merge directly; they queue
auto-merge, which lands after a human approval and green checks.

## Branches and titles

- Branch from an up-to-date `main` as `<type>/<short-kebab-name>`.
- `main` squash-merges, so the pull request title becomes the commit. Write it
  as `type(scope): outcome`, in plain words, under 72 characters:
  `fix(select): the menu keeps its width when an item is picked`.
  - Types: `fix`, `feat`, `perf`, `refactor`, `test`, `docs`, `ci`, `chore`,
    `revert`.
  - Scope: a component (`select`, `sidebar`), or an area (`cli`, `docs`,
    `studio`, `registry`, `themes`, `ci`, `agents`).
- One logical change per commit. Never commit generated output you did not
  regenerate, screenshots, secrets, or debugging leftovers.

## Body

Fill `.github/pull_request_template.md`: **Problem** in a sentence or two,
**Change** and why each area it touches is needed, and **Verification** with
what you ran and saw. Name the tests that fail without the fix and anything you
could not check; "tests pass" alone is not verification. Delete every section
that does not apply. No bullet per file.

UI changes show screenshots of the running docs in light and dark, one
collapsed `<details>` block per design change.

## Labels

- Area labels (`component`, `cli`, `registry`, `docs`, `ci`, `a11y`) and `bug`
  or `feature` where they apply. `v1` marks a v1.0.0 release blocker.
- **`DO NOT MERGE`** when a person must do something first (a secret, a
  settings change, a product decision), and say what in Problem. The
  `Merge guard` check fails while it is set.
- `size:XS` to `size:XXL` are added automatically. `bun.lock` and the built
  registry never count, and tests count only in a test-only pull request.
- Status labels belong to the loop below. Set them with
  `bun repo pr <number> <in-progress|ready|needs-human>`.

## The pull request loop

1. **Open and queue.** Open the pull request, run `bun repo pr <n> in-progress`,
   then `gh pr merge <n> --auto --squash` unless it is a draft or depends on an
   unmerged pull request.
2. **Watch it.** In T3, `watch_pull_request` and end the turn; otherwise run
   `gh pr checks <n> --watch` in the background. Never poll or sleep.
3. **Fix what comes back.** On a failed check, read the log
   (`gh run view <id> --log-failed`), reproduce it, and fix the cause. Never
   rerun to get green. Comment `@claude review` for the Claude review. Check
   each finding against the source: fix real ones, reply with evidence to the
   rest, and resolve the thread.
4. **Mark it ready** with `bun repo pr <n> ready` once every check is green on
   the latest commit and every thread is resolved. A human approves; auto-merge
   lands it.
5. **Hand off when stuck.** When it needs a product decision, a human step, or
   something you cannot verify, run `bun repo pr <n> needs-human`, comment
   exactly what is needed, and stop.
6. **Keep it current.** When `main` moves and the branch is behind or
   conflicts, rebase, rerun `bun repo check`, and push with
   `--force-with-lease` on your own branch only.
7. **Stop watching** once it merges, or when only a human step remains. Report
   the URL, check status, and open threads.

One pull request holds the task and every follow-up found while doing it. Size
alone is never a reason to split. Finish local fixes and checks before pushing,
so each push is one CI run.

## CI

`.github/workflows/ci.yml` runs every job on pull requests, pushes to `main`,
and releases. `All checks` fails unless every job passed. Branch protection
requires only it and `Merge guard`, so adding a job never needs a settings
change.

# Known Mistakes

When a mistake breaks CI, loses work, needs a revert, or draws a user
correction, add the rule that prevents it to the section it belongs in. One or
two lines: the rule, then what broke.
