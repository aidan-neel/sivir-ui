<script lang="ts">
	import * as Breadcrumb from '@silk/ui/components/breadcrumb';
	import { goto } from '$app/navigation';

	let {
		items = [],
		class: classProp = ''
	}: {
		items?: Array<{ label: string; href?: string }>;
		class?: string;
	} = $props();
</script>

<Breadcrumb.Root class={`text-sm text-foreground-muted ${classProp}`}>
	{#each items as item, index (item.label)}
		<Breadcrumb.Item>
			{#if item.href && index < items.length - 1}
				<a
					href={item.href}
					class="transition-colors hover:text-foreground"
					on:click={() => goto(item.href || '')}
				>
					{item.label}
				</a>
			{:else}
				<span class={index === items.length - 1 ? 'text-foreground' : ''}>
					{item.label}
				</span>
			{/if}
		</Breadcrumb.Item>
		{#if index < items.length - 1}
			<Breadcrumb.Separator />
		{/if}
	{/each}
</Breadcrumb.Root>
