import type { DefaultProps } from '@sivir/ui/utils';
import Panel from './panel.svelte';

export type PanelProps = DefaultProps;

/** The outer concentric frame: hairline border + header-tinted fill + lift. */
export const PANEL_FRAME =
	'p-0.5 rounded-[var(--radius-lg)] border border-[var(--panel-border,var(--color-border))] bg-[var(--panel-header-bg,color-mix(in_oklab,var(--color-foreground)_3%,var(--color-card)))] dark:border-[var(--panel-border,color-mix(in_oklab,var(--color-border)_40%,transparent))]';

/** The inset surface card: card fill + soft inner ring. Bring your own padding.
 * Its radius is the frame radius minus the 2px frame inset, so the inner corner
 * stays concentric with the outer corner across themes. */
export const PANEL_SURFACE =
	'rounded-[calc(var(--radius-lg)-2px)] bg-[var(--panel-bg,var(--color-card))] ring-1 ring-[color-mix(in_oklab,var(--panel-border,var(--color-border))_50%,transparent)] dark:ring-[color-mix(in_oklab,var(--panel-border,var(--color-border))_50%,transparent)]'; // token-lint-disable-line no-literal-length

export { Panel };
export default Panel;
