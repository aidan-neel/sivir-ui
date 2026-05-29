<script lang="ts">
	import { Button, type ButtonVariant } from '@silk/ui/components/button';
	import { Badge } from '@silk/ui/components/badge';
	import { highlight } from '$lib/highlight';
	import * as Tabs from '@silk/ui/components/tabs';
	import * as Tooltip from '@silk/ui/components/tooltip';
	import * as Alert from '@silk/ui/components/alert';
	import { toast } from '@silk/ui/components/toast';
	import PageActions from '$lib/components/docs/page-actions.svelte';
	import { components, sanitizeComponent } from '$lib/components';

	import Sparkles from '@lucide/svelte/icons/sparkles';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Component from '@lucide/svelte/icons/component';
	import Layers from '@lucide/svelte/icons/layers-3';
	import Link from '@lucide/svelte/icons/link';
	import Type from '@lucide/svelte/icons/type';
	import Wand from '@lucide/svelte/icons/wand-sparkles';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash from '@lucide/svelte/icons/trash-2';
	import Send from '@lucide/svelte/icons/send';
	import Download from '@lucide/svelte/icons/download';
	import Loader from '@lucide/svelte/icons/loader-circle';
	import Heart from '@lucide/svelte/icons/heart';
	import External from '@lucide/svelte/icons/external-link';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Button';
	const SLUG = 'button';
	const SOURCE = 'https://github.com/aidan-neel/silk/tree/main/registry/silk/default/button';

	const curIndex = components.indexOf(TITLE.toLowerCase());
	const prevComponent = components[curIndex - 1];
	const nextComponent = components[curIndex + 1];

	// ── Playground state ─────────────────────────────────────────────────
	type Size = 'sm' | 'default' | 'lg' | 'icon';
	let pgVariant = $state<ButtonVariant>('primary');
	let pgSize = $state<Size>('default');
	let pgLabel = $state('Get started');
	let pgIcon = $state(true);
	let pgLoading = $state(false);

	const variantList: { value: ButtonVariant; label: string; tone: string; use: string }[] = [
		{ value: 'primary', label: 'Primary', tone: 'The hero action', use: 'One per surface. Hits the eye first.' },
		{ value: 'secondary', label: 'Secondary', tone: 'Quiet partner', use: 'Pairs with Primary when you need two equally valid choices.' },
		{ value: 'outlined', label: 'Outlined', tone: 'Neutral container', use: 'Toolbar actions, in-line controls, anything that should defer to content.' },
		{ value: 'flat', label: 'Flat', tone: 'Primary-tinted ghost', use: 'Soft emphasis without a full background.' },
		{ value: 'ghost', label: 'Ghost', tone: 'Invisible until hovered', use: 'Dense menus, icon buttons, anywhere chrome should disappear.' },
		{ value: 'alternate', label: 'Alternate', tone: 'Inverted contrast', use: 'Stands out against busy surfaces -- perfect on hero sections.' },
		{ value: 'success', label: 'Success', tone: 'Positive confirmation', use: '"Confirm payment", "Approve", "Save".' },
		{ value: 'warning', label: 'Warning', tone: 'Careful, not scary', use: 'Reversible but consequential actions.' },
		{ value: 'error', label: 'Error', tone: 'Trouble ahead', use: 'Failure recovery, retry flows, error-state CTAs.' },
		{ value: 'destructive', label: 'Destructive', tone: 'Irreversible', use: '"Delete account", "Erase data" -- the actions you want users to pause on.' }
	];

	const sizeList: { value: Size; label: string; height: string; padX: string; usage: string }[] = [
		{ value: 'sm', label: 'sm', height: '32 px', padX: '10 px', usage: 'Toolbars, dense tables, inline filters.' },
		{ value: 'default', label: 'default', height: '36 px', padX: '12 px', usage: 'Forms, dialogs, page CTAs.' },
		{ value: 'lg', label: 'lg', height: '40 px', padX: '16 px', usage: 'Marketing pages and high-emphasis flows.' },
		{ value: 'icon', label: 'icon', height: '36 px', padX: '0 px', usage: 'Square, content-less affordances.' }
	];

	const apiRows = [
		{ prop: 'variant', type: '"primary" | "secondary" | "outlined" | "flat" | "ghost" | "alternate" | "success" | "warning" | "error" | "destructive"', default: '"primary"', description: 'Visual treatment. See Variants for guidance.' },
		{ prop: 'size', type: '"sm" | "default" | "lg" | "icon"', default: '"default"', description: 'Token-driven height and padding.' },
		{ prop: 'href', type: 'string', default: '--', description: 'Renders an `<a>` instead of a `<button>` -- same styling, semantic anchor.' },
		{ prop: 'onclick', type: '() => void', default: '--', description: 'Pointer + keyboard activation.' },
		{ prop: 'element', type: 'HTMLButtonElement | HTMLAnchorElement | undefined', default: '--', description: 'Bindable reference for imperative focus / measurement.' },
		{ prop: 'disabled', type: 'boolean', default: 'false', description: 'Standard disabled -- also disables hover / focus shadows.' },
		{ prop: 'class', type: 'string', default: '--', description: 'Tailwind classes appended via `cn()` -- overrides win.' }
	];

	const playgroundCode = $derived(`<Button${pgVariant !== 'primary' ? ` variant="${pgVariant}"` : ''}${pgSize !== 'default' ? ` size="${pgSize}"` : ''}>
${pgIcon ? '  <ArrowRight size={14} />\n' : ''}  ${pgLabel || 'Button'}
</Button>`);

	let copiedSnippet = $state<string | null>(null);
	function copy(text: string, key: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(text);
		copiedSnippet = key;
		setTimeout(() => {
			if (copiedSnippet === key) copiedSnippet = null;
		}, 1600);
	}

	const installCommand = 'bunx @aidan-neel/ui add button';

	async function runLoadingDemo() {
		pgLoading = true;
		await new Promise((r) => setTimeout(r, 1400));
		pgLoading = false;
		toast({
			title: 'Saved',
			description: 'Loading state stayed in sync with the click.',
			duration: 1600,
			type: 'success'
		});
	}
</script>

<svelte:head>
	<title>Silk · Button</title>
	<meta
		name="description"
		content="Displays a button or a component that looks like a button. Ten variants, four sizes, polymorphic href."
	/>
</svelte:head>

<!-- ─── Hero ─────────────────────────────────────────────────────── -->
<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outlined" icon={Component} iconSize={11} class="gap-1.5 text-[0.66rem]">Component</Badge>
		<Badge variant="outlined" class="text-[0.66rem]">v0.4.2</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">10 variants</Badge>
		<Badge variant="ghost" class="text-[0.66rem]">4 sizes</Badge>
		</div>
		<a href={SOURCE} target="_blank" rel="noreferrer noopener" class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground">
			View source
			<External size={11} />
		</a>
	</div>

	<div class="flex flex-col gap-3">
		<h1
			class="m-0 text-[2.6rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-[1] tracking-[-0.035em] md:text-[3rem]"
			style="font-family: var(--font-header);"
		>
			Button
		</h1>
		<p class="m-0 max-w-[42rem] text-[1rem] leading-relaxed text-foreground-muted">
			The most touched piece of UI in your product. Silk's Button is built around semantic
			intent — pick a variant for what the action means, not how it should look.
		</p>
	</div>

	<div
		class="flex max-w-[28rem] items-stretch overflow-hidden rounded-[var(--radius-md)] border border-border bg-card"
	>
		<div class="flex flex-1 items-center gap-3 px-3 py-2.5">
			<span class="grid size-6 place-items-center rounded-md bg-secondary/70 text-foreground-muted">
				<Hash size={12} />
			</span>
			<code class="flex-1 font-mono text-[0.82rem] text-foreground">{installCommand}</code>
		</div>
		<button
			type="button"
			onclick={() => copy(installCommand, 'install')}
			class="border-l border-border bg-card px-3 text-[0.78rem] text-foreground-muted transition-colors hover:bg-secondary/50 hover:text-foreground"
			aria-label="Copy install command"
		>
			{#if copiedSnippet === 'install'}
				<Check size={14} class="text-[var(--color-success)]" />
			{:else}
				<Copy size={14} />
			{/if}
		</button>
	</div>

</header>

<!-- ─── Playground (vertical layout) ───────────────────────────── -->
<section class="pt-10">
	<div class="relative">
		<div
			class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"
		></div>
		<div
			class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
		>
			<div
				class="grid min-h-[12rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-10"
			>
				<Button
					variant={pgVariant}
					size={pgSize}
					disabled={pgLoading}
					onclick={runLoadingDemo}
				>
					{#if pgLoading}
						<Loader size={14} class="animate-spin" />
					{:else if pgIcon}
						<ArrowRight size={14} />
					{/if}
					{pgSize === 'icon' ? '' : pgLabel || 'Button'}
				</Button>
			</div>

			<div class="flex flex-col divide-y divide-border/60">
				<div class="flex flex-col gap-2 px-6 py-4">
					<label
						for="pg-label"
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
					>
						Label
					</label>
					<input
						id="pg-label"
						bind:value={pgLabel}
						class="h-9 w-full max-w-[28rem] rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 text-[0.86rem] text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-foreground-muted focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
						placeholder="Button"
					/>
				</div>

				<div class="flex flex-col gap-2 px-6 py-4">
					<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted">
						Variant
					</span>
					<div class="flex flex-wrap gap-1.5">
						{#each variantList as v}
							<button
								type="button"
								onclick={() => (pgVariant = v.value)}
								class={`rounded-full border px-2.5 py-1 text-[0.74rem] transition-colors ${pgVariant === v.value ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-foreground-muted hover:border-border-strong'}`}
							>
								{v.label}
							</button>
						{/each}
					</div>
				</div>

				<div class="flex flex-col gap-2 px-6 py-4">
					<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted">
						Size
					</span>
					<div class="flex flex-wrap gap-1.5">
						{#each sizeList as s}
							<button
								type="button"
								onclick={() => (pgSize = s.value)}
								class={`rounded-full border px-2.5 py-1 font-mono text-[0.72rem] transition-colors ${pgSize === s.value ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card text-foreground-muted hover:border-border-strong'}`}
							>
								{s.label}
							</button>
						{/each}
					</div>
				</div>

				<div class="flex flex-col gap-2 px-6 py-4">
					<span class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted">
						Options
					</span>
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={pgIcon} class="silk-checkbox" />
						<span class="text-[0.82rem] text-foreground">With leading icon</span>
					</label>
				</div>
			</div>

			<div
				class="flex items-center justify-between gap-2 border-t border-border/70 bg-secondary/40 px-6 py-2.5"
			>
				<span class="text-[0.66rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted">
					Snippet
				</span>
				<button
					type="button"
					onclick={() => copy(playgroundCode, 'playground')}
					class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-[0.72rem] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground"
				>
					{#if copiedSnippet === 'playground'}
						<Check size={11} class="text-[var(--color-success)]" />
						Copied
					{:else}
						<Copy size={11} />
						Copy code
					{/if}
				</button>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code>{@html highlight(playgroundCode, "svelte")}</code></pre>
		</div>
	</div>
</section>

<!-- ─── Body sections ──────────────────────────────────────────── -->
<div class="flex flex-col gap-16 pt-16">
	<!-- OVERVIEW -->
	<section id="overview" class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex items-center gap-2">
			<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
				<Sparkles size={12} />
			</span>
			<h2
				class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				At a glance
			</h2>
		</div>
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
			{#each [{ icon: Layers, title: '10 variants', body: 'Semantic + status + neutral.' }, { icon: Type, title: '4 sizes', body: 'Token-driven height + padding.' }, { icon: Link, title: 'Polymorphic', body: 'Pass `href` to render an anchor.' }] as card}
				<div class="flex flex-col gap-2 rounded-[var(--radius-lg)] border border-border bg-card p-4">
					<span class="grid size-8 place-items-center rounded-md bg-secondary/60 text-foreground">
						<card.icon size={14} />
					</span>
					<p
						class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
						style="font-family: var(--font-header);"
					>
						{card.title}
					</p>
					<p class="m-0 text-[0.84rem] text-foreground-muted">{card.body}</p>
				</div>
			{/each}
		</div>

		<Alert.Root variant="info">
			<Alert.Title>Built on tokens</Alert.Title>
			<Alert.Description>
				Every variant pulls its colors and shadows from your theme. Swap the theme and buttons
				follow — no styling overrides required.
			</Alert.Description>
		</Alert.Root>
	</section>

	<!-- VARIANTS -->
	<section id="variants" class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Layers size={12} />
				</span>
				<h2
					class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
					style="font-family: var(--font-header);"
				>
					Variants
				</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				Pick by intent. The same action ("Save") should always use the same variant across your
				product.
			</p>
		</div>

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each variantList as v}
				{@const code = `<Button${v.value !== 'primary' ? ` variant="${v.value}"` : ''}>${v.label}</Button>`}
				<div
					class="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-[border-color,box-shadow,transform] [transition-duration:var(--motion-duration-hover)] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-sm)]"
				>
					<div
						class="grid min-h-[6.5rem] place-items-center bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_50%,transparent),transparent_75%)] p-4"
					>
						<Button variant={v.value}>{v.label}</Button>
					</div>
					<div class="flex flex-col gap-1 border-t border-border/70 px-4 py-3">
						<div class="flex items-center justify-between gap-2">
							<p class="m-0 text-[0.86rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)]">{v.label}</p>
							<button
								type="button"
								onclick={() => copy(code, `var-${v.value}`)}
								class="grid size-6 place-items-center rounded text-foreground-muted opacity-0 transition-opacity hover:bg-secondary/50 hover:text-foreground group-hover:opacity-100"
								aria-label={`Copy ${v.label} snippet`}
							>
								{#if copiedSnippet === `var-${v.value}`}
									<Check size={12} class="text-[var(--color-success)]" />
								{:else}
									<Copy size={12} />
								{/if}
							</button>
						</div>
						<p class="m-0 text-[0.72rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">{v.tone}</p>
						<p class="m-0 text-[0.74rem] leading-snug text-foreground-muted">{v.use}</p>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- SIZES -->
	<section id="sizes" class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Type size={12} />
				</span>
				<h2
					class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
					style="font-family: var(--font-header);"
				>
					Sizes
				</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				Sizes scale on a 4-unit baseline. Pick the smallest size that still feels clickable.
			</p>
		</div>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<div
				class="flex flex-wrap items-end justify-around gap-5 border-b border-border/70 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--color-secondary)_45%,transparent))] px-6 py-8"
			>
				{#each sizeList as s}
					<div class="flex flex-col items-center gap-2">
						<Button size={s.value} variant="primary">
							{#if s.value === 'icon'}
								<Heart size={14} />
							{:else}
								{s.label}
							{/if}
						</Button>
						<span class="font-mono text-[0.7rem] text-foreground-muted">{s.label}</span>
					</div>
				{/each}
			</div>
			<div class="grid grid-cols-1 divide-y divide-border/60 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
				{#each sizeList as s}
					<div class="flex flex-col gap-1 p-4">
						<p class="m-0 font-mono text-[0.78rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)]">{s.label}</p>
						<div class="flex items-center gap-3 text-[0.72rem] text-foreground-muted">
							<span class="font-mono">{s.height}</span>
							<span aria-hidden="true">·</span>
							<span class="font-mono">{s.padX}</span>
						</div>
						<p class="m-0 mt-1 text-[0.74rem] leading-snug text-foreground-muted">
							{s.usage}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- STATES -->
	<section id="states" class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Wand size={12} />
				</span>
				<h2
					class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
					style="font-family: var(--font-header);"
				>
					States
				</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				The same Button renders five distinct states. All transitions are tied to your theme's
				motion preset.
			</p>
		</div>

		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
			{#each [{ label: 'Resting', node: 'rest' }, { label: 'Hover', node: 'hover' }, { label: 'Focus', node: 'focus' }, { label: 'Active', node: 'active' }, { label: 'Disabled', node: 'disabled' }] as s}
				<div
					class="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-4"
				>
					<div class="grid min-h-[4.5rem] place-items-center">
						{#if s.node === 'disabled'}
							<Button disabled>Disabled</Button>
						{:else if s.node === 'focus'}
							<Button class="ring-[3px] ring-[var(--color-ring)]">Focus</Button>
						{:else if s.node === 'active'}
							<Button class="translate-y-px">Active</Button>
						{:else if s.node === 'hover'}
							<Button class="brightness-110">Hover</Button>
						{:else}
							<Button>Rest</Button>
						{/if}
					</div>
					<span class="text-[0.74rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted">{s.label}</span>
				</div>
			{/each}
		</div>
	</section>

	<!-- COMPOSITION -->
	<section id="composition" class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Component size={12} />
				</span>
				<h2
					class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
					style="font-family: var(--font-header);"
				>
					Composition
				</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				Patterns we use in production. Copy any of these as a starting point.
			</p>
		</div>

		<Tabs.Root value="leading">
			<Tabs.List>
				<Tabs.Trigger value="leading">Leading icon</Tabs.Trigger>
				<Tabs.Trigger value="trailing">Trailing icon</Tabs.Trigger>
				<Tabs.Trigger value="loading">Loading</Tabs.Trigger>
				<Tabs.Trigger value="link">As link</Tabs.Trigger>
				<Tabs.Trigger value="group">Group</Tabs.Trigger>
			</Tabs.List>

			<div class="mt-3 grid gap-3 md:grid-cols-2">
				<Tabs.Content value="leading" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
					>
						<Button>
							<Plus size={14} />
							New project
						</Button>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code>{@html highlight(`<Button>
  <Plus size={14} />
  New project
</Button>`, "svelte")}</code></pre>
				</Tabs.Content>

				<Tabs.Content value="trailing" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
					>
						<Button variant="secondary">
							Continue
							<ArrowRight size={14} />
						</Button>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code>{@html highlight(`<Button variant="secondary">
  Continue
  <ArrowRight size={14} />
</Button>`, "svelte")}</code></pre>
				</Tabs.Content>

				<Tabs.Content value="loading" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
					>
						<Button disabled>
							<Loader size={14} class="animate-spin" />
							Saving…
						</Button>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code>{@html highlight(`<Button disabled={busy}>
  {#if busy}
    <Loader size={14} class="animate-spin" />
    Saving…
  {:else}
    Save
  {/if}
</Button>`, "svelte")}</code></pre>
				</Tabs.Content>

				<Tabs.Content value="link" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
					>
						<Button href="https://silk.dev" variant="outlined">
							<External size={13} />
							Open docs
						</Button>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code>{@html highlight(`<Button href="/docs" variant="outlined">
  <External size={13} />
  Open docs
</Button>`, "svelte")}</code></pre>
				</Tabs.Content>

				<Tabs.Content value="group" class="contents">
					<div
						class="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-card p-8"
					>
						<div class="flex items-center gap-2">
							<Button variant="ghost"><Download size={14} /></Button>
							<Button variant="ghost"><Send size={14} /></Button>
							<Button variant="ghost"><Trash size={14} /></Button>
						</div>
					</div>
					<pre
						class="m-0 overflow-x-auto rounded-[var(--radius-lg)] border border-border bg-secondary/40 px-4 py-4 font-mono text-[0.78rem] leading-relaxed"><code>{@html highlight(`<div class="flex items-center gap-2">
  <Button variant="ghost"><Download size={14} /></Button>
  <Button variant="ghost"><Send size={14} /></Button>
  <Button variant="ghost"><Trash size={14} /></Button>
</div>`, "svelte")}</code></pre>
				</Tabs.Content>
			</div>
		</Tabs.Root>
	</section>

	<!-- API -->
	<section id="api" class="scroll-mt-20 flex flex-col gap-5">
		<div class="flex flex-col gap-1">
			<div class="flex items-center gap-2">
				<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
					<Hash size={12} />
				</span>
				<h2
					class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
					style="font-family: var(--font-header);"
				>
					API
				</h2>
			</div>
			<p class="m-0 max-w-[42rem] text-[0.86rem] text-foreground-muted">
				<code class="font-mono text-foreground">Button</code> is the only export. Every prop
				accepts the underlying button/anchor attributes too.
			</p>
		</div>

		<div class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
			<div
				class="grid grid-cols-[1fr_1.8fr_0.5fr] gap-3 border-b border-border bg-secondary/40 px-4 py-2.5 text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted max-md:hidden"
			>
				<span>Prop</span>
				<span>Type</span>
				<span class="text-right">Default</span>
			</div>
			<ul class="flex flex-col divide-y divide-border/60">
				{#each apiRows as row}
					<li class="grid grid-cols-[1fr_1.8fr_0.5fr] gap-3 px-4 py-3 max-md:grid-cols-1">
						<div class="flex items-center gap-2">
							<button
								type="button"
								onclick={() => copy(row.prop, `prop-${row.prop}`)}
								class="group inline-flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors hover:bg-secondary/60"
							>
								<code class="font-mono text-[0.82rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground">
									{row.prop}
								</code>
								{#if copiedSnippet === `prop-${row.prop}`}
									<Check size={11} class="text-[var(--color-success)]" />
								{:else}
									<Copy
										size={11}
										class="text-foreground-muted opacity-0 transition-opacity group-hover:opacity-100"
									/>
								{/if}
							</button>
						</div>
						<div class="flex flex-col gap-1">
							<code
								class="overflow-x-auto rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.74rem] text-foreground"
							>
								{row.type}
							</code>
							<p class="m-0 text-[0.78rem] leading-snug text-foreground-muted">
								{row.description}
							</p>
						</div>
						<div class="md:text-right">
							<code
								class="inline-block rounded-md bg-secondary/40 px-2 py-1 font-mono text-[0.72rem] text-foreground"
							>
								{row.default}
							</code>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</section>

	<!-- FOOTER -->
	<section
		class="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center"
	>
		<div class="flex flex-col gap-1">
			<p
				class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Want to make it yours?
			</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">
				Every Button token lives in the studio — restyle it for your brand in seconds.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Button variant="ghost" href={SOURCE}>
				<svg viewBox="0 0 24 24" aria-hidden="true" class="size-3.5 fill-current">
					<path
						d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.52-1.32-1.28-1.67-1.28-1.67-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.42.36.79 1.06.79 2.14v3.17c0 .31.21.66.8.55C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"
					/>
				</svg>
				View source
				<External size={11} class="text-foreground-muted" />
			</Button>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button variant="outlined" href="/themes">
						<Layers size={14} />
						Browse themes
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>Community-published presets</Tooltip.Content>
			</Tooltip.Root>
			<Button href="/themes/studio">
				Open studio
				<ArrowRight size={14} />
			</Button>
		</div>
	</section>
</div>

<!-- ─── Prev / next ─────────────────────────────────────────── -->
{#if curIndex !== -1}
	<div
		class="mt-12 flex w-full items-center"
		class:justify-between={prevComponent && nextComponent}
		class:justify-end={!prevComponent && nextComponent}
		class:justify-start={prevComponent && !nextComponent}
	>
		{#if prevComponent}
			<Button href={`/docs/components/${prevComponent}`} variant="outlined" class="flex-shrink-0">
				<ChevronLeft size={16} />
				{sanitizeComponent(prevComponent)}
			</Button>
		{/if}
		{#if prevComponent && nextComponent}
			<div class="mx-4 w-full rounded-lg border-t"></div>
		{/if}
		{#if nextComponent}
			<Button href={`/docs/components/${nextComponent}`} variant="outlined" class="flex-shrink-0">
				{sanitizeComponent(nextComponent)}
				<ChevronRight size={16} />
			</Button>
		{/if}
	</div>
{/if}

<style>
	.silk-checkbox {
		appearance: none;
		width: 14px;
		height: 14px;
		border: 1.5px solid var(--color-border-strong);
		border-radius: 3px;
		background: var(--color-background);
		cursor: pointer;
		position: relative;
		transition: background-color 150ms ease, border-color 150ms ease;
	}
	.silk-checkbox:hover {
		border-color: var(--color-primary);
	}
	.silk-checkbox:checked {
		background: var(--color-primary);
		border-color: var(--color-primary);
	}
	.silk-checkbox:checked::after {
		content: '';
		position: absolute;
		left: 3px;
		top: 0px;
		width: 4px;
		height: 8px;
		border: solid white;
		border-width: 0 1.5px 1.5px 0;
		transform: rotate(45deg);
	}
	.silk-checkbox:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px var(--color-ring);
	}
</style>
