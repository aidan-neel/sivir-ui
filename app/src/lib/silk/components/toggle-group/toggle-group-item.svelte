<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import { getContext } from 'svelte';
	import type { ToggleGroupItemProps, ToggleGroupContext } from '.';

	let { class: className, value, disabled, children, ...rest }: ToggleGroupItemProps = $props();
	const ctx = getContext<ToggleGroupContext>('toggle-group');

	const active = $derived(ctx.isActive(value));
	const isDisabled = $derived(disabled || ctx.disabled);
</script>

<button
	type="button"
	data-ui="toggle-group-item"
	data-state={active ? 'on' : 'off'}
	aria-pressed={active}
	disabled={isDisabled}
	onclick={() => ctx.setValue(value)}
	class={cn(
		'inline-flex h-8 items-center justify-center gap-1.5 rounded-[var(--radius-md)] px-[var(--toggle-padding-md)] [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] transition-[background-color,color] [transition-duration:var(--motion-duration-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-50',
		active
			? 'bg-[color-mix(in_srgb,var(--color-primary)_18%,transparent)] text-foreground'
			: 'bg-transparent text-foreground-muted hover:bg-secondary hover:text-foreground',
		className
	)}
	{...rest}
>
	{@render children?.()}
</button>
