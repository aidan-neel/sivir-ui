import { tv } from 'tailwind-variants';

export const button = tv({
	base: 'flex h-[var(--button-height)] hover:cursor-[var(--ui-cursor-interactive)] items-center justify-center gap-[var(--button-gap)] whitespace-nowrap rounded-[var(--radius-lg)] px-[var(--button-padding-x)] [font-size:var(--font-size-button)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] leading-none antialiased transition-[background-color,border-color,color,opacity,box-shadow,transform] duration-[var(--motion-duration-hover)] ease-[var(--motion-easing-hover)] [transform:translateZ(0)] active:[transform:translate3d(0,var(--haptic-press-y),0)] [backface-visibility:hidden] focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--color-ring)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0',
	variants: {
		variant: {
			primary:
				'bg-[var(--button-primary-bg)] text-[var(--button-primary-foreground)] hover:bg-[var(--button-primary-hover-bg)] outline outline-1 -outline-offset-1 outline-[var(--button-primary-border)]',
			secondary:
				'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-foreground)] hover:bg-[var(--button-secondary-hover-bg)]',
			ghost:
				'bg-[var(--button-ghost-bg)] text-[var(--button-ghost-foreground)] border-[var(--button-ghost-border)] hover:bg-[var(--button-ghost-hover-bg)]',
			outline:
				'bg-[var(--button-outlined-bg)] text-[var(--button-outlined-foreground)] hover:bg-[var(--button-outlined-hover-bg)] shadow-[var(--button-outlined-flat-shadow)]',
			destructive:
				'bg-[var(--button-destructive-bg)] text-[var(--button-destructive-foreground)] hover:bg-[var(--button-destructive-hover-bg)]'
		},
		size: {
			sm: '[--button-height:var(--size-control-sm)] px-[calc(var(--button-padding-x)_-_0.125rem)]',
			md: '[--button-height:var(--size-control-md)]',
			lg: '[--button-height:var(--size-control-lg)] px-[calc(var(--button-padding-x)_+_0.125rem)]',
			icon: 'h-[var(--size-icon-md)] w-[var(--size-icon-md)] min-w-[var(--size-icon-md)] justify-center px-0'
		}
	},
	defaultVariants: {
		variant: 'primary',
		size: 'md'
	}
});
