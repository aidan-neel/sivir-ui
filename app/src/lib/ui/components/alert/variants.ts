import type { Snippet } from 'svelte';
import { tv } from 'tailwind-variants';

export const alert = tv({
	base: 'p-4 bg-background gap-2 flex border flex-row rounded-lg',
	variants: {
		variant: {
			info: 'text-info',
			error: 'text-error',
			warning: 'text-warning',
			success: 'text-success'
		}
	},
	defaultVariants: {
		variant: 'info'
	}
});
