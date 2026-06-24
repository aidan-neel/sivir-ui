export const INTENTS = ['primary', 'secondary', 'ghost', 'outline', 'destructive'] as const;
export type Intent = (typeof INTENTS)[number];

export const STATUSES = ['info', 'success', 'warning', 'error'] as const;
export type Status = (typeof STATUSES)[number];

export const SIZES = ['sm', 'md', 'lg'] as const;
export type Size = (typeof SIZES)[number];
