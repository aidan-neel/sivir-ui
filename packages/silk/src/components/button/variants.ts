import { tv } from 'tailwind-variants';

export const button = tv({
	base: 'flex h-[var(--button-height)] hover:cursor-[var(--ui-cursor-interactive)] items-center justify-center gap-[var(--button-gap)] whitespace-nowrap rounded-[var(--radius-lg)] px-[var(--button-padding-x)] [font-size:var(--font-size-button,14px)] [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] leading-none antialiased transition-[background-color,border-color,color,opacity,box-shadow,transform] duration-[var(--motion-duration-hover)] ease-[var(--motion-easing-hover,cubic-bezier(0.25,0.1,0.25,1))] [transform:translateZ(0)] active:[transform:translate3d(0,var(--haptic-press-y,0px),0)] [backface-visibility:hidden] focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--ui-button-shadow,0_0_#0000),0_0_0_3px_var(--color-ring)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0',
	variants: {
		variant: {
			primary:
				'[--ui-button-shadow:var(--button-primary-shadow)] relative bg-[var(--button-primary-bg)] text-[var(--button-primary-foreground)] hover:bg-[var(--button-primary-hover-bg)] shadow-[var(--ui-button-shadow)] outline outline-1 -outline-offset-1 outline-[var(--button-primary-border)] before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:border before:border-[var(--button-fancy-highlight,rgba(255,255,255,0.12))] before:[mask-image:linear-gradient(to_bottom,black,transparent)] before:pointer-events-none',
			success:
				'[--ui-button-shadow:var(--button-success-shadow)] relative bg-[var(--button-success-bg)] text-[var(--button-success-foreground)] hover:bg-[var(--button-success-hover-bg)] shadow-[var(--ui-button-shadow)] before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:border before:border-[var(--button-fancy-highlight,rgba(255,255,255,0.12))] before:[mask-image:linear-gradient(to_bottom,black,transparent)] before:pointer-events-none',
			warning:
				'[--ui-button-shadow:var(--button-warning-shadow)] relative bg-[var(--button-warning-bg)] text-[var(--button-warning-foreground)] hover:bg-[var(--button-warning-hover-bg)] shadow-[var(--ui-button-shadow)] before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:border before:border-[var(--button-fancy-highlight,rgba(255,255,255,0.12))] before:[mask-image:linear-gradient(to_bottom,black,transparent)] before:pointer-events-none',
			error:
				'[--ui-button-shadow:var(--button-error-shadow)] relative bg-[var(--button-error-bg)] text-[var(--button-error-foreground)] hover:bg-[var(--button-error-hover-bg)] shadow-[var(--ui-button-shadow)] before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:border before:border-[var(--button-fancy-highlight,rgba(255,255,255,0.12))] before:[mask-image:linear-gradient(to_bottom,black,transparent)] before:pointer-events-none',
			secondary:
				'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-foreground)] hover:bg-[var(--button-secondary-hover-bg)]',
			flat: 'bg-[var(--button-flat-bg)] text-[var(--button-flat-foreground)] border-[var(--button-flat-border)] hover:bg-[var(--button-flat-hover-bg)]',
			outlined:
				'relative bg-[var(--button-outlined-bg)] text-[var(--button-outlined-foreground)] hover:bg-[var(--button-outlined-hover-bg)] shadow-[var(--button-outlined-fancy-shadow,var(--field-outlined-shadow))]',
			ghost:
				'bg-[var(--button-ghost-bg)] text-[var(--button-ghost-foreground)] border-[var(--button-ghost-border)] hover:bg-[var(--button-ghost-hover-bg)]',
			alternate:
				'bg-[var(--button-alternate-bg)] text-[var(--button-alternate-foreground)] border-[var(--button-alternate-border)] hover:bg-[var(--button-alternate-hover-bg)]',
			destructive:
				'[--ui-button-shadow:var(--button-destructive-shadow)] relative bg-[var(--button-destructive-bg)] text-[var(--button-destructive-foreground)] hover:bg-[var(--button-destructive-hover-bg)] shadow-[var(--ui-button-shadow)] before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:border before:border-[var(--button-fancy-highlight,rgba(255,255,255,0.12))] before:[mask-image:linear-gradient(to_bottom,black,transparent)] before:pointer-events-none'
		},
		size: {
			sm: '[--button-height:var(--size-control-sm)] px-[calc(var(--button-padding-x)_-_0.125rem)] text-[13px]',
			default: '[--button-height:var(--size-control-md)]',
			lg: '[--button-height:var(--size-control-lg)] px-[calc(var(--button-padding-x)_+_0.125rem)] text-[14px]',
			icon: 'h-[var(--size-icon-md)] w-[var(--size-icon-md)] min-w-[var(--size-icon-md)] justify-center px-0'
		}
	},
	defaultVariants: {
		variant: 'primary',
		size: 'default'
	}
});
