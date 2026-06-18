<script lang="ts">
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';

	type Props = {
		value: number;
		min: number;
		max: number;
		step?: number;
		/** Decimal places for display + parsing (0 for integers). */
		precision?: number;
		unit?: string;
		label: string;
		onchange: (value: number) => void;
	};

	let { value, min, max, step = 1, precision = 0, unit, label, onchange }: Props = $props();

	const clamp = (n: number) => Math.min(max, Math.max(min, n));
	const round = (n: number) => {
		const f = 10 ** precision;
		return Math.round(n * f) / f;
	};

	// Local text buffer so a field can be cleared / typed into without snapping.
	let text = $state('');
	let editing = $state(false);
	// Sync from the prop before paint (covers initial render + external changes),
	// but never while the user is actively editing the field.
	$effect.pre(() => {
		if (!editing) text = String(value);
	});

	function commit(next: number) {
		const v = round(clamp(next));
		onchange(v);
		text = String(v);
	}

	function onInput(e: Event) {
		editing = true;
		text = (e.currentTarget as HTMLInputElement).value;
	}
	function onBlur() {
		editing = false;
		const parsed = Number.parseFloat(text);
		if (Number.isFinite(parsed)) commit(parsed);
		else text = String(value);
	}
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			(e.currentTarget as HTMLInputElement).blur();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			commit(value + step * (e.shiftKey ? 10 : 1));
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			commit(value - step * (e.shiftKey ? 10 : 1));
		}
	}

	const atMin = $derived(round(value) <= min);
	const atMax = $derived(round(value) >= max);
	// Size the field to its longest possible value so "36px" stays centered and
	// the control doesn't reflow as digits change.
	const fieldCh = $derived(Math.max(String(max).length, String(min).length, 2));
</script>

<div
	class="flex h-7 items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card transition-colors focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-ring)] hover:border-border-strong"
>
	<button
		type="button"
		class="flex w-6 shrink-0 items-center justify-center text-foreground-muted transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
		onclick={() => commit(value - step)}
		disabled={atMin}
		aria-label={`Decrease ${label}`}
		tabindex="-1"
	>
		<Minus size={12} />
	</button>
	<!-- Number + unit read as one token ("36px"), centered between the buttons. -->
	<label class="flex flex-1 items-baseline justify-center gap-px px-1 leading-none">
		<input
			type="text"
			inputmode="decimal"
			value={text}
			oninput={onInput}
			onblur={onBlur}
			onkeydown={onKeydown}
			onfocus={(e) => (e.currentTarget as HTMLInputElement).select()}
			aria-label={label}
			style={`width:${fieldCh}ch`}
			class="bg-transparent text-right font-mono text-[0.74rem] tabular-nums text-foreground outline-none [appearance:textfield]"
		/>
		{#if unit}
			<span class="font-mono text-[0.7rem] text-foreground-muted/80">{unit}</span>
		{/if}
	</label>
	<button
		type="button"
		class="flex w-6 shrink-0 items-center justify-center text-foreground-muted transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
		onclick={() => commit(value + step)}
		disabled={atMax}
		aria-label={`Increase ${label}`}
		tabindex="-1"
	>
		<Plus size={12} />
	</button>
</div>
