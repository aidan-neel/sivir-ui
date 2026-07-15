<script lang="ts">
	import * as Command from '@sivir/ui/components/command';
	import Shortcut from '@sivir/ui/components/shortcut';
	import Search from '@lucide/svelte/icons/search';
	import Inbox from '@lucide/svelte/icons/inbox';
	import CircleDot from '@lucide/svelte/icons/circle-dot';
	import Map from '@lucide/svelte/icons/map';
	import SquarePen from '@lucide/svelte/icons/square-pen';
	import FolderPlus from '@lucide/svelte/icons/folder-plus';
	import Users from '@lucide/svelte/icons/users';
	import Moon from '@lucide/svelte/icons/moon';
</script>

<div class="flex items-center justify-center">
	<Command.Root>
		<Command.Trigger variant="outline" class="w-64 justify-between px-4 py-2 text-muted-foreground">
			<div class="flex items-center gap-2">
				<Search size={16} />
				<span>Search or jump to…</span>
			</div>
			<Shortcut shortcut="cmd+K" />
		</Command.Trigger>
		<Command.Content>
			<Command.Search placeholder="Type a command or search…" />
			<Command.Results>
				<Command.Group heading="Jump to">
					<Command.Item name="Inbox">
						<Inbox size={16} />
						Inbox
					</Command.Item>
					<Command.Item name="My Issues">
						<CircleDot size={16} />
						My Issues
					</Command.Item>
					<Command.Item name="Roadmap">
						<Map size={16} />
						Roadmap
					</Command.Item>
				</Command.Group>
				<Command.Separator />
				<Command.Group heading="Create">
					<Command.Item name="New issue">
						<SquarePen size={16} />
						<span class="flex-1">New issue</span>
						<Shortcut shortcut="C" />
					</Command.Item>
					<Command.Item name="New project">
						<FolderPlus size={16} />
						New project
					</Command.Item>
				</Command.Group>
				<Command.Separator />
				<Command.Group heading="Settings">
					<Command.Item name="Switch team">
						<Users size={16} />
						Switch team
					</Command.Item>
					<Command.Item name="Theme">
						<Moon size={16} />
						Theme
					</Command.Item>
				</Command.Group>
			</Command.Results>
		</Command.Content>
	</Command.Root>
</div>
