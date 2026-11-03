import { coreMarkdown } from '#lib/llms.js';
import { markdownResponse } from '#lib/markdown-response.js';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => markdownResponse(coreMarkdown('introduction'));
