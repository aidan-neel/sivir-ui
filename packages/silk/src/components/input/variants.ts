import { tv } from 'tailwind-variants';

export const input = tv({
	base: 'flex w-full min-h-[var(--field-height)] rounded-[var(--radius-lg)] border border-border bg-[var(--ui-field-bg,var(--field-bg))] px-[var(--field-padding-x)] py-[var(--field-padding-y)] text-base text-[var(--ui-field-foreground,var(--color-field-foreground))] [font-size:var(--font-size-body)] transition-[background-color,border-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] placeholder:text-[var(--ui-field-placeholder,var(--field-placeholder))] hover:bg-[var(--ui-field-hover-bg,var(--ui-field-bg,var(--color-field-hover)))] focus-visible:border-[var(--ui-field-focus-border,var(--field-focus-border))] focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-[var(--field-disabled-opacity)] file:border-0 file:bg-transparent file:text-sm file:[font-weight:var(--font-weight-body,500)] file:[font-size:var(--font-size-body,16px)] file:[letter-spacing:var(--tracking-body,0em)] file:text-foreground md:text-sm', // token-lint-disable-line no-literal-length
	variants: {
		variant: {
			outline:
				'bg-[var(--field-bg)] border-[var(--color-input)] hover:bg-[var(--color-field-hover)] focus-visible:shadow-[var(--focus-ring)]',
			secondary:
				'[--ui-field-bg:var(--color-secondary)] [--ui-field-hover-bg:color-mix(in_srgb,var(--color-secondary)_88%,var(--color-border))] [--ui-field-focus-border:color-mix(in_srgb,var(--color-secondary)_45%,var(--color-primary))] border-transparent focus-visible:shadow-[var(--focus-ring)]'
		}
	},
	defaultVariants: {
		variant: 'outline'
	}
});
