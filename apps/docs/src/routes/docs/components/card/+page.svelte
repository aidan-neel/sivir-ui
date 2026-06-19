<script lang="ts">
	import { Button } from '@silk/ui/components/button';
	import { highlight } from '$lib/highlight';
	import * as Card from '@silk/ui/components/card';
	import * as Tabs from '@silk/ui/components/tabs';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Layers from '@lucide/svelte/icons/layers-3';
	import Hash from '@lucide/svelte/icons/hash';
	import Sparkles from '@lucide/svelte/icons/sparkles';

	const TITLE = 'Card';
	const SLUG = 'card';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			component: 'Root',
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Container -- rounded surface with border + shadow.'
		},
		{
			component: 'Header',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Top section. Hosts Title + Description.'
		},
		{
			component: 'Title',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Short headline. Uses your `--font-header` token.'
		},
		{
			component: 'Description',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Sub-headline. Foreground-muted.'
		},
		{
			component: 'Content',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Main body. Adds the appropriate inner padding.'
		},
		{
			component: 'Footer',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Action row. Right-align CTAs.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Card</title>
	<meta name="description" content="Surface container for grouping related content." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="The universal grouping surface. Use it for stat cards, dashboard tiles, settings sections, anything that needs to feel like its own thing."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: '6 sub-components' }]}
/>

<!-- Preview -->
<section class="pt-10">
	<div class="relative">
		<div
			class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"
		></div>
		<div
			class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
		>
			<div class="grid min-h-[14rem] place-items-center bg-secondary/30 p-8">
				<Card.Root class="w-full max-w-[24rem]">
					<Card.Header>
						<Card.Title>Account settings</Card.Title>
						<Card.Description>Manage how your workspace handles invites and seats.</Card.Description
						>
					</Card.Header>
					<Card.Content>
						<p class="m-0 text-[0.86rem] leading-relaxed text-foreground-muted">
							Currently on the Team plan. 12 of 25 seats used.
						</p>
					</Card.Content>
					<Card.Footer>
						<Button variant="outlined" size="sm">Cancel</Button>
						<Button size="sm">Save changes</Button>
					</Card.Footer>
				</Card.Root>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Card.Root>
  <Card.Header>
    <Card.Title>Account settings</Card.Title>
    <Card.Description>Manage how your workspace…</Card.Description>
  </Card.Header>
  <Card.Content>
    <p>Currently on the Team plan. 12 of 25 seats used.</p>
  </Card.Content>
  <Card.Footer>
    <Button variant="outlined" size="sm">Cancel</Button>
    <Button size="sm">Save changes</Button>
  </Card.Footer>
</Card.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection
		icon={Layers}
		title="Compositions"
		description="Cards work best when you only include the pieces you need. Header-only, content-only, or fully composed — Silk doesn't enforce a structure."
	>
		<Tabs.Root value="stat">
			<Tabs.List>
				<Tabs.Trigger value="stat">Stat card</Tabs.Trigger>
				<Tabs.Trigger value="empty">Empty state</Tabs.Trigger>
				<Tabs.Trigger value="form">Form section</Tabs.Trigger>
			</Tabs.List>

			<div class="mt-3 grid gap-3 md:grid-cols-2">
				<Tabs.Content value="stat" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-6"
					>
						<Card.Root class="w-full">
							<Card.Header>
								<Card.Description>Monthly revenue</Card.Description>
								<Card.Title class="text-[2rem]">$48,210</Card.Title>
							</Card.Header>
							<Card.Footer>
								<span class="text-[0.78rem] text-[var(--color-success)]">+12% vs last month</span>
							</Card.Footer>
						</Card.Root>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
							>{@html highlight(
								`<Card.Root>
  <Card.Header>
    <Card.Description>Monthly revenue</Card.Description>
    <Card.Title>$48,210</Card.Title>
  </Card.Header>
  <Card.Footer>
    <span>+12% vs last month</span>
  </Card.Footer>
</Card.Root>`,
								'svelte'
							)}</code
						></pre>
				</Tabs.Content>

				<Tabs.Content value="empty" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-6"
					>
						<Card.Root class="w-full">
							<Card.Content class="flex flex-col items-center gap-2 py-10 text-center">
								<Sparkles size={20} class="text-foreground-muted" />
								<p
									class="m-0 text-[0.94rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
								>
									No projects yet
								</p>
								<p class="m-0 text-[0.78rem] text-foreground-muted">
									Create your first project to see it here.
								</p>
								<Button size="sm" class="mt-2">New project</Button>
							</Card.Content>
						</Card.Root>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
							>{@html highlight(
								`<Card.Root>
  <Card.Content class="flex flex-col items-center gap-2 py-10">
    <Sparkles size={20} />
    <p>No projects yet</p>
    <p>Create your first project to see it here.</p>
    <Button size="sm">New project</Button>
  </Card.Content>
</Card.Root>`,
								'svelte'
							)}</code
						></pre>
				</Tabs.Content>

				<Tabs.Content value="form" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-6"
					>
						<Card.Root class="w-full">
							<Card.Header>
								<Card.Title>Notifications</Card.Title>
								<Card.Description>Decide where and when we ping you.</Card.Description>
							</Card.Header>
							<Card.Content>
								<p class="m-0 text-[0.84rem] text-foreground-muted">…form fields here…</p>
							</Card.Content>
							<Card.Footer>
								<Button size="sm">Save</Button>
							</Card.Footer>
						</Card.Root>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code
							>{@html highlight(
								`<Card.Root>
  <Card.Header>
    <Card.Title>Notifications</Card.Title>
    <Card.Description>Decide where and when…</Card.Description>
  </Card.Header>
  <Card.Content>…form fields…</Card.Content>
  <Card.Footer>
    <Button size="sm">Save</Button>
  </Card.Footer>
</Card.Root>`,
								'svelte'
							)}</code
						></pre>
				</Tabs.Content>
			</div>
		</Tabs.Root>
	</DocSection>

	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Card" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />
