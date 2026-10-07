import type { FileDiffLine } from '@sivir-ui/svelte/components/file-diff';

export type AgentCallKind = 'search' | 'read' | 'edit' | 'run';

export type AgentCall = {
    id: string;
    kind: AgentCallKind;
    status: string;
    liveAction: string;
    doneAction: string;
    target: string;
    ms: number;
    diff?: FileDiffLine[];
    output?: string;
    failed?: boolean;
    open?: boolean;
};

export type AgentChangedFile = {
    file: string;
    additions: number;
    deletions: number;
};

const limiterFile = 'src/lib/rate-limit.ts';
const testCommand = 'bun test rate-limit';

export const question =
    'Our API lets a sixth request through even though the limit is 5 a minute. Can you fix it?';

export const thought =
    'Five requests a minute means the sixth should get a 429, so the limiter is probably off by one. I’ll find where it counts hits in the window and check the tests before changing anything.';

export const toolSummary = 'Read 2 files, edited 1, ran tests twice';

export const calls: AgentCall[] = [
    {
        id: 'search',
        kind: 'search',
        status: 'Searching the codebase',
        liveAction: 'Searching',
        doneAction: 'Searched',
        target: 'rateLimit(',
        ms: 900
    },
    {
        id: 'read-limiter',
        kind: 'read',
        status: 'Reading rate-limit.ts',
        liveAction: 'Reading',
        doneAction: 'Read',
        target: limiterFile,
        ms: 800
    },
    {
        id: 'read-tests',
        kind: 'read',
        status: 'Reading the tests',
        liveAction: 'Reading',
        doneAction: 'Read',
        target: 'src/lib/rate-limit.test.ts',
        ms: 700
    },
    {
        id: 'edit-limit',
        kind: 'edit',
        status: 'Editing rate-limit.ts',
        liveAction: 'Editing',
        doneAction: 'Edited',
        target: limiterFile,
        ms: 900,
        open: true,
        diff: [
            {
                type: 'context',
                oldLineNumber: 10,
                newLineNumber: 10,
                content: '  const hits = store.get(key) ?? [];'
            },
            {
                type: 'context',
                oldLineNumber: 11,
                newLineNumber: 11,
                content: '  const recent = hits.filter((at) => now - at < WINDOW_MS);'
            },
            {
                type: 'remove',
                oldLineNumber: 12,
                content: '  if (recent.length > LIMIT) {'
            },
            {
                type: 'add',
                newLineNumber: 12,
                content: '  if (recent.length >= LIMIT) {'
            },
            {
                type: 'context',
                oldLineNumber: 13,
                newLineNumber: 13,
                content: '    return { allowed: false };'
            }
        ]
    },
    {
        id: 'test-failed',
        kind: 'run',
        status: 'Running tests',
        liveAction: 'Running',
        doneAction: 'Ran',
        target: testCommand,
        ms: 1600,
        failed: true,
        open: true,
        output: [
            '✓ allows 5 requests a minute',
            '✓ rejects the 6th request',
            '✗ drops hits older than the window',
            '  expected 1 stored hit, received 6',
            '',
            '2 pass, 1 fail'
        ].join('\n')
    },
    {
        id: 'edit-prune',
        kind: 'edit',
        status: 'Dropping expired hits',
        liveAction: 'Editing',
        doneAction: 'Edited',
        target: limiterFile,
        ms: 900,
        open: true,
        diff: [
            {
                type: 'context',
                oldLineNumber: 14,
                newLineNumber: 14,
                content: '  }'
            },
            {
                type: 'remove',
                oldLineNumber: 15,
                content: '  store.set(key, [...hits, now]);'
            },
            {
                type: 'add',
                newLineNumber: 15,
                content: '  store.set(key, [...recent, now]);'
            },
            {
                type: 'context',
                oldLineNumber: 16,
                newLineNumber: 16,
                content: '  return { allowed: true };'
            }
        ]
    },
    {
        id: 'test-passed',
        kind: 'run',
        status: 'Running tests again',
        liveAction: 'Running',
        doneAction: 'Ran',
        target: testCommand,
        ms: 1400,
        output: [
            '✓ allows 5 requests a minute',
            '✓ rejects the 6th request',
            '✓ drops hits older than the window',
            '',
            '3 pass, 0 fail'
        ].join('\n')
    }
];

export const answer = [
    'Fixed. The limiter only blocked a request when the window already held more than 5 hits, so the sixth still got through. It now blocks as soon as the window is full.',
    'The tests also caught a second bug: expired hits were never dropped, so each key’s list kept growing. The limiter now keeps only the hits inside the window, and all 3 tests pass.'
];

export const changedFiles: AgentChangedFile[] = [
    {
        file: limiterFile,
        additions: 2,
        deletions: 2
    }
];
