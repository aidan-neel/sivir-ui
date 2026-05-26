<script lang="ts">
	import { setContext, type Snippet } from 'svelte';

	type Placement = 'top' | 'left' | 'bottom' | 'right';

	type TooltipContext = {
		id: string;
		open: boolean;
		delay: number;
		closeDelay: number;
		placement: Placement;
		triggerEl?: HTMLElement;
		contentEl?: HTMLElement;
		openTimeout?: ReturnType<typeof setTimeout>;
		closeTimeout?: ReturnType<typeof setTimeout>;
	};

	const {
		children,
		delay = 600,
		closeDelay = 100,
		placement = 'top'
	}: {
		children?: Snippet;
		delay?: number;
		closeDelay?: number;
		placement?: Placement;
	} = $props();

	// State proxy: `delay`/`closeDelay`/`placement` are read straight from the
	// props so they're always current. Mutable bits (`open`, `triggerEl`, …)
	// live on a real $state object the children can write to.
	const mut = $state({
		id: `tooltip-${Math.random().toString(36).slice(2)}`,
		open: false,
		triggerEl: undefined as HTMLElement | undefined,
		contentEl: undefined as HTMLElement | undefined,
		openTimeout: undefined as ReturnType<typeof setTimeout> | undefined,
		closeTimeout: undefined as ReturnType<typeof setTimeout> | undefined
	});

	const tooltipState: TooltipContext = {
		get id() { return mut.id; },
		get open() { return mut.open; },
		set open(v) { mut.open = v; },
		get triggerEl() { return mut.triggerEl; },
		set triggerEl(v) { mut.triggerEl = v; },
		get contentEl() { return mut.contentEl; },
		set contentEl(v) { mut.contentEl = v; },
		get openTimeout() { return mut.openTimeout; },
		set openTimeout(v) { mut.openTimeout = v; },
		get closeTimeout() { return mut.closeTimeout; },
		set closeTimeout(v) { mut.closeTimeout = v; },
		get delay() { return delay; },
		get closeDelay() { return closeDelay; },
		get placement() { return placement; }
	};

	setContext('tooltip', tooltipState);
</script>

{@render children?.()}
