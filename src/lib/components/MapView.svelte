<script lang="ts">
	import { onMount } from 'svelte';
	let mapContainer: HTMLDivElement;

	onMount(() => {
		// Later: initialize Leaflet or Mapbox here
		console.log('Map container mounted:', mapContainer);
	});
</script>

<div bind:this={mapContainer} class="map-container">
	<p class="text-center text-gray-500 mt-10">🗺️ Map will go here</p>
</div>

<style>
	.map-container {
		background-color: #e5e7eb;
		width: 100%;
		height: 100%;
	}
</style>
