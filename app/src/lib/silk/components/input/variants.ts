import { tv } from 'tailwind-variants';

export const input = tv({
	base: 'flex w-full min-h-[var(--field-height)] rounded-[var(--field-radius)] border border-border bg-[var(--ui-field-bg,var(--color-field))] px-[var(--field-padding-x)] py-[var(--field-padding-y)] text-base text-[var(--ui-field-foreground,var(--color-field-foreground))] shadow-[var(--ui-field-shadow,none)] transition-[background-color,border-color,box-shadow] duration-240 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-[var(--ui-field-placeholder,var(--color-field-placeholder))] hover:bg-[var(--ui-field-hover-bg,var(--ui-field-bg,var(--color-field-hover)))] focus-visible:border-[var(--ui-field-focus-border,var(--field-focus-border))] focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--ui-field-shadow,0_0_#0000),0_0_0_3px_var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-[var(--field-disabled-opacity)] file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground md:text-sm',
	variants: {
		variant: {
			primary:
				'[--ui-field-bg:var(--color-field)] [--ui-field-hover-bg:var(--color-field-hover)] [--ui-field-focus-border:var(--field-focus-border)]',
			outlined:
				'[--ui-field-bg:var(--color-surface)] [--ui-field-hover-bg:var(--color-surface-muted)] [--ui-field-focus-border:var(--field-focus-border)] [--ui-field-shadow:var(--field-outlined-shadow)]',
			secondary:
				'[--ui-field-bg:var(--color-secondary)] [--ui-field-hover-bg:color-mix(in_srgb,var(--color-secondary)_88%,var(--color-border))] [--ui-field-focus-border:color-mix(in_srgb,var(--color-secondary)_45%,var(--color-primary))] border-transparent'
		}
	}
});
