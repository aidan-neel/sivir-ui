<script lang="ts">
	import * as DropdownMenu from '@silk/ui/components/dropdown-menu';
	import User from '@lucide/svelte/icons/user';
	import Settings from '@lucide/svelte/icons/settings';
	import LogOut from '@lucide/svelte/icons/log-out';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import LifeBuoy from '@lucide/svelte/icons/life-buoy';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger variant="outline">
		My Account
		<ChevronDown size={16} class="text-foreground-muted" />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="min-w-[16rem]">
		<DropdownMenu.Label>
			<span class="text-[0.7rem] text-foreground-muted">aidan@silk-ui.dev</span>
		</DropdownMenu.Label>
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><User size={13} /> Profile</span>
			<kbd
				class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
			>
				⇧⌘P
			</kbd>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><CreditCard size={13} /> Billing</span>
			<kbd
				class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
			>
				⌘B
			</kbd>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><Settings size={13} /> Settings</span>
			<kbd
				class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
			>
				⌘,
			</kbd>
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<span class="flex items-center gap-2"><LifeBuoy size={13} /> Help & feedback</span>
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<span class="flex items-center gap-2 text-[var(--color-destructive)]">
				<LogOut size={13} /> Sign out
			</span>
			<kbd
				class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[0.62rem] text-foreground-muted"
			>
				⇧⌘Q
			</kbd>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
