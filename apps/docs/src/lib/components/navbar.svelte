<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { ResolvedPathname } from '$app/types';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { components, sanitizeComponent } from '$lib/components';
	import Button from '@silk/ui/components/button';
	import SideNavbar from '$lib/components/docs/side-navbar.svelte';
	import Logo from './logo.svelte';
	import Navbutton from './navbutton.svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import X from '@lucide/svelte/icons/x';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { toggleMode, mode } from 'mode-watcher';
	import * as Command from '@silk/ui/components/command';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Component from '@lucide/svelte/icons/component';
	import Download from '@lucide/svelte/icons/download';
	import Rocket from '@lucide/svelte/icons/rocket';
	import Globe from '@lucide/svelte/icons/globe';
	import History from '@lucide/svelte/icons/history';
	import Palette from '@lucide/svelte/icons/palette';
	import * as Sheet from '@silk/ui/components/sheet';
	import GitHubBlack from '$lib/assets/GitHub_Invertocat_Black.svg';
	import GitHubWhite from '$lib/assets/GitHub_Invertocat_White.svg';

	const { starCount = null }: { starCount?: number | null } = $props();

	function formatStarCount(n: number | null): string {
		if (n === null || Number.isNaN(n)) return 'Star';
		if (n >= 1000) {
			const k = n / 1000;
			return `${k >= 10 ? Math.round(k) : k.toFixed(1)}k`;
		}
		return String(n);
	}

	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);
	const isStudio = $derived($page.url.pathname.startsWith('/themes/studio'));
	const isHome = $derived($page.url.pathname === '/');
	const isDocs = $derived($page.url.pathname.startsWith('/docs'));

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/docs/introduction', label: 'Docs' },
		{ href: '/docs/components', label: 'Components' }
	];

	const docsPages = [
		{
			title: 'Docs',
			description: 'Browse the documentation hub',
			href: resolve('/docs'),
			icon: BookOpen,
			keywords: 'docs documentation hub overview'
		},
		{
			title: 'Introduction',
			description: 'Overview and getting started with Silk UI',
			href: resolve('/docs/introduction'),
			icon: BookOpen,
			keywords: 'docs intro overview getting started'
		},
		{
			title: 'Installation',
			description: 'Install and set up the library',
			href: resolve('/docs/installation'),
			icon: Download,
			keywords: 'docs install setup package'
		},
		{
			title: 'Theming',
			description: 'Customize tokens, colors, and defaults',
			href: resolve('/docs/theming'),
			icon: Palette,
			keywords: 'docs theme tokens colors styling'
		},
		{
			title: 'Styling',
			description: 'Learn how to style and override Silk UI components',
			href: resolve('/docs/styling'),
			icon: Palette,
			keywords: 'docs styling css overrides classes tokens'
		},
		{
			title: 'Changelog',
			description: 'Recent releases and updates',
			href: resolve('/docs/changelog'),
			icon: History,
			keywords: 'docs release notes updates versions'
		}
	];

	const componentPages = components.map((component) => {
		const title = sanitizeComponent(component);
		return {
			title,
			description: `${title} component docs`,
			href: resolve('/docs/components/[...slug]', { slug: component }),
			icon: Component,
			keywords: `component docs ${component} ${title.toLowerCase()}`
		};
	});

	function navigateTo(href: ResolvedPathname) {
		void goto(href);
	}

	onMount(() => {
		const updateScroll = () => {
			scrolled = window.scrollY > 10;
		};

		updateScroll();
		window.addEventListener('scroll', updateScroll, { passive: true });

		return () => {
			window.removeEventListener('scroll', updateScroll);
		};
	});

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<nav
	class={`fixed inset-x-0 top-0 z-20 transition-[background-color,backdrop-filter] duration-200 ${
		isStudio
			? 'border-b border-border bg-background'
			: isDocs
				? 'bg-background/72 backdrop-blur-[14px]'
				: scrolled
					? 'bg-background/58 backdrop-blur-[14px]'
					: 'bg-transparent'
	}`}
>
	<div
		class={`relative mx-auto flex h-16 w-full items-center justify-between ${
			isStudio
				? 'max-w-none px-4'
				: isHome
					? 'nav-home-in max-w-[1400px] px-4 md:px-6'
					: isDocs
						? 'max-w-[1400px] px-4 md:px-6'
						: 'px-4 md:px-6'
		}`}
	>
		<Command.Root>
			<div class="flex min-w-0 flex-row items-center gap-4 md:gap-5">
				<Logo />
				<div class="hidden items-center gap-1 md:flex">
					{#each navItems as item (item.href)}
						<Navbutton href={item.href}>{item.label}</Navbutton>
					{/each}
				</div>
			</div>

			<div class="flex flex-row items-center gap-1.5 md:gap-2">
				<!--

<div class="hidden md:block">
					<Command.Trigger
						class="h-8 w-60 justify-between rounded-md px-2 text-[0.78rem] text-foreground-muted"
						variant="outline"
					>
						Search docs...
						<Shortcut shortcut="/">/</Shortcut>
					</Command.Trigger>
				</div>
				<Command.Trigger
					class="inline-flex size-9 items-center justify-center rounded-lg md:hidden"
					variant="ghost"
					aria-label="Search pages and docs"
				>
					<Search size={16} />
				</Command.Trigger>
-->

				<Button
					class="size-9 rounded-lg"
					variant="ghost"
					onclick={() => {
						toggleMode();
					}}
					size="icon"
				>
					{#if mode.current === 'dark'}
						<Moon size="16" />
					{:else}
						<Sun size="16" />
					{/if}
				</Button>
				<Button
					class="size-9 rounded-lg md:hidden"
					variant="ghost"
					size="icon"
					onclick={toggleMobileMenu}
					aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
					aria-expanded={mobileMenuOpen}
				>
					{#if mobileMenuOpen}
						<X size={16} />
					{:else}
						<Menu size={16} />
					{/if}
				</Button>

				<Button
					class="hidden h-9 gap-1.5 rounded-lg flex items-center! justify-center! px-3"
					variant="ghost"
					onclick={() =>
						window.open('https://github.com/aidan-neel/ui', '_blank', 'noopener,noreferrer')}
					aria-label="Star Silk UI on GitHub"
				>
					<img
						src={mode.current === 'dark' ? GitHubWhite : GitHubBlack}
						class="size-4 flex items-center justify-center"
					/>
					<span
						class="text-[14px] mt-[1px] font-mono text-foreground-muted [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)]"
						>{formatStarCount(starCount)}</span
					>
				</Button>
			</div>

			<Command.Content>
				<Command.Search placeholder="Search pages, docs, and components..." />
				<Command.Results>
					<Command.Group heading="Pages">
						<Command.Item
							name="Home landing page homepage main"
							callback={() => navigateTo(resolve('/'))}
						>
							<Rocket class="text-foreground-muted" />
							<span>Home</span>
						</Command.Item>
						{#each docsPages as item (item.href)}
							<Command.Item
								name={`${item.title} ${item.description} ${item.keywords}`}
								callback={() => navigateTo(item.href)}
							>
								<item.icon class="text-foreground-muted" />
								<span>{item.title}</span>
							</Command.Item>
						{/each}
					</Command.Group>
					<Command.Separator />
					<Command.Group heading="Components">
						{#each componentPages as item (item.href)}
							<Command.Item
								name={`${item.title} ${item.description} ${item.keywords}`}
								callback={() => navigateTo(item.href)}
							>
								<item.icon class="text-foreground-muted" />
								<span>{item.title}</span>
							</Command.Item>
						{/each}
					</Command.Group>
					<Command.Separator />
					<Command.Group heading="External">
						<Command.Item
							name="GitHub repository source code external"
							callback={() =>
								window.open('https://github.com/aidan-neel/ui', '_blank', 'noopener,noreferrer')}
						>
							<Globe class="text-foreground-muted" />
							<span>GitHub</span>
						</Command.Item>
					</Command.Group>
				</Command.Results>
			</Command.Content>
		</Command.Root>
	</div>
</nav>

<Sheet.Root bind:open={mobileMenuOpen}>
	<Sheet.Content
		side="left"
		class="w-[min(100vw,24rem)] max-w-[24rem] gap-0 overflow-hidden p-0 md:hidden"
	>
		<div class="flex h-full flex-col">
			<Sheet.Header class="border-b border-border/70 px-4 pb-4 pt-4">
				<Sheet.Title>Browse Silk UI</Sheet.Title>
				<Sheet.Description>
					Jump between pages, docs, and components from the same mobile menu.
				</Sheet.Description>
			</Sheet.Header>

			<div class="min-h-0 flex-1 overflow-y-auto">
				<div class="border-b border-border/60 px-4 py-4">
					<div class="grid gap-1.5">
						{#each navItems as item (item.href)}
							<Navbutton href={item.href} mobile onclick={closeMobileMenu}>
								{item.label}
							</Navbutton>
						{/each}
					</div>
				</div>

				<div class="px-3 py-4">
					<SideNavbar class="w-full pt-0" onNavigate={closeMobileMenu} />
				</div>

				<div class="border-t border-border/60 px-4 py-4">
					<div class="flex items-center gap-2">
						<Button
							class="h-10 flex-1 justify-center rounded-lg"
							variant="outline"
							onclick={() => {
								window.open('https://github.com/aidan-neel/ui', '_blank', 'noopener,noreferrer');
								closeMobileMenu();
							}}
						>
							GitHub
						</Button>
						<Button
							class="h-10 flex-1 justify-center rounded-lg"
							variant="secondary"
							onclick={() => {
								toggleMode();
							}}
						>
							{mode.current === 'dark' ? 'Dark mode' : 'Light mode'}
						</Button>
					</div>
				</div>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>

<style>
	@media (prefers-reduced-motion: no-preference) {
		:global(.nav-home-in) {
			animation: nav-home-in 0.6s var(--ease-out) 1.25s both;
		}
	}

	@keyframes nav-home-in {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
	}
</style>
