<script lang="ts">
	import { states } from '@silk/ui/internals/state.svelte.ts';
	import { cn } from '@silk/ui/utils';
	import { getContext, onMount, type Snippet } from 'svelte';

	// Mirrors button.svelte's internal state shape -- kept as a local type
	// since the public `ButtonState` export was removed in button@2.0.0.
	type ButtonStateShape = { onclick?: (() => void) | undefined };

	const key = getContext('key') as string | undefined;
	// Shortcut is most commonly used inside a Button (auto-wires onclick), but
	// it can also be rendered standalone. When there's no parent Button,
	// `uiState` is undefined and the key handler simply does nothing.
	const uiState = key ? (states[key]?.data as ButtonStateShape | undefined) : undefined;

	type Props = {
		children?: Snippet;
		class?: string;
		shortcut: string;
	};

	let { children, class: className, shortcut, ...rest }: Props = $props();

	// Map keybinding tokens to the glyphs people recognise from native menus.
	const GLYPHS: Record<string, string> = {
		cmd: '⌘',
		command: '⌘',
		meta: '⌘',
		ctrl: '⌃',
		control: '⌃',
		shift: '⇧',
		alt: '⌥',
		option: '⌥',
		opt: '⌥',
		enter: '↵',
		return: '↵',
		esc: 'Esc',
		escape: 'Esc',
		tab: '⇥',
		space: 'Space',
		up: '↑',
		down: '↓',
		left: '←',
		right: '→',
		backspace: '⌫',
		delete: '⌦',
		plus: '+'
	};

	// Split "cmd+K" into the caps we render. A single-character key is
	// upper-cased; named keys fall back to a capitalised label.
	const caps = $derived(
		shortcut
			.split('+')
			.map((raw) => raw.trim())
			.filter(Boolean)
			.map((raw) => {
				const lower = raw.toLowerCase();
				if (GLYPHS[lower]) return GLYPHS[lower];
				if (raw.length === 1) return raw.toUpperCase();
				return raw.charAt(0).toUpperCase() + raw.slice(1);
			})
	);

	function handleKey(event: KeyboardEvent) {
		if (uiState) {
			const keys = shortcut.split('+').map((k) => k.trim().toLowerCase());

			const meta = keys.includes('cmd') || keys.includes('command');
			const shift = keys.includes('shift');
			const ctrl = keys.includes('ctrl') || keys.includes('control');
			const alt = keys.includes('alt');
			const keyChar = keys.find(
				(k) => !['cmd', 'command', 'ctrl', 'control', 'shift', 'alt'].includes(k)
			);

			if (
				event.key.toLowerCase() === keyChar &&
				event.metaKey === meta &&
				event.shiftKey === shift &&
				event.ctrlKey === ctrl &&
				event.altKey === alt
			) {
				event.preventDefault();
				uiState.onclick?.();
			}
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});
</script>

<kbd {...rest} class={cn('inline-flex select-none items-center gap-0.5 align-middle', className)}>
	{#if children}
		<span
			class="inline-flex min-w-[0.9em] items-center justify-center font-mono [font-size:var(--shortcut-font-size,0.72rem)] font-medium leading-none text-foreground-muted"
		>
			{@render children()}
		</span>
	{:else}
		{#each caps as cap, i (i)}
			<span
				class="inline-flex min-w-[0.9em] items-center justify-center font-mono [font-size:var(--shortcut-font-size,0.72rem)] font-medium leading-none text-foreground-muted"
			>
				{cap}
			</span>
		{/each}
	{/if}
</kbd>
