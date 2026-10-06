export type SidebarVariant = 'sidebar' | 'inset';

export type SidebarCollapsible = 'offcanvas' | 'icon' | 'none';

export type SidebarSide = 'left' | 'right';

export type SidebarSettings = {
    variant: SidebarVariant;
    collapsible: SidebarCollapsible;
    side: SidebarSide;
};

export const sidebarDefaults: SidebarSettings = {
    variant: 'inset',
    collapsible: 'icon',
    side: 'left'
};

const componentDefaults: SidebarSettings = {
    variant: 'sidebar',
    collapsible: 'offcanvas',
    side: 'left'
};

const hints: Record<SidebarCollapsible, string> = {
    offcanvas: 'Slide the panel out of view with the button in this header.',
    icon: 'Collapse the panel to an icon rail with the button in this header.',
    none: 'The panel stays expanded on desktop and opens as a sheet on mobile.'
};

const playgroundImport = /\n\s*import\s*\{[^}]*\}\s*from '\.\.\/playground\/playground';/;
const propsBlock = /\n\s*let \{[^}]*\}:\s*\{[^}]*\} = \$props\(\);\n/;
const hintDeclaration = /\n\s*const hint = \$derived\(sidebarHint\(collapsible\)\);\n/;
const rootProps = /\n(\s*)\{collapsible\}\n\s*\{variant\}/;

export function sidebarHint(collapsible: SidebarCollapsible) {
    return hints[collapsible];
}

function rootAttributes(settings: SidebarSettings, indent: string) {
    const attributes: string[] = [];

    if (settings.collapsible !== componentDefaults.collapsible) {
        attributes.push(`collapsible="${settings.collapsible}"`);
    }
    if (settings.variant !== componentDefaults.variant) {
        attributes.push(`variant="${settings.variant}"`);
    }
    return attributes
        .map((attribute) => {
            return `\n${indent}${attribute}`;
        })
        .join('');
}

function panelSide(settings: SidebarSettings) {
    if (settings.side === componentDefaults.side) {
        return '<Sidebar.Panel ';
    }
    return `<Sidebar.Panel side="${settings.side}" `;
}

export function sidebarCode(source: string, settings: SidebarSettings) {
    return source
        .replace(playgroundImport, '')
        .replace(propsBlock, '\n')
        .replace(hintDeclaration, '\n')
        .replace(rootProps, (_match, indent: string) => {
            return rootAttributes(settings, indent);
        })
        .replace('<Sidebar.Panel {side} ', panelSide(settings))
        .replace('<p>{hint}</p>', `<p>${sidebarHint(settings.collapsible)}</p>`);
}

export function changedSidebarProps(settings: SidebarSettings) {
    const keys = Object.keys(sidebarDefaults) as (keyof SidebarSettings)[];

    return keys.filter((key) => {
        return key !== 'variant' && settings[key] !== sidebarDefaults[key];
    }).length;
}
