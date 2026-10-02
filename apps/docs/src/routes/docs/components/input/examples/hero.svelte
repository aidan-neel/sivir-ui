<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Input } from '@sivir-ui/svelte/components/input';

    let projectName = $state('sivir-ui');
    let rootDirectory = $state('./');
</script>

<div class="w-full max-w-sm space-y-6">
    <h2 class="text-sm [font-weight:var(--font-weight-label,600)] text-foreground">
        Configure project
    </h2>

    <div class="space-y-4">
        <Input
            label="Project name"
            bind:value={projectName}
            description="Shown in the dashboard and in deployment URLs."
        />

        <Input
            label="Root directory"
            placeholder="./"
            bind:value={rootDirectory}
            description="The directory where your source code lives."
        />
    </div>

    <div class="flex items-center justify-end gap-3">
        <Button variant="ghost" size="md">Cancel</Button>
        <Button size="md">Deploy</Button>
    </div>
</div>
