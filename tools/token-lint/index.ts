import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export type Violation = { file: string; line: number; rule: string; text: string };

const RULES: { rule: string; re: RegExp }[] = [
	// hex colors anywhere
	{ rule: 'no-literal-color', re: /#[0-9a-fA-F]{3,8}\b/ },
	// px/rem/em literals inside a Tailwind arbitrary value: [...2px...] / [...0.5rem...]
	{ rule: 'no-literal-length', re: /\[[^\]]*\d+(?:\.\d+)?(?:px|rem|em)[^\]]*\]/ },
	// direct Tier-1 primitive reference
	{ rule: 'no-primitive-leak', re: /var\(\s*--silk-[a-z0-9-]+/ }
];

export function lintSource(file: string, source: string): Violation[] {
	const out: Violation[] = [];
	source.split('\n').forEach((text, i) => {
		for (const { rule, re } of RULES) {
			if (re.test(text)) out.push({ file, line: i + 1, rule, text: text.trim() });
		}
	});
	return out;
}

function walk(dir: string, acc: string[] = []): string[] {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) walk(p, acc);
		else if (/\.(svelte|ts)$/.test(name) && !name.endsWith('.test.ts')) acc.push(p);
	}
	return acc;
}

export function lintTree(root: string): Violation[] {
	return walk(root).flatMap((f) => lintSource(f, readFileSync(f, 'utf8')));
}

// `bun tools/token-lint/index.ts <root>` prints violations; exits 0 in report mode.
if (import.meta.main) {
	const root = process.argv[2] ?? 'packages/silk/src/components';
	const v = lintTree(root);
	for (const x of v) console.log(`${x.file}:${x.line} [${x.rule}] ${x.text}`);
	console.log(`\n${v.length} violations (report mode — enforced in Plan 2)`);
}
