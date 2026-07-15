<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '@sivir/ui/components/button';
	import { components, sanitizeComponent } from '$lib/components';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	const slug = $derived($page.url.pathname.split('/docs/components/')[1]?.split('/')[0] ?? '');
	const curIndex = $derived(components.findIndex((component) => component === slug));
	const prevComponent = $derived(curIndex > 0 ? components[curIndex - 1] : undefined);
	const nextComponent = $derived(curIndex !== -1 ? components[curIndex + 1] : undefined);
</script>

{#if prevComponent || nextComponent}
	<nav class="flex items-center gap-1.5">
		{#if prevComponent}
			<Button
				href={`/docs/components/${prevComponent}`}
				variant="outline"
				size="icon"
				class="size-10"
				aria-label={`Previous: ${sanitizeComponent(prevComponent)}`}
				title={`Previous: ${sanitizeComponent(prevComponent)}`}
			>
				<ChevronLeft size={16} />
			</Button>
		{/if}
		{#if nextComponent}
			<Button
				href={`/docs/components/${nextComponent}`}
				variant="outline"
				size="icon"
				class="size-10"
				aria-label={`Next: ${sanitizeComponent(nextComponent)}`}
				title={`Next: ${sanitizeComponent(nextComponent)}`}
			>
				<ChevronRight size={16} />
			</Button>
		{/if}
	</nav>
{/if}
