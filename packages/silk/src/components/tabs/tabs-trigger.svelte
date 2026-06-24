<!-- token-lint-disable-file -->
<script lang="ts">
	import { cn } from '@silk/ui/utils';
	import { getContext } from 'svelte';
	import type { TabsState, TabsTriggerProps } from '.';

	let { children, class: className, value, disabled = false, ...rest }: TabsTriggerProps = $props();

	const tabsState = getContext<TabsState>('tabs');

	function toIdPart(input: string) {
		return input
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	}

	const triggerId = $derived(`${tabsState.id}-trigger-${toIdPart(value)}`);
	const contentId = $derived(`${tabsState.id}-content-${toIdPart(value)}`);
	const active = $derived(tabsState.value === value);
	// `ghost` has no active pill/underline, so lean on a heavier weight (plus the
	// text-color shift below) to mark the active tab.
	const ghostActive = $derived(active && tabsState.variant === 'ghost');
</script>

<button
	type="button"
	role="tab"
	id={triggerId}
	aria-selected={active}
	aria-controls={contentId}
	tabindex={active ? 0 : -1}
	data-ui="tabs-trigger"
	data-state={active ? 'active' : 'inactive'}
	{disabled}
	class={cn(
		className,
		'relative z-10 select-none rounded-[var(--radius-lg)] hover:cursor-[var(--ui-cursor-interactive)] px-[var(--tabs-trigger-padding-x)] py-[var(--tabs-trigger-padding-y)] text-sm [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] leading-tight transition-[color,transform,box-shadow] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] active:scale-[var(--motion-press-scale)] focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50',
		active ? 'text-foreground' : 'text-foreground-muted hover:text-foreground',
		ghostActive && '[font-weight:600]',
		// Segmented pills sit a touch taller than their text padding; flex-center
		// keeps the label vertically centered inside the taller pill.
		// token-lint-disable-next-line no-literal-length
		tabsState.variant === 'segmented' && 'inline-flex items-center justify-center min-h-[32px]'
	)}
	onclick={() => {
		if (!disabled) tabsState.value = value;
	}}
	{...rest}
>
	{@render children?.()}
</button>
