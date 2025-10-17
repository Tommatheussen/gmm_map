import type { Category } from './interfaces/category';
import type { Poi } from './interfaces/poi';

interface YearData {
  categories: Category[];
  pois: Poi[];
};

class DataCache {
  private cache: Map<number, YearData> = new Map();

  // Generic lazy loader
  private async loadYear(year: number): Promise<YearData> {
    if (this.cache.has(year)) return this.cache.get(year)!;

    const [categories, pois] = await Promise.all([
      this.loadJSON<Category[]>(`/data/${year}/layers.json`),
      this.loadJSON<Poi[]>(`/data/${year}/pois.json`),
    ]);

    const yearData: YearData = { categories, pois };
    this.cache.set(year, yearData);
    return yearData;
  }

  private async loadJSON<T>(url: string): Promise<T> {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    return res.json();
  }

  // Lazy accessors
  async categories(year: number): Promise<Category[]> {
    return (await this.loadYear(year)).categories;
  }

  async pois(year: number): Promise<Poi[]> {
    return (await this.loadYear(year)).pois;
  }

  // Optional: preload multiple years
  async preloadYears(years: number[]): Promise<void> {
    await Promise.all(years.map((y) => this.loadYear(y)));
  }
}

export const dataCache = new DataCache();
