import type { YearCategory, RawCategory } from '$lib/interfaces/Category';
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

    const [rawCategories, pois] = await Promise.all([
      this.loadJSON<RawCategory[]>(`data/${year}/layers.json`),
      this.loadJSON<Poi[]>(`data/${year}/pois.json`)
    ]);

    const yearData: YearData = { categories: this.convertCategories(rawCategories, year), pois };
    this.cache.set(year, yearData);
    return yearData;
  }

  private async loadJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    return res.json();
  }

  private convertCategories(rawCategories: RawCategory[], year: string): YearCategory[] {
    return rawCategories.map((rawCategory) => {
      const categoryId = resolveCategoryId(rawCategory, year);
      const category = CATEGORY_REGISTRY[categoryId!];

      if (!category) {
        console.warn(
          `Unified category not found for ${year}/${rawCategory.id}: ${rawCategory.name}`
        );
      }

      return {
        id: rawCategory.id,
        category_id: categoryId ?? 'unmapped',
        fixed_id: category?.fixed_id ?? rawCategory.fixed_id,
        name: category?.name ?? rawCategory.name,
        z_index: category?.z_index ?? rawCategory.z_index,
        color: category?.color ?? rawCategory.color,
        group_id: category?.group_id,
        aliases: category?.aliases ?? []
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
