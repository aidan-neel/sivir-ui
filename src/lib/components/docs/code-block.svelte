<script lang="ts">
	import { codeToHtml, createHighlighter } from 'shiki';
	import themeRaw from '$lib/themes/light.json?raw';
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/ui/utils';

	const theme = JSON.parse(themeRaw);

	let {
		code,
		class: classProp,
		lang = 'svelte',
		...rest
	}: { code: string; class?: string; lang?: string } = $props();
	let html = $state('');
	let loaded = $state(false);

	$effect(async () => {
		const highlighter = await createHighlighter({
			themes: [theme],
			langs: [lang]
		});

		await highlighter.loadTheme(theme);

		html = await highlighter.codeToHtml(code, {
			lang: lang,
			theme: 'ui-light'
		});

		loaded = true;
	});
</script>

<div {...rest} class={cn(classProp, 'border rounded-lg w-full p-4 h-fit text-sm overflow-auto ')}>
	{#if loaded}
		<code transition:fade={{ duration: 100 }} class="font-mono w-full">{@html html}</code>
	{:else}
		<pre class="font-mono w-full opacity-0">{code}</pre>
	{/if}
</div>
