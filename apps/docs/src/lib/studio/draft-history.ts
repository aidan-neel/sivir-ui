import type { Theme } from '@sivir-ui/svelte/themes/theme';
import type { StudioDraft } from './theme-draft';

export type DraftSnapshot = {
    draft: StudioDraft;
    base: Theme;
};

export type DraftHistory = {
    past: DraftSnapshot[];
    future: DraftSnapshot[];
    present: DraftSnapshot;
};

const HISTORY_LIMIT = 100;

export function createHistory(present: DraftSnapshot): DraftHistory {
    return {
        past: [],
        future: [],
        present
    };
}

export function snapshotKey(snapshot: DraftSnapshot): string {
    return JSON.stringify(snapshot);
}

export function commitSnapshot(history: DraftHistory, next: DraftSnapshot): DraftHistory {
    if (snapshotKey(next) === snapshotKey(history.present)) {
        return history;
    }

    return {
        past: [...history.past, history.present].slice(-HISTORY_LIMIT),
        future: [],
        present: next
    };
}

export function undoHistory(history: DraftHistory): DraftHistory {
    const previous = history.past.at(-1);

    if (!previous) {
        return history;
    }

    return {
        past: history.past.slice(0, -1),
        future: [history.present, ...history.future],
        present: previous
    };
}

export function redoHistory(history: DraftHistory): DraftHistory {
    const [next, ...rest] = history.future;

    if (!next) {
        return history;
    }

    return {
        past: [...history.past, history.present],
        future: rest,
        present: next
    };
}
