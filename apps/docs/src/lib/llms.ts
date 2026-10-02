import { changelogLlmVersions, changelogVersions } from '$lib/changelog';
import { components, sanitizeComponent } from '$lib/components';
import { sivirGuideMarkdown } from '$lib/skill';

type ComponentManifest = {
    name: string;
    version: string;
    visibility: 'public' | 'internal';
    description: string;
    components: string[];
    shared: string[];
};

const removedComponents = [
    {
        name: 'Approval Request',
        guidance:
            'Compose `AlertDialog` directly: put the review details in `AlertDialog.Description` and the decision in `AlertDialog.Exit` and `AlertDialog.Confirm`.'
    },
    {
        name: 'Marquee',
        guidance:
            'No replacement. If continuous scrolling is essential, wrap the content in your own Tailwind animation.'
    },
    {
        name: 'Panel',
        guidance: 'Use `Card.Root variant="panel"` for the framed panel surface.'
    },
    {
        name: 'Separator',
        guidance:
            'Use a semantic `<hr>` or a Tailwind border utility. Part-level separators such as `Breadcrumb.Separator` and `DropdownMenu.Separator` still exist.'
    }
] as const;

const manifests = import.meta.glob<{ manifest: ComponentManifest }>(
    '../../../../packages/sivir/src/components/*/manifest.ts',
    { eager: true }
);
const indexes = import.meta.glob<string>('../../../../packages/sivir/src/components/*/index.ts', {
    eager: true,
    query: '?raw',
    import: 'default'
});
const examples = import.meta.glob<string>('../routes/docs/components/*/examples/*.svelte', {
    eager: true,
    query: '?raw',
    import: 'default'
});

function sourceFor(sources: Record<string, string>, component: string, suffix: string): string {
    const entry = Object.entries(sources).find(([path]) =>
        path.endsWith(`/components/${component}/${suffix}`)
    );
    if (!entry) throw new Error(`Missing ${suffix} for ${component}`);
    return entry[1];
}

function fence(language: string, content: string): string {
    return `~~~~${language}\n${content.trim()}\n~~~~`;
}

function titleFromFile(path: string): string {
    return path
        .slice(path.lastIndexOf('/') + 1)
        .replace(/\.svelte$/, '')
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function componentMarkdown(component: string): string | undefined {
    if (!components.includes(component as (typeof components)[number])) return undefined;

    const manifestEntry = Object.entries(manifests).find(([path]) =>
        path.endsWith(`/components/${component}/manifest.ts`)
    );
    if (!manifestEntry) throw new Error(`Missing manifest for ${component}`);

    const manifest = manifestEntry[1].manifest;
    const componentExamples = Object.entries(examples)
        .filter(([path]) => path.includes(`/components/${component}/examples/`))
        .sort(([left], [right]) => left.localeCompare(right));
    const dependencies = manifest.components.length ? manifest.components.join(', ') : 'None';
    const shared = manifest.shared.length ? manifest.shared.join(', ') : 'None';
    const install =
        manifest.visibility === 'public'
            ? fence('sh', `bunx --package @sivir-ui/svelte sivir add ${component}`)
            : [
                  'This component is available from the package API but is not a standalone CLI registry target. The CLI copies it only as a dependency of other components.',
                  '',
                  fence('sh', 'bun add @sivir-ui/svelte')
              ].join('\n');

    return [
        `# ${sanitizeComponent(component)}`,
        '',
        manifest.description,
        '',
        `- Package: \`@sivir-ui/svelte\``,
        `- Component version: \`${manifest.version}\``,
        `- Depends on Sivir components: ${dependencies}`,
        `- Shared utilities: ${shared}`,
        '',
        '## Install',
        '',
        install,
        '',
        '## API',
        '',
        'Generated at build time from the component manifest, the public `index.ts` below, and the documentation examples. Changes to those source files are reflected here. Prop types that extend HTML attributes also accept those attributes.',
        '',
        fence('ts', sourceFor(indexes, component, 'index.ts')),
        ...(componentExamples.length
            ? [
                  '',
                  '## Examples',
                  ...componentExamples.flatMap(([path, source]) => [
                      '',
                      `### ${titleFromFile(path)}`,
                      '',
                      fence('svelte', source)
                  ])
              ]
            : []),
        '',
        `For the rendered reference, visit [/docs/components/${component}](/docs/components/${component}).`,
        ''
    ].join('\n');
}

export function brandMarkMarkdown(): string {
    return [
        '# Brand Mark',
        '',
        'The Sivir logo as a Svelte component. It ships only in the package, from the root and from `@sivir-ui/svelte/brand-mark`; the CLI cannot install it.',
        '',
        '## Install',
        '',
        fence('sh', 'bun add @sivir-ui/svelte'),
        '',
        '## API',
        '',
        '- `size?: number` sets both dimensions in pixels and defaults to `30`.',
        '- `class?: string` adds utility classes to the outer `span`.',
        '- `label?: string` gives the mark an accessible image name. Without a label, the mark is decorative and hidden from assistive technology.',
        '',
        '## Example',
        '',
        fence(
            'svelte',
            `<script>\n    import { BrandMark } from '@sivir-ui/svelte';\n</script>\n\n<BrandMark size={36} label="Sivir" />`
        ),
        '',
        "For a narrower import, use the default export: `import BrandMark from '@sivir-ui/svelte/brand-mark';`",
        ''
    ].join('\n');
}

const coreDocs = {
    introduction: `# Introduction

Sivir UI is a Svelte 5 and Tailwind CSS v4 component library. Install it as a package, or use the \`sivir\` CLI to copy component source into your project.

## Requirements

- Svelte 5 (the CLI defaults assume SvelteKit)
- Tailwind CSS v4

## Quick start

~~~~sh
bun add @sivir-ui/svelte
# then in your CSS:
# @import '@sivir-ui/svelte/ui.css';
~~~~

~~~~sh
bunx --package @sivir-ui/svelte sivir init -y
bunx --package @sivir-ui/svelte sivir add button
~~~~
`,
    installation: `# Installation

Install Sivir as a package to get components as a dependency, or use the CLI to copy their source into your project.

## Package

~~~~sh
bun add @sivir-ui/svelte
~~~~

Import the token sheet once in your root stylesheet. It includes Tailwind, so do not also import \`tailwindcss\`:

~~~~css
@import '@sivir-ui/svelte/ui.css';
~~~~

## CLI

~~~~sh
bunx --package @sivir-ui/svelte sivir init -y
bunx --package @sivir-ui/svelte sivir add button
~~~~

\`init\` writes \`sivir.json\`, copies \`ui.css\` and shared utilities into \`src/lib/sivir\`, installs the shared dependencies, and replaces \`@import 'tailwindcss';\` in the root stylesheet \`sv add tailwindcss\` creates (\`src/routes/layout.css\` or \`src/app.css\`) with an import of \`src/lib/sivir/ui.css\`, which includes Tailwind. For any other stylesheet, make that replacement yourself. Without \`-y\`, \`init\` asks for the directory and import alias (default \`$lib/sivir\`) and confirms the dependency install and stylesheet edit.

\`add\` copies each component and the Sivir components it depends on. Quote \`'*'\` to add every component. \`sivir list\` prints component and built-in theme slugs.
`,
    theming: `# Theming

Sivir components read CSS custom properties from \`ui.css\` (\`@sivir-ui/svelte/ui.css\`, or \`src/lib/sivir/ui.css\` after \`sivir init\`). Override them in your own CSS after that import: light values in \`@theme\`, dark values under \`.dark\`.

~~~~css
@theme {
  --color-primary: #155eef;
  --radius-lg: 0.55rem;
  --font-sans: 'DM Sans', sans-serif;
}

.dark {
  --color-primary: #7aa2ff;
}
~~~~

Dark mode applies when \`<html>\` has the \`.dark\` class; some components also read the class there. Sivir does not toggle it.

Built-in presets: \`default\`, \`magic\`, \`profitable\`, \`raven\`, \`clawd\`, and \`inspiration\`. In a CLI project, \`sivir add theme <slug>\` writes \`theme.css\` next to \`ui.css\`; import it after \`ui.css\`.

See the rendered guide at [/docs/theming](/docs/theming) for the token list and theme JSON.
`
} as const;

export function coreMarkdown(page: keyof typeof coreDocs): string {
    return coreDocs[page];
}

export function llmsTxt(origin: string): string {
    const links = [
        ['Introduction', '/docs/introduction.md'],
        ['Installation', '/docs/installation.md'],
        ['Theming', '/docs/theming.md'],
        ['Changelog', '/docs/changelog.md'],
        ['Components index', '/docs/components.md'],
        ['Brand Mark', '/docs/brand-mark.md'],
        ['Sivir skill', '/docs/skill.md'],
        ['Component selection', '/docs/component-selection.md'],
        ['Design language', '/docs/design-language.md'],
        ['XML sitemap', '/sitemap.xml'],
        ...changelogVersions.map((version) => [`Changelog ${version}`, `/changelog/${version}.md`]),
        ...changelogLlmVersions.map((version) => [
            `Changelog ${version} LLM context`,
            `/changelog/${version}/llm.md`
        ]),
        ...components.map((component) => [
            sanitizeComponent(component),
            `/docs/components/${component}.md`
        ])
    ];

    return [
        '# Sivir UI',
        '',
        "Svelte 5 and Tailwind CSS v4 component library. The Markdown pages below hold each component's public API, runnable examples, and per-version upgrade notes.",
        '',
        `The current catalog contains ${components.length} components. Brand Mark and Toolbar are package-only; the CLI copies Toolbar only as a dependency. Approval Request, Marquee, Panel, and Separator were removed as standalone components; the components index lists their replacements.`,
        '',
        '## Agent skill',
        '',
        'Install the Sivir skill so coding agents that support skills load this index, the component selection guide, and the design language:',
        '',
        fence('sh', 'npx skills add aidan-neel/sivir-ui --skill sivir'),
        '',
        `The skill fetches ${origin}/llms.txt as the live catalog. If you are reading this file directly, follow the usage guide below, then load only the Markdown pages you need.`,
        '',
        '## How to use Sivir',
        '',
        sivirGuideMarkdown(origin),
        '',
        '## Documentation',
        '',
        ...links.map(([title, path]) => `- [${title}](${new URL(path, origin).href})`),
        ''
    ].join('\n');
}

export function componentsMarkdown(): string {
    return [
        '# Sivir UI components',
        '',
        'Each component reference is generated at build time from its package manifest, public `index.ts`, and documentation examples.',
        '',
        ...components.map(
            (component) => `- [${sanitizeComponent(component)}](/docs/components/${component}.md)`
        ),
        '',
        '## Package assets',
        '',
        '- [Brand Mark](/docs/brand-mark.md) - package-only logo component; not available through `sivir add`.',
        '',
        '## Removed components',
        '',
        'These names are no longer standalone package exports or CLI installation targets.',
        '',
        ...removedComponents.map(({ name, guidance }) => `- **${name}:** ${guidance}`),
        ''
    ].join('\n');
}
