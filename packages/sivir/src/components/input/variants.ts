import { tv } from 'tailwind-variants';

export const input = tv({
    base: 'flex min-h-[var(--size-control-md)] w-full rounded-[var(--radius-lg)] border-0 bg-[var(--color-field)] px-3 py-0 text-[var(--color-field-foreground)] [font-size:var(--font-size-body)] transition-[background-color,border-color,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] motion-reduce:transition-none placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-0 forced-colors:border-[length:var(--border-size)] forced-colors:border-solid forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-solid aria-[invalid=true]:shadow-[var(--shadow-field-invalid)] aria-[invalid=true]:hover:shadow-[var(--shadow-field-invalid)] aria-[invalid=true]:focus-visible:shadow-[var(--focus-ring),var(--shadow-field-invalid)] disabled:cursor-not-allowed disabled:opacity-[var(--opacity-disabled)] file:border-0 file:bg-transparent file:[font-weight:var(--font-weight-body)] file:[font-size:var(--font-size-body)] file:[letter-spacing:var(--tracking-body)] file:text-foreground',

    variants: {
        variant: {
            outline:
                'bg-[var(--color-field)] shadow-[var(--shadow-field)] hover:shadow-[var(--shadow-field-hover)] focus-visible:shadow-[var(--focus-ring),var(--shadow-field-focus)]',
            secondary:
                'bg-secondary shadow-[var(--shadow-well)] hover:shadow-[var(--shadow-well)] focus-visible:shadow-[var(--focus-ring),var(--shadow-field-focus)]'
        }
    },
    defaultVariants: {
        variant: 'outline'
    }
});
