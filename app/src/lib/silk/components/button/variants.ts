import { tv } from 'tailwind-variants';

export const button = tv({
	base: 'flex h-[var(--button-height)] hover:cursor-pointer items-center justify-center gap-[var(--button-gap)] whitespace-nowrap rounded-[var(--radius-lg)] px-[var(--button-padding-x)] text-[length:var(--text-sm)] [font-weight:var(--font-weight-button,500)] leading-none antialiased transition-[background-color,border-color,color,opacity,box-shadow] [transition-duration:var(--motion-duration-hover)] ease-[cubic-bezier(0.25,0.1,0.25,1)] [transform:translateZ(0)] [backface-visibility:hidden] focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--ui-button-shadow,0_0_#0000),0_0_0_3px_var(--color-ring)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0',
	variants: {
		variant: {
			primary:
				'[--ui-button-shadow:var(--button-primary-shadow)] relative bg-[var(--button-primary-bg)] text-[var(--button-primary-foreground)] hover:bg-[color-mix(in_oklab,var(--button-primary-bg),black_15%)] shadow-[var(--ui-button-shadow)] before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:border before:border-white/[0.12] before:[mask-image:linear-gradient(to_bottom,black,transparent)] before:pointer-events-none',
			success:
				'bg-[var(--button-success-bg)] text-[var(--button-success-foreground)] border-[var(--button-success-border)] hover:bg-[var(--button-success-hover-bg)]',
			warning:
				'bg-[var(--button-warning-bg)] text-[var(--button-warning-foreground)] border-[var(--button-warning-border)] hover:bg-[var(--button-warning-hover-bg)]',
			error:
				'bg-[var(--button-error-bg)] text-[var(--button-error-foreground)] border-[var(--button-error-border)] hover:bg-[var(--button-error-hover-bg)]',
			secondary:
				'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-foreground)] hover:bg-[var(--button-secondary-hover-bg)]',
			flat: 'bg-[var(--button-flat-bg)] text-[var(--button-flat-foreground)] border-[var(--button-flat-border)] hover:bg-[var(--button-flat-hover-bg)]',
			outlined:
				'relative bg-[var(--button-outlined-bg)] text-[var(--button-outlined-foreground)] hover:bg-[var(--button-outlined-hover-bg)] shadow-[var(--field-outlined-shadow)]',
			ghost:
				'bg-[var(--button-ghost-bg)] text-[var(--button-ghost-foreground)] border-[var(--button-ghost-border)] hover:bg-[var(--button-ghost-hover-bg)]',
			alternate:
				'bg-[var(--button-alternate-bg)] text-[var(--button-alternate-foreground)] border-[var(--button-alternate-border)] hover:bg-[var(--button-alternate-hover-bg)]',
			destructive:
				'bg-[var(--button-destructive-bg)] text-[var(--button-destructive-foreground)] border-[var(--button-destructive-border)] hover:bg-[var(--button-destructive-hover-bg)]'
		},
		size: {
			sm: '[--button-height:var(--size-control-sm)] [--button-padding-x:0.75rem] text-[13px]',
			default: '',
			lg: '[--button-height:2.5rem] [--button-padding-x:1rem] text-[14px]',
			icon: 'h-[var(--size-icon-md)] w-[var(--size-icon-md)] min-w-[var(--size-icon-md)] justify-center px-0'
		}
	},
	defaultVariants: {
		variant: 'primary',
		size: 'default'
	}
});
