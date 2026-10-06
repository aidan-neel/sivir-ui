import type { TagInputVariant } from '@sivir-ui/svelte/components/tag-input';

export type TagInputExample = 'topics' | 'emails' | 'channels';

export type TagInputDelimiters = 'comma' | 'space' | 'enter';

export type TagInputMax = 'none' | '3' | '5';

export type TagInputSettings = {
    example: TagInputExample;
    variant: TagInputVariant;
    label: boolean;
    description: boolean;
    error: boolean;
    disabled: boolean;
    required: boolean;
    allowDuplicates: boolean;
    addOnBlur: boolean;
    addOnPaste: boolean;
    max: TagInputMax;
    delimiters: TagInputDelimiters;
};

export type TagInputContent = {
    label: string;
    description: string;
    placeholder: string;
    error: string;
    tags: string[];
    email: boolean;
};

export const tagInputDefaults: Omit<TagInputSettings, 'example'> = {
    variant: 'outline',
    label: true,
    description: true,
    error: false,
    disabled: false,
    required: false,
    allowDuplicates: false,
    addOnBlur: true,
    addOnPaste: true,
    max: 'none',
    delimiters: 'comma'
};

export const tagInputContent: Record<TagInputExample, TagInputContent> = {
    topics: {
        label: 'Topics',
        description: 'Type a topic and press Enter.',
        placeholder: 'Add a topic…',
        error: 'Remove a topic to continue.',
        tags: ['svelte', 'design-system', 'tailwind'],
        email: false
    },
    emails: {
        label: 'Invite',
        description: 'Separate addresses with a comma.',
        placeholder: 'name@company.com',
        error: 'One address bounced.',
        tags: ['ada@sivir.dev', 'linus@sivir.dev'],
        email: true
    },
    channels: {
        label: 'Channels',
        description: 'Release alerts post to these channels.',
        placeholder: 'Add a channel…',
        error: 'Pick at most three channels.',
        tags: ['announcements'],
        email: false
    }
};

const DELIMITERS: Record<TagInputDelimiters, string[]> = {
    comma: [','],
    space: [',', ' '],
    enter: []
};

export function tagInputDelimiters(delimiters: TagInputDelimiters) {
    return DELIMITERS[delimiters];
}

export function tagInputMax(max: TagInputMax) {
    return max === 'none' ? undefined : Number(max);
}

export function isEmail(tag: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag) || 'Enter a valid email address.';
}

function rootProps(settings: TagInputSettings, content: TagInputContent) {
    const props = ['bind:tags'];

    if (settings.variant !== tagInputDefaults.variant) {
        props.push(`variant="${settings.variant}"`);
    }
    if (settings.label) {
        props.push(`label="${content.label}"`);
    }
    if (settings.description) {
        props.push(`description="${content.description}"`);
    }
    if (settings.error) {
        props.push(`error="${content.error}"`);
    }
    if (settings.max !== 'none') {
        props.push(`max={${settings.max}}`);
    }
    if (settings.delimiters !== tagInputDefaults.delimiters) {
        const list = DELIMITERS[settings.delimiters]
            .map((delimiter) => {
                return `'${delimiter}'`;
            })
            .join(', ');

        props.push(`delimiters={[${list}]}`);
    }
    if (content.email) {
        props.push('validate={isEmail}');
        props.push('normalize={(tag) => tag.toLowerCase()}');
    }
    if (settings.allowDuplicates) {
        props.push('allowDuplicates');
    }
    if (!settings.addOnBlur) {
        props.push('addOnBlur={false}');
    }
    if (!settings.addOnPaste) {
        props.push('addOnPaste={false}');
    }
    if (settings.required) {
        props.push('required');
    }
    if (settings.disabled) {
        props.push('disabled');
    }
    return props;
}

export function tagInputCode(settings: TagInputSettings) {
    const content = tagInputContent[settings.example];
    const tags = content.tags
        .map((tag) => {
            return `'${tag}'`;
        })
        .join(', ');
    const scriptLines = [
        "    import * as TagInput from '@sivir-ui/svelte/components/tag-input';",
        '',
        `    let tags = $state([${tags}]);`
    ];

    if (content.email) {
        scriptLines.push(
            '',
            '    function isEmail(tag: string) {',
            "        return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(tag) || 'Enter a valid email address.';",
            '    }'
        );
    }

    const props = rootProps(settings, content)
        .map((prop) => {
            return `    ${prop}`;
        })
        .join('\n');

    return `<script lang="ts">
${scriptLines.join('\n')}
</script>

<TagInput.Root
${props}
>
    <TagInput.List />
    <TagInput.Input placeholder="${content.placeholder}" />
</TagInput.Root>
`;
}

export function changedTagInputProps(settings: TagInputSettings) {
    const keys = Object.keys(tagInputDefaults) as (keyof typeof tagInputDefaults)[];

    return keys.filter((key) => {
        return settings[key] !== tagInputDefaults[key];
    }).length;
}
