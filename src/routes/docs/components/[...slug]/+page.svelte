<script lang="ts">
	import { flyAndScale } from '$lib/ui/internals/transition';
	import { sanitizeComponent } from '$lib/components';
	import type { PageData } from './$types';
	import { Badge } from '$lib/ui/components/badge';
	import { goto } from '$app/navigation';
	import ExternalLink from '@lucide/svelte/icons/external-link';

	const {
		data
	}: {
		data: PageData;
	} = $props();

	const Markdown = $derived(data.content);
	const Title = $derived(data.metadata.title);
	const Description = $derived(data.metadata.description);
	const Component = $derived(data.metadata.component);
	const Source = $derived(data.metadata.source);
	const Dependencies = $derived(data.metadata.dependencies);
</script>

<header class="flex flex-col gap-1 pb-4">
	<p class="text-5xl font-bold">{sanitizeComponent(Title)}</p>
	<p class="text-xl mt-2 text-foreground-muted">
		{Description}
	</p>
	<div class="flex flex-row gap-2 mt-2">
		<Badge href={Source} variant="secondary" class="rounded-lg-md gap-1"
			>Component Source <ExternalLink size={12} /></Badge
		>
		{#each Dependencies as dependency}
			<Badge href={dependency.url} variant="secondary" class="rounded-lg-md gap-1">
				{dependency.name}
				<ExternalLink size={12} />
			</Badge>
		{/each}
	</div>
</header>

<div class="py-6 flex flex-col gap-4">
	<h1>Installation</h1>
	<div class="rounded-lg border p-3 font-mono text-sm font-medium">
		<span class="text-foreground-muted font-mono">npx</span> @aidan-neel/ui
		<span class="text-foreground-muted font-mono">add</span>
		{Title.toLowerCase()}
	</div>
</div>

<div class="flex-grow w-full pb-16">
	<Markdown />
</div>
