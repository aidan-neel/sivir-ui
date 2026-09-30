import * as clack from '@clack/prompts';
import pc from 'picocolors';
import { CONFIG_FILE, loadConfig, saveConfig } from '../config';
import {
    type InstallPlan,
    installableFiles,
    loadRegistryIndex,
    ResolveError,
    resolveInstallPlan
} from '../registry';
import { type CopyResult, installFile, installMissingDependencies } from '../utils/project';
import { fail, tree, warn } from '../utils/ui';

export type AddOptions = {
    cwd: string;
    yes: boolean;
    overwrite: boolean;
};

const RESULT_MARK: Record<CopyResult, string> = {
    created: pc.green('+'),
    overwritten: pc.yellow('~'),
    unchanged: pc.dim('='),
    skipped: pc.yellow('!')
};

export async function add(names: string[], options: AddOptions) {
    const { cwd, yes, overwrite } = options;

    const config = await loadConfig(cwd);
    if (!config) {
        fail(`no ${CONFIG_FILE} found -- run ${pc.cyan('sivir init')} first.`);
        process.exitCode = 1;
        return;
    }

    const index = await loadRegistryIndex();
    let plan: InstallPlan;
    try {
        plan = resolveInstallPlan(index, names);
    } catch (error) {
        if (error instanceof ResolveError) {
            fail(error.message);
            console.log(`  run ${pc.cyan('sivir list')} to see what's available.`);
            process.exitCode = 1;
            return;
        }
        throw error;
    }

    const pulled = names.includes('*')
        ? []
        : plan.components.filter((c) => !names.includes(c.name));
    clack.intro(pc.bgMagenta(pc.black(' sivir add ')));
    if (pulled.length > 0) {
        console.log(
            `${pc.dim('│')}  pulling ${pulled.map((c) => pc.cyan(c.name)).join(', ')} as dependencies`
        );
    }

    const spinner = clack.spinner();
    spinner.start(`Installing ${plan.components.length} component(s) into ${config.dir}`);

    const groups = plan.components.map((component) => {
        config.components[component.name] = component.version;

        return {
            heading: `${pc.bold(component.name)} ${pc.dim(`v${component.version}`)}`,
            files: installableFiles(component)
        };
    });
    const sharedFiles = [...new Set(plan.components.flatMap((c) => c.sharedFiles))].sort();
    if (sharedFiles.length > 0) {
        groups.push({
            heading: pc.bold('shared'),
            files: sharedFiles
        });
    }

    const summaries: { heading: string; lines: string[] }[] = [];
    let skipped = 0;
    for (const group of groups) {
        const lines: string[] = [];
        for (const file of group.files) {
            const result = await installFile(cwd, config.dir, file, config.alias, overwrite);
            if (result === 'skipped') {
                skipped++;
            }
            lines.push(`${RESULT_MARK[result]} ${file}`);
        }
        summaries.push({
            heading: group.heading,
            lines
        });
    }
    await saveConfig(cwd, config);
    spinner.stop(`Installed into ${pc.cyan(config.dir)}`);

    for (const summary of summaries) {
        tree(summary.heading, summary.lines);
    }
    if (skipped > 0) {
        warn(
            `${skipped} existing file(s) differ from the registry and were left alone -- pass --overwrite to replace.`
        );
    }

    await installMissingDependencies(cwd, plan.peerDependencies, yes);

    clack.outro(
        `Done -- ${plan.components.length} component(s) ready under ${pc.cyan(config.alias)}.`
    );
}
