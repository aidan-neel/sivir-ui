<script lang="ts">
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import { createCopy } from '$lib/copy.svelte';

	export type PropRow = {
		/** Sub-part of a compound component, e.g. `Root` -> `Accordion.Root`. */
		component?: string;
		prop: string;
		type: string;
		default: string;
		description: string;
	};

	/**
	 * The standard API reference table. Renders a header row, click-to-copy prop
	 * names, the type signature, a description, and the default. Pass `namespace`
	 * for compound components so rows label as `<namespace>.<component>`.
	 */
	let {
		rows,
		namespace
	}: {
		rows: PropRow[];
		namespace?: string;
	} = $props();

	const clip = createCopy();
</script>

<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
	<div
		class="grid grid-cols-[1fr_1.8fr_0.5fr] gap-3 border-b border-border bg-secondary/40 px-4 py-2.5 text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted max-md:hidden"
	>
		<span>Prop</span>
		<span>Type</span>
		<span class="text-right">Default</span>
	</div>
	<ul class="flex flex-col divide-y divide-border/60">
		{#each rows as row}
			<li class="grid grid-cols-[1fr_1.8fr_0.5fr] gap-3 px-4 py-3 max-md:grid-cols-1">
				<div class="flex flex-col gap-1">
					{#if row.component}
						<code class="font-mono text-[0.7rem] text-foreground-muted">
							{namespace ? `${namespace}.${row.component}` : row.component}
						</code>
					{/if}
					{#if row.prop && row.prop !== '--'}
						<button
							type="button"
							onclick={() => clip.copy(row.prop, `prop-${row.component ?? ''}-${row.prop}`)}
							class="group inline-flex w-fit items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors hover:bg-secondary/60"
						>
							<code
								class="font-mono text-[0.82rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
							>
								{row.prop}
							</code>
							{#if clip.copied(`prop-${row.component ?? ''}-${row.prop}`)}
								<Check size={11} class="text-[var(--color-success)]" />
							{:else}
								<Copy
									size={11}
									class="text-foreground-muted opacity-0 transition-opacity group-hover:opacity-100"
								/>
							{/if}
						</button>
					{/if}
				</div>
				<div class="flex flex-col gap-1">
					<code
						class="overflow-x-auto rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.74rem] text-foreground"
					>
						{row.type}
					</code>
					<p class="m-0 text-[0.78rem] leading-snug text-foreground-muted">{row.description}</p>
				</div>
				<div class="md:text-right">
					<code
						class="inline-block rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.72rem] text-foreground"
					>
						{row.default}
					</code>
				</div>
			</li>
		{/each}
	</ul>
</div>
