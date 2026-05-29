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
	/**
	 * Bindable reference to the rendered DOM element. Type is the union of
	 * the two possible element types -- narrow at the use site:
	 *
	 * ```ts
	 * let buttonEl: HTMLButtonElement | HTMLAnchorElement | undefined =
	 *   $state();
	 * // ...
	 * <Button bind:element={buttonEl} href={undefined} />
	 * if (buttonEl instanceof HTMLButtonElement) {
	 *   buttonEl.focus();
	 * }
	 * ```
	 *
	 * Pass `href={undefined}` to guarantee a `<button>` element and narrow
	 * to `HTMLButtonElement`; pass `href` to render an `<a>` element. The
	 * union exists because both element types share the public API surface;
	 * the type system can't distinguish without flow-sensitive analysis at
	 * the call site.
	 */
	element?: HTMLButtonElement | HTMLAnchorElement | undefined;
	onclick?: () => void;
} & Partial<HTMLButtonAttributes | HTMLAnchorAttributes>;

export { Button };
export default Button;
