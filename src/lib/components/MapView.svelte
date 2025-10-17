<script lang="ts">
	import { Map as LeafletMap, TileLayer } from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import { selectedYear } from '$lib/stores/MapState';
	import { MapYearLayer } from '$lib/MapYearLayer';

	let map: LeafletMap;
	let shownLayer: MapYearLayer;

	function createMap(container: HTMLElement) {
		map = new LeafletMap(container).setView([51.22793672757168, 5.0726501221594955], 18);

		new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 22,
			attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`
		}).addTo(map);

		subscribeToChanges();
	}

	function subscribeToChanges() {
		selectedYear.subscribe(async (year) => {
			if (!year) return;

			console.log(shownLayer);

			if (shownLayer) {
				shownLayer.remove();
			}

			shownLayer = new MapYearLayer(map, year);
			await shownLayer.load();
			// shownLayer = layer;
		});
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
