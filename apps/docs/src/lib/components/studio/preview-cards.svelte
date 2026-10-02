<script lang="ts">
    import Minus from '@lucide/svelte/icons/minus';
    import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
    import Plus from '@lucide/svelte/icons/plus';
    import * as Alert from '@sivir-ui/svelte/components/alert';
    import * as Avatar from '@sivir-ui/svelte/components/avatar';
    import { Badge, type BadgeVariant } from '@sivir-ui/svelte/components/badge';
    import { Button } from '@sivir-ui/svelte/components/button';
    import * as Card from '@sivir-ui/svelte/components/card';
    import { Checkbox } from '@sivir-ui/svelte/components/checkbox';
    import * as DropdownMenu from '@sivir-ui/svelte/components/dropdown-menu';
    import { Gauge } from '@sivir-ui/svelte/components/gauge';
    import { Input } from '@sivir-ui/svelte/components/input';
    import * as Message from '@sivir-ui/svelte/components/message';
    import { Progress } from '@sivir-ui/svelte/components/progress';
    import * as RadioGroup from '@sivir-ui/svelte/components/radio-group';
    import * as Select from '@sivir-ui/svelte/components/select';
    import { Skeleton } from '@sivir-ui/svelte/components/skeleton';
    import * as Slider from '@sivir-ui/svelte/components/slider';
    import { Switch } from '@sivir-ui/svelte/components/switch';
    import { type TaskStep, TaskSteps } from '@sivir-ui/svelte/components/task-steps';
    import { Textarea } from '@sivir-ui/svelte/components/textarea';
    import * as ToggleGroup from '@sivir-ui/svelte/components/toggle-group';
    import * as Typography from '@sivir-ui/svelte/components/typography';

    type Payment = {
        id: string;
        email: string;
        status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
        amount: string;
    };

    type Member = {
        name: string;
        email: string;
        initials: string;
        role: string;
    };

    const revenueLine = [12, 14, 13, 15, 14, 16, 15, 17, 16, 19, 24, 31];
    const subscriptionLine = [8, 11, 15, 22, 26, 21, 14, 18, 25, 23, 15, 13];
    const goalBars = [62, 48, 34, 51, 39, 56, 44, 50, 63, 41, 55, 37, 68];
    const roles = ['Owner', 'Editor', 'Viewer'];
    const deploySteps: TaskStep[] = [
        {
            id: 'install',
            label: 'Install dependencies',
            meta: '6.2s'
        },
        {
            id: 'build',
            label: 'Build',
            meta: '18.4s'
        },
        {
            id: 'checks',
            label: 'Run checks',
            meta: '9.1s'
        },
        {
            id: 'deploy',
            label: 'Deploy to edge'
        }
    ];
    const payments: Payment[] = [
        {
            id: 'pay-1',
            email: 'ken99@example.com',
            status: 'Paid',
            amount: '$316.00'
        },
        {
            id: 'pay-2',
            email: 'abe45@example.com',
            status: 'Paid',
            amount: '$242.00'
        },
        {
            id: 'pay-3',
            email: 'monserrat44@example.com',
            status: 'Pending',
            amount: '$837.00'
        },
        {
            id: 'pay-4',
            email: 'carmella@example.com',
            status: 'Failed',
            amount: '$721.00'
        },
        {
            id: 'pay-5',
            email: 'jason78@example.com',
            status: 'Refunded',
            amount: '$450.00'
        }
    ];

    let calorieGoal = $state(350);
    let plan = $state('starter');
    let agreeTerms = $state(false);
    let sendEmails = $state(true);
    let members = $state<Member[]>([
        {
            name: 'Sofia Davis',
            email: 'sofia@example.com',
            initials: 'SD',
            role: 'Owner'
        },
        {
            name: 'Jackson Lee',
            email: 'jackson@example.com',
            initials: 'JL',
            role: 'Editor'
        },
        {
            name: 'Isabella Nguyen',
            email: 'isabella@example.com',
            initials: 'IN',
            role: 'Viewer'
        }
    ]);
    let cookieFunctional = $state(true);
    let cookieAnalytics = $state(false);
    let cookieMarketing = $state(false);
    let issueArea = $state('billing');
    let issueSeverity = $state('medium');
    let volume = $state(64);
    let notificationChannel = $state('mentions');

    function sparkline(values: number[], width: number, height: number): string {
        const max = Math.max(...values);
        const min = Math.min(...values);
        const span = max - min || 1;
        const step = width / (values.length - 1);

        return values
            .map((value, index) => {
                const x = index * step;
                const y = height - ((value - min) / span) * (height - 4) - 2;

                return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');
    }

    function adjustGoal(delta: number) {
        calorieGoal = Math.min(Math.max(calorieGoal + delta, 100), 900);
    }

    function paymentVariant(status: Payment['status']): BadgeVariant {
        if (status === 'Paid') {
            return 'success';
        }
        if (status === 'Pending') {
            return 'warning';
        }
        if (status === 'Failed') {
            return 'error';
        }

        return 'secondary';
    }
</script>

<div class="columns-1 gap-4 md:columns-2 xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
    <Card.Root>
        <Card.Header>
            <Card.Description>Total revenue</Card.Description>
            <Card.Title class="text-2xl tabular-nums">$15,231.89</Card.Title>
            <Typography.Metadata>+20.1% from last month</Typography.Metadata>
        </Card.Header>
        <Card.Content>
            <svg viewBox="0 0 240 64" class="h-16 w-full text-primary" aria-hidden="true">
                <polyline
                    points={sparkline(revenueLine, 240, 64)}
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </Card.Content>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Create an account</Card.Title>
            <Card.Description>Enter your email below to create your account.</Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-2">
                <Button variant="outline">GitHub</Button>
                <Button variant="outline">Google</Button>
            </div>
            <div class="flex items-center gap-3">
                <div class="h-px flex-1 bg-border"></div>
                <Typography.Metadata>Or continue with</Typography.Metadata>
                <div class="h-px flex-1 bg-border"></div>
            </div>
            <Input label="Email" type="email" placeholder="m@example.com" />
            <Input label="Password" type="password" />
        </Card.Content>
        <Card.Footer>
            <Button class="w-full">Create account</Button>
        </Card.Footer>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Move goal</Card.Title>
            <Card.Description>Set your daily activity goal.</Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col gap-5">
            <div class="flex items-center justify-between gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    class="rounded-full"
                    aria-label="Decrease goal"
                    disabled={calorieGoal <= 100}
                    onclick={() => {
                        adjustGoal(-10);
                    }}
                >
                    <Minus size={14} />
                </Button>
                <div class="flex flex-col items-center">
                    <span class="text-4xl font-semibold tracking-tight tabular-nums">
                        {calorieGoal}
                    </span>
                    <Typography.Metadata>Calories per day</Typography.Metadata>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    class="rounded-full"
                    aria-label="Increase goal"
                    disabled={calorieGoal >= 900}
                    onclick={() => {
                        adjustGoal(10);
                    }}
                >
                    <Plus size={14} />
                </Button>
            </div>
            <div class="flex h-16 items-end gap-1" aria-hidden="true">
                {#each goalBars as bar, index (index)}
                    <div
                        class="flex-1 rounded-[var(--radius-sm)] bg-primary/80"
                        style:height={`${bar + (calorieGoal - 350) / 12}%`}
                    ></div>
                {/each}
            </div>
        </Card.Content>
        <Card.Footer>
            <Button variant="secondary" class="w-full">Set goal</Button>
        </Card.Footer>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Description>Subscriptions</Card.Description>
            <Card.Title class="text-2xl tabular-nums">+2,350</Card.Title>
            <Typography.Metadata>+180.1% from last month</Typography.Metadata>
        </Card.Header>
        <Card.Content>
            <svg viewBox="0 0 240 64" class="h-16 w-full text-primary" aria-hidden="true">
                <polygon
                    points={`0,64 ${sparkline(subscriptionLine, 240, 64)} 240,64`}
                    fill="currentColor"
                    fill-opacity="0.12"
                />
                <polyline
                    points={sparkline(subscriptionLine, 240, 64)}
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </Card.Content>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Upgrade your subscription</Card.Title>
            <Card.Description>
                You are on the free plan. Upgrade to unlock every feature.
            </Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-2">
                <Input label="Name" placeholder="Evil Rabbit" />
                <Input label="Email" type="email" placeholder="example@acme.com" />
            </div>
            <Input label="Card number" placeholder="1234 1234 1234 1234" />
            <RadioGroup.Root bind:value={plan} name="studio-plan">
                <RadioGroup.Item
                    value="starter"
                    label="Starter plan"
                    description="For small teams getting started."
                />
                <RadioGroup.Item
                    value="pro"
                    label="Pro plan"
                    description="More seats, storage, and audit logs."
                />
            </RadioGroup.Root>
            <Textarea label="Notes" placeholder="Anything we should know?" />
            <div class="flex flex-col gap-2">
                <Checkbox bind:checked={agreeTerms} label="I agree to the terms and conditions" />
                <Checkbox bind:checked={sendEmails} label="Send me product updates" />
            </div>
        </Card.Content>
        <Card.Footer class="justify-between">
            <Button variant="ghost">Cancel</Button>
            <Button disabled={!agreeTerms}>Upgrade plan</Button>
        </Card.Footer>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Team members</Card.Title>
            <Card.Description>Invite your team members to collaborate.</Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            {#each members as member, index (member.email)}
                <div class="flex items-center gap-3">
                    <Avatar.Root size="md">
                        <Avatar.Fallback>{member.initials}</Avatar.Fallback>
                    </Avatar.Root>
                    <div class="flex min-w-0 flex-1 flex-col">
                        <Typography.Text class="truncate">{member.name}</Typography.Text>
                        <Typography.Metadata class="truncate">{member.email}</Typography.Metadata>
                    </div>
                    <Select.Root bind:value={members[index].role}>
                        <Select.Trigger
                            variant="outline"
                            size="sm"
                            aria-label={`Role for ${member.name}`}
                        >
                            {member.role}
                        </Select.Trigger>
                        <Select.Content>
                            {#each roles as role (role)}
                                <Select.Item value={role} label={role}>{role}</Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Root>
                </div>
            {/each}
        </Card.Content>
    </Card.Root>

    <Card.Root>
        <Card.Header class="flex-row items-center gap-3">
            <Avatar.Root size="md">
                <Avatar.Fallback>SD</Avatar.Fallback>
            </Avatar.Root>
            <div class="flex min-w-0 flex-1 flex-col">
                <Card.Title>Sofia Davis</Card.Title>
                <Card.Description>m@example.com</Card.Description>
            </div>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            <Message.Root from="assistant">
                <Message.Content>Hi, how can I help you today?</Message.Content>
            </Message.Root>
            <Message.Root from="user">
                <Message.Content>I'm having trouble with my account.</Message.Content>
            </Message.Root>
            <Message.Root from="assistant">
                <Message.Content>What seems to be the problem?</Message.Content>
            </Message.Root>
            <Message.Root from="user">
                <Message.Content>I can't sign in.</Message.Content>
            </Message.Root>
        </Card.Content>
        <Card.Footer>
            <Input placeholder="Type your message…" aria-label="Message" class="w-full" />
        </Card.Footer>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Deploy release</Card.Title>
            <Card.Description>web-2418 · main</Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            <TaskSteps steps={deploySteps} current={3} label="Deploy progress" />
            <Progress value={78} />
        </Card.Content>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Payments</Card.Title>
            <Card.Description>Manage your payments.</Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col">
            {#each payments as payment (payment.id)}
                <div class="flex items-center gap-3 border-b border-border py-2.5 last:border-b-0">
                    <div class="flex min-w-0 flex-1 flex-col">
                        <Typography.Text class="truncate">{payment.email}</Typography.Text>
                        <Typography.Metadata class="tabular-nums">
                            {payment.amount}
                        </Typography.Metadata>
                    </div>
                    <Badge variant={paymentVariant(payment.status)}>{payment.status}</Badge>
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger
                            variant="ghost"
                            size="icon"
                            aria-label={`Actions for ${payment.email}`}
                        >
                            <MoreHorizontal size={16} />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                            <DropdownMenu.Item>Copy payment ID</DropdownMenu.Item>
                            <DropdownMenu.Item>View customer</DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item>Refund</DropdownMenu.Item>
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </div>
            {/each}
        </Card.Content>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Cookie settings</Card.Title>
            <Card.Description>Manage your cookie preferences.</Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            <Switch
                checked
                disabled
                label="Strictly necessary"
                description="Required to sign in."
            />
            <Switch
                bind:checked={cookieFunctional}
                label="Functional"
                description="Remember language and layout choices."
            />
            <Switch
                bind:checked={cookieAnalytics}
                label="Analytics"
                description="Help us understand how the product is used."
            />
            <Switch
                bind:checked={cookieMarketing}
                label="Marketing"
                description="Personalize offers across sites."
            />
        </Card.Content>
        <Card.Footer>
            <Button variant="outline" class="w-full">Save preferences</Button>
        </Card.Footer>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Storage</Card.Title>
            <Card.Description>Shared across 3 workspaces.</Card.Description>
        </Card.Header>
        <Card.Content>
            <div class="flex items-center gap-4">
                <Gauge value={72} label="Storage used" tone="warning" size={56}>72%</Gauge>
                <div class="flex min-w-0 flex-col gap-0.5">
                    <Typography.Text>72 GB of 100 GB</Typography.Text>
                    <Typography.Metadata>Clear old builds to free space.</Typography.Metadata>
                </div>
            </div>
        </Card.Content>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Report an issue</Card.Title>
            <Card.Description>What area are you having problems with?</Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            <div class="grid grid-cols-2 gap-2">
                <Select.Root bind:value={issueArea}>
                    <Select.Trigger variant="outline" aria-label="Area">
                        {issueArea === 'billing' ? 'Billing' : 'Account'}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="billing" label="Billing">Billing</Select.Item>
                        <Select.Item value="account" label="Account">Account</Select.Item>
                    </Select.Content>
                </Select.Root>
                <Select.Root bind:value={issueSeverity}>
                    <Select.Trigger variant="outline" aria-label="Severity">
                        {issueSeverity === 'high' ? 'High' : issueSeverity === 'low' ? 'Low' : 'Medium'}
                    </Select.Trigger>
                    <Select.Content>
                        <Select.Item value="low" label="Low">Low</Select.Item>
                        <Select.Item value="medium" label="Medium">Medium</Select.Item>
                        <Select.Item value="high" label="High">High</Select.Item>
                    </Select.Content>
                </Select.Root>
            </div>
            <Input label="Subject" placeholder="I need help with…" />
            <Textarea
                label="Description"
                placeholder="Include steps to reproduce, if any."
                autoresize
            />
        </Card.Content>
        <Card.Footer class="justify-between">
            <Button variant="ghost">Cancel</Button>
            <Button>Submit</Button>
        </Card.Footer>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Notifications</Card.Title>
            <Card.Description>Choose what reaches your inbox.</Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            <ToggleGroup.Root type="single" bind:value={notificationChannel} class="w-full">
                <ToggleGroup.Item value="all" class="flex-1">All</ToggleGroup.Item>
                <ToggleGroup.Item value="mentions" class="flex-1">Mentions</ToggleGroup.Item>
                <ToggleGroup.Item value="none" class="flex-1">None</ToggleGroup.Item>
            </ToggleGroup.Root>
            <Slider.Root
                bind:value={volume}
                min={0}
                max={100}
                step={1}
                label="Alert volume"
                format={(value) => {
                    return `${value}%`;
                }}
            />
            <Alert.Root variant="info">
                <Alert.Title>Quiet hours are on</Alert.Title>
                <Alert.Description>Alerts pause from 10 PM to 7 AM.</Alert.Description>
            </Alert.Root>
        </Card.Content>
    </Card.Root>

    <Card.Root>
        <Card.Header>
            <Card.Title>Loading state</Card.Title>
            <Card.Description>Skeletons while the feed resolves.</Card.Description>
        </Card.Header>
        <Card.Content class="flex flex-col gap-4">
            {#each [0, 1, 2] as row (row)}
                <div class="flex items-center gap-3">
                    <Skeleton w={36} h={36} class="rounded-full" />
                    <div class="flex flex-1 flex-col gap-2">
                        <Skeleton h={12} class="w-3/4" />
                        <Skeleton h={10} class="w-1/2" />
                    </div>
                </div>
            {/each}
        </Card.Content>
    </Card.Root>
</div>
