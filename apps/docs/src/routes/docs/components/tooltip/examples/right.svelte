<script lang="ts">
	import { Button } from '@sivir/ui/components/button';
	import * as Tooltip from '@sivir/ui/components/tooltip';
</script>

<Tooltip.Root placement="right">
	<Tooltip.Trigger>
		<Button variant="outline">Right</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>Appears to the right</Tooltip.Content>
</Tooltip.Root>
