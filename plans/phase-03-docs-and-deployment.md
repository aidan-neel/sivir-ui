# Phase 3: Finish Docs And Deployment

## Objective

Make the public documentation and production services a truthful, complete
front door for the stable library created in Phase 2.

## Entry Criteria

- Phases 1 and 2 are complete.
- Package and CLI behavior are stable enough to document verbatim.
- The canonical domain and registry decision are recorded.

## Work

### 1. Make the documentation executable

- Follow the introduction and both install models from clean apps.
- Correct commands, imports, CSS setup, peer requirements, and file paths.
- Replace `bunx @sivir/ui ...` with
  `bunx --package @sivir/ui sivir ...` everywhere unless the published package
  is deliberately changed to expose a matching binary and that shorthand is
  verified.
- Ensure styling and theming docs cover tokens and presets without referencing
  Theme Studio.
- Ensure every component page appears in navigation and includes accurate API
  and runnable examples.
- Verify examples use only public APIs.

### 2. Make release messaging truthful

- Use pre-release language until the Phase 5 publish succeeds.
- Finalize `packages/sivir/package.json` at `1.0.0`, the intended release date,
  public version badges, v1 changelog, and release notes before Phase 4 freezes
  the candidate.
- Document Svelte 5 and Tailwind v4 as consumer requirements. Document Bun
  separately as repository and release tooling, since npm and pnpm consumers
  are supported.
- Document the supported install paths and the lack of Theme Studio.
- Remove stale historical version claims from prominent product surfaces.

### 3. Finalize theme discovery

- If the registry is in v1, keep the gallery read-only and verify list, search,
  preview/apply, CSS/JSON copy, and CLI install links.
- Ensure unavailable or malformed themes fail without breaking the page.
- If the registry is in v1, verify both public theme write endpoints return
  `405` without creating data.
- Ensure Studio links are absent in either registry path.
- If the registry is not in v1, hide community discovery and document built-in
  presets only.

### 4. Prepare production deployment

- Verify docs deployment with the default adapter and standalone Node adapter.
- Configure `THEME_REGISTRY_URL` only when the registry is included; otherwise
  ensure docs do not require it at runtime.
- If included, apply registry migrations before deployment and verify
  TLS/database settings.
- Verify canonical URLs, sitemap, metadata, social image, 404 behavior, and
  redirects from any owned alternate domain.
- Document deployment and rollback steps without placing secrets in the repo.

### 5. Check responsive and accessible presentation

- Manually check the homepage, docs shell, component pages, theme gallery, and
  error page at mobile and desktop widths.
- Check keyboard navigation, focus visibility, reduced motion, and major screen
  reader landmarks.
- Fix only release-impacting presentation defects; defer redesign work.

## Verification

```sh
bun run format:check
bun run lint
bun run check
bun --filter='docs' run test:ci
bun --filter='docs' run test:browser
bun --filter='registry' run test
bun run build
DOCS_ADAPTER=node bun --filter='docs' run build
```

Production-like smoke checks:

- Start docs against the intended registry configuration.
- Crawl internal links and confirm `/themes/studio` is not discoverable.
- Follow package and CLI installation instructions exactly in clean consumers.
- Verify mobile and desktop layouts in Chromium.

## Exit Criteria

- [ ] Public docs match the stable package and CLI behavior.
- [ ] Version, changelog, release date, and release notes are final before the
      candidate freeze.
- [ ] Every component reference is reachable and complete enough for v1 use.
- [ ] Themes work without Theme Studio, with gallery availability matching the
      Phase 1 decision.
- [ ] Both docs deployment targets build successfully.
- [ ] Production environment, migration, DNS, and rollback steps are recorded.
- [ ] No P0 or P1 docs, accessibility, responsive, or deployment issue remains.

## Not In This Phase

- A documentation redesign.
- Theme Studio documentation or demos.
- Publishing npm artifacts.
