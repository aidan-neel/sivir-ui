import { error } from '@sveltejs/kit';
import { changelogMarkdown, changelogVersions } from '#lib/changelog.js';
import { markdownResponse } from '#lib/markdown-response.js';
import type { EntryGenerator, RequestHandler } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
    return changelogVersions.map((version) => ({ version }));
};

export const GET: RequestHandler = ({ params }) => {
    const content = changelogMarkdown(params.version);
    if (!content) {
        error(404, 'Changelog version not found');
    }

    return markdownResponse(content);
};
