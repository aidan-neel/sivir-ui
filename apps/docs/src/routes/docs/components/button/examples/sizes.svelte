<script lang="ts">
    import Heart from '@lucide/svelte/icons/heart';
    import { Button } from '@sivir-ui/svelte/components/button';
</script>

<div class="flex flex-wrap items-center justify-center gap-4">
    <Button size="sm">Small</Button>
    <Button>Medium</Button>
    <Button size="lg">Large</Button>
    <Button size="icon" aria-label="Favorite"><Heart size={14} /></Button>
</div>
