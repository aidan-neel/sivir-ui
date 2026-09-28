<script lang="ts">
    import ChevronRight from '@lucide/svelte/icons/chevron-right';
    import * as Alert from '@sivir-ui/svelte/components/alert';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Badge } from '@sivir-ui/svelte/components/badge';
    import * as Breadcrumb from '@sivir-ui/svelte/components/breadcrumb';
    import { Button } from '@sivir-ui/svelte/components/button';
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';
    import { Gauge } from '@sivir-ui/svelte/components/gauge';
    import { Input } from '@sivir-ui/svelte/components/input';
    import { Progress } from '@sivir-ui/svelte/components/progress';
    import * as RadioGroup from '@sivir-ui/svelte/components/radio-group';
    import * as Select from '@sivir-ui/svelte/components/select';
    import { Slider } from '@sivir-ui/svelte/components/slider';
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import * as Tabs from '@sivir-ui/svelte/components/tabs';
    import * as TagInput from '@sivir-ui/svelte/components/tag-input';
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';
    import { builtInThemePresets } from '@sivir-ui/svelte/themes/builtin-presets';
    import {
        applyLiveThemeCss,
        clearLiveThemeCss,
        getStoredLiveThemeCss
    } from '@sivir-ui/svelte/themes/live';
    import { themeToCss } from '@sivir-ui/svelte/themes/theme';
    import { onMount } from 'svelte';

    const regions = [
        {
            value: 'iad',
            label: 'Washington, D.C.'
        },
        {
            value: 'fra',
            label: 'Frankfurt'
        },
        {
            value: 'sin',
            label: 'Singapore'
        }
    ];

    const roles = ['Owner', 'Editor', 'Viewer'];

    const sectionTitleClass =
        'm-0 [font-size:var(--font-size-body)] [font-weight:var(--font-weight-label)] text-foreground';
    const fieldLabelClass =
        '[font-size:var(--font-size-label)] [font-weight:var(--font-weight-label)] [letter-spacing:var(--tracking-label)] leading-none text-foreground';
    const metaClass = '[font-size:var(--font-size-label)] text-foreground-muted';

    let themeSlug = $state<string | undefined>('default');
    let tab = $state('general');
    let workspaceName = $state('Northwind');
    let region = $state('fra');
    let timeout = $state(30);
    let invites = $state(['sam@northwind.dev']);
    let digest = $state('mentions');
    let notifyDeploys = $state(true);
    let notifyComments = $state(true);
    let notifyBilling = $state(false);
    let plan = $state('team');
    let members = $state([
        {
            initials: 'MR',
            name: 'Maya Reyes',
            email: 'maya@northwind.dev',
            role: 'Owner'
        },
        {
            initials: 'JO',
            name: 'Jonah Okafor',
            email: 'jonah@northwind.dev',
            role: 'Editor'
        },
        {
            initials: 'LK',
            name: 'Lena Kraus',
            email: 'lena@northwind.dev',
            role: 'Viewer'
        }
    ]);

    const regionLabel = $derived(regions.find((option) => option.value === region)?.label);

    onMount(() => {
        const stored = getStoredLiveThemeCss();

        if (!stored) {
            return;
        }

        const match = builtInThemePresets.find((preset) => themeToCss(preset) === stored);

        themeSlug = match?.slug;
    });

    function selectTheme(value: string | string[] | undefined) {
        const preset = builtInThemePresets.find((option) => option.slug === value);

        if (!preset) {
            return;
        }

        if (preset.slug === 'default') {
            clearLiveThemeCss();
            return;
        }

        applyLiveThemeCss(themeToCss(preset));
    }
</script>

<section
    aria-label="Workspace settings built with Sivir components"
    class="overflow-hidden rounded-[var(--radius-xl)] border-[length:var(--border-size)] border-border bg-panel"
>
    <div
        class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b-[length:var(--border-size)] border-border px-4 py-2.5"
    >
        <Breadcrumb.Root>
            <Breadcrumb.Item>Northwind</Breadcrumb.Item>
            <Breadcrumb.Separator><ChevronRight size={14} /></Breadcrumb.Separator>
            <Breadcrumb.Item>Settings</Breadcrumb.Item>
        </Breadcrumb.Root>

        <div
            class="flex max-w-full min-w-0 items-center gap-3 overflow-x-auto [scrollbar-width:none]"
        >
            <span class={metaClass}>Theme</span>
            <ToggleGroup.Root type="single" bind:value={themeSlug} onValueChange={selectTheme}>
                {#each builtInThemePresets as preset (preset.slug)}
                    <ToggleGroup.Item value={preset.slug}>{preset.name}</ToggleGroup.Item>
                {/each}
            </ToggleGroup.Root>
        </div>
    </div>

    <Tabs.Root bind:value={tab} variant="ghost">
        <div
            class="overflow-x-auto border-b-[length:var(--border-size)] border-border px-3 py-2 [scrollbar-width:none]"
        >
            <Tabs.List>
                <Tabs.Trigger value="general">General</Tabs.Trigger>
                <Tabs.Trigger value="members">Members</Tabs.Trigger>
                <Tabs.Trigger value="notifications">Notifications</Tabs.Trigger>
                <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
            </Tabs.List>
        </div>

        <div class="grid lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div class="flex min-w-0 flex-col">
                <Tabs.Content value="general" class="grid gap-6 p-5 sm:grid-cols-2">
                    <Input
                        label="Workspace name"
                        bind:value={workspaceName}
                        description="Shown in invites and emails."
                    />

                    <div class="flex flex-col gap-1.5">
                        <span class={fieldLabelClass}>Data region</span>
                        <Select.Root bind:value={region}>
                            <Select.Trigger aria-label="Data region">{regionLabel}</Select.Trigger>
                            <Select.Content>
                                {#each regions as option (option.value)}
                                    <Select.Item value={option.value}>{option.label}</Select.Item>
                                {/each}
                            </Select.Content>
                        </Select.Root>
                    </div>

                    <Switch
                        label="Require two-factor sign-in"
                        description="Members set it up on their next visit."
                        checked
                    />

                    <Switch
                        label="Allow guest links"
                        description="Share read-only pages outside the workspace."
                    />

                    <div class="sm:col-span-2">
                        <Slider
                            bind:value={timeout}
                            min={5}
                            max={120}
                            step={5}
                            label="Idle sign-out"
                            format={(value) => {
                                return `${value} min`;
                            }}
                        />
                    </div>
                </Tabs.Content>

                <Tabs.Content value="members" class="flex flex-col gap-6 p-5">
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <TagInput.Root
                            bind:tags={invites}
                            label="Invite by email"
                            description="Press Enter after each address."
                            class="min-w-0 flex-1"
                        >
                            <TagInput.List />
                            <TagInput.Input placeholder="name@company.com" />
                        </TagInput.Root>
                        <Button class="sm:mb-6">Send invites</Button>
                    </div>

                    <ul class="m-0 flex list-none flex-col gap-4 p-0">
                        {#each members as member (member.email)}
                            <li class="flex items-center gap-3">
                                <Avatar.Root>
                                    <Avatar.Fallback>{member.initials}</Avatar.Fallback>
                                </Avatar.Root>
                                <div class="flex min-w-0 flex-1 flex-col">
                                    <span
                                        class="truncate [font-size:var(--font-size-body)] text-foreground"
                                    >
                                        {member.name}
                                    </span>
                                    <span class={`truncate ${metaClass}`}>{member.email}</span>
                                </div>
                                <Select.Root bind:value={member.role}>
                                    <Select.Trigger
                                        variant="ghost"
                                        class="w-auto"
                                        aria-label={`Role for ${member.name}`}
                                    >
                                        {member.role}
                                    </Select.Trigger>
                                    <Select.Content>
                                        {#each roles as role (role)}
                                            <Select.Item value={role}>{role}</Select.Item>
                                        {/each}
                                    </Select.Content>
                                </Select.Root>
                            </li>
                        {/each}
                    </ul>
                </Tabs.Content>

                <Tabs.Content value="notifications" class="grid gap-8 p-5 sm:grid-cols-2">
                    <div class="flex flex-col gap-3">
                        <p class={sectionTitleClass}>Email me about</p>
                        <RadioGroup.Root bind:value={digest} name="digest">
                            <RadioGroup.Item
                                value="all"
                                label="Everything"
                                description="Every comment, deploy, and invite."
                            />
                            <RadioGroup.Item
                                value="mentions"
                                label="Mentions only"
                                description="When someone tags you directly."
                            />
                            <RadioGroup.Item
                                value="none"
                                label="Nothing"
                                description="Check the inbox when you like."
                            />
                        </RadioGroup.Root>
                    </div>

                    <div class="flex flex-col gap-3">
                        <p class={sectionTitleClass}>Push notifications</p>
                        <Checkbox bind:checked={notifyDeploys} label="Deploys finish or fail" />
                        <Checkbox bind:checked={notifyComments} label="New comments" />
                        <Checkbox bind:checked={notifyBilling} label="Billing changes" />
                    </div>
                </Tabs.Content>

                <Tabs.Content value="billing" class="flex flex-col gap-6 p-5">
                    <Alert.Root variant="warning">
                        <Alert.Title>Storage is 72% full</Alert.Title>
                        <Alert.Description>
                            Uploads pause at 10 GB. Move to Business to raise the limit to 100 GB.
                        </Alert.Description>
                    </Alert.Root>

                    <RadioGroup.Root bind:value={plan} name="plan">
                        <RadioGroup.Item
                            value="team"
                            label="Team · $12 per seat"
                            description="10 GB storage and a 30-day history."
                        />
                        <RadioGroup.Item
                            value="business"
                            label="Business · $24 per seat"
                            description="100 GB storage, SSO, and an audit log."
                        />
                    </RadioGroup.Root>
                </Tabs.Content>

                <div
                    class="mt-auto flex items-center justify-end gap-2 border-t-[length:var(--border-size)] border-border px-5 py-3"
                >
                    <Button variant="ghost">Cancel</Button>
                    <Button>Save changes</Button>
                </div>
            </div>

            <aside
                aria-label="Workspace usage"
                class="flex flex-col gap-6 border-t-[length:var(--border-size)] border-border p-5 lg:border-t-0 lg:border-l-[length:var(--border-size)]"
            >
                <div class="flex items-center justify-between gap-3">
                    <p class={sectionTitleClass}>Usage</p>
                    <Badge variant="secondary">Team plan</Badge>
                </div>

                <div class="flex items-center gap-3">
                    <Gauge value={72} label="Storage used" tone="warning" size={44}>72%</Gauge>
                    <div class="flex min-w-0 flex-col">
                        <span class="[font-size:var(--font-size-body)] text-foreground"
                            >Storage</span
                        >
                        <span class={`font-mono tabular-nums ${metaClass}`}>7.2 of 10 GB</span>
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <span class={fieldLabelClass}>Seats</span>
                        <span class={`font-mono tabular-nums ${metaClass}`}>3 of 5</span>
                    </div>
                    <Progress value={60} />
                </div>

                <div class="flex flex-col gap-2">
                    <div class="flex items-center justify-between">
                        <span class={fieldLabelClass}>API requests</span>
                        <span class={`font-mono tabular-nums ${metaClass}`}>41k of 100k</span>
                    </div>
                    <Progress value={41} />
                </div>

                <div class="mt-auto flex items-center justify-between gap-3">
                    <div class="flex gap-1">
                        {#each members as member (member.email)}
                            <Avatar.Root>
                                <Avatar.Fallback>{member.initials}</Avatar.Fallback>
                            </Avatar.Root>
                        {/each}
                    </div>
                    <Button variant="outline" onclick={() => (tab = 'members')}> Manage </Button>
                </div>
            </aside>
        </div>
    </Tabs.Root>
</section>
