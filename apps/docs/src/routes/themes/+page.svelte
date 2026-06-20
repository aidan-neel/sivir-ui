<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { builtInThemePresets } from '@silk/ui/themes/builtin-presets';
	import { Button } from '@silk/ui/components/button';
	import { Input } from '@silk/ui/components/input';
	import { Badge } from '@silk/ui/components/badge';
	import { Switch } from '@silk/ui/components/switch';
	import { Progress } from '@silk/ui/components/progress';
	import * as Select from '@silk/ui/components/select';
	import * as Alert from '@silk/ui/components/alert';
	import * as Modal from '@silk/ui/components/modal';
	import * as Avatar from '@silk/ui/components/avatar';
	import { toast } from '@silk/ui/components/toast';
	import { applyLiveThemeCss, saveThemeStudioState } from '@silk/ui/themes/live';
	import {
		themeToCss,
		themeToTypeScriptPreset,
		type ThemeBasePalette,
		type ThemeDraft,
		type ThemePalette
	} from '@silk/ui/themes/presets';
	import type { RegistryTheme } from '$lib/server/theme-registry';

	import Search from '@lucide/svelte/icons/search';
	import Sparkles from '@lucide/svelte/icons/sparkles';
	import Wand from '@lucide/svelte/icons/wand-sparkles';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import User from '@lucide/svelte/icons/user';
	import Calendar from '@lucide/svelte/icons/calendar';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import Inbox from '@lucide/svelte/icons/inbox';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import Type from '@lucide/svelte/icons/type';
	import Zap from '@lucide/svelte/icons/zap';
	import FileCode from '@lucide/svelte/icons/file-code';
	import Braces from '@lucide/svelte/icons/braces';

	type SortKey = 'recent' | 'name' | 'oldest';

	let searchQuery = $state('');
	let sortBy = $state<SortKey>('recent');

	// ─── Client-side registry fetch ───
	let themes = $state<RegistryTheme[]>([]);
	let loading = $state(true);
	let registryAvailable = $state(true);

	onMount(async () => {
		try {
			const res = await fetch('/api/themes');
			if (!res.ok) throw new Error(`registry responded ${res.status}`);
			const all = (await res.json()) as RegistryTheme[];
			const builtInSlugs = new Set(builtInThemePresets.map((preset) => preset.slug));
			themes = all.filter((theme) => !builtInSlugs.has(theme.slug));
		} catch {
			registryAvailable = false;
		} finally {
			loading = false;
		}
	});

	const sortLabels: Record<SortKey, string> = {
		recent: 'Newest first',
		name: 'Alphabetical',
		oldest: 'Oldest first'
	};

	const filteredThemes = $derived.by(() => {
		const needle = searchQuery.trim().toLowerCase();
		const base = themes.filter((theme) => {
			if (!needle) return true;
			const haystack = [theme.name, theme.description, theme.publisher ?? '']
				.join(' ')
				.toLowerCase();
			return haystack.includes(needle);
		});
		const sorted = [...base];
		if (sortBy === 'name') {
			sorted.sort((a, b) => a.name.localeCompare(b.name));
		} else if (sortBy === 'oldest') {
			sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
		} else {
			sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
		}
		return sorted;
	});

	function formatPublishedDate(iso: string) {
		const date = new Date(iso);
		if (Number.isNaN(date.getTime())) return 'Unknown';
		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function basePaletteFrom(palette: ThemePalette): ThemeBasePalette {
		return {
			background: palette.background,
			card: palette.card,
			text: palette.foreground,
			primary: palette.primary,
			secondary: palette.secondary,
			border: palette.border
		};
	}

	function fontPrimaryLabel(fontValue: string) {
		return fontValue
			.split(',')[0]
			.trim()
			.replace(/^["']|["']$/g, '');
	}

	function applyTheme(theme: ThemeDraft) {
		applyLiveThemeCss(themeToCss(theme));
		toast({
			title: `${theme.name} applied`,
			description: 'Live tokens updated across the app.',
			duration: 2000,
			type: 'success'
		});
	}

	// ─── Theme detail modal ───
	let detailOpen = $state(false);
	let detailTheme = $state<RegistryTheme | null>(null);
	let copiedKey = $state<'css' | 'ts' | 'json' | null>(null);
	let previewMode = $state<'light' | 'dark'>('light');

	function openDetail(theme: RegistryTheme) {
		detailTheme = theme;
		previewMode = 'light';
		copiedKey = null;
		detailOpen = true;
	}

	function copyValue(value: string, key: 'css' | 'ts' | 'json', label: string) {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return;
		void navigator.clipboard.writeText(value);
		copiedKey = key;
		toast({
			title: `${label} copied`,
			description: 'Paste it wherever you like.',
			duration: 1600,
			type: 'success'
		});
		setTimeout(() => {
			if (copiedKey === key) copiedKey = null;
		}, 1600);
	}

	const detailCss = $derived(detailTheme ? themeToCss(detailTheme) : '');
	const detailTs = $derived(detailTheme ? themeToTypeScriptPreset(detailTheme) : '');
	const detailJson = $derived(detailTheme ? JSON.stringify(detailTheme, null, 2) : '');

	// Build a CSS-var override style for the live preview panel so the embedded
	// components paint with this theme without affecting the rest of the app.
	// We override BOTH base color tokens AND the derived `--button-*` /
	// `--switch-*` tokens. Some browsers resolve component tokens against
	// `:root` eagerly (not at the consuming element), so overriding only
	// `--color-primary` here isn't always enough to retint Button/Badge/Switch.
	function paletteVars(palette: ThemePalette) {
		const primary = palette.primary;
		const secondary = palette.secondary;
		const success = palette.success;
		const warning = palette.warning;
		const error = palette.error;
		const fg = palette.foreground;
		const border = palette.border;
		return [
			// Base color tokens
			`--color-background:${palette.background}`,
			`--color-foreground:${fg}`,
			`--color-foreground-muted:${palette.foregroundMuted}`,
			`--color-foreground-btn:${palette.foregroundButton}`,
			`--color-card:${palette.card}`,
			`--color-secondary:${secondary}`,
			`--color-primary:${primary}`,
			`--color-accent:${palette.accent}`,
			`--color-success:${success}`,
			`--color-warning:${warning}`,
			`--color-error:${error}`,
			`--color-destructive:${palette.destructive}`,
			`--color-border:${border}`,
			`--color-info:${palette.info ?? primary}`,
			`--color-ring:${palette.ring}`,
			// Button tokens (derived from base; overridden so the cascade can't lose them)
			`--button-primary-bg:${primary}`,
			`--button-primary-foreground:${palette.foregroundButton}`,
			`--button-primary-hover-bg:color-mix(in srgb,${primary} 88%, black)`,
			`--button-secondary-bg:${secondary}`,
			`--button-secondary-foreground:${fg}`,
			`--button-secondary-border:${border}`,
			`--button-secondary-hover-bg:color-mix(in srgb,${secondary} 72%, ${border})`,
			`--button-outlined-bg:${palette.card}`,
			`--button-outlined-foreground:${fg}`,
			`--button-outlined-hover-bg:${secondary}`,
			`--button-ghost-bg:transparent`,
			`--button-ghost-foreground:${fg}`,
			`--button-ghost-hover-bg:${secondary}`,
			`--button-destructive-bg:${palette.destructive}`,
			`--button-destructive-foreground:#ffffff`,
			// Switch tokens
			`--switch-track-bg:color-mix(in srgb,${fg} 24%, ${palette.background})`,
			`--switch-thumb-bg:${palette.foregroundOpposite}`
		].join(';');
	}

	function openInStudio(theme: ThemeDraft) {
		// The studio's onMount restores from `silk-theme-studio-state` first and
		// only falls back to the live CSS, so we have to seed the full state to
		// guarantee the picked theme actually loads.
		saveThemeStudioState({
			selectedPresetSlug: theme.slug,
			editorTheme: JSON.parse(JSON.stringify(theme)) as ThemeDraft,
			editorName: theme.name,
			headerFontSelection: fontPrimaryLabel(theme.fontHeader),
			bodyFontSelection: fontPrimaryLabel(theme.fontSans),
			lightBasePalette: basePaletteFrom(theme.light),
			darkBasePalette: basePaletteFrom(theme.dark)
		});
		applyLiveThemeCss(themeToCss(theme));
		void goto(resolve('/themes/studio'));
	}
</script>

<svelte:head>
	<title>Silk · Theme Registry</title>
	<meta name="description" content="Browse community themes published to the Silk UI registry." />
</svelte:head>

<div class="mt-16 min-h-[calc(100vh-4rem)] bg-background">
	<!-- ─── Hero ─── -->
	<section class="border-b border-border/60">
		<div class="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-14 md:px-8 md:py-20">
			<div class="mx-auto flex w-full max-w-[44rem] flex-col items-center gap-3 text-center">
				<div
					class="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/80 bg-card/60 px-2.5 py-1 text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted backdrop-blur"
				>
					<Sparkles size={11} class="text-primary" />
					Community registry
				</div>
				<h1
					class="m-0 text-[2.9rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-[1.05] tracking-tight md:text-[3.6rem]"
					style="font-family: var(--font-header);"
				>
					Themes from the community.
				</h1>
				<p class="m-0 max-w-[42rem] text-[0.95rem] leading-relaxed text-foreground-muted">
					Explore unofficial themes published by Silk users. Apply one with a click, or open it in
					the studio to make it your own.
				</p>
			</div>

			<div
				class="mx-auto flex w-full max-w-[44rem] flex-col items-stretch gap-2.5 sm:flex-row sm:items-center"
			>
				<div class="relative flex-1">
					<Search
						size={14}
						class="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-foreground-muted"
					/>
					<Input
						variant="outline"
						class="pl-9"
						placeholder="Search themes, authors, descriptions…"
						bind:value={searchQuery}
					/>
				</div>
				<div class="flex items-center gap-2">
					<Select.Root value={sortBy} class="">
						<Select.Trigger class="h-9 min-w-[10rem] gap-1.5 text-[0.82rem]" variant="outline">
							{sortLabels[sortBy]}
						</Select.Trigger>
						<Select.Content class="">
							<Select.Item value="recent" onclick={() => (sortBy = 'recent')}>
								{sortLabels.recent}
							</Select.Item>
							<Select.Item value="name" onclick={() => (sortBy = 'name')}>
								{sortLabels.name}
							</Select.Item>
							<Select.Item value="oldest" onclick={() => (sortBy = 'oldest')}>
								{sortLabels.oldest}
							</Select.Item>
						</Select.Content>
					</Select.Root>
					<Button
						variant="primary"
						size="sm"
						class="h-9 gap-1.5 text-[0.82rem]"
						onclick={() => void goto(resolve('/themes/studio'))}
					>
						<Wand size={13} />
						Open studio
					</Button>
				</div>
			</div>

			<div
				class="mx-auto flex w-full max-w-[44rem] flex-wrap items-center justify-center gap-3 text-[0.78rem] text-foreground-muted"
			>
				{#if loading}
					<span class="inline-flex items-center gap-2">
						<span class="size-1.5 animate-pulse rounded-full bg-foreground-muted"></span>
						Loading registry…
					</span>
				{:else}
					<span>
						<span
							class="[font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
							>{themes.length}</span
						>
						{themes.length === 1 ? 'theme' : 'themes'} in the registry
					</span>
					{#if searchQuery.trim()}
						<span aria-hidden="true">·</span>
						<span>
							<span
								class="[font-weight:var(--font-weight-label,600)] [letter-spacing:var(--tracking-label,0em)] text-foreground"
								>{filteredThemes.length}</span
							>
							matching "{searchQuery.trim()}"
						</span>
					{/if}
				{/if}
			</div>
		</div>
	</section>

	<!-- ─── Grid ─── -->
	<section class="mx-auto w-full max-w-[1440px] px-4 py-10 md:px-8 md:py-14">
		{#if loading}
			<ul
				class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
				aria-busy="true"
				aria-label="Loading themes"
			>
				{#each Array.from({ length: 6 }) as _, i (i)}
					<li
						class="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card"
					>
						<!-- Preview tile placeholder -->
						<div class="grid grid-cols-2 gap-px bg-border/60">
							{#each Array.from({ length: 2 }) as _, j (j)}
								<div class="flex flex-col gap-3 bg-card px-3 py-4">
									<div class="flex items-center justify-between">
										<span class="silk-skeleton h-2 w-10 rounded-full"></span>
										<span class="silk-skeleton size-2 rounded-full"></span>
									</div>
									<div class="flex flex-1 items-end gap-1">
										<span class="silk-skeleton h-6 flex-1 rounded-[3px]"></span>
										<span class="silk-skeleton h-6 flex-1 rounded-[3px]"></span>
										<span class="silk-skeleton h-6 flex-1 rounded-[3px]"></span>
										<span class="silk-skeleton h-6 flex-1 rounded-[3px]"></span>
									</div>
									<span class="silk-skeleton h-2.5 w-16 rounded-full"></span>
								</div>
							{/each}
						</div>

						<!-- Body placeholder -->
						<div class="flex flex-1 flex-col gap-3 px-4 py-4">
							<div class="flex items-start justify-between gap-2">
								<div class="flex min-w-0 flex-col gap-1.5">
									<span class="silk-skeleton h-3.5 w-32 rounded-full"></span>
									<span class="silk-skeleton h-2.5 w-20 rounded-full"></span>
								</div>
								<span class="silk-skeleton h-5 w-12 shrink-0 rounded-full"></span>
							</div>
							<div class="flex flex-col gap-1.5">
								<span class="silk-skeleton h-2.5 w-full rounded-full"></span>
								<span class="silk-skeleton h-2.5 w-4/5 rounded-full"></span>
							</div>
							<div class="flex items-center gap-3">
								<span class="silk-skeleton h-2.5 w-20 rounded-full"></span>
								<span class="silk-skeleton h-2.5 w-24 rounded-full"></span>
							</div>
						</div>

						<!-- Actions placeholder -->
						<div
							class="mt-auto flex items-center justify-between gap-2 border-t border-border/70 px-3 py-2.5"
						>
							<span class="silk-skeleton h-7 w-14 rounded-[var(--radius-md)]"></span>
							<span class="silk-skeleton h-7 w-28 rounded-[var(--radius-md)]"></span>
						</div>
					</li>
				{/each}
			</ul>
		{:else if !registryAvailable}
			<Alert.Root variant="warning">
				<Alert.Title>Registry unavailable</Alert.Title>
				<Alert.Description>
					Couldn't reach the theme registry. Check that the service is running, then refresh.
				</Alert.Description>
			</Alert.Root>
		{:else if filteredThemes.length === 0}
			<div
				class="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-border/80 bg-card/40 px-6 py-14 text-center"
			>
				<div
					class="grid size-12 place-items-center rounded-full bg-secondary text-foreground-muted"
				>
					<Inbox size={20} />
				</div>
				<div class="flex flex-col gap-1">
					<p
						class="m-0 text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
					>
						No themes match your search
					</p>
					<p class="m-0 text-[0.84rem] text-foreground-muted">
						{searchQuery.trim()
							? 'Try a different keyword, or clear your search.'
							: 'The registry is empty right now. Publish one from the studio to seed it.'}
					</p>
				</div>
				{#if searchQuery.trim()}
					<Button variant="ghost" size="sm" onclick={() => (searchQuery = '')}>Clear search</Button>
				{:else}
					<Button size="sm" onclick={() => void goto(resolve('/themes/studio'))}>
						<Wand size={13} />
						Publish from studio
					</Button>
				{/if}
			</div>
		{:else}
			<ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each filteredThemes as theme (theme.slug)}
					{@const publisher = theme.publisher?.trim() || 'Anonymous'}
					{@const published = formatPublishedDate(theme.createdAt)}
					<li
						class="group flex cursor-pointer flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card transition-[border-color,box-shadow,transform] [transition-duration:var(--motion-duration-hover)] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-border-strong hover:shadow-[var(--shadow-sm)]"
						onclick={() => openDetail(theme)}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								openDetail(theme);
							}
						}}
						role="button"
						tabindex="0"
					>
						<!-- Preview tile -->
						<div class="grid grid-cols-2 gap-px bg-border/60">
							<!-- Light mode -->
							<div
								class="flex flex-col gap-3 px-3 py-4"
								style={`background:${theme.light.background};color:${theme.light.foreground};`}
							>
								<div class="flex items-center justify-between">
									<span
										class="inline-flex items-center gap-1 text-[0.62rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] opacity-70"
									>
										<Sun size={10} />
										Light
									</span>
									<span
										class="size-2 rounded-full"
										style={`background:${theme.light.primary};`}
										aria-hidden="true"
									></span>
								</div>
								<div class="flex flex-1 items-end gap-1">
									<span
										class="h-6 flex-1 rounded-[3px]"
										style={`background:${theme.light.primary};`}
										aria-hidden="true"
									></span>
									<span
										class="h-6 flex-1 rounded-[3px]"
										style={`background:${theme.light.secondary};`}
										aria-hidden="true"
									></span>
									<span
										class="h-6 flex-1 rounded-[3px]"
										style={`background:${theme.light.card};border:1px solid ${theme.light.border};`}
										aria-hidden="true"
									></span>
									<span
										class="h-6 flex-1 rounded-[3px]"
										style={`background:${theme.light.accent};`}
										aria-hidden="true"
									></span>
								</div>
								<span
									class="truncate text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
									style={`font-family:${theme.fontHeader};`}
								>
									Aa Bb · 123
								</span>
							</div>
							<!-- Dark mode -->
							<div
								class="flex flex-col gap-3 px-3 py-4"
								style={`background:${theme.dark.background};color:${theme.dark.foreground};`}
							>
								<div class="flex items-center justify-between">
									<span
										class="inline-flex items-center gap-1 text-[0.62rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] opacity-70"
									>
										<Moon size={10} />
										Dark
									</span>
									<span
										class="size-2 rounded-full"
										style={`background:${theme.dark.primary};`}
										aria-hidden="true"
									></span>
								</div>
								<div class="flex flex-1 items-end gap-1">
									<span
										class="h-6 flex-1 rounded-[3px]"
										style={`background:${theme.dark.primary};`}
										aria-hidden="true"
									></span>
									<span
										class="h-6 flex-1 rounded-[3px]"
										style={`background:${theme.dark.secondary};`}
										aria-hidden="true"
									></span>
									<span
										class="h-6 flex-1 rounded-[3px]"
										style={`background:${theme.dark.card};border:1px solid ${theme.dark.border};`}
										aria-hidden="true"
									></span>
									<span
										class="h-6 flex-1 rounded-[3px]"
										style={`background:${theme.dark.accent};`}
										aria-hidden="true"
									></span>
								</div>
								<span
									class="truncate text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
									style={`font-family:${theme.fontHeader};`}
								>
									Aa Bb · 123
								</span>
							</div>
						</div>

						<!-- Body -->
						<div class="flex flex-1 flex-col gap-3 px-4 py-4">
							<div class="flex items-start justify-between gap-2">
								<div class="min-w-0">
									<h3
										class="m-0 truncate text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-tight tracking-tight"
										style="font-family: var(--font-header);"
									>
										{theme.name}
									</h3>
									<p class="m-0 mt-0.5 text-[0.72rem] text-foreground-muted">
										{theme.slug}
									</p>
								</div>
								<Badge variant="outline" class="shrink-0 text-[0.66rem]">
									{theme.durationPreset}
								</Badge>
							</div>
							<p
								class="m-0 text-[0.82rem] leading-relaxed text-foreground-muted line-clamp-2 min-h-[2.6rem]"
							>
								{theme.description}
							</p>
							<div class="flex items-center gap-3 text-[0.72rem] text-foreground-muted">
								<span class="inline-flex items-center gap-1">
									<User size={11} />
									{publisher}
								</span>
								<span aria-hidden="true">·</span>
								<span class="inline-flex items-center gap-1">
									<Calendar size={11} />
									{published}
								</span>
							</div>
						</div>

						<!-- Actions -->
						<div
							class="mt-auto flex items-center justify-between gap-2 border-t border-border/70 px-3 py-2.5"
							onclick={(e) => e.stopPropagation()}
							onkeydown={(e) => e.stopPropagation()}
							role="presentation"
						>
							<Button
								variant="ghost"
								size="sm"
								class="h-8 text-[0.78rem]"
								onclick={() => applyTheme(theme)}
							>
								Apply
							</Button>
							<Button
								variant="outline"
								size="sm"
								class="h-8 gap-1.5 text-[0.78rem]"
								onclick={() => openInStudio(theme)}
							>
								Open in studio
								<ArrowUpRight size={12} />
							</Button>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>

	<!-- ═══════════════════ DETAIL MODAL ═══════════════════ -->
	<Modal.Root bind:open={detailOpen}>
		<Modal.Content
			class="!w-full !max-w-[min(72rem,calc(100vw-1.5rem))] !max-h-[calc(100vh-2rem)] !top-[50%] gap-0 overflow-hidden p-0"
		>
			{#if detailTheme}
				{@const t = detailTheme}
				{@const palette = previewMode === 'light' ? t.light : t.dark}
				{@const previewStyle = `${paletteVars(palette)};--font-header:${t.fontHeader};--font-sans:${t.fontSans};--font-mono:${t.fontMono};--radius-md:${t.radiusMd};--radius-lg:${t.radiusLg}`}

				<div
					class="grid h-[min(80vh,44rem)] grid-cols-[1fr_22rem] max-md:h-auto max-md:grid-cols-1 max-md:max-h-[calc(100vh-2rem)]"
				>
					<!-- ─── LEFT: live preview ─── -->
					<section
						class="silk-theme-preview flex min-h-0 flex-col overflow-y-auto"
						style={previewStyle}
					>
						<header
							class="flex items-center justify-between gap-3 border-b px-5 py-3.5"
							style="border-color: var(--color-border); background: var(--color-background);"
						>
							<div class="flex items-center gap-2">
								<span class="size-2.5 rounded-full" style="background: var(--color-primary);"
								></span>
								<span class="font-mono text-[0.78rem]" style="color: var(--color-foreground-muted);"
									>{t.slug}</span
								>
							</div>
							<div
								class="flex items-center gap-1 rounded-full border p-0.5"
								style="border-color: var(--color-border); background: var(--color-card);"
							>
								<button
									type="button"
									onclick={() => (previewMode = 'light')}
									class={`inline-flex h-6 items-center gap-1 rounded-full px-2 text-[0.72rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] transition-colors ${previewMode === 'light' ? '' : 'opacity-60'}`}
									style={previewMode === 'light'
										? 'background: var(--color-secondary); color: var(--color-foreground);'
										: 'color: var(--color-foreground-muted);'}
								>
									<Sun size={11} />Light
								</button>
								<button
									type="button"
									onclick={() => (previewMode = 'dark')}
									class={`inline-flex h-6 items-center gap-1 rounded-full px-2 text-[0.72rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] transition-colors ${previewMode === 'dark' ? '' : 'opacity-60'}`}
									style={previewMode === 'dark'
										? 'background: var(--color-secondary); color: var(--color-foreground);'
										: 'color: var(--color-foreground-muted);'}
								>
									<Moon size={11} />Dark
								</button>
							</div>
						</header>

						<div
							class="flex-1 px-6 py-6"
							style="background: var(--color-background); color: var(--color-foreground);"
						>
							<!-- Title slab -->
							<div class="mb-6 flex flex-col gap-2">
								<h2
									class="m-0 text-[1.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] leading-tight tracking-[-0.025em]"
									style="font-family: var(--font-header);"
								>
									{t.name}
								</h2>
								<p
									class="m-0 max-w-[44rem] text-[0.92rem] leading-relaxed"
									style="color: var(--color-foreground-muted);"
								>
									{t.description}
								</p>
							</div>

							<!-- Swatches -->
							<div class="mb-6 grid grid-cols-6 gap-2 max-sm:grid-cols-3">
								{#each [{ name: 'Primary', color: palette.primary }, { name: 'Secondary', color: palette.secondary }, { name: 'Accent', color: palette.accent }, { name: 'Success', color: palette.success }, { name: 'Warning', color: palette.warning }, { name: 'Error', color: palette.error }] as s (s.name)}
									<div class="flex flex-col gap-1">
										<span
											class="h-12 w-full rounded-[var(--radius-md)] border"
											style={`background:${s.color}; border-color: var(--color-border);`}
										></span>
										<span class="text-[0.7rem]" style="color: var(--color-foreground-muted);"
											>{s.name}</span
										>
										<code
											class="font-mono text-[0.68rem]"
											style="color: var(--color-foreground-muted);">{s.color}</code
										>
									</div>
								{/each}
							</div>

							<!-- Components row 1 -->
							<div class="grid grid-cols-2 gap-3 max-sm:grid-cols-1">
								<div
									class="flex flex-col gap-2.5 rounded-[var(--radius-md)] border p-4"
									style="border-color: var(--color-border); background: var(--color-card);"
								>
									<div class="flex items-center gap-2.5">
										<Avatar.Root size="md"><Avatar.Fallback>AN</Avatar.Fallback></Avatar.Root>
										<div class="flex flex-col leading-tight">
											<span
												class="text-[0.86rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
												style="color: var(--color-foreground);">Aidan Neel</span
											>
											<span class="text-[0.74rem]" style="color: var(--color-foreground-muted);"
												>aidan@silk-ui.dev</span
											>
										</div>
										<Badge variant="primary" class="ml-auto px-2 text-[0.66rem]">Pro</Badge>
									</div>
									<div class="flex items-center justify-between text-[0.82rem]">
										<span style="color: var(--color-foreground);">Notifications</span>
										<Switch switched={true} aria-label="Notifications" />
									</div>
									<div class="flex flex-col gap-1.5">
										<div
											class="flex items-center justify-between text-[0.78rem]"
											style="color: var(--color-foreground-muted);"
										>
											<span>Storage</span>
											<span class="font-mono text-[0.7rem]">64 / 100 GB</span>
										</div>
										<Progress value={64} />
									</div>
								</div>

								<div
									class="flex flex-col gap-2.5 rounded-[var(--radius-md)] border p-4"
									style="border-color: var(--color-border); background: var(--color-card);"
								>
									<div
										class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
										style="color: var(--color-foreground);"
									>
										Buttons
									</div>
									<div class="flex flex-wrap gap-1.5">
										<Button size="sm" class="h-7 text-[0.74rem]">Primary</Button>
										<Button size="sm" variant="secondary" class="h-7 text-[0.74rem]"
											>Secondary</Button
										>
										<Button size="sm" variant="outline" class="h-7 text-[0.74rem]">Outline</Button>
										<Button size="sm" variant="ghost" class="h-7 text-[0.74rem]">Ghost</Button>
									</div>
									<div
										class="text-[0.78rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] pt-1"
										style="color: var(--color-foreground);"
									>
										Badges
									</div>
									<div class="flex flex-wrap gap-1.5">
										<Badge variant="primary" class="px-2 text-[0.66rem]">Primary</Badge>
										<Badge variant="outline" class="px-2 text-[0.66rem]">Outlined</Badge>
										<Badge variant="ghost" class="px-2 text-[0.66rem]">Ghost</Badge>
										<Badge variant="destructive" class="px-2 text-[0.66rem]">Destructive</Badge>
									</div>
								</div>
							</div>

							<!-- Typography -->
							<div
								class="mt-3 flex items-end justify-between gap-4 rounded-[var(--radius-md)] border p-4"
								style="border-color: var(--color-border); background: var(--color-card);"
							>
								<div class="flex flex-col gap-1">
									<span class="text-[0.7rem]" style="color: var(--color-foreground-muted);"
										>Header · {fontPrimaryLabel(t.fontHeader)}</span
									>
									<span
										class="text-[1.6rem] leading-none tracking-tight"
										style="font-family: var(--font-header);">The quick brown fox</span
									>
								</div>
								<div class="flex flex-col gap-1 text-right">
									<span class="text-[0.7rem]" style="color: var(--color-foreground-muted);"
										>Body · {fontPrimaryLabel(t.fontSans)}</span
									>
									<span class="text-[0.96rem]" style="font-family: var(--font-sans);"
										>jumps over the lazy dog</span
									>
								</div>
							</div>
						</div>
					</section>

					<!-- ─── RIGHT: metadata + actions ─── -->
					<aside
						class="flex min-h-0 flex-col overflow-hidden border-l border-border bg-card max-md:border-l-0 max-md:border-t"
					>
						<header class="flex items-start justify-between gap-2 border-b border-border px-5 py-4">
							<div class="flex min-w-0 flex-col gap-1">
								<h3
									class="m-0 truncate text-[1rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] tracking-tight"
									style="font-family: var(--font-header);"
								>
									{t.name}
								</h3>
								<p class="m-0 truncate text-[0.74rem] text-foreground-muted">
									by {t.publisher?.trim() || 'Anonymous'}
								</p>
							</div>
							<Modal.Close variant="ghost" size="icon" class="size-8 shrink-0" aria-label="Close">
								<X size={14} />
							</Modal.Close>
						</header>

						<div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
							<!-- Meta grid -->
							<dl class="grid grid-cols-2 gap-x-3 gap-y-3 text-[0.78rem]">
								<div class="flex flex-col gap-0.5">
									<dt
										class="text-[0.74rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
									>
										Slug
									</dt>
									<dd class="m-0 font-mono text-foreground">{t.slug}</dd>
								</div>
								<div class="flex flex-col gap-0.5">
									<dt
										class="text-[0.74rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
									>
										Published
									</dt>
									<dd class="m-0 text-foreground">{formatPublishedDate(t.createdAt)}</dd>
								</div>
								<div class="flex flex-col gap-0.5">
									<dt
										class="text-[0.74rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
									>
										Motion
									</dt>
									<dd class="m-0 inline-flex items-center gap-1 text-foreground">
										<Zap size={11} class="text-foreground-muted" />{t.durationPreset}
									</dd>
								</div>
								<div class="flex flex-col gap-0.5">
									<dt
										class="text-[0.74rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
									>
										Radius
									</dt>
									<dd class="m-0 font-mono text-foreground">{t.radiusLg}</dd>
								</div>
								<div class="col-span-2 flex flex-col gap-0.5">
									<dt
										class="text-[0.74rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
									>
										Fonts
									</dt>
									<dd class="m-0 inline-flex items-center gap-1.5 text-foreground">
										<Type size={11} class="text-foreground-muted" />{fontPrimaryLabel(t.fontHeader)} ·
										{fontPrimaryLabel(t.fontSans)}
									</dd>
								</div>
							</dl>

							<div class="border-t border-border"></div>

							<!-- Actions -->
							<div class="flex flex-col gap-2">
								<Button class="justify-start gap-2" onclick={() => applyTheme(t)}>
									<Sparkles size={14} />
									Apply theme
								</Button>
								<Button
									variant="outline"
									class="justify-start gap-2"
									onclick={() => openInStudio(t)}
								>
									<Wand size={14} />
									Open in studio
									<ArrowUpRight size={12} class="ml-auto" />
								</Button>

								<div
									class="my-1 text-[0.74rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] text-foreground-muted"
								>
									Export
								</div>

								<Button
									variant="ghost"
									class="justify-start gap-2"
									onclick={() => copyValue(detailCss, 'css', 'CSS')}
								>
									{#if copiedKey === 'css'}<Check
											size={14}
											class="text-[var(--color-success)]"
										/>{:else}<FileCode size={14} />{/if}
									Copy CSS
									<span class="ml-auto font-mono text-[0.66rem] text-foreground-muted">.css</span>
								</Button>
								<Button
									variant="ghost"
									class="justify-start gap-2"
									onclick={() => copyValue(detailTs, 'ts', 'TypeScript preset')}
								>
									{#if copiedKey === 'ts'}<Check
											size={14}
											class="text-[var(--color-success)]"
										/>{:else}<Copy size={14} />{/if}
									Copy TypeScript preset
									<span class="ml-auto font-mono text-[0.66rem] text-foreground-muted">.ts</span>
								</Button>
								<Button
									variant="ghost"
									class="justify-start gap-2"
									onclick={() => copyValue(detailJson, 'json', 'JSON')}
								>
									{#if copiedKey === 'json'}<Check
											size={14}
											class="text-[var(--color-success)]"
										/>{:else}<Braces size={14} />{/if}
									Copy raw JSON
									<span class="ml-auto font-mono text-[0.66rem] text-foreground-muted">.json</span>
								</Button>
							</div>
						</div>
					</aside>
				</div>
			{/if}
		</Modal.Content>
	</Modal.Root>
</div>

<style>
	.silk-skeleton {
		display: inline-block;
		background: linear-gradient(
			90deg,
			var(--skeleton-base) 0%,
			var(--skeleton-highlight) 50%,
			var(--skeleton-base) 100%
		);
		background-size: 200% 100%;
		animation: skeleton-loading 2s infinite ease-in-out;
	}
</style>
