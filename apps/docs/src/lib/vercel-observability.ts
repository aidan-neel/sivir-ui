import { inject, pageview } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

// The `/sveltekit` entries of both packages import `$app/environment` and `$app/stores`, which
// SvelteKit 3 removed. This wires their framework-agnostic entries up the same way those entries
// did: route-aware page views and Speed Insights routes, with automatic tracking turned off.
const FRAMEWORK = 'sveltekit';

export type VercelObservability = {
    recordPageView: (route: string | null, path: string) => void;
};

/** Injects Web Analytics and Speed Insights. Call once, in the browser. */
export function startVercelObservability(options: {
    isDevelopment: boolean;
    route: string | null;
}): VercelObservability {
    const basePath: string | undefined = import.meta.env.VITE_VERCEL_OBSERVABILITY_BASEPATH;
    const configString: string | undefined = import.meta.env
        .VITE_VERCEL_OBSERVABILITY_CLIENT_CONFIG;

    inject(
        {
            mode: options.isDevelopment ? 'development' : 'production',
            basePath,
            disableAutoTrack: true,
            framework: FRAMEWORK
        },
        configString
    );

    const speedInsights = injectSpeedInsights(
        {
            route: options.route,
            basePath,
            framework: FRAMEWORK
        },
        configString
    );

    return {
        recordPageView: (route, path) => {
            if (!route) {
                return;
            }

            pageview({
                route,
                path
            });
            speedInsights?.setRoute(route);
        }
    };
}
