import type { Snippet } from 'svelte';
import { tv } from 'tailwind-variants';

export const button = tv({
	base: 'flex min-h-[var(--button-height)] items-center justify-center gap-[var(--button-gap)] whitespace-nowrap rounded-[var(--button-radius)] border border-transparent px-[var(--button-padding-x)] text-[length:var(--text-sm)] font-[var(--button-font-weight)] transition-[background-color,border-color,color,box-shadow,transform] duration-240 ease-[cubic-bezier(0.22,1,0.36,1)] hover:cursor-pointer [transform:translateZ(0)] [backface-visibility:hidden] focus-visible:translate-y-px focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--color-ring)] active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0',
	variants: {
		variant: {
			primary:
				'bg-[var(--button-primary-bg)] text-[var(--button-primary-foreground)] border-[var(--button-primary-border)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.16),inset_0_0_0_1px_rgb(255_255_255_/_0.08),0_1px_2px_rgb(16_24_40_/_0.05)] hover:bg-[var(--button-primary-hover-bg)]',
			success:
				'bg-[var(--button-success-bg)] text-[var(--button-success-foreground)] border-[var(--button-success-border)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.14),inset_0_0_0_1px_rgb(255_255_255_/_0.06),0_1px_2px_rgb(16_24_40_/_0.05)] hover:bg-[var(--button-success-hover-bg)]',
			warning:
				'bg-[var(--button-warning-bg)] text-[var(--button-warning-foreground)] border-[var(--button-warning-border)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.14),inset_0_0_0_1px_rgb(255_255_255_/_0.06),0_1px_2px_rgb(16_24_40_/_0.05)] hover:bg-[var(--button-warning-hover-bg)]',
			error:
				'bg-[var(--button-error-bg)] text-[var(--button-error-foreground)] border-[var(--button-error-border)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.14),inset_0_0_0_1px_rgb(255_255_255_/_0.06),0_1px_2px_rgb(16_24_40_/_0.05)] hover:bg-[var(--button-error-hover-bg)]',
			secondary:
				'bg-[var(--button-secondary-bg)] text-[var(--button-secondary-foreground)] border-[var(--button-secondary-border)] hover:bg-[var(--button-secondary-hover-bg)]',
			flat:
				'bg-[var(--button-flat-bg)] text-[var(--button-flat-foreground)] border-[var(--button-flat-border)] hover:bg-[var(--button-flat-hover-bg)]',
			outlined:
				'bg-[var(--button-outlined-bg)] text-[var(--button-outlined-foreground)] border-[var(--button-outlined-border)] shadow-[var(--button-outlined-shadow)] hover:bg-[var(--button-outlined-hover-bg)]',
			ghost:
				'bg-[var(--button-ghost-bg)] text-[var(--button-ghost-foreground)] border-[var(--button-ghost-border)] hover:bg-[var(--button-ghost-hover-bg)]',
			alternate:
				'bg-[var(--button-alternate-bg)] text-[var(--button-alternate-foreground)] border-[var(--button-alternate-border)] hover:bg-[var(--button-alternate-hover-bg)]',
			destructive:
				'bg-[var(--button-destructive-bg)] text-[var(--button-destructive-foreground)] border-[var(--button-destructive-border)] hover:bg-[var(--button-destructive-hover-bg)]'
		},
		size: {
			icon: 'w-[var(--size-icon-md)] min-w-[var(--size-icon-md)] justify-center px-0'
		}
	},
	defaultVariants: {
		variant: 'primary'
	}
});
