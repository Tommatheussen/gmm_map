import type { DataOverrides, RawCategory, YearCategory } from '$lib/interfaces/Category';
import type { Poi } from '$lib/interfaces/Poi';
import { CATEGORY_REGISTRY, resolveCategoryId } from './Categories';

interface YearData {
  categories: YearCategory[];
  pois: Poi[];
}

class DataCache {
  private cache: Map<string, YearData> = new Map();

  // Generic lazy loader
  private async loadYear(year: string): Promise<YearData> {
    if (this.cache.has(year)) return this.cache.get(year)!;

    const [rawCategories, pois, overrides] = await Promise.all([
      this.loadJSON<RawCategory[]>(`data/${year}/layers.json`),
      this.loadJSON<Poi[]>(`data/${year}/pois.json`),
      this.loadOptionalJSON<DataOverrides>(`data/${year}/overrides.json`)
    ]);

    const categories = this.applyLayerOverrides(rawCategories, overrides);
    const yearData: YearData = { categories: this.convertCategories(categories), pois };
    this.cache.set(year, yearData);
    return yearData;
  }

  private async loadJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    return res.json();
  }

  private async loadOptionalJSON<T>(url: string): Promise<T | undefined> {
    const res = await fetch(url);
    if (res.status === 404) return;
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    return res.json();
  }

  private applyLayerOverrides(
    rawCategories: RawCategory[],
    overrides: DataOverrides | undefined
  ): RawCategory[] {
    if (!overrides?.layers) return rawCategories;

    return rawCategories.map((rawCategory) => ({
      ...rawCategory,
      ...overrides.layers?.[rawCategory.id]
    }));
  }

  private convertCategories(rawCategories: RawCategory[]): YearCategory[] {
    return rawCategories.map((rawCategory) => {
      const categoryId = resolveCategoryId(rawCategory)!;
      const category = CATEGORY_REGISTRY[categoryId];

      return {
        id: rawCategory.id,
        category_id: categoryId,
        fixed_id: category.fixed_id,
        name: category.name,
        z_index: category.z_index,
        color: category.color,
        group_id: category.group_id,
        aliases: category.aliases ?? []
      };
    });
  }

  // Lazy accessors
  async categories(year: string): Promise<YearCategory[]> {
    return (await this.loadYear(year)).categories;
  }

  async pois(year: string): Promise<Poi[]> {
    return (await this.loadYear(year)).pois;
  }
}
export const dataCache = new DataCache();
