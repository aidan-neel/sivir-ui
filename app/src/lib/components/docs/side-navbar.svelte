<script lang="ts">
	import { page } from '$app/stores';
	import { components, sanitizeComponent } from '$lib/components';
	import { Button } from '$lib/silk/components/button';
	import BookOpen from '@lucide/svelte/icons/book-open';
	import Download from '@lucide/svelte/icons/download';
	import Palette from '@lucide/svelte/icons/palette';
	import History from '@lucide/svelte/icons/history';

	let pageName = $state($page.url.pathname);
	let { class: classProp = '', onNavigate }: { class?: string; onNavigate?: () => void } = $props();

	const gettingStartedItems = [
		{ slug: 'introduction', label: 'Introduction', icon: BookOpen },
		{ slug: 'installation', label: 'Installation', icon: Download },
		{ slug: 'theming', label: 'Theming', icon: Palette },
		{ slug: 'changelog', label: 'Changelog', icon: History }
	];

	$effect(() => {
		pageName = $page.url.pathname;
	});

	function isActive(path: string) {
		return pageName === path;
	}
</script>

<aside class={`${classProp} flex flex-col overflow-y-auto pb-8`}>
	<div class="flex flex-col gap-5">
		<section class="flex flex-col gap-1.5">
			<h3
				class="px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground-muted/70"
			>
				Getting Started
			</h3>
			<div class="flex flex-col gap-0.5">
				{#each gettingStartedItems as item}
					{@const active = isActive(`/docs/${item.slug}`)}
					<Button
						variant="ghost"
						href={`/docs/${item.slug}`}
						onclick={onNavigate}
						class={`h-9 w-full justify-start gap-2 rounded-lg px-3 text-left text-sm transition-[background-color,color] ${
							active
								? 'bg-secondary/85 font-medium text-foreground'
								: 'text-foreground-muted hover:bg-secondary/55 hover:text-foreground'
						}`}
					>
						<item.icon size={14} class={active ? 'text-foreground' : 'text-foreground-muted'} />
						{item.label}
					</Button>
				{/each}
			</div>
		</section>

		<section class="flex flex-col gap-1.5">
			<div class="flex items-center justify-between px-2">
				<h3 class="text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground-muted/70">
					Components
				</h3>
				<span class="text-[11px] text-foreground-muted/70">{components.length}</span>
			</div>
			<div class="flex flex-col gap-0.5">
				{#each components as component}
					{@const active = pageName === `/docs/components/${component}`}
					<Button
						variant="ghost"
						href={`/docs/components/${component}`}
						onclick={onNavigate}
						class={`h-8.5 w-full justify-start rounded-lg px-3 text-left text-sm transition-[background-color,color] ${
							active
								? 'bg-secondary/85 font-medium text-foreground'
								: 'text-foreground-muted hover:bg-secondary/55 hover:text-foreground'
						}`}
					>
						{sanitizeComponent(component)}
					</Button>
				{/each}
			</div>
		</section>
	</div>
</aside>
