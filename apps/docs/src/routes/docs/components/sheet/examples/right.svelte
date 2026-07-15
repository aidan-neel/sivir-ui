<script lang="ts">
	import * as Sheet from '@sivir/ui/components/sheet';
	import Menu from '@lucide/svelte/icons/menu';
</script>

<Sheet.Root>
	<Sheet.Trigger variant="outline">
		<Menu size={14} />
		Right side
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Filters</Sheet.Title>
		</Sheet.Header>
		<div class="py-4 text-foreground-muted">Filter controls here</div>
	</Sheet.Content>
</Sheet.Root>
