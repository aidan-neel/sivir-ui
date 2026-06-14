<script lang="ts">
	import { highlight } from '$lib/highlight';
	import * as Tabs from '@silk/ui/components/tabs';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Hash from '@lucide/svelte/icons/hash';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Users from '@lucide/svelte/icons/users';
	import FileText from '@lucide/svelte/icons/file-text';
	import { Badge as BadgeComp } from '@silk/ui/components/badge';

	let billingPeriod = $state('monthly');
	let settingsTab = $state('general');
	let projectTab = $state('overview');

	const TITLE = 'Tabs';
	const SLUG = 'tabs';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	let pgTab = $state('overview');

	const apiRows = [
		{
			component: 'Root',
			prop: 'value',
			type: 'string',
			default: '--',
			description: 'Bindable active tab.'
		},
		{
			component: 'Root',
			prop: 'orientation',
			type: '"horizontal" | "vertical"',
			default: '"horizontal"',
			description: 'Keyboard navigation direction.'
		},
		{
			component: 'List',
			prop: 'children',
			type: 'Snippet',
			default: '--',
			description: 'Container for Trigger elements. Renders the sliding indicator.'
		},
		{
			component: 'Trigger',
			prop: 'value',
			type: 'string',
			default: '--',
			description: 'Identifies the tab. Matches Root.value when active.'
		},
		{
			component: 'Content',
			prop: 'value',
			type: 'string',
			default: '--',
			description: 'The panel shown when this value matches Root.value.'
		}
	];
</script>

<svelte:head>
	<title>Silk · Tabs</title>
	<meta
		name="description"
		content="Switch between mutually-exclusive views with a sliding indicator."
	/>
</svelte:head>

<DocHeader
	title={TITLE}
	description="A peer-level switcher for views that share a context. The sliding indicator's speed comes from your theme's motion preset — change the preset, the tabs follow."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Sliding indicator' }]}
/>

<section class="pt-10">
	<div class="relative">
		<div
			class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"
		></div>
		<div
			class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
		>
			<div
				class="flex min-h-[12rem] flex-col items-center justify-center gap-4 border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<Tabs.Root bind:value={pgTab}>
					<Tabs.List>
						<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
						<Tabs.Trigger value="activity">Activity</Tabs.Trigger>
						<Tabs.Trigger value="files">Files</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
				<p class="m-0 text-center text-[0.84rem] text-foreground-muted">
					Active: <code class="font-mono text-foreground">{pgTab}</code>
				</p>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Tabs.Root bind:value={tab}>
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
    <Tabs.Trigger value="files">Files</Tabs.Trigger>
  </Tabs.List>

  <Tabs.Content value="overview">…</Tabs.Content>
  <Tabs.Content value="activity">…</Tabs.Content>
  <Tabs.Content value="files">…</Tabs.Content>
</Tabs.Root>`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection
		icon={Sparkles}
		title="Real-world examples"
		description="Three patterns where Tabs earn their keep."
	>
		<!-- Project tabs -->
		<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5">
			<div class="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
				<div>
					<p
						class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
					>
						Project activity
					</p>
					<p
						class="m-0 mt-0.5 text-[1.05rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
						style="font-family: var(--font-header);"
					>
						silk-ui / dashboard
					</p>
				</div>
				<Tabs.Root bind:value={projectTab}>
					<Tabs.List>
						<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
						<Tabs.Trigger value="activity">Activity</Tabs.Trigger>
						<Tabs.Trigger value="files">Files</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
			</div>
			<div class="text-[0.86rem] text-foreground-muted">
				{#if projectTab === 'overview'}
					<div class="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
						{#each [{ label: 'Open issues', value: '23', tone: 'text-[var(--color-warning)]' }, { label: 'Merged this week', value: '47', tone: 'text-[var(--color-success)]' }, { label: 'Build status', value: 'Passing', tone: 'text-[var(--color-success)]' }] as stat}
							<div class="rounded-[var(--radius-md)] border border-border bg-background/40 p-3">
								<p class="m-0 text-[0.7rem] text-foreground-muted">{stat.label}</p>
								<p
									class="m-0 mt-1 text-[1.4rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] tracking-tight {stat.tone}"
								>
									{stat.value}
								</p>
							</div>
						{/each}
					</div>
				{:else if projectTab === 'activity'}
					<div class="flex flex-col gap-2">
						{#each [{ who: 'Maya Chen', what: 'merged main into release-2.5', when: '2m' }, { who: 'Aidan Neel', what: 'opened PR #482 · refactor toolbar', when: '14m' }, { who: 'Leo Park', what: 'commented on issue #311', when: '1h' }, { who: 'GitHub Actions', what: 'deployed v2.4.1 to production', when: '3h' }] as item}
							<div class="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-secondary/40">
								<TrendingUp size={13} class="text-foreground-muted" />
								<span class="text-foreground">{item.who}</span>
								<span class="text-foreground-muted">{item.what}</span>
								<span class="ml-auto text-[0.72rem] text-foreground-muted/70">{item.when}</span>
							</div>
						{/each}
					</div>
				{:else}
					<div class="flex flex-col gap-2">
						{#each [{ name: 'silk-ui-roadmap.md', size: '12 KB' }, { name: 'design-tokens.json', size: '4.8 KB' }, { name: 'brand-guidelines.fig', size: '4.2 MB' }, { name: 'icons.svg', size: '88 KB' }] as file}
							<div class="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-secondary/40">
								<FileText size={13} class="text-foreground-muted" />
								<span class="text-foreground">{file.name}</span>
								<span class="ml-auto text-[0.72rem] text-foreground-muted/70">{file.size}</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Billing period -->
		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5">
				<p
					class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
				>
					Billing period
				</p>
				<Tabs.Root bind:value={billingPeriod}>
					<Tabs.List>
						<Tabs.Trigger value="monthly">Monthly</Tabs.Trigger>
						<Tabs.Trigger value="annual">Annual (-20%)</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
				<div class="flex items-baseline gap-1.5">
					<span
						class="text-[2.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
						style="font-family: var(--font-header);"
					>
						{billingPeriod === 'monthly' ? '$24' : '$19'}
					</span>
					<span class="text-[0.86rem] text-foreground-muted">/seat/month</span>
				</div>
				<p class="m-0 text-[0.8rem] text-foreground-muted">
					{billingPeriod === 'monthly'
						? 'Billed monthly. Cancel anytime.'
						: 'Billed annually. Save $60 per seat per year.'}
				</p>
			</div>

			<!-- Settings -->
			<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5">
				<p
					class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
				>
					Settings
				</p>
				<Tabs.Root bind:value={settingsTab}>
					<Tabs.List>
						<Tabs.Trigger value="general">General</Tabs.Trigger>
						<Tabs.Trigger value="members">Members</Tabs.Trigger>
						<Tabs.Trigger value="api">API</Tabs.Trigger>
					</Tabs.List>
				</Tabs.Root>
				<div class="text-[0.84rem] text-foreground-muted">
					{#if settingsTab === 'general'}
						Workspace name, time zone, default language. Most teams set this once and forget.
					{:else if settingsTab === 'members'}
						<div class="flex items-center gap-2">
							<Users size={13} />
							<span>12 members · 3 admins</span>
							<BadgeComp variant="ghost" class="ml-auto text-[0.66rem]">2 pending</BadgeComp>
						</div>
					{:else}
						Generate API keys, configure webhooks, rotate the signing secret.
					{/if}
				</div>
			</div>
		</div>
	</DocSection>

	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} namespace="Tabs" />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />
