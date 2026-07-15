<script lang="ts">
	import { resolve } from '$app/paths';
	import BrandMark from '@sivir/ui/brand-mark';
</script>

<a href={resolve('/')} class="flex items-center gap-2 no-underline" aria-label="Sivir UI Home">
	<BrandMark size={16} />
	<span class="hidden font-semibold tracking-tight text-foreground sm:inline">Sivir UI</span>
</a>
