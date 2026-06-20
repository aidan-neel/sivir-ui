<script lang="ts">
	import type { Snippet } from 'svelte';
	import CodeBlock from '$lib/components/docs/code-block.svelte';
	import { cn } from '@silk/ui/utils';
	import * as Tooltip from '@silk/ui/components/tooltip';
	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import { flyAndScale } from '@silk/ui/internals/transition';

	let {
		children,
		selectedTab = 1,
		code,
		class: classProp,
		...rest
	}: {
		children?: Snippet;
		selectedTab?: number;
		code: string;
		class?: string;
	} = $props();

	let copying = $state<boolean>(false);
</script>

<div class="flex flex-col gap-0" data-component-preview>
	<!-- Tabs -->
	<div class="flex flex-row gap-8 border-b border-border px-1">
		<button
			onclick={() => (selectedTab = 1)}
			class="pb-2 text-sm [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] transition-colors {selectedTab ===
			1
				? 'border-b-2 border-foreground text-foreground'
				: 'border-b-2 border-transparent text-foreground-muted hover:text-foreground'}"
		>
			Preview
		</button>
		<button
			onclick={() => (selectedTab = 2)}
			class="pb-2 text-sm [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] transition-colors {selectedTab ===
			2
				? 'border-b-2 border-foreground text-foreground'
				: 'border-b-2 border-transparent text-foreground-muted hover:text-foreground'}"
		>
			Code
		</button>
	</div>

	<!-- Content -->
	<div
		{...rest}
		class={cn(
			classProp,
			`border border-t-0 border-border rounded-b-[var(--radius-lg)] bg-card overflow-hidden w-full flex flex-col ${
				selectedTab === 1
					? 'items-center justify-center min-h-[22rem] p-10'
					: 'items-start justify-start relative'
			}`
		)}
	>
		<div class={cn(classProp, 'w-full relative flex items-center justify-center')}>
			{#if selectedTab === 1}
				{@render children?.()}
			{:else}
				<Tooltip.Root placement="top" delay={0}>
					<Tooltip.Trigger class="z-50 absolute top-3 right-3">
						<button
							type="button"
							class="inline-flex size-[var(--size-icon-md)] items-center justify-center rounded-lg border border-transparent text-foreground-muted transition-[background-color,border-color,color,box-shadow,transform] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-out)] hover:bg-secondary/50 hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)]"
							onclick={() => {
								copying = true;
								navigator.clipboard.writeText(code);
								setTimeout(() => {
									copying = false;
								}, 3000);
							}}
						>
							{#if copying}
								<div in:flyAndScale={{ duration: 400 }}>
									<Check size={16} class="text-[var(--color-success)]" />
								</div>
							{:else}
								<div in:flyAndScale={{ duration: 400 }}>
									<Copy size={16} />
								</div>
							{/if}
						</button>
					</Tooltip.Trigger>
					<Tooltip.Content>
						{#if copying}
							<div in:flyAndScale={{ duration: 400 }}>Copied</div>
						{:else}
							<div in:flyAndScale={{ duration: 400 }}>Copy to clipboard</div>
						{/if}
					</Tooltip.Content>
				</Tooltip.Root>
				<CodeBlock class="border-none" {code} />
			{/if}
		</div>
	</div>
</div>
