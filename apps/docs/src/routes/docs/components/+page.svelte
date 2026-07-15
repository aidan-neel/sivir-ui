<script lang="ts">
	import { resolve } from '$app/paths';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { Badge } from '@sivir/ui/components/badge';
	import { components, sanitizeComponent } from '$lib/components';
</script>

<svelte:head>
	<title>Sivir · Components</title>
	<meta
		name="description"
		content="Browse all 41 accessible, themeable Svelte 5 components in Sivir UI."
	/>
</svelte:head>

<div class="flex flex-col gap-10">
	<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outline">Components</Badge>
			<Badge variant="ghost" class="tabular-nums">{components.length} total</Badge>
		</div>
		<div class="flex flex-col gap-3">
			<h1
				class="m-0 max-w-[20ch] text-balance text-[1.875rem] leading-tight tracking-[-0.02em] [font-weight:var(--font-weight-header,600)]"
				style="font-family: var(--font-header);"
			>
				Build with polished primitives.
			</h1>
			<p class="m-0 max-w-2xl text-pretty leading-relaxed text-foreground-muted">
				Every component is accessible, token-driven, and installed as source you can adapt to your
				product.
			</p>
		</div>
	</header>

	<ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		{#each components as component (component)}
			<li>
				<a
					href={resolve(`/docs/components/${component}` as '/docs/components/accordion')}
					class="group flex min-h-16 items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card px-4 py-3 text-foreground transition-[border-color,background-color,transform] duration-200 hover:border-border-strong hover:bg-secondary/45 active:scale-[0.96] motion-reduce:transition-none"
				>
					<span class="font-medium">{sanitizeComponent(component)}</span>
					<ArrowRight
						size={15}
						class="text-foreground-muted transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
						aria-hidden="true"
					/>
				</a>
			</li>
		{/each}
	</ul>
</div>
