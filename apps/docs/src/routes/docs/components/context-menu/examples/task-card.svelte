<script lang="ts">
	import * as ContextMenu from '@sivir/ui/components/context-menu';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Star from '@lucide/svelte/icons/star';
	import Share from '@lucide/svelte/icons/share-2';
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<div
			class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-3 cursor-default"
		>
			<div class="flex items-center justify-between gap-2">
				<span
					class="text-[0.7rem] font-[var(--font-weight-label,500)] uppercase text-foreground-muted"
					>SLK-482</span
				>
				<span class="inline-flex items-center gap-1 text-[0.66rem] text-[var(--color-warning)]">
					<span class="size-1.5 rounded-full bg-[var(--color-warning)]"></span>
					In review
				</span>
			</div>
			<p class="m-0 text-[0.84rem] font-[var(--font-weight-label,500)] leading-snug">
				Refactor toolbar to share Button primitives
			</p>
		</div>
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item callback={() => {}}
			><span class="flex items-center gap-2"><Pencil size={13} /> Edit task</span></ContextMenu.Item
		>
		<ContextMenu.Item callback={() => {}}
			><span class="flex items-center gap-2"><Star size={13} /> Watch</span></ContextMenu.Item
		>
		<ContextMenu.Item callback={() => {}}
			><span class="flex items-center gap-2"><Share size={13} /> Share link</span></ContextMenu.Item
		>
		<ContextMenu.Separator />
		<ContextMenu.Item callback={() => {}}>Move to backlog</ContextMenu.Item>
		<ContextMenu.Item callback={() => {}}>Close as complete</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
