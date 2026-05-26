<script lang="ts">
	import type { Action } from 'svelte/action';
	import { highlight } from '$lib/highlight';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import TrendingUp from '@lucide/svelte/icons/trending-up';
	import Check from '@lucide/svelte/icons/check';
	import Copy from '@lucide/svelte/icons/copy';
	import Palette from '@lucide/svelte/icons/palette';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Bell from '@lucide/svelte/icons/bell';
	import Plus from '@lucide/svelte/icons/plus';
	import Pin from '@lucide/svelte/icons/pin';
	import Star from '@lucide/svelte/icons/star';
	import Mail from '@lucide/svelte/icons/mail';
	import Info from '@lucide/svelte/icons/info';
	import Users from '@lucide/svelte/icons/users';
	import CreditCard from '@lucide/svelte/icons/credit-card';
	import Activity from '@lucide/svelte/icons/activity';
	import Search from '@lucide/svelte/icons/search';

	import { Badge } from '$lib/silk/components/badge';
	import { Button } from '$lib/silk/components/button';
	import { Switch } from '$lib/silk/components/switch';
	import { Progress } from '$lib/silk/components/progress';
	import { Toggle } from '$lib/silk/components/toggle';
	import * as Avatar from '$lib/silk/components/avatar';
	import { Slider } from '$lib/silk/components/slider';
	import { Calendar } from '$lib/silk/components/calendar';
	import { Input } from '$lib/silk/components/input';
	import * as Alert from '$lib/silk/components/alert';

	const installCommand = 'bunx @aidan-neel/ui add button';
	let copied = $state(false);
	function copyInstall() {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(installCommand);
		copied = true;
		setTimeout(() => (copied = false), 1600);
	}

	let notifications = $state(true);
	let pinned = $state(true);
	let volume = $state(72);

	const stats = [
		{ value: '40', label: 'Components' },
		{ value: '11', label: 'Built-in themes' },
		{ value: '60+', label: 'Theme tokens' },
		{ value: '0', label: 'Required deps' }
	];

	const sheetSource = `<Sheet.Root>
  <Sheet.Trigger variant="outlined">
    <Menu size={14} />
    Open filters
  </Sheet.Trigger>
  <Sheet.Content side="right">
    <Sheet.Header>
      <Sheet.Title>Filters</Sheet.Title>
      <Sheet.Description>Narrow down the results.</Sheet.Description>
    </Sheet.Header>
    <RadioGroup.Root bind:value={plan} name="plan">
      <RadioGroup.Item value="free" label="Free" />
      <RadioGroup.Item value="pro" label="Pro" />
    </RadioGroup.Root>
  </Sheet.Content>
</Sheet.Root>`;

	type RevealParams = { delay?: number; threshold?: number; rootMargin?: string };

	const revealOnScroll: Action<HTMLElement, RevealParams> = (node, params = {}) => {
		let observer: IntersectionObserver | undefined;
		const applyConfig = (config: RevealParams) => {
			node.style.setProperty('--reveal-delay', `${config.delay ?? 0}ms`);
			if (typeof window === 'undefined') return;
			if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
				node.dataset.revealed = 'true';
				return;
			}
			observer?.disconnect();
			observer = new IntersectionObserver(
				([entry]) => {
					if (entry?.isIntersecting) {
						node.dataset.revealed = 'true';
						observer?.disconnect();
					}
				},
				{ threshold: config.threshold ?? 0.15, rootMargin: config.rootMargin ?? '0px 0px -8% 0px' }
			);
			observer.observe(node);
		};
		applyConfig(params);
		return {
			update(p) { applyConfig(p ?? {}); },
			destroy() { observer?.disconnect(); }
		};
	};
</script>

<svelte:head>
	<title>Silk UI · Themed Svelte components</title>
	<meta name="description" content="40 Svelte 5 components, a live theme studio, and tokens that bend instead of break." />
</svelte:head>

<div class="page">
	<!-- ═══════════════════ HERO ═══════════════════ -->
	<section class="hero">
		<div class="reveal" use:revealOnScroll={{ delay: 60 }}>
			<span class="eyebrow">
				<span class="eyebrow-dot"></span>
				Silk UI · v1 release candidate
			</span>
		</div>

		<h1 class="reveal headline" use:revealOnScroll={{ delay: 140 }}>
			Forty Svelte 5 components.<br />
			<span class="headline-accent">One theming system.</span>
		</h1>

		<p class="reveal lede" use:revealOnScroll={{ delay: 240 }}>
			Token-first, accessible, source-distributed. Edit the tokens, the whole library follows.
		</p>

		<div class="reveal hero-cta" use:revealOnScroll={{ delay: 320 }}>
			<Button href="/docs/components/accordion">
				Browse components
				<ArrowRight size={14} />
			</Button>
			<Button href="/themes/studio" variant="outlined">
				<Palette size={14} />
				Open theme studio
			</Button>
		</div>

		<button
			class="reveal install"
			type="button"
			onclick={copyInstall}
			aria-label="Copy install command"
			use:revealOnScroll={{ delay: 400 }}
		>
			<span class="install-prompt">$</span>
			<span class="install-cmd">{installCommand}</span>
			<span class="install-copy">
				{#if copied}<Check size={12} />{:else}<Copy size={12} />{/if}
			</span>
		</button>
	</section>

	<!-- ═══════════════════ PREVIEW ═══════════════════ -->
	<section class="showcase">
		<div class="reveal showcase-grid" use:revealOnScroll={{ delay: 80 }}>
			<div class="preview">
				<!-- Top bar — search + breadcrumb-ish -->
				<div class="preview-topbar">
					<div class="preview-topbar-crumb">
						<span class="text-[0.72rem] text-foreground-muted">Workspace</span>
						<span class="text-foreground-muted/50">/</span>
						<span class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">Dashboard</span>
					</div>
					<div class="preview-topbar-search">
						<Search size={12} />
						<span class="text-[0.74rem] text-foreground-muted">Search…</span>
						<kbd class="preview-kbd">⌘K</kbd>
					</div>
					<Avatar.Root size="sm"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
				</div>

				<!-- Stats row -->
				<div class="preview-stats">
					<div class="preview-stat">
						<span class="preview-stat-label"><Users size={11} />Members</span>
						<span class="preview-stat-value">1,284</span>
						<span class="preview-stat-trend"><TrendingUp size={10} />+12.4%</span>
					</div>
					<div class="preview-stat">
						<span class="preview-stat-label"><CreditCard size={11} />MRR</span>
						<span class="preview-stat-value">$8,420</span>
						<span class="preview-stat-trend"><TrendingUp size={10} />+5.1%</span>
					</div>
					<div class="preview-stat">
						<span class="preview-stat-label"><Activity size={11} />Active</span>
						<span class="preview-stat-value">96%</span>
						<span class="preview-stat-trend"><TrendingUp size={10} />+1.8%</span>
					</div>
				</div>

				<div class="preview-grid">
					<!-- Account card -->
					<div class="preview-card">
						<div class="preview-card-head">
							<Avatar.Root size="md"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
							<div class="preview-card-meta">
								<p class="m-0 text-[0.86rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-tight">Aidan Neel</p>
								<p class="m-0 text-[0.74rem] leading-tight text-foreground-muted">aidan@silk-ui.dev</p>
							</div>
							<Badge variant="primary" class="ml-auto px-2 text-[0.66rem]">Pro</Badge>
						</div>
						<Input placeholder="Display name" variant="outlined" class="text-[0.82rem]" />
						<div class="preview-card-row">
							<Bell size={14} class="text-foreground-muted" />
							<span class="text-[0.82rem]">Notifications</span>
							<Switch bind:switched={notifications} aria-label="Notifications" class="ml-auto" />
						</div>
						<div class="preview-card-row">
							<Mail size={14} class="text-foreground-muted" />
							<span class="text-[0.82rem]">Email digest</span>
							<Switch switched={false} aria-label="Email digest" class="ml-auto" />
						</div>
						<div class="preview-divider"></div>
						<div class="flex flex-col gap-1.5">
							<div class="flex items-center justify-between">
								<span class="text-[0.78rem] text-foreground-muted">Storage</span>
								<span class="font-mono text-[0.72rem] text-foreground-muted">{volume} of 100 GB</span>
							</div>
							<Slider bind:value={volume} label="Storage" />
							<Progress value={volume} />
						</div>
						<div class="flex items-center justify-end gap-1.5 pt-1">
							<Button size="sm" variant="ghost" class="h-7 text-[0.74rem]">Cancel</Button>
							<Button size="sm" class="h-7 text-[0.74rem]">Save</Button>
						</div>
					</div>

					<!-- Calendar + actions stack -->
					<div class="preview-stack">
						<div class="preview-tile preview-calendar">
							<Calendar weekStartsOn={1} class="!w-full !p-0 !border-0 !bg-transparent" />
						</div>

						<div class="preview-tile">
							<div class="preview-tile-head">
								<span class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">Quick actions</span>
								<Star size={13} class="text-foreground-muted" />
							</div>
							<div class="preview-tile-row">
								<Toggle bind:pressed={pinned} size="sm" aria-label="Pin"><Pin size={12} />Pin</Toggle>
								<Badge variant="outlined" class="px-2 text-[0.7rem]"><Plus size={11} />New</Badge>
								<Badge variant="ghost" class="px-2 text-[0.7rem]">Drafts</Badge>
								<Badge variant="primary" class="px-2 text-[0.7rem]">Beta</Badge>
							</div>
						</div>

						<Alert.Root variant="info" class="!text-[0.8rem]">
							<Info size={14} />
							<Alert.Title class="!text-[0.82rem]">Theme tokens are live</Alert.Title>
							<Alert.Description class="!text-[0.74rem]">
								Pick a swatch on the left — every component above re-themes instantly.
							</Alert.Description>
						</Alert.Root>
					</div>
				</div>

				<!-- Bottom row: activity list -->
				<div class="preview-activity">
					<div class="preview-activity-head">
						<span class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">Recent activity</span>
						<a href="#" class="inline-flex items-center gap-1 text-[0.74rem] text-foreground-muted hover:text-foreground">
							View all <ArrowUpRight size={11} />
						</a>
					</div>
					{#each [
						{ initials: 'MC', name: 'Maya Chen', action: 'published the Aurora theme', time: '2m' },
						{ initials: 'LP', name: 'Leo Park', action: 'shipped fix(calendar): keyboard nav', time: '14m' },
						{ initials: 'SR', name: 'Sofia Reyes', action: 'opened PR #42 in registry', time: '1h' }
					] as row}
						<div class="preview-activity-row">
							<Avatar.Root size="sm"><Avatar.Fallback>{row.initials}</Avatar.Fallback></Avatar.Root>
							<div class="flex-1 min-w-0">
								<p class="m-0 text-[0.8rem] leading-tight"><span class="[font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]">{row.name}</span> <span class="text-foreground-muted">{row.action}</span></p>
							</div>
							<span class="font-mono text-[0.7rem] text-foreground-muted">{row.time}</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ═══════════════════ STATS ═══════════════════ -->
	<section class="stats-strip">
		{#each stats as s, i}
			<div class="stat reveal" use:revealOnScroll={{ delay: 60 + i * 70 }}>
				<span class="stat-value">{s.value}</span>
				<span class="stat-label">{s.label}</span>
			</div>
		{/each}
	</section>

	<!-- ═══════════════════ CODE × CALLOUTS ═══════════════════ -->
	<section class="codeshow">
		<div class="codeshow-intro reveal" use:revealOnScroll={{ delay: 60 }}>
			<span class="picker-eyebrow">Compound APIs</span>
			<h2 class="section-title">Composable like you'd build it yourself.</h2>
			<p class="section-sub">
				Each component splits into the parts you'd expect — <code>Root</code>, <code>Trigger</code>, <code>Content</code>, <code>Header</code>. No magic, no hidden state. The markup reads like the design spec.
			</p>
		</div>

		<div class="codeshow-grid reveal" use:revealOnScroll={{ delay: 140 }}>
			<pre class="codeshow-code"><code>{@html highlight(sheetSource, 'svelte')}</code></pre>

			<aside class="codeshow-callouts">
				<div class="callout">
					<span class="callout-num">01</span>
					<div>
						<p class="callout-title">Tokens that bend.</p>
						<p class="callout-body">Every color, radius, and motion variable threads through 40 components. Override one — they all update.</p>
					</div>
				</div>
				<div class="callout">
					<span class="callout-num">02</span>
					<div>
						<p class="callout-title">Accessibility, defaulted.</p>
						<p class="callout-body">Focus traps, scroll lock, keyboard semantics, ARIA. Modal-like overlays freeze focus to the panel automatically.</p>
					</div>
				</div>
				<div class="callout">
					<span class="callout-num">03</span>
					<div>
						<p class="callout-title">Source-distributed.</p>
						<p class="callout-body">CLI pulls components into your repo as source. Your code, your edits — never a black-box dependency.</p>
					</div>
				</div>
			</aside>
		</div>
	</section>

	<!-- ═══════════════════ CLOSER (full-bleed) ═══════════════════ -->
	<section class="closer reveal" use:revealOnScroll={{ delay: 60 }}>
		<div class="closer-content">
			<div class="closer-inner">
				<h2 class="closer-title">Start from a stronger baseline.</h2>
				<p class="closer-sub">Open the docs, copy a component, restyle the whole library from the studio.</p>
				<div class="closer-cta">
					<Button href="/docs/introduction" size="lg">
						Read the docs
						<ArrowRight size={15} />
					</Button>
					<Button href="https://github.com/aidan-neel/ui" variant="ghost" size="lg" target="_blank" rel="noreferrer noopener">
						Star on GitHub
					</Button>
				</div>
			</div>
		</div>
	</section>

	<footer class="footer reveal" use:revealOnScroll={{ delay: 80, rootMargin: '0px 0px 10% 0px' }}>
		<div>
			<p class="footer-mark">Silk UI</p>
			<p class="footer-tag">Themed Svelte 5 components for teams that still want control.</p>
		</div>
		<nav class="footer-nav">
			<a href="/docs/introduction">Docs</a>
			<a href="/docs/components/accordion">Components</a>
			<a href="/themes/studio">Studio</a>
			<a href="https://github.com/aidan-neel/ui">GitHub</a>
		</nav>
	</footer>
</div>

<style>
	.page {
		position: relative;
		min-height: calc(100vh - 3.5rem);
		padding-bottom: 6rem;
	}

	.reveal {
		opacity: 0;
		transform: translate3d(0, 18px, 0);
		filter: blur(6px);
		transition:
			opacity 880ms cubic-bezier(0.16, 1, 0.3, 1),
			transform 880ms cubic-bezier(0.16, 1, 0.3, 1),
			filter 880ms cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--reveal-delay, 0ms);
	}
	:global(.reveal[data-revealed='true']) {
		opacity: 1;
		transform: none;
		filter: none;
	}

	/* ─── Hero ─── */
	.hero {
		position: relative;
		padding: 6rem 1.5rem 4.5rem;
		text-align: center;
		max-width: 880px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}
	@media (max-width: 768px) {
		.hero { padding: 4rem 1.25rem 3rem; gap: 1rem; }
	}
	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3rem 0.7rem 0.3rem 0.55rem;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-card) 80%, transparent);
		font-size: 0.72rem;
		font-weight: var(--font-weight-header, 500);
		letter-spacing: var(--tracking-header, -0.02em);
		color: var(--color-foreground-muted);
	}
	.eyebrow-dot {
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: var(--color-primary);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 25%, transparent);
	}
	.headline {
		margin: 0;
		font-family: var(--font-header), sans-serif;
		font-size: clamp(2.25rem, 5vw, 3.75rem);
		font-weight: var(--font-weight-header, 500);
		line-height: 1.05;
		letter-spacing: var(--tracking-header, -0.02em);
		max-width: 22ch;
		text-wrap: balance;
	}
	.headline-accent {
		background: linear-gradient(90deg,
			var(--color-foreground) 0%,
			color-mix(in srgb, var(--color-foreground) 45%, var(--color-primary)) 70%,
			var(--color-primary) 100%);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}
	.lede {
		margin: 0;
		max-width: 38rem;
		font-size: 0.98rem;
		line-height: 1.65;
		color: var(--color-foreground-muted);
		text-wrap: balance;
	}
	.hero-cta {
		margin-top: 0.5rem;
		display: inline-flex;
		gap: 0.6rem;
		flex-wrap: wrap;
		justify-content: center;
	}
	.install {
		margin-top: 0.5rem;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.3rem 0.4rem 0.3rem 0.75rem;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-card) 70%, transparent);
		font-family: var(--font-mono), monospace;
		font-size: 0.76rem;
		color: var(--color-foreground-muted);
		backdrop-filter: blur(6px);
		cursor: pointer;
		transition: border-color 160ms ease, background-color 160ms ease;
	}
	.install:hover {
		border-color: color-mix(in srgb, var(--color-foreground) 16%, transparent);
		background: var(--color-card);
	}
	.install-prompt { color: color-mix(in srgb, var(--color-foreground-muted) 60%, transparent); }
	.install-cmd { color: var(--color-foreground); }
	.install-copy {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.4rem;
		height: 1.4rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-foreground) 5%, transparent);
		color: var(--color-foreground-muted);
	}

	/* ─── Showcase (picker + preview) ─── */
	.showcase {
		max-width: 1240px;
		margin: 2rem auto 0;
		padding: 0 1.5rem;
	}
	.showcase-grid {
		border-top: 1px solid var(--color-border);
		padding-top: 4rem;
	}
	.picker-eyebrow {
		font-size: 0.7rem;
		font-weight: var(--font-weight-header, 600);
		letter-spacing: var(--tracking-header, -0.02em);
		text-transform: uppercase;
		color: var(--color-foreground-muted);
	}
	.preview {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-card);
		padding: 1.2rem;
		box-shadow:
			0 1px 0 color-mix(in srgb, white 4%, transparent) inset,
			0 24px 60px -28px color-mix(in srgb, var(--color-foreground) 22%, transparent);
	}
	.preview-topbar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-bottom: 0.85rem;
		border-bottom: 1px solid var(--color-border);
	}
	.preview-topbar-crumb {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
	.preview-topbar-search {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex: 1;
		max-width: 16rem;
		margin-left: auto;
		padding: 0.35rem 0.55rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: color-mix(in srgb, var(--color-background) 60%, transparent);
		color: var(--color-foreground-muted);
	}
	.preview-kbd {
		margin-left: auto;
		padding: 0.05rem 0.35rem;
		border: 1px solid var(--color-border);
		border-radius: 4px;
		background: var(--color-secondary);
		font-family: var(--font-mono), monospace;
		font-size: 0.66rem;
		color: var(--color-foreground-muted);
	}

	.preview-stats {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.6rem;
	}
	@media (max-width: 560px) {
		.preview-stats { grid-template-columns: 1fr; }
	}
	.preview-stat {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.7rem 0.85rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: color-mix(in srgb, var(--color-background) 70%, transparent);
	}
	.preview-stat-label {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.7rem;
		color: var(--color-foreground-muted);
		letter-spacing: 0.02em;
	}
	.preview-stat-value {
		font-family: var(--font-header), sans-serif;
		font-size: 1.25rem;
		font-weight: var(--font-weight-header, 500);
		letter-spacing: var(--tracking-header, -0.02em);
		line-height: 1;
	}
	.preview-stat-trend {
		display: inline-flex;
		align-items: center;
		gap: 0.2rem;
		font-size: 0.7rem;
		font-weight: var(--font-weight-header, 500);
		letter-spacing: var(--tracking-header, -0.02em);
		color: var(--color-success);
	}

	.preview-grid {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 0.85rem;
	}
	@media (max-width: 760px) {
		.preview-grid { grid-template-columns: 1fr; }
	}
	.preview-card {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: color-mix(in srgb, var(--color-background) 80%, transparent);
		padding: 0.95rem;
	}
	.preview-card-head { display: flex; align-items: center; gap: 0.6rem; }
	.preview-card-meta { display: flex; flex-direction: column; }
	.preview-card-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.1rem 0; }
	.preview-divider {
		border-top: 1px solid var(--color-border);
		margin: 0.3rem 0;
	}
	.preview-stack { display: flex; flex-direction: column; gap: 0.85rem; }
	.preview-tile {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: color-mix(in srgb, var(--color-background) 80%, transparent);
		padding: 0.85rem;
	}
	.preview-tile-head { display: flex; justify-content: space-between; align-items: center; }
	.preview-tile-row { display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center; }
	.preview-calendar { padding: 0.55rem 0.6rem; }

	.preview-activity {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		padding: 0.95rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: color-mix(in srgb, var(--color-background) 80%, transparent);
	}
	.preview-activity-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.2rem;
	}
	.preview-activity-row {
		display: flex;
		align-items: center;
		gap: 0.65rem;
	}

	/* ─── Stats ─── */
	.stats-strip {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		max-width: 1240px;
		margin: 5rem auto 0;
		padding: 2rem 1.5rem;
		border-top: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);
		gap: 1.5rem;
	}
	@media (max-width: 720px) {
		.stats-strip { grid-template-columns: repeat(2, 1fr); }
	}
	.stat { display: flex; flex-direction: column; gap: 0.2rem; }
	.stat-value {
		font-family: var(--font-header), sans-serif;
		font-size: clamp(2rem, 3.5vw, 2.7rem);
		font-weight: var(--font-weight-header, 500);
		line-height: 1;
		letter-spacing: var(--tracking-header, -0.02em);
	}
	.stat-label {
		font-size: 0.78rem;
		color: var(--color-foreground-muted);
		letter-spacing: 0.04em;
	}

	/* ─── Code × Callouts ─── */
	.codeshow {
		max-width: 1240px;
		margin: 6rem auto 0;
		padding: 0 1.5rem;
	}
	.codeshow-intro { max-width: 38rem; }
	.section-title {
		margin: 0.6rem 0 0.9rem;
		font-family: var(--font-header), sans-serif;
		font-size: clamp(1.7rem, 3vw, 2.3rem);
		font-weight: var(--font-weight-header, 500);
		letter-spacing: var(--tracking-header, -0.02em);
		line-height: 1.05;
	}
	.section-sub {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.7;
		color: var(--color-foreground-muted);
		max-width: 36rem;
	}
	.section-sub code {
		padding: 0.05rem 0.32rem;
		border-radius: 4px;
		background: var(--color-secondary);
		font-size: 0.86em;
		color: var(--color-foreground);
	}
	.codeshow-grid {
		margin-top: 2.5rem;
		display: grid;
		grid-template-columns: 1.3fr 1fr;
		gap: 2rem;
	}
	@media (max-width: 960px) {
		.codeshow-grid { grid-template-columns: 1fr; }
	}
	.codeshow-code {
		margin: 0;
		padding: 1.2rem 1.4rem;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		background: var(--color-card);
		font-size: 0.82rem;
		line-height: 1.65;
		overflow-x: auto;
		font-family: var(--font-mono), monospace;
	}
	.codeshow-callouts { display: flex; flex-direction: column; gap: 1.3rem; }
	.callout { display: flex; gap: 0.85rem; }
	.callout-num {
		flex-shrink: 0;
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--color-border);
		border-radius: 999px;
		font-family: var(--font-mono), monospace;
		font-size: 0.72rem;
		color: var(--color-foreground-muted);
		background: var(--color-card);
	}
	.callout-title {
		margin: 0 0 0.25rem;
		font-size: 0.98rem;
		font-weight: var(--font-weight-header, 500);
		letter-spacing: var(--tracking-header, -0.02em);
		color: var(--color-foreground);
	}
	.callout-body {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.55;
		color: var(--color-foreground-muted);
	}

	/* ─── Closer (full-bleed) ─── */
	.closer {
		margin: 7rem 0 0;
		padding: 0;
		width: 100%;
	}
	.closer-content {
		position: relative;
		overflow: hidden;
		padding: 5rem 1.5rem;
		border-top: 1px solid var(--color-border);
		border-bottom: 1px solid var(--color-border);
		border-radius: 0;
		background:
			radial-gradient(ellipse at top left, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 60%),
			radial-gradient(ellipse at bottom right, color-mix(in srgb, var(--color-accent) 16%, transparent), transparent 60%),
			var(--color-card);
		text-align: center;
	}
	@media (max-width: 640px) {
		.closer-content { padding: 3.5rem 1.25rem; }
	}
	.closer-inner {
		max-width: 56rem;
		margin: 0 auto;
	}
	.closer-title {
		margin: 0;
		font-family: var(--font-header), sans-serif;
		font-size: clamp(1.8rem, 3.5vw, 2.5rem);
		font-weight: var(--font-weight-header, 500);
		letter-spacing: var(--tracking-header, -0.02em);
		line-height: 1.05;
	}
	.closer-sub {
		margin: 0.7rem auto 0;
		max-width: 36rem;
		font-size: 1rem;
		line-height: 1.65;
		color: var(--color-foreground-muted);
	}
	.closer-cta {
		margin-top: 2rem;
		display: inline-flex;
		gap: 0.6rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	/* ─── Footer ─── */
	.footer {
		max-width: 1240px;
		margin: 6rem auto 0;
		padding: 1.5rem 1.5rem 0;
		border-top: 1px solid var(--color-border);
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1.5rem;
	}
	@media (max-width: 720px) {
		.footer { flex-direction: column; }
	}
	.footer-mark { margin: 0; font-weight: var(--font-weight-header, 600); letter-spacing: var(--tracking-header, -0.02em); }
	.footer-tag { margin: 0.3rem 0 0; font-size: 0.9rem; color: var(--color-foreground-muted); }
	.footer-nav { display: flex; gap: 1.3rem; flex-wrap: wrap; }
	.footer-nav a {
		font-size: 0.9rem;
		color: var(--color-foreground-muted);
		text-decoration: none;
		transition: color 160ms ease;
	}
	.footer-nav a:hover { color: var(--color-foreground); }

	@media (prefers-reduced-motion: reduce) {
		.reveal { opacity: 1; transform: none; filter: none; transition: none; }
	}
</style>
