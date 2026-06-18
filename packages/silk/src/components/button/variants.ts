import { tv } from 'tailwind-variants';

// Solid (filled) variants share one clean treatment: a flat color fill, a soft
// drop shadow, and a faint top highlight -- all carried by the per-variant
// `--button-*-shadow` token so themes can flatten them. No pseudo-element sheen.
const solid =
	'text-[var(--button-FILL-foreground)] bg-[var(--button-FILL-bg)] hover:bg-[var(--button-FILL-hover-bg)] shadow-[var(--button-FILL-shadow)]';
const fill = (name: string) => solid.replaceAll('FILL', name);

export const button = tv({
	base: 'inline-flex h-[var(--button-height)] hover:cursor-[var(--ui-cursor-interactive)] items-center justify-center gap-[var(--button-gap)] whitespace-nowrap rounded-[var(--radius-md)] border border-transparent px-[var(--button-padding-x)] [font-size:var(--font-size-button,14px)] [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] leading-none antialiased transition-[background-color,border-color,color,opacity,box-shadow,transform] duration-[var(--motion-duration-hover)] ease-[var(--motion-easing-hover,cubic-bezier(0.25,0.1,0.25,1))] [transform:translateZ(0)] active:[transform:translate3d(0,var(--haptic-press-y,0px),0)] [backface-visibility:hidden] focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--color-ring)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0',
	variants: {
		variant: {
			primary: fill('primary'),
			success: fill('success'),
			warning: fill('warning'),
			error: fill('error'),
			destructive: fill('destructive'),
			secondary:
				'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-foreground)] border-[var(--button-secondary-border)] shadow-[var(--shadow-xs)] hover:bg-[var(--button-secondary-hover-bg)]',
			outlined:
				'bg-[var(--button-outlined-bg)] text-[var(--button-outlined-foreground)] border-[var(--color-border)] shadow-[var(--shadow-xs)] hover:bg-[var(--button-outlined-hover-bg)]',
			flat: 'bg-[var(--button-flat-bg)] text-[var(--button-flat-foreground)] hover:bg-[var(--button-flat-hover-bg)]',
			ghost:
				'bg-[var(--button-ghost-bg)] text-[var(--button-ghost-foreground)] hover:bg-[var(--button-ghost-hover-bg)]',
			alternate:
				'bg-[var(--button-alternate-bg)] text-[var(--button-alternate-foreground)] hover:bg-[var(--button-alternate-hover-bg)]'
		},
		size: {
			sm: '[--button-height:var(--size-control-sm)] gap-1.5 rounded-[var(--radius-sm)] px-[calc(var(--button-padding-x)_-_0.2rem)] [font-size:calc(var(--font-size-button,14px)*0.93)]',
			default: '[--button-height:var(--size-control-md)]',
			lg: '[--button-height:var(--size-control-lg)] px-[calc(var(--button-padding-x)_+_0.15rem)]',
			icon: 'h-[var(--size-icon-md)] w-[var(--size-icon-md)] min-w-[var(--size-icon-md)] justify-center px-0'
		}
	},
	defaultVariants: {
		variant: 'primary',
		size: 'default'
	}
});
