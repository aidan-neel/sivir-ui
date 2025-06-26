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
	class="{classProp} w-1/5 rounded-none flex-col gap-0.5 flex xl:w-1/5 2xl:w-1/8 p-4 mr-2 bg-background fixed left-0 flex-shrink-0 h-full"
>
    <h3 class="font-semibold text-[0.85rem] ml-2 pb-2 pt-1">Getting Started</h3>
    <Button
        variant={pageName.split('/')[2] === 'introduction' ? 'secondary' : 'ghost'}
        href={`/docs/introduction`}
        class="duration-50 w-fit p-2 rounded-lg text-left text-[0.85rem] right-2 flex items-start justify-start {pageName.split('/')[2] === 'introduction' ? 'font-semibold text-foreground' : 'text-foreground-muted/70 hover:text-foreground'}"
    >
        Introduction
    </Button>
    <Button
        variant={pageName.split('/')[2] === 'installation' ? 'secondary' : 'ghost'}
        href={`/docs/installation`}
        class="duration-50 w-fit p-2 rounded-lg text-left text-[0.85rem] right-2 flex items-start justify-start {pageName.split('/')[2] === 'installation' ? 'font-semibold text-foreground' : 'text-foreground-muted/70 hover:text-foreground'}"
    >
        Installation
    </Button>
    <Button
        variant={pageName.split('/')[2] === 'theming' ? 'secondary' : 'ghost'}
        href={`/docs/theming`}
        class="duration-50 w-fit p-2 rounded-lg text-left text-[0.85rem] right-2 flex items-start justify-start {pageName.split('/')[2] === 'theming' ? 'font-semibold text-foreground' : 'text-foreground-muted/70 hover:text-foreground'}"
    >
        Theming
    </Button>
    <Button
        variant={pageName.split('/')[2] === 'changelog' ? 'secondary' : 'ghost'}
        href={`/docs/changelog`}
        class="duration-50 w-fit p-2 rounded-lg text-left text-[0.85rem] right-2 flex items-start justify-start {pageName.split('/')[2] === 'changelog' ? 'font-semibold text-foreground' : 'text-foreground-muted/70 hover:text-foreground'}"
    >
        Changelog
    </Button>
    <h3 class="font-semibold text-[0.85rem] ml-2 pt-4 pb-2">Components</h3>
	{#each components as component}
		<Button
			variant={pageName.split('/')[3] === component ? 'secondary' : 'ghost'}
			href={`/docs/components/${component}`}
			class="duration-50 p-2 rounded-lg w-fit text-left text-[0.85rem] right-2 flex items-start justify-start {pageName.split(
				'/'
			)[3] === component
				? 'font-semibold text-foreground'
				: 'text-foreground-muted/70 hover:text-foreground'}"
		>
			{sanitizeComponent(component)}
		</Button>
	{/each}
</div>
