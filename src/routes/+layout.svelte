<script lang="ts">
	import { APP_TITLE, APP_DESCRIPTION } from '$lib/Config';
	import { onMount } from 'svelte';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import { years, mapState } from '$lib/stores/MapState';

	async function loadYears(): Promise<Record<string, object>> {
		const res = await fetch('years.json');
		if (!res.ok) throw new Error('Failed to load years.json');
		const data = await res.json();
		return data;
	}

	onMount(async () => {
		try {
			const data = await loadYears();
			const availableYears = Object.keys(data)
				.map(Number)
				.sort((a, b) => a - b);
			years.set(availableYears);

			// set default to latest year
			mapState.setBaseLayer(Math.max(...availableYears));
		} catch (err) {
			console.error('Failed to load years.json', err);
		}
	});
	let { children } = $props();
</script>

<svelte:head>
	<title>{APP_TITLE}</title>
	<meta name="description" content={APP_DESCRIPTION} />
</svelte:head>

<div class="layout">
	<Header />
	{@render children()}
	<Footer />
</div>

<style>
	.layout {
		display: grid;
		grid-template-rows: var(--header-height) 1fr var(--footer-height);
		height: 100vh;
	}
</style>
