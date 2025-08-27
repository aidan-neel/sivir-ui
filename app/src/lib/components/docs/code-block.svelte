<script lang="ts">
	import { codeToHtml, createHighlighter } from 'shiki';
	import themeLightRaw from '$lib/themes/light.json?raw';
	import themeDarkRaw from '$lib/themes/dark.json?raw'; // Assuming the dark theme is available
	import { fade } from 'svelte/transition';
	import { cn } from '$lib/ui/utils';
	import { mode } from "mode-watcher";
    
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
		// Determine whether the dark mode is active
		const isDarkMode = mode.current === "dark";
		const theme = isDarkMode ? themeDark : themeLight;

		// Create a highlighter with the selected theme
		const highlighter = await createHighlighter({
			themes: [theme, 'github-light', 'github-dark'],
			langs: [lang]
		});

		await highlighter.loadTheme(theme);

		html = await highlighter.codeToHtml(code, {
			lang: lang,
			theme: isDarkMode ? 'ui-dark' : 'ui-light'
		});

		loaded = true;
	});
</script>

<div {...rest} class={cn(classProp, 'rounded-lg bg-secondary/60 w-full p-4 h-fit text-sm overflow-auto')}>
	{#if loaded}
		<code class="font-mono w-full">{@html html}</code>
	{:else}
		<pre class="font-mono w-full opacity-0">{code}</pre>
	{/if}
</div>
