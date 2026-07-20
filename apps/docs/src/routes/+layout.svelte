<script lang="ts">
	import { Toaster } from '@sivir/ui/components/toast';
	import Navbar from '$lib/components/navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '@sivir/ui/ui.css';
	import '../app.css';
	import type { Snippet } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	import type { LayoutData } from './$types';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();

	const isHome = $derived($page.url.pathname === '/');

	// NOTE: the global docs no longer re-apply a persisted Studio theme on load.
	// That override (stored as `sivir-live-theme-css`) was masking the baked
	// default theme from ui.css "no matter what". Live theming is a Studio-only
	// concern now (rebuilt in Plan 3); docs always render the shipped default.
</script>

<svelte:head>
	<title>{dev ? 'Sivir UI - Dev' : 'Sivir UI'}</title>
	<link rel="canonical" href={`${data.origin}${$page.url.pathname}`} />
	<meta property="og:site_name" content="Sivir UI" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`${data.origin}${$page.url.pathname}`} />
	<meta property="og:image" content={`${data.origin}/og-default.svg`} />
	<meta property="og:image:secure_url" content={`${data.origin}/og-default.svg`} />
	<meta property="og:image:type" content="image/svg+xml" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="Sivir UI social card showing a polished component library preview."
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={`${data.origin}/og-default.svg`} />
	<meta
		name="twitter:image:alt"
		content="Sivir UI social card showing a polished component library preview."
	/>
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
