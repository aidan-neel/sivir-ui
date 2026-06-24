import { tv } from 'tailwind-variants';

/**
 * Neutral callout styled like an outline button: a calm card surface with the
 * outline button's hairline edge + subtle inset lift (no status tint on the
 * surface). Status reads purely from the colored icon.
 */
export const alert = tv({
	base: 'flex flex-row gap-3 rounded-[var(--radius-lg)] bg-[var(--button-outlined-bg)] px-4 py-3 text-[var(--button-outlined-foreground)] shadow-[var(--button-outline-shadow)]'
});

export const alertIcon = tv({
	base: 'mt-px shrink-0',
	variants: {
		variant: {
			info: 'text-[var(--color-info)]',
			error: 'text-[var(--color-error)]',
			warning: 'text-[var(--color-warning)]',
			success: 'text-[var(--color-success)]'
		}
	},
	defaultVariants: {
		variant: 'info'
	}
});
