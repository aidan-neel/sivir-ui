<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import * as Tooltip from '@silk/ui/components/tooltip';
</script>

<Tooltip.Root placement="right">
	<Tooltip.Trigger>
		<Button variant="outline">Right</Button>
	</Tooltip.Trigger>
	<Tooltip.Content>Appears to the right</Tooltip.Content>
</Tooltip.Root>
