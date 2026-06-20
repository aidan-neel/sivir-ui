import { tv } from 'tailwind-variants';

export const checkbox = tv({
	base: 'group flex flex-row items-start gap-3 [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)]',
	variants: {
		variant: {
			default: '',
			primary: 'rounded-lg border p-4 focus-within:bg-secondary hover:bg-secondary'
		},
		disabled: {
			true: 'opacity-60',
			false: ''
		},
		checked: {
			true: '',
			false: ''
		}
	},
	// The checked tint is only for the card-style `primary` variant; a plain
	// `default` checkbox must NOT get a tinted row background when checked.
	compoundVariants: [
		{
			variant: 'primary',
			checked: true,
			class: 'bg-primary/10 border-primary/30 focus-within:bg-primary/20 hover:bg-primary/20'
		}
	]
});

export const checkboxBox = tv({
	base: 'flex h-[var(--checkbox-size)] w-[var(--checkbox-size)] items-center justify-center rounded-[var(--radius-sm)] p-0 transition-[box-shadow,transform] peer-focus-visible:shadow-[var(--focus-ring)] peer-active:scale-[var(--motion-press-scale)] active:scale-[var(--motion-press-scale)] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)]',
	variants: {
		checked: {
			true: 'bg-[var(--checkbox-checked-bg)]',
			false:
				'border bg-[var(--checkbox-bg)] peer-hover:bg-[var(--color-field-hover)] peer-focus-visible:bg-[var(--color-field-hover)]'
		}
	}
});

export const checkboxText = tv({
	base: '[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-text'
});
