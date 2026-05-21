import type { DataOverrides, RawCategory } from '$lib/interfaces/Category';

export function applyLayerOverrides(
  rawCategories: RawCategory[],
  overrides: DataOverrides | undefined
): RawCategory[] {
  if (!overrides?.layers) return rawCategories;

  return rawCategories.map((rawCategory) => ({
    ...rawCategory,
    ...overrides.layers?.[rawCategory.id]
  }));
}
