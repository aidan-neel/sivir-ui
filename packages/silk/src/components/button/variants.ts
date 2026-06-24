import { tv } from 'tailwind-variants';

export const button = tv({
	base: 'inline-flex h-[var(--button-height)] hover:cursor-[var(--ui-cursor-interactive)] items-center justify-center gap-[var(--button-gap)] whitespace-nowrap select-none rounded-[var(--radius-lg)] px-[var(--button-padding-x)] [font-size:var(--font-size-button)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] leading-none antialiased transition-[background-color,border-color,color,box-shadow,transform,translate] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] transform-gpu active:scale-[var(--motion-press-scale)] active:translate-y-[var(--button-press-y)] focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--focus-ring)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0',
	variants: {
		variant: {
			// `data-[state=open]` mirrors the hover fill so a popover/menu trigger
			// reads as hovered for as long as its surface is open.
			primary:
				'bg-[var(--button-primary-bg)] text-[var(--button-primary-foreground)] hover:bg-[var(--button-primary-hover-bg)] data-[state=open]:bg-[var(--button-primary-hover-bg)]',
			secondary:
				'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-foreground)] hover:bg-[var(--button-secondary-hover-bg)] data-[state=open]:bg-[var(--button-secondary-hover-bg)]',
			ghost:
				'bg-[var(--button-ghost-bg)] text-[var(--button-ghost-foreground)] hover:bg-[var(--button-ghost-hover-bg)] data-[state=open]:bg-[var(--button-ghost-hover-bg)]',
			// Outline keeps the soft raised shadow (by request). Focus composes the
			// ring on top of the lift so the raised look survives focus.
			outline:
				'bg-[var(--button-outlined-bg)] text-[var(--button-outlined-foreground)] shadow-[var(--button-outline-shadow)] hover:bg-[var(--button-outlined-hover-bg)] data-[state=open]:bg-[var(--button-outlined-hover-bg)] focus-visible:shadow-[var(--focus-ring),var(--button-outline-shadow)]',
			destructive:
				'bg-[var(--button-destructive-bg)] text-[var(--button-destructive-foreground)] hover:bg-[var(--button-destructive-hover-bg)] data-[state=open]:bg-[var(--button-destructive-hover-bg)]',
			// A clickable Panel: same interaction as `outline`, but wearing Panel's
			// concentric frame -- the hairline `--panel-border` outside and the inset
			// surface ring inside read as Panel's double edge. Tokens come from the
			// `panel-root` class (../panel/panel.css), imported by button.svelte.
			panel:
				'panel-root border border-[var(--panel-border)] bg-[var(--panel-bg)] text-[var(--panel-fg)] shadow-[var(--card-shadow)] ring-1 ring-inset ring-[color-mix(in_oklab,var(--panel-border)_50%,transparent)] hover:bg-[var(--button-outlined-hover-bg)] data-[state=open]:bg-[var(--button-outlined-hover-bg)] focus-visible:shadow-[var(--focus-ring),var(--card-shadow)]' // token-lint-disable-line no-literal-length
		},
		size: {
			sm: '[--button-height:var(--size-control-sm)] px-[calc(var(--button-padding-x)_-_0.125rem)]', // token-lint-disable-line no-literal-length
			md: '[--button-height:var(--size-control-md)]',
			lg: '[--button-height:var(--size-control-lg)] px-[calc(var(--button-padding-x)_+_0.125rem)]', // token-lint-disable-line no-literal-length
			icon: 'h-[var(--size-icon-md)] w-[var(--size-icon-md)] min-w-[var(--size-icon-md)] justify-center px-0'
		}
	},
	defaultVariants: {
		variant: 'primary',
		size: 'md'
	}
});
