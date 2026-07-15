# Sivir

Small, copyable UI primitives and supporting theme utilities.

## Folders

- `components/`: Svelte components plus small TypeScript entrypoints and variant definitions.
- `internals/`: Shared state and transition helpers used by multiple components.
- `themes/`: Theme utility types, CSS generation, and live theme hydration helpers.
- `ui.css`: The shared design tokens and component token defaults.
- `utils.ts`: Shared class, focus, and interaction helpers.

## Notes

- Components are designed to be copied and adjusted without a large abstraction layer.
- Theme utility logic lives in TypeScript so studio state and generated CSS stay in sync.
- Helpers stay intentionally small so behavior is easy to trace when something needs to change.
