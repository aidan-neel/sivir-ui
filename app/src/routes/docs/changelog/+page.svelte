<script lang="ts">
	import PageHeader from '$lib/components/docs/page-header.svelte';
</script>

<main class="flex w-full flex-col pb-12">
	<PageHeader title="Changelog" description="A log of the latest updates" compact={true} />

	<header class="flex flex-col gap-1 py-6 border-b">
		<p class="text-2xl font-semibold">April 2025</p>
	</header>

	<div class="py-4">
		<h2 class="text-xl font-semibold">v1.0.0 - Release</h2>
		<p class="text-base pt-2">
			aidan-neel/ui has been released! Over the next couple months, I will be adding components,
			polishing, and updating aidan-neel/ui as much as possible without getting burnt out.
			<br /><br />
			Check out some of the
			<a href="/docs/components/alert" class="underline font-medium">components</a> and get started
			with the
			<a href="/docs/installation" class="underline font-medium">installation</a> page.
		</p>
	</div>
</main>
