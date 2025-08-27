<script lang="ts">
	import { Toaster } from '$lib/ui/components/toast';
	import Navbar from '$lib/components/navbar.svelte';
    import { ModeWatcher } from "mode-watcher";
	import '$lib/ui/ui.css';
	import '../app.css';
	import type { Snippet } from 'svelte';
    import { dev } from '$app/environment';

	const { children }: { children: Snippet } = $props();
</script>

<svelte:head>
    <title>
		{dev ? 'Neel UI - Dev' : 'Neel UI'}
    </title>
</svelte:head>

<ModeWatcher />
<Toaster />
<Navbar />

{@render children?.()}
