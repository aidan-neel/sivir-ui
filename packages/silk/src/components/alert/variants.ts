import { tv } from 'tailwind-variants';

/**
 * Soft status callout: a gentle status-tinted surface + subtle status border +
 * a matching colored icon. No left accent strip — status reads from the tint and
 * icon, which stays calm and on-brand in light and dark.
 */
export const alert = tv({
	base: 'flex flex-row gap-3 rounded-[var(--radius-lg)] border px-4 py-3 text-[var(--color-foreground)]',
	variants: {
		variant: {
			info: 'border-[color-mix(in_srgb,var(--color-info)_22%,transparent)] bg-[color-mix(in_srgb,var(--color-info)_7%,var(--color-card))]',
			error:
				'border-[color-mix(in_srgb,var(--color-error)_22%,transparent)] bg-[color-mix(in_srgb,var(--color-error)_7%,var(--color-card))]',
			warning:
				'border-[color-mix(in_srgb,var(--color-warning)_22%,transparent)] bg-[color-mix(in_srgb,var(--color-warning)_7%,var(--color-card))]',
			success:
				'border-[color-mix(in_srgb,var(--color-success)_22%,transparent)] bg-[color-mix(in_srgb,var(--color-success)_7%,var(--color-card))]'
		}
	},
	defaultVariants: {
		variant: 'info'
	}
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
