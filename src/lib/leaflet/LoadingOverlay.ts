import '$lib/leaflet/LoadingOverlay.css';

import { DomUtil, Map } from 'leaflet';

declare module 'leaflet' {
  interface Map {
    _loadingOverlay?: HTMLDivElement;
    _activeLoads?: number;
    _createLoadingOverlay(): void;
    markLayerLoading(): void;
    markLayerDone(): void;
    showLoadingOverlay(): void;
    hideLoadingOverlay(): void;
  }
}

Map.include({
  _createLoadingOverlay(this: Map) {
    if (this._loadingOverlay) return this._loadingOverlay;

    const overlay = DomUtil.create('div', 'leaflet-loading-overlay', this.getContainer());

    DomUtil.create('div', 'leaflet-loading-spinner', overlay);
    this._loadingOverlay = overlay;
  },

  markLayerLoading(this: Map) {
    this._activeLoads = (this._activeLoads || 0) + 1;
    if (this._activeLoads === 1) this.showLoadingOverlay();
  },

  markLayerDone(this: Map) {
    if (!this._activeLoads) return;
    this._activeLoads = Math.max(0, this._activeLoads - 1);
    if (this._activeLoads === 0) this.hideLoadingOverlay();
  },

  showLoadingOverlay(this: Map) {
    const overlay = this._loadingOverlay;
    if (!overlay) return;

    overlay.style.display = 'flex';
    overlay.style.opacity = '0';
    requestAnimationFrame(() => (overlay.style.opacity = '1'));
  },

  hideLoadingOverlay(this: Map) {
    const overlay = this._loadingOverlay;
    if (!overlay) return;
    overlay.style.opacity = '0';
    setTimeout(() => {
      if ((this._activeLoads || 0) === 0) overlay.style.display = 'none';
    }, 300);
  }
});

Map.addInitHook(function (this: Map) {
  this._createLoadingOverlay();
  this._activeLoads = 0;
});
