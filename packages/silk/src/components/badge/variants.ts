import { tv } from 'tailwind-variants';
import { INTENTS, STATUSES } from '@silk/ui/internals/variants';

export const badge = tv({
	base: 'flex items-center justify-center rounded-[var(--radius-lg)] px-[var(--badge-padding-x)] py-[var(--badge-padding-y)] [font-size:var(--font-size-badge,12px)] leading-[1.2] [font-weight:var(--font-weight-badge,500)] [letter-spacing:var(--tracking-badge,0em)] transition-[background-color,border-color,color] [transition-duration:var(--motion-duration-hover)] ease-in-out hover:cursor-default disabled:cursor-not-allowed disabled:opacity-50', // token-lint-disable-line no-literal-length
	variants: {
		variant: {
			primary: 'bg-[var(--badge-primary-bg)] text-[var(--badge-primary-fg)]',
			secondary: 'bg-[var(--badge-secondary-bg)] text-[var(--badge-secondary-fg)]',
			ghost:
				'bg-[var(--badge-ghost-bg)] text-[var(--badge-ghost-fg)] hover:bg-[color-mix(in_srgb,var(--color-foreground)_6%,transparent)]',
			outline:
				'bg-[var(--badge-outline-bg)] text-[var(--badge-outline-fg)] border border-[var(--badge-outline-border)]',
			destructive: 'bg-[var(--badge-destructive-bg)] text-[var(--badge-destructive-fg)]',
			info: 'bg-[var(--badge-info-bg)] text-[var(--badge-info-fg)]',
			success: 'bg-[var(--badge-success-bg)] text-[var(--badge-success-fg)]',
			warning: 'bg-[var(--badge-warning-bg)] text-[var(--badge-warning-fg)]',
			error: 'bg-[var(--badge-error-bg)] text-[var(--badge-error-fg)]'
		}
	},
	defaultVariants: {
		variant: 'secondary'
	}
});
