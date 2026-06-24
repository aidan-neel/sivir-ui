<script lang="ts">
	import * as ContextMenu from '@silk/ui/components/context-menu';
	import Copy from '@lucide/svelte/icons/copy';
	import Clipboard from '@lucide/svelte/icons/clipboard-paste';
	import Clone from '@lucide/svelte/icons/copy';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import Edit from '@lucide/svelte/icons/edit-2';
	import Trash from '@lucide/svelte/icons/trash-2';
</script>

<div class="flex items-center justify-center">
	<ContextMenu.Root>
		<ContextMenu.Trigger>
			<div
				class="relative h-44 w-80 rounded-lg bg-background border border-border/50"
				style="background-image: linear-gradient(90deg, transparent 24%, rgba(148,113,113,.05) 25%, rgba(148,113,113,.05) 26%, transparent 27%, transparent 74%, rgba(148,113,113,.05) 75%, rgba(148,113,113,.05) 76%, transparent 77%, transparent), linear-gradient(0deg, transparent 24%, rgba(148,113,113,.05) 25%, rgba(148,113,113,.05) 26%, transparent 27%, transparent 74%, rgba(148,113,113,.05) 75%, rgba(148,113,113,.05) 76%, transparent 77%, transparent); background-size: 50px 50px;"
			>
				<!-- Selected layer -->
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="relative">
						<!-- Selection ring -->
						<div
							class="absolute inset-0 rounded-md pointer-events-none"
							style="border: 2px solid #0d99ff; box-shadow: inset 0 0 0 1px #0d99ff;"
						></div>

						<!-- Corner handles -->
						<div
							class="absolute w-2 h-2 rounded-full bg-white border border-[#0d99ff] -top-1 -left-1 pointer-events-none"
							style="box-shadow: 0 0 0 1px #0d99ff;"
						></div>
						<div
							class="absolute w-2 h-2 rounded-full bg-white border border-[#0d99ff] -top-1 -right-1 pointer-events-none"
							style="box-shadow: 0 0 0 1px #0d99ff;"
						></div>
						<div
							class="absolute w-2 h-2 rounded-full bg-white border border-[#0d99ff] -bottom-1 -left-1 pointer-events-none"
							style="box-shadow: 0 0 0 1px #0d99ff;"
						></div>
						<div
							class="absolute w-2 h-2 rounded-full bg-white border border-[#0d99ff] -bottom-1 -right-1 pointer-events-none"
							style="box-shadow: 0 0 0 1px #0d99ff;"
						></div>

						<!-- Content box -->
						<div
							class="w-24 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-md flex items-center justify-center text-xs font-medium text-foreground"
						>
							Hero / Card
						</div>
					</div>
				</div>
			</div>
		</ContextMenu.Trigger>

		<ContextMenu.Content>
			<ContextMenu.Item callback={() => {}}>
				<div class="flex items-center justify-between w-full gap-4">
					<div class="flex items-center gap-2">
						<Copy size={16} />
						<span>Copy</span>
					</div>
					<kbd class="text-foreground-muted text-xs">⌘C</kbd>
				</div>
			</ContextMenu.Item>

			<ContextMenu.Item callback={() => {}}>
				<div class="flex items-center justify-between w-full gap-4">
					<div class="flex items-center gap-2">
						<Clipboard size={16} />
						<span>Paste here</span>
					</div>
					<kbd class="text-foreground-muted text-xs">⌘V</kbd>
				</div>
			</ContextMenu.Item>

			<ContextMenu.Item callback={() => {}}>
				<div class="flex items-center justify-between w-full gap-4">
					<div class="flex items-center gap-2">
						<Clone size={16} />
						<span>Duplicate</span>
					</div>
					<kbd class="text-foreground-muted text-xs">⌘D</kbd>
				</div>
			</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Item callback={() => {}}>
				<div class="flex items-center justify-between w-full gap-4">
					<div class="flex items-center gap-2">
						<ArrowUp size={16} />
						<span>Bring to front</span>
					</div>
					<kbd class="text-foreground-muted text-xs">⌘]</kbd>
				</div>
			</ContextMenu.Item>

			<ContextMenu.Item callback={() => {}}>
				<div class="flex items-center justify-between w-full gap-4">
					<div class="flex items-center gap-2">
						<ArrowDown size={16} />
						<span>Send to back</span>
					</div>
					<kbd class="text-foreground-muted text-xs">⌘[</kbd>
				</div>
			</ContextMenu.Item>

			<ContextMenu.Separator />

			<ContextMenu.Item callback={() => {}}>
				<div class="flex items-center justify-between w-full gap-4">
					<div class="flex items-center gap-2">
						<Edit size={16} />
						<span>Rename</span>
					</div>
					<span class="text-foreground-muted text-xs"></span>
				</div>
			</ContextMenu.Item>

			<ContextMenu.Item callback={() => {}}>
				<div class="flex items-center justify-between w-full gap-4">
					<div class="flex items-center gap-2 text-error">
						<Trash size={16} />
						<span>Delete</span>
					</div>
					<span class="text-foreground-muted text-xs"></span>
				</div>
			</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Root>
</div>
