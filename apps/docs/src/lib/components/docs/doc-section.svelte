<script lang="ts">
	import type { Component, Snippet } from 'svelte';

	/**
	 * A standard docs body section: an icon-chip + heading, an optional lead
	 * paragraph, then the section's content. Every component page composes its
	 * body from these so headings, spacing, and the on-this-page TOC stay
	 * consistent. The `<h2>` is plain so the TOC picks it up.
	 */
	let {
		icon: Icon,
		title,
		description,
		id,
		children
	}: {
		icon: Component<{ size?: number | string; class?: string }>;
		title: string;
		description?: string;
		id?: string;
		children: Snippet;
	} = $props();
</script>

<section {id} class="scroll-mt-20 flex flex-col gap-5">
	<div class="flex flex-col gap-1">
		<div class="flex items-center gap-2">
			<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
				<Icon size={12} />
			</span>
			<h2
				class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				{title}
			</h2>
		</div>
		{#if description}
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">{description}</p>
		{/if}
	</div>
	{@render children()}
</section>
