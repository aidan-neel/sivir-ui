import { tv } from 'tailwind-variants';

export const toggle = tv({
	base: 'inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] transition-[background-color,color,box-shadow,transform] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] active:scale-[var(--motion-press-scale)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50',
	variants: {
		variant: {
			default: '',
			outlined: 'border border-border'
		},
		pressed: {
			true: 'bg-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] text-foreground hover:bg-[color-mix(in_srgb,var(--color-primary)_26%,transparent)]',
			false: 'bg-transparent text-foreground-muted hover:bg-secondary hover:text-foreground'
		},
		size: {
			sm: 'h-7 px-[var(--toggle-padding-sm)] [font-size:var(--font-size-badge)]',
			md: 'h-8 px-[var(--toggle-padding-md)] [font-size:var(--font-size-label)]',
			lg: 'h-10 px-[var(--toggle-padding-lg)] [font-size:var(--font-size-button)]'
		}
	},
	defaultVariants: {
		variant: 'default',
		pressed: false,
		size: 'md'
	}
});
