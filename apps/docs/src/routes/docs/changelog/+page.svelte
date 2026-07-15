<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '@sivir/ui/components/button';
	import { Badge } from '@sivir/ui/components/badge';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import History from '@lucide/svelte/icons/history';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Wand from '@lucide/svelte/icons/wand-sparkles';
	import Palette from '@lucide/svelte/icons/palette';
	import Smartphone from '@lucide/svelte/icons/smartphone';
	import Bug from '@lucide/svelte/icons/bug';
	import Rocket from '@lucide/svelte/icons/rocket';
	import GitCommit from '@lucide/svelte/icons/git-commit-horizontal';

	type ReleaseTag = 'feature' | 'polish' | 'fix' | 'launch';

	type Entry = {
		title: string;
		body: string;
		tag: ReleaseTag;
		icon: typeof Sparkles;
	};

	type Release = {
		version: string;
		date: string;
		title: string;
		summary: string;
		entries: Entry[];
	};

	const releases: Release[] = [
		{
			version: 'v0.4.2',
			date: '2026-05-25',
			title: 'Docs redesign + theme registry',
			summary:
				'The docs got a ground-up template refresh: cleaner heroes, scannable cards, themeable syntax highlighting, and live registry-backed theme distribution.',
			entries: [
				{
					tag: 'feature',
					icon: Wand,
					title: 'Themeable syntax highlighting',
					body: 'Every docs code block now renders through a tiny, theme-aware highlighter. Tokens follow `--color-primary` and `--color-foreground`, so they re-skin instantly when the theme changes.'
				},
				{
					tag: 'feature',
					icon: Palette,
					title: 'Theme registry',
					body: 'A new Elysia + Prisma service for distributing themes. Postgres lives on Supabase -- theme management (delete, edit) happens in the Supabase dashboard rather than a built-in admin UI.'
				},
				{
					tag: 'polish',
					icon: Sparkles,
					title: 'Getting Started, ground-up',
					body: 'Introduction, Installation, Theming, and Styling pages all rebuilt with hero + cards + footer-CTA template. The badges, step cards, and copy buttons are consistent across the set.'
				},
				{
					tag: 'fix',
					icon: Bug,
					title: 'Red hover on outlined buttons',
					body: 'Switched `--button-outlined-hover-bg` from `color-mix(in oklch)` to `color-mix(in srgb)`. Eliminates the unintended red tint that appeared on near-white surfaces.'
				}
			]
		},
		{
			version: 'v0.4.0',
			date: '2026-04-18',
			title: 'Motion and theme studio',
			summary:
				'Transitions became themeable, the studio became the main authoring surface, and a handful of component bugs got chased down.',
			entries: [
				{
					tag: 'feature',
					icon: Wand,
					title: 'Themeable transitions',
					body: 'Panel movement, scale, and duration can now be tuned through transition presets.'
				},
				{
					tag: 'polish',
					icon: Palette,
					title: 'Theme studio refresh',
					body: 'Stronger preset gallery, broader motion model, base-palette automation, redesigned color picker, and a layout that matches the home page hierarchy.'
				},
				{
					tag: 'fix',
					icon: Bug,
					title: 'Select + Dropdown close on click',
					body: 'Internal click handlers no longer get clobbered when user `onclick` props are passed.'
				},
				{
					tag: 'fix',
					icon: Bug,
					title: 'Color picker hex paste',
					body: 'Removed `maxlength` from the hex input; pasting `#ffdfb5` now lands cleanly instead of dropping the last character.'
				}
			]
		},
		{
			version: 'v0.3.0',
			date: '2026-04-02',
			title: 'Accessibility and mobile pass',
			summary:
				'Dialogs, sheets, popovers, menus, selects, and comboboxes were tightened up across keyboard, focus, and touch behaviors.',
			entries: [
				{
					tag: 'polish',
					icon: Sparkles,
					title: 'Better focus and WAI-ARIA coverage',
					body: 'Focus rings, escape handling, and ARIA roles audited across every overlay primitive. Toggleable trigger behavior on dropdowns + selects.'
				},
				{
					tag: 'polish',
					icon: Smartphone,
					title: 'Mobile stability',
					body: 'Refined the mobile navbar sheet, toast placement, docs layout, and side-scrolling docs views to feel stable on small screens.'
				}
			]
		},
		{
			version: 'v1.0.0',
			date: '2025-04-12',
			title: 'Initial release',
			summary:
				'The first public cut: core component collection, CLI-driven install flow, and the docs + theme foundation.',
			entries: [
				{
					tag: 'launch',
					icon: Rocket,
					title: 'Sivir goes public',
					body: 'Twenty-plus components, the `init`/`add` CLI, the docs site, and the first set of theme presets -- all available to install today.'
				}
			]
		}
	];

	const tagStyles: Record<ReleaseTag, { label: string; cls: string }> = {
		feature: {
			label: 'New',
			cls: 'border-[color-mix(in_srgb,var(--color-primary)_38%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-foreground'
		},
		polish: {
			label: 'Polish',
			cls: 'border-border bg-secondary/60 text-foreground-muted'
		},
		fix: {
			label: 'Fix',
			cls: 'border-[color-mix(in_srgb,var(--color-warning,var(--color-primary))_38%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-warning,var(--color-primary))_10%,transparent)] text-foreground'
		},
		launch: {
			label: 'Launch',
			cls: 'border-[color-mix(in_srgb,var(--color-success,var(--color-primary))_38%,var(--color-border))] bg-[color-mix(in_srgb,var(--color-success,var(--color-primary))_12%,transparent)] text-foreground'
		}
	};

	function formatDate(iso: string): string {
		const d = new Date(iso);
		return d.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Sivir · Changelog</title>
	<meta
		name="description"
		content="Recent updates across components, theming, docs, and interaction polish."
	/>
</svelte:head>

<div class="flex flex-col gap-10" data-docs-page>
	<!-- ─── Hero ─────────────────────────────────────────────────────── -->
	<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outline" icon={History} iconSize={11} class="gap-1.5 text-[0.66rem]">
				Changelog
			</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">{releases.length} releases</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">{releases[0].version}</Badge>
		</div>

		<div class="flex flex-col gap-3">
			<h1
				class="m-0 max-w-[26ch] text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] leading-tight"
				style="font-family: var(--font-header);"
			>
				What's new in Sivir.
			</h1>
			<p
				class="m-0 max-w-2xl text-[1rem] text-foreground-muted leading-relaxed font-[var(--font-weight-description,450)]"
			>
				Releases, polish passes, and the occasional bug fix — in the order they shipped.
			</p>
		</div>
	</header>

	<!-- ─── Release timeline ───────────────────────────────────────── -->
	<section class="pt-10 flex flex-col gap-10">
		{#each releases as release, idx (release.version)}
			<article class="relative flex flex-col gap-5">
				<!-- Release header -->
				<div class="flex flex-col gap-2">
					<div class="flex flex-wrap items-center gap-2">
						<span
							class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[0.74rem] [font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
						>
							<GitCommit size={11} class="text-foreground-muted" />
							{release.version}
						</span>
						<span class="text-[0.74rem] text-foreground-muted">{formatDate(release.date)}</span>
						{#if idx === 0}
							<Badge
								variant="outline"
								class="border-[color-mix(in_srgb,var(--color-primary)_50%,var(--color-border))] text-[0.62rem] uppercase tracking-wide"
							>
								Latest
							</Badge>
						{/if}
					</div>
					<h2
						class="m-0 text-[1.5rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-tight tracking-[-0.025em]"
						style="font-family: var(--font-header);"
					>
						{release.title}
					</h2>
					<p class="m-0 max-w-[46rem] text-[0.92rem] leading-relaxed text-foreground-muted">
						{release.summary}
					</p>
				</div>

				<!-- Entries -->
				<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
					{#each release.entries as entry (entry.title)}
						<div
							class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5"
						>
							<div class="flex items-center justify-between gap-2">
								<span
									class="grid size-9 place-items-center rounded-md bg-secondary/60 text-foreground"
								>
									<entry.icon size={15} />
								</span>
								<span
									class={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.62rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide ${tagStyles[entry.tag].cls}`}
								>
									{tagStyles[entry.tag].label}
								</span>
							</div>
							<p
								class="m-0 text-[0.96rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
								style="font-family: var(--font-header);"
							>
								{entry.title}
							</p>
							<p class="m-0 text-[0.84rem] leading-relaxed text-foreground-muted">
								{entry.body}
							</p>
						</div>
					{/each}
				</div>
			</article>
		{/each}
	</section>

	<!-- ─── Footer CTA ─────────────────────────────────────────────── -->
	<section
		class="mt-12 flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-6 sm:flex-row sm:items-center"
	>
		<div class="flex flex-col gap-1">
			<p
				class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Want to follow along?
			</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">
				Star the repo to see new releases as they ship, or jump straight to the latest components.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Button href="https://github.com/aidan-neel/sivir-ui" variant="outline">GitHub</Button>
			<Button href={resolve('/docs/components')}>
				Components
				<ArrowRight size={14} />
			</Button>
		</div>
	</section>
</div>
