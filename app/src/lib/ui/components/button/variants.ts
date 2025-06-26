import type { Snippet } from 'svelte';
import { tv } from 'tailwind-variants';

export const button = tv({
	base: 'font-medium text-sm text-foreground-btn duration-150 flex items-center justify-center rounded-lg hover:cursor-default h-9 px-3 gap-1.5 whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-primary/90',
	variants: {
		variant: {
			primary: 'bg-primary active:bg-primary/80 hover:bg-primary/80',
			secondary: 'bg-secondary active:bg-secondary/50 text-foreground hover:bg-secondary/60',
			flat: 'bg-primary/20 shadow-none active:bg-primary/30 text-primary/90 hover:bg-primary/10',
			outlined: 'bg-background text-foreground border border-border hover:bg-secondary',
			ghost: 'bg-transparent shadow-none active:bg-secondary/60 text-foreground hover:bg-secondary',
			alternate: 'bg-alternate active:bg-alternate text-primary hover:bg-alternate/90',
			destructive:
				'bg-destructive active:bg-destructive text-foreground-btn dark:text-foreground hover:bg-destructive/80'
		},
		size: {
			icon: 'h-9 w-9 p-0'
		}
	},
	defaultVariants: {
		variant: 'primary'
	}
});
