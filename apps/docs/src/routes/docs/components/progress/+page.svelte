<script lang="ts">
	import { Progress } from '@silk/ui/components/progress';
	import { highlight } from '$lib/highlight';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';
	import Hash from '@lucide/svelte/icons/hash';
	import { onMount } from 'svelte';

	const TITLE = 'Progress';
	const SLUG = 'progress';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	const apiRows = [
		{
			prop: 'value',
			type: 'number',
			default: '0',
			description: 'Current progress, clamped between 0 and `max`.'
		},
		{ prop: 'max', type: 'number', default: '100', description: 'Upper bound.' },
		{
			prop: 'indeterminate',
			type: 'boolean',
			default: 'false',
			description: 'Switch to a continuous looping animation when the duration is unknown.'
		}
	];

	let val = $state(28);
	onMount(() => {
		const id = setInterval(() => {
			val = (val + 4) % 100;
		}, 600);
		return () => clearInterval(id);
	});
</script>

<svelte:head
	><title>Silk · {TITLE}</title><meta
		name="description"
		content="Determinate and indeterminate progress bars."
	/></svelte:head
>

<DocHeader
	title={TITLE}
	description="Show how far along a task is. Skip the value to show a looping indicator for tasks of unknown duration."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'Determinate + Indeterminate' }]}
/>

<section class="pt-10">
	<div class="relative">
		<div
			class="absolute inset-x-10 -top-4 -z-10 h-32 rounded-full bg-[radial-gradient(60%_60%_at_50%_50%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_70%)] blur-2xl"
		></div>
		<div
			class="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-sm)]"
		>
			<div
				class="flex min-h-[10rem] flex-col items-center justify-center gap-6 border-b border-border/70 bg-secondary/30 p-8"
			>
				<div class="flex w-full max-w-md flex-col gap-2">
					<div class="flex items-center justify-between text-[0.78rem] text-foreground-muted">
						<span>Uploading…</span><span>{val}%</span>
					</div>
					<Progress value={val} />
				</div>
				<div class="flex w-full max-w-md flex-col gap-2">
					<span class="text-[0.78rem] text-foreground-muted">Indeterminate</span>
					<Progress indeterminate />
				</div>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(
						`<Progress value={28} />
<Progress indeterminate />`,
						'svelte'
					)}</code
				></pre>
		</div>
	</div>
</section>

<div class="flex flex-col gap-16 pt-16">
	<DocSection icon={Hash} title="API">
		<PropTable rows={apiRows} />
	</DocSection>

	<DocFooter />
</div>

<DocPager slug={SLUG} />
