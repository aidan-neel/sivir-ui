import type { Snippet } from 'svelte';
import { tv } from 'tailwind-variants';

export const badge = tv({
	base: 'font-medium btn hover:cursor-default text-xs p-1 px-2 text-foreground-btn duration-150 flex items-center justify-center rounded-lg disabled:bg-primary-disabled disabled:cursor-not-allowed disabled:opacity-50',
	variants: {
		variant: {
			primary: 'bg-primary hover:bg-primary/80 text-foreground-btn',
			secondary: 'bg-secondary text-foreground hover:bg-secondary/70',
			flat: 'bg-primary/30 text-primary/80 hover:bg-primary/20',
			outlined: 'bg-background text-foreground border border-border hover:bg-secondary',
			ghost: 'bg-transparent text-foreground hover:bg-secondary',
			alternate: 'bg-alternate text-primary hover:bg-alternate/90',
			destructive:
				'bg-destructive text-foreground-btn hover:bg-destructive/80 disabled:bg-destructive-disabled disabled:text-text-disabled'
		}
	},
	defaultVariants: {
		variant: 'primary'
	}
});
