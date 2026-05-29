import { tv } from 'tailwind-variants';

export const badge = tv({
	base: 'flex items-center justify-center rounded-[var(--radius-lg)] px-[var(--badge-padding-x)] py-[var(--badge-padding-y)] [font-size:var(--font-size-badge,12px)] leading-[1.2] [font-weight:var(--font-weight-badge,500)] [letter-spacing:var(--tracking-badge,0em)] transition-[background-color,border-color,color,box-shadow,transform] [transition-duration:var(--motion-duration-hover)] ease-in-out hover:cursor-default [transform:translateZ(0)] [backface-visibility:hidden] focus-visible:translate-y-px focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--ui-badge-shadow,0_0_#0000),0_0_0_3px_var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-50',
	variants: {
		variant: {
			primary:
				'relative bg-[var(--button-primary-bg)] text-[var(--button-primary-foreground)] hover:bg-[color-mix(in_oklab,var(--button-primary-bg),black_15%)] shadow-[var(--badge-shadow,var(--button-primary-shadow))] before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:border before:border-[var(--badge-fancy-highlight,rgba(255,255,255,0.12))] before:[mask-image:linear-gradient(to_bottom,black,transparent)] before:pointer-events-none',
			secondary:
				'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-foreground)] border-[var(--button-secondary-border)] hover:bg-[var(--button-secondary-hover-bg)]',
			flat: 'bg-[var(--button-flat-bg)] text-[var(--button-flat-foreground)] border-[var(--button-flat-border)] hover:bg-[var(--button-flat-hover-bg)]',
			outlined:
				'relative bg-[var(--button-outlined-bg)] text-[var(--button-outlined-foreground)] hover:bg-[var(--button-outlined-hover-bg)] shadow-[var(--field-outlined-shadow)]',
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
