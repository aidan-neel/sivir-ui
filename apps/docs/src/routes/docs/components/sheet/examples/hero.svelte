<script lang="ts">
	import { Button } from '@sivir/ui/components/button';
	import { Input } from '@sivir/ui/components/input';
	import { Textarea } from '@sivir/ui/components/textarea';
	import * as Sheet from '@sivir/ui/components/sheet';
	import SquarePen from '@lucide/svelte/icons/square-pen';
	import Circle from '@lucide/svelte/icons/circle';
	import Signal from '@lucide/svelte/icons/signal';
	import User from '@lucide/svelte/icons/user';

	let issueTitle = $state('');
	let issueDescription = $state('');
</script>

<div class="flex items-center justify-center">
	<Sheet.Root>
		<Sheet.Trigger>
			<SquarePen size={16} />
			New issue
		</Sheet.Trigger>
		<Sheet.Content side="right">
			<Sheet.Header>
				<Sheet.Title>New issue</Sheet.Title>
				<Sheet.Description>Create a new issue in Engineering.</Sheet.Description>
			</Sheet.Header>

			<div class="flex flex-col gap-4 py-4">
				<Input bind:value={issueTitle} placeholder="Issue title" class="text-base font-medium" />

				<Textarea
					bind:value={issueDescription}
					placeholder="Add description…"
					class="min-h-[120px]"
				/>

				<div class="flex flex-col gap-2">
					<div class="flex gap-2 flex-wrap">
						<div
							class="flex items-center gap-2 px-2.5 py-1.5 rounded border border-border text-sm text-foreground-muted"
						>
							<Circle size={12} />
							<span>Todo</span>
						</div>
						<div
							class="flex items-center gap-2 px-2.5 py-1.5 rounded border border-border text-sm text-foreground-muted"
						>
							<Signal size={12} />
							<span>Medium</span>
						</div>
						<div
							class="flex items-center gap-2 px-2.5 py-1.5 rounded border border-border text-sm text-foreground-muted"
						>
							<User size={12} />
							<span>AN</span>
						</div>
					</div>
				</div>
			</div>

			<Sheet.Footer>
				<Sheet.Close>Cancel</Sheet.Close>
				<Button>Create issue</Button>
			</Sheet.Footer>
		</Sheet.Content>
	</Sheet.Root>
</div>
