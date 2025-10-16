<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';
	import MapView from '$lib/components/MapView.svelte';
</script>

<div class="main">
	<Sidebar />
	<MapView />
</div>

<style>
	.main {
		display: grid;
		grid-template-columns: var(--sidebar-width) 1fr;
		overflow: hidden;
	}
</style>
