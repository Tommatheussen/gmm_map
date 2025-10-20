import { dataCache } from '$lib/DataCache';
import type { Category } from '$lib/interfaces/Category';
import type { Poi } from '$lib/interfaces/Poi';
import { FeatureGroup, LayerGroup, type Map as LeafletMap, Polygon } from 'leaflet';

const BASE_Z_INDEX = 400;
const GROUND_LAYERS = [44, 35, 20];

export class MapYearLayer {
  year: number;
  map: LeafletMap;
  rootGroup: LayerGroup<LayerGroup<Polygon>>;
  categories: Category[] = [];
  pois: Poi[] = [];
  categoryLayers: Map<number, LayerGroup<Polygon>> = new Map();
  visible: Map<number, boolean> = new Map();

  constructor(map: LeafletMap, year: number) {
    this.map = map;
    this.year = year;
    this.rootGroup = new LayerGroup();
    this.rootGroup.on('add', () => this.map.markLayerDone());
  }

  async init() {
    this.map.markLayerLoading();

    if (this.categories.length == 0 || this.pois.length == 0) {
      await this.load();
    }
    this.rootGroup.addTo(this.map);
  }

  private async load() {
    this.categories = await dataCache.categories(this.year);
    this.pois = await dataCache.pois(this.year);
    this._buildLayers();
  }

  private _ensureMapPaneExists(category: Category) {
    const paneName = `year-${this.year}-cat-${category.fixed_id}`;
    if (this.map.getPane(paneName) == undefined) {
      const pane = this.map.createPane(paneName);
      pane.dataset.year = this.year.toString();
      pane.style.zIndex = String(BASE_Z_INDEX + (category.z_index ?? 0));
    }
  }

  private _buildLayers() {
    this.rootGroup.clearLayers();

    for (const cat of this.categories) {
      this._ensureMapPaneExists(cat);

      const group = new FeatureGroup<Polygon>([], {
        pane: `year-${this.year}-cat-${cat.fixed_id}`
      });

      this.categoryLayers.set(cat.fixed_id, group);

      this.rootGroup.addLayer(group);
      this.visible.set(cat.fixed_id, true);
    }

    for (const poi of this.pois) {
      if (poi.deleted_at) {
        console.debug(`POI was deleted: ${poi.id}`);
        continue;
      }

      const cat = this.categories.find((c) => c.id === poi.category_id);
      if (!cat) {
        console.warn(`Map layer not found for POI: ${poi.name} (${poi.id})`);
        continue;
      }

      const group = this.categoryLayers.get(cat.fixed_id);
      if (!group) {
        console.error(
          `Category group not found, this should never happen! POI: ${poi.name} (${poi.id}), Category: ${cat.name} (${cat.id})`
        );
        continue;
      }

      if (!cat.color) {
        console.warn(`Category layer has no color set! ${cat.name} (${cat.id})`);
        cat.color = '#AAA';
      }

      if (poi.type === 'polygon') {
        const latlngs = poi.coordinates.map((c) => [c.lat, c.lng] as [number, number]);
        const polygon = new Polygon(latlngs, {
          color: '#333',
          fillColor: cat.color,
          fillOpacity: GROUND_LAYERS.includes(cat.fixed_id) ? 1 : 0.75,
          weight: 1,
          pane: `year-${this.year}-cat-${cat.fixed_id}`
        });
        polygon.bindPopup(`<strong>${poi.name}</strong>`);
        group.addLayer(polygon);
      } else {
        console.warn(`POI type not implemented! ${poi.name} (${poi.id})`);
      }
    }
  }

  toggleCategory(fixedId: number, show: boolean) {
    const layer = this.categoryLayers.get(fixedId);
    if (!layer) return;

    if (show) {
      this.rootGroup.addLayer(layer);
      this.visible.set(fixedId, true);
    } else {
      this.rootGroup.removeLayer(layer);
      this.visible.set(fixedId, false);
    }
  }

  getGroup(fixedId: number): LayerGroup | undefined {
    return this.categoryLayers.get(fixedId);
  }

  getRoot(): LayerGroup {
    return this.rootGroup;
  }

  remove() {
    this.rootGroup.removeFrom(this.map);
  }
}
