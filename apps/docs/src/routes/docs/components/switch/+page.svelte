<script lang="ts">
	import { highlight } from '$lib/highlight';
	import { Switch } from '@silk/ui/components/switch';
	import { createCopy } from '$lib/copy.svelte';
	import DocHeader from '$lib/components/docs/doc-header.svelte';
	import DocSection from '$lib/components/docs/doc-section.svelte';
	import PropTable from '$lib/components/docs/prop-table.svelte';
	import DocFooter from '$lib/components/docs/doc-footer.svelte';
	import DocPager from '$lib/components/docs/doc-pager.svelte';

	import Copy from '@lucide/svelte/icons/copy';
	import Check from '@lucide/svelte/icons/check';
	import Hash from '@lucide/svelte/icons/hash';

	const TITLE = 'Switch';
	const SLUG = 'switch';
	const SOURCE = `https://github.com/aidan-neel/silk/tree/main/registry/silk/default/${SLUG}`;
	const installCommand = `bunx @aidan-neel/ui add ${SLUG}`;

	let pgOn = $state(true);
	let pgLabel = $state('Push notifications');
	let pgDesc = $state('We will only ping you for mentions and replies.');

	const apiRows = [
		{ prop: 'switched', type: 'boolean', default: 'false', description: 'Bindable on/off state.' },
		{
			prop: 'label',
			type: 'string',
			default: '--',
			description: 'Label rendered to the right of the toggle.'
		},
		{
			prop: 'description',
			type: 'string',
			default: '--',
			description: 'Helper line in foreground-muted.'
		},
		{
			prop: 'disabled',
			type: 'boolean',
			default: 'false',
			description: 'Disable pointer + keyboard activation.'
		},
		{
			prop: 'class',
			type: 'string',
			default: '--',
			description: 'Classes applied to the track button.'
		}
	];

	const playgroundCode = $derived(
		`<Switch bind:switched={value} label="${pgLabel}" description="${pgDesc}" />`
	);

	const clip = createCopy();
</script>

<svelte:head>
	<title>Silk · Switch</title>
	<meta name="description" content="On/off toggle for system-level settings." />
</svelte:head>

<DocHeader
	title={TITLE}
	description="A toggle for things that take effect immediately — notifications, dark mode, auto-save. Pair it with a clear label so users know what they're enabling."
	source={SOURCE}
	install={installCommand}
	pills={[{ label: 'v0.4.2', variant: 'outlined' }, { label: 'Bindable' }]}
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
				class="grid min-h-[10rem] place-items-center border-b border-border/70 bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-secondary)_60%,transparent),transparent_70%)] p-8"
			>
				<Switch bind:switched={pgOn} label={pgLabel} description={pgDesc} />
			</div>

			<div class="flex flex-col divide-y divide-border/60">
				<div class="flex flex-col gap-2 px-6 py-4">
					<label
						for="pg-label"
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
						>Label</label
					>
					<input
						id="pg-label"
						bind:value={pgLabel}
						class="h-9 w-full max-w-[28rem] rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 text-[0.86rem] text-foreground outline-none focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
					/>
				</div>
				<div class="flex flex-col gap-2 px-6 py-4">
					<label
						for="pg-desc"
						class="text-[0.7rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
						>Description</label
					>
					<input
						id="pg-desc"
						bind:value={pgDesc}
						class="h-9 w-full rounded-[var(--radius-md)] border border-border bg-[var(--color-field)] px-3 text-[0.86rem] text-foreground outline-none focus:border-[var(--field-focus-border)] focus:shadow-[0_0_0_3px_var(--color-ring)]"
					/>
				</div>
			</div>

			<div
				class="flex items-center justify-between gap-2 border-t border-border/70 bg-secondary/40 px-6 py-2.5"
			>
				<span
					class="text-[0.66rem] [font-weight:var(--font-weight-label,500)] [letter-spacing:var(--tracking-label,0em)] uppercase tracking-wide text-foreground-muted"
					>Snippet</span
				>
				<button
					type="button"
					onclick={() => clip.copy(playgroundCode, 'playground')}
					class="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-[0.72rem] text-foreground-muted transition-colors hover:bg-secondary/60 hover:text-foreground"
				>
					{#if clip.copied('playground')}<Check
							size={11}
							class="text-[var(--color-success)]"
						/>Copied{:else}<Copy size={11} />Copy code{/if}
				</button>
			</div>
			<pre
				class="m-0 overflow-x-auto bg-secondary/40 px-6 py-4 font-mono text-[0.78rem] leading-relaxed text-foreground"><code
					>{@html highlight(playgroundCode, 'svelte')}</code
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
