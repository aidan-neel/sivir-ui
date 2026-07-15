<script lang="ts">
	import { type ContextMenuTriggerProps } from '.';
	import type { VirtualElement } from '@floating-ui/dom';
	import { getContextMenuContext } from './context.svelte';

	const { state: contextMenuState } = getContextMenuContext();

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
		contextMenuState.virtualElement = el;
		contextMenuState.open = true;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key !== 'ContextMenu' && !(e.shiftKey && e.key === 'F10')) return;
		e.preventDefault();
		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		contextMenuState.virtualElement = makeVirtualEl(rect.left, rect.bottom);
		contextMenuState.open = true;
	}
</script>

<div
	class={className}
	{...rest}
	role="button"
	tabindex="0"
	aria-haspopup="menu"
	aria-expanded={contextMenuState.open}
	oncontextmenu={onContextMenu}
	onkeydown={onKeydown}
>
	{@render children?.()}
</div>
