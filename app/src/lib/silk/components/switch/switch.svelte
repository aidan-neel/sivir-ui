<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { SwitchState, SwitchProps } from '.';
	import { useState } from '$lib/silk/internals/state.svelte.ts';
	import { cn } from '$lib/silk/utils';

	let {
		switched = $bindable(false),
		label,
		description,
		disabled = false,
		class: className,
		element = $bindable<HTMLButtonElement>(),
		children,
		...rest
	}: SwitchProps = $props();

	const uiState = useState<SwitchState>({
		switched
	});
	const labelId = `${uiState.key}-label`;
	const descriptionId = `${uiState.key}-description`;

	function toggle() {
		if (disabled) return;
		switched = !switched;
	}
</script>

<div class="flex flex-row items-start gap-2.5">
	<button
		bind:this={element}
		{...rest as HTMLButtonAttributes}
		type={(rest as HTMLButtonAttributes).type ?? 'button'}
		role="switch"
		aria-label={!label ? (rest as HTMLButtonAttributes)['aria-label'] : undefined}
		aria-checked={switched}
		aria-labelledby={label ? labelId : undefined}
		aria-describedby={description ? descriptionId : undefined}
		data-ui="switch"
		data-state={switched ? 'checked' : 'unchecked'}
		{disabled}
		class={cn(
			className,
			'relative inline-flex h-[calc(var(--size-switch-thumb)+(var(--switch-track-padding)*2)+0.05rem)] w-[var(--size-switch-track)] shrink-0 items-center rounded-full border border-[color-mix(in_srgb,var(--color-border-strong)_88%,transparent)] bg-[var(--switch-track-bg)] p-[var(--switch-track-padding)] shadow-[inset_0_1px_0_color-mix(in_srgb,var(--panel-highlight)_75%,transparent)] transition-[background-color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:not-disabled:border-[color-mix(in_srgb,var(--color-border-strong)_100%,transparent)] focus-visible:translate-y-px focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[inset_0_1px_0_color-mix(in_srgb,var(--panel-highlight)_75%,transparent),0_0_0_3px_var(--color-ring)] disabled:cursor-not-allowed disabled:opacity-[0.55] data-[state=checked]:border-[color-mix(in_srgb,var(--switch-track-active-bg)_78%,black)] data-[state=checked]:bg-[var(--switch-track-active-bg)] data-[state=checked]:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.18),inset_0_-1px_2px_rgb(0_0_0_/_0.12)]'
		)}
		onclick={toggle}
	>
		<div
			aria-hidden="true"
			data-state={switched ? 'checked' : 'unchecked'}
			class="h-[var(--size-switch-thumb)] w-[var(--size-switch-thumb)] rounded-full bg-[var(--switch-thumb-bg)] shadow-[0_1px_2px_rgb(16_24_40_/_0.1),inset_0_1px_0_rgb(255_255_255_/_0.5)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform data-[state=checked]:translate-x-[calc(var(--size-switch-track)-var(--size-switch-thumb)-(var(--switch-track-padding)*2)-(var(--border-size)*2))] data-[state=checked]:shadow-[0_4px_12px_rgb(16_24_40_/_0.16),inset_0_1px_0_rgb(255_255_255_/_0.55)]"
		></div>
	</button>

	{#if label || description}
		<div class="flex min-w-0 flex-col gap-0.5 pt-px">
			{#if label}
				<span
					id={labelId}
					class="text-[length:var(--text-sm)] font-medium text-foreground [font-family:var(--font-sans),sans-serif] select-none"
				>
					{label}
				</span>
			{/if}
			{#if description}
				<span id={descriptionId} class="text-sm leading-6 text-foreground-muted">
					{description}
				</span>
			{/if}
		</div>
	{/if}
</div>
