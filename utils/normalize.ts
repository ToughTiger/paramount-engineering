import { Category, Tag } from "../types";

export const toNumber = (v: unknown): number | undefined =>
    typeof v === 'number' ? v
        : (typeof v === 'string' ? Number(v) : undefined);

export const extractCategoryId = (category: any): number | undefined => {
    // supports: number | { id: number } | null
    if (category == null) return undefined;
    if (typeof category === 'number') return category;
    if (typeof category?.id === 'number') return category.id;
    if (typeof category?.id === 'string') return Number(category.id);
    return undefined;
};

export const extractTagIds = (tags: any): number[] => {
    if (!Array.isArray(tags)) return [];
    return tags
        .map(t => {
            // supports: number | { id } | { tagId } | { tag: { id } }
            if (typeof t === 'number') return t;
            if (typeof t?.id === 'number') return t.id;
            if (typeof t?.id === 'string') return Number(t.id);
            if (typeof t?.tagId === 'number') return t.tagId;
            if (typeof t?.tagId === 'string') return Number(t.tagId);
            if (typeof t?.tag?.id === 'number') return t.tag.id;
            if (typeof t?.tag?.id === 'string') return Number(t.tag.id);
            return undefined;
        })
        .filter((n): n is number => Number.isFinite(n));
};

export const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
    return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined)
    ) as Partial<T>;
}

export function getCategoryName(category: Category | undefined | null): string {
    if (!category) return "Uncategorized";
    return category.name;
  }

export function getTagNames(tags: Tag[] | undefined | null): string[] {
    if (!tags || !Array.isArray(tags)) return [];
    return tags.map(t => t.name);
}
