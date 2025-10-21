import { Control, DomEvent, DomUtil, Map } from 'leaflet';

import type { MapYearLayer } from '$lib/leaflet/MapYearLayer';

export class SplitviewControl extends Control {
  private _map!: Map;
  private _leftLayerGroup?: MapYearLayer;
  private _rightLayerGroup?: MapYearLayer;
  private _divider?: HTMLElement;
  private _leftBadge?: HTMLElement;
  private _rightBadge?: HTMLElement;
  private _splitposition: number = 0.5; // 0–1 fraction of map width
  private _dragging = false;
  private _addedToMap = false;

  constructor(options?: { initialSplit?: number }) {
    super({ position: 'topleft' });
    this._splitposition = options?.initialSplit ?? 0.5;
  }

  get isAdded(): boolean {
    return this._addedToMap;
  }

  onAdd(map: Map) {
    if (!this._addedToMap) {
      this._map = map;
      this._initLayout();
      this._updateClipping();
      this._attachEvents();
      this._addedToMap = true;
    }
    return this._divider!;
  }

  onRemove() {
    this._detachEvents();
    this._divider?.remove();

    // Remove divider DOM element
    if (this._divider && this._divider.parentNode) {
      this._divider.parentNode.removeChild(this._divider);
      this._divider = undefined;
    }

    // Remove clip-path / clip from left and right year panes
    this._removeClipping();

    this._addedToMap = false;
  }

  setLayers(left: MapYearLayer, right: MapYearLayer) {
    this._leftLayerGroup = left;
    this._rightLayerGroup = right;
    this._updateClipping();
  }

  setBaseLayer(layer: MapYearLayer) {
    this._rightLayerGroup = layer;
    this._setRightBadgeContent();
    this._updateClipping();
  }

  setCompareLayer(layer: MapYearLayer) {
    this._leftLayerGroup = layer;
    this._setLeftBadgeContent();
    this._updateClipping();
  }

  setSplit(position: number) {
    this._splitposition = Math.min(Math.max(position, 0), 1);
    this._updateDivider();
    this._updateClipping();
  }

  private _setLeftBadgeContent() {
    if (!this._leftBadge) return;
    this._leftBadge.textContent = this._leftLayerGroup?.year ?? '';
  }

  private _setRightBadgeContent() {
    if (!this._rightBadge) return;
    this._rightBadge.textContent = this._rightLayerGroup?.year ?? '';
  }

  private _initLayout() {
    const div = DomUtil.create('div', 'leaflet-splitview-divider', this._map!.getContainer());
    const badges = DomUtil.create('div', 'leaflet-splitview-divider-badges', div);
    this._leftBadge = DomUtil.create('div', 'leaflet-splitview-divider-badge left', badges);
    this._setLeftBadgeContent();
    this._rightBadge = DomUtil.create('div', 'leaflet-splitview-divider-badge right', badges);
    this._setRightBadgeContent();

    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.bottom = '0';
    div.style.width = '3px';
    div.style.height = `${this._map!.getSize().y}px`;
    div.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    div.style.borderLeft = '1px solid rgba(0, 0, 0, 0.25)';
    div.style.borderRight = '1px solid rgba(0, 0, 0, 0.25)';
    div.style.cursor = 'ew-resize';
    div.style.background = '#fff';
    div.style.zIndex = '1000';
    div.style.marginLeft = '0';
    div.style.marginTop = '0';

    this._divider = div;
    this._updateDivider();
  }

  private _updateDivider() {
    if (!this._map || !this._divider) return;
    const mapSize = this._map.getSize();
    const x = mapSize.x * this._splitposition;
    const dividerOffset = this._divider.offsetWidth / 2; // Account for divider's own width
    this._divider.style.left = `${x - dividerOffset}px`;
  }

  private _attachEvents() {
    const divider = this._divider!;

    DomEvent.disableClickPropagation(divider);
    DomEvent.on(divider, 'mousedown', this._onMouseDown, this);
    this._map!.on('move zoom resize', this._updateClipping, this);
  }

  private _detachEvents() {
    const divider = this._divider!;
    DomEvent.off(divider, 'mousedown', this._onMouseDown, this);
    this._map!.off('move zoom resize', this._updateClipping, this);
  }

  private _onMouseDown() {
    this._dragging = true;
    DomEvent.on(this._map!.getContainer(), 'mousemove', this._onMouseMove, this);
    DomEvent.on(this._map!.getContainer(), 'mouseup', this._onMouseUp, this);
    this._map?.fire('splitstart');
  }

  private _onMouseMove(e: Event) {
    if (!this._map || !this._dragging) return;
    const rect = (this._map.getContainer() as HTMLElement).getBoundingClientRect();
    const pos = ((e as MouseEvent).clientX - rect.left) / rect.width;
    this.setSplit(pos);
    this._map.fire('splitmove', { position: pos });
  }

  private _onMouseUp() {
    this._dragging = false;
    DomEvent.off(this._map!.getContainer(), 'mousemove', this._onMouseMove, this);
    DomEvent.off(this._map!.getContainer(), 'mouseup', this._onMouseUp, this);
    this._map?.fire('splitend');
  }

  private _updateClipping() {
    if (!this._map) return;
    const NW = this._map.containerPointToLayerPoint([0, 0]);
    const SE = this._map.containerPointToLayerPoint(this._map.getSize());

    const clipX = (SE.x - NW.x) * this._splitposition;
    const clipContainerCoord = this._map.containerPointToLayerPoint([clipX, 0]);

    const clipLeft = `polygon(
      ${NW.x}px ${NW.y}px,
      ${clipContainerCoord.x}px ${NW.y}px,
      ${clipContainerCoord.x}px ${SE.y}px,
      ${NW.x}px ${SE.y}px
    )`;

    const clipRight = `polygon(
      ${clipContainerCoord.x}px ${NW.y}px,
      ${SE.x}px ${NW.y}px,
      ${SE.x}px ${SE.y}px,
      ${clipContainerCoord.x}px ${SE.y}px
    )`;

    this._clipPanes(this._leftLayerGroup, clipLeft);
    this._clipPanes(this._rightLayerGroup, clipRight);
  }

  private _clipPanes(group: MapYearLayer | undefined, clip: string) {
    if (!group) return;

    const map = this._map!;
    const panes = map.getPanes();

    for (const key in panes) {
      const pane = panes[key];
      if (!(pane instanceof HTMLElement)) continue;

      // Only touch panes belonging to this year's group
      if (pane.dataset.year !== group.year.toString()) continue;

      pane.style.clipPath = clip;
    }
  }

  private _removeClipping() {
    if (!this._map) return;

    const panes = this._map.getPanes();
    for (const pane of Object.values(panes)) {
      if (!(pane instanceof HTMLElement)) continue;

      pane.style.clipPath = '';
    }
  }
}
