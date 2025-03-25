import type { Snippet } from 'svelte';
import { tv } from 'tailwind-variants';

export const badge = tv({
	base: 'font-medium btn hover:cursor-default text-sm py-1 px-3 text-foreground-opposite duration-150 flex items-center justify-center rounded-lg-full disabled:bg-primary-disabled disabled:cursor-not-allowed disabled:opacity-50',
	variants: {
		variant: {
			primary: 'bg-primary text-foreground-opposite border-btn hover:bg-primary-hovered',
			secondary: 'bg-secondary text-text hover:bg-secondary-hovered',
			flat: 'bg-flat text-flat-foreground hover:text-primary-hovered focus-visible:text-primary-hovered hover:bg-flat-hovered',
			outlined: 'bg-background text-text border border-border focus-visible:bg-outlined-hovered',
			ghost: 'hover:bg-ghost-hovered focus-visible:bg-ghost-hovered text-text bg-transparent',
			alternate:
				'bg-alternate text-primary-alternate hover:bg-alternate-hovered focus-visible:bg-alternate-hovered',
			destructive:
				'bg-destructive text-foreground-opposite hover:bg-destructive-hovered focus-visible:bg-destructive-hovered disabled:bg-destructive-disabled disabled:text-text-disabled'
		}
	},
	defaultVariants: {
		variant: 'primary'
	}
});
