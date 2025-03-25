<script lang="ts">
	import { Button } from '$lib/ui/components/button';
	import { Badge } from '$lib/ui/components/badge';
	import { Checkbox } from '$lib/ui/components/checkbox';
	import { Input } from '$lib/ui/components/input';
	import * as AlertDialog from '$lib/ui/components/alert-dialog';
	import * as Popover from '$lib/ui/components/popover';
	import * as Card from '$lib/ui/components/card';
	import * as Alert from '$lib/ui/components/alert';
	import { toast } from '$lib/ui/components/toast';

	let inputValue = $state('');
	let inputValue2 = $state('');

	let checkboxValue = $state(false);
</script>

<div class="p-4 flex-col gap-4 border w-full h-full flex items-center justify-center">
	<Alert.Root variant="info" class="mb-4">
		<Alert.Title>Verify Email</Alert.Title>
		<Alert.Description
			>Please verify your email address to continue using our services.</Alert.Description
		>
	</Alert.Root>

	<Button
		onclick={() => {
			toast({
				title: 'Profile updated',
				description: 'Your profile avatar has been successfully updated.',
				duration: 4000,
				type: 'success',
				actions: [
					{
						label: 'Undo',
						callback: () => {
							console.log('Undo');
						}
					},
					{
						label: 'View Profile',
						callback: () => {
							console.log('View Profile');
						}
					}
				],
				persistent: false,
				exitable: true
			});
		}}>Toast</Button
	>

	<div class="flex flex-row items-center gap-4 my-4">
		<Popover.Root>
			<Popover.Trigger variant="outlined">Popover</Popover.Trigger>
			<Popover.Content>
				<p>hey</p>
			</Popover.Content>
		</Popover.Root>
	</div>

	<div class="flex flex-row items-center gap-4 my-4">
		<AlertDialog.Root>
			<AlertDialog.Trigger>Alert Dialog</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Title>Are you sure?</AlertDialog.Title>
				<AlertDialog.Description>
					Are you absolutely sure you want to delete this table? You can not recover it.
				</AlertDialog.Description>
				<AlertDialog.Footer>
					<AlertDialog.Exit>Cancel</AlertDialog.Exit>
					<AlertDialog.Confirm>Continue</AlertDialog.Confirm>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	</div>

	<div class="flex flex-row items-center gap-4 my-4">
		<Button>Primary</Button>
		<Button variant="flat">Flat</Button>
		<Button variant="outlined">Outlined</Button>
		<Button variant="secondary">Secondary</Button>
		<Button variant="ghost">Ghost</Button>
		<Button variant="alternate">Alternate</Button>
		<Button variant="destructive">Destructive</Button>
	</div>

	<div class="flex flex-row items-center gap-4 my-4">
		<Badge>Primary</Badge>
		<Badge variant="flat">Flat</Badge>
		<Badge variant="outlined">Outlined</Badge>
		<Badge variant="secondary">Secondary</Badge>
		<Badge variant="ghost">Ghost</Badge>
		<Badge variant="alternate">Alternate</Badge>
		<Badge variant="destructive">Destructive</Badge>
	</div>

	<div class="flex flex-row items-center gap-4 my-4">
		<Input bind:value={inputValue} type="text" placeholder="Enter your email" label="Email" />
		<Input
			variant="outlined"
			bind:value={inputValue2}
			type="text"
			placeholder="Enter your email"
			label="Email"
		/>
	</div>
</div>

<div class="p-4 border w-full flex-col gap-5 h-full flex items-center justify-center">
	<Card.Root class="max-w-[25rem]">
		<Card.Header>
			<Card.Title>Username and password</Card.Title>
			<Card.Description>Change your username and password to secure your account</Card.Description>
		</Card.Header>
		<Card.Content class="gap-4">
			<Input
				variant="outlined"
				bind:value={inputValue2}
				type="text"
				placeholder="Username"
				label="Username"
			/>
			<Input
				variant="outlined"
				bind:value={inputValue2}
				type="text"
				placeholder="Password"
				label="Password"
			/>
		</Card.Content>
		<Card.Footer>
			<Button>Save Changes</Button>
		</Card.Footer>
	</Card.Root>

	<Checkbox label="Agree to terms and service" bind:checked={checkboxValue} />
</div>
