<script lang="ts">
	import * as DropdownMenu from '@silk/ui/components/dropdown-menu';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Copy2 from '@lucide/svelte/icons/files';
	import Archive from '@lucide/svelte/icons/archive';
	import Trash from '@lucide/svelte/icons/trash-2';
	import MoreHorizontal from '@lucide/svelte/icons/ellipsis';
	import Check from '@lucide/svelte/icons/check';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger variant="ghost" size="icon" aria-label="Row actions">
		<MoreHorizontal size={14} />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="min-w-[12rem]">
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><Pencil size={13} /> Rename</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><Copy2 size={13} /> Duplicate</span>
			<kbd
				class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
			>
				⌘D
			</kbd>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><Archive size={13} /> Archive</span>
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<span class="flex items-center gap-2 text-[var(--color-destructive)]">
				<Trash size={13} /> Delete
			</span>
			<kbd
				class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
			>
				⌫
			</kbd>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
