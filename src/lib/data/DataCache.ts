import { CATEGORY_REGISTRY } from '$lib/data/Categories';
import type { Category, RawCategory } from '$lib/interfaces/Category';
import type { Poi } from '$lib/interfaces/Poi';

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
      const fixedCategory = CATEGORY_REGISTRY[category.fixed_id];

      if (!fixedCategory) {
        console.warn(`Unified category not found for ID ${category.fixed_id}!`);
      }

      return {
        id: category.id.toString(),
        fixed_id: category.fixed_id.toString(),
        name: fixedCategory?.name ?? category.name,
        z_index: fixedCategory?.z_index ?? category.z_index,
        color: fixedCategory?.color ?? category.color,
        ground_layer: fixedCategory?.ground_layer ?? false
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
