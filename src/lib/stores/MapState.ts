import { writable } from 'svelte/store';

// list of available years
export const years = writable<number[]>([]);

interface MapState {
  baseLayer: number | null;
  compareLayer: number | null; // null = single layer mode
}

function createMapStateStore() {
  const { subscribe, set, update } = writable<MapState>({
    baseLayer: null,
    compareLayer: null
  });

  return {
    subscribe,
    setBaseLayer: (layer: number) =>
      update(state => ({ ...state, baseLayer: layer })),
    setCompareLayer: (layer: number | null) =>
      update(state => ({ ...state, compareLayer: layer })),
    reset: () => set({ baseLayer: null, compareLayer: null })
  };
}

export const mapState = createMapStateStore();
