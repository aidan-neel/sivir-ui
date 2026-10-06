<script lang="ts">
    import * as Alert from '@sivir-ui/svelte/components/alert';
</script>

<div class="w-full max-w-md">
    <Alert.Root variant="error">
        <Alert.Title>Connection lost</Alert.Title>
        <Alert.Description>
            Unable to reach the server. Please check your network connection.
        </Alert.Description>
    </Alert.Root>
</div>
