<script lang="ts">
	import { codeToHtml, createHighlighter } from 'shiki';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/ui/utils';

	let {
		code,
		class: classProp,
		lang = 'javascript',
		theme = 'one-dark-pro',
		...rest
	}: { code: string; class?: string; lang?: string; theme?: string } = $props();

	let html = $state('');
	let loaded = $state(false);

	$effect(async () => {
		html = await codeToHtml(code, {
			lang: lang,
			theme: theme
		});

		loaded = true;
	});
</script>

<div {...rest} class={cn(classProp, 'border rounded-lg w-full text-sm overflow-auto p-4')}>
	{#if loaded}
		<code transition:fade={{ duration: 100 }} class="font-mono w-full">{@html html}</code>
	{:else}
		<pre class="font-mono w-full opacity-0">{code}</pre>
	{/if}
</div>
