<script lang="ts">
	import OnThisPage from '$lib/components/docs/on-this-page.svelte';
	import SideNavbar from '$lib/components/docs/side-navbar.svelte';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<main class="min-h-screen w-screen bg-background pt-16">
	<div
		class="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-[1440px] flex-col gap-5 px-4 md:px-8 lg:flex-row lg:gap-16"
	>
		<SideNavbar
			class="hidden sticky top-14 h-[calc(100vh-3.5rem)] w-56 flex-shrink-0 pt-8 lg:flex"
		/>
		<div class="flex w-full min-w-0 items-start gap-8 xl:gap-12">
			<div
				class="flex min-h-[calc(100vh-3.5rem)] w-full min-w-0 max-w-[920px] flex-1 flex-col overflow-y-auto py-6 lg:py-8"
				data-docs-page
			>
				{@render children?.()}
			</div>
		</div>
		<OnThisPage class="sticky top-12 hidden h-fit w-56 flex-shrink-0 pt-8 xl:block" />
	</div>
</main>
