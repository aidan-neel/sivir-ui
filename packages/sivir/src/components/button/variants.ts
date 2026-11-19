import { tv } from 'tailwind-variants';

export const button = tv({
    base: 'inline-flex h-[calc(var(--size-button-md,var(--size-control-md))-var(--size-hairline))] hover:cursor-[var(--ui-cursor-interactive)] items-center justify-center gap-2 whitespace-nowrap select-none rounded-[var(--radius-lg)] px-[var(--padding-button-x,calc(var(--spacing)*3+var(--size-hairline)))] [font-size:var(--font-size-button)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] leading-none antialiased shadow-[var(--sivir-button-shadow)] [--sivir-button-shadow:0_0_transparent] transition-[background-color,border-color,color,box-shadow] [transition-duration:var(--motion-duration-hover)] ease-[var(--ease-press)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--focus-ring),var(--sivir-button-shadow)] disabled:pointer-events-none disabled:opacity-[var(--opacity-disabled)] aria-disabled:cursor-default [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0 [&_.truncate]:leading-normal',
    variants: {
        variant: {
            /**
             * Each variant names its surface recipe through `--sivir-button-shadow`,
             * so the base can draw the focus ring over the recipe instead of in
             * place of it. Fills are background images over a solid fallback.
             * A press shades the button; it never changes size.
             * `data-[state=open]` mirrors the hover form on every variant so a
             * popover or menu trigger reads as hovered for as long as its surface
             * is open.
             */
            primary:
                'bg-primary bg-[image:var(--fill-primary)] text-[var(--color-on-primary)] [--sivir-button-shadow:var(--shadow-primary)] hover:bg-[image:var(--fill-primary-hover)] active:bg-none data-[state=open]:bg-[image:var(--fill-primary-hover)]',
            secondary:
                'bg-transparent bg-[image:var(--fill-raised)] text-[var(--color-button-foreground)] [--sivir-button-shadow:var(--shadow-raised)] hover:bg-[image:var(--fill-raised-hover)] hover:[--sivir-button-shadow:var(--shadow-raised-hover)] active:bg-[image:var(--fill-raised-press)] data-[state=open]:bg-[image:var(--fill-raised-hover)] data-[state=open]:[--sivir-button-shadow:var(--shadow-raised-hover)]',
            ghost: 'bg-transparent text-[var(--color-button-foreground)] hover:bg-foreground/[0.08] active:bg-foreground/[0.12] data-[state=open]:bg-foreground/[0.08]',
            quiet: 'bg-transparent text-[var(--color-button-foreground)]',
            outline:
                'bg-transparent text-[var(--color-button-foreground)] [--sivir-button-shadow:var(--shadow-edge)] hover:bg-foreground/[0.06] hover:[--sivir-button-shadow:var(--shadow-edge-hover)] active:bg-foreground/[0.1] data-[state=open]:bg-foreground/[0.06] data-[state=open]:[--sivir-button-shadow:var(--shadow-edge-hover)]',
            destructive:
                'bg-error-soft text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_20%,transparent)] active:bg-[color-mix(in_srgb,var(--color-error)_26%,transparent)] data-[state=open]:bg-[color-mix(in_srgb,var(--color-error)_20%,transparent)]',
            /**
             * A clickable Panel: the same interaction as `outline` wearing the
             * card recipe on Panel's card fill.
             */
            panel: 'bg-card text-[var(--color-button-foreground)] [--sivir-button-shadow:var(--shadow-card)] hover:bg-secondary hover:[--sivir-button-shadow:var(--shadow-card-hover)] data-[state=open]:bg-secondary'
        },
        size: {
            sm: 'h-[calc(var(--size-button-sm,var(--size-control-sm))-var(--size-hairline))] px-[calc(var(--padding-button-x,calc(var(--spacing)*3+var(--size-hairline)))-var(--size-hairline)*3/4)]',
            md: 'h-[calc(var(--size-button-md,var(--size-control-md))-var(--size-hairline))]',
            lg: 'h-[calc(var(--size-button-lg,var(--size-control-lg))-var(--size-hairline))] px-[calc(var(--padding-button-x,calc(var(--spacing)*3+var(--size-hairline)))+var(--spacing)/2)]',
            icon: 'h-[var(--size-icon-md)] w-[var(--size-icon-md)] min-w-[var(--size-icon-md)] justify-center px-0'
        }
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md'
    }
});
