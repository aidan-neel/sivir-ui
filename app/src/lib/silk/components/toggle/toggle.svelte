<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import type { ToggleProps } from '.';

	let {
		class: className,
		pressed = $bindable(false),
		disabled = false,
		size = 'md',
		variant = 'default',
		children,
		onPressedChange,
		...rest
	}: ToggleProps = $props();

	const sizes: Record<string, string> = {
		sm: 'h-7 px-[var(--toggle-padding-sm)] text-[0.75rem]',
		md: 'h-8 px-[var(--toggle-padding-md)] text-[0.82rem]',
		lg: 'h-10 px-[var(--toggle-padding-lg)] text-[0.9rem]'
	};

	function toggle() {
		if (disabled) return;
		pressed = !pressed;
		onPressedChange?.(pressed);
	}
</script>

<button
	type="button"
	data-ui="toggle"
	data-state={pressed ? 'on' : 'off'}
	aria-pressed={pressed}
	{disabled}
	onclick={toggle}
	class={cn(
		'inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-md)] [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] transition-[background-color,color,box-shadow] [transition-duration:var(--motion-duration-hover)] ease-out',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]',
		'disabled:cursor-not-allowed disabled:opacity-50',
		variant === 'outlined' && 'border border-border',
		pressed
			? 'bg-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] text-foreground hover:bg-[color-mix(in_srgb,var(--color-primary)_26%,transparent)]'
			: 'bg-transparent text-foreground-muted hover:bg-secondary hover:text-foreground',
		sizes[size] ?? sizes.md,
		className
	)}
	{...rest}
>
	{@render children?.()}
</button>
