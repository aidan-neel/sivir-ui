<script lang="ts">
	import { components, sanitizeComponent } from '$lib/components';
	import { Button } from '$lib/ui/components/button';
	import { page } from '$app/stores';

	let pageName = $state($page.url.pathname);
	let { class: classProp } = $props();

	$effect(() => {
		pageName = $page.url.pathname;
	});
</script>

<div
	class="{classProp} w-1/5 xl:w-1/5 2xl:w-1/8 border-r p-4 mr-2 bg-background fixed left-0 flex-shrink-0 h-full"
>
	<Button
		variant={pageName.split('/')[2] === 'introduction' ? 'secondary' : 'ghost'}
		href={`/docs/introduction`}
		class="duration-100 w-full p-2 rounded-lg font-semibold  text-left flex items-start justify-start"
	>
		Introduction
	</Button>
	<Button
		variant={pageName.split('/')[2] === 'changelog' ? 'secondary' : 'ghost'}
		href={`/docs/changelog`}
		class="duration-100 w-full p-2 rounded-lg font-semibold text-left flex items-start justify-start"
	>
		Changelog
	</Button>
	<Button
		variant={pageName.split('/')[2] === 'styling' ? 'secondary' : 'ghost'}
		href={`/docs/styling`}
		class="duration-100 w-full p-2 rounded-lg font-semibold text-left flex items-start justify-start"
	>
		Styling
	</Button>
	<h3 class="font-semibold text-sm ml-2 text-foreground-muted pt-6 pb-2">Components</h3>
	{#each components as component}
		<Button
			variant={pageName.split('/')[3] === component ? 'secondary' : 'ghost'}
			href={`/docs/components/${component}`}
			class="duration-100 w-full p-2 rounded-lg text-left right-2 flex items-start justify-start {pageName.split(
				'/'
			)[3] === component
				? 'font-semibold text-foreground'
				: 'text-foreground-muted/70 hover:text-foreground'}"
		>
			{sanitizeComponent(component)}
		</Button>
	{/each}
</div>
