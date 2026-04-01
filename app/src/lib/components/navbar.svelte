<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/silk/components/button';
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
	import Calendar from '@lucide/svelte/icons/calendar';
	import Rocket from '@lucide/svelte/icons/rocket';
	import Mail from '@lucide/svelte/icons/mail';
	import User from '@lucide/svelte/icons/user';
	import Globe from '@lucide/svelte/icons/globe';
	import Settings from '@lucide/svelte/icons/settings';

	let scrolled = $state(false);
	let mobileMenuOpen = $state(false);

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/docs/introduction', label: 'Docs' },
		{ href: '/docs/components', label: 'Components' },
		{ href: '/themes', label: 'Themes' }
	];

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
	<div class="mx-auto flex h-16 w-full max-w-[1400px] items-center justify-between px-4 md:px-8">
		<div class="flex min-w-0 flex-row items-center gap-4 md:gap-6">
			<a
				href="/"
				onclick={closeMobileMenu}
				class="flex min-w-0 flex-row items-center gap-3 rounded-xl px-1 py-2 text-sm font-semibold tracking-tight text-foreground transition-colors duration-150 hover:text-foreground"
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
			<Command.Root>
				<div class="contents">
					<Command.Trigger class="hidden h-9 w-72 justify-between rounded-md px-2.5 text-sm text-foreground-muted md:flex" variant="outlined">
						Search docs...
						<Shortcut shortcut="/">
							/
						</Shortcut>
					</Command.Trigger>
					<Command.Trigger
						class="inline-flex size-9 items-center justify-center rounded-lg md:hidden"
						variant="ghost"
						aria-label="Search docs"
					>
						<Search size={16} />
					</Command.Trigger>
				</div>
				<Command.Content>
					<Command.Search />
					<Command.Results>
						<Command.Group heading="Suggestions">
							<Command.Item name="calendar">
								<Calendar class="text-foreground-muted" />
								Calendar
							</Command.Item>
							<Command.Item name="launch">
								<Rocket class="text-foreground-muted" />
								Launch
							</Command.Item>
							<Command.Item name="mail">
								<Mail class="text-foreground-muted" />
								Mail
							</Command.Item>
						</Command.Group>
						<Command.Separator />
						<Command.Group heading="Settings">
							<Command.Item name="settings">
								<User class="text-foreground-muted" />
								Profile
							</Command.Item>
							<Command.Item name="github">
								<Globe class="text-foreground-muted" />
								GitHub
							</Command.Item>
							<Command.Item name="settings">
								<Settings class="text-foreground-muted" />
								Settings
							</Command.Item>
						</Command.Group>
					</Command.Results>
				</Command.Content>
			</Command.Root>
			<Button
				class="hidden size-9 rounded-lg sm:inline-flex"
				variant="ghost"
				onclick={() => window.open('https://github.com/aidan-neel/ui', '_blank', 'noopener,noreferrer')}
				size="icon"
				aria-label="Open GitHub repository"
			>
				<svg viewBox="0 0 24 24" aria-hidden="true" class="size-4 fill-none stroke-current" stroke-width="1.8">
					<path d="M9 19c-4 1.2-4-2-6-2m12 4v-3.1a2.7 2.7 0 0 0-.8-2.1c2.7-.3 5.6-1.3 5.6-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.1s-1-.3-3.3 1.2a11.5 11.5 0 0 0-6 0C6.8 3.4 5.8 3.7 5.8 3.7a4.3 4.3 0 0 0-.1 3.1 4.7 4.7 0 0 0-1.3 3.2c0 4.7 2.9 5.7 5.6 6a2.7 2.7 0 0 0-.8 2.1V21" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</Button>
			<Button class="size-9 rounded-lg" variant="ghost" onclick={() => {
				toggleMode();
			}} size="icon">
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
				aria-controls="mobile-nav-panel"
			>
				{#if mobileMenuOpen}
					<X size={16} />
				{:else}
					<Menu size={16} />
				{/if}
			</Button>
		</div>
	</div>

	{#if mobileMenuOpen}
		<div class="bg-background/88 backdrop-blur-[18px] md:hidden" id="mobile-nav-panel">
			<div class="mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-4 py-4">
				<div class="grid gap-2">
					{#each navItems as item}
						<Navbutton href={item.href} mobile onclick={closeMobileMenu}>
							{item.label}
						</Navbutton>
					{/each}
				</div>

				<div class="flex items-center gap-2 pt-1">
					<Button
						class="h-10 flex-1 rounded-lg justify-center"
						variant="outlined"
						onclick={() => {
							window.open('https://github.com/aidan-neel/ui', '_blank', 'noopener,noreferrer');
							closeMobileMenu();
						}}
					>
						GitHub
					</Button>
					<Button
						class="h-10 flex-1 rounded-lg justify-center"
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
	{/if}
</nav>
