import type { Snippet } from 'svelte';
import { tv } from 'tailwind-variants';

export const button = tv({
	base: 'font-medium text-sm text-foreground-btn duration-150 flex hover:cursor-pointer items-center justify-center rounded-lg h-9 px-4 gap-1.5 whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-primary/90',
	variants: {
		variant: {
			primary: 'bg-primary hover:bg-primary/80 focus-visible focus-visible:bg-primary/80',
			secondary:
				'bg-secondary text-foreground hover:bg-muted/80 focus-visible focus-visible:bg-muted',
			flat: 'bg-primary/20 shadow-none text-primary/90 hover:bg-primary/10 focus-visible focus-visible:bg-primary/10',
			outlined:
				'bg-popover dark:bg-secondary dark:hover:bg-accent/30 dark:focus-visible:bg-secondary/50 text-foreground border border-input/80 hover:bg-muted/60 focus-visible focus-visible:bg-secondary',
			ghost:
				'bg-transparent shadow-none text-foreground hover:bg-muted/50 dark:hover:bg-accent/50 focus-visible focus-visible:bg-secondary',
			alternate:
				'bg-alternate text-primary hover:bg-alternate/90 focus-visible focus-visible:bg-alternate/90',
			destructive:
				'bg-destructive text-foreground-btn dark:text-foreground hover:bg-destructive/80 focus-visible focus-visible:bg-destructive/80'
		},
		size: {
			icon: 'h-9 w-9 p-0'
		}
	},
	defaultVariants: {
		variant: 'primary'
	}
});
