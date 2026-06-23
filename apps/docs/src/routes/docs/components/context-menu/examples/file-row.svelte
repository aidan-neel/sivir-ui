<script lang="ts">
	import * as ContextMenu from '@silk/ui/components/context-menu';
	import FileText from '@lucide/svelte/icons/file-text';
	import FolderOpen from '@lucide/svelte/icons/folder-open';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Copy2 from '@lucide/svelte/icons/files';
	import Star from '@lucide/svelte/icons/star';
	import Tag from '@lucide/svelte/icons/tag';
	import Trash from '@lucide/svelte/icons/trash-2';
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<div
			class="flex items-center gap-3 rounded-[var(--radius-md)] border border-dashed border-border bg-secondary/30 px-3 py-3 cursor-default"
		>
			<FileText size={14} class="text-foreground-muted" />
			<div class="flex flex-col">
				<span class="text-[0.84rem] font-[var(--font-weight-label,500)]">brand-guidelines.fig</span>
				<span class="text-[0.7rem] text-foreground-muted">Edited 2h ago · 4.2 MB</span>
			</div>
		</div>
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item callback={() => {}}>
			<span class="flex items-center gap-2"><FolderOpen size={13} /> Open</span>
		</ContextMenu.Item>
		<ContextMenu.Item callback={() => {}}>
			<span class="flex items-center gap-2"><Pencil size={13} /> Rename</span>
		</ContextMenu.Item>
		<ContextMenu.Item callback={() => {}}>
			<span class="flex items-center gap-2"><Copy2 size={13} /> Duplicate</span>
		</ContextMenu.Item>
		<ContextMenu.Separator />
		<ContextMenu.Item callback={() => {}}>
			<span class="flex items-center gap-2"><Star size={13} /> Star</span>
		</ContextMenu.Item>
		<ContextMenu.Item callback={() => {}}>
			<span class="flex items-center gap-2"><Tag size={13} /> Add label</span>
		</ContextMenu.Item>
		<ContextMenu.Separator />
		<ContextMenu.Item callback={() => {}}>
			<span class="flex items-center gap-2 text-[var(--color-error)]"
				><Trash size={13} /> Move to trash</span
			>
		</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
