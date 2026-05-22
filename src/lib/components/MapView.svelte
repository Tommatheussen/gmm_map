<script lang="ts">
  import { LatLng, LatLngBounds, Map as LeafletMap, TileLayer } from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import '$lib/leaflet/LoadingOverlay';
  import { MapYearLayer } from '$lib/leaflet/MapYearLayer';
  import { SplitviewControl } from '$lib/leaflet/SplitviewControl';
  import { layerCache } from '$lib/data/LayerCache';
  import { MAP_BOUNDS_NORTH_EAST, MAP_BOUNDS_SOUTH_WEST, MAP_CENTER } from '$lib/Config';
  import { appState } from '$lib/data/State.svelte';

  const splitControl: SplitviewControl = new SplitviewControl();
  let map: LeafletMap;
  let baseLayer: MapYearLayer | null;
  let compareLayer: MapYearLayer | null;

  function createMap(container: HTMLElement) {
    map = new LeafletMap(container, {
      center: new LatLng(MAP_CENTER),
      zoom: 18,
      maxZoom: 20,
      minZoom: 15,
      maxBounds: new LatLngBounds(MAP_BOUNDS_SOUTH_WEST, MAP_BOUNDS_NORTH_EAST)
    });

    new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`
    }).addTo(map);

    $effect(_handleBaseLayer);
    $effect(_handleCompareLayer);

    return () => {
      map.remove();
    };
  }

  function _handleBaseLayer() {
    // Base layer handling
    if (!appState.baseYear) return; // Only during Init

    if (baseLayer && map.hasLayer(baseLayer.rootGroup)) {
      baseLayer.remove();
    }

    if (compareLayer?.year === appState.baseYear) {
      baseLayer = compareLayer;
      splitControl.setBaseLayer(baseLayer);
      return;
    }

    layerCache.getYearLayer(map, appState.baseYear).then((layer) => {
      baseLayer = layer;

      splitControl.setBaseLayer(baseLayer);
    });
  }

  function _handleCompareLayer() {
    // Compare layer handling
    const compareYear = appState.baseYear === appState.compareYear ? null : appState.compareYear;

    if (compareLayer && compareLayer !== baseLayer && map.hasLayer(compareLayer.rootGroup)) {
      compareLayer.remove();
    }
    compareLayer = null;

    if (!compareYear) {
      splitControl.remove();
      return;
    }

    if (!splitControl.isAdded) {
      splitControl.addTo(map);
    }

    layerCache.getYearLayer(map, compareYear).then((layer) => {
      compareLayer = layer;

      splitControl.setCompareLayer(compareLayer);
    });
  }
</script>

<div {@attach createMap} class="map-container"></div>

<style>
  .map-container {
    width: 100%;
    height: 100%;
  }
</style>
