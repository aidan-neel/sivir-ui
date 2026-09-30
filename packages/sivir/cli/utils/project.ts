import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import * as clack from '@clack/prompts';
import pc from 'picocolors';
import { registryFilePath, rewriteImports } from '../registry';
import { ok, warn } from './ui';

export type PackageManager = 'bun' | 'pnpm' | 'yarn' | 'npm';

export function detectPackageManager(cwd: string): PackageManager {
    if (existsSync(path.join(cwd, 'bun.lock')) || existsSync(path.join(cwd, 'bun.lockb'))) {
        return 'bun';
    }
    if (existsSync(path.join(cwd, 'pnpm-lock.yaml'))) {
        return 'pnpm';
    }
    if (existsSync(path.join(cwd, 'yarn.lock'))) {
        return 'yarn';
    }
    return 'npm';
}

/**
 * Argument vector that installs each dependency at its declared range, so a
 * `0.x` peer never resolves to an incompatible latest release.
 */
export function installCommand(pm: PackageManager, dependencies: Record<string, string>) {
    const verb = pm === 'npm' ? 'install' : 'add';
    const specs = Object.entries(dependencies).map(([name, range]) => {
        return `${name}@${range}`;
    });

    return [pm, verb, ...specs];
}

/** Renders an argument vector as a command that is safe to paste into a shell. */
export function formatCommand(argv: string[]) {
    return argv
        .map((arg) => {
            return /^[\w@/.:=+-]+$/.test(arg) ? arg : `'${arg}'`;
        })
        .join(' ');
}

/** Dependencies declared anywhere in the consumer's package.json. */
export async function declaredDependencies(cwd: string): Promise<Set<string>> {
    const file = path.join(cwd, 'package.json');
    if (!existsSync(file)) {
        return new Set();
    }
    let pkg: Record<string, Record<string, unknown> | undefined>;
    try {
        pkg = JSON.parse(await readFile(file, 'utf8'));
    } catch {
        return new Set();
    }
    return new Set([
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.devDependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {})
    ]);
}

/**
 * Installs the dependencies the consumer has not declared yet. Runs the package
 * manager when `yes` is set or the user confirms in a TTY; otherwise, or when
 * there is no package.json to install into, prints the command to run.
 */
export async function installMissingDependencies(
    cwd: string,
    dependencies: Record<string, string>,
    yes: boolean
) {
    const declared = await declaredDependencies(cwd);
    const missing = Object.fromEntries(
        Object.entries(dependencies).filter(([name]) => {
            return !declared.has(name);
        })
    );
    const names = Object.keys(missing);
    if (names.length === 0) {
        return;
    }

    const argv = installCommand(detectPackageManager(cwd), missing);
    const command = formatCommand(argv);
    warn(`missing peer dependencies: ${names.map((name) => pc.yellow(name)).join(', ')}`);

    const hasManifest = existsSync(path.join(cwd, 'package.json'));
    let install = yes && hasManifest;
    if (!yes && hasManifest && process.stdout.isTTY) {
        const answer = await clack.confirm({
            message: `Run ${pc.cyan(command)} now?`
        });
        install = answer === true;
    }
    if (!install) {
        console.log(`  install with ${pc.cyan(command)}`);
        return;
    }

    const [bin, ...args] = argv;
    const result = spawnSync(bin, args, {
        cwd,
        stdio: 'inherit'
    });
    if (result.status === 0) {
        ok('peer dependencies installed.');
    } else {
        warn(`"${command}" exited with ${result.status} -- install them manually.`);
    }
}

export type CopyResult = 'created' | 'overwritten' | 'unchanged' | 'skipped';

/**
 * Copies one registry file into the consumer project, rewriting
 * `@sivir-ui/svelte` imports to the configured alias. A file that already
 * matches the registry is `unchanged`; one that differs is `skipped` unless
 * `overwrite` is set.
 */
export async function installFile(
    cwd: string,
    dir: string,
    file: string,
    alias: string,
    overwrite: boolean
): Promise<CopyResult> {
    const base = path.resolve(cwd, dir);
    const target = path.resolve(base, file);
    if (!target.startsWith(`${base}${path.sep}`)) {
        throw new Error(`unsafe registry file path: ${file}`);
    }

    const source = rewriteImports(await readFile(registryFilePath(file), 'utf8'), alias);
    const exists = existsSync(target);
    if (exists) {
        if ((await readFile(target, 'utf8')) === source) {
            return 'unchanged';
        }
        if (!overwrite) {
            return 'skipped';
        }
    }

    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, source);
    return exists ? 'overwritten' : 'created';
}
