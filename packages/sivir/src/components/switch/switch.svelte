<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { SwitchState, SwitchProps } from '.';
	import { useState } from '@sivir/ui/internals/state.svelte.ts';
	import { cn } from '@sivir/ui/utils';

	let {
		switched = $bindable(false),
		label,
		description,
		disabled = false,
		class: className,
		element = $bindable<HTMLButtonElement>(),
		onclick: userOnclick,
		...rest
	}: SwitchProps & { onclick?: (e: MouseEvent) => void } = $props();

	const uiState = useState<SwitchState>({ switched });
	const labelId = `${uiState.key}-label`;
	const descriptionId = `${uiState.key}-description`;

	// Smoother + a touch slower than a plain ease. The thumb travels on a
	// spring-y overshoot curve so it "ripples" into place, while the track colour
	// cross-fades on a calm decel curve.
	const trackTransition =
		'background-color 300ms cubic-bezier(0.45, 0, 0.2, 1),' +
		' border-color 300ms cubic-bezier(0.45, 0, 0.2, 1),' +
		' box-shadow 220ms var(--ease-out)';

	const thumbTransition =
		'transform 360ms cubic-bezier(0.34, 1.5, 0.5, 1),' + ' box-shadow 220ms var(--ease-out)';

	const thumbOnOffset =
		'calc(var(--size-switch-track) - var(--size-switch-thumb) - (var(--switch-track-padding) * 2) - (var(--border-size) * 2))';

	// sub-pixel compensation for thumb+padding height calc
	const buttonClasses =
		// token-lint-disable-next-line no-literal-length
		'relative inline-flex h-[calc(var(--size-switch-thumb)+(var(--switch-track-padding)*2)+0.05rem)] w-[var(--size-switch-track)] shrink-0 items-center rounded-full border p-[var(--switch-track-padding)] focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-[0.55]';

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
		class={cn(className, buttonClasses)}
		style:background-color={switched ? 'var(--switch-track-active-bg)' : 'var(--switch-track-bg)'}
		style:border-color={switched
			? 'color-mix(in srgb, var(--switch-track-active-bg) 78%, black)'
			: 'color-mix(in srgb, var(--color-border-strong) 88%, transparent)'}
		style:box-shadow="none"
		style:transition={trackTransition}
		onclick={toggle}
	>
		<span
			aria-hidden="true"
			data-state={switched ? 'checked' : 'unchecked'}
			class="block h-[var(--size-switch-thumb)] w-[var(--size-switch-thumb)] rounded-full bg-[var(--switch-thumb-bg)] ring-1 ring-inset ring-black/[0.08] will-change-transform"
			style:transform={switched ? `translateX(${thumbOnOffset})` : 'translateX(0px)'}
			style:box-shadow="none"
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
