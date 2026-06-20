<!-- token-lint-disable-file -->
<script lang="ts">
	import * as Popover from '@silk/ui/components/popover';
	import { useState } from '@silk/ui/internals/state.svelte.ts';
	import { cn } from '@silk/ui/utils';
	import Check from '@lucide/svelte/icons/check';
	import { hexToHsv, hsvToHex, hexToHsl, hslToHex, isValidHex } from './conversions';

	export type ColorOption = {
		label: string;
		value: string;
	};

	type Props = {
		label?: string;
		value: string;
		onValueChange?: (value: string) => void;
		options?: ColorOption[];
		/** Trigger style -- matches Button variants. Defaults to outlined. */
		variant?: 'outline' | 'secondary' | 'ghost';
		/** @deprecated no-op */
		showSelect?: boolean;
		class?: string;
	};

	let {
		label,
		value,
		onValueChange,
		options = [],
		variant = 'outline',
		class: className
	}: Props = $props();

	// ── Popover state ───────────────────────────────────────────────

	const key = Math.random().toString(36).substring(2);
	// svelte-ignore state_referenced_locally
	const uiState = useState(
		{
			open: false,
			trigger: null,
			focusedElement: null,
			buttonRef: null,
			popoverRef: null,
			placement: 'bottom',
			onclick: undefined,
			closeTimeout: undefined,
			hoverable: false,
			delay: 0,
			closeDelay: 150
		},
		key
	);

	// ── Picker state ─────────────────────────────────────────────────

	let hue = $state(0);
	let sat = $state(0);
	let val = $state(100);
	// svelte-ignore state_referenced_locally
	let hexInput = $state(isValidHex(value) ? value.toLowerCase() : '#000000');
	let sbEl = $state<HTMLElement | undefined>(undefined);
	let hueEl = $state<HTMLElement | undefined>(undefined);

	// HSL slider state -- owned by the sliders themselves so user intent
	// survives the hex round-trip (low-saturation hexes lose hue precision
	// and pure-grey hexes have no hue at all, so deriving HSL straight from
	// the hex would snap the H slider back to 0 mid-drag).
	// svelte-ignore state_referenced_locally
	let hslH = $state(isValidHex(value) ? hexToHsl(value)[0] : 0);
	// svelte-ignore state_referenced_locally
	let hslS = $state(isValidHex(value) ? hexToHsl(value)[1] : 0);
	// svelte-ignore state_referenced_locally
	let hslL = $state(isValidHex(value) ? hexToHsl(value)[2] : 100);
	let skipNextSync = false;

	const hasOptions = $derived(options.length > 0);
	const hueColor = $derived(`hsl(${hue}, 100%, 50%)`);
	const previewHex = $derived(
		isValidHex(hexInput) ? hexInput : isValidHex(value) ? value : '#000000'
	);
	const selectedLabel = $derived(
		options.find((o) => o.value.toLowerCase() === (value ?? '').toLowerCase())?.label ?? null
	);

	function setHslChannel(channel: 'h' | 's' | 'l', rawValue: string) {
		const next = Number.parseFloat(rawValue);
		if (!Number.isFinite(next)) return;
		if (channel === 'h') {
			hslH = next;
			// At S=0 every hue maps to the same grey hex, so moving H feels
			// dead. Bump S to a sensible default so the chosen hue is visible.
			if (hslS === 0) hslS = 60;
		} else if (channel === 's') {
			hslS = next;
		} else {
			hslL = next;
		}
		const newHex = hslToHex(hslH, hslS, hslL);
		skipNextSync = true;
		applyHex(newHex);
	}

	// Sync external value → HSV + hexInput + HSL.
	$effect(() => {
		if (!isValidHex(value)) return;
		const lower = value.toLowerCase();
		if (skipNextSync) {
			skipNextSync = false;
			hexInput = lower;
			const [hh, ss, vv] = hexToHsv(value);
			hue = hh;
			sat = ss;
			val = vv;
			return;
		}
		const [h, s, v2] = hexToHsv(value);
		hue = h;
		sat = s;
		val = v2;
		hexInput = lower;
		const [hh, hs, hl] = hexToHsl(value);
		// Preserve the user's last hue choice when the hex is achromatic -- the
		// roundtrip would otherwise snap H to 0.
		if (hs > 0) hslH = hh;
		hslS = hs;
		hslL = hl;
	});

	// ── Apply ───────────────────────────────────────────────────────

	function applyHex(hex: string) {
		if (!isValidHex(hex)) return;
		onValueChange?.(hex.toLowerCase());
	}

	function applyHsv() {
		const hex = hsvToHex(hue, sat, val);
		hexInput = hex;
		onValueChange?.(hex);
	}

	function handleHexInput(raw: string) {
		// Strip any non-hex chars first (handles pastes with `#` prefix, spaces,
		// or fully-qualified `#5e6ad2` strings) so `maxlength=6` on the bare-hex
		// input doesn't chop off the last character of a 7-char paste.
		const digits = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
		const cleaned = `#${digits}`;
		hexInput = cleaned;
		if (isValidHex(cleaned)) {
			const [h, s, v2] = hexToHsv(cleaned);
			hue = h;
			sat = s;
			val = v2;
			onValueChange?.(cleaned.toLowerCase());
		}
	}

	// ── SB drag ─────────────────────────────────────────────────────

	let draggingSb = false;

	function sbEventToSV(e: PointerEvent) {
		if (!sbEl) return;
		const rect = sbEl.getBoundingClientRect();
		sat = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100);
		val = Math.round(Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height)) * 100);
		applyHsv();
	}

	function onSbDown(e: PointerEvent) {
		draggingSb = true;
		sbEl?.setPointerCapture(e.pointerId);
		sbEventToSV(e);
	}
	function onSbMove(e: PointerEvent) {
		if (draggingSb) sbEventToSV(e);
	}
	function onSbUp(e: PointerEvent) {
		if (draggingSb) {
			draggingSb = false;
			sbEl?.releasePointerCapture(e.pointerId);
		}
	}

	// ── Hue drag ────────────────────────────────────────────────────

	let draggingHue = false;

	function hueEventToH(e: PointerEvent) {
		if (!hueEl) return;
		const rect = hueEl.getBoundingClientRect();
		hue = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 360);
		applyHsv();
	}

	function onHueDown(e: PointerEvent) {
		draggingHue = true;
		hueEl?.setPointerCapture(e.pointerId);
		hueEventToH(e);
	}
	function onHueMove(e: PointerEvent) {
		if (draggingHue) hueEventToH(e);
	}
	function onHueUp(e: PointerEvent) {
		if (draggingHue) {
			draggingHue = false;
			hueEl?.releasePointerCapture(e.pointerId);
		}
	}
</script>

<div class={cn('space-y-1', className)}>
	{#if label}
		<p class="text-sm text-foreground-muted">{label}</p>
	{/if}

	<Popover.Root state_key={key} placement="bottom">
		<Popover.Trigger
			{variant}
			class="group h-8 w-full justify-start gap-2 px-1.5 text-sm [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)]"
		>
			<span
				class="size-5 shrink-0 rounded-md ring-1 ring-inset ring-black/10"
				style="background:{isValidHex(value) ? value : '#888888'};"
			></span>
			<span class="min-w-0 flex-1 truncate text-left font-mono text-[0.78rem] text-foreground">
				{selectedLabel ?? (isValidHex(value) ? value : value)}
			</span>
		</Popover.Trigger>

		<Popover.Content class="w-[var(--color-picker-width)] !p-0 overflow-hidden">
			<!-- SB picker (large) -->
			<div
				bind:this={sbEl}
				class="relative h-[148px] w-full cursor-crosshair overflow-hidden"
				style="background:linear-gradient(to bottom,transparent,#000),linear-gradient(to right,#fff,{hueColor});"
				onpointerdown={onSbDown}
				onpointermove={onSbMove}
				onpointerup={onSbUp}
				role="presentation"
			>
				<div
					class="pointer-events-none absolute size-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_4px_rgb(0_0_0_/_0.5)]"
					style="left:{sat}%;top:{100 - val}%;"
				></div>
			</div>

			<!-- Hue + preview row -->
			<div
				class="flex items-center gap-2.5 border-b border-border/60 p-[var(--color-picker-padding)]"
			>
				<span
					class="size-7 shrink-0 rounded-md ring-1 ring-inset ring-black/10"
					style="background:{previewHex};"
					aria-hidden="true"
				></span>
				<div class="min-w-0 flex-1 space-y-1.5">
					<div
						bind:this={hueEl}
						class="relative h-2.5 w-full cursor-ew-resize overflow-hidden rounded-full"
						style="background:linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00);"
						onpointerdown={onHueDown}
						onpointermove={onHueMove}
						onpointerup={onHueUp}
						role="presentation"
					>
						<div
							class="pointer-events-none absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_4px_rgb(0_0_0_/_0.5)]"
							style="left:{(hue / 360) * 100}%;background:{hueColor};"
						></div>
					</div>
					<div
						class="flex items-center gap-1 rounded-[var(--radius-md)] border border-border/60 bg-background px-1.5 transition-[border-color,box-shadow] focus-within:border-primary/50 focus-within:shadow-[0_0_0_2px_var(--color-ring)]"
					>
						<span class="font-mono text-[0.78rem] text-foreground-muted">#</span>
						<input
							class="h-6 min-w-0 flex-1 bg-transparent font-mono text-[0.78rem] uppercase text-foreground outline-none"
							value={hexInput.replace(/^#/, '')}
							placeholder="000000"
							spellcheck={false}
							autocomplete="off"
							oninput={(e) => handleHexInput((e.currentTarget as HTMLInputElement).value)}
							onkeydown={(e) => {
								if (e.key === 'Enter') applyHex(hexInput);
							}}
						/>
					</div>
				</div>
			</div>

			<!-- HSL sliders -->
			<div class="flex flex-col gap-1.5 border-b border-border/60 p-[var(--color-picker-padding)]">
				{#each [{ key: 'h', label: 'H', max: 360, value: hslH, unit: '°' }, { key: 's', label: 'S', max: 100, value: hslS, unit: '%' }, { key: 'l', label: 'L', max: 100, value: hslL, unit: '%' }] as channel (channel.key)}
					<div class="flex items-center gap-2">
						<span
							class="w-3 shrink-0 font-mono [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
						>
							{channel.label}
						</span>
						<input
							type="range"
							min="0"
							max={channel.max}
							step="1"
							value={channel.value}
							oninput={(e) =>
								setHslChannel(
									channel.key as 'h' | 's' | 'l',
									(e.currentTarget as HTMLInputElement).value
								)}
							class="silk-color-range flex-1"
						/>
						<span
							class="w-9 shrink-0 text-right font-mono text-[0.66rem] tabular-nums text-foreground"
						>
							{channel.value}{channel.unit}
						</span>
					</div>
				{/each}
			</div>

			<!-- Swatch grid -->
			{#if hasOptions}
				<div class="grid grid-cols-7 gap-1.5 p-[var(--color-picker-padding)]">
					{#each options as opt}
						{@const isActive = opt.value.toLowerCase() === (value ?? '').toLowerCase()}
						<button
							type="button"
							onclick={() => applyHex(opt.value)}
							title={opt.label}
							aria-label={opt.label}
							class="group relative grid size-6 place-items-center rounded-md ring-1 ring-inset ring-black/10 transition-[transform,box-shadow] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary"
							style="background:{opt.value};"
						>
							{#if isActive}
								<Check size={12} class="text-white drop-shadow-[0_1px_1px_rgb(0_0_0_/_0.6)]" />
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		</Popover.Content>
	</Popover.Root>
</div>

<style>
	.silk-color-range {
		appearance: none;
		height: 4px;
		background: var(--color-secondary);
		border-radius: 9999px;
		outline: none;
		cursor: pointer;
	}
	.silk-color-range::-webkit-slider-thumb {
		appearance: none;
		width: 12px;
		height: 12px;
		background: var(--color-primary);
		border: 2px solid var(--color-background);
		border-radius: 9999px;
		cursor: pointer;
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
	}
	.silk-color-range::-moz-range-thumb {
		width: 12px;
		height: 12px;
		background: var(--color-primary);
		border: 2px solid var(--color-background);
		border-radius: 9999px;
		cursor: pointer;
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
	}
	.silk-color-range:focus-visible {
		box-shadow: 0 0 0 3px var(--color-ring);
	}
</style>
