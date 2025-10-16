<script lang="ts">
	import Svelecte from 'svelecte';
	import { years, selectedYear } from '$lib/stores/MapState';
</script>

<aside class="sidebar">
	<h2>🗓 Map Year</h2>
	<Svelecte options={$years} bind:value={$selectedYear}></Svelecte>

	<!--
	<h2 class="text-lg font-semibold mb-2">Year</h2>
	<select bind:value={selectedYear} class="w-full p-1 border rounded">
		{#each years as year}
			<option value={year}>{year}</option>
		{/each}
	</select>

	<div class="mt-4">
		<h2 class="text-lg font-semibold mb-2">Options</h2>
		{#each options as opt}
			<label class="block mb-1">
				<input type="checkbox" bind:checked={opt.checked} />
				{opt.label}
			</label>
		{/each}
	</div> -->
</aside>

<style>
	.sidebar {
		background-color: #fff;
		border-right: 1px solid #ddd;
		padding: 1rem;
	}
</style>
