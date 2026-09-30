import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { HTMLAttributes, SvelteHTMLElements } from 'svelte/elements';
import ResponseStream from './response-stream.svelte';

export type ResponseStreamProps = {
    /** A complete response or an async source of response chunks. */
    textStream: string | AsyncIterable<string>;
    /** Treat string values as cumulative snapshots of one live response. */
    streaming?: boolean;
    /** Baseline reveal pace from 1 (slowest) to 100 (fastest). Live text speeds up with its backlog so it trails arrivals by about a third of a second. */
    speed?: number;
    /** Minimum characters revealed per step. */
    characterChunkSize?: number;
    onComplete?: () => void;
    onError?: (error: unknown) => void;
    as?: keyof SvelteHTMLElements;
} & DefaultProps &
    Omit<HTMLAttributes<HTMLElement>, 'children'>;

export { ResponseStream };
