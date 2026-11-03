import { markdownResponse } from '#lib/markdown-response.js';
import { skillMarkdown } from '#lib/skill.js';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = ({ url }) => markdownResponse(skillMarkdown(url.origin));
