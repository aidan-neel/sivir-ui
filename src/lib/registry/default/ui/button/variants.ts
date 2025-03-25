import type { Snippet } from 'svelte';
import { tv } from 'tailwind-variants';

export const button = tv({
	base: 'font-medium btn text-[14.75px] text-foreground-opposite duration-150 h-btn px-3 flex items-center justify-center rounded-lg disabled:bg-primary-disabled disabled:cursor-not-allowed disabled:opacity-50',
	variants: {
		variant: {
			primary:
				'bg-primary text-foreground-opposite border-btn hover:bg-primary-hovered focus-visible:bg-primary-hovered disabled:bg-primary-disabled disabled:cursor-not-allowed disabled:opacity-50 duration-150',
			secondary:
				'bg-secondary text-text hover:bg-secondary-hovered focus-visible:bg-secondary-hovered disabled:bg-secondary-disabled',
			flat: 'bg-flat text-flat-foreground hover:text-primary-hovered focus-visible:text-primary-hovered hover:bg-flat-hovered focus-visible:bg-flat-hovered disabled:bg-flat-disabled disabled:text-flat-foreground-disabled',
			outlined:
				'bg-background text-text border border-border hover:bg-outlined-hovered focus-visible:bg-outlined-hovered disabled:bg-background-disabled disabled:border-border-disabled disabled:text-text-disabled',
			ghost:
				'hover:bg-ghost-hovered focus-visible:bg-ghost-hovered text-text bg-transparent disabled:text-text-disabled disabled:hover:bg-transparent disabled:focus-visible:bg-transparent',
			alternate:
				'bg-alternate text-primary-alternate hover:bg-alternate-hovered focus-visible:bg-alternate-hovered disabled:bg-alternate-disabled disabled:text-primary-alternate-disabled',
			destructive:
				'bg-destructive text-foreground-opposite hover:bg-destructive-hovered focus-visible:bg-destructive-hovered disabled:bg-destructive-disabled disabled:text-text-disabled'
		}
	},
	defaultVariants: {
		variant: 'primary'
	}
});
