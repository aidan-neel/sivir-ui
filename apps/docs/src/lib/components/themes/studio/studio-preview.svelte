<script lang="ts">
	import { resolve } from '$app/paths';
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
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import TrendingDown from '@lucide/svelte/icons/trending-down';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Lock from '@lucide/svelte/icons/lock';
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

	// Which reference screen to render — driven by the toolbar's "Select preview"
	// tabs in the studio page. `onpreview` lets in-canvas affordances (the command
	// palette) request a screen change back up to the parent.
	let {
		preview = 'components',
		onpreview
	}: { preview?: string; onpreview?: (id: string) => void } = $props();

	// ── Playground demo state (local to the preview surface) ──────────────
	let playgroundTab = $state('overview');
	// Login screen demo state
	let loginEmail = $state('you@company.com');
	let loginPassword = $state('');
	let loginRemember = $state(true);
	let pgInputName = $state('Aidan');
	let pgInputEmail = $state('aidan@silk-ui.dev');
	let pgNotifications = $state(true);
	let pgEmailDigest = $state(false);
	let pgTwoFactor = $state(true);
	let pgAcceptTerms = $state(true);
	let pgRole = $state('designer');
	let pgProgress = $state(64);

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
		{ id: 'components', label: 'Components' },
		{ id: 'dashboard', label: 'Dashboard' },
		{ id: 'settings', label: 'Settings' },
		{ id: 'login', label: 'Login' },
		{ id: 'mail', label: 'Mail' }
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

	// Per-screen chrome heading (the app-bar title for non-login screens).
	const chromeMeta = $derived(
		(
			{
				components: { eyebrow: 'Library', title: 'Components' },
				dashboard: { eyebrow: 'Overview', title: `Welcome back, ${pgInputName}` },
				settings: { eyebrow: 'Account', title: 'Settings' },
				mail: { eyebrow: 'Inbox', title: `${mailMessages.filter((m) => m.unread).length} unread` }
			} as Record<string, { eyebrow: string; title: string }>
		)[preview] ?? { eyebrow: 'Library', title: 'Components' }
	);

	// Dashboard demo data
	const kpis = [
		{ label: 'Revenue', value: '$48.2k', delta: '+12%', up: true },
		{ label: 'Active users', value: '1,840', delta: '+8%', up: true },
		{ label: 'Churn rate', value: '1.2%', delta: '−0.4%', up: false }
	];
	const chartBars = [42, 58, 49, 71, 63, 88, 76, 95, 82, 64, 90, 78];
	const tableRows = [
		{
			name: 'Marketing site refresh',
			owner: 'Maya Chen',
			status: 'Live',
			tone: 'var(--color-success)'
		},
		{
			name: 'Mobile onboarding',
			owner: 'Leo Park',
			status: 'In review',
			tone: 'var(--color-info)'
		},
		{
			name: 'Billing migration',
			owner: 'Sofia Reyes',
			status: 'Blocked',
			tone: 'var(--color-warning)'
		},
		{
			name: 'Design tokens v3',
			owner: 'Aidan Neel',
			status: 'Draft',
			tone: 'var(--color-foreground-muted)'
		}
	];

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

{#snippet sectionHead(eyebrow: string, title: string)}
	<div>
		<p
			class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
		>
			{eyebrow}
		</p>
		<p
			class="m-0 mt-0.5 [font-size:var(--font-size-header,18px)] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
			style="font-family: var(--font-header);"
		>
			{title}
		</p>
	</div>
{/snippet}

{#snippet groupLabel(text: string)}
	<p
		class="text-[0.66rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:0.08em] uppercase text-foreground-muted"
	>
		{text}
	</p>
{/snippet}

<!-- A bordered "tile" wrapping a single component demo for the Components grid. -->
{#snippet tile(label: string, children: import('svelte').Snippet)}
	<div
		class="flex flex-col gap-3 rounded-[var(--radius-md)] border border-border bg-background/40 p-4"
	>
		{@render groupLabel(label)}
		{@render children()}
	</div>
{/snippet}

<main class="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
	{#if preview === 'login'}
		<!-- ─────────────────────────── LOGIN ─────────────────────────── -->
		<div class="min-h-0 flex-1 overflow-y-auto">
			<div class="flex min-h-full flex-col lg:flex-row">
				<!-- Form half -->
				<div class="flex flex-1 items-center justify-center px-6 py-12 md:px-10">
					<div class="flex w-full max-w-[26rem] flex-col gap-7">
						<div class="flex flex-col gap-2">
							<span
								class="grid size-10 place-items-center rounded-[var(--radius-md)] bg-primary text-foreground-opposite shadow-[inset_0_1px_0_rgb(255_255_255_/_0.15)]"
								aria-hidden="true"
							>
								<Layers size={18} />
							</span>
							<h2
								class="m-0 mt-1.5 text-[1.7rem] leading-tight [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								Welcome back
							</h2>
							<p class="m-0 text-[0.9rem] text-foreground-muted">
								Sign in to your Silk workspace to continue.
							</p>
						</div>

						<form class="flex flex-col gap-4" onsubmit={(e) => e.preventDefault()}>
							<div class="flex flex-col gap-1.5">
								<Label for="login-email">Email</Label>
								<Input
									id="login-email"
									type="email"
									variant="outlined"
									placeholder="you@company.com"
									bind:value={loginEmail}
								/>
							</div>
							<div class="flex flex-col gap-1.5">
								<div class="flex items-center justify-between">
									<Label for="login-password">Password</Label>
									<a
										href={resolve('/themes/studio')}
										class="text-[0.78rem] text-primary underline-offset-2 hover:underline"
									>
										Forgot password?
									</a>
								</div>
								<div class="relative">
									<Lock
										size={15}
										class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted"
									/>
									<Input
										id="login-password"
										type="password"
										variant="outlined"
										placeholder="••••••••"
										class="pl-9"
										bind:value={loginPassword}
									/>
								</div>
							</div>

							<Checkbox bind:checked={loginRemember} label="Remember me for 30 days" />

							<Button
								class="w-full gap-1.5"
								onclick={() =>
									toast({
										title: 'Signed in',
										description: `Welcome back, ${loginEmail}.`,
										type: 'success',
										duration: 2200
									})}
							>
								Sign in
								<ArrowRight size={15} />
							</Button>
						</form>

						<div class="flex items-center gap-3">
							<span class="h-px flex-1 bg-border"></span>
							<span class="text-[0.74rem] text-foreground-muted">or continue with</span>
							<span class="h-px flex-1 bg-border"></span>
						</div>

						<div class="grid grid-cols-2 gap-2.5">
							<Button variant="outlined" class="gap-2 border-border">
								<svg viewBox="0 0 48 48" class="size-4" aria-hidden="true">
									<path
										fill="#FFC107"
										d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
									/>
									<path
										fill="#FF3D00"
										d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
									/>
									<path
										fill="#4CAF50"
										d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
									/>
									<path
										fill="#1976D2"
										d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
									/>
								</svg>
								Google
							</Button>
							<Button variant="outlined" class="gap-2 border-border">
								<svg viewBox="0 0 16 16" class="size-4" fill="currentColor" aria-hidden="true">
									<path
										d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"
									/>
								</svg>
								GitHub
							</Button>
						</div>

						<p class="m-0 text-center text-[0.82rem] text-foreground-muted">
							Don't have an account?
							<a
								href={resolve('/themes/studio')}
								class="text-primary underline-offset-2 hover:underline"
							>
								Sign up
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- ───────────────── Shared app chrome + screen ───────────────── -->
		<div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
			<div class="flex min-h-0 w-full flex-1 flex-col">
				<!-- App bar -->
				<header class="flex shrink-0 flex-col gap-5 border-b border-border/60 px-6 py-6 md:px-8">
					<div class="flex items-center justify-between gap-3">
						<Breadcrumb.Root class="text-[0.78rem]">
							<Breadcrumb.Item href={resolve('/themes/studio')}>Workspace</Breadcrumb.Item>
							<Breadcrumb.Separator><Slash size={12} /></Breadcrumb.Separator>
							<Breadcrumb.Item>{chromeMeta.eyebrow}</Breadcrumb.Item>
						</Breadcrumb.Root>

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
									class="gap-1.5 text-[0.82rem]"
									aria-label="Open command palette"
								>
									<Search size={13} />
									<span class="max-sm:hidden">Search</span>
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
										</Command.Group>
										<Command.Separator />
										<Command.Group heading="Go to">
											{#each screenOptions as opt (opt.id)}
												<Command.Item
													name={`go to ${opt.label}`}
													callback={() => onpreview?.(opt.id)}
												>
													<Layers class="text-foreground-muted" />
													<span>{opt.label}</span>
												</Command.Item>
											{/each}
										</Command.Group>
									</Command.Results>
								</Command.Content>
							</Command.Root>

							<Modal.Root bind:open={newProjectOpen}>
								<Modal.Trigger class="gap-1.5 text-[0.82rem]">
									<Plus size={13} />
									<span class="max-sm:hidden">New project</span>
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
												class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
											>
												Team
											</span>
											<Select.Root value={newProjectTeam}>
												<Select.Trigger class="w-full" variant="outlined">
													{newProjectTeam.charAt(0).toUpperCase() + newProjectTeam.slice(1)}
												</Select.Trigger>
												<Select.Content>
													{#each [{ v: 'design', l: 'Design' }, { v: 'engineering', l: 'Engineering' }, { v: 'product', l: 'Product' }, { v: 'marketing', l: 'Marketing' }] as t (t.v)}
														<Select.Item value={t.v} onclick={() => (newProjectTeam = t.v)}>
															{t.l}
														</Select.Item>
													{/each}
												</Select.Content>
											</Select.Root>
										</div>
									</div>
									<div class="flex shrink-0 items-center justify-end gap-2 px-5 py-3">
										<Modal.Close variant="ghost" size="sm" class="text-[0.8rem]">Cancel</Modal.Close
										>
										<Modal.Confirm size="sm" class="text-[0.8rem]" onclick={createProject}>
											<Plus size={13} />
											Create project
										</Modal.Confirm>
									</div>
								</Modal.Content>
							</Modal.Root>

							<Avatar.Root size="sm"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
						</div>
					</div>

					<div class="flex items-center gap-3">
						<div>
							<p
								class="m-0 text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
							>
								{chromeMeta.eyebrow}
							</p>
							<h2
								class="m-0 mt-0.5 text-[1.5rem] [font-weight:var(--font-weight-header,500)] leading-tight [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								{chromeMeta.title}
							</h2>
						</div>
					</div>
				</header>

				{#if preview === 'components'}
					<!-- ───────────────────── COMPONENTS ───────────────────── -->
					<!-- Buttons + badges -->
					<section class="flex flex-col gap-4 border-b border-border/60 px-6 py-7 md:px-8">
						{@render sectionHead('Actions', 'Buttons & badges')}
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

					<!-- Component grid -->
					<section class="border-b border-border/60 px-6 py-7 md:px-8">
						{@render sectionHead('Library', 'Every component, themed live')}
						<div class="mt-4 grid grid-cols-2 gap-3 max-md:grid-cols-1">
							{#snippet inputsTile()}
								<Input variant="outlined" label="Full name" placeholder="Alex Johnson" />
								<Select.Root value={pgRole}>
									<Select.Trigger class="w-full" variant="outlined">
										{pgRole.charAt(0).toUpperCase() + pgRole.slice(1)}
									</Select.Trigger>
									<Select.Content>
										{#each [{ v: 'engineer', l: 'Engineer' }, { v: 'designer', l: 'Designer' }, { v: 'product', l: 'Product manager' }, { v: 'founder', l: 'Founder' }] as r (r.v)}
											<Select.Item value={r.v} onclick={() => (pgRole = r.v)}>{r.l}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
								<Textarea bind:value={glTextarea} />
							{/snippet}
							{@render tile('Inputs', inputsTile)}

							{#snippet controlsTile()}
								<div class="flex items-center justify-between">
									<span class="text-[0.84rem]">Push notifications</span>
									<Switch bind:switched={pgNotifications} aria-label="Toggle notifications" />
								</div>
								<Checkbox bind:checked={pgAcceptTerms} label="I agree to the terms" />
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
							{/snippet}
							{@render tile('Controls', controlsTile)}

							{#snippet choiceTile()}
								<RadioGroup.Root bind:value={glPlan} name="components-plan">
									<RadioGroup.Item
										value="free"
										label="Free"
										description="For solo hobby projects."
									/>
									<RadioGroup.Item value="pro" label="Pro" description="For growing teams." />
									<RadioGroup.Item value="team" label="Team" description="For whole orgs." />
								</RadioGroup.Root>
							{/snippet}
							{@render tile('Selection', choiceTile)}

							{#snippet feedbackTile()}
								<Alert.Root variant="info">
									<Alert.Title>Heads up</Alert.Title>
									<Alert.Description>A new release rolled out to staging.</Alert.Description>
								</Alert.Root>
								<div class="flex flex-col gap-1.5">
									<div class="flex items-center justify-between text-[0.78rem]">
										<span class="text-foreground-muted">Documents</span>
										<span>{pgProgress}%</span>
									</div>
									<Progress value={pgProgress} />
								</div>
								<div class="flex flex-col gap-2">
									<Skeleton class="h-3 w-full" />
									<Skeleton class="h-3 w-[70%]" />
								</div>
								<Button
									variant="secondary"
									size="sm"
									class="self-start"
									onclick={() =>
										toast({
											title: 'Toast fired',
											description: 'Transient feedback.',
											type: 'success',
											duration: 2200
										})}
								>
									Fire toast
								</Button>
							{/snippet}
							{@render tile('Feedback', feedbackTile)}

							{#snippet overlayTile()}
								<div class="flex flex-wrap items-center gap-2">
									<DropdownMenu.Root>
										<DropdownMenu.Trigger variant="outlined">Dropdown</DropdownMenu.Trigger>
										<DropdownMenu.Content>
											<DropdownMenu.Label>Sort by</DropdownMenu.Label>
											<DropdownMenu.Item><span>Recently updated</span></DropdownMenu.Item>
											<DropdownMenu.Item><span>Alphabetical</span></DropdownMenu.Item>
											<DropdownMenu.Separator />
											<DropdownMenu.Item><span>Archived</span></DropdownMenu.Item>
										</DropdownMenu.Content>
									</DropdownMenu.Root>
									<Popover.Root placement="bottom">
										<Popover.Trigger variant="outlined">Popover</Popover.Trigger>
										<Popover.Content class="w-64">
											<Popover.Title>Floating panel</Popover.Title>
											<p class="text-[0.85rem] text-foreground-muted">
												Button-anchored floating surface.
											</p>
										</Popover.Content>
									</Popover.Root>
									<Tooltip.Root>
										<Tooltip.Trigger>
											<Button variant="outlined" size="sm" class="gap-1.5">
												<Info size={12} />
												Tooltip
											</Button>
										</Tooltip.Trigger>
										<Tooltip.Content>This is a Silk tooltip.</Tooltip.Content>
									</Tooltip.Root>
									<HoverCard.Root>
										<HoverCard.Trigger>
											<Button variant="outlined" size="sm">Hover card</Button>
										</HoverCard.Trigger>
										<HoverCard.Content class="w-64">
											<HoverCard.Title>Transient surface</HoverCard.Title>
											<HoverCard.Description>Ephemeral feedback.</HoverCard.Description>
										</HoverCard.Content>
									</HoverCard.Root>
									<AlertDialog.Root>
										<AlertDialog.Trigger variant="outlined">Alert dialog</AlertDialog.Trigger>
										<AlertDialog.Content>
											<AlertDialog.Header>
												<AlertDialog.Title>Delete this project?</AlertDialog.Title>
												<AlertDialog.Description
													>This action cannot be undone.</AlertDialog.Description
												>
											</AlertDialog.Header>
											<AlertDialog.Footer>
												<AlertDialog.Exit>Cancel</AlertDialog.Exit>
												<AlertDialog.Confirm>Delete</AlertDialog.Confirm>
											</AlertDialog.Footer>
										</AlertDialog.Content>
									</AlertDialog.Root>
								</div>
							{/snippet}
							{@render tile('Overlays & menus', overlayTile)}

							{#snippet surfaceTile()}
								<Accordion.Root type="single" bind:value={glAccordion}>
									<Accordion.Item value="a1">
										<Accordion.Trigger>What is a token group?</Accordion.Trigger>
										<Accordion.Content>A coherent bundle of related tokens.</Accordion.Content>
									</Accordion.Item>
									<Accordion.Item value="a2">
										<Accordion.Trigger>Does it theme live?</Accordion.Trigger>
										<Accordion.Content>Yes — every value cascades from the theme.</Accordion.Content
										>
									</Accordion.Item>
								</Accordion.Root>
								<Collapsible.Root>
									<Collapsible.Trigger>Toggle details</Collapsible.Trigger>
									<Collapsible.Content>
										<p class="pt-2 text-[0.85rem] text-foreground-muted">Collapsible content.</p>
									</Collapsible.Content>
								</Collapsible.Root>
							{/snippet}
							{@render tile('Surfaces', surfaceTile)}
						</div>
					</section>

					<!-- Composed card examples -->
					<section class="border-b border-border/60 px-6 py-7 md:px-8">
						{@render sectionHead('Patterns', 'Composed cards')}
						<div class="mt-4 grid grid-cols-2 gap-3 max-md:grid-cols-1">
							<Card.Root>
								<Card.Header>
									<Card.Title>Pro plan</Card.Title>
									<Card.Description>Everything you need to scale a team.</Card.Description>
								</Card.Header>
								<Card.Content>
									<p class="m-0 flex items-baseline gap-1">
										<span
											class="text-[1.8rem] [font-weight:var(--font-weight-header,600)] [letter-spacing:var(--tracking-header,-0.02em)]"
											style="font-family: var(--font-header);"
										>
											$29
										</span>
										<span class="text-[0.82rem] text-foreground-muted">/ month</span>
									</p>
									<ul
										class="m-0 mt-3 flex list-none flex-col gap-1.5 p-0 text-[0.84rem] text-foreground-muted"
									>
										<li>Unlimited projects</li>
										<li>Advanced theming tokens</li>
										<li>Priority support</li>
									</ul>
								</Card.Content>
								<Card.Footer>
									<Button class="w-full">Upgrade</Button>
								</Card.Footer>
							</Card.Root>

							<Card.Root>
								<Card.Header>
									<Card.Title>Payment method</Card.Title>
									<Card.Description>Visa ending in 4242</Card.Description>
								</Card.Header>
								<Card.Content>
									<div
										class="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background/50 p-3"
									>
										<span
											class="grid size-9 place-items-center rounded-md bg-secondary text-foreground-muted"
										>
											<CreditCard size={16} />
										</span>
										<div class="min-w-0 flex-1">
											<p class="m-0 text-[0.86rem]">•••• •••• •••• 4242</p>
											<p class="m-0 text-[0.74rem] text-foreground-muted">Expires 08 / 27</p>
										</div>
										<Badge variant="ghost" class="text-[0.66rem]">Default</Badge>
									</div>
								</Card.Content>
								<Card.Footer class="gap-2">
									<Button variant="outlined" size="sm">Replace</Button>
									<Button variant="ghost" size="sm">Remove</Button>
								</Card.Footer>
							</Card.Root>
						</div>
					</section>

					<!-- Navigation & data -->
					<section class="flex flex-col gap-4 px-6 py-7 md:px-8">
						{@render sectionHead('Navigation & data', 'Avatars, pagination, calendar')}
						<div class="flex items-center gap-2">
							<Avatar.Root size="sm"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
							<Avatar.Root size="md"><Avatar.Fallback>MC</Avatar.Fallback></Avatar.Root>
							<Avatar.Root size="lg" shape="square"
								><Avatar.Fallback>LP</Avatar.Fallback></Avatar.Root
							>
						</div>
						<Tabs.Root bind:value={playgroundTab}>
							<Tabs.List>
								<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
								<Tabs.Trigger value="activity">Activity</Tabs.Trigger>
								<Tabs.Trigger value="files">Files</Tabs.Trigger>
							</Tabs.List>
						</Tabs.Root>
						<div class="grid grid-cols-2 gap-3 max-md:grid-cols-1">
							<Pagination bind:page={glPage} total={20} />
							<Calendar bind:value={glCalendar} />
						</div>
						<Separator />
						<ScrollArea
							class="h-20 w-full rounded-[var(--radius-md)] border border-border bg-background p-3"
						>
							<p class="text-[0.85rem] text-foreground-muted">
								Scroll region. Pellentesque habitant morbi tristique senectus et netus et malesuada
								fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget.
							</p>
						</ScrollArea>
						<Marquee
							pauseOnHover
							duration="22s"
							class="rounded-[var(--radius-md)] border border-border py-3"
						>
							<span class="px-4 text-[0.85rem] text-foreground-muted"
								>Silk · extreme customizability ·</span
							>
							<span class="px-4 text-[0.85rem] text-foreground-muted"
								>every token, one source ·</span
							>
						</Marquee>
					</section>
				{:else if preview === 'dashboard'}
					<!-- ───────────────────── DASHBOARD ───────────────────── -->
					<!-- KPI strip -->
					<section class="grid grid-cols-3 gap-3 px-6 py-7 md:px-8 max-sm:grid-cols-1">
						{#each kpis as stat, i (i)}
							<div
								class="flex flex-col gap-1 rounded-[var(--radius-md)] border border-border bg-background/40 p-4"
							>
								<p class="m-0 text-[0.78rem] text-foreground-muted">{stat.label}</p>
								<p
									class="m-0 text-[1.6rem] [font-weight:var(--font-weight-header,500)] [letter-spacing:var(--tracking-header,-0.02em)]"
									style="font-family: var(--font-header);"
								>
									{stat.value}
								</p>
								<div class="mt-0.5 flex items-center gap-1.5">
									<span
										class="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
										style={`background:color-mix(in srgb, ${stat.up ? 'var(--color-success)' : 'var(--color-destructive)'} 12%, transparent); color:${stat.up ? 'var(--color-success)' : 'var(--color-destructive)'};`}
									>
										{#if stat.up}<TrendingUp size={11} />{:else}<TrendingDown size={11} />{/if}
										{stat.delta}
									</span>
									<span class="text-[0.7rem] text-foreground-muted">vs last month</span>
								</div>
							</div>
						{/each}
					</section>

					<!-- Chart -->
					<section class="flex flex-col gap-4 border-t border-border/60 px-6 py-7 md:px-8">
						<div class="flex items-center justify-between gap-3">
							{@render sectionHead('Analytics', 'Revenue this year')}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger variant="outlined" size="sm"
									>Last 12 months</DropdownMenu.Trigger
								>
								<DropdownMenu.Content>
									<DropdownMenu.Item><span>Last 30 days</span></DropdownMenu.Item>
									<DropdownMenu.Item><span>Last 6 months</span></DropdownMenu.Item>
									<DropdownMenu.Item><span>Last 12 months</span></DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
						<div
							class="flex h-44 items-end gap-2 rounded-[var(--radius-md)] border border-border bg-background/40 p-4"
						>
							{#each chartBars as h, i (i)}
								<div
									class="flex-1 rounded-t-[var(--radius-sm)] transition-[height] duration-500 ease-out"
									style={`height:${h}%; background:${i === chartBars.length - 2 ? 'var(--color-primary)' : 'color-mix(in srgb, var(--color-primary) 35%, transparent)'};`}
								></div>
							{/each}
						</div>
					</section>

					<!-- Activity tabs -->
					<section class="flex flex-col gap-3 border-t border-border/60 px-6 py-7 md:px-8">
						<div class="flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
							{@render sectionHead('Project', 'Recent activity')}
							<Tabs.Root bind:value={playgroundTab}>
								<Tabs.List>
									<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
									<Tabs.Trigger value="activity">Activity</Tabs.Trigger>
									<Tabs.Trigger value="files">Files</Tabs.Trigger>
								</Tabs.List>
							</Tabs.Root>
						</div>
						<div class="text-[0.86rem] text-foreground-muted">
							{#if playgroundTab === 'overview'}
								<p class="m-0">
									<span class="text-foreground">All systems operational.</span> The pipeline finished
									in 42s with 0 regressions and a 99.4% cache hit rate.
								</p>
							{:else if playgroundTab === 'activity'}
								<div class="flex flex-col gap-2">
									{#each [{ who: 'Maya', what: 'merged main into release-2.5', when: '2m' }, { who: 'Aidan', what: 'opened PR #482 · refactor toolbar', when: '14m' }, { who: 'Leo', what: 'commented on issue #311', when: '1h' }] as item, i (i)}
										<div class="flex items-center gap-2">
											<span class="size-1.5 rounded-full bg-[var(--color-info)]"></span>
											<span class="text-foreground">{item.who}</span>
											<span>{item.what}</span>
											<span class="ml-auto text-[0.7rem]">{item.when}</span>
										</div>
									{/each}
								</div>
							{:else}
								<div class="flex flex-col gap-2">
									{#each ['silk-ui-roadmap.md', 'design-tokens.json', 'brand-guidelines.fig'] as file (file)}
										<div class="flex items-center gap-2">
											<FileText size={13} />
											<span class="text-foreground">{file}</span>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</section>

					<!-- Projects table -->
					<section class="flex flex-col gap-3 border-t border-border/60 px-6 py-7 md:px-8">
						{@render sectionHead('Projects', 'Active workstreams')}
						<div class="overflow-hidden rounded-[var(--radius-md)] border border-border">
							<table class="w-full border-collapse text-[0.84rem]">
								<thead>
									<tr class="border-b border-border bg-secondary/40 text-left">
										<th
											class="px-3 py-2 [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
										>
											Project
										</th>
										<th
											class="px-3 py-2 [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted max-sm:hidden"
										>
											Owner
										</th>
										<th
											class="px-3 py-2 text-right [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
										>
											Status
										</th>
									</tr>
								</thead>
								<tbody>
									{#each tableRows as row, i (i)}
										<tr
											class="border-b border-border/60 last:border-0 transition-colors hover:bg-secondary/30"
										>
											<td class="px-3 py-2.5 text-foreground">{row.name}</td>
											<td class="px-3 py-2.5 text-foreground-muted max-sm:hidden">{row.owner}</td>
											<td class="px-3 py-2.5 text-right">
												<span
													class="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[0.72rem] text-foreground-muted"
												>
													<span class="size-1.5 rounded-full" style={`background:${row.tone};`}
													></span>
													{row.status}
												</span>
											</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</section>
				{:else if preview === 'settings'}
					<!-- ───────────────────── SETTINGS ───────────────────── -->
					<section class="flex flex-col gap-4 border-b border-border/60 px-6 py-7 md:px-8">
						{@render sectionHead('General', 'Profile')}
						<div class="flex items-center gap-4">
							<Avatar.Root size="lg"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
							<div class="flex flex-col gap-1.5">
								<Button variant="outlined" size="sm">Change photo</Button>
								<span class="text-[0.74rem] text-foreground-muted">JPG, PNG or GIF · max 2MB</span>
							</div>
						</div>
						<div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
							<Input label="Display name" variant="outlined" bind:value={pgInputName} />
							<Input label="Email" type="email" variant="outlined" bind:value={pgInputEmail} />
						</div>
						<div class="flex flex-col gap-1.5">
							<span
								class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
							>
								Default role
							</span>
							<Select.Root value={pgRole}>
								<Select.Trigger class="w-full" variant="outlined">
									{pgRole.charAt(0).toUpperCase() + pgRole.slice(1)}
								</Select.Trigger>
								<Select.Content>
									{#each [{ v: 'engineer', l: 'Engineer' }, { v: 'designer', l: 'Designer' }, { v: 'product', l: 'Product manager' }, { v: 'founder', l: 'Founder' }] as r (r.v)}
										<Select.Item value={r.v} onclick={() => (pgRole = r.v)}>{r.l}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
					</section>

					<section class="flex flex-col gap-4 border-b border-border/60 px-6 py-7 md:px-8">
						{@render sectionHead('Preferences', 'Notifications & security')}
						<div
							class="flex flex-col divide-y divide-border/60 overflow-hidden rounded-[var(--radius-md)] border border-border"
						>
							<div class="flex items-center justify-between gap-3 px-3 py-2.5">
								<div class="flex items-center gap-2">
									<Bell size={14} class="text-foreground-muted" />
									<div class="flex flex-col">
										<span class="text-[0.86rem]">Push notifications</span>
										<span class="text-[0.72rem] text-foreground-muted">Mentions and replies.</span>
									</div>
								</div>
								<Switch bind:switched={pgNotifications} aria-label="Toggle notifications" />
							</div>
							<div class="flex items-center justify-between gap-3 px-3 py-2.5">
								<div class="flex items-center gap-2">
									<FileText size={14} class="text-foreground-muted" />
									<div class="flex flex-col">
										<span class="text-[0.86rem]">Weekly email digest</span>
										<span class="text-[0.72rem] text-foreground-muted"
											>A Monday activity summary.</span
										>
									</div>
								</div>
								<Switch bind:switched={pgEmailDigest} aria-label="Toggle email digest" />
							</div>
							<div class="flex items-center justify-between gap-3 px-3 py-2.5">
								<div class="flex items-center gap-2">
									<Lock size={14} class="text-foreground-muted" />
									<div class="flex flex-col">
										<span class="text-[0.86rem]">Two-factor auth</span>
										<span class="text-[0.72rem] text-foreground-muted">Extra sign-in security.</span
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

					<section class="flex flex-col gap-3 px-6 py-7 md:px-8">
						{@render sectionHead('Danger zone', 'Workspace lifecycle')}
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
				{:else if preview === 'mail'}
					<!-- ───────────────────────── MAIL ───────────────────────── -->
					<div
						class="grid min-h-0 flex-1 grid-cols-[minmax(0,20rem)_1fr] divide-x divide-border/60 max-md:grid-cols-1 max-md:divide-x-0"
					>
						<!-- List pane -->
						<div class="flex min-h-0 flex-col">
							<div
								class="flex shrink-0 items-center justify-between gap-2 border-b border-border/60 px-4 py-3"
							>
								<span
									class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
								>
									All mail
								</span>
								<Badge variant="outlined" class="text-[0.66rem]">5 messages</Badge>
							</div>
							<div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
								{#each mailMessages as msg (msg.id)}
									{@const active = msg.id === selectedMailId}
									<button
										type="button"
										onclick={() => (selectedMailId = msg.id)}
										class={`flex items-start gap-3 border-b border-border/60 px-4 py-3 text-left transition-colors ${active ? 'bg-secondary/60' : 'hover:bg-secondary/40'}`}
									>
										<span
											class="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-[0.74rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
										>
											{msg.initials}
										</span>
										<div class="min-w-0 flex-1">
											<div class="flex items-center justify-between gap-2">
												<span
													class="truncate text-[0.84rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
												>
													{msg.sender}
												</span>
												<span class="shrink-0 text-[0.7rem] text-foreground-muted">{msg.time}</span>
											</div>
											<p class="m-0 mt-0.5 truncate text-[0.8rem]">{msg.subject}</p>
											<p class="m-0 mt-0.5 truncate text-[0.74rem] text-foreground-muted">
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
						</div>

						<!-- Reading pane -->
						<div class="flex min-h-0 flex-col gap-4 overflow-y-auto px-6 py-6 md:px-8">
							<div class="flex items-start justify-between gap-3">
								<div class="flex items-center gap-3">
									<span
										class="grid size-10 place-items-center rounded-full bg-primary/12 text-[0.78rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-primary"
									>
										{selectedMail.initials}
									</span>
									<div>
										<p
											class="m-0 text-[0.92rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
										>
											{selectedMail.sender}
										</p>
										<p class="m-0 mt-0.5 text-[0.74rem] text-foreground-muted">
											to me · {selectedMail.time}
										</p>
									</div>
								</div>
								<span
									class="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[0.68rem] text-foreground-muted"
								>
									<span
										class="size-1.5 rounded-full"
										style={`background:${tagToTone[selectedMail.tag] ?? 'var(--color-foreground-muted)'};`}
									></span>
									{selectedMail.tag}
								</span>
							</div>
							<h3
								class="m-0 text-[1.2rem] [font-weight:var(--font-weight-header,500)] leading-tight [letter-spacing:var(--tracking-header,-0.02em)]"
								style="font-family: var(--font-header);"
							>
								{selectedMail.subject}
							</h3>
							<p class="m-0 text-[0.92rem] leading-relaxed text-foreground">
								{selectedMail.preview}
							</p>
							<p class="m-0 text-[0.86rem] leading-relaxed text-foreground-muted">
								Reply if you have any questions. Otherwise this thread will close automatically in 7
								days.
							</p>
							<Separator />
							<div class="flex flex-wrap items-center gap-2">
								<Button size="sm">
									<Send size={13} />
									Reply
								</Button>
								<Button variant="outlined" size="sm">Forward</Button>
								<Button variant="ghost" size="sm">Mark unread</Button>
								<Button variant="ghost" size="sm" class="text-[var(--color-destructive)]"
									>Delete</Button
								>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</main>
