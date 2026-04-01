<script lang="ts">
	import type { Snippet } from 'svelte';
	import CodeBlock from '$lib/components/docs/code-block.svelte';
	import { cn } from '$lib/silk/utils';
    import * as Tooltip from '$lib/silk/components/tooltip';
    import Copy from "@lucide/svelte/icons/copy";
    import Check from "@lucide/svelte/icons/check";
	import { flyAndScale } from '$lib/silk/internals/transition';

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

<div class="flex flex-col gap-3">
	<div class="flex flex-row gap-4 px-1">
		<button
			onclick={() => (selectedTab = 1)}
			class="{selectedTab === 1
				? 'text-foreground'
				: 'text-foreground-muted'} text-sm font-medium duration-200"
		>
			Preview
		</button>
		<button
			onclick={() => (selectedTab = 2)}
			class="{selectedTab === 2
				? 'text-foreground'
				: 'text-foreground-muted'} text-sm font-medium duration-200"
		>
			Code
		</button>
	</div>
	<div
		{...rest}
		class={cn(
			classProp,
			`bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[var(--card-radius)] shadow-[inset_0_1px_0_var(--card-highlight),var(--card-shadow)] w-full rounded-xl border border-border/65 flex flex-col overflow-hidden max-w-full ${
				selectedTab === 1
					? 'items-center justify-center min-h-[20rem] px-6 py-16 md:px-10 md:py-20 bg-card/82'
					: 'items-start justify-start bg-card/82'
			}`
		)}
	>
		<div class={cn(classProp, 'w-full relative flex items-center justify-center')}>
			{#if selectedTab === 1}
				{@render children?.()}
			{:else}
				<Tooltip.Root placement={'top'} delay={0}>
					<Tooltip.Trigger class="z-50 absolute top-3 right-3">
						<button
							type="button"
							class="inline-flex size-8 items-center justify-center rounded-lg border border-transparent bg-[var(--button-ghost-bg)] text-[var(--button-ghost-foreground)] transition-[background-color,border-color,color,box-shadow,transform] duration-240 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[var(--button-ghost-hover-bg)] focus-visible:translate-y-px focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[0_0_0_3px_var(--color-ring)]"
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
									<Check size={18} class="text-foreground-muted" />
								</div>
							{:else}
								<div in:flyAndScale={{ duration: 400 }}>
									<Copy size={18} class="text-foreground-muted" />
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
				<CodeBlock {code} />
			{/if}
		</div>
	</div>
</div>
