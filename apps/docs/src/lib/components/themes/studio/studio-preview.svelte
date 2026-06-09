<script lang="ts">
	import { Badge } from '@silk/ui/components/badge';
	import { Button } from '@silk/ui/components/button';
	import { Input } from '@silk/ui/components/input';
	import { Switch } from '@silk/ui/components/switch';
	import { Checkbox } from '@silk/ui/components/checkbox';
	import { Skeleton } from '@silk/ui/components/skeleton';
	import * as Select from '@silk/ui/components/select';
	import * as Tabs from '@silk/ui/components/tabs';
	import * as Alert from '@silk/ui/components/alert';
	import * as Tooltip from '@silk/ui/components/tooltip';
	import * as Breadcrumb from '@silk/ui/components/breadcrumb';
	import * as Modal from '@silk/ui/components/modal';
	import * as Command from '@silk/ui/components/command';
	import { toast } from '@silk/ui/components/toast';
	import Send from '@lucide/svelte/icons/send';
	import Layers from '@lucide/svelte/icons/layers-3';
	import Bell from '@lucide/svelte/icons/bell';
	import Settings from '@lucide/svelte/icons/settings';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Users from '@lucide/svelte/icons/users';
	import Search from '@lucide/svelte/icons/search';
	import Plus from '@lucide/svelte/icons/plus';
	import Inbox from '@lucide/svelte/icons/inbox';
	import FileText from '@lucide/svelte/icons/file-text';
	import Pencil from '@lucide/svelte/icons/pencil';
	import Info from '@lucide/svelte/icons/info';
	import Slash from '@lucide/svelte/icons/slash';
	// ── Gallery-screen components (one+ per token group) ──────────────────
	import { Slider } from '@silk/ui/components/slider';
	import { Toggle } from '@silk/ui/components/toggle';
	import { Progress } from '@silk/ui/components/progress';
	import { Separator } from '@silk/ui/components/separator';
	import { Pagination } from '@silk/ui/components/pagination';
	import { Calendar } from '@silk/ui/components/calendar';
	import { Label } from '@silk/ui/components/label';
	import { Textarea } from '@silk/ui/components/textarea';
	import { Marquee } from '@silk/ui/components/marquee';
	import { ScrollArea } from '@silk/ui/components/scroll-area';
	import * as Card from '@silk/ui/components/card';
	import * as Accordion from '@silk/ui/components/accordion';
	import * as Collapsible from '@silk/ui/components/collapsible';
	import * as Avatar from '@silk/ui/components/avatar';
	import * as HoverCard from '@silk/ui/components/hover-card';
	import * as Popover from '@silk/ui/components/popover';
	import * as DropdownMenu from '@silk/ui/components/dropdown-menu';
	import * as ToggleGroup from '@silk/ui/components/toggle-group';
	import * as RadioGroup from '@silk/ui/components/radio-group';
	import * as AlertDialog from '@silk/ui/components/alert-dialog';

	// ── Playground demo state (local to the preview surface) ──────────────
	let playgroundTab = $state('overview');
	let pgInputName = $state('Aidan');
	let pgInputEmail = $state('aidan@silk-ui.dev');
	let pgNotifications = $state(true);
	let pgEmailDigest = $state(false);
	let pgTwoFactor = $state(true);
	let pgAcceptTerms = $state(true);
	let pgRole = $state('designer');
	let pgProgress = $state(64);

	let screenTab = $state('dashboard');
	// Gallery-screen interactive state
	let glToggle = $state(false);
	let glAlign = $state('left');
	let glSlider = $state(50);
	let glPlan = $state('pro');
	let glAccordion = $state('a1');
	let glPage = $state(2);
	let glCalendar = $state<Date | undefined>(new Date(2026, 4, 15));
	let glTextarea = $state('Silk themes cascade from a single source of truth.');
	let newProjectOpen = $state(false);
	let newProjectName = $state('');
	let newProjectTeam = $state('design');
	let selectedMailId = $state(1);

	const mailMessages = [
		{
			id: 1,
			sender: 'Maya Chen',
			initials: 'MC',
			subject: 'v2.5 release notes -- needs your review',
			preview:
				"I've put together the draft for v2.5. Could you take a look before EOD? I've flagged the breaking changes.",
			time: '10:42 AM',
			unread: true,
			tag: 'design'
		},
		{
			id: 2,
			sender: 'Leo Park',
			initials: 'LP',
			subject: 'Quick question about the migration',
			preview:
				"The codemod handles 90% of the cases but I'm seeing some edge cases around nested providers.",
			time: '9:18 AM',
			unread: true,
			tag: 'engineering'
		},
		{
			id: 3,
			sender: 'GitHub',
			initials: 'GH',
			subject: 'PR #482 has new comments',
			preview: 'Aidan opened a pull request: "refactor toolbar to use shared components".',
			time: 'Yesterday',
			unread: false,
			tag: 'system'
		},
		{
			id: 4,
			sender: 'Sofia Reyes',
			initials: 'SR',
			subject: 'Customer feedback digest -- week 18',
			preview:
				'12 new responses, NPS holding at 64. Top theme: people want dark mode in the dashboard.',
			time: 'Tue',
			unread: false,
			tag: 'product'
		},
		{
			id: 5,
			sender: 'Stripe',
			initials: 'St',
			subject: 'Your invoice is ready',
			preview: 'Invoice INV-00042 for $1,240.00 USD is ready to view.',
			time: 'Mon',
			unread: false,
			tag: 'billing'
		}
	];

	const screenOptions = [
		{ id: 'dashboard', label: 'Dashboard' },
		{ id: 'settings', label: 'Settings' },
		{ id: 'mail', label: 'Mail' },
		{ id: 'gallery', label: 'Gallery' }
	] as const;

	const tagToTone: Record<string, string> = {
		design: 'var(--color-info)',
		engineering: 'var(--color-success)',
		product: 'var(--color-warning)',
		billing: 'var(--color-destructive)',
		system: 'var(--color-foreground-muted)'
	};

	const selectedMail = $derived(
		mailMessages.find((m) => m.id === selectedMailId) ?? mailMessages[0]
	);

	function createProject() {
		const name = newProjectName.trim();
		if (!name) {
			toast({
				title: 'Project name required',
				description: 'Give your project a name before creating it.',
				duration: 2400,
				type: 'error'
			});
			return;
		}
		toast({
			title: 'Project created',
			description: `${name} is ready in ${newProjectTeam}.`,
			duration: 2400,
			type: 'success'
		});
		newProjectName = '';
		newProjectOpen = false;
	}
</script>

<main
	class="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)]"
>
	<!-- Scrollable canvas body — single continuous surface, sections divided by hairlines -->
	<div class="min-h-0 flex-1 overflow-y-auto">
		<div class="mx-auto w-full max-w-[860px]">
			<!-- ─── Page header ─── -->
			<header class="flex flex-col gap-3 border-b border-border/60 px-6 py-7 md:px-8">
				<Breadcrumb.Root class="[font-size:calc(var(--font-size-body,16px)*0.78)]">
					<Breadcrumb.Item href="/themes/studio">Home</Breadcrumb.Item>
					<Breadcrumb.Separator><Slash size={12} /></Breadcrumb.Separator>
					<Breadcrumb.Item href="/themes/studio">Workspace</Breadcrumb.Item>
					<Breadcrumb.Separator><Slash size={12} /></Breadcrumb.Separator>
					<Breadcrumb.Item>Playground</Breadcrumb.Item>
				</Breadcrumb.Root>

				<div class="flex items-start justify-between gap-3">
					<div class="flex items-center gap-3">
						<div class="flex -space-x-2">
							<span
								class="grid size-9 place-items-center rounded-full border-2 border-card bg-primary/15 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-primary"
								>AN</span
							>
							<span
								class="grid size-9 place-items-center rounded-full border-2 border-card bg-secondary [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
								>MC</span
							>
							<span
								class="grid size-9 place-items-center rounded-full border-2 border-card bg-secondary [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
								>LK</span
							>
							<span
								class="grid size-9 place-items-center rounded-full border-2 border-card bg-background [font-size:calc(var(--font-size-label,14px)*0.8)] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
								>+4</span
							>
						</div>
						<div>
							<h2
								class="m-0 [font-size:calc(var(--font-size-header,18px)*1.2)] [font-weight:var(--font-weight-header,500)] leading-tight [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Welcome back, {pgInputName}
							</h2>
							<p
								class="m-0 mt-0.5 [font-size:calc(var(--font-size-body,16px)*0.85)] text-foreground-muted"
							>
								Here's what's happening in your workspace today.
							</p>
						</div>
					</div>
					<div class="flex items-center gap-1.5">
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button variant="ghost" size="icon" aria-label="Inbox">
									<Inbox size={15} />
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>Inbox · 3 new</Tooltip.Content>
						</Tooltip.Root>

						<Command.Root>
							<Command.Trigger
								variant="outlined"
								size="sm"
								class="gap-1.5 [font-size:calc(var(--font-size-button,14px)*0.937)]"
								aria-label="Open command palette"
							>
								<Search size={13} />
								<span>Search</span>
							</Command.Trigger>
							<Command.Content>
								<Command.Search placeholder="Search projects, people, commands…" />
								<Command.Results>
									<Command.Group heading="Quick actions">
										<Command.Item
											name="new project create"
											callback={() => (newProjectOpen = true)}
										>
											<Plus class="text-foreground-muted" />
											<span>New project</span>
										</Command.Item>
										<Command.Item
											name="invite member team"
											callback={() =>
												toast({
													title: 'Invite sent',
													description: 'Email invitation queued.',
													duration: 2000,
													type: 'success'
												})}
										>
											<Users class="text-foreground-muted" />
											<span>Invite member</span>
										</Command.Item>
										<Command.Item
											name="open settings preferences"
											callback={() => (screenTab = 'settings')}
										>
											<Settings class="text-foreground-muted" />
											<span>Open settings</span>
										</Command.Item>
										<Command.Item name="open inbox mail" callback={() => (screenTab = 'mail')}>
											<Inbox class="text-foreground-muted" />
											<span>Open mail</span>
										</Command.Item>
									</Command.Group>
									<Command.Separator />
									<Command.Group heading="Navigation">
										{#each screenOptions as opt}
											<Command.Item
												name={`go to ${opt.label}`}
												callback={() => (screenTab = opt.id)}
											>
												<Layers class="text-foreground-muted" />
												<span>Go to {opt.label}</span>
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.Results>
							</Command.Content>
						</Command.Root>

						<Modal.Root bind:open={newProjectOpen}>
							<Modal.Trigger
								size="sm"
								class="gap-1.5 [font-size:calc(var(--font-size-button,14px)*0.937)]"
							>
								<Plus size={13} />
								New project
							</Modal.Trigger>
							<Modal.Content
								class="w-full max-w-[min(28rem,calc(100vw-2rem))] gap-0 overflow-hidden p-0"
							>
								<div class="flex shrink-0 items-start justify-between px-5 py-4">
									<div class="flex flex-col gap-1">
										<Modal.Title>Create a new project</Modal.Title>
										<Modal.Description>
											Give your project a name and pick the team it belongs to.
										</Modal.Description>
									</div>
									<Modal.Close
										variant="ghost"
										size="icon"
										class="size-8 shrink-0"
										aria-label="Close"
									>
										<svg
											viewBox="0 0 16 16"
											aria-hidden="true"
											class="size-3.5 fill-none stroke-current"
											stroke-width="1.5"
										>
											<path d="M3 3l10 10M13 3L3 13" stroke-linecap="round" />
										</svg>
									</Modal.Close>
								</div>
								<div class="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
									<Input
										label="Project name"
										variant="outlined"
										placeholder="e.g. Marketing site refresh"
										bind:value={newProjectName}
									/>
									<div class="flex flex-col gap-1.5">
										<span
											class="[font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
											>Team</span
										>
										<Select.Root value={newProjectTeam}>
											<Select.Trigger class="w-full" variant="outlined">
												{newProjectTeam.charAt(0).toUpperCase() + newProjectTeam.slice(1)}
											</Select.Trigger>
											<Select.Content>
												{#each [{ v: 'design', l: 'Design' }, { v: 'engineering', l: 'Engineering' }, { v: 'product', l: 'Product' }, { v: 'marketing', l: 'Marketing' }] as t}
													<Select.Item value={t.v} onclick={() => (newProjectTeam = t.v)}>
														{t.l}
													</Select.Item>
												{/each}
											</Select.Content>
										</Select.Root>
									</div>
								</div>
								<div class="flex shrink-0 items-center justify-end gap-2 px-5 py-3">
									<Modal.Close
										variant="ghost"
										size="sm"
										class="[font-size:calc(var(--font-size-button,14px)*0.914)]">Cancel</Modal.Close
									>
									<Modal.Confirm
										size="sm"
										class="[font-size:calc(var(--font-size-button,14px)*0.914)]"
										onclick={createProject}
									>
										<Plus size={13} />
										Create project
									</Modal.Confirm>
								</div>
							</Modal.Content>
						</Modal.Root>
					</div>
				</div>
			</header>

			<!-- ─── Screen tabs ─── -->
			<div
				class="flex items-center justify-between gap-3 border-b border-border/60 px-6 py-4 md:px-8"
			>
				<Tabs.Root bind:value={screenTab}>
					<Tabs.List>
						{#each screenOptions as opt}
							<Tabs.Trigger value={opt.id}>{opt.label}</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</Tabs.Root>
				<span
					class="[font-size:calc(var(--font-size-body,16px)*0.72)] text-foreground-muted max-md:hidden"
				>
					Swap example screens to preview your theme across surfaces.
				</span>
			</div>

			<div class="divide-y divide-border/60">
				{#if screenTab === 'dashboard'}
					<!-- ─── KPI strip ─── -->
					<section class="grid grid-cols-3 gap-3 px-6 py-7 md:px-8 max-sm:grid-cols-1">
						{#each [{ label: 'Revenue', value: '$48.2k', delta: '+12%' }, { label: 'Active users', value: '1,840', delta: '+8%' }, { label: 'Churn rate', value: '1.2%', delta: '−0.4%' }] as stat}
							<div class="flex flex-col gap-1">
								<p
									class="m-0 [font-size:calc(var(--font-size-body,16px)*0.78)] text-foreground-muted"
								>
									{stat.label}
								</p>
								<p
									class="m-0 [font-size:calc(var(--font-size-header,18px)*1.28)] [font-weight:var(--font-weight-header,500)] [letter-spacing:var(--tracking-header,-0.02em)]"
									style="font-family: var(--font-header);"
								>
									{stat.value}
								</p>
								<div class="mt-0.5 flex items-center gap-1.5">
									<span
										class="inline-flex items-center gap-0.5 rounded-full bg-[var(--color-success)]/12 px-1.5 py-0.5 [font-size:calc(var(--font-size-label,14px)*0.8)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-[var(--color-success)]"
									>
										<TrendingUp size={11} />
										{stat.delta}
									</span>
									<span
										class="[font-size:calc(var(--font-size-body,16px)*0.7)] text-foreground-muted"
										>vs last month</span
									>
								</div>
							</div>
						{/each}
					</section>

					<!-- ─── Tabs with sliding indicator (live) ─── -->
					<section class="flex flex-col gap-3 px-6 py-7 md:px-8">
						<div class="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
							<div>
								<p
									class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
								>
									Tabs
								</p>
								<p
									class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
									style="font-family: var(--font-header);"
								>
									Project activity
								</p>
							</div>
							<Tabs.Root bind:value={playgroundTab}>
								<Tabs.List>
									<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
									<Tabs.Trigger value="activity">Activity</Tabs.Trigger>
									<Tabs.Trigger value="files">Files</Tabs.Trigger>
								</Tabs.List>
							</Tabs.Root>
						</div>
						<div class="[font-size:calc(var(--font-size-body,16px)*0.86)] text-foreground-muted">
							{#if playgroundTab === 'overview'}
								<p class="m-0">
									<span class="text-foreground">All systems operational.</span> The pipeline finished
									in 42s with 0 regressions and a 99.4% cache hit rate.
								</p>
							{:else if playgroundTab === 'activity'}
								<div class="flex flex-col gap-2">
									{#each [{ who: 'Maya', what: 'merged main into release-2.5', when: '2m' }, { who: 'Aidan', what: 'opened PR #482 · refactor toolbar', when: '14m' }, { who: 'Leo', what: 'commented on issue #311', when: '1h' }] as item}
										<div class="flex items-center gap-2">
											<span class="size-1.5 rounded-full bg-[var(--color-info)]"></span>
											<span class="text-foreground">{item.who}</span>
											<span>{item.what}</span>
											<span class="ml-auto [font-size:calc(var(--font-size-body,16px)*0.7)]"
												>{item.when}</span
											>
										</div>
									{/each}
								</div>
							{:else}
								<div class="flex flex-col gap-2">
									{#each ['silk-ui-roadmap.md', 'design-tokens.json', 'brand-guidelines.fig'] as file}
										<div class="flex items-center gap-2">
											<FileText size={13} />
											<span class="text-foreground">{file}</span>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</section>

					<!-- ─── Form section ─── -->
					<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
						<div>
							<p
								class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
							>
								Form
							</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Account settings
							</p>
						</div>

						<div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
							<Input
								label="Full name"
								placeholder="Alex Johnson"
								variant="outlined"
								bind:value={pgInputName}
							/>
							<Input
								label="Email"
								type="email"
								placeholder="alex@company.com"
								variant="outlined"
								bind:value={pgInputEmail}
							/>
						</div>

						<div class="flex flex-col gap-1.5">
							<span
								class="[font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
								>Role</span
							>
							<Select.Root value={pgRole}>
								<Select.Trigger class="w-full" variant="outlined">
									{pgRole.charAt(0).toUpperCase() + pgRole.slice(1)}
								</Select.Trigger>
								<Select.Content>
									{#each [{ v: 'engineer', l: 'Engineer' }, { v: 'designer', l: 'Designer' }, { v: 'product', l: 'Product manager' }, { v: 'founder', l: 'Founder' }] as r}
										<Select.Item value={r.v} onclick={() => (pgRole = r.v)}>{r.l}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>

						<div
							class="flex flex-col divide-y divide-border/60 overflow-hidden rounded-[var(--radius-md)] border border-border"
						>
							<div class="flex items-center justify-between gap-3 px-3 py-2.5">
								<div class="flex items-center gap-2">
									<Bell size={14} class="text-foreground-muted" />
									<span class="[font-size:calc(var(--font-size-body,16px)*0.86)]"
										>Push notifications</span
									>
								</div>
								<Switch bind:switched={pgNotifications} aria-label="Toggle notifications" />
							</div>
							<div class="flex items-center justify-between gap-3 px-3 py-2.5">
								<div class="flex items-center gap-2">
									<FileText size={14} class="text-foreground-muted" />
									<span class="[font-size:calc(var(--font-size-body,16px)*0.86)]"
										>Weekly email digest</span
									>
								</div>
								<Switch bind:switched={pgEmailDigest} aria-label="Toggle email digest" />
							</div>
							<div class="flex items-center justify-between gap-3 px-3 py-2.5">
								<div class="flex items-center gap-2">
									<Settings size={14} class="text-foreground-muted" />
									<span class="[font-size:calc(var(--font-size-body,16px)*0.86)]"
										>Two-factor auth</span
									>
								</div>
								<Switch bind:switched={pgTwoFactor} aria-label="Toggle two-factor" />
							</div>
						</div>

						<Checkbox
							bind:checked={pgAcceptTerms}
							label="I agree to the terms of service"
							description="You can revoke access at any time from the settings page."
						/>

						<div class="flex items-center justify-end gap-2">
							<Button variant="ghost" size="sm">Cancel</Button>
							<Button size="sm">
								<Pencil size={13} />
								Save changes
							</Button>
						</div>
					</section>

					<!-- ─── Buttons + Badges showcase ─── -->
					<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
						<div>
							<p
								class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
							>
								Variants
							</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Buttons & badges
							</p>
						</div>

						<div class="flex flex-wrap items-center gap-2">
							<Button>Primary</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="outlined">Outlined</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="flat">Flat</Button>
							<Button variant="destructive">Destructive</Button>
						</div>
						<div class="flex flex-wrap items-center gap-2">
							<Button variant="success">Success</Button>
							<Button variant="warning">Warning</Button>
							<Button variant="error">Error</Button>
							<Button disabled>Disabled</Button>
							<Button size="sm">Small</Button>
							<Button size="lg">Large</Button>
						</div>

						<div class="flex flex-wrap items-center gap-1.5">
							<Badge>Primary</Badge>
							<Badge variant="secondary">Secondary</Badge>
							<Badge variant="outlined">Outlined</Badge>
							<Badge variant="flat">Flat</Badge>
							<Badge variant="ghost">Ghost</Badge>
							<Badge variant="destructive">Destructive</Badge>
							<Badge variant="alternate">Alternate</Badge>
						</div>
					</section>

					<!-- ─── Alerts ─── -->
					<section class="flex flex-col gap-3 px-6 py-7 md:px-8">
						<div>
							<p
								class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
							>
								Feedback
							</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Alerts
							</p>
						</div>
						<div class="grid grid-cols-2 gap-2.5 max-md:grid-cols-1">
							<Alert.Root variant="info">
								<Alert.Title>Heads up</Alert.Title>
								<Alert.Description>A new release just rolled out to staging.</Alert.Description>
							</Alert.Root>
							<Alert.Root variant="success">
								<Alert.Title>Saved</Alert.Title>
								<Alert.Description>Your changes are in good shape.</Alert.Description>
							</Alert.Root>
							<Alert.Root variant="warning">
								<Alert.Title>Almost out of credit</Alert.Title>
								<Alert.Description>Add a card before usage caps out.</Alert.Description>
							</Alert.Root>
							<Alert.Root variant="error">
								<Alert.Title>Build failed</Alert.Title>
								<Alert.Description>Type-check returned 4 errors.</Alert.Description>
							</Alert.Root>
						</div>
					</section>

					<!-- ─── Progress + Skeleton ─── -->
					<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
						<div>
							<p
								class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
							>
								Progress
							</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Storage usage
							</p>
						</div>

						<div class="flex flex-col gap-2.5">
							{#each [{ label: 'Documents', pct: pgProgress }, { label: 'Images', pct: 38 }, { label: 'Builds', pct: 12 }] as bar}
								<div>
									<div
										class="mb-1 flex items-center justify-between [font-size:calc(var(--font-size-body,16px)*0.78)]"
									>
										<span class="text-foreground-muted">{bar.label}</span>
										<span
											class="[font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
											>{bar.pct}%</span
										>
									</div>
									<div class="h-1.5 overflow-hidden rounded-full bg-secondary">
										<div
											class="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
											style="width:{bar.pct}%;"
										></div>
									</div>
								</div>
							{/each}
						</div>

						<div class="flex items-center gap-2">
							<Button
								size="sm"
								variant="outlined"
								onclick={() => (pgProgress = Math.max(0, pgProgress - 8))}>−</Button
							>
							<Button
								size="sm"
								variant="outlined"
								onclick={() => (pgProgress = Math.min(100, pgProgress + 8))}>+</Button
							>
							<span
								class="ml-2 [font-size:calc(var(--font-size-body,16px)*0.78)] text-foreground-muted"
								>Adjust documents</span
							>
						</div>

						<div class="flex flex-col gap-2 pt-1">
							<p
								class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
							>
								Skeleton
							</p>
							<Skeleton class="h-3 w-full" />
							<Skeleton class="h-3 w-[80%]" />
							<Skeleton class="h-3 w-[60%]" />
						</div>
					</section>

					<!-- ─── Notifications ─── -->
					<section class="flex flex-col gap-2 px-6 py-7 md:px-8">
						<div class="flex items-center justify-between">
							<div>
								<p
									class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
								>
									Activity
								</p>
								<p
									class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
									style="font-family: var(--font-header);"
								>
									Notifications
								</p>
							</div>
							<Badge
								variant="ghost"
								class="px-1.5 [font-size:calc(var(--font-size-badge,12px)*0.88)]">3 new</Badge
							>
						</div>
						<div class="flex flex-col">
							{#each [{ title: 'Deployment succeeded', desc: 'v2.4.1 is live in production', time: 'now', dot: 'var(--color-success)' }, { title: 'New team member', desc: 'Maya joined the workspace', time: '4m ago', dot: 'var(--color-info)' }, { title: 'Card expires soon', desc: 'Update your payment method', time: '1h ago', dot: 'var(--color-warning)' }, { title: 'Build failed', desc: 'Type-check returned 4 errors', time: 'yesterday', dot: 'var(--color-destructive)' }] as item}
								<div
									class="flex items-start gap-2.5 rounded-md px-1.5 py-2 transition-colors hover:bg-secondary/40"
								>
									<span
										class="mt-1.5 size-1.5 shrink-0 rounded-full"
										style={`background:${item.dot};`}
									></span>
									<div class="min-w-0 flex-1">
										<p
											class="m-0 truncate [font-size:calc(var(--font-size-label,14px)*0.96)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
										>
											{item.title}
										</p>
										<p
											class="m-0 mt-0.5 truncate [font-size:calc(var(--font-size-body,16px)*0.76)] text-foreground-muted"
										>
											{item.desc}
										</p>
									</div>
									<span
										class="shrink-0 [font-size:calc(var(--font-size-body,16px)*0.72)] text-foreground-muted"
										>{item.time}</span
									>
								</div>
							{/each}
						</div>
					</section>

					<!-- ─── Command teaser + Tooltip ─── -->
					<section class="flex flex-col gap-3 px-6 py-7 md:px-8">
						<div>
							<p
								class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
							>
								Command
							</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Quick actions
							</p>
						</div>

						<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border">
							<div class="flex items-center gap-2 border-b border-border px-3 py-2">
								<Search size={14} class="text-foreground-muted" />
								<span
									class="flex-1 [font-size:calc(var(--font-size-body,16px)*0.84)] text-foreground-muted"
									>Type a command…</span
								>
								<kbd
									class="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono [font-size:calc(var(--font-size-body,16px)*0.66)] text-foreground-muted"
									>⌘K</kbd
								>
							</div>
							<div class="flex flex-col p-1.5">
								{#each [{ icon: Plus, label: 'Create project' }, { icon: Users, label: 'Invite member' }, { icon: CreditCard, label: 'Upgrade plan' }, { icon: Settings, label: 'Open settings' }] as item}
									<Button
										variant="ghost"
										size="sm"
										class="w-full justify-start gap-2 [font-size:calc(var(--font-size-button,14px)*0.96)]"
									>
										<item.icon size={13} class="text-foreground-muted" />
										<span>{item.label}</span>
										<span
											class="ml-auto [font-size:calc(var(--font-size-body,16px)*0.7)] text-foreground-muted"
											>↵</span
										>
									</Button>
								{/each}
							</div>
						</div>

						<div class="flex items-center gap-2">
							<Tooltip.Root>
								<Tooltip.Trigger>
									<Button
										variant="outlined"
										size="sm"
										class="gap-1.5 [font-size:calc(var(--font-size-button,14px)*0.891)]"
									>
										<Info size={12} />
										<span>Hover me</span>
									</Button>
								</Tooltip.Trigger>
								<Tooltip.Content>This is a Silk tooltip.</Tooltip.Content>
							</Tooltip.Root>
							<span class="[font-size:calc(var(--font-size-body,16px)*0.76)] text-foreground-muted"
								>Tooltip uses the same motion preset</span
							>
						</div>
					</section>

					<!-- ─── Typography preview ─── -->
					<section class="flex flex-col gap-5 px-6 py-7 md:px-8">
						<div>
							<p
								class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
							>
								Typography
							</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Every role, live
							</p>
						</div>

						<!-- Header sample -->
						<div
							class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-4"
						>
							<div class="flex items-baseline justify-between gap-3">
								<span
									class="[font-size:calc(var(--font-size-label,14px)*0.754)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted"
									>Header</span
								>
								<span
									class="font-mono [font-size:calc(var(--font-size-body,16px)*0.62)] text-foreground-muted/70"
									>--font-header · --font-size-header · --font-weight-header · --tracking-header</span
								>
							</div>
							<h3
								class="m-0 [font-size:calc(var(--font-size-header,18px)*1.6)] leading-[1.05] [font-family:var(--font-header)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
							>
								Pack my box with five dozen liquor jugs.
							</h3>
							<p
								class="m-0 [font-size:var(--font-size-header,18px)] leading-tight [font-family:var(--font-header)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)] text-foreground-muted"
							>
								Sphinx of black quartz, judge my vow.
							</p>
						</div>

						<!-- Body sample -->
						<div
							class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-4"
						>
							<div class="flex items-baseline justify-between gap-3">
								<span
									class="[font-size:calc(var(--font-size-label,14px)*0.754)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted"
									>Body</span
								>
								<span
									class="font-mono [font-size:calc(var(--font-size-body,16px)*0.62)] text-foreground-muted/70"
									>--font-sans · --font-size-body · --font-weight-body · --tracking-body</span
								>
							</div>
							<p
								class="m-0 leading-relaxed [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground"
							>
								Silk uses the body role for prose, descriptions, and most paragraph copy. Switch
								fonts or tweak weights and tracking from the inspector — the change ripples through
								every body element in this preview and in your published theme.
								<a href="/docs/introduction" class="text-primary underline-offset-2 hover:underline"
									>Inline links</a
								> respect the primary token.
							</p>
							<p
								class="m-0 [font-size:calc(var(--font-size-body,16px)*0.86)] leading-relaxed [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)] text-foreground-muted"
							>
								Muted secondary text — used for descriptions and helper copy underneath fields.
							</p>
						</div>

						<!-- Label sample -->
						<div
							class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-4"
						>
							<div class="flex items-baseline justify-between gap-3">
								<span
									class="[font-size:calc(var(--font-size-label,14px)*0.754)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted"
									>Label</span
								>
								<span
									class="font-mono [font-size:calc(var(--font-size-body,16px)*0.62)] text-foreground-muted/70"
									>--font-size-label · --font-weight-label · --tracking-label</span
								>
							</div>
							<div class="flex flex-wrap items-center gap-x-5 gap-y-2">
								<span
									class="[font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
									>Field label</span
								>
								<span
									class="[font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
									>Section header</span
								>
								<span
									class="[font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted"
									>Eyebrow</span
								>
								<span
									class="rounded-full bg-secondary px-2 py-0.5 [font-size:var(--font-size-label,14px)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
									>Chip</span
								>
							</div>
						</div>

						<!-- Button + Badge sample -->
						<div class="grid grid-cols-2 gap-3 max-md:grid-cols-1">
							<div
								class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-4"
							>
								<div class="flex items-baseline justify-between gap-3">
									<span
										class="[font-size:calc(var(--font-size-label,14px)*0.754)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted"
										>Button</span
									>
									<span
										class="font-mono [font-size:calc(var(--font-size-body,16px)*0.62)] text-foreground-muted/70"
										>--font-size-button · --font-weight-button · --tracking-button</span
									>
								</div>
								<div class="flex flex-wrap items-center gap-2">
									<Button>Save changes</Button>
									<Button variant="outlined">Discard</Button>
									<Button variant="ghost">Cancel</Button>
								</div>
							</div>

							<div
								class="flex flex-col gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-4"
							>
								<div class="flex items-baseline justify-between gap-3">
									<span
										class="[font-size:calc(var(--font-size-label,14px)*0.754)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase text-foreground-muted"
										>Badge</span
									>
									<span
										class="font-mono [font-size:calc(var(--font-size-body,16px)*0.62)] text-foreground-muted/70"
										>--font-size-badge · --font-weight-badge · --tracking-badge</span
									>
								</div>
								<div class="flex flex-wrap items-center gap-1.5">
									<Badge>Live</Badge>
									<Badge variant="secondary">Draft</Badge>
									<Badge variant="outlined">Beta</Badge>
									<Badge variant="ghost">v1.0</Badge>
								</div>
							</div>
						</div>

						<!-- Mono fallback -->
						<p
							class="m-0 font-mono [font-size:calc(var(--font-size-body,16px)*0.82)] text-foreground-muted"
						>
							const tokens = $derived(themeToCss(draft));
						</p>
					</section>
				{:else if screenTab === 'settings'}
					<!-- ─── Settings: General ─── -->
					<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
						<div>
							<p
								class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
							>
								General
							</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Profile
							</p>
						</div>
						<div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
							<Input label="Display name" variant="outlined" bind:value={pgInputName} />
							<Input label="Email" type="email" variant="outlined" bind:value={pgInputEmail} />
						</div>
						<div class="flex flex-col gap-1.5">
							<span
								class="[font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
								>Default role</span
							>
							<Select.Root value={pgRole}>
								<Select.Trigger class="w-full" variant="outlined">
									{pgRole.charAt(0).toUpperCase() + pgRole.slice(1)}
								</Select.Trigger>
								<Select.Content>
									{#each [{ v: 'engineer', l: 'Engineer' }, { v: 'designer', l: 'Designer' }, { v: 'product', l: 'Product manager' }, { v: 'founder', l: 'Founder' }] as r}
										<Select.Item value={r.v} onclick={() => (pgRole = r.v)}>{r.l}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
					</section>

					<!-- ─── Settings: Preferences ─── -->
					<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
						<div>
							<p
								class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
							>
								Preferences
							</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Notifications & security
							</p>
						</div>
						<div
							class="flex flex-col divide-y divide-border/60 overflow-hidden rounded-[var(--radius-md)] border border-border"
						>
							<div class="flex items-center justify-between gap-3 px-3 py-2.5">
								<div class="flex items-center gap-2">
									<Bell size={14} class="text-foreground-muted" />
									<div class="flex flex-col">
										<span class="[font-size:calc(var(--font-size-body,16px)*0.86)]"
											>Push notifications</span
										>
										<span
											class="[font-size:calc(var(--font-size-body,16px)*0.72)] text-foreground-muted"
											>Get notified about mentions and replies.</span
										>
									</div>
								</div>
								<Switch bind:switched={pgNotifications} aria-label="Toggle notifications" />
							</div>
							<div class="flex items-center justify-between gap-3 px-3 py-2.5">
								<div class="flex items-center gap-2">
									<FileText size={14} class="text-foreground-muted" />
									<div class="flex flex-col">
										<span class="[font-size:calc(var(--font-size-body,16px)*0.86)]"
											>Weekly email digest</span
										>
										<span
											class="[font-size:calc(var(--font-size-body,16px)*0.72)] text-foreground-muted"
											>A Monday summary of activity in your workspace.</span
										>
									</div>
								</div>
								<Switch bind:switched={pgEmailDigest} aria-label="Toggle email digest" />
							</div>
							<div class="flex items-center justify-between gap-3 px-3 py-2.5">
								<div class="flex items-center gap-2">
									<Settings size={14} class="text-foreground-muted" />
									<div class="flex flex-col">
										<span class="[font-size:calc(var(--font-size-body,16px)*0.86)]"
											>Two-factor auth</span
										>
										<span
											class="[font-size:calc(var(--font-size-body,16px)*0.72)] text-foreground-muted"
											>Add an extra layer of sign-in security.</span
										>
									</div>
								</div>
								<Switch bind:switched={pgTwoFactor} aria-label="Toggle two-factor" />
							</div>
						</div>
						<Checkbox
							bind:checked={pgAcceptTerms}
							label="I agree to the terms of service"
							description="You can revoke access at any time from the settings page."
						/>
						<div class="flex items-center justify-end gap-2">
							<Button variant="ghost" size="sm">Cancel</Button>
							<Button size="sm">
								<Pencil size={13} />
								Save changes
							</Button>
						</div>
					</section>

					<!-- ─── Settings: Danger zone ─── -->
					<section class="flex flex-col gap-3 px-6 py-7 md:px-8">
						<div>
							<p
								class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
							>
								Danger zone
							</p>
							<p
								class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Workspace lifecycle
							</p>
						</div>
						<Alert.Root variant="warning">
							<Alert.Title>Archive workspace</Alert.Title>
							<Alert.Description>
								Members lose access until you unarchive. You can do this at any time.
							</Alert.Description>
						</Alert.Root>
						<Alert.Root variant="error">
							<Alert.Title>Delete workspace</Alert.Title>
							<Alert.Description>
								Permanent — your projects, comments, and data will be removed.
							</Alert.Description>
						</Alert.Root>
						<div class="flex items-center justify-end gap-2">
							<Button variant="outlined" size="sm">Archive</Button>
							<Button variant="destructive" size="sm">Delete workspace</Button>
						</div>
					</section>
				{:else if screenTab === 'mail'}
					<!-- ─── Mail: Inbox list ─── -->
					<section class="flex flex-col gap-3 px-6 py-7 md:px-8">
						<div class="flex items-center justify-between">
							<div>
								<p
									class="m-0 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
								>
									Inbox
								</p>
								<p
									class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
									style="font-family: var(--font-header);"
								>
									{mailMessages.filter((m) => m.unread).length} unread
								</p>
							</div>
							<Badge variant="outlined" class="[font-size:calc(var(--font-size-badge,12px)*0.933)]"
								>5 messages</Badge
							>
						</div>
						<div
							class="flex flex-col divide-y divide-border/60 overflow-hidden rounded-[var(--radius-md)] border border-border"
						>
							{#each mailMessages as msg}
								{@const active = msg.id === selectedMailId}
								<button
									type="button"
									onclick={() => (selectedMailId = msg.id)}
									class={`flex items-start gap-3 px-3 py-3 text-left transition-colors ${active ? 'bg-secondary/60' : 'hover:bg-secondary/40'}`}
								>
									<span
										class="grid size-9 shrink-0 place-items-center rounded-full bg-secondary [font-size:calc(var(--font-size-label,14px)*0.846)] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
										>{msg.initials}</span
									>
									<div class="min-w-0 flex-1">
										<div class="flex items-center justify-between gap-2">
											<span
												class="truncate [font-size:calc(var(--font-size-label,14px)*0.96)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
												>{msg.sender}</span
											>
											<span
												class="shrink-0 [font-size:calc(var(--font-size-body,16px)*0.7)] text-foreground-muted"
												>{msg.time}</span
											>
										</div>
										<p class="m-0 mt-0.5 truncate [font-size:calc(var(--font-size-body,16px)*0.8)]">
											{msg.subject}
										</p>
										<p
											class="m-0 mt-0.5 truncate [font-size:calc(var(--font-size-body,16px)*0.74)] text-foreground-muted"
										>
											{msg.preview}
										</p>
									</div>
									{#if msg.unread}
										<span
											class="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
											aria-label="Unread"
										></span>
									{/if}
								</button>
							{/each}
						</div>
					</section>

					<!-- ─── Mail: Open message ─── -->
					<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
						<div class="flex items-start justify-between gap-3">
							<div class="flex items-center gap-3">
								<span
									class="grid size-10 place-items-center rounded-full bg-primary/12 [font-size:calc(var(--font-size-label,14px)*0.891)] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-primary"
									>{selectedMail.initials}</span
								>
								<div>
									<p
										class="m-0 [font-size:calc(var(--font-size-label,14px)*1.051)] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
									>
										{selectedMail.sender}
									</p>
									<p
										class="m-0 mt-0.5 [font-size:calc(var(--font-size-body,16px)*0.74)] text-foreground-muted"
									>
										to me · {selectedMail.time}
									</p>
								</div>
							</div>
							<div class="flex items-center gap-1.5">
								<span
									class="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 [font-size:calc(var(--font-size-body,16px)*0.68)] text-foreground-muted"
								>
									<span
										class="size-1.5 rounded-full"
										style={`background:${tagToTone[selectedMail.tag] ?? 'var(--color-foreground-muted)'};`}
									></span>
									{selectedMail.tag}
								</span>
							</div>
						</div>
						<h3
							class="m-0 [font-size:calc(var(--font-size-header,18px)*0.96)] [font-weight:var(--font-weight-header,500)] leading-tight [letter-spacing:var(--tracking-header,-0.02em)]"
							style="font-family: var(--font-header);"
						>
							{selectedMail.subject}
						</h3>
						<p
							class="m-0 [font-size:calc(var(--font-size-body,16px)*0.92)] leading-relaxed text-foreground"
						>
							{selectedMail.preview}
						</p>
						<p
							class="m-0 [font-size:calc(var(--font-size-body,16px)*0.86)] leading-relaxed text-foreground-muted"
						>
							Reply if you have any questions. Otherwise this thread will close automatically in 7
							days.
						</p>
						<div class="flex flex-wrap items-center gap-2">
							<Button size="sm">
								<Send size={13} />
								Reply
							</Button>
							<Button variant="outlined" size="sm">Forward</Button>
							<Button variant="ghost" size="sm">Mark unread</Button>
							<Button variant="ghost" size="sm" class="text-[var(--color-destructive)]">
								Delete
							</Button>
						</div>
					</section>
				{:else if screenTab === 'gallery'}
					<!-- ─── Gallery: a representative component from every token group ─── -->
					{#snippet groupLabel(text: string)}
						<p
							class="[font-size:calc(var(--font-size-label,14px)*0.754)] [font-weight:var(--font-weight-label,600)] [letter-spacing:0.08em] uppercase text-foreground-muted"
						>
							{text}
						</p>
					{/snippet}

					<!-- CONTROLS -->
					<section data-group="controls" class="flex flex-col gap-4 px-6 py-7 md:px-8">
						{@render groupLabel('Controls')}
						<div class="flex flex-wrap items-center gap-2">
							<Toggle bind:pressed={glToggle}>{glToggle ? 'On' : 'Off'}</Toggle>
							<ToggleGroup.Root type="single" bind:value={glAlign}>
								<ToggleGroup.Item value="left">Left</ToggleGroup.Item>
								<ToggleGroup.Item value="center">Center</ToggleGroup.Item>
								<ToggleGroup.Item value="right">Right</ToggleGroup.Item>
							</ToggleGroup.Root>
						</div>
						<div class="flex flex-col gap-1.5">
							<Label>Volume — {glSlider}%</Label>
							<Slider bind:value={glSlider} min={0} max={100} label="Volume" />
						</div>
						<div class="flex flex-col gap-1.5">
							<Label>Notes</Label>
							<Textarea bind:value={glTextarea} />
						</div>
						<RadioGroup.Root bind:value={glPlan} name="gallery-plan">
							<RadioGroup.Item value="free" label="Free" description="For solo hobby projects." />
							<RadioGroup.Item value="pro" label="Pro" description="For growing teams." />
							<RadioGroup.Item value="team" label="Team" description="For whole orgs." />
						</RadioGroup.Root>
					</section>

					<!-- SURFACES -->
					<section
						data-group="surfaces"
						class="flex flex-col gap-4 border-t border-border/60 px-6 py-7 md:px-8"
					>
						{@render groupLabel('Surfaces')}
						<Card.Root>
							<Card.Header>
								<Card.Title>Card surface</Card.Title>
								<Card.Description
									>Padding, radius, and elevation all read from tokens.</Card.Description
								>
							</Card.Header>
							<Card.Content>
								<p class="[font-size:calc(var(--font-size-body,16px)*0.85)] text-foreground-muted">
									Cards, panels, sheets, and accordions share the Surfaces token group.
								</p>
							</Card.Content>
						</Card.Root>
						<Accordion.Root type="single" bind:value={glAccordion}>
							<Accordion.Item value="a1">
								<Accordion.Trigger>What is a token group?</Accordion.Trigger>
								<Accordion.Content
									>A coherent bundle of tokens shared by related components.</Accordion.Content
								>
							</Accordion.Item>
							<Accordion.Item value="a2">
								<Accordion.Trigger>Does it theme live?</Accordion.Trigger>
								<Accordion.Content
									>Yes — every value here cascades from the active theme.</Accordion.Content
								>
							</Accordion.Item>
						</Accordion.Root>
						<Collapsible.Root>
							<Collapsible.Trigger>Toggle details</Collapsible.Trigger>
							<Collapsible.Content>
								<p
									class="pt-2 [font-size:calc(var(--font-size-body,16px)*0.85)] text-foreground-muted"
								>
									Collapsible content surface.
								</p>
							</Collapsible.Content>
						</Collapsible.Root>
						<Separator />
						<ScrollArea
							class="h-24 w-full rounded-[var(--radius-md)] border border-border bg-background p-3"
						>
							<p class="[font-size:calc(var(--font-size-body,16px)*0.85)] text-foreground-muted">
								Scroll region. Pellentesque habitant morbi tristique senectus et netus et malesuada
								fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
								tempor sit amet, ante. Donec eu libero sit amet quam egestas semper.
							</p>
						</ScrollArea>
					</section>

					<!-- MENUS -->
					<section
						data-group="menus"
						class="flex flex-wrap items-center gap-2 border-t border-border/60 px-6 py-7 md:px-8"
					>
						{@render groupLabel('Menus')}
						<div class="flex w-full flex-wrap items-center gap-2">
							<DropdownMenu.Root>
								<DropdownMenu.Trigger variant="outlined" size="sm">Dropdown</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Label>Sort by</DropdownMenu.Label>
									<DropdownMenu.Item><span>Recently updated</span></DropdownMenu.Item>
									<DropdownMenu.Item><span>Alphabetical</span></DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item><span>Archived</span></DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
							<Popover.Root placement="bottom">
								<Popover.Trigger variant="outlined" size="sm">Popover</Popover.Trigger>
								<Popover.Content class="w-64">
									<Popover.Title>Floating panel</Popover.Title>
									<p
										class="[font-size:calc(var(--font-size-body,16px)*0.85)] text-foreground-muted"
									>
										Menus are button-anchored floating surfaces.
									</p>
								</Popover.Content>
							</Popover.Root>
						</div>
					</section>

					<!-- MODALS + TRANSIENT -->
					<section
						data-group="modals"
						class="flex flex-wrap items-center gap-2 border-t border-border/60 px-6 py-7 md:px-8"
					>
						{@render groupLabel('Modals & transient')}
						<AlertDialog.Root>
							<AlertDialog.Trigger variant="outlined">Alert dialog</AlertDialog.Trigger>
							<AlertDialog.Content>
								<AlertDialog.Header>
									<AlertDialog.Title>Delete this project?</AlertDialog.Title>
									<AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
								</AlertDialog.Header>
								<AlertDialog.Footer>
									<AlertDialog.Exit>Cancel</AlertDialog.Exit>
									<AlertDialog.Confirm>Delete</AlertDialog.Confirm>
								</AlertDialog.Footer>
							</AlertDialog.Content>
						</AlertDialog.Root>
						<HoverCard.Root>
							<HoverCard.Trigger>
								<Button variant="outlined" size="sm">Hover card</Button>
							</HoverCard.Trigger>
							<HoverCard.Content class="w-64">
								<HoverCard.Title>Transient surface</HoverCard.Title>
								<HoverCard.Description
									>Ephemeral feedback like tooltips and toasts.</HoverCard.Description
								>
							</HoverCard.Content>
						</HoverCard.Root>
						<Button
							variant="secondary"
							size="sm"
							onclick={() =>
								toast({
									title: 'Toast fired',
									description: 'Transient feedback.',
									type: 'success',
									duration: 2400
								})}
						>
							Fire toast
						</Button>
					</section>

					<!-- NAV / DATA -->
					<section
						data-group="nav"
						class="flex flex-col gap-4 border-t border-border/60 px-6 py-7 md:px-8"
					>
						{@render groupLabel('Navigation & data')}
						<div class="flex items-center gap-2">
							<Avatar.Root size="sm"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
							<Avatar.Root size="md"><Avatar.Fallback>MC</Avatar.Fallback></Avatar.Root>
							<Avatar.Root size="lg" shape="square"
								><Avatar.Fallback>LP</Avatar.Fallback></Avatar.Root
							>
						</div>
						<Progress value={glSlider} />
						<Pagination bind:page={glPage} total={20} />
						<Calendar bind:value={glCalendar} />
						<Marquee
							pauseOnHover
							duration="22s"
							class="rounded-[var(--radius-md)] border border-border py-3"
						>
							<span
								class="px-4 [font-size:calc(var(--font-size-body,16px)*0.85)] text-foreground-muted"
								>Silk · extreme customizability ·</span
							>
							<span
								class="px-4 [font-size:calc(var(--font-size-body,16px)*0.85)] text-foreground-muted"
								>every token, one source ·</span
							>
						</Marquee>
					</section>
				{/if}
			</div>
		</div>
	</div>
</main>
