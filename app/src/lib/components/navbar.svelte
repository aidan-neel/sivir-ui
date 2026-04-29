<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { components, sanitizeComponent } from '$lib/components';
	import Button from '$lib/silk/components/button';
	import SideNavbar from '$lib/components/docs/side-navbar.svelte';
	import Shortcut from '$lib/silk/components/shortcut';
	import Logo from './logo.svelte';
	import Navbutton from './navbutton.svelte';
	import Menu from '@lucide/svelte/icons/menu';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import Moon from '@lucide/svelte/icons/moon';
	import Sun from '@lucide/svelte/icons/sun';
	import { toggleMode, mode } from 'mode-watcher';
	import * as Command from '$lib/silk/components/command';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Component from '@lucide/svelte/icons/component';
	import Download from '@lucide/svelte/icons/download';
	import Rocket from '@lucide/svelte/icons/rocket';
	import Globe from '@lucide/svelte/icons/globe';
	import History from '@lucide/svelte/icons/history';
	import LayoutTemplate from '@lucide/svelte/icons/layout-template';
	import Palette from '@lucide/svelte/icons/palette';
	import * as Sheet from '$lib/silk/components/sheet';

	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/docs/introduction', label: 'Docs' },
		{ href: '/docs/components', label: 'Components' },
		{ href: '/themes', label: 'Themes' }
	];

	const docsPages = [
		{
			title: 'Docs',
			description: 'Browse the documentation hub',
			href: '/docs',
			icon: BookOpen,
			keywords: 'docs documentation hub overview'
		},
		{
			title: 'Introduction',
			description: 'Overview and getting started with Silk UI',
			href: '/docs/introduction',
			icon: BookOpen,
			keywords: 'docs intro overview getting started'
		},
		{
			title: 'Installation',
			description: 'Install and set up the library',
			href: '/docs/installation',
			icon: Download,
			keywords: 'docs install setup package'
		},
		{
			title: 'Theming',
			description: 'Customize tokens, colors, and defaults',
			href: '/docs/theming',
			icon: Palette,
			keywords: 'docs theme tokens colors styling'
		},
		{
			title: 'Styling',
			description: 'Learn how to style and override Silk UI components',
			href: '/docs/styling',
			icon: Palette,
			keywords: 'docs styling css overrides classes tokens'
		},
		{
			title: 'Changelog',
			description: 'Recent releases and updates',
			href: '/docs/changelog',
			icon: History,
			keywords: 'docs release notes updates versions'
		},
		{
			title: 'Themes',
			description: 'Browse the theme presets gallery',
			href: '/themes',
			icon: LayoutTemplate,
			keywords: 'themes presets gallery showcase'
		},
		{
			title: 'Theme Studio',
			description: 'Build, preview, and export a custom theme',
			href: '/themes/studio',
			icon: LayoutTemplate,
			keywords: 'themes studio editor preview export customize'
		}
	];

	const componentPages = components.map((component) => {
		const title = sanitizeComponent(component);
		return {
			title,
			description: `${title} component docs`,
			href: `/docs/components/${component}`,
			icon: Component,
			keywords: `component docs ${component} ${title.toLowerCase()}`
		};
	});

	function navigateTo(href: string) {
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
		scrolled ? 'bg-background/58 backdrop-blur-[14px]' : 'bg-transparent'
	}`}
>
	<div
		class={`relative mx-auto flex h-16 w-full items-center justify-between px-4 md:px-8 ${
			$page.url.pathname.startsWith('/themes/studio')
				? 'max-w-none xl:px-10 2xl:px-12'
				: 'max-w-[1400px]'
		}`}
	>
		<Command.Root>
			<div class="flex min-w-0 flex-row items-center gap-4 md:gap-6">
				<a
					href="/"
					onclick={closeMobileMenu}
					class="flex min-w-0 flex-row items-center gap-3 rounded-lg px-1 py-2 text-sm font-semibold tracking-tight text-foreground transition-colors duration-150 hover:text-foreground"
				>
					<Logo />
					<span class="truncate">Silk UI</span>
				</a>
				<div class="hidden items-center gap-1 md:flex">
					{#each navItems as item}
						<Navbutton href={item.href}>{item.label}</Navbutton>
					{/each}
				</div>
			</div>

			<div class="flex flex-row items-center gap-1.5 md:gap-2">
				<div class="hidden md:block">
					<Command.Trigger
						class="h-9 w-72 justify-between rounded-md px-2.5 text-sm text-foreground-muted"
						variant="outlined"
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
				<Button
					class="hidden size-9 rounded-lg sm:inline-flex"
					variant="ghost"
					onclick={() =>
						window.open('https://github.com/aidan-neel/ui', '_blank', 'noopener,noreferrer')}
					size="icon"
					aria-label="Open GitHub repository"
				>
					<svg
						viewBox="0 0 24 24"
						aria-hidden="true"
						class="size-4 fill-none stroke-current"
						stroke-width="1.8"
					>
						<path
							d="M9 19c-4 1.2-4-2-6-2m12 4v-3.1a2.7 2.7 0 0 0-.8-2.1c2.7-.3 5.6-1.3 5.6-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.1s-1-.3-3.3 1.2a11.5 11.5 0 0 0-6 0C6.8 3.4 5.8 3.7 5.8 3.7a4.3 4.3 0 0 0-.1 3.1 4.7 4.7 0 0 0-1.3 3.2c0 4.7 2.9 5.7 5.6 6a2.7 2.7 0 0 0-.8 2.1V21"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</Button>
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
			</div>

			<Command.Content>
				<Command.Search placeholder="Search pages, docs, and components..." />
				<Command.Results>
					<Command.Group heading="Pages">
						<Command.Item name="Home landing page homepage main" callback={() => navigateTo('/')}>
							<Rocket class="text-foreground-muted" />
							<span>Home</span>
						</Command.Item>
						{#each docsPages as item}
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
						{#each componentPages as item}
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
							{#each navItems as item}
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
								variant="outlined"
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
</nav>
