<script lang="ts">
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Card from '@sivir-ui/svelte/components/card';
</script>

<Card.Root variant="inset" class="w-full max-w-[28rem]">
    <Card.Header>
        <div class="flex items-start justify-between gap-4">
            <Card.Title>sivir-ui</Card.Title>
            <span
                class="flex shrink-0 items-center gap-2 py-1 text-[length:var(--font-size-body)] font-medium text-foreground"
            >
                <span
                    class="size-2 rounded-full bg-[var(--color-success)]"
                    aria-hidden="true"
                ></span>
                Ready
            </span>
        </div>
        <Card.Description class="font-mono text-[0.875em]">sivir-ui.vercel.app</Card.Description>
    </Card.Header>
    <Card.Content>
        <dl
            class="m-0 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-6 gap-y-3 text-[length:var(--font-size-body)]"
        >
            <dt class="text-foreground-muted">Environment</dt>
            <dd class="m-0 text-foreground">Production</dd>
            <dt class="text-foreground-muted">Branch</dt>
            <dd class="m-0 font-mono text-[0.875em] text-foreground">main</dd>
            <dt class="text-foreground-muted">Commit</dt>
            <dd class="m-0 flex min-w-0 items-baseline gap-2 text-foreground">
                <span class="shrink-0 font-mono text-[0.875em] text-foreground-muted">4f2a9c1</span>
                <span class="truncate">feat(studio): restore original styling</span>
            </dd>
            <dt class="text-foreground-muted">Deployed</dt>
            <dd class="m-0 text-foreground">
                <time datetime="2026-10-05T10:00:00Z">2 hours ago</time>
                by aidan-neel
            </dd>
        </dl>
    </Card.Content>
    <Card.Footer>
        <Button variant="outline" size="md">Visit</Button>
        <Button size="md">View deployment</Button>
    </Card.Footer>
</Card.Root>
