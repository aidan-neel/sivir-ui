<script lang="ts">
    import * as Alert from '@sivir-ui/svelte/components/alert';
</script>

<div class="w-full max-w-md">
    <Alert.Root variant="error">
        <Alert.Title>Build failed</Alert.Title>
        <Alert.Description
            >The build exited with code 1. Check the logs for details.</Alert.Description
        >
    </Alert.Root>
</div>
