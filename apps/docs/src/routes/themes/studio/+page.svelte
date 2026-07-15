<script lang="ts">
	import { onMount } from 'svelte';
	import { builtInThemePresets } from '@sivir/ui/themes/builtin-presets';
	import {
		DEFAULT_THEME,
		THEME_VERSION,
		densities,
		motionFeels,
		neutralTemperatures,
		parseTheme,
		radiusScales,
		themeToCss,
		type Theme
	} from '@sivir/ui/themes/theme';
	import {
		applyLiveThemeCss,
		clearLiveThemeCss,
		deleteLocalTheme,
		getSavedThemes,
		loadStudioTheme,
		saveLocalTheme,
		saveStudioTheme,
		type SavedTheme
	} from '@sivir/ui/themes/live';
	import { Button } from '@sivir/ui/components/button';
	import { Input } from '@sivir/ui/components/input';
	import { toast } from '@sivir/ui/components/toast';
	import type { PageData } from './$types';
	import Check from '@lucide/svelte/icons/check';
	import Clipboard from '@lucide/svelte/icons/clipboard';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Save from '@lucide/svelte/icons/save';
	import Send from '@lucide/svelte/icons/send';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	const { data = { themes: builtInThemePresets } as PageData }: { data?: PageData } = $props();
	const getCatalog = () => {
		const registryThemes = Array.isArray(data.themes) ? data.themes : [];
		const builtInSlugs = new Set(builtInThemePresets.map((theme) => theme.slug));
		return [
			...builtInThemePresets,
			...registryThemes.filter((theme) => !builtInSlugs.has(theme.slug))
		] as Theme[];
	};
	const catalog = getCatalog();

	let editorTheme = $state<Theme>({ ...DEFAULT_THEME });
	let savedThemes = $state<SavedTheme[]>([]);
	let activeSavedId = $state<string | undefined>();
	let isPublishing = $state(false);
	let copied = $state<'css' | 'json' | null>(null);
	let generatedCss = $state(themeToCss(DEFAULT_THEME));
	let generatedJson = $state(JSON.stringify(DEFAULT_THEME, null, 2));

	onMount(() => {
		const stored = loadStudioTheme();
		if (stored) editorTheme = stored;
		savedThemes = getSavedThemes();
	});

	$effect(() => {
		try {
			const theme = parseTheme(editorTheme);
			generatedCss = themeToCss(theme);
			generatedJson = JSON.stringify(theme, null, 2);
			applyLiveThemeCss(generatedCss);
			saveStudioTheme(theme);
		} catch {
			// Keep the last valid preview while a text field is mid-edit.
		}
	});

	function slugify(value: string) {
		return value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	function updateName(name: string) {
		editorTheme = { ...editorTheme, name, slug: slugify(name) || 'untitled-theme' };
	}

	function loadTheme(theme: Theme, savedId?: string) {
		editorTheme = parseTheme(theme);
		activeSavedId = savedId;
		toast({ title: `${theme.name} loaded`, duration: 1600, type: 'success' });
	}

	function resetTheme() {
		activeSavedId = undefined;
		editorTheme = { ...DEFAULT_THEME };
		clearLiveThemeCss();
		applyLiveThemeCss(themeToCss(editorTheme));
	}

	function saveTheme() {
		try {
			const saved = saveLocalTheme(parseTheme(editorTheme), activeSavedId);
			activeSavedId = saved.id;
			savedThemes = getSavedThemes();
			toast({ title: 'Theme saved on this device', duration: 1800, type: 'success' });
		} catch (error) {
			toast({
				title: 'Theme is not valid yet',
				description: error instanceof Error ? error.message : 'Check the theme fields.',
				type: 'error'
			});
		}
	}

	function removeTheme(id: string) {
		deleteLocalTheme(id);
		if (activeSavedId === id) activeSavedId = undefined;
		savedThemes = getSavedThemes();
	}

	async function copy(value: string, kind: 'css' | 'json') {
		if (!navigator.clipboard) return;
		await navigator.clipboard.writeText(value);
		copied = kind;
		setTimeout(() => {
			if (copied === kind) copied = null;
		}, 1600);
	}

	async function publishTheme() {
		isPublishing = true;
		try {
			const response = await fetch('/api/themes', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(parseTheme(editorTheme))
			});
			if (!response.ok) throw new Error((await response.text()) || 'Theme publishing failed.');
			toast({ title: 'Theme published', duration: 2200, type: 'success' });
		} catch (error) {
			toast({
				title: 'Could not publish theme',
				description: error instanceof Error ? error.message : 'Try again later.',
				type: 'error'
			});
		} finally {
			isPublishing = false;
		}
	}
</script>

<svelte:head>
	<title>Theme Studio · Sivir UI</title>
	<meta name="description" content="Create, preview, save, and publish a version-2 Sivir theme." />
</svelte:head>

<main class="mx-auto mt-16 w-full max-w-[1440px] px-4 py-10 md:px-8 md:py-14">
	<header
		class="mb-8 flex flex-col gap-5 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between"
	>
		<div class="max-w-2xl">
			<p class="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-foreground-muted">
				Theme contract v{THEME_VERSION}
			</p>
			<h1 class="m-0 text-4xl font-semibold tracking-tight text-foreground">Theme Studio</h1>
			<p class="mt-3 text-sm leading-6 text-foreground-muted">
				Tune the public theme axes. Every preview is the same versioned JSON accepted by the CLI and
				registry.
			</p>
		</div>
		<div class="flex flex-wrap gap-2">
			<Button variant="ghost" size="sm" onclick={resetTheme}>
				<RotateCcw size={14} /> Reset
			</Button>
			<Button variant="outline" size="sm" onclick={saveTheme}>
				<Save size={14} /> Save locally
			</Button>
			<Button size="sm" onclick={publishTheme} disabled={isPublishing}>
				<Send size={14} />
				{isPublishing ? 'Publishing…' : 'Publish'}
			</Button>
		</div>
	</header>

	<div
		class="grid gap-6 xl:grid-cols-[minmax(19rem,0.8fr)_minmax(32rem,1.4fr)_minmax(18rem,0.75fr)]"
	>
		<aside class="space-y-5">
			<section
				class="rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--card-shadow)]"
			>
				<h2 class="mb-4 text-sm font-semibold text-foreground">Preset</h2>
				<label class="grid gap-1.5 text-xs font-medium text-foreground-muted">
					Starting point
					<select
						class="h-9 w-full rounded-[var(--radius-md)] border border-border bg-field px-3 text-sm text-foreground focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
						value={editorTheme.slug}
						onchange={(event) => {
							const theme = catalog.find((item) => item.slug === event.currentTarget.value);
							if (theme) loadTheme(theme);
						}}
					>
						{#each catalog as theme (theme.slug)}
							<option value={theme.slug}>{theme.name}</option>
						{/each}
					</select>
				</label>
			</section>

			<section
				class="space-y-4 rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--card-shadow)]"
			>
				<h2 class="text-sm font-semibold text-foreground">Identity</h2>
				<label class="grid gap-1.5 text-xs font-medium text-foreground-muted">
					Name
					<Input
						value={editorTheme.name}
						oninput={(event) => updateName(event.currentTarget.value)}
					/>
				</label>
				<label class="grid gap-1.5 text-xs font-medium text-foreground-muted">
					Description
					<Input bind:value={editorTheme.description} />
				</label>
				<label class="grid gap-1.5 text-xs font-medium text-foreground-muted">
					Publisher
					<Input bind:value={editorTheme.publisher} placeholder="Your name" />
				</label>
				<p class="m-0 font-mono text-[0.72rem] text-foreground-muted">/{editorTheme.slug}</p>
			</section>
		</aside>

		<div class="space-y-6">
			<section
				class="rounded-[var(--radius-xl)] border border-border bg-background p-5 shadow-[var(--panel-shadow)] md:p-7"
			>
				<div class="mb-8 flex items-start justify-between gap-4">
					<div>
						<p class="m-0 text-xs text-foreground-muted">Live preview</p>
						<h2 class="mt-1 text-2xl font-semibold text-foreground">{editorTheme.name}</h2>
					</div>
					<span
						class="size-10 rounded-full border border-border"
						style={`background:${editorTheme.brand}`}
					></span>
				</div>
				<div class="grid gap-4 sm:grid-cols-2">
					<div
						class="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--card-shadow)]"
					>
						<p class="text-sm font-semibold text-foreground">Release checklist</p>
						<p class="mt-2 text-sm leading-6 text-foreground-muted">
							Preview panels, typography, focus, spacing, and motion with the exact generated
							tokens.
						</p>
						<div class="mt-5 flex flex-wrap gap-2">
							<Button size="sm">Primary action</Button>
							<Button variant="outline" size="sm">Secondary</Button>
						</div>
					</div>
					<div class="rounded-[var(--radius-lg)] border border-border bg-secondary p-5">
						<label class="grid gap-2 text-xs font-medium text-foreground-muted">
							Example field
							<Input placeholder="Theme-aware input" />
						</label>
						<div class="mt-5 h-2 overflow-hidden rounded-full bg-muted">
							<div class="h-full w-2/3 bg-primary"></div>
						</div>
					</div>
				</div>
			</section>

			<section
				class="grid gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5 sm:grid-cols-2"
			>
				<label class="grid gap-1.5 text-xs font-medium text-foreground-muted">
					Brand color
					<div class="flex gap-2">
						<input
							type="color"
							class="h-9 w-12 rounded-[var(--radius-md)] border border-border bg-field p-1"
							bind:value={editorTheme.brand}
							aria-label="Brand color picker"
						/>
						<Input class="font-mono" value={editorTheme.brand} readonly />
					</div>
				</label>
				<label class="grid gap-1.5 text-xs font-medium text-foreground-muted">
					Neutral temperature
					<select
						class="h-9 rounded-[var(--radius-md)] border border-border bg-field px-3 text-sm text-foreground"
						bind:value={editorTheme.neutral}
					>
						{#each neutralTemperatures as value (value)}<option {value}>{value}</option>{/each}
					</select>
				</label>
				<label class="grid gap-1.5 text-xs font-medium text-foreground-muted">
					Radius
					<select
						class="h-9 rounded-[var(--radius-md)] border border-border bg-field px-3 text-sm"
						bind:value={editorTheme.radius}
					>
						{#each radiusScales as value (value)}<option {value}>{value}</option>{/each}
					</select>
				</label>
				<label class="grid gap-1.5 text-xs font-medium text-foreground-muted">
					Density
					<select
						class="h-9 rounded-[var(--radius-md)] border border-border bg-field px-3 text-sm"
						bind:value={editorTheme.density}
					>
						{#each densities as value (value)}<option {value}>{value}</option>{/each}
					</select>
				</label>
				<label class="grid gap-1.5 text-xs font-medium text-foreground-muted">
					Motion
					<select
						class="h-9 rounded-[var(--radius-md)] border border-border bg-field px-3 text-sm"
						bind:value={editorTheme.motion}
					>
						{#each motionFeels as value (value)}<option {value}>{value}</option>{/each}
					</select>
				</label>
				<div class="grid gap-3">
					<label class="grid gap-1.5 text-xs font-medium text-foreground-muted"
						>Sans font<Input bind:value={editorTheme.fontSans} /></label
					>
					<label class="grid gap-1.5 text-xs font-medium text-foreground-muted"
						>Mono font<Input bind:value={editorTheme.fontMono} /></label
					>
					<label class="grid gap-1.5 text-xs font-medium text-foreground-muted"
						>Header font<Input bind:value={editorTheme.fontHeader} /></label
					>
				</div>
			</section>

			<section class="rounded-[var(--radius-lg)] border border-border bg-card p-4">
				<div class="mb-3 flex items-center justify-between">
					<h2 class="text-sm font-semibold text-foreground">Export</h2>
					<div class="flex gap-2">
						<Button variant="ghost" size="sm" onclick={() => copy(generatedCss, 'css')}>
							{#if copied === 'css'}<Check size={14} />{:else}<Clipboard size={14} />{/if} CSS
						</Button>
						<Button variant="ghost" size="sm" onclick={() => copy(generatedJson, 'json')}>
							{#if copied === 'json'}<Check size={14} />{:else}<Clipboard size={14} />{/if} JSON
						</Button>
					</div>
				</div>
				<pre
					class="max-h-64 overflow-auto rounded-[var(--radius-md)] bg-muted p-4 text-xs text-foreground"><code
						>{generatedCss}</code
					></pre>
			</section>
		</div>

		<aside>
			<section
				class="rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[var(--card-shadow)]"
			>
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-sm font-semibold text-foreground">Saved locally</h2>
					<span class="text-xs tabular-nums text-foreground-muted">{savedThemes.length}</span>
				</div>
				{#if savedThemes.length === 0}
					<p class="m-0 text-sm leading-6 text-foreground-muted">
						Saved version-2 themes stay in this browser.
					</p>
				{:else}
					<ul class="space-y-2">
						{#each savedThemes as theme (theme.id)}
							<li
								class="flex items-center gap-2 rounded-[var(--radius-md)] border border-border p-2"
							>
								<button class="min-w-0 flex-1 text-left" onclick={() => loadTheme(theme, theme.id)}>
									<span class="block truncate text-sm font-medium text-foreground"
										>{theme.name}</span
									>
									<span class="block truncate text-xs text-foreground-muted">{theme.brand}</span>
								</button>
								<button
									class="rounded p-1.5 text-foreground-muted hover:bg-muted hover:text-error"
									onclick={() => removeTheme(theme.id)}
									aria-label={`Delete ${theme.name}`}
								>
									<Trash2 size={14} />
								</button>
							</li>
						{/each}
					</ul>
				{/if}
			</section>
		</aside>
	</div>
</main>
