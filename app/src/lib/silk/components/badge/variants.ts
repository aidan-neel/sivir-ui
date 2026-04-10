import { tv } from 'tailwind-variants';

export const badge = tv({
	base: 'flex items-center justify-center rounded-[var(--badge-radius)] border border-transparent px-[var(--badge-padding-x)] py-[var(--badge-padding-y)] text-[length:var(--text-xs)] leading-[1.2] font-medium transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-in-out hover:cursor-default [transform:translateZ(0)] [backface-visibility:hidden] focus-visible:translate-y-px focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--button-outlined-shadow,0_0_#0000),0_0_0_3px_var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-50',
	variants: {
		variant: {
			primary:
				'bg-[var(--button-primary-bg)] text-[var(--button-primary-foreground)] border-[var(--button-primary-border)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.16),inset_0_0_0_1px_rgb(255_255_255_/_0.08),0_1px_2px_rgb(16_24_40_/_0.05)] hover:bg-[var(--button-primary-hover-bg)]',
			secondary:
				'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-foreground)] border-[var(--button-secondary-border)] hover:bg-[var(--button-secondary-hover-bg)]',
			flat:
				'bg-[var(--button-flat-bg)] text-[var(--button-flat-foreground)] border-[var(--button-flat-border)] hover:bg-[var(--button-flat-hover-bg)]',
			outlined:
				'bg-[var(--button-outlined-bg)] text-[var(--button-outlined-foreground)] border-border shadow-[var(--button-outlined-shadow)] hover:bg-[var(--button-outlined-hover-bg)]',
			ghost:
				'bg-[var(--button-ghost-bg)] text-[var(--button-ghost-foreground)] border-[var(--button-ghost-border)] hover:bg-[var(--button-ghost-hover-bg)]',
			alternate:
				'bg-[var(--button-alternate-bg)] text-[var(--button-alternate-foreground)] border-[var(--button-alternate-border)] hover:bg-[var(--button-alternate-hover-bg)]',
			destructive:
				'bg-[var(--button-destructive-bg)] text-[var(--button-destructive-foreground)] border-[var(--button-destructive-border)] hover:bg-[var(--button-destructive-hover-bg)]'
		}
	},
	defaultVariants: {
		variant: 'primary'
	}
});
