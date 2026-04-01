<script lang="ts">
	import Pipette from '@lucide/svelte/icons/pipette';
	import * as Popover from '$lib/silk/components/popover';
	import { Input } from '$lib/silk/components/input';

	type Props = {
		value: string;
		label: string;
		onValueChange?: (value: string) => void;
		swatches?: string[];
	};

	const {
		value,
		label,
		onValueChange,
		swatches = ['#155eef', '#2f7a54', '#a44a2f', '#0f1723', '#ffffff', '#101828', '#f2f4f7', '#fa4234']
	}: Props = $props();

	function updateValue(next: string) {
		onValueChange?.(next);
	}
</script>

<div class="grid grid-cols-[auto_1fr] items-center gap-3">
	<Popover.Root placement="bottom">
		<Popover.Trigger
			variant="outlined"
			class="relative size-10 shrink-0 rounded-lg p-0 shadow-none"
			aria-label={`Pick ${label.toLowerCase()} color`}
		>
			<span
				class="pointer-events-none absolute inset-[5px] rounded-[0.45rem]"
				style={`background:${value};`}
			></span>
		</Popover.Trigger>
		<Popover.Content class="bg-[var(--color-panel)] text-[var(--color-panel-foreground)] border border-[var(--panel-border)] rounded-[var(--panel-radius)] shadow-[inset_0_1px_0_var(--panel-highlight),var(--panel-shadow)] w-[16.5rem] p-3">
			<div class="flex flex-col gap-3">
				<div class="flex items-center justify-between gap-3">
					<div>
						<p class="text-sm font-semibold text-foreground">{label}</p>
						<p class="text-xs text-foreground-muted">Pick a color or paste a hex value.</p>
					</div>
					<div class="rounded-md bg-secondary/50 px-2 py-1 text-[0.72rem] text-foreground-muted">
						{value}
					</div>
				</div>

				<input
					type="color"
					value={value}
					oninput={(event) => updateValue(event.currentTarget.value)}
					class="h-20 w-full cursor-pointer rounded-lg border-0 bg-transparent p-0"
				/>

				<div class="grid grid-cols-4 gap-2">
					{#each swatches as swatch}
						<button
							type="button"
							class="relative h-8 rounded-md border border-border/40 transition-transform duration-200 hover:-translate-y-0.5"
							style={`background:${swatch};`}
							onclick={() => updateValue(swatch)}
							aria-label={`Use ${swatch} for ${label.toLowerCase()}`}
						>
							{#if swatch.toLowerCase() === value.toLowerCase()}
								<span class="absolute inset-0 rounded-md ring-2 ring-ring"></span>
							{/if}
						</button>
					{/each}
				</div>

				<div class="relative">
					<span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">
						<Pipette size={14} />
					</span>
					<Input
						variant="outlined"
						value={value}
						class="pl-9 font-mono text-xs"
						oninput={(event) => updateValue(event.currentTarget.value)}
					/>
				</div>
			</div>
		</Popover.Content>
	</Popover.Root>

	<div class="flex flex-col gap-1">
		<span class="text-sm font-medium text-foreground">{label}</span>
		<Input
			variant="outlined"
			value={value}
			class="h-10 font-mono text-xs"
			oninput={(event) => updateValue(event.currentTarget.value)}
		/>
	</div>
</div>
