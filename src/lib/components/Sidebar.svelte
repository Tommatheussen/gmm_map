<script lang="ts">
	import { years, mapState } from '$lib/stores/MapState';
	import Select from './Select.svelte';

	function setBaseYear(year: number | null) {
		mapState.setBaseLayer(year!);
	}

	function setCompareYear(year: number | null) {
		mapState.setCompareLayer(year);
	}
</script>

<aside class="sidebar">
	{$mapState.baseLayer}
	<fieldset>
		<legend>🗓 Base Year</legend>
		<Select
			options={$years}
			value={$mapState.baseLayer}
			onChange={setBaseYear}
			placeholder="Select base year"
		/>
		<p class="info-text">Select the main year you want to view on the map.</p>
	</fieldset>

	<fieldset>
		<legend>🔀 Compare</legend>
		<Select
			options={$years}
			value={$mapState.compareLayer}
			onChange={setCompareYear}
			placeholder="Select comparison year"
			clearOption
		/>
		<p class="info-text">
			Optionally select another year to compare with the base year. If no year is selected, only the
			base year will be visible.
		</p>
	</fieldset>
</aside>

<style>
	.sidebar {
		padding: 1rem;
		background-color: var(--bg-color);
		border-right: 1px solid #ddd;
	}

	fieldset {
		border: 1px solid #ddd;
		padding: 0.75rem;
		margin-bottom: 1rem;
		border-radius: 6px;
	}

	legend {
		font-weight: bold;
		font-size: x-large;
	}

	.info-text {
		font-size: 0.85rem;
		color: #555;
		margin-top: 0.3rem;
		font-style: italic;
	}
</style>
