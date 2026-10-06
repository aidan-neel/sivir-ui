export type ShowMoreLines = '1' | '2' | '3' | '4';

export type ShowMoreMaxHeight = '96' | '160' | '320';

export type ShowMoreSettings = {
    lines: ShowMoreLines;
    maxHeight: ShowMoreMaxHeight;
    defaultExpanded: boolean;
};

export const showMoreDefaults: ShowMoreSettings = {
    lines: '2',
    maxHeight: '320',
    defaultExpanded: false
};

const COMPONENT_LINES = '3';
const COMPONENT_MAX_HEIGHT = '320';

export const incidentParagraphs = [
    'On March 4, checkout requests in the EU region failed for 23 minutes after a configuration change lowered the connection pool limit on the payments database from 200 to 20.',
    'Client retries tripled traffic to the API during the outage, which slowed recovery after the limit was restored. About 1,800 orders failed, and none of those customers were charged.',
    'We now validate pool limits in CI, cap client retries at three with backoff, and page the on-call engineer when the checkout error rate stays above 2% for five minutes.'
];

function showMoreProps(settings: ShowMoreSettings) {
    const props: string[] = [];

    if (settings.lines !== COMPONENT_LINES) {
        props.push(`lines={${settings.lines}}`);
    }
    if (settings.maxHeight !== COMPONENT_MAX_HEIGHT) {
        props.push(`maxHeight={${settings.maxHeight}}`);
    }
    if (settings.defaultExpanded) {
        props.push('defaultExpanded');
    }
    props.push('label="Incident summary"');
    return props;
}

function paragraphLines() {
    return incidentParagraphs
        .map((paragraph) => {
            return `        '${paragraph}'`;
        })
        .join(',\n');
}

export function showMoreCode(settings: ShowMoreSettings) {
    return `<script lang="ts">
    import { ShowMore } from '@sivir-ui/svelte/components/show-more';

    const paragraphs = [
${paragraphLines()}
    ];
</script>

<div class="w-full max-w-md">
    <ShowMore ${showMoreProps(settings).join(' ')}>
        <div class="flex flex-col gap-2">
            {#each paragraphs as paragraph (paragraph)}
                <p>{paragraph}</p>
            {/each}
        </div>
    </ShowMore>
</div>
`;
}

export function changedShowMoreProps(settings: ShowMoreSettings) {
    const keys = Object.keys(showMoreDefaults) as (keyof ShowMoreSettings)[];

    return keys.filter((key) => {
        return settings[key] !== showMoreDefaults[key];
    }).length;
}
