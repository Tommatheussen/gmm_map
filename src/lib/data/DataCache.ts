import type {
  CorrectedRawCategory,
  DataOverrides,
  RawCategory,
  YearCategory
} from '$lib/interfaces/Category';
import type { Poi } from '$lib/interfaces/Poi';
import { resolveCategory } from './Categories';

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
  ): CorrectedRawCategory[] {
    if (!overrides?.layers) return rawCategories as CorrectedRawCategory[];

    return rawCategories.map(
      (rawCategory) =>
        ({
          ...rawCategory,
          ...overrides.layers?.[rawCategory.id]
        }) as CorrectedRawCategory
    );
  }

  private convertCategories(rawCategories: CorrectedRawCategory[]): YearCategory[] {
    return rawCategories.map((rawCategory) => {
      const category = resolveCategory(rawCategory)!;

      return {
        ...category,
        id: rawCategory.id
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
