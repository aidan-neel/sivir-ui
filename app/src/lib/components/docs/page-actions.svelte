<script lang="ts" module>
	export type PageActionsSection = 'breadcrumbs' | 'actions';
</script>

<script lang="ts">
	import * as Breadcrumb from '$lib/silk/components/breadcrumb';
	import { Badge } from '$lib/silk/components/badge';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import FileCode from '@lucide/svelte/icons/file-code';
	import Accessibility from '@lucide/svelte/icons/accessibility';
	import MessageSquareWarning from '@lucide/svelte/icons/message-square-warning';

	let {
		title,
		slug,
		source,
		ariaUrl,
		section
	}: {
		title: string;
		slug: string | undefined;
		source?: string;
		ariaUrl?: string;
		section: PageActionsSection;
	} = $props();

	const issueUrl = $derived(
		`https://github.com/aidan-neel/ui/issues/new?title=${encodeURIComponent(`[${title}] `)}`
	);
</script>

{#if section === 'breadcrumbs'}
	<div class="flex flex-col gap-1 pb-6">
		<Breadcrumb.Root>
			<Breadcrumb.Item href="/docs/introduction">Docs</Breadcrumb.Item>
			<ChevronRight size={14} class="text-foreground-muted" aria-hidden="true" />
			<Breadcrumb.Item href="/docs/components">Components</Breadcrumb.Item>
			<ChevronRight size={14} class="text-foreground-muted" aria-hidden="true" />
			<Breadcrumb.Item href="/docs/components/{slug}">{title}</Breadcrumb.Item>
		</Breadcrumb.Root>
	</div>
{:else}
	<div class="flex flex-row flex-wrap items-center gap-2 pt-1 pb-6">
		{#if source}
			<Badge variant="outlined" href={source} icon={FileCode} class="gap-1.5 text-xs">
				Source
			</Badge>
		{/if}
		{#if ariaUrl}
			<Badge variant="outlined" href={ariaUrl} icon={Accessibility} class="gap-1.5 text-xs">
				WAI-ARIA
			</Badge>
		{/if}
		<Badge variant="outlined" href={issueUrl} icon={MessageSquareWarning} class="gap-1.5 text-xs">
			Report issue
		</Badge>
	</div>
{/if}
