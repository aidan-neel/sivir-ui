<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { SwitchState, SwitchProps } from '.';
	import { useState } from '@silk/ui/internals/state.svelte.ts';
	import { cn } from '@silk/ui/utils';

	let {
		switched = $bindable(false),
		label,
		description,
		disabled = false,
		class: className,
		element = $bindable<HTMLButtonElement>(),
		children,
		onclick: userOnclick,
		...rest
	}: SwitchProps & { onclick?: (e: MouseEvent) => void } = $props();

	const uiState = useState<SwitchState>({ switched });
	const labelId = `${uiState.key}-label`;
	const descriptionId = `${uiState.key}-description`;

	const trackTransition =
		'background-color var(--motion-duration-panel, 220ms) cubic-bezier(0.4, 0, 0.2, 1),' +
		' border-color var(--motion-duration-panel, 220ms) cubic-bezier(0.4, 0, 0.2, 1),' +
		' box-shadow var(--motion-duration-panel, 220ms) cubic-bezier(0.4, 0, 0.2, 1)';

	const thumbTransition =
		'transform var(--motion-duration-panel, 220ms) cubic-bezier(0.34, 1.4, 0.5, 1),' +
		' box-shadow var(--motion-duration-panel, 220ms) cubic-bezier(0.34, 1.4, 0.5, 1)';

	const thumbOnOffset =
		'calc(var(--size-switch-track) - var(--size-switch-thumb) - (var(--switch-track-padding) * 2) - (var(--border-size) * 2))';

	function toggle(event: Event) {
		if (disabled) return;
		switched = !switched;
		userOnclick?.(event as MouseEvent);
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
			'relative inline-flex h-[calc(var(--size-switch-thumb)+(var(--switch-track-padding)*2)+0.05rem)] w-[var(--size-switch-track)] shrink-0 items-center rounded-full border p-[var(--switch-track-padding)] focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-[0.55]'
		)}
		style:background-color={switched
			? 'var(--switch-track-active-bg)'
			: 'var(--switch-track-bg)'}
		style:border-color={switched
			? 'color-mix(in srgb, var(--switch-track-active-bg) 78%, black)'
			: 'color-mix(in srgb, var(--color-border-strong) 88%, transparent)'}
		style:box-shadow={switched
			? 'inset 0 1px 0 rgb(255 255 255 / 0.18), inset 0 -1px 2px rgb(0 0 0 / 0.12)'
			: 'inset 0 1px 0 color-mix(in srgb, var(--panel-highlight) 75%, transparent)'}
		style:transition={trackTransition}
		onclick={toggle}
	>
		<span
			aria-hidden="true"
			data-state={switched ? 'checked' : 'unchecked'}
			class="block h-[var(--size-switch-thumb)] w-[var(--size-switch-thumb)] rounded-full bg-white ring-1 ring-inset ring-black/[0.06] will-change-transform"
			style:transform={switched
				? `translateX(${thumbOnOffset})`
				: 'translateX(0px)'}
			style:box-shadow={switched
				? '0 2px 4px rgb(16 24 40 / 0.14), 0 4px 12px -2px rgb(16 24 40 / 0.22), inset 0 1px 0 rgb(255 255 255 / 0.7)'
				: '0 1px 1px rgb(16 24 40 / 0.08), 0 2px 5px -1px rgb(16 24 40 / 0.18), inset 0 1px 0 rgb(255 255 255 / 0.65)'}
			style:transition={thumbTransition}
		></span>
	</button>

	{#if label || description}
		<div
			class={`flex min-w-0 flex-col gap-0.5 pt-px select-none ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-[var(--ui-cursor-interactive)]'}`}
			onclick={toggle}
			onkeydown={(e) => {
				if (disabled) return;
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					toggle(e);
					element?.focus();
				}
			}}
			role="presentation"
		>
			{#if label}
				<span
					id={labelId}
					class="text-[length:var(--text-sm)] [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground [font-family:var(--font-sans),sans-serif]"
				>
					{label}
				</span>
			{/if}
			{#if description}
				<span
					id={descriptionId}
					class="leading-6 [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
				>
					{description}
				</span>
			{/if}
		</div>
	{/if}
</div>
