<script lang="ts">
	import * as ContextMenu from '@sivir/ui/components/context-menu';
	import Image from '@lucide/svelte/icons/image';
	import Download from '@lucide/svelte/icons/download';
	import Copy2 from '@lucide/svelte/icons/files';
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger>
		<div
			class="grid h-24 place-items-center rounded-[var(--radius-md)] border border-border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_30%,transparent),color-mix(in_srgb,var(--color-info)_30%,transparent))] cursor-default"
		>
			<Image size={20} class="text-foreground" />
		</div>
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Item callback={() => {}}>
			<span class="flex items-center gap-2"><Download size={13} /> Save image</span>
		</ContextMenu.Item>
		<ContextMenu.Item callback={() => {}}>
			<span class="flex items-center gap-2"><Copy2 size={13} /> Copy image</span>
		</ContextMenu.Item>
		<ContextMenu.Item callback={() => {}}>Copy image address</ContextMenu.Item>
		<ContextMenu.Separator />
		<ContextMenu.Item callback={() => {}}>Open in new tab</ContextMenu.Item>
		<ContextMenu.Item callback={() => {}}>Inspect</ContextMenu.Item>
	</ContextMenu.Content>
</ContextMenu.Root>
