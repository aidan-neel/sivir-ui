import { error } from '@sveltejs/kit';
import { isInstallPath, isRunSource } from '#lib/run-types.js';
import { assertLocalRequest } from '#lib/server/local-only.js';
import { buildManualPlan } from '#lib/server/manual-plan.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
    assertLocalRequest(event);
    const source = event.url.searchParams.get('source');
    const installPath = event.url.searchParams.get('installPath');
    if (!isRunSource(source) || !isInstallPath(installPath)) {
        error(400, 'source and installPath must be supported enum values.');
    }
    return Response.json({ plan: await buildManualPlan(source, installPath) });
};
