import { tv } from 'tailwind-variants';

export const input = tv({
	base: 'px-3 py-1 w-full rounded-lg focus-visible duration-150 flex h-9 w-full rounded-lg border bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-foreground/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
	variants: {
		variant: {
			primary:
				'dark:bg-secondary bg-accent text-foreground border-input/80 placeholder:text-foreground/40 disabled:bg-secondary-disabled',
			outlined:
				'bg-popover text-foreground border border-input/80 placeholder:text-outlined disabled:bg-background-disabled disabled:border-border-disabled disabled:text-foreground-disabled',
			secondary:
				'bg-secondary text-foreground placeholder:text-muted-foreground border-none disabled:bg-secondary-disabled disabled:text-foreground-disabled'
		}
	}
});
