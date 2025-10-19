<script lang="ts">
  import { Map as LeafletMap, TileLayer } from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import { mapState } from '$lib/stores/MapState';
  import { MapYearLayer } from '$lib/MapYearLayer';
  import { SplitviewControl } from '$lib/SplitviewControl';
  import { layerCache } from '$lib/LayerCache';

  const splitControl: SplitviewControl = new SplitviewControl({
    position: 'topleft'
  });

  let map: LeafletMap;
  let baseLayer: MapYearLayer | null;
  let compareLayer: MapYearLayer | null;

  function createMap(container: HTMLElement) {
    map = new LeafletMap(container).setView([51.22793672757168, 5.072650122159495], 18);

    new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 22,
      attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`
    }).addTo(map);

    const unsubscribe = mapState.subscribe(async ({ baseLayer, compareLayer }) => {
      await updateLayers(baseLayer, compareLayer);
    });

    return () => {
      unsubscribe();
      map.remove();
    };
  }

  async function updateLayers(baseYear: number | null, compareYear: number | null) {
    if (!baseYear) return;
    if (baseYear == compareYear) return;

    const oldBaseYear = baseLayer?.year;
    const oldCompareYear = compareLayer?.year;

    splitControl.remove();

    if (baseLayer && oldBaseYear != baseYear) {
      baseLayer.remove();
      baseLayer = null;
    }
    if (!baseLayer) {
      baseLayer = await layerCache.getYearLayer(map, baseYear);
    }

    if (compareLayer && oldCompareYear != compareYear) {
      compareLayer.remove();
      compareLayer = null;
    }
    if (!compareLayer && compareYear) {
      compareLayer = await layerCache.getYearLayer(map, compareYear);
    }

    if (compareYear) {
      if (baseYear != oldBaseYear || compareYear != oldCompareYear) {
        splitControl.setLayers(compareLayer!, baseLayer!);
      }

      splitControl.addTo(map);
    }
  }
</script>

<div {@attach createMap} class="map-container"></div>

<style>
  .map-container {
    background-color: #e5e7eb;
    width: 100%;
    height: 100%;
  }
</style>
