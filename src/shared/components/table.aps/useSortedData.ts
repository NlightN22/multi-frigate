import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc' | null;

function useSortedData<T, K extends keyof T>(items: T[], initialSortKey: K | null = null) {
    const [sortKey, setSortKey] = useState<K | null>(initialSortKey);
    const [sortDirection, setSortDirection] = useState<SortDirection>(null);

    const sortedItems = useMemo(() => {
        if (!sortKey) return items;
        return [...items].sort((a, b) => {
            if (a[sortKey] < b[sortKey]) return sortDirection === 'asc' ? -1 : 1;
            if (a[sortKey] > b[sortKey]) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [items, sortKey, sortDirection]);

    const requestSort = (key: K) => {
        if (key === sortKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    return { items: sortedItems, requestSort, sortKey, sortDirection };
}

export default useSortedData;