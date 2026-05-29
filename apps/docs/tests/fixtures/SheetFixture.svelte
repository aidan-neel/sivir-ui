<script lang="ts">
	import * as Sheet from '@silk/ui/components/sheet';

	let {
		open = $bindable(false),
		allowClickOutside = true,
		side = 'right' as 'left' | 'right'
	} = $props();
</script>

<button data-testid="trigger" onclick={() => (open = true)}>Open</button>

<Sheet.Root bind:open>
	<Sheet.Content {allowClickOutside} {side}>
		<Sheet.Header>
			<Sheet.Title>Sheet Title</Sheet.Title>
			<Sheet.Description>Sheet Description</Sheet.Description>
		</Sheet.Header>
		<div>
			<button data-testid="inside-1">Inside one</button>
			<button data-testid="inside-2">Inside two</button>
		</div>
		<Sheet.Footer>
			<Sheet.Close onclick={() => (open = false)}>Close</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
