import pc from 'picocolors';
import { CONFIG_FILE, loadConfig } from '../config';
import { loadRegistryIndex } from '../registry';
import { fail, ok, tree } from '../utils/ui';

export type StatusOptions = {
    cwd: string;
};

export type ComponentStatus = {
    name: string;
    installed: string;
    latest: string;
    outdated: boolean;
};

/** Compares the versions recorded in sivir.json against the registry snapshot. */
export async function componentStatuses(
    components: Record<string, string>
): Promise<ComponentStatus[]> {
    const statuses: ComponentStatus[] = [];

    for (const [name, installed] of Object.entries(components)) {
        const index = await loadRegistryIndex();
        const entry = index.components.find((component) => component.name === name);
        const latest = entry?.version ?? installed;
        statuses.push({
            name,
            installed,
            latest,
            outdated: installed < latest
        });
    }

    return statuses.sort((a, b) => a.name.localeCompare(b.name));
}

export async function status(options: StatusOptions) {
    const { cwd } = options;

    const config = await loadConfig(cwd);
    if (!config) {
        fail(`no ${CONFIG_FILE} found -- run ${pc.cyan('sivir init')} first.`);
        process.exitCode = 1;
        return;
    }

    const statuses = await componentStatuses(config.components);
    if (statuses.length === 0) {
        ok('no components installed yet.');
        return;
    }

    const outdated = statuses.filter((entry) => entry.outdated);
    const width = Math.max(...statuses.map((entry) => entry.name.length));

    console.log();
    tree(
        `${pc.bold(`${statuses.length} installed`)} ${pc.dim(`in ${config.dir}`)}`,
        statuses.map((entry) => {
            const label = pc.cyan(entry.name.padEnd(width));
            if (!entry.outdated) return `${label}  ${pc.dim(`v${entry.installed}`)}`;
            return `${label}  ${pc.yellow(`v${entry.installed}`)} ${pc.dim('→')} ${pc.green(`v${entry.latest}`)}`;
        })
    );
    console.log();

    if (outdated.length > 0) {
        console.log(
            `  ${pc.dim('update with')} ${pc.cyan(`sivir add ${outdated.map((entry) => entry.name).join(' ')} --overwrite`)}`
        );
        console.log();
    } else {
        ok('everything is up to date.');
    }
}
