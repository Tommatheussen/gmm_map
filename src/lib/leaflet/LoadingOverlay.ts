import { DomUtil, Map } from 'leaflet';

interface LoadingOverlayInstance {
  el: HTMLDivElement;
}

declare module 'leaflet' {
  interface Map {
    _loadingOverlay?: LoadingOverlayInstance;
    _activeLoads?: number;
    _createLoadingOverlay(): LoadingOverlayInstance;
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
    overlay.style.cssText = `
			position: absolute;
      inset: 0;
			display: none;
			align-items: center;
			justify-content: center;
			background: rgba(0, 0, 0, 0.5);
			z-index: 9999;
			transition: opacity 300ms ease;
		`;

    const spinner = DomUtil.create('div', 'leaflet-loading-spinner', overlay);
    spinner.style.cssText = `
			border: 4px solid rgba(255,255,255,0.3);
			border-top-color: #FFFFFF;
			border-radius: 50%;
			width: 40px;
			height: 40px;
			animation: spin 1s linear infinite;
			margin-right: 10px;
		`;

    // Inject keyframes once
    if (!document.querySelector('style[data-leaflet-overlay-style]')) {
      const style = document.createElement('style');
      style.dataset.leafletOverlayStyle = 'true';
      style.textContent = `
				@keyframes spin { from {transform:rotate(0)} to {transform:rotate(360deg)} }
			`;
      document.head.appendChild(style);
    }

    this._loadingOverlay = { el: overlay };
    return this._loadingOverlay;
  },

  markLayerLoading(this: L.Map) {
    this._activeLoads = (this._activeLoads || 0) + 1;
    if (this._activeLoads === 1) this.showLoadingOverlay();
  },

  markLayerDone(this: L.Map) {
    if (!this._activeLoads) return;
    this._activeLoads = Math.max(0, this._activeLoads - 1);
    if (this._activeLoads === 0) this.hideLoadingOverlay();
  },

  showLoadingOverlay(this: L.Map) {
    const overlay = this._loadingOverlay?.el;
    if (!overlay) return;
    overlay.style.display = 'flex';
    overlay.style.opacity = '0';
    requestAnimationFrame(() => (overlay.style.opacity = '1'));
  },

  hideLoadingOverlay(this: L.Map) {
    const inst = this._loadingOverlay;
    if (!inst) return;
    inst.el.style.opacity = '0';
    setTimeout(() => {
      if ((this._activeLoads || 0) === 0) inst.el.style.display = 'none';
    }, 300);
  }
});

Map.addInitHook(function (this: Map) {
  this._createLoadingOverlay();
  this._activeLoads = 0;
});
