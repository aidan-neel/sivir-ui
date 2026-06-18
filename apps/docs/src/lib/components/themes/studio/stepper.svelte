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
</script>

<div
	class="group flex h-8 items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card transition-colors focus-within:border-[var(--color-primary)] focus-within:ring-2 focus-within:ring-[var(--color-ring)] hover:border-border-strong"
>
	<button
		type="button"
		class="flex w-7 shrink-0 items-center justify-center text-foreground-muted transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
		onclick={() => commit(value - step)}
		disabled={atMin}
		aria-label={`Decrease ${label}`}
		tabindex="-1"
	>
		<Minus size={13} />
	</button>
	<input
		type="text"
		inputmode="decimal"
		value={text}
		oninput={onInput}
		onblur={onBlur}
		onkeydown={onKeydown}
		onfocus={(e) => (e.currentTarget as HTMLInputElement).select()}
		aria-label={label}
		class="min-w-0 flex-1 border-x border-border bg-transparent text-center font-mono text-[0.74rem] tabular-nums text-foreground outline-none [appearance:textfield]"
	/>
	<div class="flex items-center">
		{#if unit}
			<span class="pl-1.5 pr-0.5 font-mono text-[0.62rem] text-foreground-muted/70">{unit}</span>
		{/if}
		<button
			type="button"
			class="flex w-7 shrink-0 items-center justify-center text-foreground-muted transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
			onclick={() => commit(value + step)}
			disabled={atMax}
			aria-label={`Increase ${label}`}
			tabindex="-1"
		>
			<Plus size={13} />
		</button>
	</div>
</div>
