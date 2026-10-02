<script lang="ts">
    import GitBranch from '@lucide/svelte/icons/git-branch';
    import { Badge } from '@sivir-ui/svelte/components/badge';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Card from '@sivir-ui/svelte/components/card';
</script>

<Card.Root variant="inset" class="w-full max-w-[28rem]">
    <Card.Header>
        <div class="mb-2 flex items-center justify-between">
            <Card.Title>sivir-ui</Card.Title>
            <Badge variant="info">Next.js</Badge>
        </div>
        <Card.Description>vercel.com/aidan-neel/sivir-ui</Card.Description>
    </Card.Header>
    <Card.Content>
        <div class="space-y-4">
            <!-- Status Row -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="h-2 w-2 rounded-full bg-emerald-500"></div>
                    <span class="text-sm font-medium text-foreground">Ready</span>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-xs text-foreground-muted">Production</span>
                    <span class="text-xs text-foreground-muted">Deployed 2h ago</span>
                </div>
            </div>

            <!-- Commit Row -->
            <div class="flex items-center gap-2 rounded-[var(--radius-md)] bg-secondary px-3 py-2">
                <GitBranch class="h-4 w-4 shrink-0 text-foreground-muted" />
                <span class="text-sm font-medium text-foreground">main</span>
                <span class="truncate text-xs text-foreground-muted"
                    >feat(studio): restore original styling</span
                >
                <span class="ml-auto shrink-0 text-xs text-foreground-muted">aidan-neel</span>
            </div>
        </div>
    </Card.Content>
    <Card.Footer>
        <Button variant="outline" size="md">Visit</Button>
        <Button size="md">View deployment</Button>
    </Card.Footer>
</Card.Root>
