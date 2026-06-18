import { tv } from 'tailwind-variants';

export const input = tv({
	base: 'flex w-full min-h-[var(--field-height)] rounded-[var(--radius-md)] border border-[var(--color-input)] bg-[var(--ui-field-bg,var(--color-field))] px-[var(--field-padding-x)] py-[var(--field-padding-y)] text-base text-[var(--ui-field-foreground,var(--color-field-foreground))] shadow-[var(--field-shadow,var(--shadow-xs))] transition-[background-color,border-color,box-shadow] duration-240 ease-[cubic-bezier(0.22,1,0.36,1)] placeholder:text-[var(--ui-field-placeholder,var(--color-field-placeholder))] hover:bg-[var(--ui-field-hover-bg,var(--ui-field-bg,var(--color-field-hover)))] focus-visible:border-[var(--ui-field-focus-border,var(--field-focus-border))] focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--field-shadow,var(--shadow-xs)),0_0_0_3px_var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-[var(--field-disabled-opacity)] file:border-0 file:bg-transparent file:text-sm file:[font-weight:var(--font-weight-body,500)] file:[font-size:var(--font-size-body,16px)] file:[letter-spacing:var(--tracking-body,0em)] file:text-foreground md:text-sm',
	variants: {
		variant: {
			primary:
				'[--ui-field-bg:var(--color-field)] [--ui-field-hover-bg:var(--color-field-hover)] [--ui-field-focus-border:var(--field-focus-border)]',
			outlined:
				'[--ui-field-bg:var(--button-outlined-bg)] [--ui-field-hover-bg:var(--button-outlined-hover-bg)] [--ui-field-foreground:var(--button-outlined-foreground)] [--ui-field-focus-border:var(--field-focus-border)]',
			secondary:
				'[--ui-field-bg:var(--color-secondary)] [--ui-field-hover-bg:color-mix(in_srgb,var(--color-secondary)_88%,var(--color-border))] [--ui-field-focus-border:color-mix(in_srgb,var(--color-secondary)_45%,var(--color-primary))] border-transparent'
		}
	}
});
