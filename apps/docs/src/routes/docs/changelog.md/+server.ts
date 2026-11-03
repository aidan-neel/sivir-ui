import { changelogDocsMarkdown } from '#lib/changelog.js';
import { markdownResponse } from '#lib/markdown-response.js';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
    return markdownResponse(`# Changelog\n\n${changelogDocsMarkdown()}\n`);
};
