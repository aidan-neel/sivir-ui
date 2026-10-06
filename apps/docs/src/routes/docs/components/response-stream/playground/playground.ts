export type ResponseStreamSource = 'stream' | 'text';

export type ResponseStreamSpeed = '5' | '10' | '20' | '50';

export type ResponseStreamSettings = {
    source: ResponseStreamSource;
    speed: ResponseStreamSpeed;
};

export const responseStreamDefaults: ResponseStreamSettings = {
    source: 'stream',
    speed: '10'
};

const COMPONENT_SPEED = '20';

function speedProp(settings: ResponseStreamSettings) {
    if (settings.speed === COMPONENT_SPEED) {
        return '';
    }
    return ` speed={${settings.speed}}`;
}

export function responseStreamCode(settings: ResponseStreamSettings) {
    const speed = speedProp(settings);

    if (settings.source === 'text') {
        return `<script lang="ts">
    import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';

    const text = 'This is a streaming response that appears word by word as it arrives.';
</script>

<ResponseStream textStream={text}${speed} />
`;
    }

    return `<script lang="ts">
    import { ResponseStream } from '@sivir-ui/svelte/components/response-stream';

    const text = 'This is a streaming response that appears word by word as it arrives.';

    function wait(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    async function* streamText() {
        const parts = text.split(/(\\s+)/);
        for (const part of parts) {
            yield part;
            await wait(30);
        }
    }
</script>

<ResponseStream textStream={streamText()}${speed} />
`;
}

export function changedResponseStreamProps(settings: ResponseStreamSettings) {
    const keys = Object.keys(responseStreamDefaults) as (keyof ResponseStreamSettings)[];

    return keys.filter((key) => {
        return settings[key] !== responseStreamDefaults[key];
    }).length;
}
