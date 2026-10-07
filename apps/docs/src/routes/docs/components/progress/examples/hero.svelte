<script lang="ts">
    import { Progress } from '@sivir-ui/svelte/components/progress';

    let {
        value = 65,
        indeterminate = false
    }: {
        value?: number;
        indeterminate?: boolean;
    } = $props();
</script>

<Progress {value} {indeterminate} class="w-full max-w-md" />
