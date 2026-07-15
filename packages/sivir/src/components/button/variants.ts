import { tv } from 'tailwind-variants';

export const button = tv({
	base: 'inline-flex h-[var(--size-control-md)] hover:cursor-[var(--ui-cursor-interactive)] items-center justify-center gap-2 whitespace-nowrap select-none rounded-[var(--radius-lg)] px-3 [font-size:var(--font-size-button)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] leading-none antialiased transition-[background-color,border-color,color,box-shadow,transform] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none active:scale-[var(--motion-press-scale)] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--focus-ring)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0',
	variants: {
		variant: {
			// `data-[state=open]` mirrors the hover fill so a popover/menu trigger
			// reads as hovered for as long as its surface is open.
			primary:
				'bg-primary text-[var(--color-on-primary)] hover:bg-[var(--color-primary-hover)] data-[state=open]:bg-[var(--color-primary-hover)]',
			secondary:
				'bg-secondary text-foreground hover:bg-[color-mix(in_srgb,var(--color-secondary)_84%,var(--color-border))] data-[state=open]:bg-[color-mix(in_srgb,var(--color-secondary)_84%,var(--color-border))]',
			ghost:
				'bg-transparent text-foreground hover:bg-[color-mix(in_srgb,var(--color-foreground)_8%,transparent)] data-[state=open]:bg-[color-mix(in_srgb,var(--color-foreground)_8%,transparent)]',
			// Outline keeps the soft raised shadow (by request). Focus composes the
			// ring on top of the lift so the raised look survives focus.
			outline:
				'bg-card text-foreground shadow-[var(--elevation-control)] hover:bg-muted data-[state=open]:bg-muted focus-visible:shadow-[var(--focus-ring),var(--elevation-control)]',
			destructive:
				'bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_20%,transparent)] data-[state=open]:bg-[color-mix(in_srgb,var(--color-error)_20%,transparent)]',
			// A clickable Panel: same interaction as `outline`, but wearing Panel's
			// concentric frame -- the semantic border outside and the inset
			// surface ring inside read as Panel's double edge.
			panel:
				'border border-border bg-card text-foreground shadow-[var(--elevation-1)] ring-1 ring-inset ring-[color-mix(in_oklab,var(--color-border)_50%,transparent)] hover:bg-muted data-[state=open]:bg-muted focus-visible:shadow-[var(--focus-ring),var(--elevation-1)]' // token-lint-disable-line no-literal-length
		},
		size: {
			sm: 'h-[var(--size-control-sm)] px-2',
			md: 'h-[var(--size-control-md)]',
			lg: 'h-[var(--size-control-lg)] px-4',
			icon: 'h-[var(--size-icon-md)] w-[var(--size-icon-md)] min-w-[var(--size-icon-md)] justify-center px-0'
		}
	},
	defaultVariants: {
		variant: 'primary',
		size: 'md'
	}
});
