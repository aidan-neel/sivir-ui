<script lang="ts">
	import { Toaster } from '$lib/ui/components/toast';
	import Navbar from '$lib/components/navbar.svelte';
	import '$lib/ui/ui.css';
	import '../app.css';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<Toaster />
<Navbar />

{@render children?.()}
