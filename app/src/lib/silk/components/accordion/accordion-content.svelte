<script lang="ts">
	import { getContext } from 'svelte';
	import { themedSlide } from '$lib/silk/internals/transition';
	import { cn } from '$lib/silk/utils';
	import type { AccordionContentProps, AccordionContext } from '.';

	let { class: className, children, ...rest }: AccordionContentProps = $props();
	const ctx = getContext<AccordionContext>('accordion');
	const item = getContext<{ value: string; disabled: boolean }>('accordion-item');
	const open = $derived(ctx.isOpen(item.value));
</script>

{#if open}
	<div
		id={`accordion-content-${item.value}`}
		role="region"
		aria-labelledby={`accordion-trigger-${item.value}`}
		data-ui="accordion-content"
		data-state="open"
		transition:themedSlide={{ durationVar: '--motion-duration-panel', fallback: 220 }}
		class={cn('overflow-hidden text-[0.88rem] [font-weight:var(--font-weight-body,400)] text-foreground-muted', className)}
		{...rest}
	>
		<div class="pb-4">
			{@render children?.()}
		</div>
	</div>
{/if}
