<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { components, sanitizeComponent } from '$lib/components';

	/** Prev / next component navigation, ordered by the shared components list. */
	let { slug }: { slug: string } = $props();

	const curIndex = $derived(components.indexOf(slug));
	const prevComponent = $derived(components[curIndex - 1]);
	const nextComponent = $derived(components[curIndex + 1]);
</script>

{#if curIndex !== -1}
	<div
		class="mt-12 flex w-full items-center"
		class:justify-between={prevComponent && nextComponent}
		class:justify-end={!prevComponent && nextComponent}
		class:justify-start={prevComponent && !nextComponent}
	>
		{#if prevComponent}
			<Button href={`/docs/components/${prevComponent}`} variant="outlined" class="flex-shrink-0">
				<ChevronLeft size={16} />
				{sanitizeComponent(prevComponent)}
			</Button>
		{/if}
		{#if prevComponent && nextComponent}
			<div class="mx-4 w-full rounded-lg border-t"></div>
		{/if}
		{#if nextComponent}
			<Button href={`/docs/components/${nextComponent}`} variant="outlined" class="flex-shrink-0">
				{sanitizeComponent(nextComponent)}
				<ChevronRight size={16} />
			</Button>
		{/if}
	</div>
{/if}
