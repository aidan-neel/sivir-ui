export type FileKind =
    | 'image'
    | 'video'
    | 'audio'
    | 'archive'
    | 'code'
    | 'sheet'
    | 'text'
    | 'other';

const archiveExtensions = new Set(['zip', 'gz', 'tgz', 'tar', 'rar', '7z', 'bz2', 'xz']);
const codeExtensions = new Set([
    'js',
    'ts',
    'jsx',
    'tsx',
    'svelte',
    'json',
    'html',
    'css',
    'py',
    'rs',
    'go',
    'sh',
    'yml',
    'yaml',
    'toml',
    'xml'
]);
const sheetExtensions = new Set(['csv', 'tsv', 'xls', 'xlsx', 'ods', 'numbers']);
const textExtensions = new Set(['txt', 'md', 'pdf', 'doc', 'docx', 'rtf', 'odt', 'pages']);

export function formatBytes(bytes: number) {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const units = ['KB', 'MB', 'GB', 'TB'];
    let value = bytes / 1024;
    let unit = 0;

    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024;
        unit += 1;
    }

    return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

export function splitFileName(name: string) {
    const dot = name.lastIndexOf('.');

    if (dot <= 0 || dot === name.length - 1) {
        return {
            base: name,
            extension: ''
        };
    }

    return {
        base: name.slice(0, dot),
        extension: name.slice(dot)
    };
}

export function fileKind(file: File): FileKind {
    const type = file.type.toLowerCase();
    const extension = splitFileName(file.name).extension.slice(1).toLowerCase();

    if (type.startsWith('image/')) {
        return 'image';
    }
    if (type.startsWith('video/')) {
        return 'video';
    }
    if (type.startsWith('audio/')) {
        return 'audio';
    }
    if (archiveExtensions.has(extension) || type.includes('zip') || type.includes('compressed')) {
        return 'archive';
    }
    if (sheetExtensions.has(extension) || type.includes('spreadsheet') || type === 'text/csv') {
        return 'sheet';
    }
    if (codeExtensions.has(extension) || type.includes('json') || type.includes('javascript')) {
        return 'code';
    }
    if (textExtensions.has(extension) || type.startsWith('text/') || type === 'application/pdf') {
        return 'text';
    }

    return 'other';
}
