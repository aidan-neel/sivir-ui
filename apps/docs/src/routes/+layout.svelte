<script lang="ts">
	import { Toaster } from '@silk/ui/components/toast';
	import Navbar from '$lib/components/navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '@silk/ui/ui.css';
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	import type { LayoutData } from './$types';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();

	const isHome = $derived($page.url.pathname === '/');

	// NOTE: the global docs no longer re-apply a persisted Studio theme on load.
	// That override (stored as `silk-live-theme-css`) was masking the baked
	// default theme from ui.css "no matter what". Live theming is a Studio-only
	// concern now (rebuilt in Plan 3); docs always render the shipped default.
</script>

<svelte:head>
	<title>{dev ? 'Silk UI - Dev' : 'Silk UI'}</title>
</svelte:head>

<ModeWatcher />
<Toaster />
<main class="flex w-full flex-row justify-center">
	<Navbar starCount={data?.starCount ?? null} />
</main>

<main class="min-h-screen w-screen bg-background pt-16">
	{#if isHome}
		<div class="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1400px] flex-col">
			{@render children?.()}
		</div>
	{:else}
		<div
			class="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1400px] flex-col gap-5 px-4 md:px-6 lg:flex-row lg:gap-0"
		>
			{@render children?.()}
		</div>
	{/if}
</main>
