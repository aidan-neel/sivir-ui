<script lang="ts">
	import * as Popover from '$lib/silk/components/popover';
	import { useState } from '$lib/silk/internals/state.svelte.ts';
	import { Button } from '$lib/silk/components/button';
	import { cn } from '$lib/silk/utils';

	export type ColorOption = {
		label: string;
		value: string;
	};

	type Props = {
		label?: string;
		value: string;
		onValueChange?: (value: string) => void;
		options?: ColorOption[];
		/** @deprecated no-op */
		showSelect?: boolean;
		class?: string;
	};

	let {
		label,
		value,
		onValueChange,
		options = [],
		class: className
	}: Props = $props();

	// ── Color conversion ────────────────────────────────────────────────────────

	function hexToHsv(hex: string): [number, number, number] {
		const h = hex.replace('#', '');
		if (h.length !== 6) return [0, 0, 100];
		const r = parseInt(h.slice(0, 2), 16) / 255;
		const g = parseInt(h.slice(2, 4), 16) / 255;
		const b = parseInt(h.slice(4, 6), 16) / 255;
		const max = Math.max(r, g, b), min = Math.min(r, g, b), delta = max - min;
		let hue = 0;
		if (delta !== 0) {
			if (max === r) hue = ((g - b) / delta) % 6;
			else if (max === g) hue = (b - r) / delta + 2;
			else hue = (r - g) / delta + 4;
			hue = hue * 60;
			if (hue < 0) hue += 360;
		}
		return [Math.round(hue), max === 0 ? 0 : Math.round((delta / max) * 100), Math.round(max * 100)];
	}

	function hsvToHex(hue: number, sat: number, val: number): string {
		const s = sat / 100, v = val / 100;
		const c = v * s, x = c * (1 - Math.abs(((hue / 60) % 2) - 1)), m = v - c;
		let r = 0, g = 0, b = 0;
		if (hue < 60) { r = c; g = x; }
		else if (hue < 120) { r = x; g = c; }
		else if (hue < 180) { g = c; b = x; }
		else if (hue < 240) { g = x; b = c; }
		else if (hue < 300) { r = x; b = c; }
		else { r = c; b = x; }
		const toH = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
		return `#${toH(r)}${toH(g)}${toH(b)}`;
	}

	function isValidHex(h: string) {
		return /^#[0-9a-fA-F]{6}$/.test(h);
	}

	// ── Popover state (same pattern as DropdownMenu / Select) ───────────────────

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

	// ── Picker state ─────────────────────────────────────────────────────────────

	let hue = $state(0);
	let sat = $state(0);
	let val = $state(100);
	// svelte-ignore state_referenced_locally
	let hexInput = $state(isValidHex(value) ? value.toLowerCase() : '#000000');
	// svelte-ignore state_referenced_locally
	let activeTab = $state<'swatches' | 'picker'>(options.length > 0 ? 'swatches' : 'picker');
	let sbEl = $state<HTMLElement | undefined>(undefined);
	let hueEl = $state<HTMLElement | undefined>(undefined);

	const hasOptions = $derived(options.length > 0);
	const hueColor = $derived(`hsl(${hue}, 100%, 50%)`);
	const previewHex = $derived(isValidHex(hexInput) ? hexInput : (isValidHex(value) ? value : '#000000'));
	const selectedLabel = $derived(
		options.find((o) => o.value.toLowerCase() === (value ?? '').toLowerCase())?.label ?? null
	);
	const pickerActive = $derived(!hasOptions || activeTab === 'picker');

	// Sync external value → HSV + hexInput
	$effect(() => {
		if (isValidHex(value)) {
			const [h, s, v2] = hexToHsv(value);
			hue = h; sat = s; val = v2;
			hexInput = value.toLowerCase();
		}
	});

	// ── Apply ───────────────────────────────────────────────────────────────────

	function applyHex(hex: string) {
		if (!isValidHex(hex)) return;
		onValueChange?.(hex.toLowerCase());
		uiState.data.open = false;
	}

	function applyHsv() {
		const hex = hsvToHex(hue, sat, val);
		hexInput = hex;
		onValueChange?.(hex);
	}

	function handleHexInput(raw: string) {
		hexInput = raw;
		if (isValidHex(raw)) {
			const [h, s, v2] = hexToHsv(raw);
			hue = h; sat = s; val = v2;
			onValueChange?.(raw.toLowerCase());
		}
	}

	// ── SB drag ──────────────────────────────────────────────────────────────────

	let draggingSb = false;

	function sbEventToSV(e: PointerEvent) {
		if (!sbEl) return;
		const rect = sbEl.getBoundingClientRect();
		sat = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100);
		val = Math.round(Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height)) * 100);
		applyHsv();
	}

	function onSbDown(e: PointerEvent) { draggingSb = true; sbEl?.setPointerCapture(e.pointerId); sbEventToSV(e); }
	function onSbMove(e: PointerEvent) { if (draggingSb) sbEventToSV(e); }
	function onSbUp(e: PointerEvent) { if (draggingSb) { draggingSb = false; sbEl?.releasePointerCapture(e.pointerId); } }

	// ── Hue drag ─────────────────────────────────────────────────────────────────

	let draggingHue = false;

	function hueEventToH(e: PointerEvent) {
		if (!hueEl) return;
		const rect = hueEl.getBoundingClientRect();
		hue = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 360);
		applyHsv();
	}

	function onHueDown(e: PointerEvent) { draggingHue = true; hueEl?.setPointerCapture(e.pointerId); hueEventToH(e); }
	function onHueMove(e: PointerEvent) { if (draggingHue) hueEventToH(e); }
	function onHueUp(e: PointerEvent) { if (draggingHue) { draggingHue = false; hueEl?.releasePointerCapture(e.pointerId); } }
</script>

<div class={cn('space-y-1', className)}>
	{#if label}
		<p class="text-sm text-foreground-muted">{label}</p>
	{/if}

	<Popover.Root state_key={key} placement="bottom">
		<Popover.Trigger
			variant="outlined"
			class="h-8 w-full justify-start gap-2 border-border/60 bg-card px-2 text-sm font-normal shadow-none"
		>
			<span
				class="size-4 shrink-0 rounded-[3px] border border-black/10 shadow-sm"
				style="background:{isValidHex(value) ? value : '#888888'};"
			></span>
			<span class="min-w-0 flex-1 truncate text-left">
				{selectedLabel ?? (isValidHex(value) ? value : value)}
			</span>
		</Popover.Trigger>

		<Popover.Content class="w-[240px] !p-0 overflow-hidden">
			<!-- Tab bar (only when preset options exist) -->
			{#if hasOptions}
				<div class="flex border-b border-border/60 px-1 pt-1">
					<button
						type="button"
						class="flex-1 rounded-t-[calc(var(--radius-sm)+1px)] px-2 py-1.5 text-sm font-medium transition-colors {activeTab === 'swatches' ? 'bg-background text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'}"
						onclick={() => (activeTab = 'swatches')}
					>Presets</button>
					<button
						type="button"
						class="flex-1 rounded-t-[calc(var(--radius-sm)+1px)] px-2 py-1.5 text-sm font-medium transition-colors {activeTab === 'picker' ? 'bg-background text-foreground shadow-sm' : 'text-foreground-muted hover:text-foreground'}"
						onclick={() => (activeTab = 'picker')}
					>Custom</button>
				</div>
			{/if}

			<!-- Presets panel — grid-rows animation so Popover's ResizeObserver repositions automatically -->
			{#if hasOptions}
				<div
					class="grid transition-[grid-template-rows] duration-200 ease-out"
					style="grid-template-rows: {activeTab === 'swatches' ? '1fr' : '0fr'};"
				>
					<div class="overflow-hidden">
						<div class="flex flex-wrap gap-1 p-2.5">
							{#each options as opt}
								{@const isActive = opt.value.toLowerCase() === (value ?? '').toLowerCase()}
								<Button
									variant={isActive ? 'secondary' : 'ghost'}
									class="h-7 gap-1.5 px-2 text-sm {isActive ? 'ring-1 ring-border' : ''}"
									onclick={() => applyHex(opt.value)}
								>
									<span
										class="size-3 shrink-0 rounded-full border border-black/10 shadow-sm"
										style="background:{opt.value};"
									></span>
									{opt.label}
								</Button>
							{/each}
						</div>
						<div class="border-t border-border/60 px-2.5 pb-2.5 pt-2">
							<div class="flex items-center gap-2">
								<span class="size-5 shrink-0 rounded-[3px] border border-black/10 shadow-sm" style="background:{previewHex};"></span>
								<input
									class="h-7 flex-1 rounded-[var(--radius-sm)] border border-border/60 bg-background px-2 font-mono text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-primary/50 focus:shadow-[0_0_0_2px_var(--color-ring)]"
									value={hexInput}
									placeholder="#000000"
									maxlength={7}
									spellcheck={false}
									autocomplete="off"
									oninput={(e) => handleHexInput((e.currentTarget as HTMLInputElement).value)}
									onkeydown={(e) => { if (e.key === 'Enter') applyHex(hexInput); }}
								/>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<!-- Custom picker panel — same animation technique -->
			<div
				class="grid transition-[grid-template-rows] duration-200 ease-out"
				style="grid-template-rows: {pickerActive ? '1fr' : '0fr'};"
			>
				<div class="overflow-hidden">
					<div class="space-y-2.5 p-2.5">
						<!-- SB area -->
						<div
							bind:this={sbEl}
							class="relative h-[130px] w-full cursor-crosshair overflow-hidden rounded-[var(--radius-sm)]"
							style="background:linear-gradient(to bottom,transparent,#000),linear-gradient(to right,#fff,{hueColor});"
							onpointerdown={onSbDown}
							onpointermove={onSbMove}
							onpointerup={onSbUp}
							role="presentation"
						>
							<div
								class="pointer-events-none absolute size-[14px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_4px_rgb(0_0_0_/_0.5)]"
								style="left:{sat}%;top:{100-val}%;"
							></div>
						</div>

						<!-- Hue slider -->
						<div
							bind:this={hueEl}
							class="relative h-3 w-full cursor-ew-resize overflow-hidden rounded-full"
							style="background:linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00);"
							onpointerdown={onHueDown}
							onpointermove={onHueMove}
							onpointerup={onHueUp}
							role="presentation"
						>
							<div
								class="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_1px_4px_rgb(0_0_0_/_0.5)]"
								style="left:{(hue/360)*100}%;background:{hueColor};"
							></div>
						</div>

						<!-- Preview + hex input -->
						<div class="flex items-center gap-2">
							<span
								class="size-6 shrink-0 rounded-[4px] border border-black/10 shadow-sm"
								style="background:{previewHex};"
							></span>
							<input
								class="h-7 flex-1 rounded-[var(--radius-sm)] border border-border/60 bg-background px-2 font-mono text-sm text-foreground outline-none transition-[border-color,box-shadow] focus:border-primary/50 focus:shadow-[0_0_0_2px_var(--color-ring)]"
								value={hexInput}
								placeholder="#000000"
								maxlength={7}
								spellcheck={false}
								autocomplete="off"
								oninput={(e) => handleHexInput((e.currentTarget as HTMLInputElement).value)}
								onkeydown={(e) => { if (e.key === 'Enter') applyHex(hexInput); }}
							/>
						</div>
					</div>
				</div>
			</div>
		</Popover.Content>
	</Popover.Root>
</div>
