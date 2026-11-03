#!/usr/bin/env node
/**
 * Picks the size label for a pull request. Used by .github/workflows/pr-labels.yml.
 *
 *     gh api --paginate repos/OWNER/REPO/pulls/N/files --jq '.[]' | node scripts/pr-size.mjs
 *
 * Reads one JSON object per line, each with `filename`, `additions` and `deletions` as the GitHub
 * pull request files API returns them, and prints one label such as `size:M`.
 *
 * Generated files never count. Test files count only when the pull request changes nothing else,
 * so a fix with a thorough test is sized by its fix.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Upper bounds, exclusive, in changed lines. Anything larger is `size:XXL`. */
const SIZE_LIMITS = [
    ['size:XS', 10],
    ['size:S', 30],
    ['size:M', 100],
    ['size:L', 500],
    ['size:XL', 1000]
];
const LARGEST_SIZE = 'size:XXL';

const GENERATED_PATTERNS = [
    /^bun\.lock$/,
    /(^|\/)package-lock\.json$/,
    /^packages\/sivir\/registry\//,
    /^apps\/registry\/prisma\/generated\//
];

const TEST_PATTERNS = [/(^|\/)tests?\//, /(^|\/)__tests__\//, /\.(test|spec)\.[^/]+$/];

/**
 * @typedef {{
 *     path: string,
 *     changedLines: number,
 * }} ChangedFile
 */

/**
 * @param {Iterable<string>} lines
 * @returns {ChangedFile[]}
 */
export function parseChangedFiles(lines) {
    const files = [];

    for (const line of lines) {
        if (!line.trim()) {
            continue;
        }

        const entry = JSON.parse(line);

        files.push({
            path: entry.filename,
            changedLines: entry.additions + entry.deletions
        });
    }

    return files;
}

/**
 * Returns the label for the lines a reviewer reads, leaving out generated files and tests.
 *
 * @param {ChangedFile[]} files
 * @returns {string}
 */
export function sizeLabel(files) {
    const reviewed = files.filter((file) => {
        return !matchesAny(file.path, GENERATED_PATTERNS);
    });
    const sourceLines = sumChangedLines(
        reviewed.filter((file) => {
            return !matchesAny(file.path, TEST_PATTERNS);
        })
    );
    const testLines = sumChangedLines(
        reviewed.filter((file) => {
            return matchesAny(file.path, TEST_PATTERNS);
        })
    );
    const countedLines = sourceLines > 0 ? sourceLines : testLines;

    for (const [label, limit] of SIZE_LIMITS) {
        if (countedLines < limit) {
            return label;
        }
    }

    return LARGEST_SIZE;
}

function sumChangedLines(files) {
    return files.reduce((total, file) => {
        return total + file.changedLines;
    }, 0);
}

function matchesAny(path, patterns) {
    return patterns.some((pattern) => {
        return pattern.test(path);
    });
}

const isEntryPoint = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isEntryPoint) {
    const input = readFileSync(0, 'utf8');

    console.log(sizeLabel(parseChangedFiles(input.split('\n'))));
}
