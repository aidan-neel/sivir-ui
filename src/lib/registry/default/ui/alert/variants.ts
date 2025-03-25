import type { Snippet } from 'svelte';
import { tv } from 'tailwind-variants';

export const alert = tv({
	base: 'p-4 bg-background gap-2 flex flex-row shadow-sm rounded-lg',
	variants: {
		variant: {
			info: 'text-info border',
			error: 'text-error border',
			warning: 'text-warning border',
			success: 'text-success border'
		}
	},
	defaultVariants: {
		variant: 'info'
	}
});
