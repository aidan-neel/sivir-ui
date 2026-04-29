import { tv } from 'tailwind-variants';

export const alert = tv({
	base: 'flex flex-row gap-2 rounded-[var(--radius-lg)] border border-border bg-[var(--color-panel)] p-4 text-[var(--color-panel-foreground)] shadow-[inset_0_1px_0_var(--panel-highlight),var(--panel-shadow)]',
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
