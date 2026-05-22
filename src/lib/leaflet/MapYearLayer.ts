import '$lib/leaflet/MapYearLayer.css';

import { FIXED_ID_CATEGORY_REGISTRY } from '$lib/data/Categories';
import { dataCache } from '$lib/data/DataCache';
import type { Category, YearCategory } from '$lib/interfaces/Category';

import { FeatureGroup, LayerGroup, type Map as LeafletMap, Polygon } from 'leaflet';

import { categoryVisibilityState } from '$lib/data/State.svelte';
import type { Poi, PoiTag } from '$lib/interfaces/Poi';
import { dev } from '$app/environment';

const BASE_Z_INDEX = 400;

export class MapYearLayer {
  year: string;
  map: LeafletMap;
  rootGroup: LayerGroup<FeatureGroup<Polygon>>;
  categories: YearCategory[] = [];
  pois: Poi[] = [];
  categoryLayers: Map<number, FeatureGroup<Polygon>> = new Map();

  _previousHighlightFixedId: number | null = null;

  constructor(map: LeafletMap, year: string) {
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
    const paneName = `year-${this.year}-fixed-cat-${category.fixed_id}`;
    if (this.map.getPane(paneName) == undefined) {
      const pane = this.map.createPane(paneName);
      pane.dataset.year = this.year.toString();
      pane.style.zIndex = String(BASE_Z_INDEX + (category.z_index ?? 0));
    }
  }

  private _buildLayers() {
    this.rootGroup.clearLayers();
    this.categoryLayers.clear();

    for (const cat of this.categories) {
      this._ensureCategoryGroup(cat);
    }

    for (const poi of this.pois) {
      if (!poi.published) {
        continue;
      }

      if (poi.deleted_at) {
        console.debug(`POI was deleted: ${poi.id}`);
        continue;
      }

      const cat =
        poi.category_fixed_id !== undefined
          ? FIXED_ID_CATEGORY_REGISTRY[poi.category_fixed_id]
          : this.categories.find((category) => category.id === poi.category_id);

      if (!cat && !poi.category_id) {
        console.debug(`POI has no category: ${poi.id}`);
        continue;
      }
      if (!cat) {
        console.warn(`Map layer not found for POI: ${poi.name} (${poi.id})`);
        continue;
      }

      this._ensureCategoryGroup(cat);
      const group = this.getCategoryGroup(cat.fixed_id);
      if (!group) {
        console.error(
          `Category group not found, this should never happen! POI: ${poi.name} (${poi.id}), Category: ${cat.name} (${cat.fixed_id})`
        );
        continue;
      }

      let popupData = `
          <div class="popup-content">
        <h4 class="popup-title">
          ${cat.name.trim() == poi.name.trim() ? poi.name : cat.name + ' - ' + poi.name}
        </h4>
        `;

      if (poi.tags && poi.tags.length > 0) {
        popupData += this._createTags(poi.tags);
      }

      popupData += '</div>';

      if (poi.type === 'polygon') {
        const latlngs = poi.coordinates.map((c) => [c.lat, c.lng] as [number, number]);
        const polygon = new Polygon(latlngs, {
          color: '#333',
          fillColor: cat.color,
          fillOpacity: dev ? 0.75 : 1,
          weight: 1,
          pane: `year-${this.year}-fixed-cat-${cat.fixed_id}`
        });
        polygon.bindPopup(popupData);
        group.addLayer(polygon);
      } else {
        console.warn(`POI type not implemented! ${poi.name} (${poi.id})`);
      }
    }
  }

  private _ensureCategoryGroup(category: Category) {
    this._ensureMapPaneExists(category);

    if (this.categoryLayers.has(category.fixed_id)) return;

    const group = new FeatureGroup<Polygon>();
    this.categoryLayers.set(category.fixed_id, group);

    if (categoryVisibilityState[category.fixed_id] !== false) {
      this.rootGroup.addLayer(group);
    }
  }

  handleCategoryBorderChange(fixed_id: number | null): void {
    if (this._previousHighlightFixedId && this._previousHighlightFixedId !== fixed_id) {
      const oldHighlight = this.getCategoryGroup(this._previousHighlightFixedId);
      if (!oldHighlight) return;

      oldHighlight.setStyle({
        weight: 1,
        color: '#333'
      });
    }

    if (!fixed_id) return;

    const group = this.getCategoryGroup(fixed_id);

    if (!group) return;

    group.setStyle({
      weight: 2.5,
      color: '#FFFFFF'
    });

    this._previousHighlightFixedId = fixed_id;
  }

  handleCategoryVisibility(fixed_id: number, visible: boolean): void {
    const group = this.getCategoryGroup(fixed_id);

    if (!group) return;

    if (visible) {
      if (!this.rootGroup.hasLayer(group)) this.rootGroup.addLayer(group);
    } else {
      if (this.rootGroup.hasLayer(group)) this.rootGroup.removeLayer(group);
    }
  }

  getCategoryGroup(fixed_id: number): FeatureGroup | undefined {
    return this.categoryLayers.get(fixed_id);
  }

  remove() {
    this.rootGroup.removeFrom(this.map);
  }

  private _createTags(tags: PoiTag[]) {
    let content = `<div class="tags">`;

    tags.forEach((tag) => {
      content += `<span class="popup-tag">${tag.name}</span>`;
    });

    content += `</div>`;
    return content;
  }
}
