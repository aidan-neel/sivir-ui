export type RuleInput = {
    selector: string | null;
    cssText: string;
    customProperties: Array<[string, string]>;
    definesRoot: boolean;
};

export type UsageRule = {
    selector: string;
    tokens: ReadonlySet<string>;
};

export type TokenIndex = {
    rules: UsageRule[];
    resolve: (name: string) => ReadonlySet<string>;
};

const VAR_PATTERN = /var\(\s*(--[\w-]+)/g;
const SCRIPTED_USAGE: UsageRule[] = [
    {
        selector: '[data-ui="switch"]',
        tokens: new Set(['--motion-duration-switch', '--motion-switch-stretch'])
    }
];
const MAX_ALIAS_DEPTH = 8;

export function extractVarNames(text: string): string[] {
    const names = new Set<string>();

    for (const match of text.matchAll(VAR_PATTERN)) {
        names.add(match[1]);
    }

    return [...names];
}

function splitTopLevel(selector: string): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';

    for (let index = 0; index < selector.length; index += 1) {
        const char = selector[index];

        if (char === '\\') {
            current += char + (selector[index + 1] ?? '');
            index += 1;
            continue;
        }

        if (char === '(' || char === '[') {
            depth += 1;
        } else if (char === ')' || char === ']') {
            depth -= 1;
        }

        if (char === ',' && depth === 0) {
            parts.push(current);
            current = '';
            continue;
        }

        current += char;
    }

    parts.push(current);

    return parts.map((part) => {
        return part.trim();
    });
}

type SimplePart = {
    kind: 'anchor' | 'attribute' | 'class';
    text: string;
};

type Compound = {
    parts: SimplePart[];
    combinator: string;
};

function readBalanced(selector: string, start: number, open: string, close: string) {
    let depth = 0;
    let index = start;

    while (index < selector.length) {
        const char = selector[index];

        if (char === '\\') {
            index += 2;
            continue;
        }

        if (char === open) {
            depth += 1;
        } else if (char === close) {
            depth -= 1;

            if (depth === 0) {
                return index + 1;
            }
        }

        index += 1;
    }

    return index;
}

function readIdentifier(selector: string, start: number) {
    let index = start;

    while (index < selector.length) {
        const char = selector[index];

        if (char === '\\') {
            index += 2;
            continue;
        }

        if (!/[\w-]/.test(char) && char.charCodeAt(0) < 128) {
            break;
        }

        index += 1;
    }

    return index;
}

function parseCompounds(selector: string): Compound[] {
    const compounds: Compound[] = [];
    let parts: SimplePart[] = [];
    let combinator = '';
    let index = 0;

    function closeCompound(nextCombinator: string) {
        compounds.push({
            parts,
            combinator
        });
        parts = [];
        combinator = nextCombinator;
    }

    while (index < selector.length) {
        const char = selector[index];

        if (/\s|>|\+|~/.test(char)) {
            let end = index;
            let symbol = ' ';

            while (end < selector.length && /\s|>|\+|~/.test(selector[end])) {
                if (selector[end] !== ' ' && !/\s/.test(selector[end])) {
                    symbol = selector[end];
                }

                end += 1;
            }

            if (parts.length > 0 || compounds.length > 0) {
                closeCompound(symbol);
            }

            index = end;
            continue;
        }

        if (char === ':') {
            const nameStart = selector[index + 1] === ':' ? index + 2 : index + 1;
            let end = readIdentifier(selector, nameStart);

            if (selector[end] === '(') {
                end = readBalanced(selector, end, '(', ')');
            }

            index = end;
            continue;
        }

        if (char === '[') {
            const end = readBalanced(selector, index, '[', ']');
            parts.push({
                kind: 'attribute',
                text: selector.slice(index, end)
            });
            index = end;
            continue;
        }

        if (char === '.' || char === '#') {
            const end = readIdentifier(selector, index + 1);
            parts.push({
                kind: char === '.' ? 'class' : 'anchor',
                text: selector.slice(index, end)
            });
            index = end;
            continue;
        }

        if (char === '&' || char === '*') {
            parts.push({
                kind: 'anchor',
                text: char
            });
            index += 1;
            continue;
        }

        const end = Math.max(readIdentifier(selector, index), index + 1);
        parts.push({
            kind: 'anchor',
            text: selector.slice(index, end)
        });
        index = end;
    }

    if (parts.length > 0 || combinator !== '') {
        closeCompound('');
    }

    return compounds;
}

function stripComplexSelector(selector: string): string | null {
    const compounds = parseCompounds(selector);
    let anchored = false;
    let output = '';

    for (const [position, compound] of compounds.entries()) {
        const hasVariantClass = compound.parts.some((part) => {
            return part.kind === 'class' && part.text.includes('\\:');
        });
        const kept = compound.parts.filter((part) => {
            return !(hasVariantClass && part.kind === 'attribute');
        });
        const text = kept.length > 0 ? kept.map((part) => part.text).join('') : '*';

        if (kept.some((part) => part.text !== '*' && part.text !== '&')) {
            anchored = true;
        }

        if (position > 0) {
            output += compound.combinator === ' ' ? ' ' : ` ${compound.combinator} `;
        }

        output += text;
    }

    if (!anchored) {
        return null;
    }

    return output;
}

/**
 * Removes pseudo-classes and pseudo-elements, and drops attribute selectors
 * from compounds that carry a Tailwind variant class, so state variants such as hover,
 * focus, open, and dark count as used by the element. Returns `null` when no
 * anchoring selector remains.
 */
export function stripStateSelector(selector: string): string | null {
    const stripped = splitTopLevel(selector)
        .map(stripComplexSelector)
        .filter((value): value is string => {
            return value !== null;
        });

    if (stripped.length === 0) {
        return null;
    }

    return stripped.join(', ');
}

export function buildTokenIndex(inputs: RuleInput[], editable: ReadonlySet<string>): TokenIndex {
    const definitions = new Map<string, Set<string>>();

    for (const input of inputs) {
        if (!input.definesRoot) {
            continue;
        }

        for (const [name, value] of input.customProperties) {
            const references = definitions.get(name) ?? new Set<string>();

            for (const reference of extractVarNames(value)) {
                references.add(reference);
            }

            definitions.set(name, references);
        }
    }

    const cache = new Map<string, ReadonlySet<string>>();

    function resolveWithin(name: string, depth: number, visited: Set<string>): Set<string> {
        if (editable.has(name)) {
            return new Set([name]);
        }

        if (depth >= MAX_ALIAS_DEPTH || visited.has(name)) {
            return new Set();
        }

        visited.add(name);

        const resolved = new Set<string>();

        for (const reference of definitions.get(name) ?? []) {
            for (const token of resolveWithin(reference, depth + 1, visited)) {
                resolved.add(token);
            }
        }

        return resolved;
    }

    function resolve(name: string): ReadonlySet<string> {
        const cached = cache.get(name);

        if (cached) {
            return cached;
        }

        const resolved = resolveWithin(name, 0, new Set());
        cache.set(name, resolved);

        return resolved;
    }

    const rules: UsageRule[] = [];

    for (const input of inputs) {
        if (input.selector === null) {
            continue;
        }

        const tokens = new Set<string>();

        for (const name of extractVarNames(input.cssText)) {
            for (const token of resolve(name)) {
                tokens.add(token);
            }
        }

        if (tokens.size === 0) {
            continue;
        }

        rules.push({
            selector: input.selector,
            tokens
        });
    }

    for (const rule of SCRIPTED_USAGE) {
        const tokens = new Set(
            [...rule.tokens].filter((token) => {
                return editable.has(token);
            })
        );

        if (tokens.size > 0) {
            rules.push({
                selector: rule.selector,
                tokens
            });
        }
    }

    return {
        rules,
        resolve
    };
}

function joinNestedSelector(parent: string | null, selector: string): string | null {
    if (parent === null) {
        return stripStateSelector(selector);
    }

    const parents = splitTopLevel(parent);
    const joined = splitTopLevel(selector).flatMap((child) => {
        return parents.map((parentSelector) => {
            return child.includes('&')
                ? child.replaceAll('&', parentSelector)
                : `${parentSelector} ${child}`;
        });
    });

    return stripStateSelector(joined.join(', '));
}

function readCustomProperties(style: CSSStyleDeclaration): Array<[string, string]> {
    const properties: Array<[string, string]> = [];

    for (let index = 0; index < style.length; index += 1) {
        const name = style[index];

        if (name.startsWith('--')) {
            properties.push([name, style.getPropertyValue(name)]);
        }
    }

    return properties;
}

const ROOT_SELECTOR_PATTERN = /^(?::root|:host|html|\.dark)(?![\w-])[^\s>+~]*$/;

function matchesRoot(selector: string) {
    try {
        return document.documentElement.matches(selector);
    } catch {
        return false;
    }
}

function selectorDefinesRoot(selector: string) {
    return splitTopLevel(selector).some((part) => {
        return (
            stripStateSelector(part) === null ||
            ROOT_SELECTOR_PATTERN.test(part) ||
            matchesRoot(part)
        );
    });
}

function readRules(
    rules: CSSRuleList,
    parent: string | null,
    parentDefinesRoot: boolean,
    output: RuleInput[]
) {
    for (const rule of Array.from(rules)) {
        if (rule instanceof CSSStyleRule) {
            const selector = joinNestedSelector(parent, rule.selectorText);
            const definesRoot =
                parent === null ? selectorDefinesRoot(rule.selectorText) : parentDefinesRoot;

            output.push({
                selector,
                cssText: rule.style.cssText,
                customProperties: readCustomProperties(rule.style),
                definesRoot
            });

            if (rule.cssRules && rule.cssRules.length > 0) {
                readRules(rule.cssRules, selector ?? parent, definesRoot, output);
            }

            continue;
        }

        if ('cssRules' in rule && rule.cssRules instanceof CSSRuleList) {
            readRules(rule.cssRules, parent, parentDefinesRoot, output);
        }
    }
}

export function collectRuleInputs(sheets: StyleSheetList | CSSStyleSheet[]): RuleInput[] {
    const output: RuleInput[] = [];

    for (const sheet of Array.from(sheets)) {
        let rules: CSSRuleList;

        try {
            rules = sheet.cssRules;
        } catch {
            continue;
        }

        readRules(rules, null, false, output);
    }

    return output;
}

function safeMatches(element: Element, selector: string) {
    try {
        return element.matches(selector);
    } catch {
        return false;
    }
}

function safeQueryAll(root: Element, selector: string): Element[] {
    try {
        return Array.from(root.querySelectorAll(selector));
    } catch {
        return [];
    }
}

function inlineTokens(index: TokenIndex, element: Element): Set<string> {
    const tokens = new Set<string>();

    for (const name of extractVarNames(element.getAttribute('style') ?? '')) {
        for (const token of index.resolve(name)) {
            tokens.add(token);
        }
    }

    return tokens;
}

export function tokensForElement(index: TokenIndex, element: Element): Set<string> {
    const tokens = inlineTokens(index, element);

    for (const rule of index.rules) {
        if (!safeMatches(element, rule.selector)) {
            continue;
        }

        for (const token of rule.tokens) {
            tokens.add(token);
        }
    }

    return tokens;
}

export function elementsUsingToken(index: TokenIndex, token: string, root: Element): Element[] {
    const elements = new Set<Element>();

    for (const rule of index.rules) {
        if (!rule.tokens.has(token)) {
            continue;
        }

        for (const element of safeQueryAll(root, rule.selector)) {
            elements.add(element);
        }
    }

    for (const element of safeQueryAll(root, '[style*="var(--"]')) {
        if (inlineTokens(index, element).has(token)) {
            elements.add(element);
        }
    }

    return [...elements];
}
