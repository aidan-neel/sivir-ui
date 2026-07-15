import { type ClassValue, clsx, twMerge } from 'cnfast';
import {
	computePosition,
	offset,
	flip,
	shift,
	size,
	type Placement,
	type ReferenceElement
} from '@floating-ui/dom';
import type { Snippet } from 'svelte';

export type DefaultProps = {
	class?: string;
	children?: Snippet;
} & Partial<Record<`data-${string}`, string | boolean | null>>;

/** Merges class values and resolves Tailwind conflicts via cnfast. Sivir uses
 * the `cn(className,
 * extraClasses)` convention -- consumer's `className` first, library-side
 * classes after. `.reverse()` flips into twMerge so the first argument wins
 * on conflicts (consumer overrides always take precedence). */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs.reverse()));
}

const FOCUSABLE_SELECTOR = [
	'a[href]',
	'area[href]',
	'button:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'iframe',
	'object',
	'embed',
	'[contenteditable="true"]',
	'[tabindex]:not([tabindex="-1"])'
].join(', ');

/** Returns the visible, interactive descendants inside a container. */
export function getFocusableElements(container: HTMLElement) {
	return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((el) => {
		if (el.hasAttribute('disabled')) return false;
		if (el.getAttribute('aria-hidden') === 'true') return false;
		return !(
			el.offsetParent === null &&
			getComputedStyle(el).position !== 'fixed' &&
			getComputedStyle(el).position !== 'sticky'
		);
	});
}

/** Focuses the first focusable descendant when one exists. */
export function focusFirstDescendant(container: HTMLElement) {
	const first = getFocusableElements(container)[0];
	first?.focus();
	return first;
}

/** Keeps keyboard focus inside a container and restores the previous focus on cleanup. */
export function trapFocus(
	dialogEl: HTMLElement,
	options?: { initialFocus?: HTMLElement | null; returnFocus?: HTMLElement | null }
) {
	if (!dialogEl) return;

	const previouslyFocused =
		options?.returnFocus ??
		(document.activeElement instanceof HTMLElement ? document.activeElement : null);

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key !== 'Tab') return;

		const focusable = getFocusableElements(dialogEl);

		if (focusable.length === 0) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];
		const active = document.activeElement as HTMLElement | null;

		if (e.shiftKey) {
			if (!active || !dialogEl.contains(active) || active === first) {
				e.preventDefault();
				last.focus();
			}
		} else {
			if (!active || !dialogEl.contains(active) || active === last) {
				e.preventDefault();
				first.focus();
			}
		}
	};

	const handleFocusIn = (e: FocusEvent) => {
		const target = e.target as Node | null;
		if (!target || dialogEl.contains(target)) return;
		if (options?.initialFocus) {
			options.initialFocus.focus();
		} else if (!focusFirstDescendant(dialogEl)) {
			dialogEl.focus();
		}
	};

	document.addEventListener('keydown', handleKeydown, true);
	document.addEventListener('focusin', handleFocusIn, true);

	queueMicrotask(() => {
		if (options?.initialFocus) {
			options.initialFocus.focus();
		} else if (!focusFirstDescendant(dialogEl)) {
			dialogEl.focus();
		}
	});

	return () => {
		document.removeEventListener('keydown', handleKeydown, true);
		document.removeEventListener('focusin', handleFocusIn, true);
		previouslyFocused?.focus();
	};
}

/** Runs a callback when a pointer event lands outside the node and any excluded nodes. */
export function clickOutside(node: Node, callback: () => void, exclude: Node[] = []) {
	let destroyed = false;
	const handleClick = (event: MouseEvent) => {
		const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
		const target = event.target as Node | null;
		const isInsideNode = path.includes(node) || (target ? node.contains(target) : false);
		const isInsideExcluded = exclude.some(
			(excludeNode) => path.includes(excludeNode) || (target ? excludeNode.contains(target) : false)
		);
		// Floating layers (Select, DropdownMenu, etc.) portal to <body> and carry
		// `data-floating-content`. Clicking one of their items closes that layer,
		// and Svelte flushes the removal synchronously *before* this document-level
		// listener runs -- so the now-detached node drops out of composedPath().
		// Fall back to the target's own ancestor chain, which stays intact after
		// the wrapper is detached, so a parent overlay (Modal/Sheet) isn't dismissed.
		const targetEl = target instanceof Element ? target : null;
		const isInsideFloating =
			path.some((el) => el instanceof Element && el.hasAttribute('data-floating-content')) ||
			targetEl?.closest('[data-floating-content]') != null;

		if (!isInsideNode && !isInsideExcluded && !isInsideFloating) {
			callback();
		}
	};

	const installTimeout = setTimeout(() => {
		if (!destroyed) document.addEventListener('click', handleClick);
	}, 0);

	return {
		destroy() {
			destroyed = true;
			clearTimeout(installTimeout);
			document.removeEventListener('click', handleClick);
		}
	};
}

/** Positions a floating panel while keeping it inside the viewport bounds. */
export function positionFloatingPanel(
	reference: ReferenceElement,
	floating: HTMLElement,
	placement: Placement
) {
	return computePosition(reference, floating, {
		placement,
		middleware: [
			offset(8),
			flip({ padding: 8, crossAxis: true, fallbackAxisSideDirection: 'start' }),
			shift({ padding: 8, crossAxis: true }),
			size({
				padding: 8,
				apply({ availableWidth, availableHeight, elements }) {
					elements.floating.style.maxWidth = `${Math.max(availableWidth, 0)}px`;
					elements.floating.style.maxHeight = `${Math.max(availableHeight, 0)}px`;
					elements.floating.style.setProperty(
						'--popover-available-width',
						`${Math.max(availableWidth, 0)}px`
					);
					elements.floating.style.setProperty(
						'--popover-available-height',
						`${Math.max(availableHeight, 0)}px`
					);
				}
			})
		]
	})
		.then(({ x, y }) => {
			Object.assign(floating.style, {
				left: `${x}px`,
				top: `${y}px`
			});
		})
		.catch(() => {
			// Floating UI may reject when either element is removed during an
			// asynchronous layout pass. Teardown is an expected terminal state.
		});
}
