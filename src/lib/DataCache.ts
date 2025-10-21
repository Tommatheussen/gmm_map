import { CATEGORY_REGISTRY } from './data/Categories';
import type { Category, RawCategory } from './interfaces/Category';
import type { Poi } from './interfaces/Poi';

interface YearData {
  categories: Category[];
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

    const yearData: YearData = { categories: this.convertCategories(rawCategories), pois };
    this.cache.set(year, yearData);
    return yearData;
  }

  private async loadJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    return res.json();
  }

  private convertCategories(rawCategories: RawCategory[]): Category[] {
    const categories: Category[] = rawCategories.map((category) => {
      const unifiedCategory = CATEGORY_REGISTRY.get(category.fixed_id);

      if (!unifiedCategory) {
        console.warn(`Unified category not found for ID ${category.fixed_id}!`);
      }

      return {
        id: category.id,
        static_id: category.fixed_id,
        label: unifiedCategory?.name ?? category.name,
        z_index: unifiedCategory?.z_index ?? category.z_index,
        color: unifiedCategory?.color ?? category.color,
        ground_layer: unifiedCategory?.ground ?? false
      };
    });
    return categories;
  }

  // Lazy accessors
  async categories(year: string): Promise<Category[]> {
    return (await this.loadYear(year)).categories;
  }

  async pois(year: string): Promise<Poi[]> {
    return (await this.loadYear(year)).pois;
  }
}
export const dataCache = new DataCache();
