import { type ClassValue, clsx } from 'clsx';
import type { Snippet } from 'svelte';
import { twMerge } from 'tailwind-merge';

export type DefaultProps = {
	class?: string;
	children?: Snippet;
} & Partial<Record<`data-${string}`, string>>;

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs.reverse()));
}

export function trapFocus(dialogEl: HTMLElement) {
	if (!dialogEl) return;

	const handleKeydown = (e: KeyboardEvent) => {
		if (e.key !== 'Tab') return;

		const focusable = Array.from(
			dialogEl.querySelectorAll<HTMLElement>(
				'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
			)
		).filter((el) => !el.hasAttribute('disabled'));

		if (focusable.length === 0) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (e.shiftKey) {
			if (document.activeElement === first) {
				e.preventDefault();
				last.focus();
			}
		} else {
			if (document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	};

	document.addEventListener('keydown', handleKeydown);
	dialogEl.focus();

	return () => {
		document.removeEventListener('keydown', handleKeydown);
	};
}

export function clickOutside(node: Node, callback: () => any, exclude: Node[] = []) {
	const handleClick = (event: MouseEvent) => {
		if (
			node &&
			!node.contains(event.target as Node) &&
			!exclude.some((excludeNode) => excludeNode.contains(event.target as Node))
		) {
			callback();
		}
	};

	setTimeout(() => {
		document.addEventListener('click', handleClick, true);
	}, 0);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}
