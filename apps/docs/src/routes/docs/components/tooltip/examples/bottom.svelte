<script lang="ts">
	import { Button } from '@sivir/ui/components/button';
	import * as Tooltip from '@sivir/ui/components/tooltip';
</script>

<Tooltip.Root placement="bottom">
	<Tooltip.Trigger>
		<Button variant="outline">Bottom</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>Appears below the trigger</Tooltip.Content>
</Tooltip.Root>
