import { dataCache } from '$lib/data/DataCache';
import { categoryVisibilityState } from '$lib/data/State.svelte';
import type { Category } from '$lib/interfaces/Category';
import type { Poi, PoiTag } from '$lib/interfaces/Poi';
import { FeatureGroup, LayerGroup, type Map as LeafletMap, Polygon } from 'leaflet';

const BASE_Z_INDEX = 400;

export class MapYearLayer {
  year: string;
  map: LeafletMap;
  rootGroup: LayerGroup<FeatureGroup<Polygon>>;
  categories: Category[] = [];
  pois: Poi[] = [];
  categoryLayers: Map<string, FeatureGroup<Polygon>> = new Map();

  _previousHighlightCategoryId: string | null = null;

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
    const paneName = `year-${this.year}-cat-${category.id}`;
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
        pane: `year-${this.year}-cat-${cat.id}`
      });

      this.categoryLayers.set(cat.fixed_id, group);

      if (categoryVisibilityState[cat.fixed_id]) {
        this.rootGroup.addLayer(group);
      }
    }

    for (const poi of this.pois) {
      if (poi.deleted_at) {
        console.debug(`POI was deleted: ${poi.id}`);
        continue;
      }

      if (!poi.category_id) {
        console.debug(`POI has no category: ${poi.id}`);
        continue;
      }

      const cat = this.categories.find((c) => c.id === poi.category_id.toString());
      if (!cat) {
        console.warn(`Map layer not found for POI: ${poi.name} (${poi.id})`);
        continue;
      }

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
          fillOpacity: cat.ground_layer ? 1 : 0.75,
          weight: 1,
          pane: `year-${this.year}-cat-${cat.id}`
        });
        polygon.bindPopup(popupData);
        group.addLayer(polygon);
      } else {
        console.warn(`POI type not implemented! ${poi.name} (${poi.id})`);
      }
    }
  }

  handleCategoryBorderChange(category_id: string | null): void {
    if (this._previousHighlightCategoryId && this._previousHighlightCategoryId !== category_id) {
      const oldHighlight = this.getCategoryGroup(this._previousHighlightCategoryId);
      if (!oldHighlight) return;

      oldHighlight.setStyle({
        weight: 1,
        color: '#333'
      });
    }

    if (!category_id) return;

    const group = this.getCategoryGroup(category_id);

    if (!group) return;

    group.setStyle({
      weight: 1.5,
      color: '#FFD54F'
    });

    this._previousHighlightCategoryId = category_id;
  }

  handleCategoryVisibility(category_id: string, visible: boolean): void {
    const group = this.getCategoryGroup(category_id);

    if (!group) return;

    if (visible) {
      if (!this.rootGroup.hasLayer(group)) this.rootGroup.addLayer(group);
    } else {
      if (this.rootGroup.hasLayer(group)) this.rootGroup.removeLayer(group);
    }
  }

  getCategoryGroup(category_id: string): FeatureGroup | undefined {
    return this.categoryLayers.get(category_id);
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
