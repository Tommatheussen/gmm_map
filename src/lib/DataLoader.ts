// import { mapData } from './stores/MapState';

export async function loadYears(): Promise<Record<string, object>> {
  const res = await fetch('/years.json');
  if (!res.ok) throw new Error('Failed to load years.json');
  const data = await res.json();
  return data;
}

export async function loadYearData(year: number): Promise<{ layers: any; pois: any }> {
  // check if already loaded
  // let cache: Record<number,
  //   { layers?: object[]; pois?: object[] }>;

  // mapData.subscribe(m => cache = m)();

  // if (cache[year]) return cache[year];

  const [layersRes, poisRes] = await Promise.all([
    fetch(`/map-data/${year}/layers.json`),
    fetch(`/map-data/${year}/pois.json`)
  ]);

  if (!layersRes.ok || !poisRes.ok) throw new Error(`Failed to load data for ${year}`);

  const [layers, pois] = await Promise.all([layersRes.json(), poisRes.json()]);

  const data = { layers, pois };

  // mapData.update(m => ({ ...m, [year]: data }));

  return data;
}
