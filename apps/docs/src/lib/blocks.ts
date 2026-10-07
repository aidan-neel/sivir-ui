export type BlockSlug = 'thread' | 'agent';

export type Block = {
    slug: BlockSlug;
    title: string;
    description: string;
};

export const blocks: Block[] = [
    {
        slug: 'thread',
        title: 'Thread',
        description:
            'A question, a live reasoning trace that searches and reads sources, and a streamed answer with inline citations.'
    },
    {
        slug: 'agent',
        title: 'Agent',
        description:
            'A coding agent that thinks, reads the code, edits a file, reruns failing tests until they pass, and reports what changed.'
    }
];
