import { error } from '@sveltejs/kit';
import { isActivePhase, isInstallPath, isRunSource } from '#lib/run-types.js';
import { assertLocalRequest } from '#lib/server/local-only.js';
import { runManager } from '#lib/server/run-manager.js';
import { terminalManager } from '#lib/server/terminal-manager.js';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
    assertLocalRequest(event);
    if (isActivePhase((await runManager.getSnapshot()).phase)) {
        error(409, 'Cancel the automatic installer run before resetting the manual workspace.');
    }
    let body: unknown;
    try {
        body = await event.request.json();
    } catch {
        error(400, 'Expected a JSON request body.');
    }
    const source = (body as { source?: unknown })?.source;
    const installPath = (body as { installPath?: unknown })?.installPath;
    if (!isRunSource(source) || !isInstallPath(installPath)) {
        error(400, 'source and installPath must be supported enum values.');
    }
    return Response.json(
        { snapshot: await terminalManager.prepare(source, installPath, true) },
        { status: 202 }
    );
};
