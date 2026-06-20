import { tv } from 'tailwind-variants';

export const checkbox = tv({
	base: 'group flex flex-row items-start gap-3 duration-200',
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
			true: 'bg-primary/10 border-primary/30 focus-within:bg-primary/20 hover:bg-primary/20',
			false: ''
		}
	}
});

export const checkboxBox = tv({
	base: 'flex h-[var(--checkbox-size)] w-[var(--checkbox-size)] items-center justify-center rounded-[var(--radius-sm)] p-0 transition-[box-shadow,transform] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background ring-offset-2',
	variants: {
		checked: {
			true: 'bg-[var(--checkbox-checked-bg)]',
			false:
				'border bg-[var(--checkbox-bg)] duration-[var(--motion-duration-hover)] peer-hover:bg-[var(--color-field-hover)] peer-focus-visible:bg-[var(--color-field-hover)]'
		}
	}
});

export const checkboxText = tv({
	base: '[font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-text'
});
