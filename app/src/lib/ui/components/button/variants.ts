import type { Snippet } from 'svelte';
import { tv } from 'tailwind-variants';

export const button = tv({
	base: 'font-medium btn text-sm text-foreground-opposite hover:cursor-default duration-150 py-1.5 px-4 flex items-center justify-center rounded-lg disabled:bg-primary-disabled disabled:cursor-not-allowed disabled:opacity-50',
	variants: {
		variant: {
			primary:
				'bg-primary active:bg-primary-active text-foreground-opposite border-btn hover:bg-primary-hovered focus-visible:bg-primary-hovered disabled:bg-primary-disabled disabled:cursor-not-allowed disabled:opacity-50 duration-150',
			secondary:
				'bg-secondary active:bg-secondary-active text-foreground hover:bg-secondary-hovered focus-visible:bg-secondary-hovered disabled:bg-secondary-disabled',
			flat: 'bg-primary/30 active:bg-primary/10 text-primary/80 hover:text-primary/40 focus-visible:text-primary-hovered hover:bg-primary/20 focus-visible:bg-flat-hovered disabled:bg-flat-disabled disabled:text-flat-foreground-disabled',
			outlined:
				'bg-background text-foreground active:bg-outlined-active border border-border hover:bg-outlined-hovered focus-visible:bg-outlined-hovered disabled:bg-background-disabled disabled:border-border-disabled disabled:-disabled',
			ghost:
				'hover:bg-ghost-hovered active:bg-ghost-active text-foreground focus-visible:bg-ghost-hovered  bg-transparent disabled:-disabled disabled:hover:bg-transparent disabled:focus-visible:bg-transparent',
			alternate:
				'bg-alternate active:bg-alternate-active text-primary-alternate hover:bg-alternate-hovered focus-visible:bg-alternate-hovered disabled:bg-alternate-disabled disabled:text-primary-alternate-disabled',
			destructive:
				'bg-destructive active:bg-destructive-active font-medium text-foreground-opposite hover:bg-destructive-hovered focus-visible:bg-destructive-hovered disabled:bg-destructive-disabled disabled:-disabled'
		}
	},
	defaultVariants: {
		variant: 'primary'
	}
});
