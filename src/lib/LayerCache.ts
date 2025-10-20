import type { Map as LeafletMap } from 'leaflet';

import { MapYearLayer } from './leaflet/MapYearLayer';

class LayerCache {
  private cache: Map<number, MapYearLayer> = new Map();

  async getYearLayer(map: LeafletMap, year: number): Promise<MapYearLayer> {
    if (!this.cache.has(year)) {
      const layer = new MapYearLayer(map, year);
      this.cache.set(year, layer);
    }
    const cacheLayer = this.cache.get(year)!;
    await cacheLayer.init();
    return cacheLayer;
  }
}
export const layerCache = new LayerCache();
