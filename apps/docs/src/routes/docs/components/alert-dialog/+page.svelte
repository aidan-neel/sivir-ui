<script lang="ts">
	import { highlight } from '$lib/highlight';
	import * as AlertDialog from '@silk/ui/components/alert-dialog';
	import * as Tabs from '@silk/ui/components/tabs';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Layers from '@lucide/svelte/icons/layers-3';
	import Hash from '@lucide/svelte/icons/hash';
	import Trash from '@lucide/svelte/icons/trash-2';

	const TITLE = 'Alert Dialog';
	const SLUG = 'alert-dialog';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'open',
			type: 'boolean',
			default: 'false',
			description: 'Optional bindable open state.'
		},
		{
			component: 'Trigger',
			prop: '...ButtonProps',
			type: '--',
			default: '--',
			description: 'Renders as a Silk Button. Inherits every Button prop.'
		},
		{
			component: 'Content',
			prop: 'allowClickOutside',
			type: 'boolean',
			default: 'true',
			description: 'Disable to force the user to confirm or exit explicitly.'
		},
		{
			component: 'Content',
			prop: 'variant',
			type: '"default" | "spotlight"',
			default: '"default"',
			description:
				'Surface treatment. "spotlight" is a focused, centered layout with full-width actions.'
		},
		{
			component: 'Header',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Container for Title + Description.'
		},
		{
			component: 'Title',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Short, decisive question or statement.'
		},
		{
			component: 'Description',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'One or two sentences explaining the consequence.'
		},
		{
			component: 'Footer',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Action row -- keep Cancel on the left, Confirm on the right.'
		},
		{
			component: 'Exit',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Closes the dialog without firing the action.'
		},
		{
			component: 'Confirm',
			prop: 'onclick',
			type: '() => void',
			default: '--',
			description: 'Fires the action and closes the dialog.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Alert Dialog</title>
	<meta
		name="description"
		content="A modal that interrupts the user to confirm a consequential action."
	/>
</svelte:head>

<DocHeader
	title={TITLE}
	description="A modal that stops everything to ask one question. Reach for it when an action is expensive, irreversible, or affects other people. If the user can shrug and undo, use a Toast instead."
	source={SOURCE}
	install={installCommand}
	pills={[
		{ label: 'v0.4.2', variant: 'outlined' },
		{ label: '9 sub-components' },
		{ label: 'Composable' }
	]}
/>

<!-- ─── Preview ──────────────────────────────────────────────── -->
<section class="pt-10">
	<div
		class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
	>
		<div
			class="grid min-h-[10rem] place-items-center border-b border-border/70 bg-secondary/30 p-8"
		>
			<AlertDialog.Root>
				<AlertDialog.Trigger variant="destructive">
					<Trash size={14} />
					Delete workspace
				</AlertDialog.Trigger>
				<AlertDialog.Content class="max-w-[28rem]">
					<AlertDialog.Header>
						<AlertDialog.Title>Delete this workspace?</AlertDialog.Title>
						<AlertDialog.Description>
							All projects, comments, and exports will be removed. This action cannot be undone.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Exit>Cancel</AlertDialog.Exit>
						<AlertDialog.Confirm>Delete</AlertDialog.Confirm>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</div>
		<pre
			class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
				>{@html highlight(
					`<AlertDialog.Root>
  <AlertDialog.Trigger variant="destructive">Delete</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete this workspace?</AlertDialog.Title>
      <AlertDialog.Description>
        All projects and exports will be removed. This cannot be undone.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Exit>Cancel</AlertDialog.Exit>
      <AlertDialog.Confirm>Delete</AlertDialog.Confirm>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`,
					'svelte'
				)}</code
			></pre>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection
		icon={Layers}
		title="Patterns"
		description="Two situations make up 90% of Alert Dialogs in real products."
	>
		<Tabs.Root value="destructive">
			<Tabs.List>
				<Tabs.Trigger value="destructive">Destructive confirmation</Tabs.Trigger>
				<Tabs.Trigger value="sign-out">Sign out</Tabs.Trigger>
				<Tabs.Trigger value="spotlight">Spotlight</Tabs.Trigger>
			</Tabs.List>

			<div class="mt-3 grid gap-3 md:grid-cols-2">
				<Tabs.Content value="destructive" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
					>
						<AlertDialog.Root>
							<AlertDialog.Trigger variant="destructive">Delete project</AlertDialog.Trigger>
							<AlertDialog.Content class="max-w-[26rem]">
								<AlertDialog.Header>
									<AlertDialog.Title>Delete this project?</AlertDialog.Title>
									<AlertDialog.Description>
										All branches, issues, and deploy history will be permanently removed.
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Exit>Cancel</AlertDialog.Exit>
									<AlertDialog.Confirm>Delete project</AlertDialog.Confirm>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
							>{@html highlight(
								`<AlertDialog.Root>
  <AlertDialog.Trigger variant="destructive">
    Delete project
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Delete this project?</AlertDialog.Title>
      <AlertDialog.Description>
        All branches, issues, and deploy history…
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Exit>Cancel</AlertDialog.Exit>
      <AlertDialog.Confirm>Delete project</AlertDialog.Confirm>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`,
								'svelte'
							)}</code
						></pre>
				</Tabs.Content>

				<Tabs.Content value="sign-out" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
					>
						<AlertDialog.Root>
							<AlertDialog.Trigger variant="outlined">Sign out</AlertDialog.Trigger>
							<AlertDialog.Content class="max-w-[24rem]">
								<AlertDialog.Header>
									<AlertDialog.Title>Sign out?</AlertDialog.Title>
									<AlertDialog.Description>
										You'll need to sign in again to resume your session.
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Exit>Stay</AlertDialog.Exit>
									<AlertDialog.Confirm>Sign out</AlertDialog.Confirm>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
							>{@html highlight(
								`<AlertDialog.Root>
  <AlertDialog.Trigger variant="outlined">Sign out</AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Sign out?</AlertDialog.Title>
      <AlertDialog.Description>
        You'll need to sign in again to resume your session.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Exit>Stay</AlertDialog.Exit>
      <AlertDialog.Confirm>Sign out</AlertDialog.Confirm>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`,
								'svelte'
							)}</code
						></pre>
				</Tabs.Content>

				<Tabs.Content value="spotlight" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
					>
						<AlertDialog.Root>
							<AlertDialog.Trigger>Show spotlight</AlertDialog.Trigger>
							<AlertDialog.Content variant="spotlight">
								<AlertDialog.Header>
									<AlertDialog.Title>Are you sure you want to do this?</AlertDialog.Title>
									<AlertDialog.Description>
										A focused, centered take on the same composable parts — just pass
										<code>variant="spotlight"</code> to Content.
									</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Exit>Cancel</AlertDialog.Exit>
									<AlertDialog.Confirm>Continue</AlertDialog.Confirm>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
							>{@html highlight(
								`<AlertDialog.Root>
  <AlertDialog.Trigger>Show spotlight</AlertDialog.Trigger>
  <AlertDialog.Content variant="spotlight">
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure you want to do this?</AlertDialog.Title>
      <AlertDialog.Description>
        A high-contrast, centered take on the same parts.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Exit>Cancel</AlertDialog.Exit>
      <AlertDialog.Confirm>Continue</AlertDialog.Confirm>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>`,
								'svelte'
							)}</code
						></pre>
				</Tabs.Content>
			</div>
		</Tabs.Root>
	</DocSection>

	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="AlertDialog" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />
