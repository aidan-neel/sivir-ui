import { assertLocalRequest } from '#lib/server/local-only.js';
import { terminalManager } from '#lib/server/terminal-manager.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
    assertLocalRequest(event);
    return Response.json({ snapshot: await terminalManager.cancel() });
};
