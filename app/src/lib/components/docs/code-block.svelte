<script lang="ts">
	import { cn } from '$lib/silk/utils';
	import { mode } from 'mode-watcher';
	import { highlighter } from '$lib/highlighter';

	let {
		code,
		class: classProp,
		lang = 'svelte',
		...rest
	}: { code: string; class?: string; lang?: string } = $props();
	let html = $state('');
	let loaded = $state(false);

	$effect(() => {
		let active = true;

		void (async () => {
			let renderedHtml = '';
			try {
				renderedHtml = await highlighter.codeToHtml(code, {
					lang,
					theme: mode.current === 'dark' ? 'ui-dark' : 'ui-light'
				});
			} catch {
				renderedHtml = await highlighter.codeToHtml(code, {
					lang: 'txt',
					theme: mode.current === 'dark' ? 'ui-dark' : 'ui-light'
				});
			}

			if (!active) {
				return;
			}

			html = renderedHtml;
			loaded = true;
		})();

		return () => {
			active = false;
		};
	});
</script>

<div
	{...rest}
	class={cn(
		classProp,
		'bg-background border border-border border-dashed rounded-[var(--radius-lg)] shadow-[var(--outline-shadow)] h-fit w-full overflow-hidden rounded-lg p-0 text-[14px]',
		'[&_pre]:!m-0 [&_pre]:min-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-[inherit] [&_pre]:border-0 [&_pre]:bg-transparent [&_pre]:px-3 [&_pre]:py-2.5 [&_pre]:text-[12.5px] [&_pre]:leading-[1.2]',
		'[&_code]:font-[var(--font-mono)] [&_.line]:block [&_.line]:px-0 [&_.line.highlighted]:-mx-1.5 [&_.line.highlighted]:rounded-md [&_.line.highlighted]:bg-primary/6 [&_.line]:transition-colors'
	)}
>
	{#if loaded}
		<div class="w-full overflow-x-auto">{@html html}</div>
	{:else}
		<pre class="w-full px-3 py-0 font-mono opacity-0">{code}</pre>
	{/if}
</div>
