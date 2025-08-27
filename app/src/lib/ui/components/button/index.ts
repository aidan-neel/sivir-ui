import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import Button from './button.svelte';
import type { Snippet } from 'svelte';

export type ButtonVariant =
	| 'primary'
	| 'flat'
	| 'outlined'
	| 'secondary'
	| 'ghost'
	| 'alternate'
	| 'destructive';

export type ButtonProps = {
	href?: string;
	variant?: ButtonVariant;
	size?: 'icon' | 'default';
	children?: Snippet;
	element?: HTMLButtonElement | HTMLAnchorElement | undefined;
	onhover?: () => void;
	onhoverend?: () => void;
} & Partial<HTMLButtonAttributes | HTMLAnchorAttributes>;

export { Button };
export default Button;
