<script lang="ts">
	import * as Popover from '$lib/silk/components/popover';
	import { useState } from '$lib/silk/internals/state.svelte.ts';
	import { cn } from '$lib/silk/utils';
	import Check from '@lucide/svelte/icons/check';

	export type ColorOption = {
		label: string;
		value: string;
	};

	type Props = {
		label?: string;
		value: string;
		onValueChange?: (value: string) => void;
		options?: ColorOption[];
		/** Trigger style — matches Button variants. Defaults to outlined. */
		variant?: 'outlined' | 'secondary' | 'ghost';
		/** @deprecated no-op */
		showSelect?: boolean;
		class?: string;
	};

	let {
		label,
		value,
		onValueChange,
		options = [],
		variant = 'outlined',
		class: className
	}: Props = $props();

	// ── Color conversion ────────────────────────────────────────────────────────

	function hexToHsv(hex: string): [number, number, number] {
		const h = hex.replace('#', '');
		if (h.length !== 6) return [0, 0, 100];
		const r = parseInt(h.slice(0, 2), 16) / 255;
		const g = parseInt(h.slice(2, 4), 16) / 255;
		const b = parseInt(h.slice(4, 6), 16) / 255;
		const max = Math.max(r, g, b),
			min = Math.min(r, g, b),
			delta = max - min;
		let hue = 0;
		if (delta !== 0) {
			if (max === r) hue = ((g - b) / delta) % 6;
			else if (max === g) hue = (b - r) / delta + 2;
			else hue = (r - g) / delta + 4;
			hue = hue * 60;
			if (hue < 0) hue += 360;
		}
		return [
			Math.round(hue),
			max === 0 ? 0 : Math.round((delta / max) * 100),
			Math.round(max * 100)
		];
	}

	function hsvToHex(hue: number, sat: number, val: number): string {
		const s = sat / 100,
			v = val / 100;
		const c = v * s,
			x = c * (1 - Math.abs(((hue / 60) % 2) - 1)),
			m = v - c;
		let r = 0,
			g = 0,
			b = 0;
		if (hue < 60) {
			r = c;
			g = x;
		} else if (hue < 120) {
			r = x;
			g = c;
		} else if (hue < 180) {
			g = c;
			b = x;
		} else if (hue < 240) {
			g = x;
			b = c;
		} else if (hue < 300) {
			r = x;
			b = c;
		} else {
			r = c;
			b = x;
		}
		const toH = (n: number) =>
			Math.round((n + m) * 255)
				.toString(16)
				.padStart(2, '0');
		return `#${toH(r)}${toH(g)}${toH(b)}`;
	}

	function isValidHex(h: string) {
		return /^#[0-9a-fA-F]{6}$/.test(h);
	}

	// ── HSL helpers ──────────────────────────────────────────────────
	// HSL gives the user direct lightness control (instead of HSV's "value"),
	// which is what you reach for when tweaking neutrals / dark variants.

	function hexToHsl(hex: string): [number, number, number] {
		const h = hex.replace('#', '');
		if (h.length !== 6) return [0, 0, 100];
		const r = parseInt(h.slice(0, 2), 16) / 255;
		const g = parseInt(h.slice(2, 4), 16) / 255;
		const b = parseInt(h.slice(4, 6), 16) / 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const delta = max - min;
		const l = (max + min) / 2;
		let hue = 0;
		let sat = 0;
		if (delta !== 0) {
			sat = delta / (1 - Math.abs(2 * l - 1));
			if (max === r) hue = ((g - b) / delta) % 6;
			else if (max === g) hue = (b - r) / delta + 2;
			else hue = (r - g) / delta + 4;
			hue *= 60;
			if (hue < 0) hue += 360;
		}
		return [Math.round(hue), Math.round(sat * 100), Math.round(l * 100)];
	}

	function hslToHex(hue: number, sat: number, light: number): string {
		const s = sat / 100;
		const l = light / 100;
		const c = (1 - Math.abs(2 * l - 1)) * s;
		const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
		const m = l - c / 2;
		let r = 0;
		let g = 0;
		let b = 0;
		if (hue < 60) {
			r = c;
			g = x;
		} else if (hue < 120) {
			r = x;
			g = c;
		} else if (hue < 180) {
			g = c;
			b = x;
		} else if (hue < 240) {
			g = x;
			b = c;
		} else if (hue < 300) {
			r = x;
			b = c;
		} else {
			r = c;
			b = x;
		}
		const toH = (n: number) =>
			Math.round((n + m) * 255)
				.toString(16)
				.padStart(2, '0');
		return `#${toH(r)}${toH(g)}${toH(b)}`;
	}

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

	// HSL slider state — owned by the sliders themselves so user intent
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
		// Preserve the user's last hue choice when the hex is achromatic — the
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
			class="group h-8 w-full justify-start gap-2 px-1.5 text-sm [font-weight:var(--font-weight-button,500)]"
		>
			<span
				class="size-5 shrink-0 rounded-md ring-1 ring-inset ring-black/10"
				style="background:{isValidHex(value) ? value : '#888888'};"
			></span>
			<span class="min-w-0 flex-1 truncate text-left font-mono text-[0.78rem] text-foreground">
				{selectedLabel ?? (isValidHex(value) ? value : value)}
			</span>
		</Popover.Trigger>

		<Popover.Content class="w-[244px] !p-0 overflow-hidden">
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
			<div class="flex items-center gap-2.5 border-b border-border/60 px-2.5 py-2.5">
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
			<div class="flex flex-col gap-1.5 border-b border-border/60 px-2.5 py-2.5">
				{#each [{ key: 'h', label: 'H', max: 360, value: hslH, unit: '°' }, { key: 's', label: 'S', max: 100, value: hslS, unit: '%' }, { key: 'l', label: 'L', max: 100, value: hslL, unit: '%' }] as channel (channel.key)}
					<div class="flex items-center gap-2">
						<span class="w-3 shrink-0 font-mono text-[0.66rem] [font-weight:var(--font-weight-body,400)] text-foreground-muted">
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
				<div class="grid grid-cols-7 gap-1.5 p-2.5">
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
