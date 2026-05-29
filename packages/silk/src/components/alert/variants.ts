import { tv } from 'tailwind-variants';

/**
 * Neutral card-style surface -- no variant tinting at all. Status is conveyed by
 * a thin left accent strip + icon chip, so the alert reads correctly with any
 * primary color (including extreme cases like pure black or white).
 */
export const alert = tv({
	base: 'relative flex flex-row gap-3 overflow-hidden rounded-[var(--radius-md)] border border-border bg-[var(--color-card)] px-3.5 py-3 pl-4 text-[var(--color-foreground)] shadow-[var(--shadow-xs)]'
});

export const alertAccent = tv({
	base: 'absolute inset-y-0 left-0 w-[3px]',
	variants: {
		variant: {
			info: 'bg-[var(--color-info)]',
			error: 'bg-[var(--color-error)]',
			warning: 'bg-[var(--color-warning)]',
			success: 'bg-[var(--color-success)]'
		}
	},
	defaultVariants: {
		variant: 'info'
	}
});

export const alertChip = tv({
	base: 'mt-[1px] grid size-6 shrink-0 place-items-center rounded-full ring-1',
	variants: {
		variant: {
			info: 'bg-[color-mix(in_srgb,var(--color-info)_16%,var(--color-card))] text-[var(--color-info)] ring-[color-mix(in_srgb,var(--color-info)_28%,transparent)]',
			error:
				'bg-[color-mix(in_srgb,var(--color-error)_16%,var(--color-card))] text-[var(--color-error)] ring-[color-mix(in_srgb,var(--color-error)_28%,transparent)]',
			warning:
				'bg-[color-mix(in_srgb,var(--color-warning)_16%,var(--color-card))] text-[var(--color-warning)] ring-[color-mix(in_srgb,var(--color-warning)_28%,transparent)]',
			success:
				'bg-[color-mix(in_srgb,var(--color-success)_16%,var(--color-card))] text-[var(--color-success)] ring-[color-mix(in_srgb,var(--color-success)_28%,transparent)]'
		}
	},
	defaultVariants: {
		variant: 'info'
	}
});
