<script lang="ts">
	import * as Breadcrumb from '@silk/ui/components/breadcrumb';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
</script>

<div class="flex items-center justify-center">
	<Breadcrumb.Root>
		<Breadcrumb.Item href="/">Home</Breadcrumb.Item>
		<Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
		<Breadcrumb.Item href="/docs">Docs</Breadcrumb.Item>
		<Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
		<Breadcrumb.Item>Current</Breadcrumb.Item>
	</Breadcrumb.Root>
</div>
