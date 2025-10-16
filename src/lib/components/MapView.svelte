<script lang="ts">
	import type { Map } from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import type { Attachment } from 'svelte/attachments';
  import { selectedYear } from '$lib/stores/MapState'

	let map: Map;

	async function createMap(container: HTMLElement) {
    console.debug("Element added, creating map")
		const L = (await import('leaflet')).default;

		map = L.map(container).setView([51.22793672757168, 5.0726501221594955], 18);

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 22,
			attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>`
		}).addTo(map);

    subscribeToChanges()
  }

  function subscribeToChanges() {
    selectedYear.subscribe(year => console.log(year))
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
