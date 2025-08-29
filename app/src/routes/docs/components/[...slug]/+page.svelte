<script lang="ts">
	import { flyAndScale } from '$lib/ui/internals/transition';
	import { sanitizeComponent } from '$lib/components';
	import type { PageData } from './$types';
	import { Badge } from '$lib/ui/components/badge';
	import { components } from '$lib/components';
	import { goto } from '$app/navigation';
	import ExternalLink from '@lucide/svelte/icons/external-link';
	import ChevRight from '@lucide/svelte/icons/chevron-right';
	import ChevLeft from '@lucide/svelte/icons/chevron-left';
	import { Button } from '$lib/ui/components/button';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import CodeBlock from '$lib/components/docs/code-block.svelte';

	const {
		data
	}: {
		data: PageData;
	} = $props();

	const Markdown = $derived(data.content) as unknown as ConstructorOfATypedSvelteComponent;
	const Title = $derived(data.metadata.title);
	const Description = $derived(data.metadata.description);
	const Component = $derived(data.metadata.component);
	const Source = $derived(data.metadata.source);
	const Dependencies = $derived(data.metadata.dependencies)!;

	let curIndex = $derived(components.indexOf(Title.toLowerCase()));
	let nextComponent = $derived(components[curIndex + 1]);
	let prevComponent = $derived(components[curIndex - 1]);
</script>

<header class="flex flex-col gap-1 pb-4">
	<h1 class="text-4xl font-medium tracking-tighter">{sanitizeComponent(Title)}</h1>
	<p class="mt-2 text-foreground-muted">
		{Description}
	</p>
	<div class="flex flex-row gap-2 mt-2">
		<Badge href={Source} variant="secondary" class="rounded-lg font-semibold text-foreground-muted gap-1"
			>Component Source <ExternalLink size={10} /></Badge
		>
		{#each Dependencies as dependency}
			<Badge href={dependency.url} variant="secondary" class="rounded-lg font-semibold text-foreground-muted gap-1">
				{dependency.name}
				<ExternalLink size={10} />
			</Badge>
		{/each}
	</div>
</header>

<div class="py-6 flex flex-col gap-4">
	<h1>Installation</h1>
	{#key Title}
        <CodeBlock lang="shell" code={`npx @aidan-neel/ui add ${Title.toLowerCase()}`} class="p-3" />
    {/key}
</div>

<div class="flex-grow w-full pb-16">
	<Markdown />

	{#key Title}
		<div
			class="mt-8 flex flex-row w-full items-center"
			class:justify-between={prevComponent && nextComponent}
			class:justify-end={!prevComponent && nextComponent}
			class:justify-start={prevComponent && !nextComponent}
		>
			{#if curIndex != -1}
				{#if prevComponent}
					<Button
						href={`/docs/components/${prevComponent}`}
						variant="outlined"
						class="flex-shrink-0"
					>
						<ChevronLeft size={18} />
						{sanitizeComponent(prevComponent)}
					</Button>
				{/if}
				{#if prevComponent && nextComponent}
					<div class="border-t w-full mx-4 rounded-full"></div>
				{/if}
				{#if nextComponent}
					<Button
						href={`/docs/components/${nextComponent}`}
						variant="outlined"
						class="flex-shrink-0"
					>
						{sanitizeComponent(nextComponent)}
						<ChevronRight size={18} />
					</Button>
				{/if}
			{/if}
		</div>
	{/key}
</div>
