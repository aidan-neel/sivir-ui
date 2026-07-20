<script lang="ts">
	import { resolve } from '$app/paths';
	import { Button } from '@sivir/ui/components/button';
	import { Badge } from '@sivir/ui/components/badge';
	import * as Alert from '@sivir/ui/components/alert';
	import * as Tabs from '@sivir/ui/components/tabs';
	import { CodeBlock } from '@sivir/ui/components/code-block';

	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Palette from '@lucide/svelte/icons/palette';
	import Type from '@lucide/svelte/icons/type';
	import Square from '@lucide/svelte/icons/square';
	import Waypoints from '@lucide/svelte/icons/waypoints';
	import Layers from '@lucide/svelte/icons/layers-3';
	import Wand from '@lucide/svelte/icons/wand-sparkles';

	const layerCards = [
		{
			icon: Palette,
			tone: 'color',
			title: 'Color',
			body: 'Background, foreground, primary, border, ring -- the semantic layer the whole library reads from.',
			tokens: ['--color-background', '--color-foreground', '--color-primary', '--color-ring']
		},
		{
			icon: Type,
			tone: 'type',
			title: 'Typography',
			body: 'Three font families: body, headers, and mono. Switch one to re-skin everything below it.',
			tokens: ['--font-sans', '--font-header', '--font-mono']
		},
		{
			icon: Square,
			tone: 'radius',
			title: 'Radius',
			body: 'Soft corners through `--radius-*`. Set `--radius-lg` and most components inherit it.',
			tokens: ['--radius-md', '--radius-lg', '--radius-xl']
		},
		{
			icon: Waypoints,
			tone: 'motion',
			title: 'Motion',
			body: 'Durations and easing for hover, menus, panels, and sheets -- one source for how movement feels.',
			tokens: ['--motion-duration-hover', '--motion-duration-panel', '--motion-duration-sheet']
		}
	];

	const semanticCss = `@theme {
	--font-sans: 'Geist';
	--font-mono: 'Geist Mono';
	--font-header: 'Geist';

	--color-background: #fcfcfd;
	--color-foreground: #101828;
	--color-foreground-muted: #667085;
	--color-primary: #155eef;
	--color-border: #dde2ea;
	--color-input: #c9d1dc;
	--color-secondary: #f2f4f7;
	--color-panel: #ffffff;
	--color-card: #ffffff;
	--color-ring: rgb(21 94 239 / 0.18);

	--radius-md: 0.4rem;
	--radius-lg: 0.55rem;
	--radius-xl: 0.67rem;
}

.dark {
	--color-background: #0d1118;
	--color-foreground: #f5f7fb;
	--color-foreground-muted: #98a2b3;
	--color-primary: #7aa2ff;
	--color-border: #27303f;
	--color-secondary: #141b26;
	--color-panel: #171f2b;
	--color-card: #1a2431;
	--color-ring: rgb(122 162 255 / 0.22);
}`;

	const componentCss = `@theme {
	/* Cross-control sizing */
	--size-control-sm: 2rem;
	--size-control-md: 2.5rem;
	--size-control-lg: 2.75rem;

	/* Shared shape and elevation */
	--radius-md: 0.5rem;
	--radius-lg: 0.75rem;
	--radius-xl: 1rem;
	--elevation-1: 0 4px 12px rgb(16 24 40 / 0.08);
	--elevation-float: 0 18px 42px rgb(16 24 40 / 0.12);

	/* Shared motion */
	--motion-duration-panel: 240ms;
	--motion-duration-sheet: 320ms;
}`;

	const overrideCss = `[data-ui='button'][data-variant='primary'] {
	border-radius: 999px;
	letter-spacing: 0.01em;
}

[data-ui='toast'] {
	--color-border: color-mix(in srgb, var(--color-primary) 24%, var(--color-border));
	box-shadow: var(--elevation-float);
}

[data-ui='dropdown-menu-content'] {
	--color-panel: color-mix(in srgb, var(--color-panel) 90%, white);
}`;

	const presetCmd = 'bunx @sivir/ui add theme nordic';
	const importCss = `/* app.css — import after ui.css so the preset wins */
@import './lib/sivir/theme.css';`;

	const codeBlocks = {
		semantic: { code: semanticCss, lang: 'css' },
		component: { code: componentCss, lang: 'css' },
		overrides: { code: overrideCss, lang: 'css' }
	};

	let activeTab = $state('semantic');
</script>

<svelte:head>
	<title>Sivir · Theming</title>
	<meta
		name="description"
		content="Build a theme system that controls color, shape, motion, and surface tone from one place."
	/>
</svelte:head>

<div class="flex flex-col gap-10" data-docs-page>
	<header class="flex flex-col gap-5 border-b border-border/60 pb-10">
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="outline" class="gap-1.5 text-[0.66rem]">
				<Palette size={11} class="text-primary" />
				Theming
			</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">CSS tokens</Badge>
			<Badge variant="ghost" class="text-[0.66rem]">Light + dark</Badge>
		</div>

		<div class="flex flex-col gap-3">
			<h1
				class="m-0 max-w-[24ch] text-[1.875rem] font-[var(--font-weight-header,600)] tracking-[-0.02em] leading-tight"
				style="font-family: var(--font-header);"
			>
				One stylesheet. The whole library shifts.
			</h1>
			<p
				class="m-0 max-w-2xl text-[1rem] text-foreground-muted leading-relaxed font-[var(--font-weight-description,450)]"
			>
				Sivir reads every visual decision from CSS variables. Edit your token sheet, save, and every
				button, dialog, and dropdown updates in the same frame.
			</p>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			<Button href={resolve('/themes')}>
				Browse presets
				<ArrowRight size={14} />
			</Button>
			<Button href={resolve('/docs/styling')} variant="outline">Styling guide</Button>
		</div>
	</header>

	<!-- ─── Token surfaces ────────────────────────────────────────── -->
	<section class="pt-12 flex flex-col gap-5">
		<div class="flex items-center gap-2">
			<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
				<Layers size={12} />
			</span>
			<h2
				class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Four surfaces, one source
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			{#each layerCards as layer (layer.title)}
				<div
					class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5"
				>
					<div class="flex items-center justify-between">
						<span class="grid size-9 place-items-center rounded-md bg-secondary/60 text-foreground">
							<layer.icon size={15} />
						</span>
						<span
							class="text-[0.6rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-[0.14em] text-foreground-muted"
						>
							Layer · {layer.tone}
						</span>
					</div>
					<p
						class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
						style="font-family: var(--font-header);"
					>
						{layer.title}
					</p>
					<p class="m-0 text-[0.84rem] leading-relaxed text-foreground-muted">{layer.body}</p>
					<div class="flex flex-wrap gap-1.5 pt-1">
						{#each layer.tokens as token (token)}
							<code
								class="rounded-md border border-border/70 bg-secondary/40 px-1.5 py-0.5 font-mono text-[0.7rem] text-foreground-muted"
							>
								{token}
							</code>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- ─── Three layers — tabs ────────────────────────────────────── -->
	<section class="pt-12 flex flex-col gap-5">
		<div class="flex items-center gap-2">
			<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
				<Wand size={12} />
			</span>
			<h2
				class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Theme in three layers
			</h2>
		</div>
		<p class="m-0 max-w-[44rem] text-[0.92rem] leading-relaxed text-foreground-muted">
			Start at the top. Drop down a layer only when the one above isn't enough.
		</p>

		<Tabs.Root bind:value={activeTab} variant="segmented">
			<Tabs.List>
				<Tabs.Trigger value="semantic">1 · Semantic tokens</Tabs.Trigger>
				<Tabs.Trigger value="component">2 · Theme axes</Tabs.Trigger>
				<Tabs.Trigger value="overrides">3 · Per-component overrides</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="semantic">
				<p class="m-0 pb-3 text-[0.86rem] leading-relaxed text-foreground-muted">
					Think in interfaces, not components. Get background, foreground, primary, and border right
					and most of the library already feels cohesive.
				</p>
				<CodeBlock code={codeBlocks.semantic.code} lang={codeBlocks.semantic.lang} copy="overlay" />
			</Tabs.Content>

			<Tabs.Content value="component">
				<p class="m-0 pb-3 text-[0.86rem] leading-relaxed text-foreground-muted">
					Tune the public cross-component axes for control height, radius, elevation, and motion.
					Component geometry stays in Tailwind classes instead of private variables.
				</p>
				<CodeBlock
					code={codeBlocks.component.code}
					lang={codeBlocks.component.lang}
					copy="overlay"
				/>
			</Tabs.Content>

			<Tabs.Content value="overrides">
				<p class="m-0 pb-3 text-[0.86rem] leading-relaxed text-foreground-muted">
					When a single primitive needs special care, use the <code
						class="font-mono text-foreground">data-ui</code
					>
					and <code class="font-mono text-foreground">data-variant</code> hooks. Cleaner than forking.
				</p>
				<CodeBlock
					code={codeBlocks.overrides.code}
					lang={codeBlocks.overrides.lang}
					copy="overlay"
				/>
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<!-- ─── Two ways to author ────────────────────────────────────── -->
	<section class="pt-12 flex flex-col gap-5">
		<div class="flex items-center gap-2">
			<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
				<Wand size={12} />
			</span>
			<h2
				class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Author themes in CSS
			</h2>
		</div>

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5">
				<div class="flex items-center justify-between">
					<Badge variant="ghost">Presets</Badge>
					<Badge variant="outline" class="text-[0.62rem]">/themes</Badge>
				</div>
				<p
					class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
					style="font-family: var(--font-header);"
				>
					Browse and apply presets
				</p>
				<p class="m-0 text-[0.84rem] leading-relaxed text-foreground-muted">
					Explore built-in and community themes, apply them live, and copy CSS or JSON into your
					project.
				</p>
				<div class="pt-1">
					<Button href={resolve('/themes')} variant="outline" class="w-full justify-center">
						Browse themes
						<ArrowRight size={14} />
					</Button>
				</div>
			</div>

			<div class="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-card p-5">
				<div class="flex items-center justify-between">
					<Badge variant="ghost">Code</Badge>
					<Badge variant="outline" class="text-[0.62rem]">@theme + .dark</Badge>
				</div>
				<p
					class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
					style="font-family: var(--font-header);"
				>
					Write a theme by hand
				</p>
				<p class="m-0 text-[0.84rem] leading-relaxed text-foreground-muted">
					Drop tokens straight into <code class="font-mono text-foreground">app.css</code>. Light
					goes in <code class="font-mono text-foreground">@theme</code>, dark goes in
					<code class="font-mono text-foreground">.dark</code>. That's the whole API.
				</p>
				<div class="pt-1">
					<Button href="#layers" variant="outline" class="w-full justify-center"
						>See examples</Button
					>
				</div>
			</div>
		</div>
	</section>

	<!-- ─── Presets ───────────────────────────────────────────────── -->
	<section class="pt-12 flex flex-col gap-5">
		<div class="flex items-center gap-2">
			<span class="grid size-6 place-items-center rounded-md bg-primary/10 text-primary">
				<Palette size={12} />
			</span>
			<h2
				class="m-0 text-[1.4rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
				style="font-family: var(--font-header);"
			>
				Start from a preset
			</h2>
		</div>
		<p class="m-0 max-w-[44rem] text-[0.86rem] leading-relaxed text-foreground-muted">
			If a blank canvas is too much, install a preset and tweak from there.
		</p>

		<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
			<CodeBlock code={presetCmd} lang="shell" copy="overlay" />

			<CodeBlock code={importCss} lang="css" copy="overlay" />
		</div>

		<Alert.Root variant="info">
			<Alert.Title>Presets aren't a fork</Alert.Title>
			<Alert.Description>
				They're just <code class="font-mono text-foreground">@theme</code> blocks. Override any token
				beneath the import and yours wins.
			</Alert.Description>
		</Alert.Root>
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
				Ready to make it yours?
			</p>
			<p class="m-0 text-[0.86rem] text-foreground-muted">
				Browse a preset, dial in your tokens, and copy the CSS into your project.
			</p>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<Button href={resolve('/docs/styling')} variant="outline">Styling guide</Button>
			<Button href={resolve('/themes')}>
				Browse themes
				<ArrowRight size={14} />
			</Button>
		</div>
	</section>
</div>
