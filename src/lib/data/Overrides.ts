import type { DataOverrides, RawCategory } from '$lib/interfaces/Category';
import type { Poi } from '$lib/interfaces/Poi';

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

export function applyPoiOverrides(pois: Poi[], overrides: DataOverrides | undefined): Poi[] {
  if (!overrides?.pois) return pois;

  return pois.map((poi) => ({
    ...poi,
    ...overrides.pois?.[poi.id]
  }));
}
