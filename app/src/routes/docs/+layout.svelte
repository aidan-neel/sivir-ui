<script lang="ts">
	import SideNavbar from '$lib/components/docs/side-navbar.svelte';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<main class="h-screen pt-14 w-screen flex flex-col">
	<div class="flex-1 justify-center h-full w-full flex-row flex">
		<SideNavbar class="lg:visible invisible flex-shrink-0" />
		<div
			class="flex flex-col w-full mb-96 xl:w-[70%] 2xl:w-[40%] lg:ml-[20%] lg:w-[70%] 2xl:ml-0 p-6 xl:p-16"
		>
			{@render children?.()}
		</div>
	</div>
</main>
