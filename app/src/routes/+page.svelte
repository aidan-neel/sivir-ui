<script>
	import { Button } from '$lib/ui/components/button';
	import { flyAndScale } from '$lib/ui/internals/transition';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	import * as Card from '$lib/ui/components/card';
	import { Input } from '$lib/ui/components/input';
	import * as Alert from '$lib/ui/components/alert';
	import * as AlertDialog from '$lib/ui/components/alert-dialog';
	import { Checkbox } from '$lib/ui/components/checkbox';
	import { mode } from "mode-watcher";

	let ready = $state(false);
	$effect(() => {
		ready = true;
	});
</script>

{#if ready}
	<div
		class="z-10 pb-40 absolute w-full flex items-center text-center flex-col pt-40 gap-4 justify-start"
	>
		<a
			in:fly={{ duration: 800, y: 20, easing: cubicOut }}
			href="/docs/changelog"
			class="rounded-btn border shadow-sm px-5 py-1 text-sm font-medium">🎉 New 1.0 Release!</a
		>
		<p
			in:fly={{ duration: 800, y: 20, easing: cubicOut }}
                class="text-[48px] w-full max-w-[42rem] font-display font-semibold leading-14"
		>
			Build cleaner with Svelte 5
		</p>
		<p
			in:fly={{ duration: 800, y: 20, easing: cubicOut }}
			class="text-[18px] w-full max-w-[42rem]"
		>
            A flexible, accessible component library and distribution platform for Svelte.
            Built for developers who want complete control over their UI.
		</p>
		<div in:fly={{ duration: 800, y: 20, easing: cubicOut }} class="flex flex-row gap-5">
			<Button href={'/docs/components/alert'} class="text-sm">Get Started</Button>
			<Button href={'https://github.com/aidan-neel/ui'} class="text-sm" variant="outlined"
				>View on GitHub</Button
			>
		</div>

		<div
			in:fly={{ duration: 800, y: 20, easing: cubicOut }}
			class="w-1/2 hidden h-[45rem] mt-40 border
            p-8 rounded-lg"
		>
			<Card.Root class="max-w-[25rem] text-left">
				<Card.Header>
					<Card.Title>Username and password</Card.Title>
					<Card.Description
						>Change your username and password to secure your account</Card.Description
					>
				</Card.Header>
				<Card.Content class="gap-4">
					<Input variant="outlined" type="text" placeholder="Username" label="Username" />
					<Input variant="outlined" type="text" placeholder="Password" label="Password" />
				</Card.Content>
				<Card.Footer>
					<Button>Save Changes</Button>
				</Card.Footer>
			</Card.Root>

			<Card.Root class="max-w-[25rem] text-left">
				<Card.Header>
					<Card.Title>Delete Account</Card.Title>
					<Card.Description>This action is irreversible. Proceed with caution.</Card.Description>
				</Card.Header>
				<Card.Content class="gap-4 flex flex-row justify-between">
					<Button variant="outlined">Cancel</Button>
					<AlertDialog.Root>
						<AlertDialog.Trigger
							class="bg-destructive hover:bg-destructive-hovered active:bg-destructive-active disabled:bg-destructive-disabled"
							>Delete Account</AlertDialog.Trigger
						>
						<AlertDialog.Content>
							<AlertDialog.Title>Are you sure?</AlertDialog.Title>
							<AlertDialog.Description>
								Are you absolutely sure you want to delete your account? You can not recover it.
							</AlertDialog.Description>
							<AlertDialog.Footer>
								<AlertDialog.Exit>Cancel</AlertDialog.Exit>
								<AlertDialog.Confirm
									class="bg-destructive hover:bg-destructive-hovered active:bg-destructive-active disabled:bg-destructive-disabled"
									>Delete</AlertDialog.Confirm
								>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
{/if}
