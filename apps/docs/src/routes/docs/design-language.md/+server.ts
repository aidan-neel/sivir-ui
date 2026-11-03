import { markdownResponse } from '#lib/markdown-response.js';
import { designLanguageMarkdown } from '#lib/skill.js';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = ({ url }) => {
    return markdownResponse(designLanguageMarkdown(url.origin));
};
