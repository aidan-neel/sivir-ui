<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import * as Tooltip from '@silk/ui/components/tooltip';
</script>

<Tooltip.Root placement="bottom">
	<Tooltip.Trigger>
		<Button variant="outline">Bottom</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>Appears below the trigger</Tooltip.Content>
</Tooltip.Root>
