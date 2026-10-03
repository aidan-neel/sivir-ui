import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const CHANGELOG_ROOT = join(import.meta.dirname, '..', 'changelog');

type ReleaseStats = {
    version: string;
    bullets: number;
    kinds: string[];
};

function countBullets(file: string) {
    const lines = readFileSync(file, 'utf8').split('\n');
    return lines.filter((line) => line.startsWith('- ')).length;
}

function collectRelease(version: string): ReleaseStats {
    const dir = join(CHANGELOG_ROOT, version);
    const files = readdirSync(dir).filter((name) => name.endsWith('.md'));
    let bullets = 0;

    for (const file of files) {
        bullets += countBullets(join(dir, file));
    }

    return {
        version,
        bullets,
        kinds: files.map((name) => name.replace('.md', ''))
    };
}

function compareVersions(a: string, b: string) {
    return a.localeCompare(b);
}

export function collectAll() {
    const versions = readdirSync(CHANGELOG_ROOT).sort(compareVersions);
    return versions.map(collectRelease);
}

export function commitsSince(tag: string) {
    const output = execSync(`git log ${tag}..HEAD --oneline`, { encoding: 'utf8' });
    return output.split('\n').filter(Boolean);
}

export async function latestReleaseTag() {
    const response = await fetch(
        'https://api.github.com/repos/aidan-neel/sivir-ui/releases/latest',
        {
            headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` }
        }
    );
    const release = await response.json();
    return release.tag_name as string;
}

if (import.meta.main) {
    const stats = collectAll();
    const total = stats.reduce((sum, release) => sum + release.bullets, 0);
    console.log(`${stats.length} releases, ${total} bullets, average ${total / stats.length - 1}`);
}
