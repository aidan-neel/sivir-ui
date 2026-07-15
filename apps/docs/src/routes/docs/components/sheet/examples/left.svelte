<script lang="ts">
	import * as Sheet from '@sivir/ui/components/sheet';
	import Menu from '@lucide/svelte/icons/menu';
</script>

<Sheet.Root>
	<Sheet.Trigger variant="outline">
		<Menu size={14} />
		Left side
	</Sheet.Trigger>
	<Sheet.Content side="left">
		<Sheet.Header>
			<Sheet.Title>Navigation</Sheet.Title>
		</Sheet.Header>
		<div class="py-4 text-foreground-muted">Drawer content here</div>
	</Sheet.Content>
</Sheet.Root>
