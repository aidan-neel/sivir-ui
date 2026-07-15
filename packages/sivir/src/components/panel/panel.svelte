<script lang="ts">
	import { cn } from '@sivir/ui/utils';
	import { PANEL_FRAME, PANEL_SURFACE, type PanelProps } from '.';

	let { children, class: className, ...rest }: PanelProps = $props();
</script>

<div data-ui="panel" class={cn(className, PANEL_FRAME)} {...rest}>
	<div class={cn(PANEL_SURFACE, 'p-3')}>
		{@render children?.()}
	</div>
</div>
