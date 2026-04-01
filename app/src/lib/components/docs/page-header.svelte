<script lang="ts">
	import { Badge } from '$lib/silk/components/badge';

	let {
		title,
		description,
		eyebrow,
		compact = false
	}: {
		title: string;
		description?: string;
		eyebrow?: string;
		compact?: boolean;
	} = $props();
</script>

<header class="border-b border-border-strong/60 pb-6">
	<div class="flex flex-col gap-4">
		{#if eyebrow}
			<Badge variant="outlined" class="w-fit px-3 text-[0.76rem]">
				{eyebrow}
			</Badge>
		{/if}

		<div class="flex flex-col gap-3">
			<h1
				class={`m-0 max-w-[12ch] text-balance font-medium leading-[0.98] tracking-[-0.045em] [font-family:var(--font-header),sans-serif] ${
					compact
						? 'text-[clamp(1.85rem,3.1vw,2.45rem)] md:max-w-[14ch]'
						: 'text-[clamp(2.35rem,4vw,3.25rem)]'
				} max-md:max-w-none max-md:text-[clamp(2rem,9vw,2.8rem)]`}
			>
				{title}
			</h1>
			{#if description}
				<p class="m-0 max-w-[46rem] text-balance text-[1rem] leading-[1.7] text-foreground-muted max-md:text-[0.98rem]">
					{description}
				</p>
			{/if}
		</div>
	</div>
</header>
