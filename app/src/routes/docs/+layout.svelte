<script lang="ts">
	import SideNavbar from '$lib/components/docs/side-navbar.svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<main class="min-h-screen w-screen bg-background pt-14">
	<div class="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-[1400px] flex-col gap-5 px-4 md:px-8 lg:flex-row lg:gap-8">
		<details class="group mt-5 rounded-xl border border-border/70 bg-card/70 lg:hidden">
			<summary class="flex list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-foreground marker:content-none">
				Browse docs
				<ChevronRight size={16} class="transition-transform duration-200 group-open:rotate-90" />
			</summary>
			<div class="border-t border-border/60 px-1 pb-3 pt-2">
				<SideNavbar class="w-full pt-0" />
			</div>
		</details>

		<SideNavbar class="hidden sticky top-14 h-[calc(100vh-3.5rem)] w-56 flex-shrink-0 pt-8 lg:flex" />
		<div class="flex min-h-[calc(100vh-3.5rem)] w-full min-w-0 max-w-[920px] flex-col overflow-y-auto py-6 lg:py-8">
			{@render children?.()}
		</div>
	</div>
</main>
