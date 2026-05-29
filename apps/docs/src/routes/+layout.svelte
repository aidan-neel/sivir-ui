<script lang="ts">
	import { onMount } from 'svelte';
	import { Toaster } from '@silk/ui/components/toast';
	import Navbar from '$lib/components/navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { hydrateLiveThemeCss } from '@silk/ui/themes/live';
	import '@silk/ui/ui.css';
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { dev } from '$app/environment';

	import type { LayoutData } from './$types';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();

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
	<Navbar popularThemes={data?.popularThemes ?? []} starCount={data?.starCount ?? null} />
</main>

{@render children?.()}
