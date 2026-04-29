import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
import Button from './button.svelte';
import type { Snippet } from 'svelte';

export type ButtonVariant =
	| 'primary'
	| 'success'
	| 'warning'
	| 'error'
	| 'flat'
	| 'outlined'
	| 'secondary'
	| 'ghost'
	| 'alternate'
	| 'destructive';

export type ButtonProps = {
	href?: string;
	variant?: ButtonVariant;
	size?: 'sm' | 'default' | 'lg' | 'icon';
	children?: Snippet;
	element?: HTMLButtonElement | HTMLAnchorElement | undefined;
	onhover?: () => void;
	onhoverend?: () => void;
	onclick?: () => void;
} & Partial<HTMLButtonAttributes | HTMLAnchorAttributes>;

export type ButtonState = {
	onclick?: () => void;
};

export { Button };
export default Button;
