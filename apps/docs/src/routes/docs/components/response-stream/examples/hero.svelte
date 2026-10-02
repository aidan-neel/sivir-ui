<script lang="ts">
    import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';

    const text =
        'The build failed because Vite could not resolve the @/lib/env import. The alias is defined in tsconfig.json but not in vite.config.ts. Add the same alias under resolve.alias and run the build again. The other 41 modules compiled without errors.';

    function wait(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async function* delayedResponse() {
        await wait(1200);

        const parts = text.split(/(\s+)/);
        for (const part of parts) {
            yield part;
            await wait(40);
        }
    }
</script>

<div class="w-full max-w-xl">
    <ResponseStream textStream={delayedResponse()} speed={10} />
</div>
