import { assertLocalRequest } from '#lib/server/local-only.js';
import { runManager } from '#lib/server/run-manager.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
    assertLocalRequest(event);
    return Response.json({ snapshot: await runManager.cancel() });
};
