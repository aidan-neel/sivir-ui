<script lang="ts">
	import { states } from '@sivir/ui/internals/state.svelte.ts';
	import { getContext } from 'svelte';
	import { type ContextMenuState, type ContextMenuTriggerProps } from '.';
	import type { VirtualElement } from '@floating-ui/dom';

	const key = getContext<string>('key');
	const uiState = states[key].data as ContextMenuState;

	let { class: className, children, ...rest }: ContextMenuTriggerProps = $props();

	function makeVirtualEl(x: number, y: number): VirtualElement {
		return {
			getBoundingClientRect: () =>
				({
					x,
					y,
					top: y,
					left: x,
					right: x,
					bottom: y,
					width: 0,
					height: 0
				}) as DOMRect
		};
	}

	function onContextMenu(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		const el = makeVirtualEl(e.clientX, e.clientY);
		uiState.virtualElement = el;
		uiState.open = true;
	}
</script>

<div class={className} {...rest} role="button" tabindex="0" oncontextmenu={onContextMenu}>
	{@render children?.()}
</div>
