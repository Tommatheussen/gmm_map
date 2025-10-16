import { writable } from 'svelte/store';

// list of available years
export const years = writable<number[]>([]);

// currently selected year for map
export const selectedYear = writable<number | null>(null);

// compare mode
export const compareMode = writable(false);
export const compareFrom = writable<number | null>(null);
export const compareTo = writable<number | null>(null);

// cache for already loaded JSON files
export const mapData = writable<Record<
  number,
  { layers?: object[]; pois?: object[] }
>>({});
