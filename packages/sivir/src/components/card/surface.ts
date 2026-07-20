/** Outer concentric frame: hairline border + header-tinted fill. */
export const CARD_PANEL_FRAME =
	'p-0.5 rounded-[var(--radius-lg)] border border-border bg-[color-mix(in_oklab,var(--color-foreground)_3%,var(--color-card))] dark:border-[color-mix(in_oklab,var(--color-border)_40%,transparent)]';

/** Inset surface: card fill + soft inner ring. Bring your own padding.
 * Radius is the frame radius minus the 2px frame inset so corners stay concentric. */
export const CARD_PANEL_SURFACE =
	'rounded-[calc(var(--radius-lg)-2px)] bg-card ring-1 ring-[color-mix(in_oklab,var(--color-border)_50%,transparent)] dark:ring-[color-mix(in_oklab,var(--color-border)_50%,transparent)]'; // token-lint-disable-line no-literal-length
