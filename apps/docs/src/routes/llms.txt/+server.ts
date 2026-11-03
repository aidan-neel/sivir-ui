import { llmsTxt } from '#lib/llms.js';
import { markdownResponse } from '#lib/markdown-response.js';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = ({ url }) => markdownResponse(llmsTxt(url.origin));
