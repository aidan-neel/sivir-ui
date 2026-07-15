<script lang="ts">
	import * as Command from '@sivir/ui/components/command';

	let {
		onProfile = () => {},
		onSettings = () => {},
		onLogout = () => {}
	}: {
		onProfile?: () => void;
		onSettings?: () => void;
		onLogout?: () => void;
	} = $props();
</script>

<Command.Root>
	<Command.Trigger>
		<span data-testid="command-trigger">Open command</span>
	</Command.Trigger>
	<Command.Content>
		<Command.Search placeholder="Search commands" />
		<Command.Results>
			<Command.Group heading="Account">
				<Command.Item name="profile" callback={onProfile}>
					<span data-testid="cmd-profile">Profile</span>
				</Command.Item>
				<Command.Item name="settings" callback={onSettings}>
					<span data-testid="cmd-settings">Settings</span>
				</Command.Item>
			</Command.Group>
			<Command.Separator />
			<Command.Group heading="Session">
				<Command.Item name="logout" callback={onLogout}>
					<span data-testid="cmd-logout">Logout</span>
				</Command.Item>
			</Command.Group>
		</Command.Results>
	</Command.Content>
</Command.Root>
