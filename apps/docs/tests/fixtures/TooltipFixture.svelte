<script lang="ts">
	import * as Tooltip from '@silk/ui/components/tooltip';

	let {
		delay = 600,
		closeDelay = 100,
		placement = 'top' as 'top' | 'bottom' | 'left' | 'right'
	} = $props();
</script>

<Tooltip.Root {delay} {closeDelay} {placement}>
	<Tooltip.Trigger>
		<button data-testid="tooltip-trigger">Hover me</button>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<span data-testid="tooltip-body">Tooltip content</span>
	</Tooltip.Content>
</Tooltip.Root>
