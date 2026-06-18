<script lang="ts" module>
	export type ChipOption = { value: string; label: string; description?: string };
</script>

<script lang="ts">
	type Props = {
		options: ChipOption[];
		value: string;
		onselect: (value: string) => void;
		columns?: 2 | 3 | 4;
		ariaLabel: string;
		/** Show the active option's description below the grid. */
		showDescription?: boolean;
	};

	let {
		options,
		value,
		onselect,
		columns = 3,
		ariaLabel,
		showDescription = true
	}: Props = $props();

	const cols = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' } as const;
	const active = $derived(options.find((o) => o.value === value));
</script>

<div class="flex flex-col gap-2">
	<div class={`grid ${cols[columns]} gap-1.5`} role="radiogroup" aria-label={ariaLabel}>
		{#each options as option (option.value)}
			{@const selected = option.value === value}
			<button
				type="button"
				role="radio"
				aria-checked={selected}
				title={option.description}
				onclick={() => onselect(option.value)}
				class={`rounded-[var(--radius-md)] border px-2 py-1.5 text-center text-[0.76rem] [font-weight:var(--font-weight-label,500)] transition-colors ${
					selected
						? 'border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-foreground'
						: 'border-border bg-card text-foreground-muted hover:border-border-strong hover:text-foreground'
				}`}
			>
				{option.label}
			</button>
		{/each}
	</div>
	{#if showDescription && active?.description}
		<p class="m-0 text-[0.72rem] leading-snug text-foreground-muted">{active.description}</p>
	{/if}
</div>
