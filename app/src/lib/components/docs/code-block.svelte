<script lang="ts">
	import { type BundledLanguage, codeToHtml, createHighlighter, type HighlighterGeneric, type BundledTheme } from 'shiki';
	import themeLightRaw from '$lib/themes/light.json?raw';
	import themeDarkRaw from '$lib/themes/dark.json?raw'; // Assuming the dark theme is available
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/ui/utils';
	import { mode } from "mode-watcher";
	import { onDestroy } from 'svelte';
    import { highlighter } from '$lib/highlighter'
    
	// Parse the themes
	const themeLight = JSON.parse(themeLightRaw);
	const themeDark = JSON.parse(themeDarkRaw);

	let {
		code,
		class: classProp,
		lang = 'svelte',
		...rest
	}: { code: string; class?: string; lang?: string } = $props();
	let html = $state('');
	let loaded = $state(false);

	$effect(async () => {
		html = await highlighter.codeToHtml(code, {
			lang: lang,
			theme: mode.current === 'dark' ? 'github-dark' : 'github-light'
		});

		loaded = true;
	});
</script>

<div {...rest} class={cn(classProp, 'rounded-lg bg-secondary w-full p-4 h-fit text-[14px] overflow-auto')}>
	{#if loaded}
		<code class="font-mono w-full">{@html html}</code>
	{:else}
		<pre class="font-mono w-full opacity-0">{code}</pre>
	{/if}
</div>
