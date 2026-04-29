<script lang="ts">
	import { sanitizeComponent } from '$lib/components';
	import type { PageData } from './$types';
	import { components } from '$lib/components';
	import { Button } from '$lib/silk/components/button';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import PageHeader from '$lib/components/docs/page-header.svelte';
	import PageActions from '$lib/components/docs/page-actions.svelte';
	import { page } from '$app/stores';

	const {
		data
	}: {
		data: PageData;
	} = $props();

	const Markdown = $derived(data.content) as unknown as ConstructorOfATypedSvelteComponent;
	const Title = $derived(data.metadata.title);
	const Description = $derived(data.metadata.description);
	const Source = $derived(data.metadata.source);
	const AriaUrl = $derived((data.metadata as Record<string, unknown>).ariaUrl as string | undefined);
	const slug = $derived($page.params.slug);

	let curIndex = $derived(components.indexOf(Title.toLowerCase()));
	let nextComponent = $derived(components[curIndex + 1]);
	let prevComponent = $derived(components[curIndex - 1]);
</script>

{#key Title}
	<PageActions
		title={sanitizeComponent(Title)}
		{slug}
		source={Source}
		ariaUrl={AriaUrl}
		section="breadcrumbs"
	/>
{/key}
<PageHeader title={sanitizeComponent(Title)} description={Description} compact={true} />
{#key Title}
	<PageActions
		title={sanitizeComponent(Title)}
		{slug}
		source={Source}
		ariaUrl={AriaUrl}
		section="actions"
	/>
{/key}

<div class="flex-grow w-full pb-16">
	<Markdown />

	{#key Title}
		<div
			tabindex="-1"
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
					<div class="border-t w-full mx-4 rounded-lg"></div>
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
