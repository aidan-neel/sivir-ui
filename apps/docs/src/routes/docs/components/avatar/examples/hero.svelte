<script lang="ts">
    import * as Avatar from '@sivir-ui/svelte/components/avatar';

    let {
        size = 'md',
        shape = 'circle',
        image = true
    }: {
        size?: 'sm' | 'md' | 'lg' | 'xl';
        shape?: 'circle' | 'square';
        image?: boolean;
    } = $props();
</script>

<div class="flex items-center justify-center">
    <Avatar.Root {size} {shape}>
        {#if image}
            <Avatar.Image src="https://github.com/shadcn.png" alt="shadcn" />
        {/if}
        <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
</div>
