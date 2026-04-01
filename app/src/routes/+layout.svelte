<script lang="ts">
	import { onMount } from 'svelte';
	import { Toaster } from '$lib/silk/components/toast';
	import Navbar from '$lib/components/navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { hydrateLiveThemeCss } from '$lib/silk/themes/live';
	import '$lib/silk/ui.css';
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { dev } from '$app/environment';

	const { children }: { children: Snippet } = $props();

	onMount(() => {
		hydrateLiveThemeCss();
	});
</script>

<svelte:head>
	<title>{dev ? 'Silk UI - Dev' : 'Silk UI'}</title>
</svelte:head>

<ModeWatcher />
<Toaster />
<main class="flex w-full flex-row justify-center">
	<Navbar />
</main>

{@render children?.()}
