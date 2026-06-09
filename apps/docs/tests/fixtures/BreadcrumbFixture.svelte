<script lang="ts">
	import * as Breadcrumb from '@silk/ui/components/breadcrumb';

	let { customSeparator = false } = $props();
</script>

<Breadcrumb.Root data-testid="breadcrumb-root">
	<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
	{#if customSeparator}
		<Breadcrumb.Separator><span data-testid="custom-separator">/</span></Breadcrumb.Separator>
	{:else}
		<Breadcrumb.Separator />
	{/if}
	<Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
</Breadcrumb.Root>
